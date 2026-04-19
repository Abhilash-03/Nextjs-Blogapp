import { authOptions } from "@/lib/authOptions";
import { connectToDB } from "@/lib/mongodb"
import { Comment } from "@/models/Comment";
import { Post } from "@/models/Post";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export const POST = async(req) => {
    try {
        await connectToDB();
        const session = await getServerSession(authOptions);
        console.log("User id", session.user.id);
        if(!session) {
            return NextResponse.json({ message: 'Unauthorized'}, {status: 401})
        }
        const {postId, content, parentCommentId} = await req.json();

        if (!postId || !content) {
            console.log('post id', postId);
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
          }

              // Ensure the post exists
            const post = await Post.findById(postId);
            if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

        const newComment = await Comment({
            postId,
            content,
            userId: session.user.id,
            parentCommentId
        })
        await newComment.save();

        return NextResponse.json({ message: 'Comment added!', comment: newComment}, {status: 201})
    } catch (error) {
        return NextResponse.json({ error: 'Failed to post comment, ' + error.message}, {status: 500})
    }
}

// Endpoint: GET /api/comments/new?postId=<postId>
export const GET = async(req) => {
    try {
        await connectToDB();
        const { searchParams } = new URL(req.url);
        const postId = searchParams.get('postId');

        if(!postId) return NextResponse.json({ message: 'Post ID required' }, { status: 400 });

        const comments = await Comment.find({ postId }).populate('userId', 'name email image').sort({ createdAt: -1 });

        const formatComments = (comments, parentId = null) => (
            comments
             .filter(comment => String(comment.parentCommentId) === String(parentId))
             .map(comment => ({
                ...comment.toObject(),
                replies: formatComments(comments, comment._id)
             }))
        )
        return NextResponse.json(formatComments(comments), {status: 200})

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}