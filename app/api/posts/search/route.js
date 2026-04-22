import { connectToDB } from "@/lib/mongodb";
import { Post } from "@/models/Post";
import { NextResponse } from "next/server";

export const GET = async (req) => {
    try {
        await connectToDB();
        
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q') || '';
        
        // Build search filter for title and content
        const searchFilter = query
            ? {
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { content: { $regex: query, $options: 'i' } }
                ]
            }
            : {};
        
        const posts = await Post.find(searchFilter)
            .sort({ createdAt: -1 })
            .populate('author', 'name email image')
            .lean();
        
        const plainPosts = posts.map((post) => ({
            ...post,
            _id: post._id.toString(),
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt?.toISOString(),
            author: post.author ? {
                ...post.author,
                _id: post.author._id.toString(),
            } : null,
        }));
        
        return NextResponse.json({ posts: plainPosts }, { status: 200 });
        
    } catch (error) {
        console.log('Search API Error:', error);
        return NextResponse.json({ error: 'Failed to search posts' }, { status: 500 });
    }
};
