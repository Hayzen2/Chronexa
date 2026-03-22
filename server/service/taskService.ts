import { TaskRepository } from "../repository/taskRepository.ts";
import { CreateTaskDTO } from "../dto/requests/createTaskDTO.ts";

export class TaskService {
    private readonly taskRepository = TaskRepository;

    async createTask(taskData: CreateTaskDTO, userId: string) {
        const task = this.taskRepository.create({
            ...taskData,
            userId
        });
        return await this.taskRepository.save(task);
    }

    async getTasksByUser(userId: string) {
        return await this.taskRepository.find({ where: { userId } });
    }

    async getTaskById(id: string, userId: string) {
        const task = await this.taskRepository.findOne({ where: { id, userId } });
        if (!task) {
            throw new Error('Task not found');
        }
        return task;
    }

    async updateTask(id: string, updateData: Partial<CreateTaskDTO>, userId: string) {
        const task = await this.getTaskById(id, userId);
        Object.assign(task, updateData); // Update task with new data
        return await this.taskRepository.save(task);
    }

    async deleteTask(id: string, userId: string) {
        const task = await this.getTaskById(id, userId);
        await this.taskRepository.remove(task);
        // since remove doesn't return anything
        return { message: 'Task deleted successfully' }; 
    }

}