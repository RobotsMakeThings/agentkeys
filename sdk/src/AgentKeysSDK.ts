import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider, Wallet } from '@coral-xyz/anchor';
import axios, { AxiosInstance } from 'axios';
import WebSocket from 'ws';

export interface SDKConfig {
    apiUrl: string;
    wsUrl: string;
    solanaRpcUrl: string;
    programIds: {
        agentKeys: string;
        bondingCurve: string;
        treasury: string;
        accessControl: string;
    };
    network: 'devnet' | 'testnet' | 'mainnet-beta';
}

export interface Agent {
    id: string;
    name: string;
    symbol: string;
    description?: string;
    category: string;
    creator_id: string;
    agent_address: string;
    token_mint: string;
    total_keys: number;
    total_holders: number;
    market_cap: number;
    created_at: string;
    current_price?: number;
}

export interface UserPortfolio {
    total_value: number;
    total_agents: number;
    holdings: AgentHolding[];
}

export interface AgentHolding {
    agent_id: string;
    token_amount: number;
    position_value: number;
    agent: Agent;
}

export interface Transaction {
    id: string;
    signature: string;
    transaction_type: 'BUY' | 'SELL' | 'REWARD' | 'FEE_CLAIM' | 'AIRDROP';
    token_amount?: number;
    sol_amount?: number;
    price_per_token?: number;
    created_at: string;
    confirmed: boolean;
    agent?: Agent;
}

export interface PriceHistory {
    price: number;
    supply: number;
    market_cap?: number;
    volume_24h: number;
    timestamp: string;
}

export interface WebSocketMessage {
    type: string;
    data?: any;
    error?: string;
    requestId?: string;
}

export class AgentKeysSDK {
    private config: SDKConfig;
    private api: AxiosInstance;
    private connection: Connection;
    private ws?: WebSocket;
    private authToken?: string;
    private eventListeners: Map<string, Function[]> = new Map();

