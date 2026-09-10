import { IMG } from './images';
import type { Category } from '../types';

export const categories: Category[] = [
{
  slug: 'fashion',
  name: 'Men Big Size Fashion',
  image: IMG.fashion,
  blurb: 'Oversized essentials, big size fits and layering pieces built to last.'
},
{
  slug: 'electronics',
  name: 'Men Jeans pants',
  image: IMG.mensJeans,
  blurb: 'Relaxed denim fits for everyday wear.'
},
{
  slug: 'beauty',
  name: 'Men Cotton t-shirts',
  image: IMG.heroFloating.first.topLeft,
  blurb: 'Comfortable cotton essentials for everyday style.'
},
{
  slug: 'fitness',
  name: 'Men & Boys Shoes',
  image: IMG.mensShoes,
  blurb: 'Everyday sneakers, boots and trainers for men and boys.'
},
{
  slug: 'home-decor',
  name: 'Men Caps',
  image: IMG.mensCaps,
  blurb: 'Classic caps to finish your everyday look.'
},
{
  slug: 'accessories',
  name: 'Men Hoodies & Vests',
  image: IMG.mensHoodies,
  blurb: 'Layering essentials for relaxed, comfortable outfits.'
}];


export const brands: string[] = ['Nova', 'Nike', 'Apple', 'Sony', 'Samsung', 'Aura', 'Lumen'];

export const filterColors: {name: string;hex: string;}[] = [
{ name: 'Black', hex: '#1A1A1A' },
{ name: 'White', hex: '#FFFFFF' },
{ name: 'Sand', hex: '#E7DAC9' },
{ name: 'Orange', hex: '#F4551D' },
{ name: 'Olive', hex: '#6B7250' },
{ name: 'Slate', hex: '#64748B' },
{ name: 'Gold', hex: '#D6B15F' }];


export const filterSizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'One Size'];