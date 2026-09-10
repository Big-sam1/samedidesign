import type { Transition, Variants } from 'framer-motion';

export const EASE_SMOOTH = [0.23, 1, 0.32, 1] as const;

export const springSoft: Transition = { type: 'spring', stiffness: 380, damping: 30, mass: 0.6 };
export const springSnappy: Transition = { type: 'spring', stiffness: 520, damping: 26, mass: 0.5 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_SMOOTH } }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.45, ease: EASE_SMOOTH } }
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -36 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE_SMOOTH } }
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 36 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE_SMOOTH } }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE_SMOOTH } }
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } }
};

export const floating = (distance = 10, duration = 5, delay = 0) => ({
  animate: {
    y: [0, -distance, 0],
    transition: { duration, repeat: Infinity, ease: 'easeInOut' as const, delay }
  }
});

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_SMOOTH } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeOut' } }
};

export const viewportOnce = { once: true, amount: 0.2 } as const;