import React from 'react';
import { motion } from 'framer-motion';
import { EASE_SMOOTH } from '../../animations/variants';
import { Logo } from '../ui/Logo';

interface AuthShellProps {
  title: string;
  subtitle: string;
  image: string;
  imageHeadline: string;
  imageCaption: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function AuthShell({ title, subtitle, image, imageHeadline, imageCaption, children, footer }: AuthShellProps) {
  return (
    <div className="mx-auto w-full max-w-shell px-4 py-12 sm:px-6 sm:py-16">
      <div className="grid items-stretch gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_SMOOTH }}
          className="rounded-3xl border border-line bg-white p-7 sm:p-10">
          
          <Logo to="/" />
          <h1 className="mt-7 text-[28px] font-extrabold leading-tight text-ink sm:text-[32px]">{title}</h1>
          <p className="mt-2 text-[14px] text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-7 text-[13.5px] text-muted">{footer}</div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: EASE_SMOOTH, delay: 0.08 }}
          className="relative hidden overflow-hidden rounded-3xl bg-canvas lg:block"
          aria-hidden="true">
          
          <img src={image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-[#101216]/65 p-8 backdrop-blur-sm">
            <p className="text-[22px] font-extrabold leading-tight text-[#ffffff]">{imageHeadline}</p>
            <p className="mt-1.5 text-[13.5px] text-[#ffffff]/75">{imageCaption}</p>
          </div>
        </motion.aside>
      </div>
    </div>);

}