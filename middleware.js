import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((request) => {
    const { auth: session, nextUrl } = request;
    
    // If no session and trying to access protected routes, redirect to sign in
    if (!session) {
        const signInUrl = new URL('/auth/signin', nextUrl);
        signInUrl.searchParams.set('callbackUrl', nextUrl.pathname);
        return NextResponse.redirect(signInUrl);
    }
    
    return NextResponse.next();
});

// Protect these routes
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/edit/:path*'
    ]
};
