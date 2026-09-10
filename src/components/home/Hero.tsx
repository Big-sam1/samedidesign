import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRightIcon, PhoneIcon } from 'lucide-react';
import { IMG } from '../../data/images';
import { useData } from '../../contexts/DataContext';
import { useMouseParallax } from '../../hooks/useMouseParallax';
import { EASE_SMOOTH } from '../../animations/variants';
import { formatPrice } from '../../utils/format';
import { Button } from '../ui/Button';
import { cn } from '../../utils/format';

const SWAP_MS = 4000;

const headlines = [
  ['We Sell Clothes,', 'Bigsize Store Shopping'],
  ['First SHOP in Town,', 'Nyamirambo Biryogo'],
  ['Samedi Design,', 'Quietly Elevated Fits']
];

const scenes = [
  {
    id: 'her',
    image: IMG.hero,
    alt: 'Model wearing Samedi design essential big size fashion collection',
    label: 'Bigsize & Trend Edit',
    cards: [
      { id: 'air-max-270', image: IMG.heroFloating.first.topLeft },
      { id: 'smart-watch-series-9', image: IMG.heroFloating.first.topRight },
      { id: 'wireless-headphones', image: IMG.heroFloating.first.bottomLeft },
      { id: 'stainless-steel-bottle', image: IMG.heroFloating.first.bottomRight }
    ]
  },
  {
    id: 'him',
    image: IMG.heroAlt,
    alt: 'Model wearing Samedi design street style and relaxed tailoring',
    label: 'Biryogo Nyamirambo Edit',
    cards: [
      { id: 'oversized-crewneck', image: IMG.heroFloating.second.topLeft },
      { id: 'aviator-sunglasses', image: IMG.heroFloating.second.topRight },
      { id: 'canvas-weekender', image: IMG.heroFloating.second.bottomLeft },
      { id: 'linen-wide-trousers', image: IMG.heroFloating.second.bottomRight }
    ]
  }
];


const floatPositions = [
{ className: 'left-[6%] top-[8%]', from: { x: -40, y: -20 }, depth: 22, duration: 5.4 },
{ className: 'right-[4%] top-[14%]', from: { x: 40, y: -24 }, depth: 16, duration: 6.2 },
{ className: 'left-[1%] top-[46%]', from: { x: -48, y: 20 }, depth: 28, duration: 5.8 },
{ className: 'right-[7%] bottom-[8%]', from: { x: 44, y: 30 }, depth: 20, duration: 6.6 }];


const avatars = [IMG.avatar1, IMG.avatar2, IMG.avatar3, IMG.avatar4];

