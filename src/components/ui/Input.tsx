import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils/format';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const fieldClasses =
'w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/70 transition-colors duration-200 ease-smooth focus:outline-none focus:ring-2 focus:ring-accent/25';

export function Input({ label, error, hint, className, id, ...rest }: InputProps) {
  const fieldId = id ?? rest.name ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="w-full">
      {label &&
      <label htmlFor={fieldId} className="mb-1.5 block text-[13px] font-medium text-charcoal">
          {label}
        </label>
      }
      <input
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={cn(fieldClasses, error ? 'border-red-400 focus:border-red-400' : 'border-line focus:border-accent', className)}
        {...rest} />
      
      <AnimatePresence initial={false}>
        {error &&
        <motion.p
          id={`${fieldId}-error`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="mt-1.5 text-xs font-medium text-red-500">
          
            {error}
          </motion.p>
        }
      </AnimatePresence>
      {!error && hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>);

}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, id, ...rest }: TextareaProps) {
  const fieldId = id ?? rest.name ?? 'textarea';
  return (
    <div className="w-full">
      {label &&
      <label htmlFor={fieldId} className="mb-1.5 block text-[13px] font-medium text-charcoal">
          {label}
        </label>
      }
      <textarea
        id={fieldId}
        aria-invalid={Boolean(error)}
        className={cn(fieldClasses, 'min-h-[132px] resize-y', error ? 'border-red-400' : 'border-line focus:border-accent', className)}
        {...rest} />
      
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
    </div>);

}