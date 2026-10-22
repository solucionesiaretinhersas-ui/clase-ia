import { useEffect } from 'react';
import { sfx } from './sfx';

const TARGET = 'button, a[href], summary, [role="tab"], [role="button"], select, input[type="checkbox"], input[type="radio"]';

/**
 * Sonido suave en todos los controles del tablero (botones, enlaces, pestañas, casillas).
 * Respeta el silencio general. Se omite en elementos con `data-silent` o desactivados.
 */
export function useUiSounds() {
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.(TARGET) as (HTMLElement & { disabled?: boolean }) | null;
      if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true' || el.closest('[data-silent]')) return;
      sfx.tap();
    };
    document.addEventListener('pointerdown', onDown, true);
    return () => document.removeEventListener('pointerdown', onDown, true);
  }, []);
}