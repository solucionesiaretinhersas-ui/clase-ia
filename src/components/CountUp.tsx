import { useEffect, useRef, useState } from 'react';
import { sfx } from '../lib/sfx';

let lastChime = 0;

/** Número que sube o baja con animación hasta su valor (sin animar si se prefiere menos movimiento). */
export function CountUp({ value, ms = 650 }: { value: number; ms?: number }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || from.current === value) {
      from.current = value;
      setShown(value);
      return;
    }
    const start = from.current;
    // Suena cuando el número sube (alguien entró o respondió); no más de uno cada 0,6 s
    if (value > start && Date.now() - lastChime > 600) {
      lastChime = Date.now();
      sfx.join();
    }
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / ms);
      const e = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(start + (value - start) * e));
      if (p < 1) raf = requestAnimationFrame(step);
      else from.current = value;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);

  return <span className="countup">{shown}</span>;
}
