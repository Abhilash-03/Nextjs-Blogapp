import CommentSection from "@/components/comments/CommentSection";
import { authOptions } from "@/lib/authOptions";
import { connectToDB } from "@/lib/mongodb"
import { Post } from "@/models/Post";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

const SinglePostPage = async({ params }) => {
    await connectToDB();
    const { slug } = await params;
    const post = await Post.findOne({ slug }).populate('author', 'name email image');
    if(!post) return notFound();
    // console.log(post);

  return (
    <div className="max-w-5xl mx-auto py-10 bg-[#202020] rounded-xl px-5">
                 <div className="flex justify-center items-center flex-col border-b mb-3">
                    <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                    <p className="text-gray-500 text-sm mb-8">{new Date(post.createdAt).toLocaleDateString()}</p>
                     <div className="flex flex-col justify-center items-center gap-2 mb-4">
                       <img src={post.author.image || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'} alt={'author profile'} className="w-14 h-14 rounded-full" />
                       <p className="text-lg capitalize font-semibold text-orange-400">{post.author.name}</p>
                     </div>
                    </div>
                    <div>
                      <img src={post.image || 'https://thumbs.dreamstime.com/b/blogging-blog-concepts-ideas-worktable-blogging-blog-concepts-ideas-white-worktable-110423482.jpg'} alt="image" className="rounded-xl w-full" />
                    </div>
                    <div className="prose prose-lg" dangerouslySetInnerHTML={{__html: post.content}} />

                    {/* Comment Section */}
                    <div className="max-w-[70%] w-full bg-[#484e57] rounded-xl my-20 px-5  pt-1 pb-10">
                    <CommentSection postId={post.id} />

                    </div>
    </div>
  )
}

export default SinglePostPage
