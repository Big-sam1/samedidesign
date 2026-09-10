import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HeartOffIcon, Trash2Icon } from 'lucide-react';
import { products } from '../data/products';
import { useStore } from '../contexts/StoreContext';
import { EASE_SMOOTH } from '../animations/variants';
import { formatPrice } from '../utils/format';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { RatingStars } from '../components/ui/RatingStars';

export function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart } = useStore();
  const items = wishlist.
  map((id) => products.find((product) => product.id === id)).
  filter((product): product is (typeof products)[number] => Boolean(product));

  return (
    <>
      <PageHeader
        title="My Wishlist"
        subtitle={items.length > 0 ? `${items.length} saved ${items.length === 1 ? 'item' : 'items'}` : 'Save products to compare them later.'}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
      

      <div className="mx-auto w-full max-w-shell px-4 py-10 sm:px-6">
        {items.length === 0 ?
        <EmptyState
          icon={HeartOffIcon}
          title="Your wishlist is empty"
          description="Tap the heart on any product to save it here. Your list stays put between visits."
          actionLabel="Browse products"
          actionTo="/shop"
          secondaryLabel="New arrivals"
          secondaryTo="/new-arrivals" /> :


        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence initial={false}>
              {items.map((product) =>
            <motion.article
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.26, ease: EASE_SMOOTH }}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow duration-300 hover:shadow-lift">
              
                  <div className="relative overflow-hidden bg-canvas">
                    <Link to={`/product/${product.id}`} className="block aspect-square">
                      <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-smooth group-hover:scale-105" />
                  
                    </Link>
                    <button
                  type="button"
                  onClick={() => removeFromWishlist(product.id)}
                  aria-label={`Remove ${product.name} from wishlist`}
                  className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-line bg-white/95 text-charcoal backdrop-blur transition-colors duration-200 hover:text-red-500">
                  
                      <Trash2Icon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h2 className="line-clamp-2 text-[14px] font-semibold leading-snug text-ink">
                      <Link to={`/product/${product.id}`} className="transition-colors hover:text-accent">
                        {product.name}
                      </Link>
                    </h2>
                    <p className="mt-1.5 text-[15px] font-bold text-ink">{formatPrice(product.price)}</p>
                    <RatingStars rating={product.rating} reviews={product.reviews} className="mt-1.5" />
                    <div className="mt-auto pt-4">
                      <Button onClick={() => addToCart(product.id, 1, product.colors[0]?.name, product.sizes[0])} fullWidth size="sm">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </motion.article>
            )}
            </AnimatePresence>
          </div>
        }
      </div>
    </>);

}