import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, ShoppingBagIcon } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { fadeUp, springSnappy } from '../../animations/variants';
import { discountPercent, formatPrice } from '../../utils/format';
import { RatingStars } from '../ui/RatingStars';
import { WishlistButton } from './WishlistButton';
import type { Product } from '../../types';

const badgeStyles: Record<string, string> = {
  New: 'bg-ink text-white',
  Sale: 'bg-accent text-white',
  Bestseller: 'bg-amber-400 text-ink'
};

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

export function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
  const { addToCart } = useStore();
  const [added, setAdded] = useState(false);
  const off = discountPercent(product.price, product.oldPrice);

  const handleAdd = (event: React.MouseEvent) => {
    event.preventDefault();
    addToCart(product.id, 1, product.colors[0]?.name, product.sizes[0]);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  if (layout === 'list') {
    return (
      <motion.article variants={fadeUp} className="group flex gap-5 rounded-2xl border border-line bg-white p-4 transition-shadow duration-300 ease-smooth hover:shadow-card">
        <Link to={`/product/${product.id}`} className="relative w-28 shrink-0 overflow-hidden rounded-xl bg-canvas sm:w-40">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-500 ease-smooth group-hover:scale-105" />
          
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{product.brand}</p>
              <h3 className="mt-1 truncate text-[15px] font-semibold text-ink">
                <Link to={`/product/${product.id}`}>{product.name}</Link>
              </h3>
            </div>
            <WishlistButton productId={product.id} />
          </div>
          <RatingStars rating={product.rating} reviews={product.reviews} className="mt-2" />
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">{product.description}</p>
          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-ink">{formatPrice(product.price)}</span>
              {product.oldPrice && <span className="text-[13px] text-muted line-through">{formatPrice(product.oldPrice)}</span>}
            </div>
            <motion.button
              type="button"
              onClick={handleAdd}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={springSnappy}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-ink px-4 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-charcoal">
              
              {added ? <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" /> : <ShoppingBagIcon className="h-3.5 w-3.5" aria-hidden="true" />}
              {added ? 'Added' : 'Add to cart'}
            </motion.button>
          </div>
        </div>
      </motion.article>);

  }

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow duration-300 ease-smooth hover:shadow-lift">
      
      <Link to={`/product/${product.id}`} className="relative block overflow-hidden bg-canvas">
        <div className="aspect-square w-full overflow-hidden">
          <motion.img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }} />
          
          {product.images[1] &&
          <img
            src={product.images[1]}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-smooth group-hover:opacity-100" />

          }
        </div>

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.badge &&
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${badgeStyles[product.badge]}`}>
              {product.badge}
            </span>
          }
          {off && !product.badge &&
          <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold text-white">-{off}%</span>
          }
        </div>

        <div className="absolute right-3 top-3">
          <WishlistButton productId={product.id} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{product.brand}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-ink">
          <Link to={`/product/${product.id}`} className="transition-colors duration-150 hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[15px] font-bold text-ink">{formatPrice(product.price)}</span>
          {product.oldPrice && <span className="text-xs text-muted line-through">{formatPrice(product.oldPrice)}</span>}
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <RatingStars rating={product.rating} reviews={product.reviews} />
          <motion.button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.88 }}
            transition={springSnappy}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-white transition-colors duration-200 hover:bg-accent">
            
            <AnimatePresence mode="wait" initial={false}>
              {added ?
              <motion.span key="check" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.16 }}>
                  <CheckIcon className="h-4 w-4" aria-hidden="true" />
                </motion.span> :

              <motion.span key="bag" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.16 }}>
                  <ShoppingBagIcon className="h-4 w-4" aria-hidden="true" />
                </motion.span>
              }
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.article>);

}