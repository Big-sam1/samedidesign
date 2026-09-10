import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin reading-progress bar pinned under the navbar. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 34, mass: 0.3 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-accent" />);


}