import {Response, Request} from "express";
import { AuthService } from "../service/authService.ts"; 
import { ForgotPasswordService } from "../service/forgotPassword.ts";

export class AuthController {
    private readonly authService: AuthService;
    private readonly forgotPasswordService: ForgotPasswordService;

    constructor() {
        this.authService = new AuthService();
        this.forgotPasswordService = new ForgotPasswordService();
    }
    async register(req: Request, res: Response) {
        try {
            const accessToken = await this.authService.register(req.body);
            res.status(201).json({ accessToken });
        } catch (error) {
            res.status(400).json({ message: "Error registering user", error });
        }   
    }

    async login(req: Request, res: Response) {
        try {
            const accessToken = await this.authService.login(req.body);
            res.status(200).json({ accessToken });
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
            res.status(200).json({ message: "Logout successful" });
        } catch (error) {
            res.status(400).json({ message: "Error logging out", error });
        }
    }
}