import {dataSource} from "../config/db.ts";
import { Task } from "../entity/taskEntity.ts";

export const TaskRepository = dataSource.getRepository(Task);