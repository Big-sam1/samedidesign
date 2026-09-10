import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { springSnappy } from '../../animations/variants';
import { cn } from '../../utils/format';

type Variant = 'primary' | 'secondary' | 'dark' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-hover shadow-[0_8px_20px_-10px_rgba(244,85,29,0.75)]',
  secondary: 'bg-white text-ink border border-line hover:border-ink/30 hover:bg-canvas',
  dark: 'bg-ink text-white hover:bg-charcoal',
  ghost: 'bg-transparent text-ink hover:bg-canvas'
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-[52px] px-7 text-[15px]'
};

const base =
'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.01em] transition-colors duration-200 ease-smooth disabled:opacity-50 disabled:pointer-events-none';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  /** When set, the button renders as a react-router link. */
  to?: string;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', fullWidth, className, to, children, ...rest }: ButtonProps) {
  const classes = cn(base, variantClasses[variant], sizeClasses[size], fullWidth && 'w-full', className);

  if (to) {
    return (
      <motion.span
        className={cn('inline-flex', fullWidth && 'w-full')}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={springSnappy}>
        
        <Link to={to} onClick={rest.onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>} className={classes}>
          {children}
        </Link>
      </motion.span>);

  }

  return (
    <motion.button
      {...rest}
      className={classes}
      whileHover={{ scale: rest.disabled ? 1 : 1.02 }}
      whileTap={{ scale: rest.disabled ? 1 : 0.97 }}
      transition={springSnappy}>
      
      {children}
    </motion.button>);

}