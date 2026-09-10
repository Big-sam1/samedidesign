export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  images: string[];
  description: string;
  colors: ColorOption[];
  sizes: string[];
  badge?: 'New' | 'Sale' | 'Bestseller';
  stock: number;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface Category {
  slug: string;
  name: string;
  image: string;
  blurb: string;
}

export interface CartLine {
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
}

export interface WishlistEntry {
  productId: string;
}

export interface AccountUser {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  city?: string;
  country?: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Delivered' | 'Shipped' | 'Processing';
  total: number;
  items: {productId: string;quantity: number;}[];
  address: string;
}

export interface Address {
  id: string;
  label: string;
  name: string;
  street: string;
  city: string;
  postal: string;
  country: string;
  isDefault: boolean;
}

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  excerpt: string;
  body: string[];
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar: string;
}

export type SortKey = 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'rating';