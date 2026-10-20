import { useCallback, useEffect, useState } from 'react';

const PREFIX = 'aula-ia:';
const EVENT = 'aula-ia:storage';

/**
 * Lectura/escritura segura en localStorage. Puede fallar en ventanas privadas
 * o con almacenamiento bloqueado; en ese caso la app sigue funcionando y solo
 * pierde la persistencia.
 */
export function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStored<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* sin persistencia disponible */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
}

export function clearStored(predicate: (key: string) => boolean = () => true) {
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k?.startsWith(PREFIX) && predicate(k.slice(PREFIX.length))) keys.push(k);
    }
    keys.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* nada que limpiar */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: '*' }));
}

/**
 * useState persistente. Varios componentes que usan la misma clave se
 * mantienen sincronizados (en la misma pestaña y entre pestañas).
 */
export function usePersistentState<T>(key: string, initial: T) {
  const [state, setState] = useState<{ key: string; value: T }>(() => ({ key, value: readStored(key, initial) }));
  // Si la clave cambia (p. ej. otro taller), el valor se relee de inmediato, sin mostrar el anterior.
  const value = state.key === key ? state.value : readStored(key, initial);

  useEffect(() => {
    const reload = () => setState({ key, value: readStored(key, initial) });
    const onLocal = (e: Event) => {
      const k = (e as CustomEvent<string>).detail;
      if (k === key || k === '*') reload();
    };
    const onOther = (e: StorageEvent) => {
      if (e.key === null || e.key === PREFIX + key) reload();
    };
    window.addEventListener(EVENT, onLocal);
    window.addEventListener('storage', onOther);
    return () => {
      window.removeEventListener(EVENT, onLocal);
      window.removeEventListener('storage', onOther);
    };
    // initial es un valor por defecto estable a efectos prácticos
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === 'function' ? (next as (p: T) => T)(readStored(key, initial)) : next;
      writeStored(key, resolved);
      setState({ key, value: resolved });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  return [value, update] as const;
}
/**
 * Deja la aplicación como nueva para un taller distinto: borra votos, tableros,
 * ideas, cronómetros, galería, compromisos y el código de sesión (se genera uno
 * nuevo). Conserva solo la dirección pública configurada.
 */
/** Datos que sobreviven a un taller nuevo: ajustes, historial de sesiones y certificados ya emitidos. */
const KEEP_ON_RESET = ['publicBase', 'theme', 'workshop:mode', 'history:sessions', 'cert:facilitator', 'cert:saved', 'device'];

export function resetWorkshop() {
  clearStored((k) => !KEEP_ON_RESET.includes(k));
  window.dispatchEvent(new Event('aula-ia:reset'));
}