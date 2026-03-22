import {dataSource} from "../config/db.ts";
import { User } from "../entity/userEntity.ts";

export const UserRepository = dataSource.getRepository(User);