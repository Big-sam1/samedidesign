import { useCallback, useMemo, useState } from 'react';
import type { Product, SortKey } from '../types';

export interface FilterState {
  search: string;
  categories: string[];
  brands: string[];
  sizes: string[];
  colors: string[];
  maxPrice: number;
  minRating: number;
  sort: SortKey;
}

export const PRICE_CEILING = 400;

const initialState: FilterState = {
  search: '',
  categories: [],
  brands: [],
  sizes: [],
  colors: [],
  maxPrice: PRICE_CEILING,
  minRating: 0,
  sort: 'popular'
};

type ArrayKey = 'categories' | 'brands' | 'sizes' | 'colors';

function sortProducts(list: Product[], sort: SortKey): Product[] {
  const copy = [...list];
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'rating':
      return copy.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return copy.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
    default:
      return copy.sort((a, b) => b.reviews - a.reviews);
  }
}

export function useProductFilters(source: Product[], defaults: Partial<FilterState> = {}) {
  const [filters, setFilters] = useState<FilterState>({ ...initialState, ...defaults });

  const setValue = useCallback(<K extends keyof FilterState,>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleValue = useCallback((key: ArrayKey, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((item) => item !== value) : [...prev[key], value]
    }));
  }, []);

  const reset = useCallback(() => setFilters({ ...initialState, ...defaults }), [defaults]);

  const results = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    const filtered = source.filter((product) => {
      if (query) {
        const haystack = `${product.name} ${product.brand} ${product.category} ${product.description}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (filters.categories.length && !filters.categories.includes(product.category)) return false;
      if (filters.brands.length && !filters.brands.includes(product.brand)) return false;
      if (filters.sizes.length && !product.sizes.some((size) => filters.sizes.includes(size))) return false;
      if (filters.colors.length && !product.colors.some((color) => filters.colors.includes(color.name))) return false;
      if (product.price > filters.maxPrice) return false;
      if (filters.minRating && product.rating < filters.minRating) return false;
      return true;
    });
    return sortProducts(filtered, filters.sort);
  }, [filters, source]);

  const activeCount =
  filters.categories.length +
  filters.brands.length +
  filters.sizes.length +
  filters.colors.length + (
  filters.minRating ? 1 : 0) + (
  filters.maxPrice < PRICE_CEILING ? 1 : 0);

  return { filters, setValue, toggleValue, reset, results, activeCount };
}