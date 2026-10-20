import { createContext, useContext, useEffect } from 'react';
import type { LiveAct } from '../lib/sync';

export interface AnnounceApi {
  set: (screenId: string, act: LiveAct | null) => void;
}

export const AnnounceCtx = createContext<AnnounceApi>({ set: () => {} });

/**
 * Una pantalla anuncia la actividad que los celulares deben mostrar. El
 * presentador la publica en la sesión en vivo junto con la pantalla actual.
 */
export function useAnnounce(screenId: string, act: LiveAct | null) {
  const { set } = useContext(AnnounceCtx);
  const sig = act ? JSON.stringify(act) : '';
  useEffect(() => {
    set(screenId, sig ? (JSON.parse(sig) as LiveAct) : null);
    return () => set(screenId, null);
  }, [set, screenId, sig]);
}
