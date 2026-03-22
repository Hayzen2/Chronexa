// shared instance
import { Redis } from 'ioredis';

// Redis client for general use (e.g., storing tokens, session data)
const redisClient = new Redis(
    {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
    }
);

// Redis connection options for BullMQ (used in email queues)
const redisConnection = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
}

export { redisClient, redisConnection };