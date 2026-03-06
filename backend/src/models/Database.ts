import { Pool, PoolClient, QueryResult } from 'pg';
import { Redis } from 'redis';
import logger from '../utils/logger';

export class Database {
    private static instance: Database;
    private pool: Pool;
    private redis: Redis;

    private constructor() {
        // PostgreSQL connection
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            max: parseInt(process.env.DATABASE_MAX_CONNECTIONS || '20'),
            idleTimeoutMillis: parseInt(process.env.DATABASE_IDLE_TIMEOUT || '30000'),
            connectionTimeoutMillis: 2000,
        });

        // Redis connection
        this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

        this.setupEventHandlers();
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    private setupEventHandlers() {
        this.pool.on('connect', () => {
            logger.info('Connected to PostgreSQL database');
        });

        this.pool.on('error', (err) => {
            logger.error('PostgreSQL connection error:', err);
        });

        this.redis.on('connect', () => {
            logger.info('Connected to Redis');
        });

        this.redis.on('error', (err) => {
            logger.error('Redis connection error:', err);
        });
    }

    // PostgreSQL methods
    public async query(text: string, params?: any[]): Promise<QueryResult> {
        const start = Date.now();
        try {
            const result = await this.pool.query(text, params);
            const duration = Date.now() - start;
            logger.debug(`Query executed in ${duration}ms: ${text}`);
            return result;
        } catch (error) {
            logger.error('Database query error:', error);
            throw error;
        }
    }

    public async getClient(): Promise<PoolClient> {
        return await this.pool.connect();
    }

    public async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
        const client = await this.getClient();
        try {
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // Redis methods
    public getRedis(): Redis {
        return this.redis;
    }

    public async setCache(key: string, value: any, ttl: number = 300): Promise<void> {
        try {
            await this.redis.setex(key, ttl, JSON.stringify(value));
        } catch (error) {
            logger.error(`Redis set error for key ${key}:`, error);
        }
    }

    public async getCache<T>(key: string): Promise<T | null> {
        try {
            const value = await this.redis.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            logger.error(`Redis get error for key ${key}:`, error);
            return null;
        }
    }

    public async deleteCache(key: string): Promise<void> {
        try {
            await this.redis.del(key);
        } catch (error) {
            logger.error(`Redis delete error for key ${key}:`, error);
        }
    }

    public async publish(channel: string, message: any): Promise<void> {
        try {
            await this.redis.publish(channel, JSON.stringify(message));
        } catch (error) {
            logger.error(`Redis publish error for channel ${channel}:`, error);
        }
    }

    // Cleanup
    public async close(): Promise<void> {
        await this.pool.end();
        await this.redis.quit();
    }
}

export interface User {
    id: string;
    wallet_address: string;
    username?: string;
    email?: string;
    created_at: Date;
    last_active: Date;
    is_verified: boolean;
    profile_data: any;
    settings: any;
}

export interface Agent {
    id: string;
    creator_id: string;
    agent_address: string;
    name: string;
    symbol: string;
    description?: string;
    category: string;
    github_url?: string;
    twitter_handle?: string;
    token_mint: string;
    total_keys: number;
    total_holders: number;
    market_cap: number;
    created_at: Date;
    updated_at: Date;
    metadata: any;
    is_active: boolean;
}

export interface AgentHolding {
    id: string;
    user_id: string;
    agent_id: string;
    token_amount: number;
    last_updated: Date;
}

export interface Transaction {
    id: string;
    signature: string;
    user_id?: string;
    agent_id?: string;
    transaction_type: 'BUY' | 'SELL' | 'REWARD' | 'FEE_CLAIM' | 'AIRDROP';
    token_amount?: number;
    sol_amount?: number;
    price_per_token?: number;
    fees_paid: number;
    created_at: Date;
    block_time?: Date;
    confirmed: boolean;
    metadata: any;
}

export interface AccessRule {
    id: string;
    agent_id: string;
    creator_id: string;
    rule_address: string;
    resource_id: string;
    min_tokens_required: number;
    access_type: 'OneTime' | 'Subscription' | 'Tiered' | 'TimePass';
    expiry_duration?: number;
    is_active: boolean;
    total_accesses: number;
    created_at: Date;
    updated_at: Date;
}

export interface PriceHistoryPoint {
    id: string;
    agent_id: string;
    price: number;
    supply: number;
    market_cap?: number;
    volume_24h: number;
    timestamp: Date;
}

export default Database;