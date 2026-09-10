import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SearchIcon } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { EASE_SMOOTH } from '../animations/variants';
import { PageHeader } from '../components/ui/PageHeader';
import { ProductListing } from '../components/shop/ProductListing';

export function Search() {
  const { products } = useData();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const query = params.get('q') ?? '';
  const [draft, setDraft] = useState(query);

  useEffect(() => {
    setDraft(query);
  }, [query]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate(`/search?q=${encodeURIComponent(draft.trim())}`);
  };

  return (
    <>
      <PageHeader
        title={query ? `Search Results for “${query}”` : 'Search Products'}
        subtitle={query ? 'Refine your results with the filters below.' : 'Find products by name, brand or category.'}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Search' }]} />
      
      <div className="mx-auto w-full max-w-shell px-4 py-10 sm:px-6">
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE_SMOOTH }}
          className="mb-8 flex items-center gap-3 rounded-full border border-line bg-white px-5 py-2">
          
          <SearchIcon className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="h-10 min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none" />
          
          <button
            type="submit"
            className="h-10 shrink-0 rounded-full bg-accent px-5 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-accent-hover">
            
            Search
          </button>
        </motion.form>

        <ProductListing
          key={query}
          source={products}
          defaults={{ search: query }}
          emptyTitle={query ? `No results for “${query}”` : 'Start with a search'}
          emptyDescription="Check the spelling, try a broader term like “headphones”, or browse the full catalogue." />
        
      </div>
    </>);

}