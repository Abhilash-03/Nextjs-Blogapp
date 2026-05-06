import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { connectToDB } from './mongodb';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
           clientId: process.env.GOOGLE_CLIENT_ID!,
           clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },

            async authorize(credentials) {
                console.log('Auth attempt with credentials:', { email: credentials?.email, hasPassword: !!credentials?.password });
                
                if (!credentials?.email || !credentials?.password) {
                    console.log('Missing email or password');
                    return null;
                }
                
                try {
                    await connectToDB();
                    const user = await User.findOne({ email: credentials.email });
                    console.log('User found:', !!user, user?.email);

                    if (!user) {
                        console.log('User not found');
                        return null;
                    }
                    
                    if (!user.password) {
                        console.log('User has no password (OAuth user)');
                        return null;
                    }

                    const isMatch = await bcrypt.compare(credentials.password as string, user.password);
                    console.log('Password match:', isMatch);

                    if (!isMatch) {
                        console.log('Password mismatch');
                        return null;
                    }

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: user.role
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            await connectToDB();
            if (account?.provider === 'google') {
                const existingUser = await User.findOne({ email: user.email });
                if (!existingUser) {
                    await User.create({
                        name: user.name,
                        email: user.email,
                        password: null,
                        image: user.image,
                        role: 'user'
                    });
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                await connectToDB();
                const dbUser = await User.findOne({ email: user.email });
                if (dbUser) {
                    token.id = dbUser._id.toString();
                    token.role = dbUser.role;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
});
