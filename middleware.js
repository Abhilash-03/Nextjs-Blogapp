import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(request) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    // If no token and trying to access protected routes, redirect to sign in
    if (!token) {
        const signInUrl = new URL('/auth/signin', request.url);
        signInUrl.searchParams.set('callbackUrl', request.url);
        return NextResponse.redirect(signInUrl);
    }
    
    return NextResponse.next();
}

// Protect these routes
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/edit/:path*'
    ]
};
