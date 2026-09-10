import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/format';

interface LogoProps {
  /** Renders the mark + wordmark as a link when set. */
  to?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const markSize = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' };
const textSize = { sm: 'text-[17px]', md: 'text-[19px]', lg: 'text-[24px]' };

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/samed-design-logo.png"
      alt="Samedi design"
      style={{ borderRadius: '100%' }}
      className={cn('shrink-0 object-cover rounded-full shadow-sm ring-2 ring-accent/20', className)}
    />
  );
}

export function Logo({ to, size = 'md', className, onClick }: LogoProps) {
  const content = (
    <>
      <LogoMark className={markSize[size]} />
      <span className={cn('font-extrabold tracking-tight text-ink flex items-center gap-1.5', textSize[size])}>
        <span>Samedi</span>
        <span className="text-accent">design</span>
      </span>
    </>
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={cn('group inline-flex items-center gap-2.5', className)}>
        {content}
      </Link>
    );
  }

  return <span className={cn('inline-flex items-center gap-2.5', className)}>{content}</span>;
}