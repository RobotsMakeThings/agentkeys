import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Database } from '../models/Database';
import logger from '../utils/logger';

export interface AuthenticatedUser {
    id: string;
    wallet_address: string;
}

declare global {
    namespace Express {
        interface Request {
            user: AuthenticatedUser;
        }
    }
}

const db = Database.getInstance();

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        
        // Get user from database to ensure they still exist
        const userResult = await db.query(
            'SELECT id, wallet_address FROM users WHERE id = $1',
            [decoded.id]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        const user = userResult.rows[0];
        req.user = {
            id: user.id,
            wallet_address: user.wallet_address
        };

        // Update last active timestamp
        await db.query(
            'UPDATE users SET last_active = NOW() WHERE id = $1',
            [user.id]
        );

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        logger.error('Authentication error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return next(); // Continue without authentication
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        
        // Get user from database
        const userResult = await db.query(
            'SELECT id, wallet_address FROM users WHERE id = $1',
            [decoded.id]
        );

        if (userResult.rows.length > 0) {
            const user = userResult.rows[0];
            req.user = {
                id: user.id,
                wallet_address: user.wallet_address
            };

            // Update last active timestamp
            await db.query(
                'UPDATE users SET last_active = NOW() WHERE id = $1',
                [user.id]
            );
        }

        next();
    } catch (error) {
        // Continue without authentication if token is invalid
        next();
    }
};