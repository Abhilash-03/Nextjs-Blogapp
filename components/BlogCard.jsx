'use client';

import Link from "next/link";
import { motion } from "motion/react";
import { User } from "lucide-react";

const fallbackImage = 'https://thumbs.dreamstime.com/b/blogging-blog-concepts-ideas-worktable-blogging-blog-concepts-ideas-white-worktable-110423482.jpg';

const BlogCard = ({ post }) => {
  const createdAt = new Date(post.createdAt);
  function postAgeLabel(createdAtString) {
    const created = new Date(createdAtString);
    const now = new Date();
  
    const diffMs = now.getTime() - created.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
    if (days < 1) return 'New';
    if (days === 1) return '1 day ago';
    if (days < 30) return `${days} days ago`;
  
    // months/years
    const months =
      (now.getFullYear() - created.getFullYear()) * 12 +
      (now.getMonth() - created.getMonth()) -
      (now.getDate() < created.getDate() ? 1 : 0);
  
    if (months < 1) return 'Less than a month ago';
    if (months === 1) return '1 month ago';
    if (months < 12) return `${months} months ago`;
  
    const years = Math.floor(months / 12);
    if (years === 1) return '1 year ago';
    return `${years} years ago`;
  }

  const dateLabel = createdAt.toLocaleDateString('en-IN');
  const author = post?.author?.name || 'Unknown author';
  
  return (
    <Link href={`/blog/${post.slug}`} className="block h-full">
      <motion.div
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileTap={{ scale: 0.995 }}
        transition={{ type: "spring", stiffness: 240, damping: 18 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/80 shadow-lg backdrop-blur"
        variants={{
          rest: { y: 0, scale: 1 },
          hover: { y: -6, scale: 1.01 },
        }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent"
          variants={{
            rest: { x: '-120%', opacity: 0 },
            hover: {
              x: '120%',
              opacity: 0.55,
              transition: { duration: 1.4, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' },
            },
          }}
        />
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_20%,rgba(93,76,255,0.16),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(76,196,255,0.16),transparent_35%)]" />

        <div className="relative">
          <img
            src={post?.image || fallbackImage}
            alt={post.title}
            className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 py-3 text-xs text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {dateLabel}
            </span>
            <span className="text-[11px] uppercase tracking-[0.15em] text-white/80">Read</span>
          </div>
        </div>

        <div className="relative flex flex-1 flex-col gap-3 px-4 py-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {post.author.image ? 
             <img src={post?.author?.image || null} alt={author} className="h-8 w-8 rounded-full" /> :
             <User className="w-6 h-6 rounded-full" />
            }
            <div className="leading-tight">
              <p className="text-sm font-semibold text-foreground capitalize">{author}</p>
              <p className="text-[12px] text-muted-foreground">Author</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
            {post.title}
          </h3>

          <p className="line-clamp-2 text-sm text-muted-foreground">
            {post.description || "Dive into this story to learn more about design, product, and engineering craft."}
          </p>

          <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {postAgeLabel(post.createdAt)}
            </span>
            <span className="transition text-primary group-hover:translate-x-1">Read more →</span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default BlogCard
