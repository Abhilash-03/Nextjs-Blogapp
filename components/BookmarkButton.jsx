'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'motion/react';

const BookmarkButton = ({ postId, size = 'default', showText = false }) => {
    const { data: session, status } = useSession();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Check bookmark status on mount
    useEffect(() => {
        if (status === 'authenticated' && postId) {
            checkBookmarkStatus();
        } else if (status === 'unauthenticated') {
            setIsLoading(false);
        }
    }, [status, postId]);

    const checkBookmarkStatus = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/bookmarks/${postId}`, {
                cache: 'no-store'
            });
            if (res.ok) {
                const data = await res.json();
                setIsBookmarked(data.bookmarked);
            }
        } catch (error) {
            console.error('Error checking bookmark status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleBookmark = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (status !== 'authenticated') {
            setToastMessage('Sign in to bookmark posts');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`/api/bookmarks/${postId}`, {
                method: 'POST',
            });

            if (res.ok) {
                const data = await res.json();
                setIsBookmarked(data.bookmarked);
                setToastMessage(data.message);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2000);
            } else {
                const data = await res.json();
                setToastMessage(data.error || 'Failed to update bookmark');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2000);
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
            setToastMessage('Failed to update bookmark');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        } finally {
            setIsLoading(false);
        }
    };

    const sizeClasses = {
        small: 'p-1.5',
        default: 'p-2',
        large: 'p-2.5',
    };

    const iconSizes = {
        small: 'w-4 h-4',
        default: 'w-5 h-5',
        large: 'w-6 h-6',
    };

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleBookmark}
                disabled={isLoading}
                className={`${sizeClasses[size]} rounded-full transition-all ${
                    isBookmarked
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                } ${showText ? 'flex items-center gap-2 px-3' : ''} disabled:opacity-50`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark this post'}
            >
                <motion.svg
                    animate={isBookmarked ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    className={iconSizes[size]}
                    fill={isBookmarked ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                </motion.svg>
                {showText && (
                    <span className="text-sm font-medium">
                        {isBookmarked ? 'Saved' : 'Save'}
                    </span>
                )}
            </motion.button>

            {/* Toast notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-medium whitespace-nowrap shadow-lg z-50"
                    >
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BookmarkButton;
