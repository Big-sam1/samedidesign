import React, { useEffect, useState } from 'react';
import { SparklesIcon, FlameIcon, CheckIcon, SearchIcon, PencilIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { formatPrice } from '../../utils/format';
import type { Product } from '../../types';

interface AdminFeaturedProps {
  type: 'new-arrivals' | 'best-sellers';
}

export function AdminFeaturedSection({ type }: AdminFeaturedProps) {
  const { products, updateProduct } = useData();
  const [search, setSearch] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const isArrivalMode = type === 'new-arrivals';
  const title = isArrivalMode ? 'New Arrivals Management' : 'Best Sellers Management';
  const subtitle = isArrivalMode
    ? 'Manage products highlighted in the "New Arrivals" carousel and grid on the store homepage.'
    : 'Manage customer favorites and featured bestsellers shown across the site.';

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleProducts = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  const toggleFeatured = async (product: Product) => {
    const updated: Product = isArrivalMode
      ? { ...product, isNew: !product.isNew }
      : { ...product, isBestSeller: !product.isBestSeller };

    await updateProduct(updated);
    setStatusMsg(
      `"${product.name}" is now ${
        (isArrivalMode ? updated.isNew : updated.isBestSeller) ? 'ENABLED' : 'REMOVED'
      } for ${isArrivalMode ? 'New Arrivals' : 'Best Sellers'}.`
    );
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const updateHoverImage = async (product: Product, newHoverUrl: string) => {
    const imgs = [...product.images];
    imgs[1] = newHoverUrl;
    await updateProduct({ ...product, images: imgs });
    setStatusMsg(`Hover swapped image updated for "${product.name}".`);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {isArrivalMode ? (
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <SparklesIcon className="h-5 w-5" />
              </span>
            ) : (
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-50 text-amber-600">
                <FlameIcon className="h-5 w-5" />
              </span>
            )}
            <h2 className="text-2xl font-black text-slate-900">{title}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckIcon className="h-4 w-4" />
          {statusMsg}
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products to feature..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Product Cards with Direct Toggle & Hover Image Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleProducts.map((item) => {
          const isFeatured = isArrivalMode ? Boolean(item.isNew) : Boolean(item.isBestSeller);

          return (
            <div
              key={item.id}
              className={`rounded-2xl border p-5 transition bg-white shadow-xs ${
                isFeatured
                  ? isArrivalMode
                    ? 'border-indigo-400 ring-2 ring-indigo-100'
                    : 'border-amber-400 ring-2 ring-amber-100'
                  : 'border-slate-200 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="h-14 w-14 rounded-xl object-cover border bg-slate-50 shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.name}</h4>
                    <p className="text-xs text-slate-400 capitalize">{item.category}</p>
                    <p className="text-xs font-extrabold text-slate-900 mt-0.5">{formatPrice(item.price)}</p>
                  </div>
                </div>

                {/* Status Toggle Button */}
                <button
                  type="button"
                  onClick={() => toggleFeatured(item)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-xs ${
                    isFeatured
                      ? isArrivalMode
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-amber-600 text-white hover:bg-amber-700'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isFeatured ? 'Active' : 'Disabled'}
                </button>
              </div>

              {/* Hover Swapped Image Input */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Hovered Swapping Image
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    defaultValue={item.images[1] || ''}
                    onBlur={(e) => {
                      if (e.target.value !== item.images[1]) {
                        updateHoverImage(item, e.target.value);
                      }
                    }}
                    placeholder="URL or image path..."
                    className="flex-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-800"
                  />
                  {item.images[1] && (
                    <img
                      src={item.images[1]}
                      alt="Hover preview"
                      className="h-7 w-7 rounded-lg object-cover border border-slate-200 shrink-0"
                      title="Hover preview"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {pageCount > 1 && (
        <nav className="flex items-center justify-center gap-1.5" aria-label="Featured product pages">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            aria-label="Previous featured product page"
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setPage(pageNumber)}
              aria-current={page === pageNumber ? 'page' : undefined}
              className={`grid h-9 min-w-9 place-items-center rounded-lg px-2 text-xs font-bold transition ${
                page === pageNumber ? 'bg-[#3b2418] text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            disabled={page === pageCount}
            aria-label="Next featured product page"
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
