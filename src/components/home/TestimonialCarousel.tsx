import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, QuoteIcon } from 'lucide-react';
import { testimonials } from '../../data/site';
import { EASE_SMOOTH, springSnappy } from '../../animations/variants';
import { RatingStars } from '../ui/RatingStars';
import { cn } from '../../utils/format';

const AUTOPLAY_MS = 5200;

export function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const active = testimonials[index];

  const go = useCallback((next: number, dir: number) => {
    setDirection(dir);
    setIndex((next + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-line bg-canvas px-5 py-10 sm:px-10 sm:py-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Customer testimonials">
      
      <QuoteIcon className="pointer-events-none absolute -left-2 top-4 h-24 w-24 text-accent/10" aria-hidden="true" />

      <div className="relative mx-auto min-h-[300px] max-w-3xl sm:min-h-[268px]">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.figure
            key={active.name}
            custom={direction}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * 48, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -48, scale: 0.97 }}
            transition={{ duration: 0.42, ease: EASE_SMOOTH }}
            className="flex flex-col items-center text-center">
            
            <motion.div
              initial={{ scale: 0.86, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.06, duration: 0.4, ease: EASE_SMOOTH }}
              className="relative">
              
              <span className="absolute -inset-1.5 rounded-full border border-accent/35" aria-hidden="true" />
              <img
                src={active.avatar}
                alt={active.name}
                className="h-[84px] w-[84px] rounded-full border-4 border-white object-cover shadow-card" />
              
            </motion.div>

            <RatingStars rating={active.rating} size="md" className="mt-5 justify-center" />

            <blockquote className="mt-4 text-[17px] font-medium leading-relaxed text-ink sm:text-[20px] sm:leading-[1.6]">
              “{active.quote}”
            </blockquote>

            <figcaption className="mt-5">
              <p className="text-[14.5px] font-bold text-ink">{active.name}</p>
              <p className="mt-0.5 text-[12.5px] text-muted">{active.role}</p>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <motion.button
          type="button"
          onClick={() => go(index - 1, -1)}
          aria-label="Previous testimonial"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          transition={springSnappy}
          className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-charcoal transition-colors duration-200 hover:text-accent">
          
          <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
        </motion.button>

        <div className="flex items-center gap-2.5">
          {testimonials.map((item, dotIndex) =>
          <button
            key={item.name}
            type="button"
            onClick={() => go(dotIndex, dotIndex > index ? 1 : -1)}
            aria-label={`Show testimonial from ${item.name}`}
            aria-current={dotIndex === index}
            className="group grid h-8 w-8 place-items-center">
            
              <span
              className={cn(
                'block h-2 rounded-full transition-all duration-300 ease-smooth',
                dotIndex === index ? 'w-7 bg-accent' : 'w-2 bg-line group-hover:bg-muted'
              )} />
            
            </button>
          )}
        </div>

        <motion.button
          type="button"
          onClick={() => go(index + 1, 1)}
          aria-label="Next testimonial"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          transition={springSnappy}
          className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-charcoal transition-colors duration-200 hover:text-accent">
          
          <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
        </motion.button>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {testimonials.map((item, avatarIndex) =>
        <button
          key={`avatar-${item.name}`}
          type="button"
          onClick={() => go(avatarIndex, avatarIndex > index ? 1 : -1)}
          aria-label={`Read the review from ${item.name}`}
          className={cn(
            'overflow-hidden rounded-full border-2 transition-all duration-300 ease-smooth',
            avatarIndex === index ? 'border-accent opacity-100' : 'border-transparent opacity-45 hover:opacity-80'
          )}>
          
            <img src={item.avatar} alt="" aria-hidden="true" className="h-9 w-9 object-cover" />
          </button>
        )}
      </div>
    </div>);

}