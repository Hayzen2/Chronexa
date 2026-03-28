/* This file sets up a Bullmq queue for handling email sending 
in the background. It uses Resend to send emails and 
connects to a Redis instance variable. 
The queue automatically processes jobs that contain email 
data and sends the emails. 
*/

import { Queue} from "bullmq";
import { Resend } from 'resend';
import {redisConnection} from '../../config/redis.ts';


// Create a BullMQ queue for email jobs
// The queue will connect to Redis using the provided connection options
// Like a topic in a message broker
// Producers add jobs to this named queue
// Workers listen to the same queue and process the jobs
export const emailQueue = new Queue('emailQueue', {connection: redisConnection});

// Create a Resend email client
// Resend is a modern email service provider API
export const resend = new Resend(process.env.RESEND_API_KEY);

