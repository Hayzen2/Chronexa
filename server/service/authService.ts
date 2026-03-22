import {UserRepository} from "../repository/userRepository.ts";
import {generateToken} from "../utils/JWTUtils.ts";
import {comparePassword} from "../utils/hashUtils.ts";
import {RegisterDTO} from "../dto/requests/registerDTO.ts";
import {LoginDTO} from "../dto/requests/loginDTO.ts";
import {redisClient} from '../config/redis.ts';

export class AuthService {
    private readonly userRepository = UserRepository;

    async register (registerData: RegisterDTO): Promise<string> {
        const existingUser = await this.userRepository.findOne({ where: { username: registerData.username } });
        if (existingUser) {
            throw new Error('Username already exists');
        } 
        if (!this.validatePassword(registerData.password)) {
            throw new Error('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
        }
        const user = this.userRepository.create(registerData);
        await this.userRepository.save(user);
        const accessToken = await generateToken(user);
        await redisClient.set(`access-token:${user.id}`, accessToken, 'EX', 7 * 24 * 3600); // Store token with 7 days expiry
        return accessToken;
    }

    async login (loginData: LoginDTO): Promise<string> {
        const user = await this.userRepository.findOne({ where: { username: loginData.username } });
        if (!user) {
            throw new Error('Invalid username or password');
        }
        const isPasswordValid = await comparePassword(loginData.password, user.hashedPassword);
        if (!isPasswordValid) {
            throw new Error('Invalid username or password');
        }
        const accessToken = await generateToken(user);
        await redisClient.set(`access-token:${user.id}`, accessToken, 'EX', 7 * 24 * 3600); // Store token with 7 days expiry
        return accessToken;
    }

    public validatePassword(validatePassword:string){
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(validatePassword);
    }

    async logout(userId: string): Promise<{ message: string }> {
        await redisClient.del(`access-token:${userId}`); // Remove the token from Redis to invalidate it
        return { message: 'Logged out successfully' };
    }

}