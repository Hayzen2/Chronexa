import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import process from 'node:process';
import authRoute from './route/authRoute.ts';
import userRoute from './route/userRoute.ts';
import taskRoute from './route/taskRoute.ts';
import { initializeMinio } from "./config/minioInitializer.ts";

const app = express();
const allowedOrigins = new Set([
    process.env.FRONTEND_URL
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

initializeMinio();

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/task", taskRoute);


// Start the server and listen on the specified port
app.listen(process.env.BACKEND_PORT, () => {
    console.log(`Server is running on port ${process.env.BACKEND_PORT}`);
});