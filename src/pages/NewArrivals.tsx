import React from 'react';
import { useData } from '../contexts/DataContext';
import { PageHeader } from '../components/ui/PageHeader';
import { ProductListing } from '../components/shop/ProductListing';

export function NewArrivals() {
  const { products } = useData();
  const arrivals = products.filter((product) => product.isNew);

  return (
    <>
      <PageHeader
        title="New Arrivals"
        subtitle="Check out the latest products just added to our store."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'New Arrivals' }]} />
      
      <div className="mx-auto w-full max-w-shell px-4 py-10 sm:px-6">
        <ProductListing
          source={arrivals}
          defaults={{ sort: 'newest' }}
          emptyTitle="No new arrivals match those filters"
          emptyDescription="This drop is small — try clearing a filter to see everything that just landed." />
        
      </div>
    </>);

}