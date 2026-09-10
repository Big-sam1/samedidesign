import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBagIcon } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { fadeUp, springSnappy } from '../../animations/variants';
import { formatPrice } from '../../utils/format';
import { RatingStars } from '../ui/RatingStars';
import { WishlistButton } from './WishlistButton';
import type { Product } from '../../types';

export function BestSellerCard({ product }: {product: Product;}) {
  const { addToCart } = useStore();

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="group flex h-full gap-4 overflow-hidden rounded-2xl border border-line bg-canvas p-4 transition-shadow duration-300 ease-smooth hover:shadow-lift sm:gap-5">
      
      <Link to={`/product/${product.id}`} className="relative w-[38%] max-w-[168px] shrink-0 overflow-hidden rounded-xl bg-white">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="aspect-square w-full object-cover transition-transform duration-500 ease-smooth group-hover:scale-105" />
        
        <span className="absolute left-2 top-2 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
          Bestseller
        </span>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="text-[15px] font-semibold leading-snug text-ink">
          <Link to={`/product/${product.id}`} className="transition-colors duration-150 hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-base font-bold text-ink">{formatPrice(product.price)}</p>
        <RatingStars rating={product.rating} reviews={product.reviews} className="mt-1.5" />
        <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-muted">{product.description}</p>
        <div className="mt-auto flex items-center gap-2 pt-4">
          <motion.button
            type="button"
            onClick={() => addToCart(product.id, 1, product.colors[0]?.name, product.sizes[0])}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={springSnappy}
            className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-accent">
            
            Quick Add
          </motion.button>
          <WishlistButton productId={product.id} />
          <Link
            to={`/product/${product.id}`}
            aria-label={`View ${product.name}`}
            className="grid h-8 w-8 place-items-center rounded-full border border-line bg-white text-charcoal transition-colors duration-200 hover:text-accent">
            
            <ShoppingBagIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.article>);

}