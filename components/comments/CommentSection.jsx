'use client';

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { motion } from "motion/react";

const CommentSection = ({ postId }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    const res = await fetch(`/api/comments?postId=${postId}`);
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);
  
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Comments</h2>
          <p className="text-sm text-muted-foreground">Share your thoughts and feedback.</p>
        </div>
        {!session && (
          <Link href={'/auth/signin'}>
            <button className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold transition hover:border-primary hover:bg-background/80">
              Sign in to comment
            </button>
          </Link>
        )}
      </div>

      {session && (
        <CommentForm
          postId={postId}
          onSuccess={(newComment) => setComments([newComment, ...comments])}
        />
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <motion.div key={comment._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <CommentItem comment={comment} postId={postId} depth={0} />
          </motion.div>
        ))}
        {comments.length === 0 && (
          <div className="rounded-2xl border border-border bg-background/70 p-4 text-sm text-muted-foreground">
            No comments yet. Be the first to start the discussion.
          </div>
        )}
      </div>
    </section>
  );
};

export default CommentSection;
