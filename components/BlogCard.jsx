'use client';

import Link from "next/link";
import { motion } from "motion/react";
import BookmarkButton from "@/components/BookmarkButton";
import { getTagColor } from "@/components/TagFilter";

const fallbackImage = 'https://thumbs.dreamstime.com/b/blogging-blog-concepts-ideas-worktable-blogging-blog-concepts-ideas-white-worktable-110423482.jpg';

// Calculate reading time
const getReadingTime = (content) => {
  if (!content) return 1;
  const text = content.replace?.(/<[^>]*>/g, '') || '';
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

const BlogCard = ({ post }) => {
  const createdAt = new Date(post.createdAt);
  const readingTime = getReadingTime(post.content);
  
  function postAgeLabel(createdAtString) {
    const created = new Date(createdAtString);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
    if (days < 1) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  }

  const author = post?.author?.name || 'Unknown author';
  const authorImage = post?.author?.image || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png';
  
  return (
    <Link href={`/blog/${post.slug}`} className="block h-full">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
      >
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <img
            src={post?.image || fallbackImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Reading time badge */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-medium text-foreground shadow-sm">
              <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readingTime} min
            </span>
          </div>
          
          {/* Bookmark button */}
          <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-background/90 backdrop-blur-sm rounded-full shadow-sm">
              <BookmarkButton postId={post._id} size="small" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          {/* Meta info */}
          <div className="flex items-center gap-3 mb-3">
            <img 
              src={authorImage} 
              alt={author} 
              className="h-8 w-8 rounded-full object-cover ring-2 ring-background" 
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{author}</p>
              <p className="text-xs text-muted-foreground">{postAgeLabel(post.createdAt)}</p>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {post.description || "Explore this article to discover new insights and perspectives..."}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {post.tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag} 
                  className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-medium border capitalize ${getTagColor(tag)}`}
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium text-muted-foreground bg-muted/50">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {(post.views || 0).toLocaleString()}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
              Read article
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  )
}

export default BlogCard
