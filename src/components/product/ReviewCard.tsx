import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2Icon } from 'lucide-react';
import { fadeUp } from '../../animations/variants';
import { RatingStars } from '../ui/RatingStars';

export interface Review {
  name: string;
  date: string;
  rating: number;
  title: string;
  body: string;
}

export function ReviewCard({ review }: {review: Review;}) {
  return (
    <motion.article variants={fadeUp} className="rounded-2xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-canvas text-[13px] font-bold text-ink">
            {review.name.charAt(0)}
          </span>
          <div>
            <p className="flex items-center gap-1.5 text-[13.5px] font-semibold text-ink">
              {review.name}
              <CheckCircle2Icon className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
            </p>
            <p className="text-[12px] text-muted">{review.date}</p>
          </div>
        </div>
        <RatingStars rating={review.rating} />
      </div>
      <h4 className="mt-4 text-[14px] font-semibold text-ink">{review.title}</h4>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{review.body}</p>
    </motion.article>);

}