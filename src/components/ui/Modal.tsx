import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { EASE_SMOOTH } from '../../animations/variants';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ open, onClose, title, description, children, footer }: ModalProps) {
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
      <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.26, ease: EASE_SMOOTH }}
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-t-3xl border border-line bg-white shadow-lift sm:rounded-3xl">
          
            <div className="flex items-start justify-between gap-6 border-b border-line px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-ink">{title}</h2>
                {description && <p className="mt-1 text-sm text-muted">{description}</p>}
              </div>
              <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-charcoal transition-colors duration-150 hover:bg-canvas">
              
                <XIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            {children && <div className="px-6 py-5">{children}</div>}
            {footer && <div className="border-t border-line bg-canvas px-6 py-4">{footer}</div>}
          </motion.div>
        </div>
      }
    </AnimatePresence>);

}