import BlogCard from '@/components/BlogCard';
import { connectToDB } from '@/lib/mongodb'
import { Post } from '@/models/Post';
import React from 'react'

const BlogPage = async() => {
    await connectToDB();
      // Use `.lean()` to return plain JavaScript objects
      const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name email image') // optional, if you want to show author info
      .lean();
    
    const plainPosts = posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt?.toISOString(),
      author: post.author ? {
        ...post.author,
        _id: post.author._id.toString(),
      } : null,
    }));

  return (
    <div className='w-full max-w-[90%] mx-auto'>
      <h2 className='text-3xl font-bold mb-6'>All Blog Posts</h2>
      <hr />
      <div className='space-y-4 mt-4 gap-4 grid grid-cols-3 w-full'>
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
