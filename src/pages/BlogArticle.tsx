import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon, FileQuestionIcon, UserIcon } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { EASE_SMOOTH, staggerContainer, viewportOnce } from '../animations/variants';
import { BlogCard } from '../components/blog/BlogCard';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { EmptyState } from '../components/ui/EmptyState';
import { SectionHeading } from '../components/ui/SectionHeading';

export function BlogArticle() {
  const { slug = '' } = useParams();
  const { blogPosts } = useData();
  const post = blogPosts.find((item) => item.slug === slug);
  const related = blogPosts.filter((item) => item.slug !== slug).slice(0, 3);

  if (!post) {
    return (
      <div className="mx-auto w-full max-w-shell px-4 py-20 sm:px-6">
        <EmptyState
          icon={FileQuestionIcon}
          title="Article not found"
          description="That article may have been moved or renamed. Browse the blog for the latest pieces."
          actionLabel="Back to blog"
          actionTo="/blog" />
        
      </div>);

  }

  return (
    <article className="mx-auto w-full max-w-shell px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Blog', to: '/blog' }, { label: post.category }]} />

      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_SMOOTH }}
        className="mx-auto mt-7 max-w-3xl text-center">
        
        <span className="rounded-full bg-accent-soft px-3 py-1 text-[11.5px] font-bold uppercase tracking-wide text-accent">
          {post.category}
        </span>
        <h1 className="mt-5 text-[30px] font-extrabold leading-tight text-ink sm:text-[42px]">{post.title}</h1>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-5 text-[13px] text-muted">
          <span className="flex items-center gap-1.5">
            <UserIcon className="h-4 w-4" aria-hidden="true" />
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarIcon className="h-4 w-4" aria-hidden="true" />
            {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4" aria-hidden="true" />
            {post.readTime}
          </span>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.08 }}
        className="mt-9 flex max-h-[560px] items-center justify-center overflow-hidden rounded-3xl bg-canvas p-3">
        
        <img src={post.image} alt={post.title} className="max-h-[530px] w-full rounded-2xl object-contain" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_SMOOTH, delay: 0.14 }}
        className="mx-auto mt-10 max-w-3xl">
        
        <p className="border-l-2 border-accent pl-5 text-[17px] font-medium leading-relaxed text-ink">{post.excerpt}</p>
        <div className="mt-7 space-y-5 text-[15.5px] leading-[1.75] text-charcoal">
          {post.body.map((paragraph, index) =>
          <p key={index}>{paragraph}</p>
          )}
        </div>
      </motion.div>

      <section className="mt-16" aria-labelledby="related-articles">
        <div id="related-articles">
          <SectionHeading title="Related articles" linkLabel="All articles" linkTo="/blog" />
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid gap-5 md:grid-cols-3">
          
          {related.map((item) =>
          <BlogCard key={item.slug} post={item} />
          )}
        </motion.div>
      </section>
    </article>);

}