import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    message: {
        message: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            message: 'Too many requests from this IP, please try again later.',
            retryAfter: '15 minutes'
        });
    },
});

// Stricter rate limiter for authentication endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 login/signup requests per windowMs
    message: {
        message: 'Too many authentication attempts, please try again later.',
        retryAfter: '15 minutes'
    },
    skipSuccessfulRequests: true, // Don't count successful requests
    handler: (req, res) => {
        logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            message: 'Too many authentication attempts, please try again later.',
            retryAfter: '15 minutes'
        });
    },
});

// Rate limiter for trip creation
export const tripCreationLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // Limit to 100 trip creations per minute
    message: {
        message: 'Too many trips created, please slow down.',
        retryAfter: '1 minute'
    },
    handler: (req, res) => {
        logger.warn(`Trip creation rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            message: 'Too many trips created, please slow down.',
            retryAfter: '1 minute'
        });
    },
});

export default { apiLimiter, authLimiter, tripCreationLimiter };
