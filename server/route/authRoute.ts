import { Router, Request, Response } from "express";
import { AuthController } from "../controller/authController.ts";
import authMiddleware from "../middleware/authMiddleware.ts";

const router = Router();
const authController = new AuthController();

router.post("/register", (req: Request, res: Response) => authController.register(req, res));
router.post("/login", (req: Request, res: Response) => authController.login(req, res));
router.post("/forgot-password", (req: Request, res: Response) => authController.forgotPassword(req, res));
router.post("/reset-password", (req: Request, res: Response) => authController.resetPassword(req, res));
router.post("/logout", authMiddleware, (req: Request, res: Response) => authController.logout(req, res));

export default router;