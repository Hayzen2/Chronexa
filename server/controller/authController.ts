import {Response, Request} from "express";
import { AuthService } from "../service/authService.ts"; 
import { ForgotPasswordService } from "../service/forgotPassword.ts";
import  { getRefreshCookieOptions, REFRESH_COOKIE_NAME } from "../utils/cookieUtils.ts";

export class AuthController {
    private readonly authService: AuthService;
    private readonly forgotPasswordService: ForgotPasswordService;

    constructor() {
        this.authService = new AuthService();
        this.forgotPasswordService = new ForgotPasswordService();
    }

    async refreshToken(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] ?? req.body?.refreshToken;
            if (!refreshToken) {
                return res.status(400).json({ message: "Refresh token is required" });
            }
            const [accessToken, newRefreshToken] = await this.authService.refreshToken(refreshToken);
            res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, getRefreshCookieOptions());
            res.status(200).json({ accessToken });
        } catch (error) {
            res.status(400).json({ message: "Error refreshing token", error });
        }
    }
    async register(req: Request, res: Response) {
        try {
            const [accessToken, refreshToken] = await this.authService.register(req.body);
            res.cookie(REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions());
            res.status(201).json({message: "User registered successfully", accessToken});
        } catch (error) {
            res.status(400).json({ message: "Error registering user", error });
        }   
    }

    async login(req: Request, res: Response) {
        try {
            const [accessToken, refreshToken] = await this.authService.login(req.body);
            res.cookie(REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions());
            res.status(200).json({ message: "Login successful", accessToken });
        } catch (error) {
            res.status(400).json({ message: "Error logging in", error });
        }
    }
    
    async forgotPassword(req: Request, res: Response) {
        try {
            await this.forgotPasswordService.forgotPassword(req.body.email);
            res.status(200).json({ message: "Password reset email sent if the email exists" });
        } catch (error) {
            res.status(400).json({ message: "Error processing forgot password", error });
        }
    }
    async resetPassword(req: Request, res: Response) {
        try {
            const { token, newPassword } = req.body;
            await this.forgotPasswordService.resetPassword(token, newPassword);
            res.status(200).json({ message: "Password reset successful" });
        } catch (error) {
            res.status(400).json({ message: "Error resetting password", error });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            await this.authService.logout(userId);
            // Clear the refresh token cookie on logout
            const isProduction = process.env.NODE_ENV === 'production';
            res.clearCookie(REFRESH_COOKIE_NAME, {
                httpOnly: true,
                secure: isProduction,
                sameSite: 'lax',
                path: '/api/auth',
            });
            res.status(200).json({ message: "Logout successful" });
        } catch (error) {
            res.status(400).json({ message: "Error logging out", error });
        }
    }
}