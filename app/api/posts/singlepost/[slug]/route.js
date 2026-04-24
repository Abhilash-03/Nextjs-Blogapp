import { connectToDB } from "@/lib/mongodb";
import { Post } from "@/models/Post";
import { NextResponse } from "next/server";

export const GET = async(req, {params})=> {
    try {
        await connectToDB();
        const { slug } = await params;
        const singlePost = await Post.findOne({slug}).lean();
        if(!singlePost) return NextResponse.json({ message: 'Post not found' }, { status: 404 });

        return NextResponse.json(singlePost, {status: 200});
    } catch (error) {
        console.log("Error to fetch single post", error.message);
        return NextResponse.json({ error: 'Post not fetched' }, { status: 500 });
    }
}