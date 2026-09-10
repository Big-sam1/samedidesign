import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '../../animations/variants';

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className="w-full flex-1"
    >
      {children}
    </motion.main>
  );
}