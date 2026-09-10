import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2Icon, CircleIcon, PackageXIcon } from 'lucide-react';
import { products } from '../../data/products';
import { useStore } from '../../contexts/StoreContext';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { formatPrice } from '../../utils/format';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';

const timeline = ['Order placed', 'Payment confirmed', 'Shipped', 'Out for delivery', 'Delivered'];

export function OrderDetail() {
  const { id = '' } = useParams();
  const { orders } = useStore();
  const order = orders.find((item) => item.id === id);

  if (!order) {
    return (
      <EmptyState
        icon={PackageXIcon}
        title="Order not found"
        description="We could not find that order number on your account."
        actionLabel="All orders"
        actionTo="/account/orders" />);


  }

  const reached = order.status === 'Delivered' ? 5 : order.status === 'Shipped' ? 3 : 2;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold text-ink">Order {order.id}</h2>
          <p className="mt-1 text-[13.5px] text-muted">Placed {order.date} · {order.status}</p>
        </div>
        <div className="flex gap-2">
          <Button to="/account/orders" variant="secondary" size="sm">
            Back to orders
          </Button>
          <Button to="/contact" size="sm">
            Get help
          </Button>
        </div>
      </motion.div>

      <motion.section variants={fadeUp} className="rounded-2xl border border-line bg-white p-6" aria-label="Delivery progress">
        <h3 className="text-[15px] font-bold text-ink">Delivery progress</h3>
        <ol className="mt-5 space-y-4">
          {timeline.map((step, index) => {
            const done = index < reached;
            return (
              <li key={step} className="flex items-center gap-3">
                {done ?
                <CheckCircle2Icon className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" /> :

                <CircleIcon className="h-5 w-5 shrink-0 text-line" aria-hidden="true" />
                }
                <span className={done ? 'text-[13.5px] font-semibold text-ink' : 'text-[13.5px] text-muted'}>{step}</span>
              </li>);

          })}
        </ol>
      </motion.section>

      <motion.section variants={fadeUp} className="rounded-2xl border border-line bg-white" aria-label="Items in this order">
        <h3 className="border-b border-line px-6 py-4 text-[15px] font-bold text-ink">Items</h3>
        <ul className="divide-y divide-line">
          {order.items.map((line) => {
            const product = products.find((item) => item.id === line.productId);
            if (!product) return null;
            return (
              <li key={line.productId} className="flex items-center gap-4 px-6 py-4">
                <Link to={`/product/${product.id}`} className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-canvas">
                  <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-ink">{product.name}</p>
                  <p className="text-[12.5px] text-muted">Qty {line.quantity} · {product.brand}</p>
                </div>
                <p className="text-[14px] font-bold text-ink">{formatPrice(product.price * line.quantity)}</p>
              </li>);

          })}
        </ul>
        <div className="flex items-center justify-between border-t border-line px-6 py-4">
          <span className="text-[15px] font-bold text-ink">Order total</span>
          <span className="text-[18px] font-extrabold text-ink">{formatPrice(order.total)}</span>
        </div>
      </motion.section>

      <motion.section variants={fadeUp} className="rounded-2xl border border-line bg-white p-6" aria-label="Shipping address">
        <h3 className="text-[15px] font-bold text-ink">Shipping address</h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{order.address}</p>
      </motion.section>
    </motion.div>);

}