import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = String(process.env.JWT_ACCESS_TOKEN_SECRET);
const REFRESH_TOKEN_SECRET = String(process.env.JWT_REFRESH_TOKEN_SECRET);

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    console.error("One or more JWT secrets are not defined in environment variables.");
    process.exit(1);
}

export async function generateAccessToken(userId: string, expiresIn: number): Promise<string> {
    const payload = {
        userId: userId,
        type: 'access',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (typeof expiresIn === 'string' ? getSecondsFromTimeUnit(expiresIn) : expiresIn)
    };
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn});
}

export async function generateRefreshToken(userId: string, expiresIn: number): Promise<string> {
    const payload = {
        userId: userId,
        type: 'refresh',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (typeof expiresIn === 'string' ? getSecondsFromTimeUnit(expiresIn) : expiresIn)
    };
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn});
}

// Ex: "15m" -> 900 seconds, "7d" -> 604800 seconds
function getSecondsFromTimeUnit(time: string): number {
    const unit = time.slice(-1); // Get the last character to determine the time unit
    const value = parseInt(time.slice(0, -1)); // Get the numeric part of the time string
    switch (unit) {
        case 's':
            return value;
        case 'm':
            return value * 60;
        case 'h':
            return value * 3600;
        case 'd':
            return value * 24 * 3600;
        default:
            throw new Error('Invalid time format');
    }
}

export function verifyAccessToken(token: string): { 
    userId: string, 
} {
    try {
        // Ex: { userId: '123', type: 'access', iat: 1690000000, exp: 1690000900 }
        return jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId: string, type: string, iat: number, exp: number };
    } catch {
        throw new Error('Invalid token');
    }
}

export function verifyRefreshToken(token: string): {   
    userId: string, 
} {
    try {
        // Ex: { userId: '123', type: 'refresh', iat: 1690000000, exp: 1690600000 }
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: string, type: string, iat: number, exp: number };
    } catch {
        throw new Error('Invalid token');
    }
}