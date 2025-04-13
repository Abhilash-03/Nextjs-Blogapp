'use client';

import Link from "next/link";


const BlogCard = ({ post }) => {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="bg-[#202020] p-4 rounded-xl shadow-sm hover:shadow-white hover:border hover:border-white transition w-[40%] my-4">
        <h3 className="text-xl font-semibold">{post.title}</h3>
        <p className="text-gray-600 text-sm mt-1">{new Date(post.createdAt).toLocaleDateString()}</p>
      </div>
    </Link>
  )
}

export default BlogCard
