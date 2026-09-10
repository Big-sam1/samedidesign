import React from 'react';
import { useData } from '../contexts/DataContext';
import { PageHeader } from '../components/ui/PageHeader';
import { ProductListing } from '../components/shop/ProductListing';

export function BestSellers() {
  const { products } = useData();
  const bestSellers = products.filter((product) => product.isBestSeller || product.reviews > 140);

  return (
    <>
      <PageHeader
        title="Best Sellers"
        subtitle="Our most popular products, loved by customers."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Best Sellers' }]} />
      
      <div className="mx-auto w-full max-w-shell px-4 py-10 sm:px-6">
        <ProductListing
          source={bestSellers}
          defaults={{ sort: 'popular' }}
          emptyTitle="No best sellers match those filters"
          emptyDescription="Try widening the price range or clearing a category to see the full list." />
        
      </div>
    </>);

}