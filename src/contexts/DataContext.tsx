import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { products as initialProducts } from '../data/products';
import { blogPosts as initialBlogPosts } from '../data/blog';
import { announcements as initialAnnouncements } from '../data/site';
import { supabase } from '../lib/supabase';
import type { Product, BlogPost } from '../types';

export interface SiteContent {
  announcements: string[];
  heroHeadline: string;
  heroSubheadline: string;
  contactPhone: string;
  contactLocation: string;
}

interface DataContextValue {
  products: Product[];
  blogPosts: BlogPost[];
  siteContent: SiteContent;
  loading: boolean;
  updateProduct: (updated: Product) => Promise<boolean>;
  addProduct: (product: Product) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  updateBlogPost: (updated: BlogPost) => Promise<boolean>;
  addBlogPost: (post: BlogPost) => Promise<boolean>;
  deleteBlogPost: (slug: string) => Promise<boolean>;
  updateSiteContent: (content: Partial<SiteContent>) => Promise<boolean>;
  resetToDefaults: () => void;
}

const STORAGE_KEYS = {
  PRODUCTS: 'samedidesign.products.v1',
  BLOG: 'samedidesign.blog.v1',
  CONTENT: 'samedidesign.content.v1'
};

const defaultSiteContent: SiteContent = {
  announcements: initialAnnouncements,
  heroHeadline: 'First SHOP in Town Bigsize Store',
  heroSubheadline: 'We sell clothes · Nyamirambo Biryogo · Call & WhatsApp 0784264931',
  contactPhone: '0784264931',
  contactLocation: 'Nyamirambo Biryogo, Kigali, Rwanda'
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BLOG);
      return saved ? JSON.parse(saved) : initialBlogPosts;
    } catch {
      return initialBlogPosts;
    }
  });

  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONTENT);
      return saved ? { ...defaultSiteContent, ...JSON.parse(saved) } : defaultSiteContent;
    } catch {
      return defaultSiteContent;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadRemote() {
      try {
        const { data: remoteProducts, error: pErr } = await supabase.from('products').select('*');
        if (!pErr && remoteProducts && remoteProducts.length > 0 && isMounted) {
          setProducts(remoteProducts as Product[]);
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(remoteProducts));
        }

        const { data: remoteBlog, error: bErr } = await supabase.from('blog_posts').select('*');
        if (!bErr && remoteBlog && remoteBlog.length > 0 && isMounted) {
          setBlogPosts(remoteBlog as BlogPost[]);
          localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(remoteBlog));
        }

        const { data: remoteContent, error: cErr } = await supabase.from('site_content').select('*').single();
        if (!cErr && remoteContent && isMounted) {
          setSiteContent((prev) => ({ ...prev, ...remoteContent }));
          localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(remoteContent));
        }
      } catch (err) {
        console.warn('Supabase remote sync bypassed:', err);
      }
    }
    loadRemote();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const syncLocalData = (event: StorageEvent) => {
      if (event.key === STORAGE_KEYS.PRODUCTS && event.newValue) {
        try {
          setProducts(JSON.parse(event.newValue));
        } catch {
          // Ignore malformed external storage updates.
        }
      }
      if (event.key === STORAGE_KEYS.BLOG && event.newValue) {
        try {
          setBlogPosts(JSON.parse(event.newValue));
        } catch {
          // Ignore malformed external storage updates.
        }
      }
      if (event.key === STORAGE_KEYS.CONTENT && event.newValue) {
        try {
          setSiteContent((prev) => ({ ...prev, ...JSON.parse(event.newValue as string) }));
        } catch {
          // Ignore malformed external storage updates.
        }
      }
    };

    window.addEventListener('storage', syncLocalData);
    return () => window.removeEventListener('storage', syncLocalData);
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('samedidesign-data-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, async () => {
        const { data } = await supabase.from('products').select('*');
        if (data && data.length > 0) {
          setProducts(data as Product[]);
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, async () => {
        const { data } = await supabase.from('blog_posts').select('*');
        if (data && data.length > 0) {
          setBlogPosts(data as BlogPost[]);
          localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(data));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_content' }, async () => {
        const { data } = await supabase.from('site_content').select('*').single();
        if (data) {
          setSiteContent((prev) => ({ ...prev, ...data }));
          localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(data));
        }
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  // Realtime Broadcast Channel to sync between admin and customer devices in real-time
  useEffect(() => {
    const syncChannel = supabase.channel('samedidesign-live-updates', {
      config: { broadcast: { self: false } }
    });

    syncChannel
      .on('broadcast', { event: 'products_sync' }, (payload) => {
        if (payload.payload && Array.isArray(payload.payload.products)) {
          setProducts(payload.payload.products);
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(payload.payload.products));
        }
      })
      .on('broadcast', { event: 'blog_sync' }, (payload) => {
        if (payload.payload && Array.isArray(payload.payload.blogPosts)) {
          setBlogPosts(payload.payload.blogPosts);
          localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(payload.payload.blogPosts));
        }
      })
      .on('broadcast', { event: 'content_sync' }, (payload) => {
        if (payload.payload && payload.payload.siteContent) {
          setSiteContent((prev) => ({ ...prev, ...payload.payload.siteContent }));
          localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(payload.payload.siteContent));
        }
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(syncChannel);
    };
  }, []);

  const broadcastProducts = (next: Product[]) => {
    try {
      const ch = supabase.channel('samedidesign-live-updates');
      ch.send({
        type: 'broadcast',
        event: 'products_sync',
        payload: { products: next }
      }).catch(() => {});
    } catch {}
  };

  const broadcastBlog = (next: BlogPost[]) => {
    try {
      const ch = supabase.channel('samedidesign-live-updates');
      ch.send({
        type: 'broadcast',
        event: 'blog_sync',
        payload: { blogPosts: next }
      }).catch(() => {});
    } catch {}
  };

  const broadcastContent = (next: SiteContent) => {
    try {
      const ch = supabase.channel('samedidesign-live-updates');
      ch.send({
        type: 'broadcast',
        event: 'content_sync',
        payload: { siteContent: next }
      }).catch(() => {});
    } catch {}
  };

  const updateProduct = useCallback(async (updated: Product): Promise<boolean> => {
    try {
      setProducts((prev) => {
        const next = prev.map((p) => (p.id === updated.id ? updated : p));
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(next));
        broadcastProducts(next);
        return next;
      });
      supabase.from('products').upsert(updated).catch(() => {});
      return true;
    } catch {
      return false;
    }
  }, []);

  const addProduct = useCallback(async (product: Product): Promise<boolean> => {
    try {
      setProducts((prev) => {
        const next = [product, ...prev];
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(next));
        broadcastProducts(next);
        return next;
      });
      supabase.from('products').insert(product).catch(() => {});
      return true;
    } catch {
      return false;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    try {
      setProducts((prev) => {
        const next = prev.filter((p) => p.id !== id);
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(next));
        broadcastProducts(next);
        return next;
      });
      supabase.from('products').delete().eq('id', id).catch(() => {});
      return true;
    } catch {
      return false;
    }
  }, []);

  const updateBlogPost = useCallback(async (updated: BlogPost): Promise<boolean> => {
    try {
      setBlogPosts((prev) => {
        const next = prev.map((b) => (b.slug === updated.slug ? updated : b));
        localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(next));
        broadcastBlog(next);
        return next;
      });
      supabase.from('blog_posts').upsert(updated).catch(() => {});
      return true;
    } catch {
      return false;
    }
  }, []);

  const addBlogPost = useCallback(async (post: BlogPost): Promise<boolean> => {
    try {
      setBlogPosts((prev) => {
        const next = [post, ...prev];
        localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(next));
        broadcastBlog(next);
        return next;
      });
      supabase.from('blog_posts').insert(post).catch(() => {});
      return true;
    } catch {
      return false;
    }
  }, []);

  const deleteBlogPost = useCallback(async (slug: string): Promise<boolean> => {
    try {
      setBlogPosts((prev) => {
        const next = prev.filter((b) => b.slug !== slug);
        localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(next));
        broadcastBlog(next);
        return next;
      });
      supabase.from('blog_posts').delete().eq('slug', slug).catch(() => {});
      return true;
    } catch {
      return false;
    }
  }, []);

  const updateSiteContent = useCallback(async (content: Partial<SiteContent>): Promise<boolean> => {
    try {
      setSiteContent((prev) => {
        const next = { ...prev, ...content };
        localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(next));
        broadcastContent(next);
        return next;
      });
      supabase.from('site_content').upsert(content).catch(() => {});
      return true;
    } catch {
      return false;
    }
  }, []);

  const resetToDefaults = useCallback(() => {
    setProducts(initialProducts);
    setBlogPosts(initialBlogPosts);
    setSiteContent(defaultSiteContent);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
    localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(initialBlogPosts));
    localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(defaultSiteContent));
  }, []);

  return (
    <DataContext.Provider
      value={{
        products,
        blogPosts,
        siteContent,
        loading,
        updateProduct,
        addProduct,
        deleteProduct,
        updateBlogPost,
        addBlogPost,
        deleteBlogPost,
        updateSiteContent,
        resetToDefaults
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextValue {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used inside DataProvider');
  return context;
}
