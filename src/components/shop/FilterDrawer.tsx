import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { EASE_SMOOTH } from '../../animations/variants';
import { Button } from '../ui/Button';
import { FilterSidebar } from './FilterSidebar';
import type { FilterState } from '../../hooks/useProductFilters';

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  resultCount: number;
  filters: FilterState;
  setValue: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  toggleValue: (key: 'categories' | 'brands' | 'sizes' | 'colors', value: string) => void;
  reset: () => void;
  activeCount: number;
  lockedCategory?: boolean;
}

export function FilterDrawer({ open, onClose, resultCount, ...sidebarProps }: FilterDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open &&
      <div className="fixed inset-0 z-[80] lg:hidden">
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        
          <motion.aside
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.3, ease: EASE_SMOOTH }}
          aria-label="Product filters"
          className="absolute left-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-white">
          
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <p className="text-[15px] font-bold text-ink">Filter products</p>
              <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-charcoal">
              
                <XIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <FilterSidebar {...sidebarProps} />
            </div>
            <div className="border-t border-line p-5">
              <Button onClick={onClose} fullWidth size="lg">
                Show {resultCount} {resultCount === 1 ? 'product' : 'products'}
              </Button>
            </div>
          </motion.aside>
        </div>
      }
    </AnimatePresence>);

}