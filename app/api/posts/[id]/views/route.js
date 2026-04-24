import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Post } from "@/models/Post";
import mongoose from "mongoose";

// POST - Increment view count
export async function POST(req, { params }) {
    try {
        await connectToDB();
        const { id } = await params;

        // Build query - only include _id if it's a valid ObjectId
        const query = mongoose.Types.ObjectId.isValid(id)
            ? { $or: [{ slug: id }, { _id: id }] }
            : { slug: id };

        // Find post by slug or ID and increment views
        const post = await Post.findOneAndUpdate(
            query,
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

        // Build query - only include _id if it's a valid ObjectId
        const query = mongoose.Types.ObjectId.isValid(id)
            ? { $or: [{ slug: id }, { _id: id }] }
            : { slug: id };

        const post = await Post.findOne(query).select('views');

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json({ views: post.views || 0 });
    } catch (error) {
        console.error("Error getting views:", error);
        return NextResponse.json({ error: "Failed to get views" }, { status: 500 });
    }
}
