import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Post } from "@/models/Post";

// POST - Increment view count
export async function POST(req, { params }) {
    try {
        await connectToDB();
        const { id } = await params;

        // Find post by slug or ID and increment views
        const post = await Post.findOneAndUpdate(
            { $or: [{ slug: id }, { _id: id }] },
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json({ views: post.views });
    } catch (error) {
        console.error("Error incrementing views:", error);
        return NextResponse.json({ error: "Failed to increment views" }, { status: 500 });
    }
}

// GET - Get view count
export async function GET(req, { params }) {
    try {
        await connectToDB();
        const { id } = await params;

        const post = await Post.findOne(
            { $or: [{ slug: id }, { _id: id }] }
        ).select('views');

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json({ views: post.views || 0 });
    } catch (error) {
        console.error("Error getting views:", error);
        return NextResponse.json({ error: "Failed to get views" }, { status: 500 });
    }
}
