import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/format';

export function LoadingSpinner({ className, label = 'Loading' }: {className?: string;label?: string;}) {
  return (
    <div className={cn('inline-flex items-center gap-2.5 text-sm text-muted', className)} role="status">
      <motion.span
        className="block h-4 w-4 rounded-full border-2 border-line border-t-accent"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} />
      
      <span>{label}</span>
    </div>);

}