import React from 'react';
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartIcon, LogOutIcon, MapPinIcon, PackageIcon, SettingsIcon, UserIcon } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { EASE_SMOOTH } from '../../animations/variants';
import { PageHeader } from '../ui/PageHeader';
import { cn } from '../../utils/format';

const links = [
{ to: '/account', label: 'Profile', Icon: UserIcon, end: true },
{ to: '/account/orders', label: 'Orders', Icon: PackageIcon, end: false },
{ to: '/wishlist', label: 'Wishlist', Icon: HeartIcon, end: false },
{ to: '/account/addresses', label: 'Addresses', Icon: MapPinIcon, end: false },
{ to: '/account/profile', label: 'Settings', Icon: SettingsIcon, end: false }];


export function AccountLayout() {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      <PageHeader
        title="My Account"
        subtitle={`Signed in as ${user.email}`}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Account' }]} />
      
      <div className="mx-auto w-full max-w-shell px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[232px_minmax(0,1fr)]">
          <aside aria-label="Account navigation">
            <motion.nav
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: EASE_SMOOTH }}
              className="flex gap-1 overflow-x-auto rounded-2xl border border-line bg-white p-2 no-scrollbar lg:sticky lg:top-24 lg:flex-col lg:overflow-visible">
              
              {links.map(({ to, label, Icon, end }) =>
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                cn(
                  'flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold transition-colors duration-200',
                  isActive ? 'bg-accent-soft text-accent' : 'text-charcoal hover:bg-canvas'
                )
                }>
                
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </NavLink>
              )}
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold text-charcoal transition-colors duration-200 hover:bg-canvas hover:text-red-500">
                
                <LogOutIcon className="h-4 w-4" aria-hidden="true" />
                Logout
              </button>
            </motion.nav>
          </aside>

          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </>);

}