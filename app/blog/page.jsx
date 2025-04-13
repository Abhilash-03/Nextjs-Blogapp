import BlogCard from '@/components/BlogCard';
import { connectToDB } from '@/lib/mongodb'
import { Post } from '@/models/Post';
import React from 'react'

const BlogPage = async() => {
    await connectToDB();
      // Use `.lean()` to return plain JavaScript objects
  const posts = await Post.find().sort({ createdAt: -1 }).lean();

  // Optional: convert _id to string (MongoDB ObjectId isn't serializable)
  const plainPosts = posts.map((post) => ({
    ...post,
    _id: post._id.toString(),
    createdAt: post.createdAt.toString(),
    updatedAt: post.updatedAt?.toString(),
  }));

  return (
    <div className='w-full'>
      <h2 className='text-3xl font-bold mb-6'>All Blog Posts</h2>
      <hr />
      <div className='space-y-4 mt-4 gap-4'>
        {
            plainPosts.map(post => (
                <BlogCard key={post._id} post={post} />
            ))
        }
      </div>
    </div>
  )
}

export default BlogPage
