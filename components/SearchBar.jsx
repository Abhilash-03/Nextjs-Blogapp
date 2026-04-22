'use client';

import { useState, useEffect, useRef } from 'react';

const SearchBar = ({ onSearch, initialQuery = '' }) => {
    const [query, setQuery] = useState(initialQuery);
    const [isFocused, setIsFocused] = useState(false);
    const debounceRef = useRef(null);

    useEffect(() => {
        // Debounce search to avoid too many API calls
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            onSearch(query);
        }, 300);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query, onSearch]);

    const handleClear = () => {
        setQuery('');
    };

    return (
        <div className={`relative flex items-center w-full max-w-md transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
            <div className={`relative w-full flex items-center rounded-xl border bg-card transition-all duration-200 ${isFocused ? 'border-primary shadow-lg shadow-primary/10' : 'border-border hover:border-primary/50'}`}>
                {/* Search Icon */}
                <div className="flex items-center justify-center pl-4 pr-2">
                    <svg 
                        className={`w-5 h-5 transition-colors duration-200 ${isFocused ? 'text-primary' : 'text-muted-foreground'}`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Input */}
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Search articles..."
                    className="flex-1 bg-transparent py-3 pr-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />

                {/* Clear Button */}
                {query && (
                    <button
                        onClick={handleClear}
                        className="flex items-center justify-center p-2 mr-2 rounded-lg hover:bg-muted/50 transition-colors"
                        type="button"
                    >
                        <svg className="w-4 h-4 text-muted-foreground hover:text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
