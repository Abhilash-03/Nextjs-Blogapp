'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Parse headings from HTML content
const parseHeadings = (content) => {
    if (!content) return [];
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3');
    
    return Array.from(headings).map((heading, index) => {
        const text = heading.textContent.trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return {
            id: `heading-${index}-${id}`,
            text,
            level: parseInt(heading.tagName.charAt(1)),
        };
    });
};

// Add IDs to headings in content
export const addHeadingIds = (content) => {
    if (!content) return content;
    
    let index = 0;
    return content.replace(/<(h[1-3])([^>]*)>(.*?)<\/\1>/gi, (match, tag, attrs, text) => {
        const cleanText = text.replace(/<[^>]*>/g, '').trim();
        const id = cleanText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const headingId = `heading-${index}-${id}`;
        index++;
        return `<${tag}${attrs} id="${headingId}">${text}</${tag}>`;
    });
};

// Inline TOC component (shown above content on medium screens)
export const InlineTableOfContents = ({ content }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const headings = useMemo(() => parseHeadings(content), [content]);
    
    if (headings.length < 3) return null;
    
    const scrollToHeading = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setIsExpanded(false);
        }
    };
    
    return (
        <div className="mb-8 rounded-xl border border-border bg-card/50 overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/50 transition-colors"
            >
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Table of Contents
                    <span className="text-xs font-normal text-muted-foreground">({headings.length} sections)</span>
                </span>
                <motion.svg 
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className="w-4 h-4 text-muted-foreground"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
            </button>
            
            <AnimatePresence>
                {isExpanded && (
                    <motion.nav
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-border overflow-hidden"
                    >
                        <ul className="p-4 space-y-1">
                            {headings.map((heading) => (
                                <li key={heading.id}>
                                    <button
                                        onClick={() => scrollToHeading(heading.id)}
                                        className={`w-full text-left py-2 px-3 rounded-lg transition-all text-sm hover:bg-muted ${
                                            heading.level === 1 ? 'font-medium text-foreground' : 
                                            heading.level === 2 ? 'pl-6 text-foreground' : 'pl-9 text-muted-foreground'
                                        }`}
                                    >
                                        {heading.text}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </motion.nav>
                )}
            </AnimatePresence>
        </div>
    );
};

// Sidebar TOC component (for xl+ screens)
export const SidebarTableOfContents = ({ content }) => {
    const [activeId, setActiveId] = useState('');
    const headings = useMemo(() => parseHeadings(content), [content]);
    
    if (headings.length < 3) return null;
    
    // Track active heading on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-80px 0px -80% 0px' }
        );
        
        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) observer.observe(element);
        });
        
        return () => observer.disconnect();
    }, [headings]);
    
    const scrollToHeading = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };
    
    return (
        <div className="sticky top-24">
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2 px-2">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    On this page
                </h3>
                <nav className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40 pr-2">
                    <ul className="space-y-0.5">
                        {headings.map((heading) => (
                            <li key={heading.id}>
                                <button
                                    onClick={() => scrollToHeading(heading.id)}
                                    className={`w-full text-left py-1.5 px-2 rounded-md transition-all text-sm leading-snug ${
                                        heading.level === 1 ? 'font-medium' : 
                                        heading.level === 2 ? 'pl-4' : 'pl-6 text-xs'
                                    } ${
                                        activeId === heading.id
                                            ? 'bg-primary/10 text-primary border-l-2 border-primary -ml-0.5 pl-2.5'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    }`}
                                >
                                    <span className="line-clamp-2">{heading.text}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

// Mobile floating TOC button
const TableOfContents = ({ content }) => {
    const [isOpen, setIsOpen] = useState(false);
    const headings = useMemo(() => parseHeadings(content), [content]);
    
    if (headings.length < 3) return null;
    
    const scrollToHeading = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setIsOpen(false);
        }
    };
    
    return (
        <>
            {/* Mobile/Tablet TOC Toggle - hidden on xl+ */}
            <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 xl:hidden flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <span className="text-sm font-medium">Contents</span>
            </motion.button>
            
            {/* Mobile TOC Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 xl:hidden"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 z-50 xl:hidden max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40 rounded-t-2xl bg-background border-t border-border shadow-xl"
                        >
                            <div className="sticky top-0 bg-background/80 backdrop-blur-sm px-6 py-4 border-b border-border flex items-center justify-between">
                                <h3 className="text-lg font-bold text-foreground">Table of Contents</h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-full hover:bg-muted transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <nav className="p-6">
                                <ul className="space-y-1">
                                    {headings.map((heading) => (
                                        <li key={heading.id}>
                                            <button
                                                onClick={() => scrollToHeading(heading.id)}
                                                className={`w-full text-left py-2 px-3 rounded-lg transition-all text-sm ${
                                                    heading.level === 1 ? 'font-semibold' : 
                                                    heading.level === 2 ? 'pl-5' : 'pl-8 text-muted-foreground'
                                                } hover:bg-muted text-foreground`}
                                            >
                                                {heading.text}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default TableOfContents;
