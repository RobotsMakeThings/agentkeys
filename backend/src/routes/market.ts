import { Router } from 'express';
import { Database } from '../models/Database';
import { SolanaService } from '../services/SolanaService';
import { CacheService } from '../services/CacheService';
import logger from '../utils/logger';

const router = Router();
const db = Database.getInstance();
const solanaService = new SolanaService();
const cacheService = new CacheService();

// GET /api/market/stats - Get overall market statistics
router.get('/stats', async (req, res) => {
    try {
        const cacheKey = 'market:stats';
        let cachedStats = await cacheService.get(cacheKey);
        
        if (cachedStats) {
            return res.json(cachedStats);
        }

        const statsResult = await db.query(`
            SELECT 
                COUNT(*) as total_agents,
                SUM(market_cap) as total_market_cap,
                SUM(total_keys) as total_keys,
                AVG(market_cap) as avg_market_cap,
                COUNT(DISTINCT creator_id) as total_creators
            FROM agents 
            WHERE is_active = true
        `);

        const holdersResult = await db.query(`
            SELECT COUNT(DISTINCT user_id) as total_holders
            FROM agent_holdings
            WHERE token_amount > 0
        `);

        const transactionResult = await db.query(`
            SELECT 
                COUNT(*) as total_transactions,
                SUM(CASE WHEN transaction_type = 'BUY' THEN sol_amount ELSE 0 END) as total_volume_bought,
                SUM(CASE WHEN transaction_type = 'SELL' THEN sol_amount ELSE 0 END) as total_volume_sold,
                COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as transactions_24h
            FROM transactions
            WHERE confirmed = true
        `);

        const stats = {
            ...statsResult.rows[0],
            ...holdersResult.rows[0],
            ...transactionResult.rows[0],
            total_volume: (parseFloat(transactionResult.rows[0].total_volume_bought || '0') + 
                          parseFloat(transactionResult.rows[0].total_volume_sold || '0')),
            updated_at: new Date().toISOString()
        };

        // Cache for 5 minutes
        await cacheService.set(cacheKey, stats, 300);
        
        res.json(stats);
    } catch (error) {
        logger.error('Error fetching market stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/market/trending - Get trending agents
router.get('/trending', async (req, res) => {
    try {
        const { timeframe = '24h', limit = 20 } = req.query;
        
        const cacheKey = `market:trending:${timeframe}:${limit}`;
        let cachedData = await cacheService.get(cacheKey);
        
        if (cachedData) {
            return res.json(cachedData);
        }

        let timeInterval;
        switch (timeframe) {
            case '1h':
                timeInterval = '1 hour';
                break;
            case '24h':
                timeInterval = '24 hours';
                break;
            case '7d':
                timeInterval = '7 days';
                break;
            default:
                timeInterval = '24 hours';
        }

        const result = await db.query(`
            SELECT 
                a.id, a.name, a.symbol, a.market_cap, a.total_keys,
                u.username as creator_username,
                COUNT(t.id) as transaction_count,
                SUM(CASE WHEN t.transaction_type = 'BUY' THEN t.sol_amount ELSE 0 END) as buy_volume,
                SUM(CASE WHEN t.transaction_type = 'SELL' THEN t.sol_amount ELSE 0 END) as sell_volume,
                (COUNT(t.id)::float / EXTRACT(EPOCH FROM INTERVAL '${timeInterval}') * 3600) as activity_score
            FROM agents a
            LEFT JOIN users u ON a.creator_id = u.id
            LEFT JOIN transactions t ON a.id = t.agent_id 
                AND t.created_at >= NOW() - INTERVAL '${timeInterval}'
                AND t.confirmed = true
            WHERE a.is_active = true
            GROUP BY a.id, a.name, a.symbol, a.market_cap, a.total_keys, u.username
            HAVING COUNT(t.id) > 0
            ORDER BY activity_score DESC, buy_volume DESC
            LIMIT $1
        `, [parseInt(limit as string)]);

        const trending = result.rows;

        // Cache for 2 minutes
        await cacheService.set(cacheKey, trending, 120);
        
        res.json(trending);
    } catch (error) {
        logger.error('Error fetching trending agents:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/market/recent-trades - Get recent trades across all agents
router.get('/recent-trades', async (req, res) => {
    try {
        const { limit = 50 } = req.query;

        const result = await db.query(`
            SELECT 
                t.*,
                a.name as agent_name,
                a.symbol as agent_symbol,
                u.username,
                u.wallet_address
            FROM transactions t
            JOIN agents a ON t.agent_id = a.id
            LEFT JOIN users u ON t.user_id = u.id
            WHERE t.confirmed = true
                AND t.transaction_type IN ('BUY', 'SELL')
            ORDER BY t.created_at DESC
            LIMIT $1
        `, [parseInt(limit as string)]);

        res.json(result.rows);
    } catch (error) {
        logger.error('Error fetching recent trades:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/market/calculate-buy-price - Calculate price for buying tokens
router.post('/calculate-buy-price', async (req, res) => {
    try {
        const { agent_id, amount } = req.body;

        if (!agent_id || !amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid agent_id or amount' });
        }

        // Get agent
        const agentResult = await db.query(
            'SELECT agent_address FROM agents WHERE id = $1 AND is_active = true',
            [agent_id]
        );

        if (agentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        const agentAddress = agentResult.rows[0].agent_address;
        const price = await solanaService.calculateBuyPrice(agentAddress, amount);

        res.json({
            agent_id,
            amount,
            price,
            price_per_token: price / amount
        });
    } catch (error) {
        logger.error('Error calculating buy price:', error);
        res.status(500).json({ error: 'Failed to calculate price' });
    }
});

// POST /api/market/calculate-sell-price - Calculate price for selling tokens
router.post('/calculate-sell-price', async (req, res) => {
    try {
        const { agent_id, amount } = req.body;

        if (!agent_id || !amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid agent_id or amount' });
        }

        // Get agent
        const agentResult = await db.query(
            'SELECT agent_address FROM agents WHERE id = $1 AND is_active = true',
            [agent_id]
        );

        if (agentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        const agentAddress = agentResult.rows[0].agent_address;
        const price = await solanaService.calculateSellPrice(agentAddress, amount);

        res.json({
            agent_id,
            amount,
            price,
            price_per_token: price / amount
        });
    } catch (error) {
        logger.error('Error calculating sell price:', error);
        res.status(500).json({ error: 'Failed to calculate price' });
    }
});

// GET /api/market/categories - Get agent categories with counts
router.get('/categories', async (req, res) => {
    try {
        const cacheKey = 'market:categories';
        let cachedData = await cacheService.get(cacheKey);
        
        if (cachedData) {
            return res.json(cachedData);
        }

        const result = await db.query(`
            SELECT 
                category,
                COUNT(*) as agent_count,
                SUM(market_cap) as total_market_cap,
                AVG(market_cap) as avg_market_cap
            FROM agents
            WHERE is_active = true
            GROUP BY category
            ORDER BY total_market_cap DESC
        `);

        const categories = result.rows;

        // Cache for 10 minutes
        await cacheService.set(cacheKey, categories, 600);
        
        res.json(categories);
    } catch (error) {
        logger.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;