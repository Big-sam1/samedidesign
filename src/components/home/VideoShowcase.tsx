import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, PhoneIcon } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { formatPrice } from '../../utils/format';
import videoSource from '../../data/v1.mp4';
import shoe1Image from '../../data/sh1.png';
import shoe2Image from '../../data/sh2.png';
import shoe3Image from '../../data/sh3.png';
import shoe4Image from '../../data/sh4.png';
import shoe5Image from '../../data/sh5.png';

export interface ShoeItem {
  id: string;
  name: string;
  price: string;
  sizes: string;
  image: string;
}

export const shoesList: ShoeItem[] = [
  {
    id: 'shoe-1',
    name: 'Classic High-Top Canvas',
    price: formatPrice(45),
    sizes: 'Sizes 40 – 46',
    image: shoe1Image
  },
  {
    id: 'shoe-2',
    name: 'Rugged Heritage Leather Boot',
    price: formatPrice(75),
    sizes: 'Sizes 40 – 48 (Big Size)',
    image: shoe2Image
  },
  {
    id: 'shoe-3',
    name: 'Turbo Velox Trainer Sneaker',
    price: formatPrice(55),
    sizes: 'Sizes 38 – 45',
    image: shoe3Image
  },
  {
    id: 'shoe-4',
    name: 'Handcrafted Cognac Leather Low',
    price: formatPrice(65),
    sizes: 'Sizes 40 – 47',
    image: shoe4Image
  },
  {
    id: 'shoe-5',
    name: 'Air Cushion Performance Runner',
    price: formatPrice(60),
    sizes: 'Sizes 39 – 46',
    image: shoe5Image
  }
];

export function VideoShowcase() {
  const [isPaused, setIsPaused] = useState(false);
  const [selectedShoe, setSelectedShoe] = useState<ShoeItem | null>(null);

  // Duplicated list to achieve seamless infinite horizontal looping
  const infiniteShoes = [...shoesList, ...shoesList, ...shoesList];

  return (
    <section className="pt-16 pb-6" aria-labelledby="videos-heading">
      <div id="videos-heading">
        <SectionHeading
          title="Featured Videos & Fashion Reels"
          subtitle="Watch Samedi design collections in motion — Big Size outfits, new arrivals, and store highlights."
          centered
        />
      </div>

      {/* CLEAN VIDEO CONTAINER FITTED WITH AUTOPLAYING VIDEO & HORIZONTAL MOVING SHOES */}
      <div className="relative mt-5 h-[380px] sm:h-[420px] lg:h-[460px] w-full overflow-hidden rounded-3xl border border-line bg-black shadow-xl">
        {/* Background Looping Video */}
        <video
          src={videoSource}
          poster="/shoes-banner.jpg"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />

        {/* Ambient Dark Gradient for Contrast */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />

        {/* Horizontal Moving Shoes Strip */}
        <div className="absolute inset-x-0 bottom-6 z-10 overflow-hidden py-3">
          <div
            className="shoes-horizontal-marquee flex w-max items-end gap-10"
            style={{
              animationPlayState: isPaused ? 'paused' : 'running'
            }}
          >
            {infiniteShoes.map((shoe, idx) => (
              <div
                key={`${shoe.id}-${idx}`}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onClick={() => setSelectedShoe(shoe)}
                className="group flex cursor-pointer flex-col items-center transition-transform duration-300 hover:scale-110"
              >
                {/* Floating Shoe Image with Shadow */}
                <div className="relative flex flex-col items-center">
                  <img
                    src={shoe.image}
                    alt={shoe.name}
                    className="h-28 sm:h-36 w-auto object-contain transition-transform duration-300 group-hover:-translate-y-2 drop-shadow-xl"
                  />
                  {/* Floating elliptical shadow */}
                  <div className="mt-1 h-3 w-3/4 rounded-full bg-black/60 blur-[5px] transition-transform duration-300 group-hover:scale-90" />
                </div>

                {/* Shoe Name Only */}
                <p className="mt-3 rounded-full bg-black/60 px-3.5 py-1 text-[13px] font-bold text-white backdrop-blur-md transition-colors group-hover:bg-accent group-hover:text-white">
                  {shoe.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COMPACT MODAL ON TOP OF CURRENT PAGE (NOT FITTING ALL SCREEN) */}
      <AnimatePresence>
        {selectedShoe && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedShoe(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 16 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-white/15 bg-neutral-950 p-5 text-white shadow-2xl"
            >
              {/* Close Button */}
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold tracking-wider text-accent uppercase">
                  Samedi design Footwear
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedShoe(null)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Big Image in Modal */}
              <div className="relative my-4 flex flex-col items-center justify-center py-2">
                <img
                  src={selectedShoe.image}
                  alt={selectedShoe.name}
                  className="max-h-[170px] w-auto object-contain drop-shadow-2xl"
                />
                <div className="mt-2 h-3.5 w-2/3 rounded-full bg-black/80 blur-[6px]" />
              </div>

              {/* Little Information */}
              <div className="text-center">
                <h4 className="text-lg font-extrabold text-white">{selectedShoe.name}</h4>
                <p className="mt-1 text-sm font-bold text-accent">{selectedShoe.price}</p>
                <p className="mt-0.5 text-xs text-white/60">{selectedShoe.sizes}</p>
              </div>

              {/* WhatsApp Action Button */}
              <div className="mt-5 flex gap-2">
                <a
                  href={`https://wa.me/250784264931?text=Hello%20Samedi%20design,%20I%20want%20to%20order%20the%20${encodeURIComponent(
                    selectedShoe.name
                  )}%20(${encodeURIComponent(selectedShoe.price)})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent py-2.5 text-xs font-bold text-white transition-transform hover:scale-[1.02] hover:bg-accent-hover"
                >
                  <PhoneIcon className="h-3.5 w-3.5" />
                  Order on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedShoe(null)}
                  className="rounded-full border border-white/20 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Seamless Horizontal Infinite Loop Animation */}
      <style>{`
        @keyframes horizontalMarquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .shoes-horizontal-marquee {
          animation: horizontalMarquee 22s linear infinite;
        }
      `}</style>
    </section>
  );
}
