import 'dotenv/config';

import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import process from 'node:process';
import authRoute from './route/authRoute.ts';
import userRoute from './route/userRoute.ts';
import taskRoute from './route/taskRoute.ts';
import { initializeMinio } from "./config/minioInitializer.ts";
import { dataSource } from "./config/db.ts";

const FRONTEND_URL = String(process.env.FRONTEND_URL);
const BACKEND_PORT = Number(process.env.BACKEND_PORT);
const OBJECT_STORAGE_URL = String(process.env.OBJECT_STORAGE_URL);
if(!FRONTEND_URL) {
    console.error("FRONTEND_URL is not defined in environment variables.");
    process.exit(1);
}
if(!BACKEND_PORT) {
    console.error("BACKEND_PORT is not defined in environment variables.");
    process.exit(1);
}
if(!OBJECT_STORAGE_URL) {
    console.error("OBJECT_STORAGE_URL is not defined in environment variables.");
    process.exit(1);
}
const app = express();
const allowedOrigins = new Set([
    FRONTEND_URL,
    OBJECT_STORAGE_URL
]);
// Middleware that parses incoming request bodies with JSON payload
// This allows you to access the data sent in the request body via req.body in your routes
app.use(express.json());
// Middleware that parses cookies from incoming requests
// This allows you to access cookies via req.cookies in your routes 
app.use(cookieParser()); 

// CORS configuration to allow requests from outside origins
app.use(
    cors({
        origin(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void {
            if (!origin || allowedOrigins.has(origin)) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    })
);

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/task", taskRoute);

async function startServer(): Promise<void> {
    console.log("Starting DB init...");

    await dataSource.initialize();

    console.log("DB initialized");

    console.log(
      "Loaded entities:",
      dataSource.entityMetadatas.map(e => e.name)
    );

    await initializeMinio();

    app.listen(BACKEND_PORT, () => {
        console.log(`Server is running on port ${BACKEND_PORT}`);
    });
}
startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});