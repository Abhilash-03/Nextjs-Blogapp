import CommentSection from "@/components/comments/CommentSection";
import { authOptions } from "@/lib/authOptions";
import { connectToDB } from "@/lib/mongodb"
import { Post } from "@/models/Post";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import PostDetailShell from "@/components/PostDetailShell";

const SinglePostPage = async({ params }) => {
  try {
    await connectToDB();
    const { slug } = await params;
    const post = await Post.findOne({ slug }).populate('author', 'name email image');
    
    if(!post) return notFound();

    const plainPost = JSON.parse(JSON.stringify(post));
    const postForClient = {
      ...plainPost,
      id: plainPost._id,
      author: plainPost.author
        ? { 
            ...plainPost.author, 
            id: plainPost.author._id,
            name: plainPost.author.name || 'Unknown Author',
            email: plainPost.author.email || '',
            image: plainPost.author.image || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'
          }
        : null,
    };

    return (
      <PostDetailShell post={postForClient} />
    )
  } catch (error) {
    console.error('Error loading post:', error);
    return notFound();
  }
}

export default SinglePostPage
