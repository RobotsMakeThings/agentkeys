import WebSocket from 'ws';
import { Server } from 'http';
import logger from '../utils/logger';
import { LiveAgentService } from './LiveAgentService';

interface WebSocketMessage {
    type: 'agent_update' | 'trading_update' | 'heartbeat';
    data: any;
    timestamp: string;
}

export class WebSocketService {
    private static instance: WebSocketService;
    private wss: WebSocket.Server | null = null;
    private liveAgentService: LiveAgentService;
    private updateInterval: NodeJS.Timeout | null = null;

    private constructor() {
        this.liveAgentService = LiveAgentService.getInstance();
    }

    public static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    /**
     * Initialize WebSocket server
     */
    public initialize(server: Server): void {
        this.wss = new WebSocket.Server({ 
            server,
            path: '/ws'
        });

        this.wss.on('connection', (ws: WebSocket) => {
            logger.info('WebSocket client connected');

            // Send initial agent data
            this.sendAgentUpdate(ws);

            // Handle ping/pong for connection health
            ws.on('ping', () => {
                ws.pong();
            });

            ws.on('message', (data: string) => {
                try {
                    const message = JSON.parse(data);
                    this.handleMessage(ws, message);
                } catch (error) {
                    logger.warn('Invalid WebSocket message:', error);
                }
            });

            ws.on('close', () => {
                logger.info('WebSocket client disconnected');
            });

            ws.on('error', (error) => {
                logger.error('WebSocket error:', error);
            });
        });

        // Start periodic updates
        this.startPeriodicUpdates();
        
        logger.info('WebSocket server initialized on /ws');
    }

    /**
     * Handle incoming WebSocket messages
     */
    private handleMessage(ws: WebSocket, message: any): void {
        switch (message.type) {
            case 'subscribe_agent':
                this.handleAgentSubscription(ws, message.agentId);
                break;
            case 'get_agents':
                this.sendAgentUpdate(ws);
                break;
            case 'ping':
                this.sendMessage(ws, { type: 'heartbeat', data: 'pong', timestamp: new Date().toISOString() });
                break;
            default:
                logger.warn('Unknown WebSocket message type:', message.type);
        }
    }

    /**
     * Handle agent subscription
     */
    private handleAgentSubscription(ws: WebSocket, agentId: string): void {
        // For now, just send the specific agent data
        // In the future, could maintain subscription lists
        this.liveAgentService.getAgentById(agentId).then(agent => {
            if (agent) {
                this.sendMessage(ws, {
                    type: 'agent_update',
                    data: { agent },
                    timestamp: new Date().toISOString()
                });
            }
        });
    }

    /**
     * Send agent update to a specific client
     */
    private async sendAgentUpdate(ws: WebSocket): Promise<void> {
        try {
            const agents = await this.liveAgentService.getAllLiveAgents();
            this.sendMessage(ws, {
                type: 'agent_update',
                data: { agents },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            logger.error('Error sending agent update:', error);
        }
    }

    /**
     * Broadcast to all connected clients
     */
    public async broadcastAgentUpdate(): Promise<void> {
        if (!this.wss) return;

        try {
            const agents = await this.liveAgentService.getAllLiveAgents();
            const message: WebSocketMessage = {
                type: 'agent_update',
                data: { agents },
                timestamp: new Date().toISOString()
            };

            this.broadcast(message);
        } catch (error) {
            logger.error('Error broadcasting agent update:', error);
        }
    }

    /**
     * Broadcast trading update
     */
    public broadcastTradingUpdate(agentId: string, tradeData: any): void {
        if (!this.wss) return;

        const message: WebSocketMessage = {
            type: 'trading_update',
            data: { agentId, ...tradeData },
            timestamp: new Date().toISOString()
        };

        this.broadcast(message);
        logger.info(`Broadcasting trading update for ${agentId}`);
    }

    /**
     * Send message to specific WebSocket client
     */
    private sendMessage(ws: WebSocket, message: WebSocketMessage): void {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        }
    }

    /**
     * Broadcast message to all connected clients
     */
    private broadcast(message: WebSocketMessage): void {
        if (!this.wss) return;

        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }

    /**
     * Start periodic updates (every 30 seconds)
     */
    private startPeriodicUpdates(): void {
        this.updateInterval = setInterval(async () => {
            await this.broadcastAgentUpdate();
        }, 30000); // 30 seconds
    }

    /**
     * Simulate live trading update
     */
    public simulateTradingUpdate(): void {
        const agents = ['oshi-kalshi-trader', 'kage-airdrop-hunter', 'sora-weather-trader'];
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        
        let updateData;
        switch (randomAgent) {
            case 'oshi-kalshi-trader':
                updateData = {
                    market: 'KXBTC15M',
                    action: Math.random() > 0.5 ? 'entry' : 'exit',
                    position: Math.random() > 0.5 ? 'YES' : 'NO',
                    price: (Math.random() * 100).toFixed(2),
                    confidence: 'T1' // T1 or T2 strategy
                };
                break;
            case 'kage-airdrop-hunter':
                updateData = {
                    campaign: `Chain-${Math.floor(Math.random() * 7) + 1}`,
                    action: 'farming',
                    wallets: Math.floor(Math.random() * 50) + 300,
                    rewards: `$${(Math.random() * 100).toFixed(2)}`
                };
                break;
            case 'sora-weather-trader':
                updateData = {
                    market: `Weather-${Math.floor(Math.random() * 10) + 1}`,
                    action: 'prediction',
                    forecast: Math.random() > 0.5 ? 'Rain' : 'Clear',
                    confidence: (Math.random() * 20 + 80).toFixed(1) + '%'
                };
                break;
        }

        this.broadcastTradingUpdate(randomAgent, updateData);
    }

    /**
     * Stop the WebSocket service
     */
    public stop(): void {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }

        if (this.wss) {
            this.wss.close();
            this.wss = null;
        }

        logger.info('WebSocket service stopped');
    }
}