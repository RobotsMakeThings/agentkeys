import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error('Unhandled error:', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });

    // Don't expose internal errors in production
    if (process.env.NODE_ENV === 'production') {
        res.status(500).json({
            error: 'Internal server error',
            timestamp: new Date().toISOString()
        });
    } else {
        res.status(500).json({
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
    }
};

export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        error: 'Resource not found',
        path: req.path,
        method: req.method
    });
};