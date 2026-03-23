import 'dotenv/config';

import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import process from 'node:process';
import authRoute from './route/authRoute.ts';
import userRoute from './route/userRoute.ts';
import taskRoute from './route/taskRoute.ts';
import { initializeMinio } from "./config/minioInitializer.ts";
import { dataSource } from "./config/db.ts";

const FRONTEND_URL = String(process.env.FRONTEND_URL);
const BACKEND_PORT = Number(process.env.BACKEND_PORT);
if(!FRONTEND_URL) {
    console.error("FRONTEND_URL is not defined in environment variables.");
    process.exit(1);
}
if(!BACKEND_PORT) {
    console.error("BACKEND_PORT is not defined in environment variables.");
    process.exit(1);
}
const app = express();
const allowedOrigins = new Set([
    FRONTEND_URL
]);
// Middleware that parses incoming request bodies with JSON payload
// Without this, your routes won't be able to access JSON data (req.body)
app.use(express.json()); 

// CORS configuration to allow requests from outside origins
app.use(
    cors({
        origin(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void {
            if (!origin || allowedOrigins.has(origin)) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'));
        }
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