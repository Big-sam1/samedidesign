import { IMG } from './images';
import type { Category } from '../types';

export const categories: Category[] = [
  {
    slug: 'pants',
    name: 'Men pants',
    image: IMG.mensJeans,
    blurb: 'Jeans, relaxed fits, and big size pants tailored for men and boys.'
  },
  {
    slug: 't-shirts',
    name: 'Men Cotton t-shirts',
    image: IMG.heroFloating.first.topLeft,
    blurb: 'Pure soft cotton tees, oversized fits, and everyday essentials.'
  },
  {
    slug: 'shoes',
    name: 'Men shoes',
    image: IMG.mensShoes,
    blurb: 'Sneakers, high-tops, boots, and athletic footwear built for style.'
  },
  {
    slug: 'caps',
    name: 'Men caps',
    image: IMG.mensCaps,
    blurb: 'Signature caps, beanies, and headwear to complete your fit.'
  },
  {
    slug: 'hoodies-vests',
    name: 'Men Hoodies and Vest',
    image: IMG.mensHoodies,
    blurb: 'Warm hoodies, sleeveless vests, and heavyweight outerwear.'
  }
];


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