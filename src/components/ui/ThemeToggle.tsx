import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { springSnappy } from '../../animations/variants';
import { cn } from '../../utils/format';

export function ThemeToggle({ className }: {className?: string;}) {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={dark}
      title={dark ? 'Light mode' : 'Dark mode'}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.9 }}
      transition={springSnappy}
      className={cn(
        'relative grid h-10 w-10 place-items-center overflow-hidden rounded-full text-charcoal transition-colors duration-200 hover:bg-canvas hover:text-ink',
        className
      )}>
      
      <AnimatePresence mode="wait" initial={false}>
        {dark ?
        <motion.span
          key="sun"
          initial={{ y: 14, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="grid place-items-center">
          
            <SunIcon className="h-[18px] w-[18px]" aria-hidden="true" />
          </motion.span> :

        <motion.span
          key="moon"
          initial={{ y: 14, opacity: 0, rotate: 45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: -45 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="grid place-items-center">
          
            <MoonIcon className="h-[18px] w-[18px]" aria-hidden="true" />
          </motion.span>
        }
      </AnimatePresence>
    </motion.button>);

}