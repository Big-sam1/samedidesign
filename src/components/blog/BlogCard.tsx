import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, CalendarIcon } from 'lucide-react';
import { fadeUp } from '../../animations/variants';
import type { BlogPost } from '../../types';

export function BlogCard({ post, featured = false }: {post: BlogPost;featured?: boolean;}) {
  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow duration-300 ease-smooth hover:shadow-lift">
      
      <Link to={`/blog/${post.slug}`} className="flex aspect-[16/9] items-center justify-center overflow-hidden bg-canvas p-0">
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="h-full w-full rounded-[1rem] object-cover transition-opacity duration-[600ms] ease-smooth group-hover:opacity-90" />
        
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-accent">
            {post.category}
          </span>
          <span className="flex items-center gap-1.5 text-[12px] text-muted">
            <CalendarIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {post.date}
          </span>
        </div>
        <h3 className={`mt-3 font-bold leading-snug text-ink ${featured ? 'text-xl' : 'text-[16px]'}`}>
          <Link to={`/blog/${post.slug}`} className="transition-colors duration-150 hover:text-accent">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-muted">{post.excerpt}</p>
        <Link
          to={`/blog/${post.slug}`}
          className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-semibold text-accent">
          
          Read More
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 ease-smooth group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </motion.article>);

}