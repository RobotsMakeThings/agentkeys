import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import services
import { Database } from './models/Database';
import { WebSocketService } from './services/WebSocketService';
import { CacheService } from './services/CacheService';

// Import routes
import agentRoutes from './routes/agents';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import marketRoutes from './routes/market';
import analyticsRoutes from './routes/analytics';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

// Import utilities
import logger from './utils/logger';

// Load environment variables
dotenv.config();

class AgentKeysServer {
    private app: express.Application;
    private server: http.Server;
    private db: Database;
    private wsService: WebSocketService;
    private cacheService: CacheService;
    private port: number;

    constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT || '3001');
        
        // Initialize services
        this.db = Database.getInstance();
        this.cacheService = new CacheService();
        
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
        
        // Create HTTP server
        this.server = http.createServer(this.app);
        
        // Initialize WebSocket service
        this.wsService = new WebSocketService(this.server);
    }

    private setupMiddleware() {
        // Security middleware
        this.app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                    connectSrc: ["'self'", "wss:", "ws:"],
                }
            },
            crossOriginEmbedderPolicy: false
        }));

        // CORS configuration
        this.app.use(cors({
            origin: process.env.NODE_ENV === 'production' 
                ? ['https://agentkeys.xyz', 'https://www.agentkeys.xyz']
                : ['http://localhost:3000', 'http://localhost:3001'],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
        }));

        // Rate limiting
        const limiter = rateLimit({
            windowMs: parseInt(process.env.API_RATE_WINDOW || '900000'), // 15 minutes
            max: parseInt(process.env.API_RATE_LIMIT || '1000'), // per window
            message: 'Too many requests from this IP',
            standardHeaders: true,
            legacyHeaders: false,
        });
        this.app.use('/api/', limiter);

        // Compression and parsing
        this.app.use(compression());
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Request logging
        this.app.use(morgan('combined', {
            stream: { write: (message: string) => logger.info(message.trim()) }
        }));
        this.app.use(requestLogger);

        // Health check endpoint (before rate limiting)
        this.app.get('/health', async (req, res) => {
            try {
                const dbHealthQuery = await this.db.query('SELECT 1');
                const redisHealth = await this.db.getRedis().ping();
                
                res.json({
                    status: 'healthy',
                    timestamp: new Date().toISOString(),
                    version: process.env.npm_package_version || '1.0.0',
                    services: {
                        database: dbHealthQuery.rows.length > 0 ? 'healthy' : 'unhealthy',
                        redis: redisHealth === 'PONG' ? 'healthy' : 'unhealthy',
                        websocket: this.wsService ? 'healthy' : 'unhealthy'
                    },
                    connections: {
                        websocket: this.wsService?.getConnectionCount() || 0
                    }
                });
            } catch (error) {
                logger.error('Health check failed:', error);
                res.status(503).json({
                    status: 'unhealthy',
                    error: 'Service check failed'
                });
            }
        });
    }

    private setupRoutes() {
        // API routes
        this.app.use('/api/agents', agentRoutes);
        this.app.use('/api/users', userRoutes);
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/market', marketRoutes);
        this.app.use('/api/analytics', analyticsRoutes);

        // API documentation endpoint
        this.app.get('/api', (req, res) => {
            res.json({
                name: 'AgentKeys API',
                version: '1.0.0',
                description: 'Production API for AgentKeys platform',
                endpoints: {
                    agents: '/api/agents',
                    users: '/api/users',
                    auth: '/api/auth',
                    market: '/api/market',
                    analytics: '/api/analytics'
                },
                websocket: '/ws',
                documentation: '/api/docs'
            });
        });

        // Catch-all for undefined routes
        this.app.all('/api/*', (req, res) => {
            res.status(404).json({
                error: 'API endpoint not found',
                path: req.path,
                method: req.method
            });
        });
    }

    private setupErrorHandling() {
        // Global error handler
        this.app.use(errorHandler);

        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', error);
            this.gracefulShutdown('uncaughtException');
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
            this.gracefulShutdown('unhandledRejection');
        });

        // Handle SIGTERM (Docker, PM2, etc.)
        process.on('SIGTERM', () => {
            logger.info('SIGTERM received');
            this.gracefulShutdown('SIGTERM');
        });

        // Handle SIGINT (Ctrl+C)
        process.on('SIGINT', () => {
            logger.info('SIGINT received');
            this.gracefulShutdown('SIGINT');
        });
    }

    public async start(): Promise<void> {
        try {
            // Start the server
            this.server.listen(this.port, () => {
                logger.info(`AgentKeys API server started on port ${this.port}`);
                logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
                logger.info(`WebSocket server running on same port`);
                
                if (process.env.NODE_ENV === 'development') {
                    logger.info(`API Documentation: http://localhost:${this.port}/api`);
                    logger.info(`Health Check: http://localhost:${this.port}/health`);
                }
            });

            // Initialize periodic tasks
            this.startPeriodicTasks();

        } catch (error) {
            logger.error('Failed to start server:', error);
            process.exit(1);
        }
    }

    private startPeriodicTasks() {
        // Clean up old price history data (keep only 30 days)
        setInterval(async () => {
            try {
                await this.db.query(`
                    DELETE FROM price_history 
                    WHERE timestamp < NOW() - INTERVAL '30 days'
                `);
                logger.info('Cleaned up old price history data');
            } catch (error) {
                logger.error('Error cleaning up price history:', error);
            }
        }, 24 * 60 * 60 * 1000); // Daily cleanup

        // Clean up expired notifications
        setInterval(async () => {
            try {
                await this.db.query(`
                    DELETE FROM notifications 
                    WHERE expires_at < NOW()
                `);
                logger.info('Cleaned up expired notifications');
            } catch (error) {
                logger.error('Error cleaning up notifications:', error);
            }
        }, 60 * 60 * 1000); // Hourly cleanup

        // Update agent statistics
        setInterval(async () => {
            try {
                await this.db.query(`
                    UPDATE agents 
                    SET total_holders = (
                        SELECT COUNT(DISTINCT user_id) 
                        FROM agent_holdings 
                        WHERE agent_id = agents.id AND token_amount > 0
                    )
                `);
                logger.info('Updated agent holder counts');
            } catch (error) {
                logger.error('Error updating agent statistics:', error);
            }
        }, 5 * 60 * 1000); // Every 5 minutes
    }

    private async gracefulShutdown(reason: string): Promise<void> {
        logger.info(`Graceful shutdown initiated: ${reason}`);

        try {
            // Close WebSocket server
            if (this.wsService) {
                this.wsService.close();
                logger.info('WebSocket server closed');
            }

            // Close HTTP server
            this.server.close(async () => {
                logger.info('HTTP server closed');

                try {
                    // Close database connections
                    await this.db.close();
                    logger.info('Database connections closed');

                    logger.info('Graceful shutdown completed');
                    process.exit(0);
                } catch (error) {
                    logger.error('Error during database shutdown:', error);
                    process.exit(1);
                }
            });

            // Force close after 10 seconds
            setTimeout(() => {
                logger.error('Graceful shutdown timeout, forcing exit');
                process.exit(1);
            }, 10000);

        } catch (error) {
            logger.error('Error during graceful shutdown:', error);
            process.exit(1);
        }
    }
}

// Create and start server
const server = new AgentKeysServer();
server.start().catch((error) => {
    logger.error('Failed to start AgentKeys server:', error);
    process.exit(1);
});