import React from 'react';
import { motion } from 'framer-motion';
import { QuoteIcon } from 'lucide-react';
import { fadeUp } from '../../animations/variants';
import { RatingStars } from './RatingStars';
import type { Testimonial } from '../../types';

export function TestimonialCard({ testimonial }: {testimonial: Testimonial;}) {
  return (
    <motion.figure variants={fadeUp} className="flex h-full flex-col rounded-2xl border border-line bg-white p-6">
      <QuoteIcon className="h-6 w-6 text-accent" aria-hidden="true" />
      <blockquote className="mt-4 flex-1 text-[14.5px] leading-relaxed text-charcoal">“{testimonial.quote}”</blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
        <img src={testimonial.avatar} alt="" aria-hidden="true" className="h-11 w-11 rounded-full object-cover" />
        <div>
          <RatingStars rating={testimonial.rating} />
          <p className="mt-1 text-[13.5px] font-semibold text-ink">{testimonial.name}</p>
          <p className="text-[12px] text-muted">{testimonial.role}</p>
        </div>
      </figcaption>
    </motion.figure>);

}