import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ChevronDownIcon, HeartIcon, LogOutIcon, MenuIcon, SearchIcon, ShoppingBagIcon, UserIcon, XIcon } from 'lucide-react';
import { categories } from '../../data/categories';
import { useStore } from '../../contexts/StoreContext';
import { EASE_SMOOTH, springSnappy } from '../../animations/variants';
import { Logo } from '../ui/Logo';
import { ThemeToggle } from '../ui/ThemeToggle';
import { ScrollProgress } from './ScrollProgress';
import { cn } from '../../utils/format';

const navLinks = [
{ label: 'Home', to: '/' },
{ label: 'Shop', to: '/shop' },
{ label: 'New Arrivals', to: '/new-arrivals' },
{ label: 'Best Sellers', to: '/best-sellers' }];


const tailLinks = [
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' }
];


export function Navbar() {
  const { cartCount, wishlist, user, logout } = useStore();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [stuck, setStuck] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [query, setQuery] = useState('');

  useMotionValueEvent(scrollY, 'change', (value) => setStuck(value > 24));

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    setSearchOpen(false);
    setMenuOpen(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const linkClasses = ({ isActive }: {isActive: boolean;}) =>
  cn(
    'relative py-1 text-[13.5px] font-medium transition-colors duration-200 ease-smooth',
    isActive ? 'text-accent' : 'text-charcoal hover:text-ink'
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-[background-color,box-shadow,border-color] duration-300 ease-smooth',
        stuck ? 'border-line bg-white/85 shadow-card backdrop-blur-xl' : 'border-transparent bg-white'
      )}>
      
      <div className="mx-auto flex w-full max-w-shell items-center gap-4 px-4 py-3.5 sm:px-6">
        <Logo to="/" className="mr-2" />

        <nav aria-label="Main" className="hidden flex-1 items-center gap-6 lg:flex">
          {navLinks.map((link) =>
          <NavLink key={link.to} to={link.to} className={linkClasses} end={link.to === '/'}>
              {({ isActive }) =>
            <>
                  {link.label}
                  {isActive &&
              <motion.span layoutId="nav-active" className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-accent" />
              }
                </>
            }
            </NavLink>
          )}

          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}>
            
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-expanded={dropdownOpen}
              className="flex items-center gap-1 py-1 text-[13.5px] font-medium text-charcoal transition-colors duration-200 hover:text-ink">
              
              Categories
              <motion.span animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.2, ease: EASE_SMOOTH }}>
                <ChevronDownIcon className="h-3.5 w-3.5" aria-hidden="true" />
              </motion.span>
            </button>
            <AnimatePresence>
              {dropdownOpen &&
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: EASE_SMOOTH }}
                className="absolute left-0 top-full z-40 w-[420px] pt-3">
                
                  <div className="grid grid-cols-2 gap-1 rounded-2xl border border-line bg-white p-2 shadow-lift">
                    {categories.map((category) =>
                  <Link
                    key={category.slug}
                    to={`/category/${category.slug}`}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 rounded-xl p-2 transition-colors duration-150 hover:bg-canvas">
                    
                        <img src={category.image} alt="" aria-hidden="true" className="h-10 w-10 rounded-lg object-cover" />
                        <span className="text-[13px] font-semibold text-ink">{category.name}</span>
                      </Link>
                  )}
                    <Link
                    to="/categories"
                    onClick={() => setDropdownOpen(false)}
                    className="col-span-2 mt-1 rounded-xl bg-canvas px-3 py-2.5 text-center text-[13px] font-semibold text-accent">
                      View all categories
                    </Link>
                  </div>
                </motion.div>
              }
            </AnimatePresence>
          </div>

          {tailLinks.map((link) =>
          <NavLink key={link.to} to={link.to} className={linkClasses}>
              {link.label}
            </NavLink>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-label="Search products"
            aria-expanded={searchOpen}
            className="grid h-10 w-10 place-items-center rounded-full text-charcoal transition-colors duration-200 hover:bg-canvas hover:text-ink">
            
            <SearchIcon className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
          <Link
            to="/wishlist"
            aria-label={`Wishlist, ${wishlist.length} items`}
            className="relative hidden h-10 w-10 place-items-center rounded-full text-charcoal transition-colors duration-200 hover:bg-canvas hover:text-ink sm:grid">
            
            <HeartIcon className="h-[18px] w-[18px]" aria-hidden="true" />
            {wishlist.length > 0 &&
            <span className="absolute right-1 top-1.5 grid h-4 min-w-[16px] place-items-center rounded-full bg-ink px-1 text-[10px] font-bold text-white">
                {wishlist.length}
              </span>
            }
          </Link>
          {user ? (
            <>
              <Link
                to="/account"
                aria-label={`Open ${user.name}'s account`}
                className="hidden h-10 items-center gap-2 rounded-full px-2 text-charcoal transition-colors duration-200 hover:bg-canvas hover:text-ink sm:flex"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-accent-soft text-accent">
                    <UserIcon className="h-4 w-4" aria-hidden="true" />
                  </span>
                )}
                <span className="max-w-[110px] truncate text-[12px] font-semibold">{user.name}</span>
              </Link>
              <button
                type="button"
                onClick={() => void logout()}
                aria-label="Log out"
                title="Log out"
                className="hidden h-10 w-10 place-items-center rounded-full text-charcoal transition-colors duration-200 hover:bg-red-50 hover:text-red-600 sm:grid"
              >
                <LogOutIcon className="h-[17px] w-[17px]" aria-hidden="true" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              aria-label="Sign in"
              className="hidden h-10 w-10 place-items-center rounded-full text-charcoal transition-colors duration-200 hover:bg-canvas hover:text-ink sm:grid"
            >
              <UserIcon className="h-[18px] w-[18px]" aria-hidden="true" />
            </Link>
          )}
          <Link
            to="/cart"
            aria-label={`Shopping bag, ${cartCount} items`}
            className="relative grid h-10 w-10 place-items-center rounded-full text-charcoal transition-colors duration-200 hover:bg-canvas hover:text-ink">
            
            <ShoppingBagIcon className="h-[18px] w-[18px]" aria-hidden="true" />
            <AnimatePresence>
              {cartCount > 0 &&
              <motion.span
                key={cartCount}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: [0.4, 1.25, 1], opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={springSnappy}
                className="absolute right-0.5 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                
                  {cartCount}
                </motion.span>
              }
            </AnimatePresence>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-full text-charcoal transition-colors duration-200 hover:bg-canvas lg:hidden">
            
            <MenuIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {stuck && <ScrollProgress />}
      </div>

      <AnimatePresence>
        {searchOpen &&
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: EASE_SMOOTH }}
          className="overflow-hidden border-t border-line bg-white">
          
            <form onSubmit={submitSearch} className="mx-auto flex w-full max-w-shell items-center gap-3 px-4 py-4 sm:px-6">
              <SearchIcon className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className="h-10 flex-1 border-none bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none" />
            
              <button type="submit" className="h-9 rounded-full bg-accent px-4 text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover">
                Search
              </button>
            </form>
          </motion.div>
        }
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen &&
        <div className="fixed inset-0 z-[80] lg:hidden">
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
          
            <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: EASE_SMOOTH }}
            className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white"
            aria-label="Mobile navigation">
            
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <Logo to="/" size="sm" onClick={() => setMenuOpen(false)} />
                <div className="flex items-center gap-1">
                  <ThemeToggle />
                  <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="grid h-9 w-9 place-items-center rounded-full border border-line text-charcoal">
                  
                    <XIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                <form onSubmit={submitSearch} className="mb-6 flex items-center gap-2 rounded-full border border-line px-4">
                  <SearchIcon className="h-4 w-4 text-muted" aria-hidden="true" />
                  <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search products..."
                  aria-label="Search products"
                  className="h-11 flex-1 bg-transparent text-sm focus:outline-none" />
                
                </form>

                <nav className="flex flex-col">
                  {[...navLinks, ...tailLinks].map((link, index) =>
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + index * 0.035, duration: 0.25, ease: EASE_SMOOTH }}>
                  
                      <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                    cn(
                      'block border-b border-line py-3.5 text-[15px] font-semibold',
                      isActive ? 'text-accent' : 'text-ink'
                    )
                    }>
                    
                        {link.label}
                      </NavLink>
                    </motion.div>
                )}
                </nav>

                <p className="mb-3 mt-7 text-[11px] font-semibold uppercase tracking-wider text-muted">Categories</p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) =>
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl border border-line px-3 py-2.5 text-[13px] font-medium text-charcoal">
                  
                      {category.name}
                    </Link>
                )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-line p-5">
                {user ? (
                  <>
                    <Link
                      to="/account"
                      onClick={() => setMenuOpen(false)}
                      className="flex h-11 items-center justify-center gap-2 rounded-full border border-line text-[13px] font-semibold text-ink"
                    >
                      <UserIcon className="h-4 w-4" aria-hidden="true" />
                      {user.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        void logout();
                        setMenuOpen(false);
                      }}
                      className="flex h-11 items-center justify-center gap-2 rounded-full border border-red-200 text-[13px] font-semibold text-red-600"
                    >
                      <LogOutIcon className="h-4 w-4" aria-hidden="true" />
                      Log out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex h-11 items-center justify-center gap-2 rounded-full border border-line text-[13px] font-semibold text-ink"
                  >
                    <UserIcon className="h-4 w-4" aria-hidden="true" />
                    Sign in
                  </Link>
                )}
                <Link
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="flex h-11 items-center justify-center gap-2 rounded-full bg-ink text-[13px] font-semibold text-white">
                
                  <HeartIcon className="h-4 w-4" aria-hidden="true" />
                  Wishlist
                </Link>
              </div>
            </motion.aside>
          </div>
        }
      </AnimatePresence>
    </header>);

}