import { authOptions } from "@/lib/authOptions";
import { connectToDB } from "@/lib/mongodb"
import { Comment } from "@/models/Comment";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export const PATCH = async(req, { params }) => {
    try {
        await connectToDB();
        const { commentId: id } = await params;
        console.log("\nComment id", id);
        const session = await getServerSession(authOptions);
        if(!session) {
            return NextResponse.json({ message: 'Unauthorized'}, {status: 401})
        }
        const { action } = await req.json(); //action: 'like' | 'dislike'
        const comment = await Comment.findById(id);
        if(!comment) return NextResponse.json({ message: 'Comment not found!'}, {status: 404});

        const userId = session.user.id;
        if(action === 'like') {
            comment.dislikes.pull(userId); //pull is a moongose method to remove element from the array
            if(comment.likes.includes(userId)) {
                comment.likes.pull(userId);
            } else {
                comment.likes.push(userId)
            }
        } else if(action === 'dislike') {
            comment.likes.pull(userId); //pull is a moongose method to remove element from the array
            if(comment.dislikes.includes(userId)) {
                comment.dislikes.pull(userId);
            } else {
                comment.dislikes.push(userId)
            }
        }

        await comment.save();
        return NextResponse.json({ message: 'Reaction updated' }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update like/dislike '+ error.message }, {status: 500});
    }
}