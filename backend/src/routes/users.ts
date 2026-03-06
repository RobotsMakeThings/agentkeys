import { Router } from 'express';
import { Database } from '../models/Database';
import { authenticateToken } from '../middleware/auth';
import { CacheService } from '../services/CacheService';
import logger from '../utils/logger';

const router = Router();
const db = Database.getInstance();
const cacheService = new CacheService();

// GET /api/users/me - Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const result = await db.query(`
            SELECT id, wallet_address, username, email, created_at, 
                   last_active, is_verified, profile_data, settings
            FROM users WHERE id = $1
        `, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        logger.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/users/me - Update user profile
router.put('/me', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email, profile_data, settings } = req.body;

        // Validate username uniqueness if provided
        if (username) {
            const existingUser = await db.query(
                'SELECT id FROM users WHERE username = $1 AND id != $2',
                [username, userId]
            );

            if (existingUser.rows.length > 0) {
                return res.status(400).json({ error: 'Username already taken' });
            }
        }

        const result = await db.query(`
            UPDATE users 
            SET username = COALESCE($2, username),
                email = COALESCE($3, email),
                profile_data = COALESCE($4, profile_data),
                settings = COALESCE($5, settings),
                last_active = NOW()
            WHERE id = $1
            RETURNING id, wallet_address, username, email, created_at, 
                     last_active, is_verified, profile_data, settings
        `, [userId, username, email, profile_data, settings]);

        res.json({
            message: 'Profile updated successfully',
            user: result.rows[0]
        });
    } catch (error) {
        logger.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/users/me/holdings - Get user's agent holdings
router.get('/me/holdings', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const cacheKey = `user:${userId}:holdings`;
        let cachedHoldings = await cacheService.get(cacheKey);
        
        if (cachedHoldings) {
            return res.json(cachedHoldings);
        }

        const result = await db.query(`
            SELECT ah.token_amount, ah.last_updated,
                   a.id as agent_id, a.name, a.symbol, a.agent_address,
                   a.market_cap, a.total_keys,
                   COALESCE(ph.price, 0) as current_price,
                   (ah.token_amount * COALESCE(ph.price, 0)) as position_value
            FROM agent_holdings ah
            JOIN agents a ON ah.agent_id = a.id
            LEFT JOIN LATERAL (
                SELECT price 
                FROM price_history 
                WHERE agent_id = a.id 
                ORDER BY timestamp DESC 
                LIMIT 1
            ) ph ON true
            WHERE ah.user_id = $1 AND ah.token_amount > 0
            ORDER BY position_value DESC
        `, [userId]);

        const holdings = result.rows;
        
        // Calculate total portfolio value
        const totalValue = holdings.reduce((sum, holding) => sum + (holding.position_value || 0), 0);
        
        const response = {
            total_value: totalValue,
            total_agents: holdings.length,
            holdings
        };

        // Cache for 2 minutes
        await cacheService.set(cacheKey, response, 120);

        res.json(response);
    } catch (error) {
        logger.error('Error fetching user holdings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/users/me/transactions - Get user's transaction history
router.get('/me/transactions', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20, type } = req.query;

        let query = `
            SELECT t.*, a.name as agent_name, a.symbol as agent_symbol
            FROM transactions t
            LEFT JOIN agents a ON t.agent_id = a.id
            WHERE t.user_id = $1
        `;
        const params = [userId];
        let paramIndex = 2;

        if (type && ['BUY', 'SELL', 'REWARD', 'FEE_CLAIM', 'AIRDROP'].includes(type as string)) {
            query += ` AND t.transaction_type = $${paramIndex++}`;
            params.push(type);
        }

        query += ` ORDER BY t.created_at DESC`;
        
        // Pagination
        const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
        query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
        params.push(parseInt(limit as string), offset);

        const result = await db.query(query, params);

        // Get total count
        let countQuery = `
            SELECT COUNT(*) FROM transactions WHERE user_id = $1
        `;
        const countParams = [userId];
        if (type) {
            countQuery += ` AND transaction_type = $2`;
            countParams.push(type);
        }

        const countResult = await db.query(countQuery, countParams);
        const totalCount = parseInt(countResult.rows[0].count);

        res.json({
            transactions: result.rows,
            pagination: {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                total: totalCount,
                pages: Math.ceil(totalCount / parseInt(limit as string))
            }
        });
    } catch (error) {
        logger.error('Error fetching user transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/users/me/agents - Get agents created by user
router.get('/me/agents', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await db.query(`
            SELECT a.*,
                   af.total_fees, af.claimable_fees, af.total_claimed,
                   COUNT(ah.user_id) as holder_count,
                   COALESCE(ph.price, 0) as current_price
            FROM agents a
            LEFT JOIN agent_fees af ON a.id = af.agent_id
            LEFT JOIN agent_holdings ah ON a.id = ah.agent_id AND ah.token_amount > 0
            LEFT JOIN LATERAL (
                SELECT price 
                FROM price_history 
                WHERE agent_id = a.id 
                ORDER BY timestamp DESC 
                LIMIT 1
            ) ph ON true
            WHERE a.creator_id = $1 AND a.is_active = true
            GROUP BY a.id, af.total_fees, af.claimable_fees, af.total_claimed, ph.price
            ORDER BY a.created_at DESC
        `, [userId]);

        res.json(result.rows);
    } catch (error) {
        logger.error('Error fetching user agents:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/users/me/agents/:id/claim-fees - Claim creator fees
router.post('/me/agents/:id/claim-fees', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id: agentId } = req.params;

        // Verify user owns this agent
        const agentResult = await db.query(
            'SELECT * FROM agents WHERE id = $1 AND creator_id = $2',
            [agentId, userId]
        );

        if (agentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Agent not found or unauthorized' });
        }

        // Get current fees
        const feeResult = await db.query(
            'SELECT * FROM agent_fees WHERE agent_id = $1',
            [agentId]
        );

        if (feeResult.rows.length === 0 || feeResult.rows[0].claimable_fees <= 0) {
            return res.status(400).json({ error: 'No fees available to claim' });
        }

        const fees = feeResult.rows[0];
        const minClaimAmount = 30_000_000; // 0.03 SOL in lamports

        if (fees.claimable_fees < minClaimAmount) {
            return res.status(400).json({ 
                error: 'Minimum claim amount is 0.03 SOL',
                current_claimable: fees.claimable_fees / 1e9,
                minimum_required: minClaimAmount / 1e9
            });
        }

        // TODO: Implement actual on-chain fee claim
        // For now, we'll simulate the claim
        
        await db.transaction(async (client) => {
            // Update fee records
            await client.query(`
                UPDATE agent_fees 
                SET claimable_fees = 0,
                    total_claimed = total_claimed + $1,
                    last_claimed_at = NOW()
                WHERE agent_id = $2
            `, [fees.claimable_fees, agentId]);

            // Record transaction
            await client.query(`
                INSERT INTO transactions (signature, user_id, agent_id, transaction_type, 
                                        sol_amount, created_at, confirmed)
                VALUES ($1, $2, $3, 'FEE_CLAIM', $4, NOW(), true)
            `, [
                'fee_claim_' + Date.now(), // Temporary signature
                userId,
                agentId,
                fees.claimable_fees
            ]);
        });

        res.json({
            message: 'Fees claimed successfully',
            amount_claimed: fees.claimable_fees / 1e9, // Convert to SOL
            total_claimed: (fees.total_claimed + fees.claimable_fees) / 1e9
        });

    } catch (error) {
        logger.error('Error claiming fees:', error);
        res.status(500).json({ error: 'Failed to claim fees' });
    }
});

// GET /api/users/me/notifications - Get user notifications
router.get('/me/notifications', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { unread_only = false, page = 1, limit = 50 } = req.query;

        let query = `
            SELECT * FROM notifications 
            WHERE user_id = $1 
            AND (expires_at IS NULL OR expires_at > NOW())
        `;
        const params = [userId];
        let paramIndex = 2;

        if (unread_only === 'true') {
            query += ` AND read = false`;
        }

        query += ` ORDER BY created_at DESC`;

        // Pagination
        const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
        query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
        params.push(parseInt(limit as string), offset);

        const result = await db.query(query, params);

        res.json(result.rows);
    } catch (error) {
        logger.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/users/me/notifications/:id/read - Mark notification as read
router.put('/me/notifications/:id/read', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const result = await db.query(`
            UPDATE notifications 
            SET read = true 
            WHERE id = $1 AND user_id = $2
            RETURNING *
        `, [id, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        logger.error('Error updating notification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/users/leaderboard - Get top users by portfolio value
router.get('/leaderboard', async (req, res) => {
    try {
        const { limit = 50 } = req.query;

        const cacheKey = `leaderboard:${limit}`;
        let cachedData = await cacheService.get(cacheKey);
        
        if (cachedData) {
            return res.json(cachedData);
        }

        const result = await db.query(`
            SELECT 
                u.id, u.username, u.wallet_address,
                COUNT(DISTINCT ah.agent_id) as agents_held,
                SUM(ah.token_amount * COALESCE(ph.price, 0)) as portfolio_value,
                SUM(ah.token_amount) as total_keys_held
            FROM users u
            JOIN agent_holdings ah ON u.id = ah.user_id
            LEFT JOIN LATERAL (
                SELECT price 
                FROM price_history 
                WHERE agent_id = ah.agent_id 
                ORDER BY timestamp DESC 
                LIMIT 1
            ) ph ON true
            WHERE ah.token_amount > 0
            GROUP BY u.id, u.username, u.wallet_address
            HAVING SUM(ah.token_amount * COALESCE(ph.price, 0)) > 0
            ORDER BY portfolio_value DESC
            LIMIT $1
        `, [parseInt(limit as string)]);

        const leaderboard = result.rows;

        // Cache for 10 minutes
        await cacheService.set(cacheKey, leaderboard, 600);

        res.json(leaderboard);
    } catch (error) {
        logger.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;