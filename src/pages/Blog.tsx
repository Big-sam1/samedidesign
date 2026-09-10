import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { NewspaperIcon } from 'lucide-react';
import { blogCategories } from '../data/blog';
import { useData } from '../contexts/DataContext';
import { staggerContainer, viewportOnce } from '../animations/variants';
import { BlogCard } from '../components/blog/BlogCard';
import { BlogCardSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { cn } from '../utils/format';

export function Blog() {
  const { blogPosts } = useData();
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 380);
    return () => window.clearTimeout(timer);
  }, []);

  const posts = category === 'All' ? blogPosts : blogPosts.filter((post) => post.category === category);
  const [featured, ...rest] = posts;

  return (
    <>
      <PageHeader
        title="Men & Boys Styling & Blog"
        subtitle="Men &amp; Boys Clothing · Sizing guides, streetwear drops, and styling stories from Samedi design in Nyamirambo Biryogo."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Blog' }]} />
      

      <div className="mx-auto w-full max-w-shell px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Blog categories">
          {blogCategories.map((option) =>
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={category === option}
            onClick={() => setCategory(option)}
            className={cn(
              'rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors duration-200',
              category === option ? 'border-accent bg-accent text-white' : 'border-line bg-white text-charcoal hover:border-ink/30'
            )}>
            
              {option}
            </button>
          )}
        </div>

        {loading ?
        <div className="grid gap-5 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) =>
          <BlogCardSkeleton key={index} />
          )}
          </div> :
        posts.length === 0 ?
        <EmptyState
          icon={NewspaperIcon}
          title="No articles in this category yet"
          description="We publish two to three pieces a month. Try another category in the meantime."
          actionLabel="View all articles"
          onAction={() => setCategory('All')} /> :


        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce} className="space-y-5">
            <div className="grid gap-5 lg:grid-cols-2">
              <BlogCard post={featured} featured />
              {rest[0] && <BlogCard post={rest[0]} featured />}
            </div>
            {rest.length > 1 &&
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {rest.slice(1).map((post) =>
            <BlogCard key={post.slug} post={post} />
            )}
              </div>
          }
          </motion.div>
        }
      </div>
    </>);

}