import React from 'react';
import { useData } from '../contexts/DataContext';
import { PageHeader } from '../components/ui/PageHeader';
import { ProductListing } from '../components/shop/ProductListing';

export function Shop() {
  const { products } = useData();

  return (
    <>
      <PageHeader
        title="Shop All Products"
        subtitle={`Browse our quality collection — ${products.length} pieces across categories.`}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Shop' }]}
      />

      <div className="mx-auto w-full max-w-shell px-4 py-10 sm:px-6">
        <ProductListing source={products} />
      </div>
    </>
  );
}