'use client';

import Link from "next/link";


const BlogCard = ({ post }) => {
  return (
    <Link href={`/blog/${post.slug}`} className="w-full">
      <div className="bg-[#202020] p-4 rounded-xl shadow-sm hover:shadow-white hover:border hover:border-white transition  my-4 flex flex-col justify-start  gap-6 w-full hover:bg-black">
        <img src={post?.image ? post.image : 'https://thumbs.dreamstime.com/b/blogging-blog-concepts-ideas-worktable-blogging-blog-concepts-ideas-white-worktable-110423482.jpg'} alt="image" className="w-full h-[200px] rounded-xl" />
        <div>
        <h3 className="text-xl font-semibold">{post.title}</h3>
        <p className="text-gray-600 text-sm mt-1">{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      
      </div>
    </Link>
  )
}

export default BlogCard
