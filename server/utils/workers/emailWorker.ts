import {Worker} from "bullmq";
import { transporter } from "../queues/emailQueue.ts";
import {redisConnection} from '../../config/redis.ts';

const NUMBER_OF_CONCURRENT_EMAILS = 5; // Process up to 5 email jobs concurrently

// Create a BullMQ worker that listens to the 'emailQueue' 
// When a job is added to the queue, this worker will process it 
// by sending the email using the transporter (5 concurrent emails / time)
export const emailWorker = new Worker('emailQueue', async job => {
    try {
        if(!job.data.to || !job.data.subject || !job.data.html) {
            throw new Error('Invalid email job data: missing required fields');
        }
        await transporter.sendMail(job.data);
        console.log(`Email sent to ${job.data.to}`);
    } catch (error) {
        console.error(`Failed to send email to ${job.data.to}:`, error);
        throw error; // Let Bull handle retries based on the job options
    }
}, { connection: redisConnection, concurrency: NUMBER_OF_CONCURRENT_EMAILS });