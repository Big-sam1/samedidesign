import React, { useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowUpIcon } from 'lucide-react';
import { springSoft } from '../../animations/variants';

/** Floating scroll-to-top control — prominent on small screens where pages are long. */
export function BackToTop() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, 'change', (value) => setVisible(value > 620));

  return (
    <AnimatePresence>
      {visible &&
      <motion.button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        initial={{ opacity: 0, y: 18, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.92 }}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.9 }}
        transition={springSoft}
        className="fixed bottom-5 left-5 z-[75] grid h-12 w-12 place-items-center rounded-full border border-line bg-white text-ink shadow-lift sm:bottom-6 sm:right-6 sm:left-auto">
        
          <ArrowUpIcon className="h-5 w-5" aria-hidden="true" />
        </motion.button>
      }
    </AnimatePresence>);

}