import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { springSnappy, staggerContainer, viewportOnce } from '../../animations/variants';
import { ProductCard } from './ProductCard';
import type { Product } from '../../types';

export function ProductCarousel({ products }: {products: Product[];}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * Math.min(track.clientWidth * 0.8, 720), behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <motion.div
        ref={trackRef}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        
        {products.map((product) =>
        <div key={product.id} className="w-[calc(50%-8px)] shrink-0 snap-start sm:w-[calc(33.333%-11px)] lg:w-[calc(16.666%-14px)]">
            <ProductCard product={product} />
          </div>
        )}
      </motion.div>

      <div className="pointer-events-none absolute -left-3 top-1/2 hidden -translate-y-1/2 lg:block">
        <motion.button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Scroll products left"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          transition={springSnappy}
          className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-charcoal shadow-card transition-colors duration-200 hover:text-accent">
          
          <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
        </motion.button>
      </div>
      <div className="pointer-events-none absolute -right-3 top-1/2 hidden -translate-y-1/2 lg:block">
        <motion.button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Scroll products right"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          transition={springSnappy}
          className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-charcoal shadow-card transition-colors duration-200 hover:text-accent">
          
          <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
        </motion.button>
      </div>
    </div>);

}