export function Hero() {
  const { products, siteContent } = useData();
  const { ref, offset } = useMouseParallax<HTMLDivElement>();
  const reduceMotion = useReducedMotion();
  const [sceneIndex, setSceneIndex] = useState(0);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const scene = scenes[sceneIndex];
  const headline = headlineIndex === 0
    ? siteContent.heroHeadline.split('\n').filter(Boolean)
    : headlines[headlineIndex];

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setSceneIndex((prev) => (prev + 1) % scenes.length);
      setHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, SWAP_MS);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section className="bg-canvas" aria-label="Featured collection">
      <div
        ref={ref}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="mx-auto grid w-full max-w-shell items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:py-16">
        
        <div>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_SMOOTH }}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
            
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <motion.span
                className="absolute inline-flex h-full w-full rounded-full bg-accent"
                animate={reduceMotion ? undefined : { scale: [1, 2.1, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }} />
              
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Trending Now
          </motion.p>

          <h1 className="mt-3 min-h-[128px] text-[36px] font-extrabold leading-[1.05] tracking-tight text-ink sm:min-h-[172px] sm:text-[52px] lg:text-[58px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={headlineIndex} className="block">
                {headline.map((line, lineIndex) =>
                <motion.span
                  key={line}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.45, ease: EASE_SMOOTH, delay: lineIndex * 0.07 }}
                  className="block">
                  
                    {line}
                  </motion.span>
                )}
              </motion.span>
            </AnimatePresence>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_SMOOTH, delay: 0.14 }}
            className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
            {siteContent.heroSubheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_SMOOTH, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center gap-3">
            <Button to="/shop" size="lg">
              Shop Now
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <a
              href="https://wa.me/250784264931"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-[13px] font-semibold text-charcoal shadow-sm transition-colors hover:border-accent hover:text-accent hover:bg-canvas">
              <PhoneIcon className="h-4 w-4 text-accent" aria-hidden="true" />
              WhatsApp &amp; Call: 0784264931
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_SMOOTH, delay: 0.28 }}
            className="mt-9 flex items-center gap-3">
            
            <div className="flex -space-x-2.5">
              {avatars.map((avatar, index) =>
              <img
                key={index}
                src={avatar}
                alt=""
                aria-hidden="true"
                className="h-8 w-8 rounded-full border-2 border-white object-cover" />

              )}
            </div>
            <p className="text-[13px] text-muted">
              Loved by <span className="font-semibold text-ink">50,000+</span> customers worldwide
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, ease: EASE_SMOOTH }}
          className="relative"
          style={{
            transform: reduceMotion ? undefined : `translate3d(${offset.x * -10}px, ${offset.y * -8}px, 0)`,
            transition: 'transform 320ms cubic-bezier(0.23, 1, 0.32, 1)'
          }}>
          
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-white">
            <AnimatePresence initial={false} mode="sync">
              <motion.img
                key={scene.id}
                src={scene.image}
                alt={scene.alt}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.7, ease: EASE_SMOOTH }}
                className="absolute inset-0 h-full w-full object-cover" />
              
            </AnimatePresence>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={`${scene.id}-label`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: EASE_SMOOTH }}
                className="absolute bottom-4 left-4 rounded-full bg-[#101216]/70 px-3.5 py-1.5 text-[11.5px] font-semibold text-[#ffffff] backdrop-blur-sm">
                
                {scene.label}
              </motion.span>
            </AnimatePresence>
          </div>

          {scene.cards.map((card, index) => {
            const product = products.find((item) => item.id === card.id);
            if (!product) return null;
            const position = floatPositions[index];
            return (
              <motion.div
                key={`${scene.id}-${card.id}`}
                initial={{ opacity: 0, ...position.from, scale: 0.94 }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.1 + index * 0.08 }}
                className={`absolute hidden sm:block ${position.className}`}
                style={{
                  transform: reduceMotion ?
                  undefined :
                  `translate3d(${offset.x * position.depth}px, ${offset.y * position.depth}px, 0)`,
                  transition: 'transform 420ms cubic-bezier(0.23, 1, 0.32, 1)'
                }}>
                
                <motion.div
                  animate={reduceMotion ? undefined : { y: [0, -9, 0] }}
                  transition={{ duration: position.duration, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}>
                  
                  <Link
                    to={`/product/${product.id}`}
                    className="block w-[124px] rounded-2xl border border-line bg-white p-2.5 shadow-float transition-transform duration-300 ease-smooth hover:-translate-y-1 lg:w-[136px]">
                    
                    <img
                      src={card.image}
                      alt={product.name}
                      className="aspect-square w-full rounded-xl bg-canvas object-cover" />
                    
                    <p className="mt-2 truncate text-[11.5px] font-semibold text-ink">{product.name}</p>
                    <p className="text-[11px] font-medium text-accent">{formatPrice(product.price)}</p>
                  </Link>
                </motion.div>
              </motion.div>);

          })}

          <div className="absolute bottom-4 right-4 flex items-center gap-2" role="group" aria-label="Switch featured look">
            {scenes.map((option, index) =>
            <button
              key={option.id}
              type="button"
              onClick={() => {
                setSceneIndex(index);
                setHeadlineIndex(index % headlines.length);
              }}
              aria-label={`Show ${option.label}`}
              aria-current={index === sceneIndex}
              className="grid h-7 w-7 place-items-center">
              
                <span
                className={cn(
                  'block h-2 rounded-full transition-all duration-300 ease-smooth',
                  index === sceneIndex ? 'w-6 bg-accent' : 'w-2 bg-[#ffffff]/80'
                )} />
              
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>);

}