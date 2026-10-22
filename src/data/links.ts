import type { ScreenMeta } from './workshop';

// Enlace que se desbloquea en el celular cuando el facilitador llega a la pantalla indicada.
export interface WorkshopLink {
  id: string;
  label: string;
  description: string;
  /** Dirección externa (se abre en pestaña nueva). */
  url?: string;
  /** Ruta interna de la app. */
  route?: string;
}

export const SCREEN_LINKS: Record<string, WorkshopLink[]> = {
  'ai-studio': [
    { id: 'studio', label: 'Google AI Studio', description: 'Donde construirás tu aula (Build).', url: 'https://aistudio.google.com/' },
  ],
  estacion: [{ id: 'guia', label: 'Guía de creación', description: 'Pasos para llegar a Build.', route: '/m/guia' }],
  laboratorio: [
    { id: 'chatgpt', label: 'ChatGPT', description: 'Para pedirle el prompt de tu aula.', url: 'https://chatgpt.com/' },
    { id: 'prompts', label: 'Mi mensaje ROCAS', description: 'Arma y copia tu mensaje para ChatGPT.', route: '/m/prompt' },
  ],
  // Taller de estudiantes
  'e-studio': [
    { id: 'e-studio', label: 'Google AI Studio', description: 'Donde crearás tu aplicación (Build).', url: 'https://aistudio.google.com/' },
  ],
  'e-demo': [{ id: 'e-demo', label: 'Aplicación de ejemplo', description: 'Misión: salvar el planeta.', route: '/demo' }],
  'e-estacion': [{ id: 'e-guia', label: 'Guía para crear tu app', description: 'Pasos y prompts de mejora.', route: '/m/guia' }],
  'e-lab': [{ id: 'e-prompts', label: 'Mi prompt', description: 'Arma y copia el prompt de tu idea.', route: '/m/prompt' }],
};

// Enlaces ya abiertos hasta la pantalla actual (inclusive), en el orden del taller.
export function unlockedLinks(screens: ScreenMeta[], currentId: string): WorkshopLink[] {
  const idx = screens.findIndex((s) => s.id === currentId);
  if (idx < 0) return [];
  return screens.slice(0, idx + 1).flatMap((s) => SCREEN_LINKS[s.id] ?? []);
}
