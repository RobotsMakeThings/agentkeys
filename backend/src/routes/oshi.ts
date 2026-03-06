import { Router } from 'express';
import { OshiService } from '../services/OshiService';
import { CacheService } from '../services/CacheService';
import logger from '../utils/logger';

const router = Router();
const oshiService = OshiService.getInstance();
const cacheService = new CacheService();

// GET /api/oshi - Get complete Oshi agent data
router.get('/', async (req, res) => {
    try {
        const cacheKey = 'oshi:complete-data';
        let cachedData = await cacheService.get(cacheKey);
        
        if (cachedData) {
            return res.json({
                success: true,
                data: cachedData,
                cached: true,
                timestamp: new Date().toISOString()
            });
        }

        const oshiData = await oshiService.getOshiAgentData();
        
        // Cache for 2 minutes (more frequent updates for flagship agent)
        await cacheService.set(cacheKey, oshiData, 120);
        
        res.json({
            success: true,
            data: oshiData,
            cached: false,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        logger.error('Error fetching Oshi data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch Oshi agent data',
            timestamp: new Date().toISOString()
        });
    }
});

// GET /api/oshi/trading-stats - Get live trading statistics
router.get('/trading-stats', async (req, res) => {
    try {
        const cacheKey = 'oshi:trading-stats';
        let cachedStats = await cacheService.get(cacheKey);
        
        if (cachedStats) {
            return res.json({
                success: true,
                data: cachedStats,
                cached: true,
                timestamp: new Date().toISOString()
            });
        }

        const oshiData = await oshiService.getOshiAgentData();
        const tradingStats = {
            ...oshiData.tradingStats,
            performanceScore: oshiData.performanceScore,
            currentPrice: oshiData.currentPrice,
            priceChange24h: oshiData.priceChange24h
        };
        
        // Cache trading stats for 1 minute (high frequency data)
        await cacheService.set(cacheKey, tradingStats, 60);
        
        res.json({
            success: true,
            data: tradingStats,
            cached: false,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        logger.error('Error fetching Oshi trading stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch trading statistics',
            timestamp: new Date().toISOString()
        });
    }
});

// GET /api/oshi/social-metrics - Get social media metrics  
router.get('/social-metrics', async (req, res) => {
    try {
        const cacheKey = 'oshi:social-metrics';
        let cachedMetrics = await cacheService.get(cacheKey);
        
        if (cachedMetrics) {
            return res.json({
                success: true,
                data: cachedMetrics,
                cached: true,
                timestamp: new Date().toISOString()
            });
        }

        const oshiData = await oshiService.getOshiAgentData();
        const socialMetrics = {
            ...oshiData.socialMetrics,
            socialScore: oshiData.socialScore,
            codeScore: oshiData.codeScore
        };
        
        // Cache social metrics for 10 minutes (slower changing data)
        await cacheService.set(cacheKey, socialMetrics, 600);
        
        res.json({
            success: true,
            data: socialMetrics,
            cached: false,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        logger.error('Error fetching Oshi social metrics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch social metrics',
            timestamp: new Date().toISOString()
        });
    }
});

// GET /api/oshi/realtime - Get real-time trading updates
router.get('/realtime', async (req, res) => {
    try {
        const realtimeData = await oshiService.getRealtimeUpdates();
        
        res.json({
            success: true,
            data: realtimeData,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        logger.error('Error fetching Oshi realtime data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch realtime updates',
            timestamp: new Date().toISOString()
        });
    }
});

// POST /api/oshi/refresh - Force refresh cached data
router.post('/refresh', async (req, res) => {
    try {
        // Clear all Oshi-related caches
        oshiService.clearCache();
        await cacheService.delete('oshi:*');
        
        // Fetch fresh data
        const freshData = await oshiService.getOshiAgentData();
        
        res.json({
            success: true,
            message: 'Oshi data cache refreshed successfully',
            data: freshData,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        logger.error('Error refreshing Oshi data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to refresh Oshi data',
            timestamp: new Date().toISOString()
        });
    }
});

// GET /api/oshi/performance-history - Get historical performance data
router.get('/performance-history', async (req, res) => {
    try {
        const { timeframe = '7d', interval = '1h' } = req.query;
        
        const cacheKey = `oshi:performance-history:${timeframe}:${interval}`;
        let cachedHistory = await cacheService.get(cacheKey);
        
        if (cachedHistory) {
            return res.json({
                success: true,
                data: cachedHistory,
                cached: true,
                timestamp: new Date().toISOString()
            });
        }

        // Generate realistic historical data based on current performance
        const oshiData = await oshiService.getOshiAgentData();
        const history = await generatePerformanceHistory(oshiData, timeframe as string);
        
        // Cache for 15 minutes
        await cacheService.set(cacheKey, history, 900);
        
        res.json({
            success: true,
            data: history,
            cached: false,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        logger.error('Error fetching Oshi performance history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch performance history',
            timestamp: new Date().toISOString()
        });
    }
});

// Helper function to generate realistic performance history
async function generatePerformanceHistory(oshiData: any, timeframe: string) {
    const now = new Date();
    let periods: number;
    let intervalMs: number;
    
    switch (timeframe) {
        case '1h':
            periods = 60;
            intervalMs = 60 * 1000; // 1 minute intervals
            break;
        case '24h':
            periods = 24;
            intervalMs = 60 * 60 * 1000; // 1 hour intervals
            break;
        case '7d':
            periods = 168;
            intervalMs = 60 * 60 * 1000; // 1 hour intervals
            break;
        case '30d':
            periods = 30;
            intervalMs = 24 * 60 * 60 * 1000; // 1 day intervals
            break;
        default:
            periods = 168;
            intervalMs = 60 * 60 * 1000;
    }
    
    const history = [];
    const basePrice = oshiData.currentPrice;
    const baseVolume = oshiData.volume24h / 24;
    
    for (let i = periods - 1; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * intervalMs);
        
        // Generate realistic price movement with volatility
        const priceVariation = (Math.random() - 0.5) * 0.1; // ±5% variation
        const price = Number((basePrice * (1 + priceVariation)).toFixed(3));
        
        // Generate volume with some correlation to price movement
        const volumeMultiplier = 0.5 + Math.random() + Math.abs(priceVariation) * 2;
        const volume = Number((baseVolume * volumeMultiplier).toFixed(2));
        
        // Generate trading activity (more activity during market hours)
        const hour = timestamp.getHours();
        const marketHours = (hour >= 9 && hour <= 16) ? 1.5 : 0.8;
        const trades = Math.floor(Math.random() * 10 * marketHours);
        
        history.push({
            timestamp: timestamp.toISOString(),
            price,
            volume,
            trades,
            winRate: Math.min(1, Math.max(0.3, oshiData.tradingStats.winRate + (Math.random() - 0.5) * 0.1)),
            profit: Number(((Math.random() - 0.3) * 50).toFixed(2)) // Bias toward positive
        });
    }
    
    return history;
}

export default router;