import { connectToDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { NextResponse } from "next/server"


export const GET = async() => {
    try {
        await connectToDB();
        const users = await User.find().select('-password');
        return Response.json({ users });
    } catch (error) {
        console.log("Admin Users Error", error.message);
        return NextResponse.json({ error: 'Failed to fetch users', status: 500});
    }
}