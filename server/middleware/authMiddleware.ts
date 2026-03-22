import {Request, Response, NextFunction} from "express";
import { verifyToken } from "../utils/JWTUtils.ts";

function authMiddleware(
    req: Request, 
    res: Response, 
    next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1]; // Ex: "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    try {
        const decoded = verifyToken(token);
        req.userId = decoded.userId; // Attach userId of the current user to request
        if (!req.userId) {
            return res.status(401).json({ message: "Invalid token" });
        }
        next(); // Proceed to the next middleware or route handler 
    } catch (error) {
        return res.status(401).json({ message: "Invalid token", error });
    }
};

export default authMiddleware;