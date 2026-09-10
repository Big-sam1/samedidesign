import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2Icon, InfoIcon, TriangleAlertIcon, XIcon } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { springSoft } from '../../animations/variants';

const toneIcon = {
  success: CheckCircle2Icon,
  info: InfoIcon,
  error: TriangleAlertIcon
};

const toneColor = {
  success: 'text-emerald-500',
  info: 'text-charcoal',
  error: 'text-red-500'
};

export function ToastHost() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[90] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2 sm:left-auto sm:right-6 sm:translate-x-0">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = toneIcon[toast.tone];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={springSoft}
              role="status"
              className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-line bg-white/95 px-4 py-3 shadow-lift backdrop-blur">
              
              <Icon className={`h-[18px] w-[18px] shrink-0 ${toneColor[toast.tone]}`} aria-hidden="true" />
              <p className="flex-1 text-[13px] font-medium text-ink">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
                className="grid h-6 w-6 place-items-center rounded-full text-muted transition-colors duration-150 hover:bg-canvas hover:text-ink">
                
                <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </motion.div>);

        })}
      </AnimatePresence>
    </div>);

}