    constructor(config: SDKConfig) {
        this.config = config;
        
        // Initialize HTTP client
        this.api = axios.create({
            baseURL: config.apiUrl,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Initialize Solana connection
        this.connection = new Connection(config.solanaRpcUrl, 'confirmed');

        // Setup API interceptors
        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor for auth token
        this.api.interceptors.request.use((config) => {
            if (this.authToken) {
                config.headers.Authorization = `Bearer ${this.authToken}`;
            }
            return config;
        });

        // Response interceptor for error handling
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    this.authToken = undefined;
                    this.emit('authExpired');
                }
                return Promise.reject(error);
            }
        );
    }

    // Authentication
    public setAuthToken(token: string) {
        this.authToken = token;
    }

    public clearAuth() {
        this.authToken = undefined;
    }

    // Agent Management
    public async getAgents(params?: {
        category?: string;
        creator?: string;
        search?: string;
        sort?: string;
        order?: 'asc' | 'desc';
        page?: number;
        limit?: number;
    }): Promise<{
        agents: Agent[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }> {
        try {
            const response = await this.api.get('/api/agents', { params });
            return response.data;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch agents');
        }
    }

    public async getAgent(id: string): Promise<Agent> {
        try {
            const response = await this.api.get(`/api/agents/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch agent');
        }
    }

    public async createAgent(params: {
        name: string;
        symbol: string;
        description?: string;
        category: string;
        github_url?: string;
        twitter_handle?: string;
    }): Promise<{
        message: string;
        agent: Agent;
        transaction: string;
    }> {
        try {
            const response = await this.api.post('/api/agents', params);
            return response.data;
        } catch (error) {
            throw this.handleError(error, 'Failed to create agent');
        }
    }

    public async buyKeys(
        agentId: string,
        amount: number,
        maxPrice?: number
    ): Promise<{
        message: string;
        transaction: string;
        amount_purchased: number;
        total_cost: number;
        price_per_token: number;
    }> {
        try {
            const response = await this.api.post(`/api/agents/${agentId}/buy`, {
                amount,
                max_price: maxPrice
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error, 'Failed to buy keys');
        }
    }

    public async sellKeys(
        agentId: string,
        amount: number,
        minPrice?: number
    ): Promise<{
        message: string;
        transaction: string;
        amount_sold: number;
        total_proceeds: number;
        price_per_token: number;
    }> {
        try {
            const response = await this.api.post(`/api/agents/${agentId}/sell`, {
                amount,
                min_price: minPrice
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error, 'Failed to sell keys');
        }
    }

    public async getAgentPriceHistory(
        agentId: string,
        timeframe: '1h' | '24h' | '7d' | '30d' = '24h',
        interval: '1m' | '5m' | '1h' | '1d' = '1h'
    ): Promise<PriceHistory[]> {
        try {
            const response = await this.api.get(`/api/agents/${agentId}/price-history`, {
                params: { timeframe, interval }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch price history');
        }
    }

    // User Management
    public async getUserProfile(): Promise<any> {
        try {
            const response = await this.api.get('/api/users/me');
            return response.data;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch user profile');
        }
    }

    public async updateUserProfile(data: {
        username?: string;
        email?: string;
        profile_data?: any;
        settings?: any;
    }): Promise<{ message: string; user: any }> {
        try {
            const response = await this.api.put('/api/users/me', data);
            return response.data;
        } catch (error) {
            throw this.handleError(error, 'Failed to update profile');
        }
    }

    public async getUserPortfolio(): Promise<UserPortfolio> {
        try {
            const response = await this.api.get('/api/users/me/holdings');
            return response.data;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch portfolio');
        }
    }

    public async getUserTransactions(params?: {
        page?: number;
        limit?: number;
        type?: string;
    }): Promise<{
        transactions: Transaction[];
        pagination: any;
    }> {
        try {
            const response = await this.api.get('/api/users/me/transactions', { params });
            return response.data;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch transactions');
        }
    }

    public async getUserAgents(): Promise<Agent[]> {
        try {
            const response = await this.api.get('/api/users/me/agents');
            return response.data;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch user agents');
        }
    }

    public async claimCreatorFees(agentId: string): Promise<{
        message: string;
        amount_claimed: number;
        total_claimed: number;
    }> {
        try {
            const response = await this.api.post(`/api/users/me/agents/${agentId}/claim-fees`);
            return response.data;
        } catch (error) {
            throw this.handleError(error, 'Failed to claim fees');
        }
    }

    // Market Data
    public async getMarketStats(): Promise<any> {
        try {
            const response = await this.api.get('/api/market/stats');
            return response.data;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch market stats');
        }
    }

    public async getLeaderboard(limit: number = 50): Promise<any[]> {
        try {
            const response = await this.api.get('/api/users/leaderboard', {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch leaderboard');
        }
    }

    // WebSocket Connection
    public connectWebSocket(authToken?: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const wsUrl = authToken 
                    ? `${this.config.wsUrl}?token=${authToken}`
                    : this.config.wsUrl;

                this.ws = new WebSocket(wsUrl);

                this.ws.on('open', () => {
                    this.emit('wsConnected');
                    resolve();
                });

                this.ws.on('message', (data: Buffer) => {
                    try {
                        const message: WebSocketMessage = JSON.parse(data.toString());
                        this.handleWebSocketMessage(message);
                    } catch (error) {
                        console.error('Error parsing WebSocket message:', error);
                    }
                });

                this.ws.on('error', (error) => {
                    this.emit('wsError', error);
                    reject(error);
                });

                this.ws.on('close', () => {
                    this.emit('wsDisconnected');
                });

            } catch (error) {
                reject(error);
            }
        });
    }

    public disconnectWebSocket() {
        if (this.ws) {
            this.ws.close();
            this.ws = undefined;
        }
    }

    public subscribeToChannel(channel: string): void {
        if (!this.ws) {
            throw new Error('WebSocket not connected');
        }

        this.sendWebSocketMessage({
            type: 'subscribe',
            data: { channel }
        });
    }

    public unsubscribeFromChannel(channel: string): void {
        if (!this.ws) {
            throw new Error('WebSocket not connected');
        }

        this.sendWebSocketMessage({
            type: 'unsubscribe',
            data: { channel }
        });
    }

    public subscribeToAgent(agentId: string): void {
        this.subscribeToChannel(`agent:${agentId}`);
    }

    public subscribeToGlobalPrices(): void {
        this.subscribeToChannel('global:prices');
    }

    public subscribeToTrades(): void {
        this.subscribeToChannel('global:trades');
    }

    private sendWebSocketMessage(message: WebSocketMessage): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }

    private handleWebSocketMessage(message: WebSocketMessage): void {
        this.emit('wsMessage', message);
        
        // Emit specific event types
        if (message.type) {
            this.emit(message.type, message.data);
        }
    }

    // Price Calculations
    public async calculateBuyPrice(agentId: string, amount: number): Promise<number> {
        try {
            const response = await this.api.post('/api/market/calculate-buy-price', {
                agent_id: agentId,
                amount
            });
            return response.data.price;
        } catch (error) {
            throw this.handleError(error, 'Failed to calculate buy price');
        }
    }

    public async calculateSellPrice(agentId: string, amount: number): Promise<number> {
        try {
            const response = await this.api.post('/api/market/calculate-sell-price', {
                agent_id: agentId,
                amount
            });
            return response.data.price;
        } catch (error) {
            throw this.handleError(error, 'Failed to calculate sell price');
        }
    }

    // Event System
    public on(event: string, listener: Function): void {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event)!.push(listener);
    }

    public off(event: string, listener: Function): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    private emit(event: string, ...args: any[]): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.forEach(listener => {
                try {
                    listener(...args);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    // Utility Methods
    public async getHealth(): Promise<any> {
        try {
            const response = await this.api.get('/health');
            return response.data;
        } catch (error) {
            throw this.handleError(error, 'Failed to check health');
        }
    }

    private handleError(error: any, defaultMessage: string): Error {
        if (error.response?.data?.error) {
            return new Error(error.response.data.error);
        }
        if (error.message) {
            return error;
        }
        return new Error(defaultMessage);
    }

    // Solana Integration
    public getConnection(): Connection {
        return this.connection;
    }

    public async getBlockHeight(): Promise<number> {
        return await this.connection.getBlockHeight();
    }

    public async getTransactionStatus(signature: string): Promise<any> {
        return await this.connection.getSignatureStatus(signature);
    }
}

// Default configurations
export const DEVNET_CONFIG: SDKConfig = {
    apiUrl: 'http://localhost:3001',
    wsUrl: 'ws://localhost:3001/ws',
    solanaRpcUrl: 'https://api.devnet.solana.com',
    programIds: {
        agentKeys: 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS',
        bondingCurve: 'BondCurveProgramId1111111111111111111111111',
        treasury: 'TreasuryProgramId1111111111111111111111111',
        accessControl: 'AccessControlProgramId1111111111111111111111'
    },
    network: 'devnet'
};

export const MAINNET_CONFIG: SDKConfig = {
    apiUrl: 'https://api.agentkeys.xyz',
    wsUrl: 'wss://api.agentkeys.xyz/ws',
    solanaRpcUrl: 'https://api.mainnet-beta.solana.com',
    programIds: {
        agentKeys: 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS',
        bondingCurve: 'BondCurveProgramId1111111111111111111111111',
        treasury: 'TreasuryProgramId1111111111111111111111111',
        accessControl: 'AccessControlProgramId1111111111111111111111'
    },
    network: 'mainnet-beta'
};