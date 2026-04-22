'use client';

import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';

const ShowcaseSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [activeIndex, setActiveIndex] = useState(1);
    const [isPaused, setIsPaused] = useState(false);

    const cards = [
        {
            title: "Getting Started with Next.js",
            author: "Sarah Chen",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
            readTime: "5 min",
            gradient: "from-blue-500 to-cyan-500",
        },
        {
            title: "The Art of Clean Code",
            author: "Mike Johnson",
            image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
            readTime: "8 min",
            gradient: "from-violet-500 to-fuchsia-500",
        },
        {
            title: "Building for Scale",
            author: "Emily Park",
            image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=300&fit=crop",
            readTime: "6 min",
            gradient: "from-orange-500 to-rose-500",
        },
    ];

    // Auto-rotate cards
    useEffect(() => {
        if (isPaused || !isInView) return;
        
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % cards.length);
        }, 3000);
        
        return () => clearInterval(interval);
    }, [isPaused, isInView, cards.length]);

    return (
        <section ref={ref} className="relative py-24 px-4 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left side - Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full border border-border bg-card/50 text-sm font-medium text-muted-foreground">
                            Showcase
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                            Stories that
                            <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent"> inspire </span>
                            and
                            <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent"> connect</span>
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Join thousands of writers sharing their knowledge, experiences, and perspectives. 
                            Every story matters, and yours could be next.
                        </p>

                        <div className="space-y-4 pt-4">
                            {[
                                { 
                                    icon: (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    ), 
                                    text: 'Beautiful reading experience' 
                                },
                                { 
                                    icon: (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                        </svg>
                                    ), 
                                    text: 'SEO optimized for discoverability' 
                                },
                                { 
                                    icon: (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                        </svg>
                                    ), 
                                    text: 'Engage with thoughtful comments' 
                                },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.text}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
                                        {item.icon}
                                    </span>
                                    <span className="text-foreground">{item.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right side - Fan cards */}
                    <div 
                        className="relative h-[450px] flex items-center justify-center perspective-1000"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {/* Background glow */}
                        <div className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-violet-500/15 to-fuchsia-500/15 blur-3xl" />
                        
                        {/* Cards in fan layout */}
                        <div className="relative w-72 h-96">
                            {cards.map((card, index) => {
                                const isActive = activeIndex === index;
                                const offset = index - activeIndex;
                                
                                return (
                                    <motion.div
                                        key={card.title}
                                        initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                                        animate={isInView ? { 
                                            opacity: 1,
                                            scale: isActive ? 1 : 0.85,
                                            rotateY: offset * 15,
                                            x: offset * 60,
                                            z: isActive ? 50 : 0,
                                        } : {}}
                                        transition={{ 
                                            duration: 0.5, 
                                            delay: index * 0.1,
                                            type: "spring",
                                            stiffness: 100,
                                        }}
                                        onClick={() => setActiveIndex(index)}
                                        style={{ 
                                            zIndex: isActive ? 10 : 5 - Math.abs(offset),
                                            transformStyle: 'preserve-3d',
                                        }}
                                        className="absolute inset-0 cursor-pointer"
                                    >
                                        <motion.div
                                            whileHover={{ scale: isActive ? 1.02 : 0.9 }}
                                            className={`w-full h-full rounded-2xl overflow-hidden border-2 shadow-2xl transition-all duration-300 ${
                                                isActive 
                                                    ? 'border-primary/50 shadow-primary/20' 
                                                    : 'border-border/50 shadow-black/10'
                                            }`}
                                        >
                                            {/* Image */}
                                            <div className="relative h-1/2 overflow-hidden">
                                                <img
                                                    src={card.image}
                                                    alt={card.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className={`absolute inset-0 bg-gradient-to-t ${card.gradient} opacity-30`} />
                                                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                                                
                                                {/* Read time badge */}
                                                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white text-xs">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {card.readTime}
                                                </div>
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="h-1/2 p-5 bg-card flex flex-col justify-between">
                                                <div>
                                                    <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">
                                                        {card.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        Discover insights and best practices from industry experts.
                                                    </p>
                                                </div>
                                                
                                                <div className="flex items-center justify-between pt-3 border-t border-border">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${card.gradient}`} />
                                                        <span className="text-sm font-medium text-foreground">{card.author}</span>
                                                    </div>
                                                    <motion.div
                                                        whileHover={{ x: 3 }}
                                                        className="text-primary"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                        </svg>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
                        </div>
                        
                        {/* Navigation dots */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {cards.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                        activeIndex === index 
                                            ? 'w-6 bg-primary' 
                                            : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShowcaseSection;
