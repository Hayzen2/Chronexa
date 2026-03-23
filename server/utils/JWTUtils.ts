import jwt from 'jsonwebtoken';
import { User } from '../entity/userEntity.ts';

const JWT_SECRET = String(process.env.JWT_SECRET);

if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables.");
    process.exit(1);
}

export async function generateToken(user: User): Promise<string> {
    const payload = {
        userId: user.id,
        username: user.username,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { 
    userId: string, 
    username: string 
} {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string, username: string };
    } catch {
        throw new Error('Invalid token');
    }
}