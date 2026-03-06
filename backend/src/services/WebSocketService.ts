import WebSocket from 'ws';
import { Server } from 'http';
import { Database } from '../models/Database';
import { SolanaService } from './SolanaService';
import { CacheService } from './CacheService';
import { OshiService } from './OshiService';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

export interface WebSocketMessage {
    type: string;
    data?: any;
    error?: string;
    requestId?: string;
}

export interface AuthenticatedWebSocket extends WebSocket {
    userId?: string;
    isAlive?: boolean;
    subscriptions?: Set<string>;
}

export class WebSocketService {
    private wss: WebSocket.Server;
    private db: Database;
    private solanaService: SolanaService;
    private cacheService: CacheService;
    private oshiService: OshiService;
    private subscriptions: Map<string, Set<AuthenticatedWebSocket>> = new Map();
    private priceUpdateInterval: NodeJS.Timeout;
    private heartbeatInterval: NodeJS.Timeout;

    constructor(server: Server) {
        this.db = Database.getInstance();
        this.solanaService = new SolanaService();
        this.cacheService = new CacheService();
        this.oshiService = OshiService.getInstance();

        // Initialize WebSocket server
        this.wss = new WebSocket.Server({ 
            server,
            path: '/ws',
            maxPayload: 1024 * 1024 // 1MB max message size
        });

        this.setupWebSocketHandlers();
        this.startPriceUpdateBroadcast();
        this.startHeartbeat();
        
        logger.info('WebSocket service initialized');
    }

    private setupWebSocketHandlers() {
        this.wss.on('connection', (ws: AuthenticatedWebSocket, req) => {
            ws.isAlive = true;
            ws.subscriptions = new Set();

            // Handle authentication
            this.authenticateConnection(ws, req);

            // Handle messages
            ws.on('message', async (data: Buffer) => {
                try {
                    const message: WebSocketMessage = JSON.parse(data.toString());
                    await this.handleMessage(ws, message);
                } catch (error) {
                    this.sendError(ws, 'Invalid message format', undefined, error);
                }
            });

            // Handle pong responses for heartbeat
            ws.on('pong', () => {
                ws.isAlive = true;
            });

            // Handle connection close
            ws.on('close', () => {
                this.handleDisconnection(ws);
            });

            // Send welcome message
            this.sendMessage(ws, {
                type: 'connected',
                data: {
                    timestamp: new Date().toISOString(),
                    server: 'AgentKeys WebSocket Server'
                }
            });

            logger.info(`WebSocket connection established. Total connections: ${this.wss.clients.size}`);
        });

        this.wss.on('error', (error) => {
            logger.error('WebSocket server error:', error);
        });
    }

