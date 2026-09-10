import React, { useEffect, useState } from 'react';
import { PackageSearchIcon } from 'lucide-react';
import { useProductFilters } from '../../hooks/useProductFilters';
import type { FilterState } from '../../hooks/useProductFilters';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { ProductGridSkeleton } from '../ui/Skeleton';
import { ProductGrid } from '../product/ProductGrid';
import { FilterDrawer } from './FilterDrawer';
import { FilterSidebar } from './FilterSidebar';
import { ShopToolbar } from './ShopToolbar';
import type { Product } from '../../types';

const PAGE_SIZE = 12;

interface ProductListingProps {
  source: Product[];
  defaults?: Partial<FilterState>;
  lockedCategory?: boolean;
  showSidebar?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ProductListing({
  source,
  defaults,
  lockedCategory,
  showSidebar = true,
  emptyTitle = 'No products found',
  emptyDescription = 'Nothing matches those filters yet. Try widening the price range or clearing a few options.'
}: ProductListingProps) {
  const { filters, setValue, toggleValue, reset, results, activeCount } = useProductFilters(source, defaults);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 420);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [filters]);

  const shown = results.slice(0, visible);

  return (
    <div className={showSidebar ? 'grid gap-8 lg:grid-cols-[248px_minmax(0,1fr)]' : ''}>
      {showSidebar &&
      <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-line bg-white p-5">
            <FilterSidebar
            filters={filters}
            setValue={setValue}
            toggleValue={toggleValue}
            reset={reset}
            activeCount={activeCount}
            lockedCategory={lockedCategory} />
          
          </div>
        </aside>
      }

      <div className="min-w-0">
        <ShopToolbar
          search={filters.search}
          onSearch={(value) => setValue('search', value)}
          sort={filters.sort}
          onSort={(value) => setValue('sort', value)}
          layout={layout}
          onLayout={setLayout}
          onOpenFilters={() => setDrawerOpen(true)}
          activeCount={activeCount} />
        

        <p className="mt-5 text-[13px] text-muted" aria-live="polite">
          Showing <span className="font-semibold text-ink">{shown.length}</span> of{' '}
          <span className="font-semibold text-ink">{results.length}</span> products
        </p>

        <div className="mt-5">
          {loading ?
          <ProductGridSkeleton count={8} /> :
          results.length === 0 ?
          <EmptyState
            icon={PackageSearchIcon}
            title={emptyTitle}
            description={emptyDescription}
            actionLabel="Clear filters"
            onAction={reset}
            secondaryLabel="Browse all products"
            secondaryTo="/shop" /> :


          <ProductGrid products={shown} layout={layout} />
          }
        </div>

        {!loading && visible < results.length &&
        <div className="mt-10 flex justify-center">
            <Button variant="secondary" size="lg" onClick={() => setVisible((prev) => prev + PAGE_SIZE)}>
              Load more products
            </Button>
          </div>
        }
      </div>

      {showSidebar &&
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        resultCount={results.length}
        filters={filters}
        setValue={setValue}
        toggleValue={toggleValue}
        reset={reset}
        activeCount={activeCount}
        lockedCategory={lockedCategory} />

      }
    </div>);

}