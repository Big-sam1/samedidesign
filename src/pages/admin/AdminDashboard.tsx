import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBagIcon,
  SparklesIcon,
  FlameIcon,
  FileTextIcon,
  TrendingUpIcon,
  ArrowUpRightIcon,
  PhoneCallIcon,
  MapPinIcon,
  StoreIcon
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useStore } from '../../contexts/StoreContext';
import { formatPrice } from '../../utils/format';

export function AdminDashboard() {
  const { products, blogPosts, siteContent } = useData();
  const { orders, adminUser } = useStore();

  const newArrivalsCount = products.filter((p) => p.isNew).length;
  const bestSellersCount = products.filter((p) => p.isBestSeller || (p.reviews && p.reviews > 140)).length;

  const stats = [
    {
      label: 'Total Products',
      value: products.length,
      sub: 'Active in catalog',
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
      light: 'bg-blue-50 text-blue-600',
      to: '/admin/products'
    },
    {
      label: 'New Arrivals',
      value: newArrivalsCount,
      sub: 'Featured on homepage',
      icon: SparklesIcon,
      color: 'bg-indigo-500',
      light: 'bg-indigo-50 text-indigo-600',
      to: '/admin/new-arrivals'
    },
    {
      label: 'Best Sellers',
      value: bestSellersCount,
      sub: 'Top customer favorites',
      icon: FlameIcon,
      color: 'bg-amber-500',
      light: 'bg-amber-50 text-amber-600',
      to: '/admin/best-sellers'
    },
    {
      label: 'Blog Articles',
      value: blogPosts.length,
      sub: 'Men & Boys styling tips',
      icon: FileTextIcon,
      color: 'bg-emerald-500',
      light: 'bg-emerald-50 text-emerald-600',
      to: '/admin/blog'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner - Styled like reference photo */}
      <div className="admin-welcome-banner relative overflow-hidden rounded-3xl p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-100 backdrop-blur-md">
            Welcome Back, {adminUser.name || 'Administrator'}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Samedi design Store Hub
          </h2>
          <p className="mt-2 text-sm text-blue-100 leading-relaxed">
            Manage your entire Big Size clothing catalog, customize hero text and announcements, toggle New Arrivals and Best Sellers, and publish Men &amp; Boys styling articles directly to your customers.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-blue-700 shadow-sm transition hover:bg-blue-50"
            >
              Manage Products
              <ArrowUpRightIcon className="h-4 w-4" />
            </Link>
            <Link
              to="/admin/site-text"
              className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/25"
            >
              Edit Announcements &amp; Text
            </Link>
          </div>
        </div>

        {/* Decorative graphic right */}
        <div className="absolute -right-8 -bottom-8 opacity-20 pointer-events-none">
          <StoreIcon className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Metric Cards - 4 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:shadow-md hover:border-blue-300 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className={`grid h-12 w-12 place-items-center rounded-xl ${item.light}`}>
                <item.icon className="h-6 w-6" />
              </span>
              <span className="text-xs font-medium text-slate-400 group-hover:text-blue-600 flex items-center gap-0.5">
                Edit <ArrowUpRightIcon className="h-3 w-3" />
              </span>
            </div>
            <div className="mt-5">
              <span className="text-2xl font-black text-slate-900">{item.value}</span>
              <h3 className="text-sm font-semibold text-slate-700 mt-1">{item.label}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* 2 Column Layout - Recent Products & Store Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Quick Product Preview */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Featured Store Items</h3>
              <p className="text-xs text-slate-500">Live products visible on the storefront</p>
            </div>
            <Link
              to="/admin/products"
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              View All ({products.length})
            </Link>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {products.slice(0, 6).map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="h-12 w-12 rounded-xl object-cover border border-slate-100 bg-slate-50 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{item.category} · {item.sizes.join(', ')}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="block text-sm font-bold text-slate-900">{formatPrice(item.price)}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {item.isNew && (
                      <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700">
                        New
                      </span>
                    )}
                    {item.isBestSeller && (
                      <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                        Best Seller
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Live Contact & WhatsApp Config */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4">Store Identity</h3>
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <span className="block font-bold text-slate-700">Location</span>
                  <span className="text-slate-500">{siteContent.contactLocation}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <PhoneCallIcon className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="block font-bold text-slate-700">WhatsApp &amp; Orders Phone</span>
                  <span className="font-semibold text-emerald-700">{siteContent.contactPhone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TrendingUpIcon className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
                <div>
                  <span className="block font-bold text-slate-700">Specialization</span>
                  <span className="text-slate-500">Men and Boys Big Size Store</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                to="/admin/site-text"
                className="block text-center rounded-xl border border-blue-200 bg-blue-50/50 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
              >
                Edit Store Information
              </Link>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              WhatsApp Instant Checkout
            </h4>
            <p className="mt-2 text-xs text-emerald-700 leading-relaxed">
              When a customer completes an order at checkout, their selected products, images, and delivery details are automatically encoded and sent directly to WhatsApp <strong>0784264931</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
