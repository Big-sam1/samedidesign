import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { springSnappy } from '../../animations/variants';
import { cn } from '../../utils/format';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function QuantitySelector({ value, onChange, min = 1, max = 99, size = 'md', className }: QuantitySelectorProps) {
  const buttonSize = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  return (
    <div className={cn('inline-flex items-center rounded-full border border-line bg-white', className)}>
      <motion.button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        whileTap={{ scale: 0.88 }}
        transition={springSnappy}
        aria-label="Decrease quantity"
        className={cn(buttonSize, 'grid place-items-center rounded-full text-charcoal transition-colors duration-150 hover:bg-canvas disabled:opacity-40')}>
        
        <MinusIcon className="h-3.5 w-3.5" aria-hidden="true" />
      </motion.button>
      <span className="relative grid h-full w-9 place-items-center overflow-hidden text-sm font-semibold tabular-nums">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}>
            
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <motion.button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        whileTap={{ scale: 0.88 }}
        transition={springSnappy}
        aria-label="Increase quantity"
        className={cn(buttonSize, 'grid place-items-center rounded-full text-charcoal transition-colors duration-150 hover:bg-canvas disabled:opacity-40')}>
        
        <PlusIcon className="h-3.5 w-3.5" aria-hidden="true" />
      </motion.button>
    </div>);

}