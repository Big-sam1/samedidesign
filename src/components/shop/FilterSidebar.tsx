import React from 'react';
import { StarIcon } from 'lucide-react';
import { brands, categories, filterColors, filterSizes } from '../../data/categories';
import { PRICE_CEILING } from '../../hooks/useProductFilters';
import type { FilterState } from '../../hooks/useProductFilters';
import { formatPrice } from '../../utils/format';
import { cn } from '../../utils/format';

interface FilterSidebarProps {
  filters: FilterState;
  setValue: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  toggleValue: (key: 'categories' | 'brands' | 'sizes' | 'colors', value: string) => void;
  reset: () => void;
  activeCount: number;
  lockedCategory?: boolean;
}

function Group({ title, children }: {title: string;children: React.ReactNode;}) {
  return (
    <section className="border-b border-line py-5 first:pt-0 last:border-b-0">
      <h3 className="mb-3 text-[13px] font-bold uppercase tracking-wider text-ink">{title}</h3>
      {children}
    </section>);

}

function Checkbox({ label, checked, onChange }: {label: string;checked: boolean;onChange: () => void;}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1 text-[13.5px] text-charcoal transition-colors duration-150 hover:text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-line text-accent accent-accent focus:ring-accent/30" />
      
      {label}
    </label>);

}

export function FilterSidebar({ filters, setValue, toggleValue, reset, activeCount, lockedCategory }: FilterSidebarProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between pb-4">
        <p className="text-[15px] font-bold text-ink">Filters</p>
        {activeCount > 0 &&
        <button type="button" onClick={reset} className="text-[12.5px] font-semibold text-accent hover:underline">
            Clear all ({activeCount})
          </button>
        }
      </div>

      {!lockedCategory &&
      <Group title="Categories">
          <div className="flex flex-col">
            {categories.map((category) =>
          <Checkbox
            key={category.slug}
            label={category.name}
            checked={filters.categories.includes(category.slug)}
            onChange={() => toggleValue('categories', category.slug)} />

          )}
          </div>
        </Group>
      }

      <Group title="Price Range">
        <input
          type="range"
          min={20}
          max={PRICE_CEILING}
          step={10}
          value={filters.maxPrice}
          onChange={(event) => setValue('maxPrice', Number(event.target.value))}
          aria-label="Maximum price"
          className="w-full accent-accent" />
        
        <div className="mt-2 flex justify-between text-[12.5px] text-muted">
          <span>{formatPrice(20)}</span>
          <span className="font-semibold text-ink">Up to {formatPrice(filters.maxPrice)}</span>
        </div>
      </Group>

      <Group title="Brands">
        <div className="flex flex-col">
          {brands.map((brand) =>
          <Checkbox
            key={brand}
            label={brand}
            checked={filters.brands.includes(brand)}
            onChange={() => toggleValue('brands', brand)} />

          )}
        </div>
      </Group>

      <Group title="Sizes">
        <div className="flex flex-wrap gap-2">
          {filterSizes.map((size) =>
          <button
            key={size}
            type="button"
            onClick={() => toggleValue('sizes', size)}
            aria-pressed={filters.sizes.includes(size)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors duration-200',
              filters.sizes.includes(size) ?
              'border-accent bg-accent-soft text-accent' :
              'border-line text-charcoal hover:border-ink/30'
            )}>
            
              {size}
            </button>
          )}
        </div>
      </Group>

      <Group title="Colors">
        <div className="flex flex-wrap gap-2.5">
          {filterColors.map((color) =>
          <button
            key={color.name}
            type="button"
            onClick={() => toggleValue('colors', color.name)}
            aria-pressed={filters.colors.includes(color.name)}
            aria-label={color.name}
            title={color.name}
            className={cn(
              'h-7 w-7 rounded-full border-2 transition-transform duration-200 ease-smooth hover:scale-110',
              filters.colors.includes(color.name) ? 'border-accent' : 'border-line'
            )}
            style={{ backgroundColor: color.hex }} />

          )}
        </div>
      </Group>

      <Group title="Ratings">
        <div className="flex flex-col gap-1">
          {[4, 3, 2, 0].map((rating) =>
          <button
            key={rating}
            type="button"
            onClick={() => setValue('minRating', rating)}
            aria-pressed={filters.minRating === rating}
            className={cn(
              'flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] transition-colors duration-150',
              filters.minRating === rating ? 'bg-accent-soft font-semibold text-accent' : 'text-charcoal hover:bg-canvas'
            )}>
            
              {rating === 0 ?
            'All ratings' :

            <>
                  <span className="flex" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map((index) =>
                <StarIcon
                  key={index}
                  className={cn('h-3.5 w-3.5', index < rating ? 'fill-amber-400 text-amber-400' : 'fill-line text-line')} />

                )}
                  </span>
                  &amp; up
                </>
            }
            </button>
          )}
        </div>
      </Group>
    </div>);

}