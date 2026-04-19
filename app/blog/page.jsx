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
    <div className="relative min-h-[88vh] overflow-hidden px-4 pb-16 pt-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(93,76,255,0.16),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(76,196,255,0.14),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(255,158,76,0.12),transparent_28%)] pointer-events-none" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card/70 p-6 shadow-xl backdrop-blur">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-semibold text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Discover curated writing
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">All blog posts</h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Fresh perspectives from the community—browse the latest stories, tutorials, and insights.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="rounded-full border border-border bg-background px-3 py-1">Latest</span>
            <span className="rounded-full border border-border bg-background px-3 py-1">Productivity</span>
            <span className="rounded-full border border-border bg-background px-3 py-1">Design</span>
            <span className="rounded-full border border-border bg-background px-3 py-1">Engineering</span>
          </div>
        </div>

        {plainPosts.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card/70 p-12 text-center shadow-lg backdrop-blur">
            <p className="text-lg font-semibold">No posts yet</p>
            <p className="mt-2 text-sm text-muted-foreground">Check back soon for new stories from the community.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {plainPosts.map(post => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPage
