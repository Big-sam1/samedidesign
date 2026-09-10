import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, PackageIcon, TruckIcon } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { EASE_SMOOTH } from '../animations/variants';
import { formatPrice } from '../utils/format';
import { Button } from '../components/ui/Button';

export function OrderSuccess() {
  const { orders, lastOrderId } = useStore();
  const order = orders.find((item) => item.id === lastOrderId) ?? orders[0];

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-20">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE_SMOOTH }}
        className="relative grid h-24 w-24 place-items-center rounded-full bg-accent-soft">
        
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-accent/40"
          initial={{ scale: 0.9, opacity: 0.8 }}
          animate={{ scale: 1.25, opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut', repeat: 2 }} />
        
        <motion.span
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.16, type: 'spring', stiffness: 460, damping: 22 }}
          className="grid h-14 w-14 place-items-center rounded-full bg-accent text-white">
          
          <CheckIcon className="h-7 w-7" strokeWidth={3} aria-hidden="true" />
        </motion.span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_SMOOTH, delay: 0.1 }}
        className="mt-8 text-[30px] font-extrabold leading-tight text-ink sm:text-[38px]">
        
        Order Placed Successfully!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_SMOOTH, delay: 0.16 }}
        className="mt-3 max-w-md text-[14.5px] leading-relaxed text-muted">
        
        Thank you for shopping with Samedi design. A confirmation message with your receipt and tracking details is on its
        way.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_SMOOTH, delay: 0.22 }}
        className="mt-9 w-full rounded-2xl border border-line bg-white p-6 text-left">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wider text-muted">Order number</p>
            <p className="mt-1 text-[17px] font-bold text-ink">{order?.id ?? 'NT-48213'}</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-canvas px-3 py-1.5">
            <TruckIcon className="h-4 w-4 text-accent" aria-hidden="true" />
            <span className="text-[12.5px] font-semibold text-ink">Estimated delivery: 3–5 business days</span>
          </div>
        </div>

        {order &&
        <ul className="mt-4 space-y-3">
            {order.items.map((item) =>
          <li key={item.productId} className="flex items-center justify-between gap-3 text-[13.5px]">
                <span className="flex items-center gap-2 text-charcoal">
                  <PackageIcon className="h-4 w-4 text-muted" aria-hidden="true" />
                  {item.productId.replace(/-/g, ' ')}
                </span>
                <span className="font-semibold text-ink">× {item.quantity}</span>
              </li>
          )}
          </ul>
        }

        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <span className="text-[14px] font-bold text-ink">Order total</span>
          <span className="text-[18px] font-extrabold text-ink">{formatPrice(order?.total ?? 0)}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_SMOOTH, delay: 0.28 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3">
        
        <Button to={`/account/order/${order?.id ?? 'NT-48213'}`} size="lg">
          Track Order
        </Button>
        <Button to="/shop" variant="secondary" size="lg">
          Continue Shopping
        </Button>
      </motion.div>
    </div>);

}