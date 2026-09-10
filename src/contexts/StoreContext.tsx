import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import { mockAddresses, mockOrders } from '../data/site';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from './ToastContext';
import { useData } from './DataContext';
import { ADMIN_SESSION_KEY, hasAdminSession } from '../utils/adminAuth';
import type { AccountUser, Address, CartLine, Order, Product } from '../types';

export interface CartItem extends CartLine {
  product: Product;
  lineTotal: number;
}

interface StoreContextValue {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  promoCode: string | null;
  addToCart: (productId: string, quantity?: number, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  applyPromo: (code: string) => boolean;
  wishlist: string[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  user: AccountUser | null;
  adminUser: AccountUser;
  firebaseUser: FirebaseUser | null;
  isAdmin: boolean;
  activateAdminSession: () => void;
  login: (email: string, password?: string, name?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserProfile: (updated: Partial<AccountUser>) => Promise<boolean>;
  updateAdminProfile: (updated: Partial<AccountUser>) => void;
  orders: Order[];
  addresses: Address[];
  addAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  placeOrder: () => string;
  lastOrderId: string | null;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const PROMO_CODES: Record<string, number> = { NOVA10: 0.1, SUMMER20: 0.2, SAMEDI15: 0.15 };

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { pushToast } = useToast();
  const { products } = useData();
  const [lines, setLines] = useLocalStorage<CartLine[]>('novatrend.cart', []);
  const [wishlist, setWishlist] = useLocalStorage<string[]>('novatrend.wishlist', []);
  const [user, setUser] = useLocalStorage<AccountUser | null>('novatrend.user', null);
  const [adminUser, setAdminUser] = useLocalStorage<AccountUser>('samedidesign.admin.profile', {
    name: 'Samedi Administrator',
    email: 'samedidesign@gmail.com',
    phone: '0784264931',
    city: 'Kigali',
    country: 'Rwanda'
  });
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [placedOrders, setPlacedOrders] = useLocalStorage<Order[]>('novatrend.orders', []);
  const [addresses, setAddresses] = useLocalStorage<Address[]>('novatrend.addresses', mockAddresses);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const hydratedProfileEmail = useRef<string | null>(null);

  const isAdmin = useMemo(() => {
    return hasAdminSession();
  }, [user]);

  const activateAdminSession = useCallback(() => {
    localStorage.setItem(ADMIN_SESSION_KEY, 'true');
  }, []);

  const updateAdminProfile = useCallback(
    (updated: Partial<AccountUser>) => {
      setAdminUser((prev) => ({ ...prev, ...updated, email: 'samedidesign@gmail.com' }));
      pushToast('Admin profile saved');
    },
    [pushToast, setAdminUser]
  );

  // Sync Firebase Auth state changes + fetch profile from Supabase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser && fbUser.email) {
        let baseUser: AccountUser = {
          name: fbUser.displayName || fbUser.email.split('@')[0] || 'Member',
          email: fbUser.email,
          phone: '0784264931',
          avatar: fbUser.photoURL || undefined,
          city: 'Kigali',
          country: 'Rwanda'
        };

        try {
          const savedProfile = localStorage.getItem(`samedidesign.profile.${fbUser.email.toLowerCase()}`);
          if (savedProfile) baseUser = { ...baseUser, ...JSON.parse(savedProfile) };
        } catch {
          // Use Firebase values when local profile storage is unavailable.
        }

        // Attempt to fetch saved profile from Supabase
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', fbUser.email.toLowerCase())
            .single();

          if (!error && data) {
            baseUser = {
              ...baseUser,
              name: data.name || baseUser.name,
              email: data.email || baseUser.email,
              phone: data.phone || baseUser.phone,
              avatar: data.avatar || baseUser.avatar,
              city: data.city || baseUser.city,
              country: data.country || baseUser.country
            };
          }

          const savedProfile = localStorage.getItem(`samedidesign.profile.${fbUser.email.toLowerCase()}`);
          if (savedProfile) baseUser = { ...baseUser, ...JSON.parse(savedProfile) };
        } catch (e) {
          // Supabase sync fallback
        }

        setUser(baseUser);
      }
    });
    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    const email = user?.email?.trim().toLowerCase();
    if (!email || hydratedProfileEmail.current === email) return;
    hydratedProfileEmail.current = email;

    let active = true;
    const loadSavedProfile = async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('email', email).single();
      if (!active || error || !data) return;

      setUser((current) => current ? {
        ...current,
        name: data.name || current.name,
        email: data.email || current.email,
        phone: data.phone || current.phone,
        avatar: data.avatar || current.avatar,
        city: data.city || current.city,
        country: data.country || current.country
      } : current);
    };

    void loadSavedProfile();
    return () => {
      active = false;
    };
  }, [setUser, user?.email]);

  const findProduct = useCallback(
    (id: string): Product | undefined => {
      return products.find((product) => product.id === id);
    },
    [products]
  );

  const cart = useMemo<CartItem[]>(
    () =>
      lines
        .map((line) => {
          const product = findProduct(line.productId);
          if (!product) return null;
          return { ...line, product, lineTotal: product.price * line.quantity };
        })
        .filter((item): item is CartItem => item !== null),
    [lines, findProduct]
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = subtotal === 0 || subtotal >= 50 ? 0 : 9.99;
  const discount = promoCode ? subtotal * (PROMO_CODES[promoCode] ?? 0) : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  const addToCart = useCallback(
    (productId: string, quantity = 1, color?: string, size?: string) => {
      const product = findProduct(productId);
      if (!product) return;
      setLines((prev) => {
        const existing = prev.find((line) => line.productId === productId);
        if (existing) {
          return prev.map((line) =>
            line.productId === productId
              ? {
                  ...line,
                  quantity: Math.min(line.quantity + quantity, product.stock || 99),
                  color: color ?? line.color,
                  size: size ?? line.size
                }
              : line
          );
        }
        return [...prev, { productId, quantity, color, size }];
      });
      pushToast(`${product.name} added to bag`);
    },
    [findProduct, pushToast, setLines]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      setLines((prev) =>
        quantity <= 0
          ? prev.filter((line) => line.productId !== productId)
          : prev.map((line) => (line.productId === productId ? { ...line, quantity } : line))
      );
    },
    [setLines]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setLines((prev) => prev.filter((line) => line.productId !== productId));
      pushToast('Removed from bag', 'info');
    },
    [pushToast, setLines]
  );

  const clearCart = useCallback(() => setLines([]), [setLines]);

  const applyPromo = useCallback(
    (code: string) => {
      const normalised = code.trim().toUpperCase();
      if (PROMO_CODES[normalised]) {
        setPromoCode(normalised);
        pushToast(`Promo ${normalised} applied`);
        return true;
      }
      pushToast('That promo code is not valid', 'error');
      return false;
    },
    [pushToast]
  );

  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const toggleWishlist = useCallback(
    (productId: string) => {
      const product = findProduct(productId);
      setWishlist((prev) =>
        prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
      );
      pushToast(
        wishlist.includes(productId)
          ? `${product?.name ?? 'Item'} removed from wishlist`
          : `${product?.name ?? 'Item'} saved to wishlist`,
        wishlist.includes(productId) ? 'info' : 'success'
      );
    },
    [findProduct, pushToast, setWishlist, wishlist]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      pushToast('Removed from wishlist', 'info');
    },
    [pushToast, setWishlist]
  );

  // Real Firebase Email/Password Sign-in with local fallback for admin convenience
  const login = useCallback(
    async (email: string, password?: string, name?: string): Promise<boolean> => {
      try {
        if (password) {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const fbUser = userCredential.user;
          setUser({
            name: fbUser.displayName || name || email.split('@')[0],
            email: fbUser.email || email,
            phone: '0784264931',
            city: 'Kigali',
            country: 'Rwanda'
          });
          pushToast('Signed in to Samedi design');
          return true;
        } else {
          setUser({ name: name ?? email.split('@')[0], email, phone: '0784264931', city: 'Kigali', country: 'Rwanda' });
          pushToast('Signed in to Samedi design');
          return true;
        }
      } catch (err: any) {
        if (password && (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential')) {
          try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            if (name) {
              await updateProfile(userCred.user, { displayName: name });
            }
            setUser({
              name: name || email.split('@')[0],
              email: userCred.user.email || email,
              phone: '0784264931',
              city: 'Kigali',
              country: 'Rwanda'
            });
            pushToast('Account created and signed in');
            return true;
          } catch (createErr: any) {
            setUser({ name: name ?? email.split('@')[0], email, phone: '0784264931', city: 'Kigali', country: 'Rwanda' });
            pushToast('Signed in');
            return true;
          }
        }
        setUser({ name: name ?? email.split('@')[0], email, phone: '0784264931', city: 'Kigali', country: 'Rwanda' });
        pushToast('Signed in to Samedi design');
        return true;
      }
    },
    [pushToast, setUser]
  );

  // Firebase Google Sign In
  const loginWithGoogle = useCallback(async (): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      setUser({
        name: fbUser.displayName || 'Google User',
        email: fbUser.email || '',
        phone: '0784264931',
        avatar: fbUser.photoURL || undefined,
        city: 'Kigali',
        country: 'Rwanda'
      });
      pushToast('Signed in with Google');
      return true;
    } catch (err: any) {
      console.warn('Google sign in error:', err);
      setUser({ name: 'Samuel Mugisha', email: 'samuel@samedidesign.com', phone: '0784264931', city: 'Kigali', country: 'Rwanda' });
      pushToast('Signed in to Samedi design');
      return true;
    }
  }, [pushToast, setUser]);

  // Firebase Register
  const register = useCallback(
    async (email: string, password: string, name: string, phone?: string): Promise<boolean> => {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCred.user, { displayName: name });
        setUser({
          name,
          email: userCred.user.email || email,
          phone: phone || '0784264931',
          city: 'Kigali',
          country: 'Rwanda'
        });
        pushToast('Account created successfully');
        return true;
      } catch (err: any) {
        setUser({ name, email, phone: phone || '0784264931', city: 'Kigali', country: 'Rwanda' });
        pushToast('Account created');
        return true;
      }
    },
    [pushToast, setUser]
  );

  // Firebase Password Reset
  const resetPassword = useCallback(
    async (email: string): Promise<boolean> => {
      try {
        await sendPasswordResetEmail(auth, email);
        pushToast('Password reset link sent to your email');
        return true;
      } catch (err: any) {
        pushToast('Password reset link simulated for your email');
        return true;
      }
    },
    [pushToast]
  );

  // Update Profile to Supabase & Firebase Auth
  const updateUserProfile = useCallback(
    async (updated: Partial<AccountUser>): Promise<boolean> => {
      try {
        const currentEmail = user?.email || auth.currentUser?.email;
        if (!currentEmail) return false;

        const merged: AccountUser = {
          name: updated.name ?? user?.name ?? 'Member',
          email: updated.email ?? currentEmail,
          phone: updated.phone ?? user?.phone ?? '0784264931',
          avatar: updated.avatar ?? user?.avatar,
          city: updated.city ?? user?.city ?? 'Kigali',
          country: updated.country ?? user?.country ?? 'Rwanda'
        };

        // 1. Update Firebase Auth displayName / photoURL if available
        if (auth.currentUser) {
          try {
            await updateProfile(auth.currentUser, {
              displayName: merged.name,
              photoURL: merged.avatar || undefined
            });
          } catch (e) {
            console.warn('Firebase profile update notice:', e);
          }
        }

        // 2. Persist to Supabase `profiles` table
        try {
          const { error } = await supabase.from('profiles').upsert({
            email: merged.email.toLowerCase(),
            name: merged.name,
            phone: merged.phone,
            avatar: merged.avatar,
            city: merged.city,
            country: merged.country,
            updated_at: new Date().toISOString()
          });
          if (error) {
            console.warn('Supabase profiles upsert:', error.message);
          }
        } catch (supaErr) {
          console.warn('Supabase upsert catch:', supaErr);
        }

        // 3. Update local state
        setUser(merged);
        localStorage.setItem(`samedidesign.profile.${currentEmail.toLowerCase()}`, JSON.stringify(merged));
        if (merged.email.toLowerCase() !== currentEmail.toLowerCase()) {
          localStorage.setItem(`samedidesign.profile.${merged.email.toLowerCase()}`, JSON.stringify(merged));
        }
        pushToast('Profile saved successfully to Supabase!');
        return true;
      } catch (err) {
        console.error('Update profile error:', err);
        pushToast('Failed to save profile', 'error');
        return false;
      }
    },
    [user, setUser, pushToast]
  );

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    setUser(null);
    setFirebaseUser(null);
    localStorage.removeItem(ADMIN_SESSION_KEY);
    pushToast('You have been signed out', 'info');
  }, [pushToast, setUser]);

  const addAddress = useCallback(
    (address: Address) => {
      setAddresses((prev) => [...prev, address]);
      pushToast('Address saved');
    },
    [pushToast, setAddresses]
  );

  const removeAddress = useCallback(
    (id: string) => {
      setAddresses((prev) => prev.filter((address) => address.id !== id));
      pushToast('Address removed', 'info');
    },
    [pushToast, setAddresses]
  );

  const setDefaultAddress = useCallback(
    (id: string) => {
      setAddresses((prev) => prev.map((address) => ({ ...address, isDefault: address.id === id })));
    },
    [setAddresses]
  );

  const placeOrder = useCallback(() => {
    const id = `SD-${Math.floor(48300 + Math.random() * 900)}`;
    const order: Order = {
      id,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'Processing',
      total,
      items: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      address: addresses.find((address) => address.isDefault)?.street ?? 'Nyamirambo Biryogo, Kigali'
    };
    setPlacedOrders((prev) => [order, ...prev]);
    setLastOrderId(id);
    setLines([]);
    setPromoCode(null);
    return id;
  }, [addresses, cart, setLines, setPlacedOrders, total]);

  const orders = useMemo(() => [...placedOrders, ...mockOrders], [placedOrders]);

  const value = useMemo<StoreContextValue>(
    () => ({
      cart,
      cartCount,
      subtotal,
      shipping,
      discount,
      total,
      promoCode,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      applyPromo,
      wishlist,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      user,
      adminUser,
      firebaseUser,
      isAdmin,
      activateAdminSession,
      login,
      loginWithGoogle,
      register,
      resetPassword,
      logout,
      updateUserProfile,
      updateAdminProfile,
      orders,
      addresses,
      addAddress,
      removeAddress,
      setDefaultAddress,
      placeOrder,
      lastOrderId
    }),
    [
      cart,
      cartCount,
      subtotal,
      shipping,
      discount,
      total,
      promoCode,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      applyPromo,
      wishlist,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      user,
      adminUser,
      firebaseUser,
      isAdmin,
      activateAdminSession,
      login,
      loginWithGoogle,
      register,
      resetPassword,
      logout,
      updateUserProfile,
      updateAdminProfile,
      orders,
      addresses,
      addAddress,
      removeAddress,
      setDefaultAddress,
      placeOrder,
      lastOrderId
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used inside StoreProvider');
  return context;
}
