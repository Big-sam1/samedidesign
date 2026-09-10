import React, { useEffect, useState } from 'react';
import {
  PlusIcon,
  SearchIcon,
  PencilIcon,
  Trash2Icon,
  XIcon,
  CheckIcon,
  ImageIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  FlameIcon
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { formatPrice, USD_TO_RWF } from '../../utils/format';
import type { Product } from '../../types';

export function AdminProducts() {
  const { products, updateProduct, addProduct, deleteProduct } = useData();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editing, setEditing] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const categories = ['all', 'fashion', 'shoes', 'accessories', 'electronics', 'lifestyle'];

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleProducts = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter]);

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    if (!editing.name.trim()) {
      setStatusMsg({ text: 'Product name is required', type: 'error' });
      return;
    }

    if (isCreating) {
      await addProduct(editing);
      setStatusMsg({ text: `Product "${editing.name}" created successfully!`, type: 'success' });
    } else {
      await updateProduct(editing);
      setStatusMsg({ text: `Product "${editing.name}" updated successfully!`, type: 'success' });
    }

    setTimeout(() => setStatusMsg(null), 4000);
    setEditing(null);
    setIsCreating(false);
  };

  const handleStartCreate = () => {
    const newId = `product-${Date.now()}`;
    setEditing({
      id: newId,
      name: '',
      brand: 'Samedi',
      category: 'fashion',
      price: 49.99,
      rating: 5.0,
      reviews: 1,
      images: ['/samed-design-logo.png', '/samed-design-logo.png'],
      description: 'Handpicked quality apparel from Samedi design in Nyamirambo Biryogo.',
      colors: [{ name: 'Black', hex: '#000000' }],
      sizes: ['M', 'L', 'XL', '2XL', '3XL', '4XL'],
      stock: 20,
      isNew: true,
      isBestSeller: false
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteProduct(id);
      setStatusMsg({ text: `Product "${name}" deleted.`, type: 'success' });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleImageUpload = (index: number, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setStatusMsg({ text: 'Please choose an image under 5MB.', type: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (!editing || typeof reader.result !== 'string') return;
      const images = [...editing.images];
      images[index] = reader.result;
      setEditing({ ...editing, images });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Manage All Products</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Update product names, original images, hover-swapped images, prices, categories, and big sizes.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <PlusIcon className="h-4 w-4" />
          Add New Product
        </button>
      </div>

      {/* Status Notice */}
      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <CheckIcon className="h-4 w-4" />
          {statusMsg.text}
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 w-full">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or category..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-4">Images (Original &amp; Hover)</th>
                <th className="py-3.5 px-4">Name &amp; Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Sizes</th>
                <th className="py-3.5 px-4">Badges</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {visibleProducts.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  {/* Images Column: Original + Swapped Hover Preview */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="relative group">
                        <img
                          src={item.images[0]}
                          alt="Primary"
                          className="h-12 w-12 rounded-xl object-cover border border-slate-200 bg-white"
                        />
                        <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-[9px] text-white text-center py-0.5 rounded-b-xl">
                          Original
                        </span>
                      </div>

                      {item.images[1] ? (
                        <div className="relative group">
                          <img
                            src={item.images[1]}
                            alt="Hovered"
                            className="h-12 w-12 rounded-xl object-cover border border-blue-200 bg-blue-50"
                          />
                          <span className="absolute bottom-0 left-0 right-0 bg-blue-600/80 text-[9px] text-white text-center py-0.5 rounded-b-xl">
                            Hovered
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">No hover image</span>
                      )}
                    </div>
                  </td>

                  {/* Name and Category */}
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-[11px] text-slate-400 capitalize">{item.category} · Stock: {item.stock}</p>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {formatPrice(item.price)}
                    {item.oldPrice && (
                      <span className="block text-[10px] text-slate-400 line-through">
                        {formatPrice(item.oldPrice)}
                      </span>
                    )}
                  </td>

                  {/* Sizes */}
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {item.sizes.map((s) => (
                        <span
                          key={s}
                          className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Badges / Flags */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1">
                      {item.isNew && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 w-fit">
                          <SparklesIcon className="h-3 w-3" /> New Arrival
                        </span>
                      )}
                      {item.isBestSeller && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 w-fit">
                          <FlameIcon className="h-3 w-3" /> Best Seller
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setEditing(item);
                          setIsCreating(false);
                        }}
                        className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition"
                        title="Edit product"
                      >
                        <PencilIcon className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition"
                        title="Delete product"
                      >
                        <Trash2Icon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pageCount > 1 && (
        <nav className="flex items-center justify-center gap-1.5" aria-label="Product pages">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            aria-label="Previous product page"
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
            aria-label="Next product page"
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </nav>
      )}

      {/* Edit / Create Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {isCreating ? 'Add New Product' : `Edit: ${editing.name}`}
                </h3>
                <p className="text-xs text-slate-500">Edit text, pricing, original &amp; hover swapping images</p>
              </div>
              <button
                onClick={() => setEditing(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4 text-xs">
              {/* Product Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Grid 1: Price, Old Price, Category, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (RWF)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={Math.round(editing.price * USD_TO_RWF)}
                    onChange={(e) => setEditing({ ...editing, price: (parseFloat(e.target.value) || 0) / USD_TO_RWF })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Old Price (RWF)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editing.oldPrice ? Math.round(editing.oldPrice * USD_TO_RWF) : ''}
                    onChange={(e) => setEditing({ ...editing, oldPrice: parseFloat(e.target.value) ? (parseFloat(e.target.value) / USD_TO_RWF) : undefined })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-800"
                  >
                    <option value="fashion">Fashion</option>
                    <option value="shoes">Shoes</option>
                    <option value="accessories">Accessories</option>
                    <option value="lifestyle">Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={editing.stock || 15}
                    onChange={(e) => setEditing({ ...editing, stock: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              {/* Images: Original (image 1) and Swapping Hovered (image 2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Original / Default Image</label>
                  {editing.images[0] && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={editing.images[0]}
                        alt="Preview original"
                        className="h-10 w-10 rounded-lg object-cover border"
                      />
                      <span className="text-[10px] text-slate-400">Original preview</span>
                    </div>
                  )}
                  <label htmlFor="admin-product-image-0" className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50">
                    <ImageIcon className="h-3.5 w-3.5" /> Upload from device
                  </label>
                  <input id="admin-product-image-0" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(0, e.target.files[0])} />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Swapping Hovered Image</label>
                  {editing.images[1] && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={editing.images[1]}
                        alt="Preview hover"
                        className="h-10 w-10 rounded-lg object-cover border border-blue-300"
                      />
                      <span className="text-[10px] text-blue-600 font-semibold">Hover swapped preview</span>
                    </div>
                  )}
                  <label htmlFor="admin-product-image-1" className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50">
                    <ImageIcon className="h-3.5 w-3.5" /> Upload from device
                  </label>
                  <input id="admin-product-image-1" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(1, e.target.files[0])} />
                </div>
              </div>

              {/* Sizes (Comma separated) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Sizes Available (Separate with commas, e.g. M, L, XL, 2XL, 3XL, 4XL)
                </label>
                <input
                  type="text"
                  value={editing.sizes.join(', ')}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      sizes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800"
                />
              </div>

              {/* Checkboxes: New Arrival & Best Seller */}
              <div className="flex items-center gap-6 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.isNew || false}
                    onChange={(e) => setEditing({ ...editing, isNew: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600"
                  />
                  <span className="font-semibold text-slate-800">Show in "New Arrivals" section</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.isBestSeller || false}
                    onChange={(e) => setEditing({ ...editing, isBestSeller: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-amber-600"
                  />
                  <span className="font-semibold text-slate-800">Show in "Best Sellers" section</span>
                </label>
              </div>

              {/* Actions Button */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-white font-bold hover:bg-blue-700 shadow-sm"
                >
                  Save Product Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
