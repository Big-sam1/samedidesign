import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { products as initialProducts } from '../data/products';
import { blogPosts as initialBlogPosts } from '../data/blog';
import { announcements as initialAnnouncements } from '../data/site';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
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

/**
 * Safe localStorage write that handles browser storage quota limits
 * and avoids crashing the app when large base64 images are stored.
 */
function safeSetLocalStorage(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[DataContext] localStorage quota exceeded for key "${key}". Saving lightweight copy:`, err);
    try {
      if (Array.isArray(value)) {
        // Strip large data URLs (> 50KB) to ensure essential metadata and product list persists
        const lightweight = value.map((item) => {
          if (!item) return item;
          if (Array.isArray(item.images)) {
            return {
              ...item,
              images: item.images.map((img: string) =>
                typeof img === 'string' && img.startsWith('data:image') && img.length > 50000
                  ? '/samed-design-logo.png'
                  : img
              )
            };
          }
          return item;
        });
        localStorage.setItem(key, JSON.stringify(lightweight));
      }
    } catch {
      // If even lightweight copy cannot be written, safely ignore
    }
  }
}

/**
 * Ensures a Product object always has valid arrays and numbers
 * so that rendering never throws runtime undefined/null errors.
 */
export function sanitizeProduct(p: any): Product {
  const fallbackImages = ['/samed-design-logo.png', '/samed-design-logo.png'];
  const safeImages = Array.isArray(p?.images) && p.images.length > 0
    ? p.images.map((img: any) => typeof img === 'string' && img ? img : '/samed-design-logo.png')
    : fallbackImages;

  const safeSizes = Array.isArray(p?.sizes) && p.sizes.length > 0
    ? p.sizes.map((s: any) => String(s || '').trim()).filter(Boolean)
    : ['M', 'L', 'XL', '2XL', '3XL', '4XL'];

  const safeColors = Array.isArray(p?.colors) && p.colors.length > 0
    ? p.colors
    : [{ name: 'Default', hex: '#000000' }];

  return {
    id: String(p?.id || `product-${Date.now()}`),
    name: String(p?.name || 'Unnamed Product'),
    brand: String(p?.brand || 'Samedi'),
    category: String(p?.category || 'pants'),
    price: typeof p?.price === 'number' && !isNaN(p.price) ? p.price : Number(p?.price) || 10,
    oldPrice: p?.oldPrice !== undefined && p?.oldPrice !== null && !isNaN(Number(p?.oldPrice)) ? Number(p?.oldPrice) : undefined,
    rating: typeof p?.rating === 'number' && !isNaN(p.rating) ? p.rating : 5,
    reviews: typeof p?.reviews === 'number' && !isNaN(p.reviews) ? p.reviews : 1,
    images: safeImages,
    description: String(p?.description || ''),
    colors: safeColors,
    sizes: safeSizes,
    badge: p?.badge || undefined,
    stock: typeof p?.stock === 'number' && !isNaN(p.stock) ? p.stock : Number(p?.stock) || 0,
    isNew: Boolean(p?.isNew),
    isBestSeller: Boolean(p?.isBestSeller)
  };
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(sanitizeProduct);
        }
      }
      return initialProducts.map(sanitizeProduct);
    } catch {
      return initialProducts.map(sanitizeProduct);
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
      if (!isSupabaseConfigured) {
        return;
      }
      try {
        setLoading(true);
        const { data: remoteProducts, error: pErr } = await supabase.from('products').select('*');
        if (!pErr && remoteProducts && remoteProducts.length > 0 && isMounted) {
          const sanitized = remoteProducts.map(sanitizeProduct);
          setProducts(sanitized);
          safeSetLocalStorage(STORAGE_KEYS.PRODUCTS, sanitized);
        }

        const { data: remoteBlog, error: bErr } = await supabase.from('blog_posts').select('*');
        if (!bErr && remoteBlog && remoteBlog.length > 0 && isMounted) {
          setBlogPosts(remoteBlog as BlogPost[]);
          safeSetLocalStorage(STORAGE_KEYS.BLOG, remoteBlog);
        }

        const { data: remoteContent, error: cErr } = await supabase.from('site_content').select('*').single();
        if (!cErr && remoteContent && isMounted) {
          setSiteContent((prev) => ({ ...prev, ...remoteContent }));
          safeSetLocalStorage(STORAGE_KEYS.CONTENT, remoteContent);
        }
      } catch (err) {
        console.warn('Supabase remote sync bypassed:', err);
      } finally {
        if (isMounted) setLoading(false);
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
          const parsed = JSON.parse(event.newValue);
          if (Array.isArray(parsed)) {
            setProducts(parsed.map(sanitizeProduct));
          }
        } catch {}
      }
      if (event.key === STORAGE_KEYS.BLOG && event.newValue) {
        try {
          setBlogPosts(JSON.parse(event.newValue));
        } catch {}
      }
      if (event.key === STORAGE_KEYS.CONTENT && event.newValue) {
        try {
          setSiteContent((prev) => ({ ...prev, ...JSON.parse(event.newValue as string) }));
        } catch {}
      }
    };

    window.addEventListener('storage', syncLocalData);
    return () => window.removeEventListener('storage', syncLocalData);
  }, []);

  // Listen to remote database changes in real time
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel('samedidesign-data-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, async () => {
        try {
          const { data } = await supabase.from('products').select('*');
          if (data && data.length > 0) {
            const sanitized = data.map(sanitizeProduct);
            setProducts(sanitized);
            safeSetLocalStorage(STORAGE_KEYS.PRODUCTS, sanitized);
          }
        } catch {}
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, async () => {
        try {
          const { data } = await supabase.from('blog_posts').select('*');
          if (data && data.length > 0) {
            setBlogPosts(data as BlogPost[]);
            safeSetLocalStorage(STORAGE_KEYS.BLOG, data);
          }
        } catch {}
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_content' }, async () => {
        try {
          const { data } = await supabase.from('site_content').select('*').single();
          if (data) {
            setSiteContent((prev) => ({ ...prev, ...data }));
            safeSetLocalStorage(STORAGE_KEYS.CONTENT, data);
          }
        } catch {}
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  // Lightweight broadcast to notify peer browsers in real time
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const syncChannel = supabase.channel('samedidesign-live-updates', {
      config: { broadcast: { self: false } }
    });

    syncChannel
      .on('broadcast', { event: 'products_sync' }, async (payload) => {
        if (payload?.payload?.product) {
          const item = sanitizeProduct(payload.payload.product);
          setProducts((prev) => {
            const next = prev.some((p) => p.id === item.id)
              ? prev.map((p) => (p.id === item.id ? item : p))
              : [item, ...prev];
            safeSetLocalStorage(STORAGE_KEYS.PRODUCTS, next);
            return next;
          });
        } else if (payload?.payload?.deletedId) {
          setProducts((prev) => {
            const next = prev.filter((p) => p.id !== payload.payload.deletedId);
            safeSetLocalStorage(STORAGE_KEYS.PRODUCTS, next);
            return next;
          });
        }
      })
      .on('broadcast', { event: 'blog_sync' }, (payload) => {
        if (payload?.payload?.blogPosts && Array.isArray(payload.payload.blogPosts)) {
          setBlogPosts(payload.payload.blogPosts);
          safeSetLocalStorage(STORAGE_KEYS.BLOG, payload.payload.blogPosts);
        }
      })
      .on('broadcast', { event: 'content_sync' }, (payload) => {
        if (payload?.payload?.siteContent) {
          setSiteContent((prev) => ({ ...prev, ...payload.payload.siteContent }));
          safeSetLocalStorage(STORAGE_KEYS.CONTENT, payload.payload.siteContent);
        }
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(syncChannel);
    };
  }, []);

  const broadcastProductChange = (type: 'update' | 'delete', data: any) => {
    try {
      if (!isSupabaseConfigured) return;
      const ch = supabase.channel('samedidesign-live-updates');
      ch.send({
        type: 'broadcast',
        event: 'products_sync',
        payload: type === 'delete' ? { deletedId: data } : { product: data }
      }).catch(() => {});
    } catch {}
  };

  const broadcastBlog = (next: BlogPost[]) => {
    try {
      if (!isSupabaseConfigured) return;
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
      if (!isSupabaseConfigured) return;
      const ch = supabase.channel('samedidesign-live-updates');
      ch.send({
        type: 'broadcast',
        event: 'content_sync',
        payload: { siteContent: next }
      }).catch(() => {});
    } catch {}
  };

  const updateProduct = useCallback(async (updated: Product): Promise<boolean> => {
    const safeUpdated = sanitizeProduct(updated);
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === safeUpdated.id ? safeUpdated : p));
      safeSetLocalStorage(STORAGE_KEYS.PRODUCTS, next);
      return next;
    });
    broadcastProductChange('update', safeUpdated);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('products').upsert(safeUpdated);
        if (error) {
          console.warn('[DataContext] Supabase upsert error (saved locally):', error);
        }
      } catch (err) {
        console.warn('[DataContext] Supabase upsert exception (saved locally):', err);
      }
    }
    return true;
  }, []);

  const addProduct = useCallback(async (product: Product): Promise<boolean> => {
    const safeProduct = sanitizeProduct(product);
    setProducts((prev) => {
      const next = [safeProduct, ...prev.filter((p) => p.id !== safeProduct.id)];
      safeSetLocalStorage(STORAGE_KEYS.PRODUCTS, next);
      return next;
    });
    broadcastProductChange('update', safeProduct);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('products').insert(safeProduct);
        if (error) {
          console.warn('[DataContext] Supabase insert error (saved locally):', error);
        }
      } catch (err) {
        console.warn('[DataContext] Supabase insert exception (saved locally):', err);
      }
    }
    return true;
  }, []);

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      safeSetLocalStorage(STORAGE_KEYS.PRODUCTS, next);
      return next;
    });
    broadcastProductChange('delete', id);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
          console.warn('[DataContext] Supabase delete error (deleted locally):', error);
        }
      } catch (err) {
        console.warn('[DataContext] Supabase delete exception (deleted locally):', err);
      }
    }
    return true;
  }, []);

  const updateBlogPost = useCallback(async (updated: BlogPost): Promise<boolean> => {
    setBlogPosts((prev) => {
      const next = prev.map((b) => (b.slug === updated.slug ? updated : b));
      safeSetLocalStorage(STORAGE_KEYS.BLOG, next);
      return next;
    });
    broadcastBlog([updated]);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('blog_posts').upsert(updated);
        if (error) console.warn('[DataContext] Supabase blog upsert error:', error);
      } catch (err) {
        console.warn('[DataContext] Supabase blog upsert exception:', err);
      }
    }
    return true;
  }, []);

  const addBlogPost = useCallback(async (post: BlogPost): Promise<boolean> => {
    setBlogPosts((prev) => {
      const next = [post, ...prev.filter((b) => b.slug !== post.slug)];
      safeSetLocalStorage(STORAGE_KEYS.BLOG, next);
      return next;
    });
    broadcastBlog([post]);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('blog_posts').insert(post);
        if (error) console.warn('[DataContext] Supabase blog insert error:', error);
      } catch (err) {
        console.warn('[DataContext] Supabase blog insert exception:', err);
      }
    }
    return true;
  }, []);

  const deleteBlogPost = useCallback(async (slug: string): Promise<boolean> => {
    setBlogPosts((prev) => {
      const next = prev.filter((b) => b.slug !== slug);
      safeSetLocalStorage(STORAGE_KEYS.BLOG, next);
      return next;
    });

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('blog_posts').delete().eq('slug', slug);
        if (error) console.warn('[DataContext] Supabase blog delete error:', error);
      } catch (err) {
        console.warn('[DataContext] Supabase blog delete exception:', err);
      }
    }
    return true;
  }, []);

  const updateSiteContent = useCallback(async (content: Partial<SiteContent>): Promise<boolean> => {
    setSiteContent((prev) => {
      const next = { ...prev, ...content };
      safeSetLocalStorage(STORAGE_KEYS.CONTENT, next);
      return next;
    });

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('site_content').upsert({ id: 'site', ...content });
        if (error) console.warn('[DataContext] Supabase site_content upsert error:', error);
      } catch (err) {
        console.warn('[DataContext] Supabase site_content upsert exception:', err);
      }
    }
    return true;
  }, []);

  const resetToDefaults = useCallback(() => {
    setProducts(initialProducts.map(sanitizeProduct));
    setBlogPosts(initialBlogPosts);
    setSiteContent(defaultSiteContent);
    safeSetLocalStorage(STORAGE_KEYS.PRODUCTS, initialProducts);
    safeSetLocalStorage(STORAGE_KEYS.BLOG, initialBlogPosts);
    safeSetLocalStorage(STORAGE_KEYS.CONTENT, defaultSiteContent);
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
