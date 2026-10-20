import { createContext, useContext, useEffect } from 'react';
import type { LiveAct } from '../lib/sync';
import { usePresenter } from './context';

export interface AnnounceApi {
  set: (screenId: string, act: LiveAct | null) => void;
}

export const AnnounceCtx = createContext<AnnounceApi>({ set: () => {} });

/**
 * La pantalla activa anuncia la actividad que los celulares deben mostrar. El
 * presentador la publica en la sesión en vivo junto con la pantalla actual.
 * (El primer parámetro se conserva por compatibilidad: se usa la pantalla actual.)
 */
export function useAnnounce(_screenId: string, act: LiveAct | null) {
  const { set } = useContext(AnnounceCtx);
  const { current } = usePresenter();
  const sig = act ? JSON.stringify(act) : '';
  useEffect(() => {
    set(current, sig ? (JSON.parse(sig) as LiveAct) : null);
    return () => set(current, null);
  }, [set, current, sig]);
}