import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

const KEY = 'aula-ia:theme';
const EVENT = 'aula-ia:theme';
const COLORS: Record<Theme, string> = { light: '#f2f2f7', dark: '#000000' };

/** Tema guardado en este dispositivo; si no hay, el del sistema. */
export function readTheme(): Theme {
  try {
    const v = window.localStorage.getItem(KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch {
    /* sin almacenamiento */
  }
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function applyTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', COLORS[t]);
}

export function setTheme(t: Theme) {
  try {
    window.localStorage.setItem(KEY, t);
  } catch {
    /* sin almacenamiento */
  }
  applyTheme(t);
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

export function useTheme(): [Theme, () => void] {
  const theme = useSyncExternalStore(subscribe, () => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'), () => 'dark') as Theme;
  return [theme, () => setTheme(theme === 'light' ? 'dark' : 'light')];
}
