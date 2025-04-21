
import GoogleProvider from 'next-auth/providers/google';
import CredentialProvider from 'next-auth/providers/credentials';
import { connectToDB } from './mongodb';
import { User } from '@/models/User';
import bcrypt from 'bcrypt';

export const authOptions = {
    providers: [
        GoogleProvider({
           clientId: process.env.GOOGLE_CLIENT_ID,
           clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        CredentialProvider({
            name: 'credentials',
            credentials: {
                email: {},
                password: {}
            },

            async authorize(credentials) {
                await connectToDB();
                const user = await User.findOne({email : credentials?.email });

                if(!user || !user.password) throw new Error('Invalid credentials')

                const isMatch = await bcrypt.compare(credentials.password, user.password);

                if(!isMatch) throw new Error('Invalid credentials');

                return user;
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
           await connectToDB();
        //    console.log("Google Data", user);
        //    console.log("Account", account);
        //    console.log("Profile", profile);
           if(account.provider === 'google') {
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
            const dbUser = await User.findOne({ email: session.user.email});
            session.user.id = dbUser._id;
            session.user.role = dbUser.role;
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
}