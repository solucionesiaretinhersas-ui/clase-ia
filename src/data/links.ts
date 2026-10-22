// Enlaces que el celular muestra SOLO mientras el facilitador está en esa pantalla.
// Si el facilitador retrocede o avanza, la lista cambia sola: no se acumula nada.
export interface WorkshopLink {
  id: string;
  label: string;
  description: string;
  /** Dirección externa (se abre en pestaña nueva). */
  url?: string;
  /** Ruta interna de la app. */
  route?: string;
}

const STUDIO = { id: 'studio', label: 'Google AI Studio', description: 'Donde construirás tu aula (Build).', url: 'https://aistudio.google.com/' };
const CHATGPT = { id: 'chatgpt', label: 'ChatGPT', description: 'Para pedirle el prompt de tu aula.', url: 'https://chatgpt.com/' };
const ROCAS_MSG = { id: 'prompts', label: 'Mi mensaje ROCAS', description: 'Arma y copia tu mensaje para ChatGPT.', route: '/m/prompt' };
const GUIA = { id: 'guia', label: 'Guía de creación', description: 'Pasos para llegar a Build.', route: '/m/guia' };

const E_STUDIO = { id: 'e-studio', label: 'Google AI Studio', description: 'Donde crearás tu aplicación (Build).', url: 'https://aistudio.google.com/' };
const E_PROMPT = { id: 'e-prompts', label: 'Mi prompt', description: 'Arma y copia el prompt de tu idea.', route: '/m/prompt' };
const E_GUIA = { id: 'e-guia', label: 'Guía para crear tu app', description: 'Pasos para llegar a Build.', route: '/m/guia' };

export const SCREEN_LINKS: Record<string, WorkshopLink[]> = {
  // Taller de docentes
  'ai-studio': [STUDIO],
  estacion: [STUDIO, GUIA],
  laboratorio: [ROCAS_MSG, CHATGPT, STUDIO],
  flujo: [CHATGPT, STUDIO],
  taller: [ROCAS_MSG, CHATGPT, STUDIO],
  // Taller de estudiantes
  'e-studio': [E_STUDIO],
  'e-estacion': [E_STUDIO, E_GUIA],
  'e-lab': [E_PROMPT, E_STUDIO],
  'e-taller': [E_PROMPT, E_STUDIO],
};

/** Enlaces de la pantalla actual. */
export function linksFor(currentId: string): WorkshopLink[] {
  return SCREEN_LINKS[currentId] ?? [];
}