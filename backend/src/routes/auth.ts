import { Router } from 'express';
import { Database } from '../models/Database';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { validateRequest } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import logger from '../utils/logger';

const router = Router();
const db = Database.getInstance();

// Validation schemas
const walletAuthSchema = Joi.object({
    wallet_address: Joi.string().length(44).required(),
    signature: Joi.string().required(),
    message: Joi.string().required()
});

const refreshTokenSchema = Joi.object({
    refresh_token: Joi.string().required()
});

// POST /api/auth/wallet - Authenticate with wallet signature
router.post('/wallet', validateRequest(walletAuthSchema), async (req, res) => {
    try {
        const { wallet_address, signature, message } = req.body;

        // TODO: Verify wallet signature
        // For demo, we'll skip signature verification
        
        // Find or create user
        let userResult = await db.query(
            'SELECT * FROM users WHERE wallet_address = $1',
            [wallet_address]
        );

        let user;
        if (userResult.rows.length === 0) {
            // Create new user
            const insertResult = await db.query(`
                INSERT INTO users (wallet_address, created_at, last_active)
                VALUES ($1, NOW(), NOW())
                RETURNING *
            `, [wallet_address]);
            user = insertResult.rows[0];
        } else {
            // Update last active
            await db.query(
                'UPDATE users SET last_active = NOW() WHERE id = $1',
                [userResult.rows[0].id]
            );
            user = userResult.rows[0];
        }

        // Generate JWT tokens
        const accessToken = jwt.sign(
            { id: user.id, wallet_address: user.wallet_address },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
        );

        res.json({
            message: 'Authentication successful',
            user: {
                id: user.id,
                wallet_address: user.wallet_address,
                username: user.username,
                created_at: user.created_at
            },
            tokens: {
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_in: process.env.JWT_EXPIRES_IN || '24h'
            }
        });

    } catch (error) {
        logger.error('Wallet authentication error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', validateRequest(refreshTokenSchema), async (req, res) => {
    try {
        const { refresh_token } = req.body;

        // Verify refresh token
        const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET!) as any;
        
        // Get user
        const userResult = await db.query(
            'SELECT * FROM users WHERE id = $1',
            [decoded.id]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        const user = userResult.rows[0];

        // Generate new access token
        const accessToken = jwt.sign(
            { id: user.id, wallet_address: user.wallet_address },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.json({
            access_token: accessToken,
            expires_in: process.env.JWT_EXPIRES_IN || '24h'
        });

    } catch (error) {
        logger.error('Token refresh error:', error);
        res.status(401).json({ error: 'Invalid refresh token' });
    }
});

// POST /api/auth/logout - Logout (client should discard tokens)
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        // Update last active time
        await db.query(
            'UPDATE users SET last_active = NOW() WHERE id = $1',
            [req.user.id]
        );

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        logger.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
});

// GET /api/auth/me - Get current user info
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT id, wallet_address, username, email, created_at, 
                   last_active, is_verified, profile_data
            FROM users WHERE id = $1
        `, [req.user.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        logger.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/auth/nonce - Get nonce for wallet signature
router.get('/nonce/:wallet', async (req, res) => {
    try {
        const { wallet } = req.params;
        
        // Generate a nonce message for the user to sign
        const nonce = Math.random().toString(36).substring(2, 15);
        const timestamp = Date.now();
        const message = `AgentKeys Login\nWallet: ${wallet}\nNonce: ${nonce}\nTime: ${timestamp}`;

        // In production, store nonce temporarily to verify later
        
        res.json({
            message,
            nonce,
            timestamp
        });
    } catch (error) {
        logger.error('Nonce generation error:', error);
        res.status(500).json({ error: 'Failed to generate nonce' });
    }
});

export default router;