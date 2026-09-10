import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HeartIcon, ShoppingBagIcon, Trash2Icon } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { EASE_SMOOTH } from '../animations/variants';
import { formatPrice } from '../utils/format';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { QuantitySelector } from '../components/ui/QuantitySelector';

function AnimatedAmount({ value, className }: {value: number;className?: string;}) {
  return (
    <span className={`relative inline-block overflow-hidden tabular-nums ${className ?? ''}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE_SMOOTH }}
          className="block">
          
          {formatPrice(value)}
        </motion.span>
      </AnimatePresence>
    </span>);

}

export function Cart() {
  const { cart, cartCount, subtotal, shipping, discount, total, updateQuantity, removeFromCart, toggleWishlist, applyPromo, promoCode } =
  useStore();
  const [promo, setPromo] = useState('');

  return (
    <>
      <PageHeader
        title="Your Cart"
        subtitle={cartCount > 0 ? `${cartCount} ${cartCount === 1 ? 'item' : 'items'} in your cart` : 'Your cart is waiting to be filled.'}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />
      

      <div className="mx-auto w-full max-w-shell px-4 py-10 sm:px-6">
        {cart.length === 0 ?
        <EmptyState
          icon={ShoppingBagIcon}
          title="Your cart is empty"
          description="Add a few products and they will show up here, saved between visits."
          actionLabel="Start shopping"
          actionTo="/shop"
          secondaryLabel="View wishlist"
          secondaryTo="/wishlist" /> :


        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section aria-label="Cart items" className="min-w-0">
              <div className="hidden grid-cols-[minmax(0,1fr)_120px_110px_90px] gap-4 border-b border-line pb-3 text-[12px] font-bold uppercase tracking-wider text-muted sm:grid">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span className="text-right">Subtotal</span>
              </div>

              <AnimatePresence initial={false}>
                {cart.map((item) =>
              <motion.article
                key={item.productId}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -24, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
                transition={{ duration: 0.28, ease: EASE_SMOOTH }}
                className="grid gap-4 overflow-hidden border-b border-line py-5 sm:grid-cols-[minmax(0,1fr)_120px_110px_90px] sm:items-center">
                
                    <div className="flex min-w-0 gap-4">
                      <Link to={`/product/${item.productId}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-canvas">
                        <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                      </Link>
                      <div className="min-w-0">
                        <h2 className="truncate text-[14.5px] font-semibold text-ink">
                          <Link to={`/product/${item.productId}`} className="transition-colors hover:text-accent">
                            {item.product.name}
                          </Link>
                        </h2>
                        <p className="mt-1 text-[12.5px] text-muted">
                          {[item.color, item.size].filter(Boolean).join(' · ') || item.product.brand}
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <button
                        type="button"
                        onClick={() => {
                          toggleWishlist(item.productId);
                          removeFromCart(item.productId);
                        }}
                        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted transition-colors hover:text-accent">
                        
                            <HeartIcon className="h-3.5 w-3.5" aria-hidden="true" />
                            Move to wishlist
                          </button>
                          <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted transition-colors hover:text-red-500">
                        
                            <Trash2Icon className="h-3.5 w-3.5" aria-hidden="true" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="text-[14px] font-medium text-charcoal">{formatPrice(item.product.price)}</p>
                    <QuantitySelector
                  value={item.quantity}
                  onChange={(value) => updateQuantity(item.productId, value)}
                  max={item.product.stock}
                  size="sm" />
                
                    <AnimatedAmount value={item.lineTotal} className="text-[15px] font-bold text-ink sm:text-right sm:w-full" />
                  </motion.article>
              )}
              </AnimatePresence>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button to="/shop" variant="secondary">
                  Continue shopping
                </Button>
              </div>
            </section>

            <aside aria-label="Order summary">
              <div className="sticky top-24 rounded-2xl border border-line bg-canvas p-6">
                <h2 className="text-[17px] font-bold text-ink">Order Summary</h2>

                <div className="mt-5 space-y-3 text-[14px]">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Subtotal</span>
                    <AnimatedAmount value={subtotal} className="font-semibold text-ink" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Shipping</span>
                    <span className="font-semibold text-ink">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Discount{promoCode ? ` (${promoCode})` : ''}</span>
                    <span className="font-semibold text-emerald-600">−{formatPrice(discount)}</span>
                  </div>
                </div>

                <form
                onSubmit={(event) => {
                  event.preventDefault();
                  applyPromo(promo);
                  setPromo('');
                }}
                className="mt-5 flex gap-2">
                
                  <input
                  value={promo}
                  onChange={(event) => setPromo(event.target.value)}
                  placeholder="Promo code"
                  aria-label="Promo code"
                  className="h-10 min-w-0 flex-1 rounded-full border border-line bg-white px-4 text-[13px] focus:border-accent focus:outline-none" />
                
                  <Button type="submit" variant="secondary" size="sm">
                    Apply
                  </Button>
                </form>
                <p className="mt-2 text-[11.5px] text-muted">Try NOVA10 for 10% off your first order.</p>

                <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                  <span className="text-[15px] font-bold text-ink">Total</span>
                  <AnimatedAmount value={total} className="text-[20px] font-extrabold text-ink" />
                </div>

                <div className="mt-5">
                  <Button to="/checkout" size="lg" fullWidth>
                    Proceed to Checkout
                  </Button>
                </div>
                <p className="mt-3 text-center text-[11.5px] text-muted">
                  {subtotal >= 50 ? 'Free shipping applied to this order.' : `Add ${formatPrice(50 - subtotal)} more for free shipping.`}
                </p>
              </div>
            </aside>
          </div>
        }
      </div>
    </>);

}