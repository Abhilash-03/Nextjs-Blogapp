import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(request) {
    try {
        // Auth.js v5 uses AUTH_SECRET, fallback to NEXTAUTH_SECRET for compatibility
        const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
        const token = await getToken({ req: request, secret });
        
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
