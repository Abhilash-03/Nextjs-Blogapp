import { connectToDB } from "@/lib/mongodb";
import { Post } from "@/models/Post";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        await connectToDB();
        const posts = await Post.find().sort({ createdAt: -1 });
        return NextResponse.json({totalPosts: posts.length, posts}); 
    } catch(error) {
        return NextResponse.json({message: 'Error fetching posts', status: 500})
    }
}

export async function POST(request) {
    try {
        const { title, content, slug} = await request.json();
        const generateSlug = title.toLowerCase().split(' ').join('-');
        if(!title || !content) {
            return NextResponse.json({message: 'Missing fields.', status: 400})
        }
        await connectToDB();
        const newPost = await Post.create({title, slug: generateSlug, content});
        return NextResponse.json(newPost, {status: 201});
    } catch (error) {
        return NextResponse.json({message: 'Error creating post', status: 500})
    }
}