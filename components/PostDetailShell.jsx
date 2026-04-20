'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CommentSection from "@/components/comments/CommentSection";

const fallbackImage = 'https://thumbs.dreamstime.com/b/blogging-blog-concepts-ideas-worktable-blogging-blog-concepts-ideas-white-worktable-110423482.jpg';

// Calculate reading time
const getReadingTime = (content) => {
  if (!content) return 1;
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

// Format date nicely
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

const PostDetailShell = ({ post }) => {
  const router = useRouter();
  const readingTime = getReadingTime(post.content);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [copied, setCopied] = useState(false);

  // Track scroll position to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Cover Image */}
      <div className="relative w-full">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => router.back()}
          className="fixed top-20 left-4 md:left-6 z-50 inline-flex items-center gap-2 px-3 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden sm:inline">Back</span>
        </motion.button>

        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10" />
        
        {/* Cover Image */}
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            src={post.image || fallbackImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        {/* Title overlay on hero */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto pb-8"
          >
            {/* Category/Meta tags */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {readingTime} min read
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/80 text-xs font-medium text-muted-foreground">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(post.createdAt)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight">
              {post.title}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative max-w-4xl mx-auto px-4 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Author Card */}
          {post.author && (
            <div className="flex items-center justify-between gap-4 py-6 border-b border-border mb-8">
              <div className="flex items-center gap-4">
                <img 
                  src={post.author.image || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'} 
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-background shadow-lg"
                />
                <div>
                  <p className="font-semibold text-foreground">{post.author.name || 'Unknown Author'}</p>
                  <p className="text-sm text-muted-foreground">Author</p>
                </div>
              </div>
              
              {/* Share buttons */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigator.share?.({ title: post.title, url: window.location.href })}
                  className="p-2.5 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  title="Share"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className={`relative p-2.5 rounded-full transition-colors ${
                    copied 
                      ? 'bg-green-500/20 text-green-600' 
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  title="Copy link"
                >
                  {copied ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  )}
                  
                  {/* Copied tooltip */}
                  <AnimatePresence>
                    {copied && (
                      <motion.span
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-foreground text-background text-xs font-medium whitespace-nowrap"
                      >
                        Link copied!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>
          )}

          {/* Article Content */}
          <article className="pb-12">
            <div 
              className="article-content"
              dangerouslySetInnerHTML={{__html: post.content}} 
            />
          </article>

          {/* Tags Section (if available) */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 py-6 border-t border-border">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1.5 rounded-full bg-muted/50 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Author Bio Card */}
          {post.author && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="my-12 p-6 rounded-2xl bg-card/50 border border-border backdrop-blur-sm"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img 
                  src={post.author.image || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'} 
                  alt={post.author.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-background shadow-lg"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary mb-1">Written by</p>
                  <p className="text-xl font-bold text-foreground mb-1">{post.author.name || 'Unknown Author'}</p>
                  <p className="text-sm text-muted-foreground">
                    Thank you for reading! Follow for more articles and updates.
                  </p>
                </div>
                <Link 
                  href={`/blog?author=${post.author.id}`}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                  View all posts
                </Link>
              </div>
            </motion.div>
          )}

          {/* Divider */}
          <div className="relative py-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-background text-muted-foreground text-sm">
                💬 Comments
              </span>
            </div>
          </div>

          {/* Comments Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="pb-16"
          >
            <CommentSection postId={post.id} />
          </motion.div>
        </motion.div>
      </div>

      {/* Back to top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 p-3 rounded-full bg-card border border-border shadow-lg text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all z-50"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PostDetailShell;

