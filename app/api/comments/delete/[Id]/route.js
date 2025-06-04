import { authOptions } from "@/lib/authOptions";
import { connectToDB } from "@/lib/mongodb"
import { Comment } from "@/models/Comment";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const DELETE = async(req, { params }) => {
    try {
        await connectToDB();
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if(!session) {
            return NextResponse.json({ message: 'Unauthorized', status: 401});
        }

        const comment = await Comment.findById(id);
        if(!comment) {
            return NextResponse.json({ messgage: 'Comment not found', status: 404})
        }

        // Allow only author or admin to delete
        if(comment.userId.toString() !== session.user.id && session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden', status: 403})
        }

        // Delete the comment and its replies
        await Comment.deleteMany({
            $or: [
                { _id : id},
                { parentCommentId: id}
            ]
        })

        return NextResponse.json({ message: 'Comment and replies deleted'});
    } catch (error) {
        return NextResponse.json({error: 'Server error ' + error.message, status: 500})
    }
}