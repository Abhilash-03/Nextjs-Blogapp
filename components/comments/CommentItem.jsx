'use client';

import { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import { ThumbsDown } from "../animate-ui/icons/thumbs-down";
import { AnimateIcon } from "../animate-ui/icons/icon";
import { ThumbsUp } from "../animate-ui/icons/thumbs-up";

// Helper function for relative time
const getRelativeTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const CommentItem = ({ comment, postId, depth = 0 }) => {
  const { data: session } = useSession();
  const [showReply, setShowReply] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [likes, setLikes] = useState(comment.likes?.length || 0);
  const [dislikes, setDislikes] = useState(comment.dislikes?.length || 0);
  
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  // Update liked/disliked state when session loads
  useEffect(() => {
    const userId = session?.user?.id;
    if (userId) {
      const hasLiked = comment.likes?.some(id => id?.toString() === userId?.toString());
      const hasDisliked = comment.dislikes?.some(id => id?.toString() === userId?.toString());
      setLiked(!!hasLiked);
      setDisliked(!!hasDisliked);
    }
  }, [session?.user?.id, comment.likes, comment.dislikes]);

  const avatar = comment.userId?.image || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";
  const author = comment.userId?.name || "Anonymous";
  const relativeTime = getRelativeTime(comment.createdAt);
  const isReply = depth > 0;
  const hasReplies = comment.replies?.length > 0;
  const maxDepth = 4; // Limit nesting depth for better UX

  const handleLikeDislike = async (action) => {
    if (!session) return;

    // Store previous state for potential rollback
    const prevLiked = liked;
    const prevDisliked = disliked;
    const prevLikes = likes;
    const prevDislikes = dislikes;

    // Optimistic update
    if (action === "like") {
      if (liked) {
        // Already liked, remove like
        setLiked(false);
        setLikes(l => Math.max(l - 1, 0));
      } else {
        // Add like
        setLiked(true);
        setLikes(l => l + 1);
        // Remove dislike if present
        if (disliked) {
          setDisliked(false);
          setDislikes(d => Math.max(d - 1, 0));
        }
      }
    } else {
      if (disliked) {
        // Already disliked, remove dislike
        setDisliked(false);
        setDislikes(d => Math.max(d - 1, 0));
      } else {
        // Add dislike
        setDisliked(true);
        setDislikes(d => d + 1);
        // Remove like if present
        if (liked) {
          setLiked(false);
          setLikes(l => Math.max(l - 1, 0));
        }
      }
    }

    try {
      await fetch(`/api/comments/${comment._id}/likeDislike`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
    } catch (error) {
      // Revert to previous state on error
      setLiked(prevLiked);
      setDisliked(prevDisliked);
      setLikes(prevLikes);
      setDislikes(prevDislikes);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative ${isReply ? 'pl-8' : ''}`}
    >
      {/* Horizontal connector to avatar for nested comments */}
      {isReply && (
        <div className="absolute left-0 top-5 w-6 h-[2px] bg-border" />
      )}
      
      <div className="group relative">
        
        <div className={`
          relative rounded-2xl border bg-card/50 backdrop-blur-sm
          transition-all duration-300 ease-out
          hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5
          ${isReply ? 'border-border/50 p-3' : 'border-border p-4 shadow-sm'}
        `}>
          {/* Avatar and content */}
          <div className="flex gap-3">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img 
                src={avatar} 
                alt={author}
                className={`
                  rounded-full object-cover ring-2 ring-background shadow-sm
                  ${isReply ? 'w-8 h-8' : 'w-10 h-10'}
                `}
              />
            </div>

            {/* Content area */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-semibold text-foreground ${isReply ? 'text-sm' : 'text-base'}`}>
                    {author}
                  </span>
                  <span className="text-xs text-muted-foreground/70">•</span>
                  <span className="text-xs text-muted-foreground/70">{relativeTime}</span>
                </div>
              </div>

              {/* Comment text */}
              <p className={`text-foreground/90 leading-relaxed ${isReply ? 'text-sm' : 'text-[15px]'}`}>
                {comment.content}
              </p>

              {/* Actions bar */}
              <div className="flex items-center gap-1 pt-1">
                {/* Like button */}
                <button
                  onClick={() => handleLikeDislike('like')}
                  disabled={!session}
                  className={`
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                    transition-all duration-200 ease-out
                    ${liked 
                      ? 'bg-primary/15 text-primary border border-primary/30' 
                      : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-transparent'
                    }
                    ${!session ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <AnimateIcon animateOnHover={!!session}>
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </AnimateIcon>
                  <span>{likes > 0 ? likes : ''}</span>
                </button>

                {/* Dislike button */}
                <button
                  onClick={() => handleLikeDislike('dislike')}
                  disabled={!session}
                  className={`
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                    transition-all duration-200 ease-out
                    ${disliked 
                      ? 'bg-destructive/15 text-destructive border border-destructive/30' 
                      : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-transparent'
                    }
                    ${!session ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <AnimateIcon animateOnHover={!!session}>
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </AnimateIcon>
                  <span>{dislikes > 0 ? dislikes : ''}</span>
                </button>

                {/* Reply button */}
                {session && depth < maxDepth && (
                  <button
                    onClick={() => setShowReply((s) => !s)}
                    className={`
                      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                      transition-all duration-200 ease-out border border-transparent
                      ${showReply 
                        ? 'bg-primary/15 text-primary' 
                        : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                      }
                    `}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    {showReply ? 'Cancel' : 'Reply'}
                  </button>
                )}

                {/* Toggle replies button */}
                {hasReplies && (
                  <button
                    onClick={() => setShowReplies((s) => !s)}
                    className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-all duration-200"
                  >
                    <svg 
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${showReplies ? 'rotate-180' : ''}`} 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                    {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Reply form */}
          <AnimatePresence>
            {showReply && session && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 pt-3 border-t border-border/50 overflow-hidden"
              >
                <CommentForm
                  postId={postId}
                  parentCommentId={comment._id}
                  onSuccess={() => setShowReply(false)}
                  isReply
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nested replies */}
      <AnimatePresence>
        {showReplies && hasReplies && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative mt-2 ml-5"
          >
            {/* Continuous thread line connecting all replies */}
            <div className="absolute left-0 top-0 bottom-3 w-[2px] bg-border rounded-full" />
            
            <div className="space-y-2">
              {comment.replies.map((reply, index) => (
                <CommentItem 
                  key={reply._id || reply.id} 
                  comment={reply} 
                  postId={postId} 
                  depth={depth + 1} 
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CommentItem;
