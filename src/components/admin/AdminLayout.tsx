import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, Link, Navigate } from 'react-router-dom';
import {
  LayoutDashboardIcon,
  ShoppingBagIcon,
  SparklesIcon,
  FlameIcon,
  FileTextIcon,
  SettingsIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  ExternalLinkIcon,
  StoreIcon,
  UserCheckIcon,
  MoonIcon,
  SunIcon
} from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { cn } from '../../utils/format';
import { Logo } from '../ui/Logo';
import { hasAdminSession } from '../../utils/adminAuth';

export function AdminLayout() {
  const { adminUser, logout } = useStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => window.localStorage.getItem('samedidesign.admin.theme') === 'dark');

  useEffect(() => {
    window.localStorage.setItem('samedidesign.admin.theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  if (!hasAdminSession()) return <Navigate to="/admin/login" replace />;

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboardIcon, end: true },
    { to: '/admin/products', label: 'All Products', icon: ShoppingBagIcon },
    { to: '/admin/new-arrivals', label: 'New Arrivals', icon: SparklesIcon },
    { to: '/admin/best-sellers', label: 'Best Sellers', icon: FlameIcon },
    { to: '/admin/blog', label: 'Blog & Articles', icon: FileTextIcon },
    { to: '/admin/site-text', label: 'Site Content & Texts', icon: SettingsIcon },
    { to: '/admin/profile', label: 'Admin Profile', icon: UserCheckIcon },
  ];

  return (
    <div className={cn('admin-portal min-h-screen bg-slate-100 text-slate-800 flex font-sans', darkMode && 'admin-dark')}>
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Matching Reference Design (Left Panel) */}
      <aside
        className={cn(
          'admin-sidebar fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-200 text-slate-800 shadow-xl transition-transform duration-300 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-0 -translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo / Brand Header */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-300">
          <div className="flex items-center gap-3">
            <img
              src="/samed-design-logo.png"
              alt="Samedi design"
              className="h-10 w-10 rounded-full border-2 border-slate-400 object-cover"
              style={{ borderRadius: '100%' }}
            />
            <div>
              <span className="block text-base font-bold tracking-tight text-slate-900 leading-tight">Samedi Admin</span>
              <span className="block text-[11px] text-slate-500">Management Portal</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-300 lg:hidden"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Main Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:bg-slate-300 hover:text-slate-900'
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          <div className="pt-6">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Live Store</p>
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm text-slate-600 transition hover:bg-slate-300 hover:text-slate-900"
            >
              <span className="flex items-center gap-3">
                <StoreIcon className="h-4 w-4" />
                View Website
              </span>
              <ExternalLinkIcon className="h-3.5 w-3.5 text-slate-500" />
            </Link>
          </div>
        </div>

        {/* User / Logout in Footer */}
        <div className="p-4 border-t border-slate-300 bg-slate-300/70">
          <div className="flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="truncate text-xs font-semibold text-slate-800">{adminUser.name}</p>
              <p className="truncate text-[11px] text-slate-500">{adminUser.email}</p>
            </div>
            <button
              onClick={async () => {
                await logout();
                navigate('/admin/login');
              }}
              title="Logout"
              className="grid h-8 w-8 place-items-center rounded-lg bg-white text-slate-700 hover:bg-red-500 hover:text-white transition-colors"
            >
              <LogOutIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="admin-topbar sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-800">Admin Control Panel</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDarkMode((current) => !current)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100"
              aria-label={darkMode ? 'Switch admin portal to light mode' : 'Switch admin portal to dark mode'}
              aria-pressed={darkMode}
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected: Firebase & Supabase
            </span>
            <Link
              to="/admin/profile"
              className="flex items-center gap-2 pl-2 border-l border-slate-200 hover:opacity-80 transition"
              title="Edit Admin Profile"
            >
              <img
                src={adminUser.avatar || '/samed-design-logo.png'}
                alt="Admin"
                className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                style={{ borderRadius: '100%' }}
              />
              <span className="hidden md:inline text-xs font-semibold text-slate-700">
                {adminUser.name || 'Admin'}
              </span>
            </Link>
          </div>
        </header>

        {/* Routed Sub-pages */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
