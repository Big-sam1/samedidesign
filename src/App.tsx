import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { DataProvider } from './contexts/DataContext';
import { StoreProvider } from './contexts/StoreContext';
import { SiteLayout } from './components/layout/SiteLayout';
import { LoadingScreen } from './components/layout/LoadingScreen';
import { AccountLayout } from './components/account/AccountLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Categories } from './pages/Categories';
import { CategoryProducts } from './pages/CategoryProducts';
import { NewArrivals } from './pages/NewArrivals';
import { BestSellers } from './pages/BestSellers';
import { Search } from './pages/Search';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { Wishlist } from './pages/Wishlist';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/account/Dashboard';
import { Orders } from './pages/account/Orders';
import { OrderDetail } from './pages/account/OrderDetail';
import { Profile } from './pages/account/Profile';
import { Addresses } from './pages/account/Addresses';
import { Blog } from './pages/Blog';
import { BlogArticle } from './pages/BlogArticle';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminFeaturedSection } from './pages/admin/AdminFeaturedSection';
import { AdminBlog } from './pages/admin/AdminBlog';
import { AdminSiteText } from './pages/admin/AdminSiteText';
import { AdminProfile } from './pages/admin/AdminProfile';
import { AdminLogin } from './pages/admin/AdminLogin';

interface AppProps {
  /** Show the branded intro loader the first time the store opens. */
  showIntroLoader?: boolean;
}

export function App({ showIntroLoader = true }: AppProps) {
  const [booting, setBooting] = useState(showIntroLoader);

  useEffect(() => {
    if (!showIntroLoader) return;
    const timer = window.setTimeout(() => setBooting(false), 1200);
    return () => window.clearTimeout(timer);
  }, [showIntroLoader]);

  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <ToastProvider>
          <DataProvider>
            <StoreProvider>
              <AnimatePresence>{booting && <LoadingScreen />}</AnimatePresence>
              <BrowserRouter>
                <Routes>
                  {/* Admin Portal Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="new-arrivals" element={<AdminFeaturedSection type="new-arrivals" />} />
                    <Route path="best-sellers" element={<AdminFeaturedSection type="best-sellers" />} />
                    <Route path="blog" element={<AdminBlog />} />
                    <Route path="site-text" element={<AdminSiteText />} />
                    <Route path="profile" element={<AdminProfile />} />
                  </Route>

                  {/* Public Storefront Routes */}
                  <Route element={<SiteLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/category/:slug" element={<CategoryProducts />} />
                    <Route path="/new-arrivals" element={<NewArrivals />} />
                    <Route path="/best-sellers" element={<BestSellers />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/account" element={<AccountLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="orders" element={<Orders />} />
                      <Route path="order/:id" element={<OrderDetail />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="addresses" element={<Addresses />} />
                    </Route>
                    <Route path="/about" element={<Navigate to="/" replace />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogArticle />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </StoreProvider>
          </DataProvider>
        </ToastProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}
