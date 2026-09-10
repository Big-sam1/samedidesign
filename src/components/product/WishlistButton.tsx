import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { springSnappy } from '../../animations/variants';
import { cn } from '../../utils/format';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function WishlistButton({ productId, className, size = 'sm' }: WishlistButtonProps) {
  const { isWishlisted, toggleWishlist } = useStore();
  const active = isWishlisted(productId);
  const box = size === 'sm' ? 'h-8 w-8' : 'h-11 w-11';
  const icon = size === 'sm' ? 'h-4 w-4' : 'h-[18px] w-[18px]';

  return (
    <motion.button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleWishlist(productId);
      }}
      aria-pressed={active}
      aria-label={active ? 'Remove from wishlist' : 'Save to wishlist'}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.86 }}
      transition={springSnappy}
      className={cn(
        box,
        'grid place-items-center rounded-full border bg-white/95 backdrop-blur transition-colors duration-200 ease-smooth',
        active ? 'border-accent/30 text-accent' : 'border-line text-charcoal hover:text-accent',
        className
      )}>
      
      <motion.span animate={active ? { scale: [1, 1.35, 1] } : { scale: 1 }} transition={{ duration: 0.28, ease: 'easeOut' }}>
        <HeartIcon className={cn(icon, active && 'fill-accent')} aria-hidden="true" />
      </motion.span>
    </motion.button>);

}