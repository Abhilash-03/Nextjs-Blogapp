'use client';

import { useState, useCallback, useMemo } from 'react';
import BlogCard from './BlogCard';
import SearchBar from './SearchBar';
import TagFilter from './TagFilter';

const BlogList = ({ initialPosts, allTags = [] }) => {
    const [posts, setPosts] = useState(initialPosts);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    // Filter posts by selected tags (client-side)
    const filteredPosts = useMemo(() => {
        if (selectedTags.length === 0) return posts;
        
        return posts.filter(post => {
            const postTags = post.tags || [];
            // Post must have at least one of the selected tags
            return selectedTags.some(tag => postTags.includes(tag));
        });
    }, [posts, selectedTags]);

    const handleSearch = useCallback(async (query) => {
        setSearchQuery(query);
        
        if (!query.trim()) {
            // Reset to initial posts when search is cleared
            setPosts(initialPosts);
            return;
        }

        setIsSearching(true);
        try {
            const res = await fetch(`/api/posts/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            
            if (res.ok) {
                setPosts(data.posts);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    }, [initialPosts]);

    const handleTagsChange = (tags) => {
        setSelectedTags(tags);
    };

    // Get active filter description
    const getFilterDescription = () => {
        const parts = [];
        if (searchQuery) parts.push(`matching "${searchQuery}"`);
        if (selectedTags.length > 0) parts.push(`tagged with ${selectedTags.join(', ')}`);
        return parts.length > 0 ? parts.join(' and ') : '';
    };

    return (
        <>
            {/* Tag Filter - always show section */}
            <TagFilter 
                tags={allTags} 
                selectedTags={selectedTags} 
                onTagsChange={handleTagsChange} 
            />

            {/* Filter bar with search */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                        {searchQuery || selectedTags.length > 0 ? 'Filtered Results' : 'Latest Posts'}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                </div>
                
                <SearchBar onSearch={handleSearch} />
            </div>

            {/* Results count */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                {isSearching ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Searching...
                    </span>
                ) : (
                    <span>
                        {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                        {getFilterDescription() && <span className="text-muted-foreground/70"> {getFilterDescription()}</span>}
                    </span>
                )}
            </div>

            {/* Posts grid */}
            {filteredPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border bg-card/30">
                    <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-muted/50">
                        {searchQuery || selectedTags.length > 0 ? (
                            <svg className="w-8 h-8 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        ) : (
                            <svg className="w-8 h-8 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        )}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                        {searchQuery || selectedTags.length > 0 ? 'No results found' : 'No articles yet'}
                    </h3>
                    <p className="text-sm text-muted-foreground text-center max-w-sm">
                        {searchQuery || selectedTags.length > 0
                            ? `Try adjusting your filters or browse all articles.`
                            : 'Check back soon for new stories and insights from our community.'
                        }
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredPosts.map((post) => (
                        <BlogCard key={post._id} post={post} />
                    ))}
                </div>
            )}
        </>
    );
};

export default BlogList;
