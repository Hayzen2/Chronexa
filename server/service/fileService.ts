import { minioClient } from "../config/minio.ts";

const OBJECT_STORAGE_AVATAR_BUCKET = String(process.env.OBJECT_STORAGE_AVATAR_BUCKET);
const OBJECT_STORAGE_ATTACHMENT_BUCKET = String(process.env.OBJECT_STORAGE_ATTACHMENT_BUCKET);

export class FileService {
    async uploadAvatar(userId: string, file: Express.Multer.File): Promise<string> {
        if(!file) {
            throw new Error("No file provided");
        }
        return await this.uploadFileToMinio(userId, file, OBJECT_STORAGE_AVATAR_BUCKET);
    }

    async uploadAttachment(taskId: string, file: Express.Multer.File): Promise<string> {
        if(!file) {
            throw new Error("No file provided");
        }
        return await this.uploadFileToMinio(taskId, file, OBJECT_STORAGE_ATTACHMENT_BUCKET);
    }

    async uploadFileToMinio(
        id: string,
        file: Express.Multer.File, 
        bucketName: string
    ): Promise<string> {
        // Remove extension from original name
        const fileFullName = file.originalname;
        //ex: taskId_timestamp_filename.ext 
        // or userId_timestamp_filename.ext
        const uniqueFileName = `${id}_${Date.now()}_${fileFullName}`;  
        
        try {
            await minioClient.putObject(bucketName, uniqueFileName, file.buffer, file.size, {
                'Content-Type': file.mimetype,
            });
            // Return the public URL of the uploaded file
            return process.env.OBJECT_STORAGE_URL + "/" + bucketName + "/" + uniqueFileName;
        } catch (error) {
            console.error("Error uploading file to MinIO:", error);
            throw new Error("Failed to upload file");
        }
    }

    async deleteFilesByTaskId(taskId: string) {
        try {
            return await minioClient.removeObjects(OBJECT_STORAGE_ATTACHMENT_BUCKET, [taskId + "_"]);
            
        } catch (error) {
            console.error("Error deleting files from MinIO:", error);
            throw new Error("Failed to delete files");
        }
    }

    async deleteFileByName(fileName: string) {
        try {
            await minioClient.removeObject(OBJECT_STORAGE_ATTACHMENT_BUCKET, fileName);
        } catch (error) {
            console.error("Error deleting file from MinIO:", error);
            throw new Error("Failed to delete file");
        }
    }

    async deleteFilesByNames(fileNames: string[]) {
        try {
            await minioClient.removeObjects(OBJECT_STORAGE_ATTACHMENT_BUCKET, fileNames);
        } catch (error) {
            console.error("Error deleting files from MinIO:", error);
            throw new Error("Failed to delete files");
        }
    }
}