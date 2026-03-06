import { Router } from 'express';
import { Database, Agent } from '../models/Database';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { SolanaService } from '../services/SolanaService';
import { CacheService } from '../services/CacheService';
import { OshiService } from '../services/OshiService';
import Joi from 'joi';
import logger from '../utils/logger';

const router = Router();
const db = Database.getInstance();
const solanaService = new SolanaService();
const cacheService = new CacheService();
const oshiService = OshiService.getInstance();

// Validation schemas
const createAgentSchema = Joi.object({
    name: Joi.string().min(1).max(32).required(),
    symbol: Joi.string().min(1).max(10).required(),
    description: Joi.string().max(500).optional(),
    category: Joi.string().valid(
        'Trading', 'Research', 'Development', 'Marketing', 
        'Design', 'Writing', 'Analysis', 'Automation', 
        'Education', 'Entertainment'
    ).required(),
    github_url: Joi.string().uri().optional(),
    twitter_handle: Joi.string().max(50).optional()
});

const buyKeysSchema = Joi.object({
    amount: Joi.number().positive().integer().required(),
    max_price: Joi.number().positive().optional()
});

const sellKeysSchema = Joi.object({
    amount: Joi.number().positive().integer().required(),
    min_price: Joi.number().positive().optional()
});

// GET /api/agents - List all agents with filters
router.get('/', async (req, res) => {
    try {
        const {
            category,
            creator,
            search,
            sort = 'created_at',
            order = 'desc',
            page = 1,
            limit = 20
        } = req.query;

        // Try cache first
        const cacheKey = `agents:${JSON.stringify(req.query)}`;
        let cachedResult = await cacheService.get(cacheKey);
        
        if (cachedResult) {
            return res.json(cachedResult);
        }

        let query = `
            SELECT a.*, u.username as creator_username, u.wallet_address as creator_wallet
            FROM agents a
            LEFT JOIN users u ON a.creator_id = u.id
            WHERE a.is_active = true
        `;
        const params: any[] = [];
        let paramIndex = 1;

        if (category) {
            query += ` AND a.category = $${paramIndex++}`;
            params.push(category);
        }

        if (creator) {
            query += ` AND (u.username ILIKE $${paramIndex++} OR u.wallet_address = $${paramIndex++})`;
            params.push(`%${creator}%`, creator);
            paramIndex++;
        }

        if (search) {
            query += ` AND (a.name ILIKE $${paramIndex++} OR a.description ILIKE $${paramIndex++})`;
            params.push(`%${search}%`, `%${search}%`);
            paramIndex++;
        }

        // Sorting
        const validSorts = ['created_at', 'market_cap', 'total_keys', 'total_holders'];
        const sortField = validSorts.includes(sort as string) ? sort : 'created_at';
        const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
        query += ` ORDER BY a.${sortField} ${sortOrder}`;

        // Pagination
        const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
        query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
        params.push(parseInt(limit as string), offset);

        const result = await db.query(query, params);
        
        // Inject Oshi data if not in database yet
        let agents = result.rows;
        const hasOshi = agents.some(agent => agent.name === 'Oshi' || agent.symbol === 'OSHI');
        
        if (!hasOshi) {
            try {
                const oshiData = await oshiService.getOshiAgentData();
                const oshiAgent = {
                    id: 'oshi-flagship',
                    agent_address: 'Agent111111111111111111111111111111111111111',
                    creator_id: 'oshi-team',
                    creator_username: 'oshi-team',
                    creator_wallet: 'Creator1111111111111111111111111111111111111',
                    name: oshiData.name,
                    symbol: oshiData.symbol,
                    description: oshiData.description,
                    category: oshiData.category,
                    github_url: oshiData.githubUrl,
                    twitter_handle: oshiData.twitterHandle,
                    token_mint: 'OshiMint1111111111111111111111111111111111',
                    total_keys: oshiData.totalKeys,
                    total_holders: oshiData.holders,
                    market_cap: oshiData.marketCap,
                    current_price: oshiData.currentPrice,
                    is_active: true,
                    created_at: oshiData.launchDate,
                    updated_at: new Date().toISOString(),
                    // Extended Oshi-specific data
                    code_score: oshiData.codeScore,
                    social_score: oshiData.socialScore,
                    agent_score: oshiData.agentScore,
                    performance_score: oshiData.performanceScore,
                    trading_stats: oshiData.tradingStats,
                    social_metrics: oshiData.socialMetrics,
                    volume_24h: oshiData.volume24h,
                    price_change_24h: oshiData.priceChange24h
                };
                
                // Insert Oshi at the top of results
                agents = [oshiAgent, ...agents];
            } catch (error) {
                logger.warn('Could not inject Oshi data into agents list:', error);
            }
        }
        
        // Get total count
        let countQuery = `
            SELECT COUNT(*) 
            FROM agents a 
            LEFT JOIN users u ON a.creator_id = u.id
            WHERE a.is_active = true
        `;
        const countParams = params.slice(0, -2); // Remove limit and offset
        
        if (category || creator || search) {
            // Rebuild count query with same filters
            let countParamIndex = 1;
            if (category) {
                countQuery += ` AND a.category = $${countParamIndex++}`;
            }
            if (creator) {
                countQuery += ` AND (u.username ILIKE $${countParamIndex++} OR u.wallet_address = $${countParamIndex++})`;
                countParamIndex++;
            }
            if (search) {
                countQuery += ` AND (a.name ILIKE $${countParamIndex++} OR a.description ILIKE $${countParamIndex++})`;
                countParamIndex++;
            }
        }

        const countResult = await db.query(countQuery, countParams);
        const totalCount = parseInt(countResult.rows[0].count);

        const response = {
            agents: agents,
            pagination: {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                total: totalCount,
                pages: Math.ceil(totalCount / parseInt(limit as string))
            }
        };

        // Cache for 5 minutes
        await cacheService.set(cacheKey, response, 300);
        
        res.json(response);
    } catch (error) {
        logger.error('Error fetching agents:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/agents/:id - Get specific agent
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Special handling for Oshi agent
        if (id === 'oshi-flagship' || id === 'oshi' || id === 'Agent111111111111111111111111111111111111111') {
            const cacheKey = `agent:oshi-flagship`;
            let cachedAgent = await cacheService.get(cacheKey);
            
            if (cachedAgent) {
                return res.json(cachedAgent);
            }

            try {
                const oshiData = await oshiService.getOshiAgentData();
                const oshiAgent = {
                    id: 'oshi-flagship',
                    agent_address: 'Agent111111111111111111111111111111111111111',
                    creator_id: 'oshi-team',
                    creator_username: 'oshi-team',
                    creator_wallet: 'Creator1111111111111111111111111111111111111',
                    name: oshiData.name,
                    symbol: oshiData.symbol,
                    description: oshiData.description,
                    category: oshiData.category,
                    github_url: oshiData.githubUrl,
                    twitter_handle: oshiData.twitterHandle,
                    token_mint: 'OshiMint1111111111111111111111111111111111',
                    total_keys: oshiData.totalKeys,
                    total_holders: oshiData.holders,
                    market_cap: oshiData.marketCap,
                    current_price: oshiData.currentPrice,
                    is_active: true,
                    created_at: oshiData.launchDate,
                    updated_at: new Date().toISOString(),
                    // Extended Oshi-specific data
                    code_score: oshiData.codeScore,
                    social_score: oshiData.socialScore,
                    agent_score: oshiData.agentScore,
                    performance_score: oshiData.performanceScore,
                    trading_stats: oshiData.tradingStats,
                    social_metrics: oshiData.socialMetrics,
                    volume_24h: oshiData.volume24h,
                    price_change_24h: oshiData.priceChange24h,
                    bonding_curve_progress: 0.45, // Based on current performance
                    total_fees: 0,
                    claimable_fees: 0,
                    total_claimed: 0
                };

                // Cache for 1 minute (frequent updates for flagship)
                await cacheService.set(cacheKey, oshiAgent, 60);
                
                return res.json(oshiAgent);
            } catch (error) {
                logger.error('Error fetching Oshi agent data:', error);
                return res.status(500).json({ error: 'Failed to fetch Oshi agent data' });
            }
        }
        
        // Standard database lookup for other agents
        const cacheKey = `agent:${id}`;
        let cachedAgent = await cacheService.get(cacheKey);
        
        if (cachedAgent) {
            return res.json(cachedAgent);
        }

        const result = await db.query(`
            SELECT a.*, u.username as creator_username, u.wallet_address as creator_wallet,
                   af.total_fees, af.claimable_fees, af.total_claimed
            FROM agents a
            LEFT JOIN users u ON a.creator_id = u.id
            LEFT JOIN agent_fees af ON a.id = af.agent_id
            WHERE a.id = $1 AND a.is_active = true
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        const agent = result.rows[0];
        
        // Get current on-chain price
        try {
            const onChainData = await solanaService.getAgentOnChainData(agent.agent_address);
            agent.current_price = onChainData.currentPrice;
            agent.bonding_curve_progress = onChainData.bondingCurveProgress;
        } catch (error) {
            logger.warn(`Could not fetch on-chain data for agent ${id}:`, error);
        }

        // Cache for 2 minutes
        await cacheService.set(cacheKey, agent, 120);
        
        res.json(agent);
    } catch (error) {
        logger.error('Error fetching agent:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/agents - Create new agent
router.post('/', authenticateToken, validateRequest(createAgentSchema), async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, symbol, description, category, github_url, twitter_handle } = req.body;

        // Check if user already has an agent with this name
        const existingAgent = await db.query(
            'SELECT id FROM agents WHERE creator_id = $1 AND name = $2',
            [userId, name]
        );

        if (existingAgent.rows.length > 0) {
            return res.status(400).json({ error: 'Agent name already exists for this creator' });
        }

        // Create agent on Solana
        const agentResult = await solanaService.createAgent({
            name,
            symbol,
            description: description || '',
            category,
            github_url,
            twitter_handle
        }, req.user.wallet_address);

        // Store in database
        const result = await db.query(`
            INSERT INTO agents (creator_id, agent_address, name, symbol, description, category, 
                              github_url, twitter_handle, token_mint, total_keys, total_holders)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `, [
            userId,
            agentResult.agentAddress,
            name,
            symbol,
            description,
            category,
            github_url,
            twitter_handle,
            agentResult.tokenMint,
            0,
            0
        ]);

        // Initialize agent fees
        await db.query(`
            INSERT INTO agent_fees (agent_id, creator_id, total_fees, claimable_fees, total_claimed)
            VALUES ($1, $2, 0, 0, 0)
        `, [result.rows[0].id, userId]);

        // Clear relevant caches
        await cacheService.delete('agents:*');

        res.status(201).json({
            message: 'Agent created successfully',
            agent: result.rows[0],
            transaction: agentResult.signature
        });

    } catch (error) {
        logger.error('Error creating agent:', error);
        if (error.message?.includes('name too long')) {
            return res.status(400).json({ error: 'Agent name is too long' });
        }
        res.status(500).json({ error: 'Failed to create agent' });
    }
});

// POST /api/agents/:id/buy - Buy agent keys
router.post('/:id/buy', authenticateToken, validateRequest(buyKeysSchema), async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, max_price } = req.body;
        const userId = req.user.id;

        // Get agent
        const agentResult = await db.query(
            'SELECT * FROM agents WHERE id = $1 AND is_active = true',
            [id]
        );

        if (agentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        const agent = agentResult.rows[0];

        // Execute purchase on Solana
        const purchaseResult = await solanaService.buyKeys(
            agent.agent_address,
            amount,
            req.user.wallet_address,
            max_price
        );

        // Record transaction
        await db.transaction(async (client) => {
            // Insert transaction
            await client.query(`
                INSERT INTO transactions (signature, user_id, agent_id, transaction_type, 
                                        token_amount, sol_amount, price_per_token, fees_paid)
                VALUES ($1, $2, $3, 'BUY', $4, $5, $6, $7)
            `, [
                purchaseResult.signature,
                userId,
                id,
                amount,
                purchaseResult.totalCost,
                purchaseResult.pricePerToken,
                purchaseResult.fees
            ]);

            // Update or insert user holdings
            await client.query(`
                INSERT INTO agent_holdings (user_id, agent_id, token_amount)
                VALUES ($1, $2, $3)
                ON CONFLICT (user_id, agent_id)
                DO UPDATE SET 
                    token_amount = agent_holdings.token_amount + $3,
                    last_updated = NOW()
            `, [userId, id, amount]);

            // Update agent stats
            await client.query(`
                UPDATE agents 
                SET total_keys = total_keys + $1,
                    market_cap = $2,
                    updated_at = NOW()
                WHERE id = $3
            `, [amount, purchaseResult.newMarketCap, id]);
        });

        // Clear caches
        await cacheService.delete(`agent:${id}`);
        await cacheService.delete(`user:${userId}:holdings`);

        res.json({
            message: 'Keys purchased successfully',
            transaction: purchaseResult.signature,
            amount_purchased: amount,
            total_cost: purchaseResult.totalCost,
            price_per_token: purchaseResult.pricePerToken
        });

    } catch (error) {
        logger.error('Error buying keys:', error);
        if (error.message?.includes('insufficient funds')) {
            return res.status(400).json({ error: 'Insufficient SOL balance' });
        }
        res.status(500).json({ error: 'Failed to purchase keys' });
    }
});

// POST /api/agents/:id/sell - Sell agent keys
router.post('/:id/sell', authenticateToken, validateRequest(sellKeysSchema), async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, min_price } = req.body;
        const userId = req.user.id;

        // Check user holdings
        const holdingResult = await db.query(
            'SELECT token_amount FROM agent_holdings WHERE user_id = $1 AND agent_id = $2',
            [userId, id]
        );

        if (holdingResult.rows.length === 0 || holdingResult.rows[0].token_amount < amount) {
            return res.status(400).json({ error: 'Insufficient keys to sell' });
        }

        // Get agent
        const agentResult = await db.query(
            'SELECT * FROM agents WHERE id = $1 AND is_active = true',
            [id]
        );

        const agent = agentResult.rows[0];

        // Execute sale on Solana
        const saleResult = await solanaService.sellKeys(
            agent.agent_address,
            amount,
            req.user.wallet_address,
            min_price
        );

        // Record transaction
        await db.transaction(async (client) => {
            // Insert transaction
            await client.query(`
                INSERT INTO transactions (signature, user_id, agent_id, transaction_type, 
                                        token_amount, sol_amount, price_per_token, fees_paid)
                VALUES ($1, $2, $3, 'SELL', $4, $5, $6, $7)
            `, [
                saleResult.signature,
                userId,
                id,
                amount,
                saleResult.totalProceeds,
                saleResult.pricePerToken,
                saleResult.fees
            ]);

            // Update user holdings
            await client.query(`
                UPDATE agent_holdings 
                SET token_amount = token_amount - $1,
                    last_updated = NOW()
                WHERE user_id = $2 AND agent_id = $3
            `, [amount, userId, id]);

            // Update agent stats
            await client.query(`
                UPDATE agents 
                SET total_keys = total_keys - $1,
                    market_cap = $2,
                    updated_at = NOW()
                WHERE id = $3
            `, [amount, saleResult.newMarketCap, id]);
        });

        // Clear caches
        await cacheService.delete(`agent:${id}`);
        await cacheService.delete(`user:${userId}:holdings`);

        res.json({
            message: 'Keys sold successfully',
            transaction: saleResult.signature,
            amount_sold: amount,
            total_proceeds: saleResult.totalProceeds,
            price_per_token: saleResult.pricePerToken
        });

    } catch (error) {
        logger.error('Error selling keys:', error);
        res.status(500).json({ error: 'Failed to sell keys' });
    }
});

// GET /api/agents/:id/price-history - Get price history
router.get('/:id/price-history', async (req, res) => {
    try {
        const { id } = req.params;
        const { timeframe = '24h', interval = '1h' } = req.query;

        const cacheKey = `price-history:${id}:${timeframe}:${interval}`;
        let cachedData = await cacheService.get(cacheKey);
        
        if (cachedData) {
            return res.json(cachedData);
        }

        // Calculate time range
        let timeRange: string;
        switch (timeframe) {
            case '1h':
                timeRange = '1 hour';
                break;
            case '24h':
                timeRange = '24 hours';
                break;
            case '7d':
                timeRange = '7 days';
                break;
            case '30d':
                timeRange = '30 days';
                break;
            default:
                timeRange = '24 hours';
        }

        const result = await db.query(`
            SELECT price, supply, market_cap, volume_24h, timestamp
            FROM price_history
            WHERE agent_id = $1 
                AND timestamp >= NOW() - INTERVAL '${timeRange}'
            ORDER BY timestamp ASC
        `, [id]);

        const priceHistory = result.rows;

        // Cache for 5 minutes
        await cacheService.set(cacheKey, priceHistory, 300);

        res.json(priceHistory);
    } catch (error) {
        logger.error('Error fetching price history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;