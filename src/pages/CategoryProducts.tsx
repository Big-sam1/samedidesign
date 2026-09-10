import React from 'react';
import { useParams } from 'react-router-dom';
import { LayersIcon } from 'lucide-react';
import { categories } from '../data/categories';
import { useData } from '../contexts/DataContext';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { ProductListing } from '../components/shop/ProductListing';

export function CategoryProducts() {
  const { slug = '' } = useParams();
  const { products } = useData();
  const category = categories.find((item) => item.slug === slug);
  const items = products.filter((product) => product.category === slug);

  if (!category) {
    return (
      <div className="mx-auto w-full max-w-shell px-4 py-20 sm:px-6">
        <EmptyState
          icon={LayersIcon}
          title="Category not found"
          description="That category no longer exists. Browse all categories to find what you are looking for."
          actionLabel="All categories"
          actionTo="/categories"
          secondaryLabel="Shop all products"
          secondaryTo="/shop" />
        
      </div>);

  }

  return (
    <>
      <PageHeader
        title={category.name}
        subtitle={category.blurb}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Categories', to: '/categories' }, { label: category.name }]} />
      
      <div className="mx-auto w-full max-w-shell px-4 py-10 sm:px-6">
        <ProductListing
          source={items}
          lockedCategory
          emptyTitle={`No ${category.name.toLowerCase()} products match those filters`}
          emptyDescription="Try widening the price range or clearing a size or colour to see more." />
        
      </div>
    </>);

}