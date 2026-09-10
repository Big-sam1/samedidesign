import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { categories } from '../data/categories';
import { products } from '../data/products';
import { fadeUp, staggerContainer, viewportOnce } from '../animations/variants';
import { PageHeader } from '../components/ui/PageHeader';

export function Categories() {
  return (
    <>
      <PageHeader
        title="Shop by Categories"
        subtitle="Find what you need, organised by category."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Categories' }]} />
      
      <div className="mx-auto w-full max-w-shell px-4 py-10 sm:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          
          {categories.map((category) => {
            const count = products.filter((product) => product.category === category.slug).length;
            return (
              <motion.div key={category.slug} variants={fadeUp} whileHover={{ y: -6 }} transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}>
                <Link
                  to={`/category/${category.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition-shadow duration-300 ease-smooth hover:shadow-lift">
                  
                  <div className="aspect-[16/10] overflow-hidden bg-canvas">
                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[600ms] ease-smooth group-hover:scale-105" />
                    
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-[17px] font-bold text-ink">{category.name}</h2>
                      <span className="rounded-full bg-canvas px-2.5 py-1 text-[11.5px] font-semibold text-muted">
                        {count} items
                      </span>
                    </div>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{category.blurb}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-semibold text-accent">
                      Shop Now
                      <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 ease-smooth group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </motion.div>);

          })}
        </motion.div>
      </div>
    </>);

}