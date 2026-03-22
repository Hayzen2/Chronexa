import { TaskStatus } from "../../enum/taskStatus.ts";

export interface CreateTaskDTO {
    title: string;
    description?: string;
    dueDate: Date;
    status: TaskStatus;
}