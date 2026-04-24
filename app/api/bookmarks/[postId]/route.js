import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Post } from "@/models/Post";
import mongoose from "mongoose";

// Disable caching for this route
export const dynamic = 'force-dynamic';

// Helper to check if string is valid ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST - Toggle bookmark for a post
export async function POST(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDB();
        const { postId } = await params;
        
        if (!postId || !isValidObjectId(postId)) {
            return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
        }

        // Convert to ObjectId for MongoDB operations
        const postObjectId = new mongoose.Types.ObjectId(postId);

        // Verify post exists
        const post = await Post.findById(postObjectId);
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // First, ensure bookmarks array exists
        await User.updateOne(
            { email: session.user.email, bookmarks: { $exists: false } },
            { $set: { bookmarks: [] } }
        );

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        console.log("Before update - user bookmarks:", user.bookmarks);

        // Check if already bookmarked
        const isBookmarked = Array.isArray(user.bookmarks) && user.bookmarks.some(
            (id) => id.toString() === postId
        );

        let result;
        if (isBookmarked) {
            // Remove bookmark using $pull with ObjectId
            result = await User.updateOne(
                { _id: user._id },
                { $pull: { bookmarks: postObjectId } }
            );
        } else {
            // Add bookmark using $addToSet with ObjectId
            result = await User.updateOne(
                { _id: user._id },
                { $addToSet: { bookmarks: postObjectId } }
            );
        }

        // Verify the update
        const updatedUser = await User.findById(user._id);

        console.log("Bookmark update result:", {
            userId: user._id,
            postId,
            wasBookmarked: isBookmarked,
            updateResult: result,
            newBookmarks: updatedUser?.bookmarks?.map(id => id.toString())
        });

        return NextResponse.json({
            bookmarked: !isBookmarked,
            message: isBookmarked ? "Bookmark removed" : "Post bookmarked"
        });
    } catch (error) {
        console.error("Error toggling bookmark:", error);
        return NextResponse.json({ error: "Failed to toggle bookmark" }, { status: 500 });
    }
}

// GET - Check if post is bookmarked
export async function GET(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            console.log("GET bookmark: No session");
            return NextResponse.json({ bookmarked: false }, {
                headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
            });
        }

        await connectToDB();
        const { postId } = await params;
        
        if (!postId || !isValidObjectId(postId)) {
            console.log("GET bookmark: Invalid postId", postId);
            return NextResponse.json({ bookmarked: false }, {
                headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
            });
        }

        // Use lean() for faster read and fresh data
        const user = await User.findOne({ email: session.user.email }).lean();
        if (!user) {
            console.log("GET bookmark: User not found for email", session.user.email);
            return NextResponse.json({ bookmarked: false }, {
                headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
            });
        }

        const bookmarks = user.bookmarks || [];
        console.log("GET bookmark check:", {
            email: session.user.email,
            postId,
            totalBookmarks: bookmarks.length,
            bookmarkIds: bookmarks.map(id => id.toString())
        });

        const isBookmarked = bookmarks.some(
            (id) => id.toString() === postId
        );

        return NextResponse.json({ bookmarked: isBookmarked }, {
            headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
        });
    } catch (error) {
        console.error("Error checking bookmark:", error);
        return NextResponse.json({ bookmarked: false }, {
            headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
        });
    }
}
