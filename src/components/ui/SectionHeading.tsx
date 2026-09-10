import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { Reveal } from './Reveal';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  linkLabel?: string;
  linkTo?: string;
  centered?: boolean;
}

export function SectionHeading({ title, subtitle, linkLabel, linkTo, centered = false }: SectionHeadingProps) {
  return (
    <Reveal className={`mb-6 flex flex-wrap items-end justify-between gap-3 ${centered ? 'justify-center text-center' : ''}`}>
      <div className={centered ? 'w-full' : undefined}>
        <h2 className="text-xl font-bold text-ink sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {linkLabel && linkTo &&
      <Link
        to={linkTo}
        className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-charcoal transition-colors duration-200 hover:text-accent">
        
          {linkLabel}
          <ArrowRightIcon
          className="h-3.5 w-3.5 transition-transform duration-200 ease-smooth group-hover:translate-x-1"
          aria-hidden="true" />
        
        </Link>
      }
    </Reveal>);

}