import React from 'react';
import { LayoutGridIcon, ListIcon, SearchIcon, SlidersHorizontalIcon } from 'lucide-react';
import { Select } from '../ui/Select';
import { cn } from '../../utils/format';
import type { SortKey } from '../../types';

export const sortOptions = [
{ value: 'popular', label: 'Popular' },
{ value: 'newest', label: 'Newest' },
{ value: 'price-asc', label: 'Price: Low to High' },
{ value: 'price-desc', label: 'Price: High to Low' },
{ value: 'rating', label: 'Top Rated' }];


interface ShopToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  sort: SortKey;
  onSort: (value: SortKey) => void;
  layout: 'grid' | 'list';
  onLayout: (value: 'grid' | 'list') => void;
  onOpenFilters: () => void;
  activeCount: number;
}

export function ShopToolbar({
  search,
  onSearch,
  sort,
  onSort,
  layout,
  onLayout,
  onOpenFilters,
  activeCount
}: ShopToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex h-10 min-w-[180px] flex-1 items-center gap-2 rounded-full border border-line bg-white px-4">
        <SearchIcon className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search in results..."
          aria-label="Search products"
          className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-ink placeholder:text-muted focus:outline-none" />
        
      </div>

      <button
        type="button"
        onClick={onOpenFilters}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-[13px] font-semibold text-ink transition-colors duration-200 hover:border-ink/30 lg:hidden">
        
        <SlidersHorizontalIcon className="h-4 w-4" aria-hidden="true" />
        Filters
        {activeCount > 0 &&
        <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">
            {activeCount}
          </span>
        }
      </button>

      <Select
        value={sort}
        onChange={(value) => onSort(value as SortKey)}
        options={sortOptions}
        label="Sort by:"
        className="w-[210px]" />
      

      <div className="hidden items-center gap-1 rounded-full border border-line bg-white p-1 sm:flex">
        {(['grid', 'list'] as const).map((option) => {
          const Icon = option === 'grid' ? LayoutGridIcon : ListIcon;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onLayout(option)}
              aria-label={`${option} view`}
              aria-pressed={layout === option}
              className={cn(
                'grid h-8 w-8 place-items-center rounded-full transition-colors duration-200',
                layout === option ? 'bg-ink text-white' : 'text-charcoal hover:bg-canvas'
              )}>
              
              <Icon className="h-4 w-4" aria-hidden="true" />
            </button>);

        })}
      </div>
    </div>);

}