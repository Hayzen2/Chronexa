import { CookieOptions } from "express";

const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
export const REFRESH_COOKIE_NAME = 'refreshToken';

// Helper function to get cookie options based on environment
export function getRefreshCookieOptions(): CookieOptions {
    const isProduction = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: isProduction, // Use secure cookies in production (HTTPS)
        // Protect against CSRF attacks while allowing some cross-site usage
        // CSRF attacks: attacker site triggers requests from user browser; 
        // browser may include cookies automatically
        // => SameSite 'lax' allows cookies to be sent on same-site requests 
        // and top-level navigation GET requests from other sites, but not on POST requests or iframes
        sameSite: 'lax',
        maxAge: REFRESH_COOKIE_MAX_AGE_MS, // Set the cookie to expire after 7 days
        path: '/api/auth', // Restrict cookie to auth routes
    };
}