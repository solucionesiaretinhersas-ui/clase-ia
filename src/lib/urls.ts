declare const __LAN_URLS__: string[];

/** Enlace externo verificado: página oficial de Google AI Studio. */
export const AI_STUDIO_URL = 'https://aistudio.google.com/';

/** Enlace externo: sitio oficial de ChatGPT. */
export const CHATGPT_URL = 'https://chatgpt.com/';

export type HostKind = 'local' | 'lan' | 'public' | 'file';

export function lanUrls(): string[] {
  try {
    return __LAN_URLS__;
  } catch {
    return [];
  }
}

/** URL base de la app tal como se está sirviendo ahora (sin hash). */
export function currentBase(): string {
  const { origin, pathname } = window.location;
  if (window.location.protocol === 'file:') return window.location.href.split('#')[0];
  return origin + pathname;
}

export function classifyHost(base: string): HostKind {
  try {
    const u = new URL(base);
    if (u.protocol === 'file:') return 'file';
    const h = u.hostname;
    if (h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h.endsWith('.localhost')) return 'local';
    if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.)/.test(h) || h.endsWith('.local')) return 'lan';
    return 'public';
  } catch {
    return 'local';
  }
}

export function normalizeBase(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    const u = new URL(trimmed);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    u.hash = '';
    u.search = '';
    return u.toString();
  } catch {
    return null;
  }
}

/** Construye la URL completa de una ruta interna (#/ruta) sobre una base. */
export function internalUrl(base: string, route: string): string {
  return `${base.split('#')[0]}#${route}`;
}
