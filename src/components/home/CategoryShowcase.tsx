import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ArrowUpRightIcon } from 'lucide-react';
import { categories } from '../../data/categories';
import { products } from '../../data/products';
import { EASE_SMOOTH, fadeUp, staggerContainer, viewportOnce } from '../../animations/variants';
import { cn } from '../../utils/format';

const OVERLAY = 'bg-[#101216]/55';

function countFor(slug: string): number {
  return products.filter((product) => product.category === slug).length;
}

/** Editorial category layout: one large feature tile plus a supporting grid. */
export function CategoryShowcase() {
  const [feature, ...rest] = categories;
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="grid gap-4 lg:grid-cols-[1.05fr_1.6fr]">
      
      <motion.div variants={fadeUp} className="min-h-[320px]">
        <Link
          to={`/category/${feature.slug}`}
          onMouseEnter={() => setHovered(feature.slug)}
          onMouseLeave={() => setHovered(null)}
          className="group relative flex h-full min-h-[320px] flex-col justify-end overflow-hidden rounded-3xl border border-line bg-canvas p-7">
          
          <img
            src={feature.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[700ms] ease-smooth group-hover:scale-[1.06]" />
          
          <span className={cn('absolute inset-0 transition-colors duration-300', OVERLAY, 'group-hover:bg-[#101216]/65')} aria-hidden="true" />
          <div className="relative">
            <span className="inline-block rounded-full bg-[#ffffff]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#ffffff] backdrop-blur-sm">
              Featured
            </span>
            <h3 className="mt-4 text-[30px] font-extrabold leading-tight text-[#ffffff]">{feature.name}</h3>
            <p className="mt-2 max-w-xs text-[13.5px] leading-relaxed text-[#ffffff]/75">{feature.blurb}</p>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#ffffff] px-5 py-2.5 text-[13px] font-bold text-[#101216] transition-transform duration-300 ease-smooth group-hover:translate-x-1">
              Shop {feature.name}
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-rows-2">
        {rest.map((category) => {
          const isHovered = hovered === category.slug;
          return (
            <motion.div key={category.slug} variants={fadeUp}>
              <Link
                to={`/category/${category.slug}`}
                onMouseEnter={() => setHovered(category.slug)}
                onMouseLeave={() => setHovered(null)}
                className="group relative flex h-full min-h-[152px] flex-col overflow-hidden rounded-2xl border border-line bg-white">
                
                <div className="relative flex-1 overflow-hidden bg-canvas">
                  <img
                    src={category.image}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover transition-transform duration-[600ms] ease-smooth group-hover:scale-[1.08]" />
                  
                  <motion.span
                    initial={false}
                    animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 6 }}
                    transition={{ duration: 0.24, ease: EASE_SMOOTH }}
                    className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-[#ffffff] text-[#101216] shadow-card"
                    aria-hidden="true">
                    
                    <ArrowUpRightIcon className="h-4 w-4" />
                  </motion.span>
                  <span className="absolute left-2.5 top-2.5 rounded-full bg-[#101216]/70 px-2.5 py-1 text-[10.5px] font-semibold text-[#ffffff] backdrop-blur-sm">
                    {countFor(category.slug)} items
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-bold text-ink">{category.name}</p>
                    <p className="text-[11.5px] font-medium text-muted">Shop Now</p>
                  </div>
                  <ArrowRightIcon
                    className="h-4 w-4 shrink-0 text-muted transition-all duration-300 ease-smooth group-hover:translate-x-1 group-hover:text-accent"
                    aria-hidden="true" />
                  
                </div>
              </Link>
            </motion.div>);

        })}
      </div>
    </motion.div>);

}