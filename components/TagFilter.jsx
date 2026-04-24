'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Predefined tag colors for consistency
const tagColors = {
    'javascript': 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    'react': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    'nextjs': 'bg-gray-500/10 text-gray-600 dark:text-gray-300 border-gray-500/20',
    'typescript': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    'nodejs': 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    'python': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    'css': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    'tailwind': 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
    'mongodb': 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    'tutorial': 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    'guide': 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    'tips': 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
    'web-development': 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    'programming': 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
};

const defaultColor = 'bg-primary/10 text-primary border-primary/20';

export const getTagColor = (tag) => tagColors[tag.toLowerCase()] || defaultColor;

const TagFilter = ({ tags, selectedTags, onTagsChange }) => {
    const [showAll, setShowAll] = useState(false);
    
    // Show empty state if no tags
    if (!tags || tags.length === 0) {
        return (
            <div className="mb-6 p-4 rounded-xl border border-dashed border-border bg-muted/30">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-sm">No tags yet — add tags to your posts to enable filtering</span>
                </div>
            </div>
        );
    }
    
    // Show only first 8 tags initially, unless showAll is true
    const visibleTags = showAll ? tags : tags.slice(0, 8);
    const hasMore = tags.length > 8;
    
    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            onTagsChange(selectedTags.filter(t => t !== tag));
        } else {
            onTagsChange([...selectedTags, tag]);
        }
    };
    
    const clearAll = () => {
        onTagsChange([]);
    };

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-sm font-medium text-foreground">Filter by tags</span>
                </div>
                
                {selectedTags.length > 0 && (
                    <button
                        onClick={clearAll}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear ({selectedTags.length})
                    </button>
                )}
            </div>
            
            <div className="flex flex-wrap gap-2">
                <AnimatePresence mode="popLayout">
                    {visibleTags.map((tag) => {
                        const isSelected = selectedTags.includes(tag.name);
                        const colorClass = getTagColor(tag.name);
                        
                        return (
                            <motion.button
                                key={tag.name}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleTag(tag.name)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                    isSelected 
                                        ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20' 
                                        : colorClass + ' hover:border-primary/40'
                                }`}
                            >
                                {isSelected && (
                                    <motion.svg 
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 12, opacity: 1 }}
                                        className="w-3 h-3"
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor" 
                                        strokeWidth={3}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </motion.svg>
                                )}
                                <span className="capitalize">{tag.name}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                    isSelected 
                                        ? 'bg-primary-foreground/20' 
                                        : 'bg-foreground/5'
                                }`}>
                                    {tag.count}
                                </span>
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
                
                {hasMore && (
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-primary/40 transition-all"
                    >
                        {showAll ? (
                            <>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                </svg>
                                Show less
                            </>
                        ) : (
                            <>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                                +{tags.length - 8} more
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default TagFilter;
