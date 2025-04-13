import { connectToDB } from "@/lib/mongodb"
import { Post } from "@/models/Post";
import { notFound } from "next/navigation";

const SinglePostPage = async({ params }) => {
    await connectToDB();
    const { slug } = await params;
    const post = await Post.findOne({ slug }).lean();

    if(!post) return notFound();

  return (
    <div className="max-w-5xl mx-auto py-10">
                    <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                    <p className="text-gray-500 text-sm mb-8">{new Date(post.createdAt).toLocaleDateString()}</p>
                    <div className="prose prose-lg" dangerouslySetInnerHTML={{__html: post.content}} />
    </div>
  )
}

export default SinglePostPage
