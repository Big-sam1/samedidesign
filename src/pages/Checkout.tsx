import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppleIcon, BanknoteIcon, CreditCardIcon, ShoppingBagIcon, WalletIcon } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { EASE_SMOOTH } from '../animations/variants';
import { formatPrice } from '../utils/format';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { PageHeader } from '../components/ui/PageHeader';
import { cn } from '../utils/format';

type Fields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postal: string;
};

const emptyFields: Fields = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  postal: ''
};

const paymentMethods = [
{ id: 'card', label: 'Credit / Debit Card', detail: 'Visa, Mastercard, Amex', Icon: CreditCardIcon },
{ id: 'mtn', label: 'MTN Code', detail: 'Pay with an MTN mobile money code', Icon: WalletIcon },
{ id: 'airtel', label: 'Airtel Code', detail: 'Pay with an Airtel mobile money code', Icon: AppleIcon },
{ id: 'cod', label: 'Cash on Delivery', detail: 'Pay the courier on arrival', Icon: BanknoteIcon }];


export function Checkout() {
  const navigate = useNavigate();
  const { cart, subtotal, shipping, discount, total, placeOrder } = useStore();
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [payment, setPayment] = useState('card');
  const [submitting, setSubmitting] = useState(false);

  const setField = (key: keyof Fields) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Fields> = {};
    if (!fields.firstName.trim()) next.firstName = 'First name is required';
    if (!fields.lastName.trim()) next.lastName = 'Last name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) next.email = 'Enter a valid email address';
    if (fields.phone.trim().length < 7) next.phone = 'Enter a valid phone number';
    if (!fields.address.trim()) next.address = 'Address is required';
    if (!fields.city.trim()) next.city = 'City is required';
    if (!fields.country.trim()) next.country = 'Country is required';
    if (!fields.postal.trim()) next.postal = 'Street address is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const orderId = placeOrder();

    // WhatsApp web links support text only; product images remain visible in the order UI.
    const itemsText = cart
      .map((item, idx) => {
        const sizeInfo = item.size ? ` [Size: ${item.size}]` : '';
        const colorInfo = item.color ? ` [Color: ${item.color}]` : '';
        return `${idx + 1}. *${item.product.name}* (Qty: ${item.quantity})${sizeInfo}${colorInfo}\n   💰 Price: ${formatPrice(item.lineTotal)}`;
      })
      .join('\n\n');

    const message = `Hello Samedi design! 👋\n\nWelcome *${fields.firstName} ${fields.lastName}* to Samedi design!\nI would like to place an order from your store:\n\n📋 *ORDER #${orderId}*\n━━━━━━━━━━━━━━━━━━━━\n${itemsText}\n━━━━━━━━━━━━━━━━━━━━\n💵 *Subtotal:* ${formatPrice(subtotal)}\n🚚 *Shipping:* ${shipping === 0 ? 'Free' : formatPrice(shipping)}${discount > 0 ? `\n🏷️ *Discount:* -${formatPrice(discount)}` : ''}\n💳 *Total Amount:* ${formatPrice(total)}\n\n📍 *Delivery Details:*\n• Customer: ${fields.firstName} ${fields.lastName}\n• Phone: ${fields.phone}\n• Email: ${fields.email}\n• Address: ${fields.address}, ${fields.city}, ${fields.country}\n• Payment Method: ${payment.toUpperCase()}\n\nThank you for shopping with Samedi design — First SHOP in Town Bigsize Store!`;

    const shareOrderWithImages = async (): Promise<boolean> => {
      if (!navigator.share || !navigator.canShare) return false;

      try {
        const imageFiles = await Promise.all(
          cart.map(async (item) => {
            const imageUrl = item.product.images[0].startsWith('http')
              ? item.product.images[0]
              : `${window.location.origin}${item.product.images[0]}`;
            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error('Image download failed');
            const blob = await response.blob();
            const safeName = item.product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return new File([blob], `${safeName || 'product'}.jpg`, { type: blob.type || 'image/jpeg' });
          })
        );

        if (!navigator.canShare({ files: imageFiles })) return false;
        await navigator.share({
          title: `Samedi design order ${orderId}`,
          text: message,
          files: imageFiles
        });
        return true;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return true;
        return false;
      }
    };

    const whatsappUrl = `https://wa.me/250784264931?text=${encodeURIComponent(message)}`;
    const sharedWithImages = await shareOrderWithImages();

    window.setTimeout(() => {
      setSubmitting(false);
      if (!sharedWithImages) window.open(whatsappUrl, '_blank');
      navigate('/order-success');
    }, 600);
  };

  if (cart.length === 0) {
    return (
      <>
        <PageHeader title="Checkout" crumbs={[{ label: 'Home', to: '/' }, { label: 'Checkout' }]} />
        <div className="mx-auto w-full max-w-shell px-4 py-16 sm:px-6">
          <EmptyState
            icon={ShoppingBagIcon}
            title="Nothing to check out yet"
            description="Your cart is empty. Add a product and come back to complete your order."
            actionLabel="Shop products"
            actionTo="/shop" />
          
        </div>
      </>);

  }

  return (
    <>
      <PageHeader
        title="Checkout"
        subtitle="Complete your details and place the order — it takes under a minute."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
      

      <div className="mx-auto w-full max-w-shell px-4 py-10 sm:px-6">
        <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_368px]" noValidate>
          <div className="min-w-0 space-y-6">
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_SMOOTH }}
              className="rounded-2xl border border-line bg-white p-6"
              aria-labelledby="contact-heading">
              
              <h2 id="contact-heading" className="text-[17px] font-bold text-ink">
                Contact Information
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Input label="First Name" name="firstName" value={fields.firstName} onChange={setField('firstName')} error={errors.firstName} placeholder="Samuel" />
                <Input label="Last Name" name="lastName" value={fields.lastName} onChange={setField('lastName')} error={errors.lastName} placeholder="Mugisha" />
                <Input label="Email Address" name="email" type="email" value={fields.email} onChange={setField('email')} error={errors.email} placeholder="you@email.com" />
                <Input label="Phone" name="phone" type="tel" value={fields.phone} onChange={setField('phone')} error={errors.phone} placeholder="+256 700 123 456" />
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_SMOOTH, delay: 0.06 }}
              className="rounded-2xl border border-line bg-white p-6"
              aria-labelledby="shipping-heading">
              
              <h2 id="shipping-heading" className="text-[17px] font-bold text-ink">
                Shipping Information
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input label="Address" name="address" value={fields.address} onChange={setField('address')} error={errors.address} placeholder="12 Rosewood Avenue" />
                </div>
                <Input label="City" name="city" value={fields.city} onChange={setField('city')} error={errors.city} placeholder="Kampala" />
                <Input label="Country" name="country" value={fields.country} onChange={setField('country')} error={errors.country} placeholder="Uganda" />
                <Input label="Street Address" name="postal" value={fields.postal} onChange={setField('postal')} error={errors.postal} placeholder="12 Rosewood Avenue" />
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_SMOOTH, delay: 0.12 }}
              className="rounded-2xl border border-line bg-white p-6"
              aria-labelledby="payment-heading">
              
              <h2 id="payment-heading" className="text-[17px] font-bold text-ink">
                Payment Method
              </h2>
              <div className="mt-5 space-y-2.5" role="radiogroup" aria-labelledby="payment-heading">
                {paymentMethods.map(({ id, label, detail, Icon }) =>
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={payment === id}
                  onClick={() => setPayment(id)}
                  className={cn(
                    'flex w-full items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left transition-colors duration-200',
                    payment === id ? 'border-accent bg-accent-soft' : 'border-line hover:border-ink/25'
                  )}>
                  
                    <span
                    className={cn(
                      'grid h-5 w-5 shrink-0 place-items-center rounded-full border-2',
                      payment === id ? 'border-accent' : 'border-line'
                    )}>
                    
                      {payment === id && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
                    </span>
                    <Icon className="h-[18px] w-[18px] shrink-0 text-charcoal" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block text-[14px] font-semibold text-ink">{label}</span>
                      <span className="block text-[12.5px] text-muted">{detail}</span>
                    </span>
                  </button>
                )}
              </div>

              {payment === 'card' &&
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.25, ease: EASE_SMOOTH }}
                className="mt-5 grid gap-4 overflow-hidden sm:grid-cols-2">
                
                  <div className="sm:col-span-2">
                    <Input label="Card Number" name="cardNumber" placeholder="4242 4242 4242 4242" inputMode="numeric" />
                  </div>
                  <Input label="Expiry" name="cardExpiry" placeholder="MM / YY" />
                  <Input label="CVC" name="cardCvc" placeholder="123" inputMode="numeric" />
                </motion.div>
              }
            </motion.section>
          </div>

          <aside aria-label="Order summary">
            <div className="sticky top-24 rounded-2xl border border-line bg-canvas p-6">
              <h2 className="text-[17px] font-bold text-ink">Order Summary</h2>

              <ul className="mt-5 space-y-4">
                {cart.map((item) =>
                <li key={item.productId} className="flex items-center gap-3">
                    <img src={item.product.images[0]} alt={item.product.name} className="h-14 w-14 shrink-0 rounded-xl bg-white object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-semibold text-ink">{item.product.name}</p>
                      <p className="text-[12px] text-muted">Qty {item.quantity}</p>
                    </div>
                    <p className="text-[13.5px] font-bold text-ink">{formatPrice(item.lineTotal)}</p>
                  </li>
                )}
              </ul>

              <div className="mt-5 space-y-3 border-t border-line pt-4 text-[14px]">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Shipping</span>
                  <span className="font-semibold text-ink">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                {discount > 0 &&
                <div className="flex justify-between">
                    <span className="text-muted">Discount</span>
                    <span className="font-semibold text-emerald-600">−{formatPrice(discount)}</span>
                  </div>
                }
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                <span className="text-[15px] font-bold text-ink">Total</span>
                <span className="text-[20px] font-extrabold text-ink">{formatPrice(total)}</span>
              </div>

              <div className="mt-5">
                <Button type="submit" size="lg" fullWidth disabled={submitting}>
                  {submitting ? 'Placing order…' : 'Place Order'}
                </Button>
              </div>
              <p className="mt-3 text-center text-[11.5px] text-muted">
                By placing this order you agree to our terms and return policy.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </>);

}