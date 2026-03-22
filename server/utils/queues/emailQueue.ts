/* This file sets up a Bullmq queue for handling email sending 
in the background. It uses Nodemailer to send emails and 
connects to a Redis instance variable. 
The queue automatically processes jobs that contain email 
data and sends the emails. 
*/

import { Queue} from "bullmq";
import nodemailer from 'nodemailer';
import {redisConnection} from '../../config/redis.ts';


// Create a BullMQ queue for email jobs
// The queue will connect to Redis using the provided connection options
// Like a topic in a message broker
// Producers add jobs to this named queue
// Workers listen to the same queue and process the jobs
export const emailQueue = new Queue('emailQueue', {connection: redisConnection});

// Create a reusable SMTP client configuration
// It is only a prepared transporter object that can be used to send emails later
export const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: Number(process.env.MAIL_PORT) === 465, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

