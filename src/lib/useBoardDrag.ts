import { useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent } from 'react';
import { sfx } from './sfx';

interface Drag {
  id: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  sx: number;
  sy: number;
  moved: boolean;
}

/**
 * Arrastrar y soltar para pizarra táctil. Cada pieza se arrastra a una zona marcada con `data-zone`;
 * como alternativa, se toca la pieza y luego la zona. Una zona llamada "tray" devuelve la pieza a su lugar.
 * El estado del arrastre vive también en una referencia para que pointerup nunca lea datos viejos.
 */
export function useBoardDrag(onDrop: (id: string, zone: string) => void, enabled = true) {
  const [drag, setDrag] = useState<Drag | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const ref = useRef<Drag | null>(null);

  const put = (d: Drag | null) => {
    ref.current = d;
    setDrag(d);
  };

  const bind = (id: string) => ({
    onPointerDown: (e: RPointerEvent<HTMLElement>) => {
      if (!enabled) return;
      const r = e.currentTarget.getBoundingClientRect();
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* sin puntero activo: se ignora */
      }
      put({ id, x: r.left, y: r.top, dx: e.clientX - r.left, dy: e.clientY - r.top, sx: e.clientX, sy: e.clientY, moved: false });
    },
    onPointerMove: (e: RPointerEvent<HTMLElement>) => {
      const d = ref.current;
      if (!d || d.id !== id) return;
      put({ ...d, x: e.clientX - d.dx, y: e.clientY - d.dy, moved: d.moved || Math.hypot(e.clientX - d.sx, e.clientY - d.sy) > 8 });
    },
    onPointerUp: (e: RPointerEvent<HTMLElement>) => {
      const d = ref.current;
      if (!d || d.id !== id) return;
      put(null);
      if (!d.moved) {
        setSelected((cur) => (cur === id ? null : id));
        sfx.pop();
        return;
      }
      const hit = document.elementsFromPoint(e.clientX, e.clientY).find((n) => (n as HTMLElement).dataset?.zone) as HTMLElement | undefined;
      if (hit?.dataset.zone && hit.dataset.zone !== 'tray') {
        onDrop(id, hit.dataset.zone);
        sfx.drop();
      }
      setSelected(null);
    },
    onPointerCancel: () => put(null),
    // El toque ya se maneja al soltar: evita que suba hasta la zona contenedora
    onClick: (e: { stopPropagation: () => void }) => e.stopPropagation(),
    'aria-pressed': selected === id,
    className: `${drag?.id === id && drag.moved ? 'is-drag' : ''} ${selected === id ? 'is-selected' : ''}`.trim(),
    style: drag?.id === id && drag.moved ? ({ left: drag.x, top: drag.y } as CSSProperties) : undefined,
  });

  /** Props para una zona de suelta: acepta arrastre y el toque cuando hay una pieza seleccionada. */
  const zone = (name: string) => ({
    'data-zone': name,
    onClick: () => {
      if (!selected || !enabled || name === 'tray') return;
      onDrop(selected, name);
      setSelected(null);
      sfx.drop();
    },
  });

  return { bind, zone, selected, setSelected, dragging: Boolean(drag?.moved), armed: Boolean(selected) || Boolean(drag?.moved) };
}
