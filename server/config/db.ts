import { DataSource } from 'typeorm'
// Required for TypeORM to work properly
import 'reflect-metadata' 
import { User } from '../entity/userEntity.ts'
import { Task } from '../entity/taskEntity.ts'

const DB_HOST = String(process.env.DB_HOST);
const DB_PORT = Number(process.env.DB_PORT);
const DB_USER = String(process.env.DB_USER);
const DB_PASSWORD = String(process.env.DB_PASSWORD);
const DB_NAME = String(process.env.DB_NAME);
const DB_SYNCHRONIZE = String(process.env.DB_SYNCHRONIZE).toLowerCase() === 'true';

if(!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    console.error("Database connection parameters are not fully defined in environment variables.");
    process.exit(1);
}

// Create a new DataSource instance for TypeORM
// This configuration will be used to connect to the PostgreSQL database
export const dataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    // Keep schema sync opt-in to avoid pg client deprecation warnings during init.
    synchronize: DB_SYNCHRONIZE,
    logging: false, // Disable logging for production
    entities: [User, Task],
})

