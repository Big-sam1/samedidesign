import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, viewportOnce } from '../../animations/variants';
import { ProductCard } from './ProductCard';
import { cn } from '../../utils/format';
import type { Product } from '../../types';

interface ProductGridProps {
  products: Product[];
  layout?: 'grid' | 'list';
  columnsClassName?: string;
}

export function ProductGrid({ products, layout = 'grid', columnsClassName }: ProductGridProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={cn(
        layout === 'list' ?
        'flex flex-col gap-4' :
        cn('grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4', columnsClassName)
      )}>
      
      {products.map((product) =>
      <ProductCard key={product.id} product={product} layout={layout} />
      )}
    </motion.div>);

}