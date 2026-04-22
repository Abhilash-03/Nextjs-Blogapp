import { connectToDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        await connectToDB();
        const user = await User.findOne({ email: session.user.email }).select('-password');
        
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        
        return NextResponse.json({ user }, { status: 200 });
        
    } catch (error) {
        console.log('Get Profile Error:', error);
        return NextResponse.json({ error: 'Failed to get profile' }, { status: 500 });
    }
};

export const PATCH = async (req) => {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const { name, image } = await req.json();
        
        if (!name || name.trim().length === 0) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }
        
        await connectToDB();
        
        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            { name: name.trim(), ...(image && { image }) },
            { new: true }
        ).select('-password');
        
        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        
        return NextResponse.json({ 
            message: 'Profile updated successfully',
            user: updatedUser 
        }, { status: 200 });
        
    } catch (error) {
        console.log('Update Profile Error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
};
