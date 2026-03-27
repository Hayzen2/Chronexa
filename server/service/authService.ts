import {UserRepository} from "../repository/userRepository.ts";
import { User } from "../entity/userEntity.ts";
import {generateAccessToken, generateRefreshToken} from "../utils/JWTUtils.ts";
import {comparePassword, hashPassword} from "../utils/hashUtils.ts";
import {RegisterDTO} from "../dto/requests/registerDTO.ts";
import {LoginDTO} from "../dto/requests/loginDTO.ts";
import {redisClient} from '../config/redis.ts';
import {verifyRefreshToken} from "../utils/JWTUtils.ts";

const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes in seconds
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 3600; // 7 days in seconds
// Refresh token: stored in HttpOnly cookie
// Access token: stored in memory (client-side) and sent in Authorization header

export class AuthService {
    private readonly userRepository = UserRepository;

    async refreshToken(refreshToken: string): Promise<[string, string]> {
        const decode = verifyRefreshToken(refreshToken);
        const userId = decode.userId;
        const storedRefreshToken = await redisClient.get(`refresh-token:${userId}`);
        if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
            throw new Error('No refresh token found, please log in again');
        }
        try {
            const newAccessToken = await generateAccessToken(userId, ACCESS_TOKEN_EXPIRY);
            const newRefreshToken = await generateRefreshToken(userId, REFRESH_TOKEN_EXPIRY);
            await redisClient.set(`refresh-token:${userId}`, newRefreshToken, 'EX', REFRESH_TOKEN_EXPIRY);
            await redisClient.set(`access-token:${userId}`, newAccessToken, 'EX', ACCESS_TOKEN_EXPIRY);
            return [newAccessToken, newRefreshToken];
        } catch {
            await redisClient.del(`refresh-token:${userId}`); // Invalidate the refresh token if it's invalid
            throw new Error('Invalid refresh token, please log in again');
        }
    }

    async register (registerData: RegisterDTO): Promise<[string, string]> {
        const existingUser = await this.userRepository.findOne({ where: { username: registerData.username } });
        if (existingUser) {
            throw new Error('Username already exists');
        } 
        if (!this.validatePassword(registerData.password)) {
            throw new Error('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
        }
        
        // Hash the password before saving the user
        let hashedPassword: string;
        try {
            hashedPassword = await hashPassword(registerData.password);
        } catch (error) {
            throw new Error(`Failed to hash password: ${error instanceof Error ? error.message : String(error)}`);
        }
        
        if (!hashedPassword) {
            throw new Error('Password hashing failed - no hash generated');
        }

        // Create user entity with all required fields
        const user = new User();
        user.username = registerData.username;
        user.email = registerData.email;
        user.hashedPassword = hashedPassword;
        user.avatarUrl = null;
        user.lastLogin = new Date();
        
        const savedUser = await this.userRepository.save(user);
        // Access token is client-side: to grant users access to resources (rotate frequently for security)
        // Refresh token is server-side: to extend session continuity
        const accessToken = await generateAccessToken(savedUser.id, ACCESS_TOKEN_EXPIRY);
        const refreshToken = await generateRefreshToken(savedUser.id, REFRESH_TOKEN_EXPIRY);
        await redisClient.set(`access-token:${savedUser.id}`, accessToken, 'EX', ACCESS_TOKEN_EXPIRY);
        await redisClient.set(`refresh-token:${savedUser.id}`, refreshToken, 'EX', REFRESH_TOKEN_EXPIRY);
        return [accessToken, refreshToken];
    }

    async login (loginData: LoginDTO): Promise<[string, string]> {
        const user = await this.userRepository.findOne({ where: { username: loginData.username } });
        if (!user) {
            throw new Error('Invalid username or password');
        }
        const isPasswordValid = await comparePassword(loginData.password, user.hashedPassword);
        if (!isPasswordValid) {
            throw new Error('Invalid username or password');
        }
        // Update lastLogin on successful login
        user.lastLogin = new Date();
        await this.userRepository.save(user);
        
        const accessToken = await generateAccessToken(user.id, ACCESS_TOKEN_EXPIRY);
        const refreshToken = await generateRefreshToken(user.id, REFRESH_TOKEN_EXPIRY);
        await redisClient.set(`access-token:${user.id}`, accessToken, 'EX', ACCESS_TOKEN_EXPIRY);
        await redisClient.set(`refresh-token:${user.id}`, refreshToken, 'EX', REFRESH_TOKEN_EXPIRY);
        return [accessToken, refreshToken];
    }

    public validatePassword(validatePassword:string){
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(validatePassword);
    }

    async logout(userId: string): Promise<{ message: string }> {
        await redisClient.del(`access-token:${userId}`); // Remove the token from Redis to invalidate it
        await redisClient.del(`refresh-token:${userId}`); // Remove the refresh token from Redis
        return { message: 'Logged out successfully' };
    }

}