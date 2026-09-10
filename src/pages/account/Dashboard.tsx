import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartIcon, PackageIcon, TruckIcon } from 'lucide-react';
import { IMG } from '../../data/images';
import { useStore } from '../../contexts/StoreContext';
import { fadeUp, staggerContainer, viewportOnce } from '../../animations/variants';
import { formatPrice } from '../../utils/format';
import { AccountSkeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';

export function Dashboard() {
  const { user, orders, wishlist } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 400);
    return () => window.clearTimeout(timer);
  }, []);

  if (loading) return <AccountSkeleton />;

  const stats = [
  { label: 'Total orders', value: String(orders.length), Icon: PackageIcon },
  { label: 'In transit', value: String(orders.filter((order) => order.status !== 'Delivered').length), Icon: TruckIcon },
  { label: 'Wishlist items', value: String(wishlist.length), Icon: HeartIcon }];


  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.section variants={fadeUp} className="flex flex-wrap items-center gap-5 rounded-2xl border border-line bg-white p-6">
        <img src={user?.avatar || IMG.team} alt="" aria-hidden="true" className="h-16 w-16 rounded-full object-cover" />
        <div className="min-w-0">
          <h2 className="text-[20px] font-bold text-ink">Welcome back, {user?.name.split(' ')[0]}</h2>
          <p className="mt-1 text-[13.5px] text-muted">{user?.email} · {user?.phone}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button to="/account/profile" variant="secondary" size="sm">
            Edit profile
          </Button>
          <Button to="/shop" size="sm">
            Shop now
          </Button>
        </div>
      </motion.section>

      <motion.section variants={staggerContainer} className="grid gap-4 sm:grid-cols-3" aria-label="Order statistics">
        {stats.map(({ label, value, Icon }) =>
        <motion.div key={label} variants={fadeUp} className="rounded-2xl border border-line bg-white p-5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-canvas text-ink">
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <p className="mt-4 text-[26px] font-extrabold leading-none text-ink">{value}</p>
            <p className="mt-1.5 text-[13px] text-muted">{label}</p>
          </motion.div>
        )}
      </motion.section>

      <motion.section variants={fadeUp} className="rounded-2xl border border-line bg-white" aria-labelledby="recent-orders">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 id="recent-orders" className="text-[16px] font-bold text-ink">
            Recent orders
          </h2>
          <Link to="/account/orders" className="text-[13px] font-semibold text-accent hover:underline">
            View all
          </Link>
        </div>
        <ul className="divide-y divide-line">
          {orders.slice(0, 3).map((order) =>
          <li key={order.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-ink">{order.id}</p>
                <p className="text-[12.5px] text-muted">
                  {order.date} · {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <span
              className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${
              order.status === 'Delivered' ?
              'bg-emerald-50 text-emerald-600' :
              order.status === 'Shipped' ?
              'bg-blue-50 text-blue-600' :
              'bg-amber-50 text-amber-600'}`
              }>
              
                {order.status}
              </span>
              <p className="w-20 text-right text-[14px] font-bold text-ink">{formatPrice(order.total)}</p>
              <Link
              to={`/account/order/${order.id}`}
              className="rounded-full border border-line px-3.5 py-1.5 text-[12.5px] font-semibold text-charcoal transition-colors duration-200 hover:border-ink/30">
              
                Details
              </Link>
            </li>
          )}
        </ul>
      </motion.section>

      <motion.section variants={fadeUp} className="rounded-2xl border border-line bg-white p-6" aria-labelledby="activity">
        <h2 id="activity" className="text-[16px] font-bold text-ink">
          Recent activity
        </h2>
        <ol className="mt-4 space-y-4" aria-label="Activity timeline">
          {[
          { title: `Order ${orders[0]?.id ?? 'NT-48213'} placed`, detail: orders[0]?.date ?? 'Today' },
          { title: `${wishlist.length} items saved to your wishlist`, detail: 'Updated this week' },
          { title: 'Shipping address confirmed', detail: 'August 20, 2025' }].
          map((item) =>
          <li key={item.title} className="flex gap-3.5">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              <div>
                <p className="text-[13.5px] font-semibold text-ink">{item.title}</p>
                <p className="text-[12.5px] text-muted">{item.detail}</p>
              </div>
            </li>
          )}
        </ol>
      </motion.section>
    </motion.div>);

}