import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { EASE_SMOOTH } from '../../animations/variants';
import { cn } from '../../utils/format';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  align?: 'left' | 'right';
}

export function Select({ value, options, onChange, label, className, align = 'right' }: SelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const active = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-10 w-full items-center justify-between gap-3 rounded-full border border-line bg-white px-4 text-[13px] font-medium text-ink transition-colors duration-200 ease-smooth hover:border-ink/30">
        
        <span className="truncate">
          {label && <span className="text-muted">{label} </span>}
          {active?.label ?? 'Select'}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2, ease: EASE_SMOOTH }}>
          <ChevronDownIcon className="h-4 w-4 text-muted" aria-hidden="true" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open &&
        <motion.ul
          role="listbox"
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.18, ease: EASE_SMOOTH }}
          className={cn(
            'absolute z-40 mt-2 min-w-[196px] overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-lift',
            align === 'right' ? 'right-0' : 'left-0'
          )}>
          
            {options.map((option) =>
          <li key={option.value}>
                <button
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                'flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-[13px] transition-colors duration-150',
                option.value === value ? 'bg-accent-soft font-semibold text-accent' : 'text-charcoal hover:bg-canvas'
              )}>
              
                  {option.label}
                  {option.value === value && <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />}
                </button>
              </li>
          )}
          </motion.ul>
        }
      </AnimatePresence>
    </div>);

}