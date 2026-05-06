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
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }
                await connectToDB();
                const user = await User.findOne({ email: credentials.email });

                if (!user || !user.password) throw new Error('Invalid credentials');

                const isMatch = await bcrypt.compare(credentials.password as string, user.password);

                if (!isMatch) throw new Error('Invalid credentials');

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role
                };
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
    secret: process.env.NEXTAUTH_SECRET
});
