import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CompassIcon } from 'lucide-react';
import { EASE_SMOOTH } from '../animations/variants';
import { Button } from '../components/ui/Button';

export function NotFound() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: EASE_SMOOTH }}
        className="relative">
        
        <p className="text-[92px] font-extrabold leading-none tracking-tight text-ink sm:text-[128px]">404</p>
        <motion.span
          animate={reduceMotion ? undefined : { y: [0, -10, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -right-4 top-2 grid h-14 w-14 place-items-center rounded-2xl border border-line bg-white text-accent shadow-float sm:-right-8">
          
          <CompassIcon className="h-6 w-6" aria-hidden="true" />
        </motion.span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_SMOOTH, delay: 0.08 }}
        className="mt-6 text-[26px] font-extrabold text-ink sm:text-[32px]">
        
        This page has wandered off
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_SMOOTH, delay: 0.14 }}
        className="mt-3 max-w-md text-[14.5px] leading-relaxed text-muted">
        
        The link may be out of date, or the product may have been retired. Try the shop — everything currently in stock
        lives there.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_SMOOTH, delay: 0.2 }}
        className="mt-8 flex flex-wrap justify-center gap-3">
        
        <Button to="/" size="lg">
          Back to home
        </Button>
        <Button to="/shop" variant="secondary" size="lg">
          Shop all products
        </Button>
      </motion.div>
    </div>);

}