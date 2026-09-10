import type { Review } from '../components/product/ReviewCard';

export const reviews: Review[] = [
{
  name: 'Elena Fischer',
  date: 'August 18, 2025',
  rating: 5,
  title: 'Exactly as described',
  body: 'The fabric weight and finish match the product photos closely. Shipping took three days to Berlin and the packaging was minimal.'
},
{
  name: 'Marcus Lee',
  date: 'August 2, 2025',
  rating: 4,
  title: 'Great, sizing runs slightly large',
  body: 'Quality is excellent for the price. I went a size down after the first order and the fit is now perfect.'
},
{
  name: 'Aisha Bello',
  date: 'July 21, 2025',
  rating: 5,
  title: 'Second one I have bought',
  body: 'Bought one earlier this year and it has held up through constant use, so I ordered a second in another colour.'
}];


export const specifications: {label: string;value: string;}[] = [
{ label: 'Materials', value: 'Premium, responsibly sourced' },
{ label: 'Care', value: 'Machine wash cold, dry flat' },
{ label: 'Warranty', value: '2 years against manufacturing defects' },
{ label: 'Shipping', value: 'Free worldwide over $50, 2–5 business days' },
{ label: 'Returns', value: '30 days, free return label included' },
{ label: 'SKU prefix', value: 'NT-2025' }];