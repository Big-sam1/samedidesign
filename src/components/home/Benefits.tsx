import React from 'react';
import { motion } from 'framer-motion';
import { HeadphonesIcon, LockIcon, RefreshCwIcon, TruckIcon } from 'lucide-react';
import { benefits } from '../../data/site';
import { fadeUp, staggerContainer, viewportOnce } from '../../animations/variants';

const iconMap = {
  truck: TruckIcon,
  lock: LockIcon,
  refresh: RefreshCwIcon,
  headset: HeadphonesIcon
};

export function Benefits() {
  return (
    <section aria-label="Shopping benefits" className="border-y border-line bg-white">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mx-auto grid w-full max-w-shell grid-cols-2 gap-x-6 gap-y-7 px-4 py-9 sm:px-6 lg:grid-cols-4 lg:divide-x lg:divide-line">
        
        {benefits.map((benefit) => {
          const Icon = iconMap[benefit.icon];
          return (
            <motion.div key={benefit.title} variants={fadeUp} className="flex items-center gap-3.5 lg:justify-center lg:px-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-canvas text-ink">
                <Icon className="h-[19px] w-[19px]" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[14px] font-bold text-ink">{benefit.title}</p>
                <p className="mt-0.5 text-[12.5px] text-muted">{benefit.detail}</p>
              </div>
            </motion.div>);

        })}
      </motion.div>
    </section>);

}