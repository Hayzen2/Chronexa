import { Router, Request, Response } from "express";
import { UserController } from "../controller/userController.ts";
import authMiddleware from "../middleware/authMiddleware.ts";
import { uploadAvatar } from "../middleware/uploadMiddleware.ts";

const router = Router();
const userController = new UserController();

router.get("/view", authMiddleware, (req: Request, res: Response) => userController.getUserProfile(req, res));
// Single: means accept a single file
router.put("/edit", authMiddleware, uploadAvatar.single('avatar'), (req: Request, res: Response) => userController.updateUserProfile(req, res));

export default router;