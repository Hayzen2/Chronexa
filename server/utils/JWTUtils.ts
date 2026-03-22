import jwt from 'jsonwebtoken';
import { User } from '../entity/userEntity.ts';

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET not defined");
}
const JWT_SECRET = process.env.JWT_SECRET;

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