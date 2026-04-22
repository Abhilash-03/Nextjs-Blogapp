'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

const HeroSection = ({ session }) => {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating orbs */}
                <motion.div
                    className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 blur-3xl"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl"
                    animate={{
                        x: [0, -40, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
                <div className="text-center space-y-8">
                    {/* Main heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="space-y-4"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
                                Share your story
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
                                with the world
                            </span>
                        </h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                        >
                            Create beautiful articles, grow your audience, and join a community of passionate writers and readers.
                        </motion.p>
                    </motion.div>

                    {/* CTA buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-wrap items-center justify-center gap-4"
                    >
                        <Link href="/blog">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-lg shadow-lg shadow-violet-500/25 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Explore Articles
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600"
                                    initial={{ x: '100%' }}
                                    whileHover={{ x: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.button>
                        </Link>

                        {!session ? (
                            <Link href="/auth/signup">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 rounded-2xl border-2 border-border bg-background/50 backdrop-blur-sm font-semibold text-lg hover:border-primary/50 hover:bg-card transition-all"
                                >
                                    Get Started Free
                                </motion.button>
                            </Link>
                        ) : (
                            <Link href="/dashboard/createpost">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 rounded-2xl border-2 border-border bg-background/50 backdrop-blur-sm font-semibold text-lg hover:border-primary/50 hover:bg-card transition-all"
                                >
                                    Create Post
                                </motion.button>
                            </Link>
                        )}
                    </motion.div>

                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
                    <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
