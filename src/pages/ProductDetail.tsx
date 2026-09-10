import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckIcon, PackageXIcon, RefreshCwIcon, ShieldCheckIcon, ShoppingBagIcon, TruckIcon } from 'lucide-react';
import { products } from '../data/products';
import { reviews, specifications } from '../data/reviews';
import { useData } from '../contexts/DataContext';
import { useStore } from '../contexts/StoreContext';
import { EASE_SMOOTH, staggerContainer, viewportOnce } from '../animations/variants';
import { discountPercent, formatPrice } from '../utils/format';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ProductDetailSkeleton } from '../components/ui/Skeleton';
import { QuantitySelector } from '../components/ui/QuantitySelector';
import { RatingStars } from '../components/ui/RatingStars';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Tabs } from '../components/ui/Tabs';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductGrid } from '../components/product/ProductGrid';
import { ReviewCard } from '../components/product/ReviewCard';
import { WishlistButton } from '../components/product/WishlistButton';
import { cn } from '../utils/format';

const assurances = [
{ Icon: TruckIcon, title: 'Free Shipping', detail: 'On orders over $50' },
{ Icon: RefreshCwIcon, title: '30 Days Return', detail: 'No questions asked' },
{ Icon: ShieldCheckIcon, title: 'Secure Payment', detail: 'Encrypted checkout' }];


