import React from 'react';
import { motion } from 'framer-motion';
import { bestSellerIds, newArrivalIds } from '../data/products';
import { useData } from '../contexts/DataContext';
import { staggerContainer, viewportOnce } from '../animations/variants';
import { Hero } from '../components/home/Hero';
import { Benefits } from '../components/home/Benefits';
import { CategoryShowcase } from '../components/home/CategoryShowcase';
import { TestimonialCarousel } from '../components/home/TestimonialCarousel';
import { PromoBanners } from '../components/home/PromoBanners';
import { ProductCarousel } from '../components/product/ProductCarousel';
import { BestSellerCard } from '../components/product/BestSellerCard';
import { VideoShowcase } from '../components/home/VideoShowcase';
import { SectionHeading } from '../components/ui/SectionHeading';

export function Home() {
  const { products } = useData();

  const newArrivals = products.filter((p) => p.isNew || newArrivalIds.includes(p.id));
  const bestSellers = products.filter(
    (p) => p.isBestSeller || bestSellerIds.includes(p.id) || (p.reviews && p.reviews > 140)
  );

  return (
    <>
      <Hero />
      <Benefits />

      <div className="mx-auto w-full max-w-shell px-4 sm:px-6">
        <section className="pt-14" aria-labelledby="categories-heading">
          <div id="categories-heading">
            <SectionHeading
              title="Shop by Categories"
              subtitle="Find what you need, organised by category."
              linkLabel="View All Categories"
              linkTo="/categories" />
            
          </div>
          <CategoryShowcase />
        </section>

        <section className="pt-16" aria-labelledby="new-arrivals-heading">
          <div id="new-arrivals-heading">
            <SectionHeading
              title="New Arrivals"
              subtitle="The latest products added to the store."
              linkLabel="View All New Arrivals"
              linkTo="/new-arrivals" />
            
          </div>
          <ProductCarousel products={newArrivals} />
        </section>

        <section className="pt-16" aria-labelledby="best-sellers-heading">
          <div id="best-sellers-heading">
            <SectionHeading
              title="Best Sellers"
              subtitle="Our most popular products, loved by customers."
              linkLabel="View All Best Sellers"
              linkTo="/best-sellers" />
            
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            
            {bestSellers.map((product) =>
            <BestSellerCard key={product.id} product={product} />
            )}
          </motion.div>
        </section>

        <div className="pt-16">
          <PromoBanners />
        </div>

        <section className="pt-16" aria-labelledby="testimonials-heading">
          <div id="testimonials-heading">
            <SectionHeading
              title="What Customers Say"
              subtitle="Five thousand reviews, a 4.8 average — here are a few of them." />
            
          </div>
          <TestimonialCarousel />
        </section>

        <VideoShowcase />
      </div>
    </>);

}