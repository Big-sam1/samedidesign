import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { fadeUp, staggerContainer, viewportOnce } from '../../animations/variants';

interface RevealProps {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'li' | 'article' | 'header';
}

/** Fires a scroll-reveal animation once the element enters the viewport. */
export function Reveal({ children, variants = fadeUp, className, delay = 0, as = 'div' }: RevealProps) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={delay ? { delay } : undefined}>
      
      {children}
    </Component>);

}

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'ul' | 'ol';
}

/** Parent wrapper that staggers the entrance of any `Reveal`/motion children. */
export function Stagger({ children, className, as = 'div' }: StaggerProps) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component className={className} variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
      {children}
    </Component>);

}