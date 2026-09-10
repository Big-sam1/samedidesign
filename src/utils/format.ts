import { twMerge } from 'tailwind-merge';

export function cn(...classes: (string | false | null | undefined)[]): string {
  return twMerge(classes.filter(Boolean).join(' '));
}

export const USD_TO_RWF = 1450;

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('rw-RW', {
    style: 'currency',
    currency: 'RWF',
    maximumFractionDigits: 0
  }).format(Math.round(value * USD_TO_RWF));
}

export function discountPercent(price: number, oldPrice?: number): number | null {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round((oldPrice - price) / oldPrice * 100);
}

export function pad(value: number): string {
  return value.toString().padStart(2, '0');
}