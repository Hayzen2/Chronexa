import {Worker} from "bullmq";
import { resend } from "../queues/emailQueue.ts";
import {redisConnection} from '../../config/redis.ts';

const NUMBER_OF_CONCURRENT_EMAILS = 5; // Process up to 5 email jobs concurrently

// Create a BullMQ worker that listens to the 'emailQueue' 
// When a job is added to the queue, this worker will process it 
// by sending the email using Resend (5 concurrent emails / time)
export const emailWorker = new Worker('emailQueue', async job => {
    try {
        if(!job.data.to || !job.data.subject || !job.data.html) {
            throw new Error('Invalid email job data: missing required fields');
        }
        const response = await resend.emails.send({
            from: job.data.from || process.env.MAIL_FROM,
            to: job.data.to,
            subject: job.data.subject,
            html: job.data.html,
        });
        console.log(`Email sent to ${job.data.to}:`, response);
    } catch (error) {
        console.error(`Failed to send email to ${job.data.to}:`, error);
        throw error; // Let Bull handle retries based on the job options
    }
}, { connection: redisConnection, concurrency: NUMBER_OF_CONCURRENT_EMAILS });