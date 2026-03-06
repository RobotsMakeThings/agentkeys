import { Router } from 'express';
import { Database } from '../models/Database';
import { CacheService } from '../services/CacheService';
import { authenticateToken } from '../middleware/auth';
import logger from '../utils/logger';

const router = Router();
const db = Database.getInstance();
const cacheService = new CacheService();

// POST /api/analytics/event - Track analytics event
router.post('/event', async (req, res) => {
    try {
        const { event_type, data, agent_id, user_id } = req.body;

        if (!event_type || !data) {
            return res.status(400).json({ error: 'event_type and data are required' });
        }

        await db.query(`
            INSERT INTO analytics_events (event_type, user_id, agent_id, data, ip_address, user_agent)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [
            event_type,
            user_id || null,
            agent_id || null,
            JSON.stringify(data),
            req.ip,
            req.get('User-Agent')
        ]);

        res.json({ message: 'Event tracked successfully' });
    } catch (error) {
        logger.error('Error tracking analytics event:', error);
        res.status(500).json({ error: 'Failed to track event' });
    }
});

// GET /api/analytics/dashboard - Get dashboard analytics (admin only)
router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        // In production, add admin authorization check here
        
        const { timeframe = '7d' } = req.query;
        
        let timeInterval;
        switch (timeframe) {
            case '24h':
                timeInterval = '24 hours';
                break;
            case '7d':
                timeInterval = '7 days';
                break;
            case '30d':
                timeInterval = '30 days';
                break;
            default:
                timeInterval = '7 days';
        }

        const cacheKey = `analytics:dashboard:${timeframe}`;
        let cachedData = await cacheService.get(cacheKey);
        
        if (cachedData) {
            return res.json(cachedData);
        }

        // Get various analytics data
        const [
            userStats,
            agentStats,
            transactionStats,
            eventStats,
            topEvents
        ] = await Promise.all([
            // User statistics
            db.query(`
                SELECT 
                    COUNT(*) as total_users,
                    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '${timeInterval}' THEN 1 END) as new_users,
                    COUNT(CASE WHEN last_active >= NOW() - INTERVAL '24 hours' THEN 1 END) as active_users_24h,
                    COUNT(CASE WHEN last_active >= NOW() - INTERVAL '${timeInterval}' THEN 1 END) as active_users
                FROM users
            `),

            // Agent statistics
            db.query(`
                SELECT 
                    COUNT(*) as total_agents,
                    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '${timeInterval}' THEN 1 END) as new_agents,
                    AVG(market_cap) as avg_market_cap,
                    SUM(market_cap) as total_market_cap
                FROM agents
                WHERE is_active = true
            `),

            // Transaction statistics
            db.query(`
                SELECT 
                    COUNT(*) as total_transactions,
                    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '${timeInterval}' THEN 1 END) as recent_transactions,
                    SUM(CASE WHEN transaction_type = 'BUY' AND created_at >= NOW() - INTERVAL '${timeInterval}' THEN sol_amount ELSE 0 END) as buy_volume,
                    SUM(CASE WHEN transaction_type = 'SELL' AND created_at >= NOW() - INTERVAL '${timeInterval}' THEN sol_amount ELSE 0 END) as sell_volume
                FROM transactions
                WHERE confirmed = true
            `),

            // Event statistics
            db.query(`
                SELECT 
                    COUNT(*) as total_events,
                    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '${timeInterval}' THEN 1 END) as recent_events,
                    COUNT(DISTINCT user_id) as unique_users,
                    COUNT(DISTINCT ip_address) as unique_ips
                FROM analytics_events
            `),

            // Top events
            db.query(`
                SELECT 
                    event_type,
                    COUNT(*) as count
                FROM analytics_events
                WHERE created_at >= NOW() - INTERVAL '${timeInterval}'
                GROUP BY event_type
                ORDER BY count DESC
                LIMIT 10
            `)
        ]);

        const dashboard = {
            timeframe,
            users: userStats.rows[0],
            agents: agentStats.rows[0],
            transactions: transactionStats.rows[0],
            events: eventStats.rows[0],
            top_events: topEvents.rows,
            updated_at: new Date().toISOString()
        };

        // Cache for 5 minutes
        await cacheService.set(cacheKey, dashboard, 300);
        
        res.json(dashboard);
    } catch (error) {
        logger.error('Error fetching dashboard analytics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/analytics/agent/:id - Get analytics for specific agent
router.get('/agent/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { timeframe = '7d' } = req.query;

        let timeInterval;
        switch (timeframe) {
            case '24h':
                timeInterval = '24 hours';
                break;
            case '7d':
                timeInterval = '7 days';
                break;
            case '30d':
                timeInterval = '30 days';
                break;
            default:
                timeInterval = '7 days';
        }

        const cacheKey = `analytics:agent:${id}:${timeframe}`;
        let cachedData = await cacheService.get(cacheKey);
        
        if (cachedData) {
            return res.json(cachedData);
        }

        // Verify agent exists
        const agentResult = await db.query(
            'SELECT name, symbol FROM agents WHERE id = $1',
            [id]
        );

        if (agentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        const agent = agentResult.rows[0];

        const [
            transactionStats,
            holderStats,
            priceStats,
            eventStats,
            dailyActivity
        ] = await Promise.all([
            // Transaction statistics
            db.query(`
                SELECT 
                    COUNT(*) as total_transactions,
                    COUNT(CASE WHEN transaction_type = 'BUY' THEN 1 END) as buy_count,
                    COUNT(CASE WHEN transaction_type = 'SELL' THEN 1 END) as sell_count,
                    SUM(CASE WHEN transaction_type = 'BUY' THEN sol_amount ELSE 0 END) as buy_volume,
                    SUM(CASE WHEN transaction_type = 'SELL' THEN sol_amount ELSE 0 END) as sell_volume,
                    AVG(CASE WHEN transaction_type = 'BUY' THEN price_per_token END) as avg_buy_price,
                    AVG(CASE WHEN transaction_type = 'SELL' THEN price_per_token END) as avg_sell_price
                FROM transactions
                WHERE agent_id = $1 
                    AND confirmed = true 
                    AND created_at >= NOW() - INTERVAL '${timeInterval}'
            `, [id]),

            // Holder statistics
            db.query(`
                SELECT 
                    COUNT(*) as total_holders,
                    SUM(token_amount) as total_tokens_held,
                    AVG(token_amount) as avg_tokens_per_holder,
                    MAX(token_amount) as max_holding
                FROM agent_holdings
                WHERE agent_id = $1 AND token_amount > 0
            `, [id]),

            // Price statistics
            db.query(`
                SELECT 
                    MIN(price) as min_price,
                    MAX(price) as max_price,
                    AVG(price) as avg_price,
                    (SELECT price FROM price_history WHERE agent_id = $1 ORDER BY timestamp DESC LIMIT 1) as current_price,
                    (SELECT price FROM price_history WHERE agent_id = $1 AND timestamp <= NOW() - INTERVAL '${timeInterval}' ORDER BY timestamp DESC LIMIT 1) as price_start
                FROM price_history
                WHERE agent_id = $1 
                    AND timestamp >= NOW() - INTERVAL '${timeInterval}'
            `, [id]),

            // Event statistics
            db.query(`
                SELECT 
                    COUNT(*) as total_events,
                    COUNT(DISTINCT user_id) as unique_users
                FROM analytics_events
                WHERE agent_id = $1 
                    AND created_at >= NOW() - INTERVAL '${timeInterval}'
            `, [id]),

            // Daily activity
            db.query(`
                SELECT 
                    DATE(created_at) as date,
                    COUNT(*) as transaction_count,
                    SUM(CASE WHEN transaction_type = 'BUY' THEN sol_amount ELSE 0 END) as buy_volume,
                    SUM(CASE WHEN transaction_type = 'SELL' THEN sol_amount ELSE 0 END) as sell_volume
                FROM transactions
                WHERE agent_id = $1 
                    AND confirmed = true 
                    AND created_at >= NOW() - INTERVAL '${timeInterval}'
                GROUP BY DATE(created_at)
                ORDER BY date DESC
            `, [id])
        ]);

        const analytics = {
            agent,
            timeframe,
            transactions: transactionStats.rows[0],
            holders: holderStats.rows[0],
            price: priceStats.rows[0],
            events: eventStats.rows[0],
            daily_activity: dailyActivity.rows,
            updated_at: new Date().toISOString()
        };

        // Calculate price change percentage
        if (analytics.price.current_price && analytics.price.price_start) {
            analytics.price.price_change_percent = (
                (analytics.price.current_price - analytics.price.price_start) / 
                analytics.price.price_start * 100
            );
        }

        // Cache for 5 minutes
        await cacheService.set(cacheKey, analytics, 300);
        
        res.json(analytics);
    } catch (error) {
        logger.error('Error fetching agent analytics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;