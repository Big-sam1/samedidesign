import { IMG } from './images';
import type { Address, Order, Testimonial } from '../types';

export const announcements: string[] = [
  '👕 We sell clothes · First SHOP in Town Bigsize store Shopping',
  '📍 Location: Nyamirambo Biryogo · Kigali',
  '📞 Call & WhatsApp: 0784264931 · Order Now'
];


export const benefits: {title: string;detail: string;icon: 'truck' | 'lock' | 'refresh' | 'headset';}[] = [
{ title: 'Free Shipping', detail: 'On orders over $50', icon: 'truck' },
{ title: 'Secure Payments', detail: '100% secure checkout', icon: 'lock' },
{ title: 'Easy Returns', detail: '30-day return policy', icon: 'refresh' },
{ title: '24/7 Support', detail: 'Always here to help', icon: 'headset' }];


export const trustStrip: {title: string;detail: string;}[] = [
{ title: 'Premium Quality', detail: 'Made with the finest materials' },
{ title: 'Fast Delivery', detail: 'Quick and reliable shipping' },
{ title: 'Secure Checkout', detail: 'Your data is protected' },
{ title: 'Customer Satisfaction', detail: '100% satisfaction guarantee' }];


export const testimonials: Testimonial[] = [
{
  name: 'Elena Katheline',
  role: 'Verified buyer · Berlin',
  quote:
  'The hoodie arrived in three days and the fabric weight is exactly what the description promised. It has replaced everything else in my rotation.',
  rating: 5,
  avatar: IMG.avatar1
},
{
  name: 'KEZA Daniella',
  role: 'Verified buyer · Singapore',
  quote:
  'I returned a pair of trainers for a half size up and it took under two minutes. That is the part most stores get wrong.',
  rating: 5,
  avatar: IMG.avatar2
},
{
  name: 'NTARE James',
  role: 'Verified buyer · Samede design',
  quote:
  'Packaging was minimal and recyclable, and the serum was sealed properly. Small details, but they are why I reorder here.',
  rating: 4,
  avatar: IMG.avatar3
},
{
  name: 'Big Sam',
  role: 'DMD  · Founder & CEO of Dream Maker Developers',
  quote:
  'The product photos actually match what shows up. I ordered the watch expecting to send it back and it has not left my wrist since.',
  rating: 5,
  avatar: IMG.avatar4
},
{
  name: 'Elia IRANZI',
  role: 'DMD · Marketing promoter',
  quote:
  'Samedi Design Shop — Muri abambere mutanga imyenda umuntu yambara akaberwa atasanga ahandi!',
  rating: 5,
  avatar: IMG.avatar5
}];


export const companyStats: {value: string;label: string;}[] = [
{ value: '10K+', label: 'Happy customers' },
{ value: '500+', label: 'Products curated' },
{ value: '24/7', label: 'Support coverage' },
{ value: '38', label: 'Countries shipped' }];


export const team: {name: string;role: string;}[] = [
{ name: 'Samuel Mugisha', role: 'Founder & CEO' },
{ name: 'Amelia Hart', role: 'Head of Buying' },
{ name: 'Daniel Okoye', role: 'Head of Product' },
{ name: 'Priya Raman', role: 'Customer Experience' }];


export const mockOrders: Order[] = [
  {
    id: 'SD-48213',
    date: 'August 22, 2025',
    status: 'Delivered',
    total: 189.98,
    items: [
      { productId: 'air-max-270', quantity: 1 },
      { productId: 'stainless-steel-bottle', quantity: 1 }
    ],
    address: 'Nyamirambo Biryogo, Kigali, Rwanda'
  },
  {
    id: 'SD-48044',
    date: 'August 9, 2025',
    status: 'Shipped',
    total: 349.99,
    items: [{ productId: 'sony-wh-1000xm5', quantity: 1 }],
    address: 'Nyamirambo Biryogo, Kigali, Rwanda'
  },
  {
    id: 'SD-47901',
    date: 'July 30, 2025',
    status: 'Processing',
    total: 157.98,
    items: [
      { productId: 'essential-hoodie', quantity: 1 },
      { productId: 'vitamin-c-serum', quantity: 1 },
      { productId: 'ribbed-beanie', quantity: 1 }
    ],
    address: 'KN 20 Ave, Nyamirambo Biryogo, Kigali, Rwanda'
  }
];

export const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    label: 'Home',
    name: 'Samuel Mugisha',
    street: 'Nyamirambo Biryogo',
    city: 'Kigali',
    postal: '00000',
    country: 'Rwanda',
    isDefault: true
  },
  {
    id: 'addr-2',
    label: 'Store & Shop',
    name: 'Samedi design',
    street: 'KN 20 Ave, Biryogo',
    city: 'Kigali',
    postal: '00000',
    country: 'Rwanda',
    isDefault: false
  }
];


export const footerColumns: {heading: string;links: {label: string;to: string;}[];}[] = [
{
  heading: 'Shop',
  links: [
  { label: 'All Products', to: '/shop' },
  { label: 'New Arrivals', to: '/new-arrivals' },
  { label: 'Best Sellers', to: '/best-sellers' },
  { label: 'Categories', to: '/categories' }]

},
{
  heading: 'Company',
  links: [
    { label: 'Store Location', to: '/contact' },
    { label: 'Blog & News', to: '/blog' },
    { label: 'Contact Us', to: '/contact' },
    { label: 'WhatsApp Order', to: '/contact' }
  ]
},
{
  heading: 'Customer Service',
  links: [
    { label: 'My Account', to: '/account' },
    { label: 'Order History', to: '/account/orders' },
    { label: 'Wishlist', to: '/wishlist' },
    { label: 'Shipping & Delivery', to: '/contact' }
  ]
},
{
  heading: 'Resources',
  links: [
    { label: 'Size Guide', to: '/contact' },
    { label: 'Track Order', to: '/account/orders' },
    { label: 'Biryogo Store Map', to: '/contact' },
    { label: 'FAQs', to: '/contact' }
  ]

}];