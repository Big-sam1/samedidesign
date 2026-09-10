import React from 'react';
import { cn } from '../../utils/format';

export function Skeleton({ className }: {className?: string;}) {
  return <div className={cn('skeleton rounded-xl', className)} aria-hidden="true" />;
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white p-3">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <div className="space-y-2 px-1 pt-4">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3.5 w-1/2" />
      </div>
    </div>);

}

export function ProductGridSkeleton({ count = 8 }: {count?: number;}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }).map((_, index) =>
      <ProductCardSkeleton key={index} />
      )}
    </div>);

}

export function ProductDetailSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-2" aria-busy="true" aria-label="Loading product">
      <Skeleton className="aspect-square w-full rounded-3xl" />
      <div className="space-y-4 pt-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-20 w-full" />
        <div className="flex gap-3">
          <Skeleton className="h-12 w-40 rounded-full" />
          <Skeleton className="h-12 w-32 rounded-full" />
        </div>
      </div>
    </div>);

}

export function BlogCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <Skeleton className="aspect-[3/2] w-full rounded-none" />
      <div className="space-y-2 p-5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>);

}

export function AccountSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading account">
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <Skeleton className="h-56 w-full rounded-2xl" />
    </div>);

}