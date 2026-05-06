import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Post } from "@/models/Post";

// GET - Get user's bookmarked posts
export async function GET() {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDB();
        
        // Ensure Post model is registered
        void Post;

        const user = await User.findOne({ email: session.user.email })
            .populate({
                path: 'bookmarks',
                model: 'Post',
                populate: {
                    path: 'author',
                    model: 'User',
                    select: 'name image'
                }
            });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ bookmarks: user.bookmarks || [] });
    } catch (error) {
        console.error("Error fetching bookmarks:", error);
        return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
    }
}
