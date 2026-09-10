import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AnnouncementBar } from './AnnouncementBar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { TrustStrip } from './TrustStrip';
import { PageTransition } from './PageTransition';
import { BackToTop } from './BackToTop';
import { ToastHost } from '../ui/ToastHost';

export function SiteLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />
      <PageTransition key={location.pathname}>
        <Outlet />
      </PageTransition>
      <div className="mt-20">
        <TrustStrip />
      </div>
      <Footer />
      <BackToTop />
      <ToastHost />
    </div>);

}