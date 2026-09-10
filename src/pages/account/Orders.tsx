import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PackageIcon } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { formatPrice } from '../../utils/format';
import { EmptyState } from '../../components/ui/EmptyState';
import { cn } from '../../utils/format';

const tabs = ['All', 'Processing', 'Shipped', 'Delivered'] as const;

export function Orders() {
  const { orders } = useStore();
  const [tab, setTab] = useState<(typeof tabs)[number]>('All');
  const filtered = tab === 'All' ? orders : orders.filter((order) => order.status === tab);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-[20px] font-bold text-ink">Order History</h2>
        <div className="flex gap-1 rounded-full border border-line bg-white p-1">
          {tabs.map((option) =>
          <button
            key={option}
            type="button"
            onClick={() => setTab(option)}
            aria-pressed={tab === option}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors duration-200',
              tab === option ? 'bg-ink text-white' : 'text-charcoal hover:bg-canvas'
            )}>
            
              {option}
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ?
      <div className="mt-8">
          <EmptyState
          icon={PackageIcon}
          title={`No ${tab.toLowerCase()} orders`}
          description="When you place an order it will appear here with tracking and receipt details."
          actionLabel="Start shopping"
          actionTo="/shop" />
        
        </div> :

      <motion.ul variants={staggerContainer} initial="hidden" animate="visible" className="mt-6 space-y-4">
          {filtered.map((order) =>
        <motion.li key={order.id} variants={fadeUp} className="rounded-2xl border border-line bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[15px] font-bold text-ink">{order.id}</p>
                  <p className="mt-0.5 text-[12.5px] text-muted">Placed {order.date}</p>
                </div>
                <span
              className={cn(
                'rounded-full px-3 py-1 text-[11.5px] font-semibold',
                order.status === 'Delivered' ?
                'bg-emerald-50 text-emerald-600' :
                order.status === 'Shipped' ?
                'bg-blue-50 text-blue-600' :
                'bg-amber-50 text-amber-600'
              )}>
              
                  {order.status}
                </span>
                <p className="text-[16px] font-extrabold text-ink">{formatPrice(order.total)}</p>
                <Link
              to={`/account/order/${order.id}`}
              className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-semibold text-white transition-colors duration-200 hover:bg-charcoal">
              
                  View details
                </Link>
              </div>
              <p className="mt-3 border-t border-line pt-3 text-[13px] text-muted">
                {order.items.length} {order.items.length === 1 ? 'item' : 'items'} · Shipping to {order.address}
              </p>
            </motion.li>
        )}
        </motion.ul>
      }
    </div>);

}