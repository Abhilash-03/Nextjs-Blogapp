'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'motion/react';

const CommentForm = ({ postId, parentCommentId = null, onSuccess, isReply = false }) => {
  const { data: session } = useSession();
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const avatar = session?.user?.image || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";
  const userName = session?.user?.name || "Anonymous";

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, parentCommentId, content: text })
      });

      const data = await res.json();
      setText('');
      setIsFocused(false);
      if (onSuccess) onSuccess(data);
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className={`
        relative rounded-2xl border bg-card/50 backdrop-blur-sm
        transition-all duration-300 ease-out
        ${isFocused ? 'border-primary/50 shadow-lg shadow-primary/5 bg-card/80' : 'border-border'}
        ${isReply ? 'p-3' : 'p-4'}
      `}>
        <div className="flex gap-3">
          {/* User avatar */}
          <div className="relative flex-shrink-0">
            <img 
              src={avatar} 
              alt={userName}
              className={`rounded-full object-cover ring-2 ring-background shadow-sm ${isReply ? 'w-8 h-8' : 'w-10 h-10'}`}
            />
          </div>

          {/* Input area */}
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => !text && setIsFocused(false)}
              placeholder={isReply ? "Write a reply..." : "Share your thoughts..."}
              className={`
                w-full bg-transparent resize-none outline-none
                placeholder:text-muted-foreground/60
                text-foreground leading-relaxed
                ${isReply ? 'text-sm min-h-[60px]' : 'text-[15px] min-h-[80px]'}
              `}
              rows={1}
              required
              minLength={3}
            />

            {/* Actions bar - appears when focused or has text */}
            <AnimatePresence>
              {(isFocused || text) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between pt-3 mt-3 border-t border-border/50"
                >
                  {/* Character count */}
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${text.length > 500 ? 'text-destructive' : 'text-muted-foreground/60'}`}>
                      {text.length > 0 && `${text.length} characters`}
                    </span>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={submitting || !text.trim() || text.length < 3}
                    className={`
                      relative inline-flex items-center gap-2 px-4 py-2 rounded-xl
                      font-semibold text-sm
                      transition-all duration-200 ease-out
                      ${submitting || !text.trim() || text.length < 3
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:shadow-primary/25 active:scale-[0.98]'
                      }
                    `}
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Posting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>{isReply ? 'Reply' : 'Post'}</span>
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
