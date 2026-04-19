'use client';

import { motion } from "motion/react";
import CommentSection from "@/components/comments/CommentSection";

const fallbackImage = 'https://thumbs.dreamstime.com/b/blogging-blog-concepts-ideas-worktable-blogging-blog-concepts-ideas-white-worktable-110423482.jpg';

const PostDetailShell = ({ post }) => {
  return (
    <div className="relative min-h-[88vh] overflow-hidden px-4 pb-16 pt-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(93,76,255,0.14),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(76,196,255,0.12),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(255,158,76,0.12),transparent_28%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative mx-auto flex flex-col gap-8 rounded-3xl border bg-card/70 p-6 shadow-2xl backdrop-blur"
      >
        <div className="flex flex-col gap-3 border-b border-border pb-6">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-semibold text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Published on {new Date(post.createdAt).toLocaleDateString()}
          </div>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{post.title}</h1>
          {post.author && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <img src={post.author.image || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'} alt={'author profile'} className="h-11 w-11 rounded-full border border-border object-cover" />
              <div>
                <p className="text-base font-semibold text-foreground">{post.author.name || 'Unknown Author'}</p>
                <p className="text-xs text-muted-foreground">{post.author.email || ''}</p>
              </div>
            </div>
          )}
        </div>

        <motion.div
          initial={{ scale: 0.99 }}
          whileHover={{ scale: 1.01 }}
          className="overflow-hidden rounded-2xl border border-border shadow-lg"
        >
          <img
            src={post.image || fallbackImage}
            alt="cover"
            className="h-full w-full max-h-[460px] object-cover transition duration-500 hover:scale-[1.03]"
          />
        </motion.div>

        <div className="prose prose-invert prose-lg max-w-none leading-relaxed" dangerouslySetInnerHTML={{__html: post.content}} />

        <div className="rounded-2xl border border-border bg-background/80 p-5 shadow-lg">
          <h2 className="text-lg font-semibold">Join the conversation</h2>
          <p className="text-sm text-muted-foreground">Share your thoughts, ask questions, and engage with the author.</p>
          <div className="mt-4">
            <CommentSection postId={post.id} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default PostDetailShell;

