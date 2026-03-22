import {Response, Request} from "express";
import { TaskService } from "../service/taskService.ts"; 
import { FileService } from "../service/fileService.ts"; 

export class TaskController {
    private readonly taskService: TaskService;
    private readonly fileService: FileService;

    constructor() {
        this.taskService = new TaskService();
        this.fileService = new FileService();
    }
    async createTask(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const task = await this.taskService.createTask(req.body, userId);
            res.status(201).json(task);
        } catch (error) {            
            res.status(500).json({ message: "Error creating task", error });
        }
    }
    async getTasksByUserId(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if(!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const tasks = await this.taskService.getTasksByUser(userId);
            res.status(200).json(tasks);
        } catch (error) {
            res.status(500).json({ message: "Error fetching tasks", error });
        }
    }
    async getTaskById(req: Request<{id: string}>, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const task = await this.taskService.getTaskById(req.params.id, userId);
            res.status(200).json(task);
        } catch (error) {
            res.status(404).json({ message: "Task not found using this ID", error });
        }
    }

    async updateTask(req: Request<{id: string}>, res: Response) {
        try{
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            if (!req.params.id) {
                return res.status(400).json({ message: "Task ID is required" });
            }
            if(req.body.filesToDelete && Array.isArray(req.body.filesToDelete)){
                await this.fileService.deleteFilesByNames(req.body.filesToDelete);
            }
            const updatedTask = await this.taskService.updateTask(req.params.id, req.body, userId);
            res.status(200).json(updatedTask);
        } catch (error) {
            res.status(404).json({ message: "Task not found using this ID", error });
        }
    }

    async deleteTask(req: Request<{id: string}>, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            if (!req.params.id) {
                return res.status(400).json({ message: "Task ID is required" });
            }
            await this.taskService.deleteTask(req.params.id, userId);
            await this.fileService.deleteFilesByTaskId(req.params.id); // Delete associated files from MinIO
            res.status(200).json({ message: "Task deleted successfully" });
        } catch (error) {
            res.status(404).json({ message: "Task not found using this ID", error });
        }
    }
}