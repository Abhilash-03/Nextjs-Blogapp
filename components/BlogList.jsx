'use client';

import { useState, useCallback } from 'react';
import BlogCard from './BlogCard';
import SearchBar from './SearchBar';

const BlogList = ({ initialPosts }) => {
    const [posts, setPosts] = useState(initialPosts);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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

    return (
        <>
            {/* Filter bar with search */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                        {searchQuery ? 'Search Results' : 'Latest Posts'}
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
                        {searchQuery 
                            ? `Found ${posts.length} article${posts.length !== 1 ? 's' : ''} for "${searchQuery}"`
                            : `Showing ${posts.length} articles`
                        }
                    </span>
                )}
            </div>

            {/* Posts grid */}
            {posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border bg-card/30">
                    <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-muted/50">
                        {searchQuery ? (
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
                        {searchQuery ? 'No results found' : 'No articles yet'}
                    </h3>
                    <p className="text-sm text-muted-foreground text-center max-w-sm">
                        {searchQuery 
                            ? `Try adjusting your search terms or browse all articles.`
                            : 'Check back soon for new stories and insights from our community.'
                        }
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <BlogCard key={post._id} post={post} />
                    ))}
                </div>
            )}
        </>
    );
};

export default BlogList;
