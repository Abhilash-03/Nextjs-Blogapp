import { authOptions } from "@/lib/authOptions";
import { connectToDB } from "@/lib/mongodb";
import { Post } from "@/models/Post";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function POST(req) {
    const session = await getServerSession(authOptions);

    if(!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { title, content, image, slug: customSlug, tags } = body;
    
    const generateSlug = (value) => {
        return value
          .toLowerCase()
          .trim()
          .replace(/[\u{1F600}-\u{1F6FF}]/gu, '') // emojis
          .replace(/[^\w\s-]/g, '') // special chars
          .replace(/\s+/g, '-')     // spaces to hyphen
          .replace(/-+/g, '-');     // multiple hyphens
      };

    try {
        await connectToDB();
        const slug = customSlug || generateSlug(title);

        const newPost = new Post({
            title,
            content,
            slug,
            image,
            tags: tags || [],
            author: session.user.id
        })

        await newPost.save();
        return NextResponse.json(newPost, { status: 201 });

    } catch (error) {
        console.log("Error saving post:", error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

}