    private async authenticateConnection(ws: AuthenticatedWebSocket, req: any) {
        try {
            const token = req.url?.split('token=')[1]?.split('&')[0];
            
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
                ws.userId = decoded.id;
                
                logger.info(`WebSocket authenticated for user: ${ws.userId}`);
                
                this.sendMessage(ws, {
                    type: 'authenticated',
                    data: { userId: ws.userId }
                });
            }
        } catch (error) {
            logger.warn('WebSocket authentication failed:', error);
            // Allow unauthenticated connections for public data
        }
    }

    private async handleMessage(ws: AuthenticatedWebSocket, message: WebSocketMessage) {
        const { type, data, requestId } = message;

        try {
            switch (type) {
                case 'subscribe':
                    await this.handleSubscribe(ws, data, requestId);
                    break;

                case 'unsubscribe':
                    await this.handleUnsubscribe(ws, data, requestId);
                    break;

                case 'get_agent_price':
                    await this.handleGetAgentPrice(ws, data, requestId);
                    break;

                case 'get_portfolio':
                    await this.handleGetPortfolio(ws, data, requestId);
                    break;

                case 'get_recent_trades':
                    await this.handleGetRecentTrades(ws, data, requestId);
                    break;

                case 'get_oshi_realtime':
                    await this.handleGetOshiRealtime(ws, data, requestId);
                    break;

                case 'ping':
                    this.sendMessage(ws, { type: 'pong', requestId });
                    break;

                default:
                    this.sendError(ws, `Unknown message type: ${type}`, requestId);
            }
        } catch (error) {
            this.sendError(ws, 'Error processing message', requestId, error);
        }
    }

    private async handleSubscribe(ws: AuthenticatedWebSocket, data: any, requestId?: string) {
        const { channel } = data;

        if (!channel) {
            return this.sendError(ws, 'Channel is required for subscription', requestId);
        }

        // Add to subscriptions
        if (!this.subscriptions.has(channel)) {
            this.subscriptions.set(channel, new Set());
        }
        this.subscriptions.get(channel)!.add(ws);
        ws.subscriptions?.add(channel);

        logger.info(`Client subscribed to channel: ${channel}`);

        this.sendMessage(ws, {
            type: 'subscribed',
            data: { channel },
            requestId
        });

        // Send initial data for the channel
        await this.sendInitialChannelData(ws, channel);
    }

    private async handleUnsubscribe(ws: AuthenticatedWebSocket, data: any, requestId?: string) {
        const { channel } = data;

        if (channel && this.subscriptions.has(channel)) {
            this.subscriptions.get(channel)!.delete(ws);
            ws.subscriptions?.delete(channel);

            if (this.subscriptions.get(channel)!.size === 0) {
                this.subscriptions.delete(channel);
            }

            logger.info(`Client unsubscribed from channel: ${channel}`);

            this.sendMessage(ws, {
                type: 'unsubscribed',
                data: { channel },
                requestId
            });
        }
    }

    private async handleGetAgentPrice(ws: AuthenticatedWebSocket, data: any, requestId?: string) {
        const { agentId } = data;

        if (!agentId) {
            return this.sendError(ws, 'Agent ID is required', requestId);
        }

        try {
            // Get agent from database
            const result = await this.db.query(
                'SELECT agent_address FROM agents WHERE id = $1',
                [agentId]
            );

            if (result.rows.length === 0) {
                return this.sendError(ws, 'Agent not found', requestId);
            }

            const agentAddress = result.rows[0].agent_address;
            const onChainData = await this.solanaService.getAgentOnChainData(agentAddress);

            this.sendMessage(ws, {
                type: 'agent_price',
                data: {
                    agentId,
                    price: onChainData.currentPrice,
                    marketCap: onChainData.marketCap,
                    totalKeys: onChainData.totalKeys,
                    holders: onChainData.holders,
                    timestamp: new Date().toISOString()
                },
                requestId
            });
        } catch (error) {
            this.sendError(ws, 'Failed to get agent price', requestId, error);
        }
    }

    private async handleGetPortfolio(ws: AuthenticatedWebSocket, data: any, requestId?: string) {
        if (!ws.userId) {
            return this.sendError(ws, 'Authentication required', requestId);
        }

        try {
            const result = await this.db.query(`
                SELECT ah.token_amount, ah.last_updated,
                       a.id as agent_id, a.name, a.symbol, a.agent_address,
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
            `, [ws.userId]);

            const holdings = result.rows;
            const totalValue = holdings.reduce((sum, h) => sum + (h.position_value || 0), 0);

            this.sendMessage(ws, {
                type: 'portfolio',
                data: {
                    totalValue,
                    holdings,
                    timestamp: new Date().toISOString()
                },
                requestId
            });
        } catch (error) {
            this.sendError(ws, 'Failed to get portfolio', requestId, error);
        }
    }

    private async handleGetRecentTrades(ws: AuthenticatedWebSocket, data: any, requestId?: string) {
        const { agentId, limit = 50 } = data;

        try {
            let query = `
                SELECT t.*, u.username, u.wallet_address
                FROM transactions t
                LEFT JOIN users u ON t.user_id = u.id
                WHERE t.confirmed = true
            `;
            const params: any[] = [];
            
            if (agentId) {
                query += ' AND t.agent_id = $1';
                params.push(agentId);
            }

            query += ' ORDER BY t.created_at DESC LIMIT $' + (params.length + 1);
            params.push(Math.min(limit, 100));

            const result = await this.db.query(query, params);

            this.sendMessage(ws, {
                type: 'recent_trades',
                data: {
                    trades: result.rows,
                    timestamp: new Date().toISOString()
                },
                requestId
            });
        } catch (error) {
            this.sendError(ws, 'Failed to get recent trades', requestId, error);
        }
    }

    private async handleGetOshiRealtime(ws: AuthenticatedWebSocket, data: any, requestId?: string) {
        try {
            const realtimeData = await this.oshiService.getRealtimeUpdates();
            const oshiData = await this.oshiService.getOshiAgentData();

            this.sendMessage(ws, {
                type: 'oshi_realtime',
                data: {
                    ...realtimeData,
                    tradingStats: oshiData.tradingStats,
                    currentPrice: oshiData.currentPrice,
                    marketCap: oshiData.marketCap,
                    performanceScore: oshiData.performanceScore,
                    timestamp: new Date().toISOString()
                },
                requestId
            });
        } catch (error) {
            this.sendError(ws, 'Failed to get Oshi realtime data', requestId, error);
        }
    }

    private async sendInitialChannelData(ws: AuthenticatedWebSocket, channel: string) {
        try {
            if (channel.startsWith('agent:')) {
                const agentId = channel.split(':')[1];
                if (agentId === 'oshi-flagship' || agentId === 'oshi') {
                    await this.handleGetOshiRealtime(ws, {});
                } else {
                    await this.handleGetAgentPrice(ws, { agentId });
                }
            } else if (channel === 'oshi:realtime') {
                await this.handleGetOshiRealtime(ws, {});
            } else if (channel === 'global:prices') {
                // Send global price updates
                const result = await this.db.query(`
                    SELECT a.id, a.name, a.symbol, COALESCE(ph.price, 0) as price,
                           a.market_cap, a.total_keys
                    FROM agents a
                    LEFT JOIN LATERAL (
                        SELECT price 
                        FROM price_history 
                        WHERE agent_id = a.id 
                        ORDER BY timestamp DESC 
                        LIMIT 1
                    ) ph ON true
                    WHERE a.is_active = true
                    ORDER BY a.market_cap DESC
                    LIMIT 50
                `);

                this.sendMessage(ws, {
                    type: 'global_prices',
                    data: {
                        agents: result.rows,
                        timestamp: new Date().toISOString()
                    }
                });
            }
        } catch (error) {
            logger.error('Error sending initial channel data:', error);
        }
    }

    private handleDisconnection(ws: AuthenticatedWebSocket) {
        // Remove from all subscriptions
        if (ws.subscriptions) {
            for (const channel of ws.subscriptions) {
                const channelSubscribers = this.subscriptions.get(channel);
                if (channelSubscribers) {
                    channelSubscribers.delete(ws);
                    if (channelSubscribers.size === 0) {
                        this.subscriptions.delete(channel);
                    }
                }
            }
        }

        logger.info(`WebSocket disconnected. Total connections: ${this.wss.clients.size}`);
    }

    private sendMessage(ws: AuthenticatedWebSocket, message: WebSocketMessage) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        }
    }

    private sendError(ws: AuthenticatedWebSocket, error: string, requestId?: string, details?: any) {
        if (details) {
            logger.error('WebSocket error:', details);
        }

        this.sendMessage(ws, {
            type: 'error',
            error,
            requestId
        });
    }

    // Broadcast methods
    public broadcastToChannel(channel: string, message: WebSocketMessage) {
        const subscribers = this.subscriptions.get(channel);
        if (subscribers) {
            subscribers.forEach(ws => {
                this.sendMessage(ws, message);
            });
        }
    }

    public broadcastPriceUpdate(agentId: string, priceData: any) {
        this.broadcastToChannel(`agent:${agentId}`, {
            type: 'price_update',
            data: {
                agentId,
                ...priceData,
                timestamp: new Date().toISOString()
            }
        });
    }

    public broadcastTradeUpdate(trade: any) {
        this.broadcastToChannel('global:trades', {
            type: 'trade_update',
            data: {
                ...trade,
                timestamp: new Date().toISOString()
            }
        });

        // Also broadcast to specific agent channel
        if (trade.agent_id) {
            this.broadcastToChannel(`agent:${trade.agent_id}`, {
                type: 'agent_trade',
                data: trade
            });
        }
    }

    public broadcastMarketStats(stats: any) {
        this.broadcastToChannel('global:stats', {
            type: 'market_stats',
            data: {
                ...stats,
                timestamp: new Date().toISOString()
            }
        });
    }

    public broadcastOshiUpdate(updateData: any) {
        this.broadcastToChannel('oshi:realtime', {
            type: 'oshi_update',
            data: {
                ...updateData,
                timestamp: new Date().toISOString()
            }
        });

        // Also broadcast to agent-specific channel
        this.broadcastToChannel('agent:oshi-flagship', {
            type: 'oshi_update',
            data: updateData
        });
    }

    public broadcastTradingUpdate(tradeData: any) {
        this.broadcastToChannel('oshi:trades', {
            type: 'oshi_trade',
            data: {
                ...tradeData,
                timestamp: new Date().toISOString()
            }
        });
    }

    // Periodic updates
    private startPriceUpdateBroadcast() {
        this.priceUpdateInterval = setInterval(async () => {
            try {
                // Get active agents and update prices
                const result = await this.db.query(`
                    SELECT id, agent_address 
                    FROM agents 
                    WHERE is_active = true 
                    ORDER BY market_cap DESC 
                    LIMIT 20
                `);

                for (const agent of result.rows) {
                    try {
                        const onChainData = await this.solanaService.getAgentOnChainData(agent.agent_address);
                        
                        // Store price history
                        await this.db.query(`
                            INSERT INTO price_history (agent_id, price, supply, market_cap, timestamp)
                            VALUES ($1, $2, $3, $4, NOW())
                        `, [agent.id, onChainData.currentPrice, onChainData.totalKeys, onChainData.marketCap]);

                        // Broadcast update
                        this.broadcastPriceUpdate(agent.id, {
                            price: onChainData.currentPrice,
                            marketCap: onChainData.marketCap,
                            totalKeys: onChainData.totalKeys,
                            holders: onChainData.holders
                        });

                    } catch (error) {
                        logger.warn(`Failed to update price for agent ${agent.id}:`, error);
                    }
                }

                // Broadcast global market stats
                const statsResult = await this.db.query(`
                    SELECT 
                        COUNT(*) as total_agents,
                        SUM(market_cap) as total_market_cap,
                        SUM(total_keys) as total_keys,
                        AVG(market_cap) as avg_market_cap
                    FROM agents 
                    WHERE is_active = true
                `);

                if (statsResult.rows.length > 0) {
                    this.broadcastMarketStats(statsResult.rows[0]);
                }

            } catch (error) {
                logger.error('Error in price update broadcast:', error);
            }
        }, 10000); // Update every 10 seconds
    }

    private startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            this.wss.clients.forEach((ws: AuthenticatedWebSocket) => {
                if (ws.isAlive === false) {
                    logger.info('Terminating dead WebSocket connection');
                    return ws.terminate();
                }

                ws.isAlive = false;
                ws.ping();
            });
        }, 30000); // Heartbeat every 30 seconds
    }

    public getConnectionCount(): number {
        return this.wss.clients.size;
    }

    public getSubscriptionCounts(): { [channel: string]: number } {
        const counts: { [channel: string]: number } = {};
        for (const [channel, subscribers] of this.subscriptions) {
            counts[channel] = subscribers.size;
        }
        return counts;
    }

    public close() {
        if (this.priceUpdateInterval) {
            clearInterval(this.priceUpdateInterval);
        }
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        this.wss.close();
    }
}