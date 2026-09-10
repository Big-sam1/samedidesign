import React from 'react';
import { motion } from 'framer-motion';
import { GemIcon, ShieldCheckIcon, SmileIcon, TruckIcon } from 'lucide-react';
import { trustStrip } from '../../data/site';
import { fadeUp, staggerContainer, viewportOnce } from '../../animations/variants';

const icons = [GemIcon, TruckIcon, ShieldCheckIcon, SmileIcon];

export function TrustStrip() {
  return (
    <section aria-label="Store guarantees" className="border-y border-line bg-white">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mx-auto grid w-full max-w-shell grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4">
        
        {trustStrip.map((item, index) => {
          const Icon = icons[index] ?? GemIcon;
          return (
            <motion.div key={item.title} variants={fadeUp} className="flex items-start gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="text-[13.5px] font-semibold text-ink">{item.title}</p>
                <p className="mt-0.5 text-xs text-muted">{item.detail}</p>
              </div>
            </motion.div>);

        })}
      </motion.div>
    </section>);

}