import { Router, Request, Response } from "express";
import { TaskController } from "../controller/taskController.ts";
import authMiddleware from "../middleware/authMiddleware.ts";
import { uploadFile } from "../middleware/uploadMiddleware.ts";
const router = Router();
const taskController = new TaskController();

//array: means accept multiple files
router.post("/create", authMiddleware, uploadFile.array("file"), (req, res) => taskController.createTask(req, res));
router.get("/view-all", authMiddleware, (req, res) => taskController.getTasksByUserId(req, res));
router.get("/view/:id", authMiddleware, (req: Request<{ id: string }>, res: Response) => taskController.getTaskById(req, res));
router.put("/edit/:id", authMiddleware, uploadFile.array("file"), (req: Request<{id: string}>, res: Response) => taskController.updateTask(req, res));
router.delete("/delete/:id", authMiddleware, (req: Request<{id: string}>, res: Response) => taskController.deleteTask(req, res));
export default router;