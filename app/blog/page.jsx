import BlogList from '@/components/BlogList';
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.08),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.05),transparent_50%)]" />
        
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Explore Articles
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
              Discover Stories & Ideas
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Fresh perspectives from our community—browse the latest stories, tutorials, and insights from writers around the world.
            </p>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-border/50">
            <div>
              <p className="text-3xl font-bold text-foreground">{plainPosts.length}</p>
              <p className="text-sm text-muted-foreground">Published articles</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{new Set(plainPosts.map(p => p.author?._id)).size}</p>
              <p className="text-sm text-muted-foreground">Contributing authors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <BlogList initialPosts={plainPosts} />
      </div>
    </div>
  )
}

export default BlogPage