export function ProductDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useStore();
  const { products } = useData();
  const product = products.find((item) => item.id === id);

  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [tab, setTab] = useState('description');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setQuantity(1);
    setTab('description');
    setColor(product?.colors[0]?.name ?? '');
    setSize(product?.sizes[0] ?? '');
    const timer = window.setTimeout(() => setLoading(false), 380);
    return () => window.clearTimeout(timer);
  }, [id, product]);

  const related = useMemo(
    () => products.filter((item) => item.category === product?.category && item.id !== product?.id).slice(0, 4),
    [product]
  );

  if (!product) {
    return (
      <div className="mx-auto w-full max-w-shell px-4 py-20 sm:px-6">
        <EmptyState
          icon={PackageXIcon}
          title="Product not found"
          description="This product may have sold out or been retired. Browse the full catalogue for something similar."
          actionLabel="Shop all products"
          actionTo="/shop"
          secondaryLabel="Back home"
          secondaryTo="/" />
        
      </div>);

  }

  const off = discountPercent(product.price, product.oldPrice);

  const handleAdd = () => {
    addToCart(product.id, quantity, color, size);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity, color, size);
    navigate('/checkout');
  };

  return (
    <div className="mx-auto w-full max-w-shell px-4 py-8 sm:px-6">
      <Breadcrumbs
        items={[
        { label: 'Home', to: '/' },
        { label: 'Shop', to: '/shop' },
        { label: product.name }]
        } />
      

      {loading ?
      <div className="mt-8">
          <ProductDetailSkeleton />
        </div> :

      <div className="mt-7 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE_SMOOTH }}>
            <ProductGallery images={product.images} name={product.name} />
          </motion.div>

          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_SMOOTH, delay: 0.06 }}>
          
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">{product.brand}</p>
            <h1 className="mt-2 text-[28px] font-extrabold leading-tight text-ink sm:text-[34px]">{product.name}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-4">
              <RatingStars rating={product.rating} size="md" />
              <span className="text-[13px] text-muted">
                {product.rating.toFixed(1)} · {product.reviews} reviews
              </span>
              <span
              className={cn(
                'rounded-full px-2.5 py-1 text-[11.5px] font-semibold',
                product.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              )}>
              
                {product.stock > 10 ? 'In stock' : `Only ${product.stock} left`}
              </span>
            </div>

            <div className="mt-5 flex items-end gap-3">
              <span className="text-[30px] font-extrabold text-ink">{formatPrice(product.price)}</span>
              {product.oldPrice && <span className="pb-1 text-[15px] text-muted line-through">{formatPrice(product.oldPrice)}</span>}
              {off && <span className="mb-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-bold text-accent">Save {off}%</span>}
            </div>

            <p className="mt-5 max-w-xl text-[14.5px] leading-relaxed text-muted">{product.description}</p>

            <div className="mt-7 space-y-6">
              <div>
                <p className="mb-2.5 text-[13px] font-bold text-ink">
                  Color: <span className="font-medium text-muted">{color}</span>
                </p>
                <div className="flex gap-2.5">
                  {product.colors.map((option) =>
                <button
                  key={option.name}
                  type="button"
                  onClick={() => setColor(option.name)}
                  aria-label={option.name}
                  aria-pressed={color === option.name}
                  className={cn(
                    'h-9 w-9 rounded-full border-2 transition-transform duration-200 ease-smooth hover:scale-105',
                    color === option.name ? 'border-accent' : 'border-line'
                  )}
                  style={{ backgroundColor: option.hex }} />

                )}
                </div>
              </div>

              <div>
                <p className="mb-2.5 text-[13px] font-bold text-ink">
                  Size: <span className="font-medium text-muted">{size}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((option) =>
                <button
                  key={option}
                  type="button"
                  onClick={() => setSize(option)}
                  aria-pressed={size === option}
                  className={cn(
                    'min-w-[52px] rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors duration-200',
                    size === option ? 'border-accent bg-accent-soft text-accent' : 'border-line text-charcoal hover:border-ink/30'
                  )}>
                  
                      {option}
                    </button>
                )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock} />
                <Button onClick={handleAdd} size="lg" className="min-w-[176px]">
                  {added ? <CheckIcon className="h-4 w-4" aria-hidden="true" /> : <ShoppingBagIcon className="h-4 w-4" aria-hidden="true" />}
                  {added ? 'Added to bag' : 'Add to Cart'}
                </Button>
                <Button onClick={handleBuyNow} variant="dark" size="lg">
                  Buy Now
                </Button>
                <WishlistButton productId={product.id} size="md" />
              </div>
            </div>

            <div className="mt-8 grid gap-4 rounded-2xl border border-line bg-canvas p-5 sm:grid-cols-3">
              {assurances.map(({ Icon, title, detail }) =>
            <div key={title} className="flex items-start gap-2.5">
                  <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <p className="text-[13px] font-semibold text-ink">{title}</p>
                    <p className="text-[12px] text-muted">{detail}</p>
                  </div>
                </div>
            )}
            </div>
          </motion.div>
        </div>
      }

      {!loading &&
      <>
          <section className="mt-16" aria-label="Product information">
            <Tabs
            activeId={tab}
            onChange={setTab}
            tabs={[
            {
              id: 'description',
              label: 'Description',
              content:
              <div className="max-w-3xl space-y-4 text-[14.5px] leading-relaxed text-muted">
                      <p>{product.description}</p>
                      <p>
                        Every Samedi design order is checked by hand before it ships. If the fit or finish is not what you
                        expected, returns are hassle-free within 30 days and our team in Nyamirambo Biryogo is always available on Call &amp; WhatsApp (0784264931).
                      </p>
                      <ul className="ml-5 list-disc space-y-1.5">
                        <li>Designed and quality-checked in-house</li>
                        <li>Available in {product.colors.length} colourways and {product.sizes.length} sizes</li>
                        <li>Ships from the closest regional warehouse to reduce transit time</li>
                      </ul>
                    </div>

            },
            {
              id: 'specifications',
              label: 'Specifications',
              content:
              <dl className="max-w-3xl divide-y divide-line rounded-2xl border border-line">
                      {specifications.map((spec) =>
                <div key={spec.label} className="flex flex-wrap gap-2 px-5 py-3.5">
                          <dt className="w-40 text-[13px] font-semibold text-ink">{spec.label}</dt>
                          <dd className="flex-1 text-[13.5px] text-muted">{spec.value}</dd>
                        </div>
                )}
                    </dl>

            },
            {
              id: 'reviews',
              label: `Reviews (${product.reviews})`,
              content:
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                className="grid max-w-4xl gap-4 md:grid-cols-2">
                
                      {reviews.map((review) =>
                <ReviewCard key={review.name} review={review} />
                )}
                    </motion.div>

            }]
            } />
          
          </section>

          {related.length > 0 &&
        <section className="mt-16" aria-labelledby="related-heading">
              <div id="related-heading">
                <SectionHeading title="You may also like" subtitle={`More from ${product.category.replace('-', ' ')}`} linkLabel="Shop all" linkTo="/shop" />
              </div>
              <ProductGrid products={related} />
            </section>
        }

          <div className="mt-10 text-center text-[13px] text-muted">
            Looking for something else?{' '}
            <Link to="/shop" className="font-semibold text-accent hover:underline">
              Browse the full catalogue
            </Link>
          </div>
        </>
      }
    </div>);

}