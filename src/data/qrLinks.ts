import { AI_STUDIO_URL, CHATGPT_URL, internalUrl } from '../lib/urls';

export interface QrLink {
  id: string;
  title: string;
  description: string;
  /** Si es interno, ruta dentro de la app; si es externo, URL absoluta. */
  route?: string;
  external?: string;
}

export const QR_LINKS: QrLink[] = [
  { id: 'vivo', title: 'Seguir el taller en vivo', description: 'Lo que pasa en el tablero, en tu celular.', route: '/m/vivo' },
  { id: 'chatgpt', title: 'ChatGPT', description: 'Para estructurar tu clase (Prompt 1).', external: CHATGPT_URL },
  { id: 'studio', title: 'Google AI Studio', description: 'Para crear tu recurso en Build (Prompt 2).', external: AI_STUDIO_URL },
  { id: 'prompt', title: 'Prompts del taller', description: 'Prompt 1 y 2 editables y copiables.', route: '/m/prompt' },
  { id: 'guia', title: 'Guía de creación', description: 'Pasos y prompts de mejora en el celular.', route: '/m/guia' },
  { id: 'demo', title: 'Recurso de demostración', description: 'Misión: salvar el planeta.', route: '/demo' },
  { id: 'cierre', title: 'Actividad de cierre', description: 'Ticket de salida y compromiso.', route: '/m/cierre' },
];

/** Las rutas que reciben datos o se sincronizan reciben el código de la sesión en vivo. */
const WITH_SESSION = new Set(['/m/responder', '/m/cierre', '/m/vivo']);

export function resolveUrl(link: QrLink, base: string, session = ''): string {
  if (link.external) return link.external;
  const route = link.route ?? '/';
  return internalUrl(base, WITH_SESSION.has(route) && session ? `${route}?s=${session}` : route);
}
