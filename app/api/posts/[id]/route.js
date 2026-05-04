import { connectToDB } from "@/lib/mongodb";
import { Post } from "@/models/Post";
import { NextResponse } from "next/server";

export const DELETE = async(req, {params}) => {
    try {
        await connectToDB();
        const { id } = await params;
        const deletedPost = await Post.findByIdAndDelete(id);
        
        if(!deletedPost) {
            return NextResponse.json({message: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ message: "Post deleted successfully." }, { status: 200 });

    } catch (error) {
        console.log('API FOR DELETE POST ERROR: ', error);
        return NextResponse.json({error: 'Failed to delete post' }, { status: 500 })
    }
}

export const PATCH = async(req, {params}) => {
    try {
        await connectToDB();
        const { id } = await params;
        const body = await req.json();
        const { title, content, image, slug, tags, published } = body;

        const updateData = {
            title,
            content,
            image,
            slug,
            tags: tags || []
        };
        
        // Only update published field if explicitly provided
        if (typeof published === 'boolean') {
            updateData.published = published;
        }

        const updatedPost = await Post.findByIdAndUpdate(id, updateData, {new : true});
        
        if(!updatedPost) {
            return NextResponse.json({ message: 'No post found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Post has been updated successfully', post: updatedPost }, { status: 200 });
        
    } catch (error) {
        console.log('Error updating post ', error);
        return NextResponse.json({error: "Failed to update post" }, { status: 500 });
    }
}