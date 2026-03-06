import { Database } from '../models/Database';
import logger from '../utils/logger';

export class CacheService {
    private db: Database;
    private redis;

    constructor() {
        this.db = Database.getInstance();
        this.redis = this.db.getRedis();
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const value = await this.redis.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            logger.error(`Cache get error for key ${key}:`, error);
            return null;
        }
    }

    async set(key: string, value: any, ttl: number = 300): Promise<void> {
        try {
            await this.redis.setex(key, ttl, JSON.stringify(value));
        } catch (error) {
            logger.error(`Cache set error for key ${key}:`, error);
        }
    }

    async delete(key: string): Promise<void> {
        try {
            if (key.includes('*')) {
                // Delete pattern
                const keys = await this.redis.keys(key);
                if (keys.length > 0) {
                    await this.redis.del(...keys);
                }
            } else {
                await this.redis.del(key);
            }
        } catch (error) {
            logger.error(`Cache delete error for key ${key}:`, error);
        }
    }

    async flush(): Promise<void> {
        try {
            await this.redis.flushdb();
        } catch (error) {
            logger.error('Cache flush error:', error);
        }
    }
}