import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_SMOOTH } from '../../animations/variants';
import { cn } from '../../utils/format';

interface ProductGalleryProps {
  images?: string[];
  name: string;
}

export function ProductGallery({ images = [], name }: ProductGalleryProps) {
  const safeImages = images && images.length > 0 ? images : ['/15a82519-a2d2-48b3-8a56-c0caff0b9890.jpg'];
  const gallery = safeImages.length > 1 ? safeImages : [safeImages[0], safeImages[0], safeImages[0], safeImages[0]];
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });

  useEffect(() => {
    setActive(0);
  }, [images]);

  const currentImage = gallery[active] || gallery[0] || '';

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative aspect-square w-full overflow-hidden rounded-3xl border border-line bg-canvas"
        onMouseEnter={() => setZoom((prev) => ({ ...prev, active: true }))}
        onMouseLeave={() => setZoom({ active: false, x: 50, y: 50 })}
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setZoom({
            active: true,
            x: (event.clientX - rect.left) / rect.width * 100,
            y: (event.clientY - rect.top) / rect.height * 100
          });
        }}>
        
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.img
            key={active}
            src={currentImage}
            alt={`${name}, view ${active + 1}`}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE_SMOOTH }}
            className="h-full w-full object-cover"
            style={{
              transform: zoom.active ? 'scale(1.7)' : 'scale(1)',
              transformOrigin: `${zoom.x}% ${zoom.y}%`,
              transition: 'transform 300ms cubic-bezier(0.23, 1, 0.32, 1)'
            }} />
          
        </AnimatePresence>
        <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-3 py-1 text-[11px] font-medium text-charcoal backdrop-blur">
          Hover to zoom
        </p>
      </div>

      <div className="flex gap-3">
        {gallery.map((image, index) =>
        <button
          key={`${image}-${index}`}
          type="button"
          onClick={() => setActive(index)}
          aria-label={`Show image ${index + 1}`}
          aria-pressed={index === active}
          className={cn(
            'h-[74px] w-[74px] overflow-hidden rounded-xl border-2 bg-canvas transition-colors duration-200 ease-smooth',
            index === active ? 'border-accent' : 'border-line hover:border-ink/30'
          )}>
          
            <img src={image} alt="" aria-hidden="true" className="h-full w-full object-cover" />
          </button>
        )}
      </div>
    </div>);

}