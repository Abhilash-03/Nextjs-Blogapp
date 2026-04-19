'use client';

import { useState } from "react";
import CommentForm from "./CommentForm";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { ThumbsDown } from "../animate-ui/icons/thumbs-down";
import { AnimateIcon } from "../animate-ui/icons/icon";
import { ThumbsUp } from "../animate-ui/icons/thumbs-up";

const CommentItem = ({ comment, postId, depth = 0 }) => {
  const { data: session } = useSession();
  const [showReply, setShowReply] = useState(false);
  const [likes, setLikes] = useState(comment.likes?.length || 0);
  const [dislikes, setDislikes] = useState(comment.dislikes?.length || 0);
  const [liked, setLiked] = useState(comment.likes?.includes(session?.user?._id));
  const [disliked, setDisliked] = useState(comment.dislikes?.includes(session?.user?._id));

  const avatar = comment.userId?.image || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";
  const author = comment.userId?.name || "Anonymous";
  const date = comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "";
  const isReply = depth > 0;

  const handleLikeDislike = async (action) => {
    if (!session) return;

    // optimistic update
    if (action === "like") {
      setLiked((prev) => {
        if (prev) {
          setLikes((l) => Math.max(l - 1, 0));
          return false;
        }
        setLikes((l) => l + 1);
        if (disliked) setDislikes((d) => Math.max(d - 1, 0));
        setDisliked(false);
        return true;
      });
    } else {
      setDisliked((prev) => {
        if (prev) {
          setDislikes((d) => Math.max(d - 1, 0));
          return false;
        }
        setDislikes((d) => d + 1);
        if (liked) setLikes((l) => Math.max(l - 1, 0));
        setLiked(false);
        return true;
      });
    }

    try {
      await fetch(`/api/comments/${comment._id}/likeDislike`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
    } catch (error) {
      // revert on error
      if (action === "like") {
        setLiked((prev) => {
          if (!prev) return prev;
          setLikes((l) => Math.max(l - 1, 0));
          return false;
        });
      } else {
        setDisliked((prev) => {
          if (!prev) return prev;
          setDislikes((d) => Math.max(d - 1, 0));
          return false;
        });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mb-4"
      style={{ marginLeft: depth * 18 }}
    >
      {isReply && (
        <>
          <div className="absolute -left-4 top-0 bottom-4 w-px bg-border/80" />
          <div className="absolute -left-5 top-4 h-2 w-2 rounded-full bg-primary/70 shadow-[0_0_0_4px_rgba(99,102,241,0.18)]" />
        </>
      )}
      <div className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg my-4">
        <div className="flex items-start gap-3">
          <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full border border-border object-cover" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{author}</p>
                <p className="text-[12px] text-muted-foreground">{date}</p>
              </div>
              <button
                onClick={() => setShowReply((s) => !s)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                {showReply ? "Cancel" : "Reply"}
              </button>
            </div>

            <p className="text-sm text-foreground">{comment.content}</p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <button
                onClick={() => handleLikeDislike('like')}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 border transition ${
                  liked ? "border-primary text-primary bg-primary/10" : "border-border hover:border-primary"
                }`}
              >
                <AnimateIcon animateOnHover>
                  <ThumbsUp className={"w-4"} />
                </AnimateIcon> {likes}
              </button>
              <button
                onClick={() => handleLikeDislike('dislike')}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 border transition ${
                  disliked ? "border-destructive text-destructive bg-destructive/10" : "border-border hover:border-destructive"
                }`}
              >
                <AnimateIcon animateOnHover>
                  <ThumbsDown className={"w-4"} />
                </AnimateIcon> {dislikes}
              </button>
            </div>
          </div>
        </div>

        {showReply && session && (
          <div className="mt-3">
            <CommentForm
              postId={postId}
              parentCommentId={comment._id}
              onSuccess={() => setShowReply(false)}
            />
          </div>
        )}
      </div>

      {comment.replies?.map((reply) => (
        <CommentItem key={reply._id || reply.id} comment={reply} postId={postId} depth={depth + 1} />
      ))}
    </motion.div>
  );
};

export default CommentItem;
