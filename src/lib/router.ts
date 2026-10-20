import { useSyncExternalStore } from 'react';

/**
 * Enrutador mínimo basado en el hash (#/ruta). Se eligió hash routing para que
 * la app funcione en cualquier hosting estático (Netlify, GitHub Pages, una
 * carpeta local) sin reglas de reescritura en el servidor, y para que los QR
 * apunten a rutas que siempre resuelven.
 */
function readPath(): string {
  const raw = window.location.hash.replace(/^#/, '');
  return raw.startsWith('/') ? raw : `/${raw}`;
}

function subscribe(cb: () => void) {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
}

export function useRoute(): string {
  return useSyncExternalStore(subscribe, readPath, () => '/');
}

export function navigate(path: string) {
  if (readPath() !== path) window.location.hash = path;
}

/** Lee un parámetro de la parte ?query de la ruta del hash. */
export function queryParam(path: string, name: string): string {
  const q = path.split('?')[1] ?? '';
  return new URLSearchParams(q).get(name) ?? '';
}

/** Devuelve los segmentos de la ruta: '/s/ruta' → ['s', 'ruta'] */
export function segments(path: string): string[] {
  return path.split('?')[0].split('/').filter(Boolean);
}
