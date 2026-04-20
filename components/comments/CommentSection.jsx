'use client';

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { motion, AnimatePresence } from "motion/react";

const CommentSection = ({ postId }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const totalComments = comments.reduce((acc, comment) => {
    return acc + 1 + (comment.replies?.length || 0);
  }, 0);
  
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Discussion</h2>
            <p className="text-sm text-muted-foreground">
              {loading ? 'Loading...' : `${totalComments} ${totalComments === 1 ? 'comment' : 'comments'}`}
            </p>
          </div>
        </div>

        {!session && (
          <Link href="/auth/signin">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card/50 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary hover:bg-card hover:shadow-md">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign in to comment
            </button>
          </Link>
        )}
      </div>

      {/* Comment form for logged-in users */}
      {session && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CommentForm
            postId={postId}
            onSuccess={(newComment) => setComments([newComment, ...comments])}
          />
        </motion.div>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <div className="relative">
              <div className="w-10 h-10 border-4 border-primary/20 rounded-full" />
              <div className="absolute inset-0 w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-sm text-muted-foreground">Loading comments...</p>
          </div>
        )}

        {/* Comments */}
        {!loading && (
          <AnimatePresence mode="popLayout">
            {comments.map((comment, index) => (
              <motion.div
                key={comment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <CommentItem comment={comment} postId={postId} depth={0} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Empty state */}
        {!loading && comments.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 rounded-2xl border border-dashed border-border bg-card/30"
          >
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-muted/50">
              <svg className="w-8 h-8 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No comments yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-[280px]">
              Be the first to share your thoughts and start the conversation.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CommentSection;
