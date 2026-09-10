import React, { useState } from 'react';
import { PlusIcon, PencilIcon, Trash2Icon, XIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, ImageIcon, NewspaperIcon } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import type { BlogPost } from '../../types';

export function AdminBlog() {
  const { blogPosts, updateBlogPost, addBlogPost, deleteBlogPost } = useData();
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const pageCount = Math.max(1, Math.ceil(blogPosts.length / pageSize));
  const visiblePosts = blogPosts.slice((page - 1) * pageSize, page * pageSize);

  const categories = [
    'Men Clothing',
    'Big Size Fits',
    'Boys & Teens',
    'Streetwear',
    'Shoes & Footwear'
  ];

  const handleStartCreate = () => {
    const slug = `article-${Date.now()}`;
    setEditing({
      slug,
      title: '',
      category: 'Men Clothing',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      author: 'Samuel Mugisha',
      readTime: '5 min read',
      image: '/samed-design-logo.png',
      excerpt: '',
      body: ['']
    });
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    if (!editing.title.trim()) {
      alert('Article title is required');
      return;
    }

    if (isCreating) {
      await addBlogPost(editing);
      setStatusMsg(`Article "${editing.title}" published successfully!`);
    } else {
      await updateBlogPost(editing);
      setStatusMsg(`Article "${editing.title}" updated successfully!`);
    }

    setTimeout(() => setStatusMsg(null), 3000);
    setEditing(null);
    setIsCreating(false);
  };

  const handleDelete = async (slug: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteBlogPost(slug);
      setStatusMsg(`Article "${title}" removed.`);
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleImageUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setStatusMsg('Please choose an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (!editing || typeof reader.result !== 'string') return;
      setEditing({ ...editing, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <NewspaperIcon className="h-5 w-5" />
            </span>
            <h2 className="text-2xl font-black text-slate-900">Manage Blog &amp; Articles</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Edit writer names, author images, article titles, messages, categories, and cover photography.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <PlusIcon className="h-4 w-4" />
          Write New Article
        </button>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckIcon className="h-4 w-4" />
          {statusMsg}
        </div>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visiblePosts.map((post) => (
          <div
            key={post.slug}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-16/9 overflow-hidden rounded-xl bg-slate-100 mb-4">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2 left-2 rounded-full bg-blue-600/90 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  {post.category}
                </span>
              </div>

              <span className="text-[11px] font-medium text-slate-400">
                {post.date} · {post.readTime}
              </span>
              <h3 className="mt-1 text-base font-bold text-slate-900 leading-snug line-clamp-2">
                {post.title}
              </h3>
              <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Author Preview */}
              <div className="mt-4 flex items-center gap-2 pt-3 border-t border-slate-100">
                <div className="grid h-7 w-7 place-items-center rounded-full bg-blue-50 text-[11px] font-bold text-blue-700">
                  {post.author.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-slate-700">Writer: {post.author}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setEditing(post);
                  setIsCreating(false);
                }}
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition flex items-center gap-1.5"
              >
                <PencilIcon className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(post.slug, post.title)}
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition flex items-center gap-1.5"
              >
                <Trash2Icon className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <nav className="flex items-center justify-center gap-1.5" aria-label="Article pages">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            aria-label="Previous article page"
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
            aria-label="Next article page"
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </nav>
      )}

      {/* Edit / Create Article Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {isCreating ? 'Write New Article' : `Edit Article: ${editing.title}`}
                </h3>
                <p className="text-xs text-slate-500">Edit writer name, title, article message &amp; photo</p>
              </div>
              <button
                onClick={() => setEditing(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="e.g. The Ultimate Men's Big Size Style Guide"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-slate-800"
                />
              </div>

              {/* Author / Category / Read Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Writer / Author Name</label>
                  <input
                    type="text"
                    required
                    value={editing.author}
                    onChange={(e) => setEditing({ ...editing, author: e.target.value })}
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
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Read Time</label>
                  <input
                    type="text"
                    value={editing.readTime}
                    onChange={(e) => setEditing({ ...editing, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              {/* Article Cover Image */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Article Cover Image</label>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
                  <ImageIcon className="h-4 w-4" />
                  Upload image from device
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  />
                </label>
                {editing.image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={editing.image}
                      alt="Preview"
                      className="h-12 w-20 rounded-lg object-cover border"
                    />
                    <span className="text-[10px] text-slate-400">Cover photo preview</span>
                  </div>
                )}
              </div>

              {/* Excerpt / Short Summary */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Excerpt / Brief Summary</label>
                <textarea
                  rows={2}
                  value={editing.excerpt}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                  placeholder="Short summary displayed on cards..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800"
                />
              </div>

              {/* Full Article Content / Paragraphs */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Article Message / Content (Paragraphs separated by new lines)
                </label>
                <textarea
                  rows={8}
                  value={editing.body.join('\n\n')}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      body: e.target.value.split('\n\n').filter((p) => p.trim())
                    })
                  }
                  placeholder="Type or paste the full article message here..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 leading-relaxed font-mono text-[11px]"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Separate paragraphs with a blank double newline.
                </p>
              </div>

              {/* Modal Actions */}
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
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
