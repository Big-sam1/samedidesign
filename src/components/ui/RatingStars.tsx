import React from 'react';
import { StarIcon } from 'lucide-react';
import { cn } from '../../utils/format';

interface RatingStarsProps {
  rating: number;
  reviews?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function RatingStars({ rating, reviews, size = 'sm', className }: RatingStarsProps) {
  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((index) =>
        <StarIcon
          key={index}
          className={cn(starSize, index < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-line text-line')} />

        )}
      </div>
      <span className="sr-only">{rating.toFixed(1)} out of 5 stars</span>
      {typeof reviews === 'number' && <span className="text-xs text-muted">({reviews})</span>}
    </div>);

}