import { connectToDB } from "@/lib/mongodb";
import { Post } from "@/models/Post";
import { NextResponse } from "next/server";


export const GET = async() => {
    try {
        await connectToDB();
        const posts = await Post.find().populate('author', 'name');
        return NextResponse.json({ posts });
    } catch (error) {
        console.log("Error fetching admin Posts", error.message);
        return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 });
    }
}