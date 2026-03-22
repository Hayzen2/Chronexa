import {minioClient} from "./minio.ts";

if(!process.env.OBJECT_STORAGE_AVATAR_BUCKET || !process.env.OBJECT_STORAGE_ATTACHMENT_BUCKET) {
    console.error("MinIO bucket names are not defined in environment variables.");
    process.exit(1);
}
const OBJECT_STORAGE_AVATAR_BUCKET = String(process.env.OBJECT_STORAGE_AVATAR_BUCKET);
const OBJECT_STORAGE_ATTACHMENT_BUCKET = String(process.env.OBJECT_STORAGE_ATTACHMENT_BUCKET);

export const initializeMinio = async () => {
    try {
        // Check if the avatar bucket exists, if not create it
        const avatarBucketExists = await minioClient.bucketExists(OBJECT_STORAGE_AVATAR_BUCKET);
        if (!avatarBucketExists) {
            await minioClient.makeBucket(OBJECT_STORAGE_AVATAR_BUCKET);
            console.log(`Created MinIO bucket: ${OBJECT_STORAGE_AVATAR_BUCKET}`);
        }

        // Check if the attachment bucket exists, if not create it
        const attachmentBucketExists = await minioClient.bucketExists(OBJECT_STORAGE_ATTACHMENT_BUCKET);
        if (!attachmentBucketExists) {
            await minioClient.makeBucket(OBJECT_STORAGE_ATTACHMENT_BUCKET);
            console.log(`Created MinIO bucket: ${OBJECT_STORAGE_ATTACHMENT_BUCKET}`);
        }
    } catch (error) {
        console.error("Error initializing MinIO:", error);
    }
}