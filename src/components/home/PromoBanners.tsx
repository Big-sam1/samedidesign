import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IMG } from '../../data/images';
import { useCountdown } from '../../hooks/useCountdown';
import { EASE_SMOOTH, slideInLeft, slideInRight, viewportOnce } from '../../animations/variants';
import { pad } from '../../utils/format';
import { Button } from '../ui/Button';

function CountdownUnit({ value, label }: {value: number;label: string;}) {
  return (
    <div className="min-w-[56px] rounded-xl bg-[#ffffff]/18 px-3 py-2 text-center backdrop-blur-sm">
      <div className="relative h-7 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: 22, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -22, opacity: 0 }}
            transition={{ duration: 0.24, ease: EASE_SMOOTH }}
            className="block text-[22px] font-extrabold leading-7 tabular-nums text-[#ffffff]">
            
            {pad(value)}
          </motion.span>
        </AnimatePresence>
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#ffffff]/75">{label}</p>
    </div>);

}

export function PromoBanners() {
  const { days, hours, minutes, seconds } = useCountdown();

  return (
    <section aria-label="Promotions" className="grid gap-5 lg:grid-cols-2">
      <motion.article
        variants={slideInLeft}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="group relative overflow-hidden rounded-3xl bg-accent p-7 sm:p-9">
        
        <div className="relative z-10 max-w-[62%]">
          <span className="inline-block rounded-full bg-[#ffffff]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#ffffff]">
            Flash Sale
          </span>
          <h3 className="mt-4 text-[30px] font-extrabold leading-tight text-[#ffffff] sm:text-[38px]">Up To 70% Off</h3>
          <div className="mt-5 flex gap-2">
            <CountdownUnit value={days} label="Days" />
            <CountdownUnit value={hours} label="Hours" />
            <CountdownUnit value={minutes} label="Mins" />
            <CountdownUnit value={seconds} label="Secs" />
          </div>
          <div className="mt-7">
            <Button to="/shop" className="bg-[#101216] text-[#ffffff] shadow-none hover:bg-[#20242b]">
              Shop Sale Now
            </Button>
          </div>
        </div>
        <motion.img
          src={IMG.sneakers}
          alt=""
          aria-hidden="true"
          initial={{ scale: 1 }}
          whileInView={{ scale: 1.04 }}
          viewport={viewportOnce}
          transition={{ duration: 1.2, ease: EASE_SMOOTH }}
          className="pointer-events-none absolute -bottom-8 -right-6 hidden w-[46%] max-w-[300px] object-contain mix-blend-multiply sm:block" />
        
      </motion.article>

      <motion.article
        variants={slideInRight}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="group relative overflow-hidden rounded-3xl bg-[#101216] p-7 sm:p-9">
        
        <motion.img
          src={IMG.newCollection}
          alt=""
          aria-hidden="true"
          initial={{ scale: 1.06 }}
          whileInView={{ scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 1.4, ease: EASE_SMOOTH }}
          className="absolute inset-0 h-full w-full object-cover opacity-55" />
        
        <div className="relative z-10 max-w-sm">
          <span className="inline-block rounded-full bg-[#ffffff]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#ffffff]">
            New Collection
          </span>
          <h3 className="mt-4 text-[30px] font-extrabold leading-tight text-[#ffffff] sm:text-[38px]">Summer 2025</h3>
          <p className="mt-3 text-[14px] leading-relaxed text-[#ffffff]/75">
            Discover the latest trends and fresh styles, cut in lighter fabrics for warmer months.
          </p>
          <div className="mt-7">
            <Button to="/new-arrivals" className="text-[#ffffff]">
              Shop Collection
            </Button>
          </div>
        </div>
      </motion.article>
    </section>);

}
