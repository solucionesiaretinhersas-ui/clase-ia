import { AI_STUDIO_URL, internalUrl } from '../lib/urls';

export interface QrLink {
  id: string;
  title: string;
  description: string;
  /** Si es interno, ruta dentro de la app; si es externo, URL absoluta. */
  route?: string;
  external?: string;
}

export const QR_LINKS: QrLink[] = [
  { id: 'studio', title: 'Google AI Studio', description: 'Sitio oficial de Google AI Studio.', external: AI_STUDIO_URL },
  { id: 'prompt', title: 'Prompt del taller', description: 'Prompt maestro editable y copiable.', route: '/m/prompt' },
  { id: 'guia', title: 'Guía de creación', description: 'Pasos y prompts de mejora en el celular.', route: '/m/guia' },
  { id: 'demo', title: 'Recurso de demostración', description: 'Misión: salvar el planeta.', route: '/demo' },
  { id: 'cierre', title: 'Actividad de cierre', description: 'Ticket de salida y compromiso.', route: '/m/cierre' },
];

/** Las rutas que envían datos reciben el código de la sesión en vivo. */
const WITH_SESSION = new Set(['/m/responder', '/m/cierre']);

export function resolveUrl(link: QrLink, base: string, session = ''): string {
  if (link.external) return link.external;
  const route = link.route ?? '/';
  return internalUrl(base, WITH_SESSION.has(route) && session ? `${route}?s=${session}` : route);
}
