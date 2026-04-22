'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import Link from 'next/link';

const CTASection = ({ session }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="relative py-24 px-4 overflow-hidden">
            {/* Background gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent" />
            <motion.div
                className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl"
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                }}
                transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-fuchsia-500/10 blur-3xl"
                animate={{
                    x: [0, -50, 0],
                    y: [0, -30, 0],
                }}
                transition={{ duration: 8, repeat: Infinity }}
            />

            <div className="relative max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="relative rounded-3xl border border-border bg-card/80 backdrop-blur-xl p-8 md:p-12 text-center overflow-hidden"
                >
                    {/* Inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/10 rounded-3xl" />
                    
                    <div className="relative space-y-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={isInView ? { scale: 1 } : {}}
                            transition={{ duration: 0.4, delay: 0.2, type: "spring" }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white mx-auto"
                        >
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="text-3xl md:text-4xl font-bold"
                        >
                            Ready to start your journey?
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="text-lg text-muted-foreground max-w-xl mx-auto"
                        >
                            Join our community of writers and readers. Share your story, 
                            learn from others, and grow together.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="flex flex-wrap items-center justify-center gap-4 pt-4"
                        >
                            {!session ? (
                                <Link href="/auth/signup">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-lg shadow-lg shadow-violet-500/25"
                                    >
                                        <span className="flex items-center gap-2">
                                            Create Your Account
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </span>
                                    </motion.button>
                                </Link>
                            ) : (
                                <Link href="/dashboard/createpost">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-lg shadow-lg shadow-violet-500/25"
                                    >
                                        <span className="flex items-center gap-2">
                                            Write Your First Post
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </span>
                                    </motion.button>
                                </Link>
                            )}
                            
                            <Link href="/blog">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 rounded-2xl border-2 border-border bg-background/50 font-semibold text-lg hover:border-primary/50 transition-all"
                                >
                                    Browse Articles
                                </motion.button>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Footer note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="text-center text-sm text-muted-foreground mt-8"
                >
                    No credit card required · Free forever · Start writing in seconds
                </motion.p>
            </div>
        </section>
    );
};

export default CTASection;
