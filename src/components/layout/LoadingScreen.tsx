import React from 'react';
import { motion } from 'framer-motion';
import { EASE_SMOOTH } from '../../animations/variants';
import { Logo } from '../ui/Logo';

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed inset-0 z-[100] grid place-items-center bg-white">
      
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_SMOOTH }}>
          
          <Logo size="lg" />
        </motion.div>
        <div className="mt-5 h-[3px] w-40 overflow-hidden rounded-full bg-line">
          <motion.div
            className="h-full w-1/3 rounded-full bg-accent"
            animate={{ x: ['-110%', '330%'] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: EASE_SMOOTH }} />
          
        </div>
        <p className="mt-4 text-[12px] tracking-[0.18em] text-muted">CURATING YOUR STORE</p>
      </div>
    </motion.div>);

}