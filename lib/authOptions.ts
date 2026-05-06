
import GoogleProvider from 'next-auth/providers/google';
import CredentialProvider from 'next-auth/providers/credentials';
import { connectToDB } from './mongodb';
import { User } from '@/models/User';
import bcrypt from 'bcrypt';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
           clientId: process.env.GOOGLE_CLIENT_ID!,
           clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialProvider({
            name: 'credentials',
            credentials: {
                email: {},
                password: {}
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }
                await connectToDB();
                const user = await User.findOne({email : credentials.email });

                if(!user || !user.password) throw new Error('Invalid credentials')

                const isMatch = await bcrypt.compare(credentials.password, user.password);

                if(!isMatch) throw new Error('Invalid credentials');

                return user;
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
           await connectToDB();
        //    console.log("Google Data", user);
        //    console.log("Account", account);
        //    console.log("Profile", profile);
           if(account?.provider === 'google') {
            const exisitingUser = await User.findOne({ email: user.email});
            if(!exisitingUser) {
                await User.create({
                    name: user.name,
                    email: user.email,
                    password: null,
                    image: user.image,
                    role: 'user'
                })
            }
           }
           return true
        },
        async session({ session }){
            await connectToDB();
            if (!session.user?.email) return session;
            const dbUser = await User.findOne({ email: session.user.email});
            if (dbUser) {
                session.user.id = dbUser._id?.toString();
                session.user.role = dbUser.role;
            }
            return session;
        },
    
    },
    pages: {
        signIn: '/auth/signin',
    },
    session: {
        strategy: 'jwt' as const,
    },
    secret: process.env.NEXTAUTH_SECRET
}