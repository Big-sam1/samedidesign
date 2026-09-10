import React from 'react';
import { motion } from 'framer-motion';
import { EASE_SMOOTH } from '../../animations/variants';
import { Breadcrumbs } from './Breadcrumbs';
import type { Crumb } from './Breadcrumbs';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, crumbs, children }: PageHeaderProps) {
  return (
    <header className="border-b border-line bg-canvas">
      <div className="mx-auto w-full max-w-shell px-4 py-8 sm:px-6 sm:py-12">
        {crumbs &&
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE_SMOOTH }}
          className="mb-4">
          
            <Breadcrumbs items={crumbs} />
          </motion.div>
        }
        <div className="flex flex-wrap items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_SMOOTH, delay: 0.04 }}
            className="max-w-2xl">
            
            <h1 className="text-[28px] font-extrabold leading-tight text-ink sm:text-[38px]">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-muted sm:text-base">{subtitle}</p>}
          </motion.div>
          {children &&
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_SMOOTH, delay: 0.1 }}>
            
              {children}
            </motion.div>
          }
        </div>
      </div>
    </header>);

}