import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/** Returns a -1..1 normalised pointer offset relative to the element centre. */
export function useMouseParallax<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handle = (event: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      setOffset({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
    };
    const reset = () => setOffset({ x: 0, y: 0 });

    node.addEventListener('mousemove', handle);
    node.addEventListener('mouseleave', reset);
    return () => {
      node.removeEventListener('mousemove', handle);
      node.removeEventListener('mouseleave', reset);
    };
  }, [reduceMotion]);

  return { ref, offset };
}