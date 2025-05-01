import { connectToDB } from "@/lib/mongodb"
import { Post } from "@/models/Post";
import { NextResponse } from "next/server";


export const GET = async(req, {params}) => {
    try {
      await connectToDB();
      const { userId } = await params;
      const posts = await Post.find({ author: userId }).sort({ createdAt: -1 }).lean();

        //  // Convert _id and timestamps to strings
        // const plainPosts = posts.map(post => ({
        //     ...post,
        //     _id: post._id.toString(),
        //     createdAt: post.createdAt.toString(),
        //     updatedAt: post.updatedAt?.toString(),
        // }));
  
        // console.log(plainPosts);
      return NextResponse.json(posts);
        
    } catch (error) {
        console.error(error);
        return NextResponse.error(new Error('Failed to fetch posts for user.'))
    }

}