import { UserRepository } from '../repository/userRepository.ts';
import {redisClient} from '../config/redis.ts';
import crypto from 'node:crypto';
import {readFile} from 'node:fs/promises';
import process from 'node:process'
import { hashPassword } from '../utils/hashUtils.ts';
import path from 'node:path';
import { emailQueue } from '../utils/queues/emailQueue.ts';
import { ForgotPasswordDTO } from '../dto/requests/forgotPasswordDTO.ts';
import { AuthService } from './authService.ts';

const FRONTEND_URL = String(process.env.FRONTEND_URL);

if (!FRONTEND_URL) {
  throw new Error("FRONTEND_URL not defined");
}

export class ForgotPasswordService {
    private readonly userRepository = UserRepository;
    private readonly authService ;

    constructor() {
        this.authService = new AuthService();
    }

    async forgotPassword(forgotPasswordData: ForgotPasswordDTO): Promise<{ success: boolean; message: string }> {
        try {
            const user = await this.userRepository.findOne({ where: { email: forgotPasswordData.email } });
            if (!user) {
                return { success: true, message: 'If an account with that email exists, a password reset link has been sent.' };
            }
            
            const resetToken = crypto.randomBytes(32).toString('hex');
            const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

            const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
            
            const template = await readFile(path.resolve(process.cwd(), 'templates/emails/forgotPassword.html'), 'utf-8');
            const htmlContent = template.replace('{{resetLink}}', resetLink)
                                        .replace('{{name}}', user.username)
                                        .replace('{{minutes}}', '60');
            
            // Key: tokenHash
            // Value: userId
            // Expiry: 1 hour
            await redisClient.set(`reset-email:${tokenHash}`, user.id, 'EX', 3600); 
        
            await emailQueue.add('sendResetEmail',{
                from: process.env.MAIL_FROM,
                to: user.email,
                replyTo: process.env.MAIL_REPLY_TO,
                subject: '[Chronexa] Password Reset Request',
                html: htmlContent,
                headers: {
                    "Auto-Submitted": "auto-generated", // Mark email as auto-generated to prevent auto-replies
                    "X-Auto-Response-Suppress": "All", // Suppress auto-replies and out-of-office responses
                    "Precedence": "bulk", // Prevent auto-replies and out-of-office responses
                }
            }, {
                attempts: 3, // Retry up to 3 times if email sending fails
                backoff:{
                    // The delay will increase exponentially with each retry attempt
                    type: 'exponential', 
                    delay: 30000, // Wait 30 seconds before retrying
                },
                removeOnComplete: true, // Remove job from queue after successful completion
                removeOnFail: false, // Keep failed jobs in the queue for debugging
            });

            return {success: true, message: 'If an account with that email exists, a password reset link has been sent.'};
        } catch (error) {
            console.error('Error adding email job to queue:', error);
            throw new Error('Failed to send password reset email');
        }
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        try{
            if(!this.authService.validatePassword(newPassword)) {
                throw new Error('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
            }
            // Hash the token to find the corresponding user ID in Redis
            const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
            const userId = await redisClient.get(`reset-email:${tokenHash}`);
            // If token is invalid or expired, userId will be null
            if (!userId) {
                throw new Error('Invalid or expired token');
            }
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new Error('User not found');
            }
            user.hashedPassword = await hashPassword(newPassword); // Assuming password hashing is handled in the entity's setter
            await this.userRepository.save(user);
            await redisClient.del(`reset-email:${tokenHash}`); // Invalidate the token after successful password reset
        } catch (error) {
            console.error('Error resetting password:', error);
            throw new Error('Failed to reset password');
        }
    }
}

 