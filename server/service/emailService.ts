import { Resend } from 'resend';

const API_KEY = process.env.RESEND_API_KEY;
const resend = new Resend(API_KEY);
const FROM_EMAIL = process.env.MAIL_FROM;

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const response = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject,
            html,
        });

        console.log('Email sent:', response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};