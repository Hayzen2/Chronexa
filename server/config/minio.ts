import {Client} from "minio"

// Create a MinIO client instance 
// This client will be used throughout the application to interact with MinIO
export const minioClient = new Client({
    endPoint: String(process.env.OBJECT_STORAGE_ENDPOINT),
    port: Number(process.env.OBJECT_STORAGE_PORT) || 9000,
    useSSL: process.env.OBJECT_STORAGE_USE_SSL === "true",
    accessKey: String(process.env.OBJECT_STORAGE_ACCESS_KEY),
    secretKey: String(process.env.OBJECT_STORAGE_SECRET_KEY)
});