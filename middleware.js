import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(request) {
    try {
        // Auth.js v5 uses AUTH_SECRET, fallback to NEXTAUTH_SECRET for compatibility
        const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
        
        // Try to get token with Auth.js v5 cookie name first
        let token = await getToken({ 
            req: request, 
            secret,
            cookieName: '__Secure-authjs.session-token'  // Production cookie name
        });
        
        // Fallback to development cookie name
        if (!token) {
            token = await getToken({ 
                req: request, 
                secret,
                cookieName: 'authjs.session-token'  // Development cookie name
            });
        }
        
        // Fallback to old next-auth cookie names
        if (!token) {
            token = await getToken({ req: request, secret });
        }
        
        console.log('Middleware - Token found:', !!token);
        
        // If no token and trying to access protected routes, redirect to sign in
        if (!token) {
            const signInUrl = new URL('/auth/signin', request.url);
            signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
            return NextResponse.redirect(signInUrl);
        }
        
        return NextResponse.next();
    } catch (error) {
        console.error('Middleware error:', error);
        // On error, redirect to sign in
        const signInUrl = new URL('/auth/signin', request.url);
        return NextResponse.redirect(signInUrl);
    }
}

// Protect these routes
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/edit/:path*'
    ]
};
