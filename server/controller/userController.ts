import { Request, Response } from "express";
import { UserService } from "../service/userService.ts";
import { FileService } from "../service/fileService.ts";

export class UserController {
    private readonly userService: UserService;
    private readonly fileService: FileService;

    constructor() {
        this.userService = new UserService();
        this.fileService = new FileService();
    }

    async getUserProfile(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const userProfile = await this.userService.getUserProfile(userId);
            res.status(200).json(userProfile);
        } catch (error) {
            res.status(500).json({ message: "Error fetching user profile", error });
        }
    }

    async updateUserProfile(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            // Only allow updating avatar, username and email for now
            const updateData: Partial<{ username: string; avatarUrl: string }> = {};
            if (req.body.username !== undefined) {
                updateData.username = req.body.username;
            }
            // Check if a new avatar file is uploaded
            if (req.file) {
                const avatarUrl = await this.fileService.uploadAvatar(userId, req.file);
                updateData.avatarUrl = avatarUrl;
            }

            const updatedProfile = await this.userService.updateUserProfile(userId, updateData);
            res.status(200).json(updatedProfile);
        } catch (error) {
            res.status(500).json({ message: "Error updating user profile", error });
        }
    }
}