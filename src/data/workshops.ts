import { useSyncExternalStore } from 'react';
import { MOMENTS, SCREENS, TOTAL_MINUTES, type Moment, type ScreenMeta } from './workshop';
import { E_MOMENTS, E_OUTCOMES, E_SCREENS } from './workshop.estudiantes';

export type WorkshopId = 'docentes' | 'estudiantes';

export interface WorkshopDef {
  id: WorkshopId;
  /** Etiqueta para el selector */
  label: string;
  audience: 'docente' | 'estudiante';
  subtitle: string;
  quote: string;
  moments: Moment[];
  screens: ScreenMeta[];
  total: number;
  outcomes: string[];
  /** Pantalla con la lista de asistencia y los certificados */
  certificateScreen: string;
  certificate: { title: string; text: string };
  /** Pantalla cuya fase de laboratorio usa la estación para volver */
  labScreen: string;
  introCover: string;
}

const D_OUTCOMES = [
  'La IA como copiloto, no reemplazo',
  'Llegar a la sección Build',
  'La estructura de tu clase con ChatGPT',
  'Tu recurso interactivo funcionando',
  'Uno o dos recursos en el tablero',
  'Ética y docencia humanizada',
];

function build(def: Omit<WorkshopDef, 'total'>): WorkshopDef {
  return { ...def, total: def.moments.reduce((s, m) => s + m.minutes, 0) };
}

export const WORKSHOPS: Record<WorkshopId, WorkshopDef> = {
  docentes: {
    ...build({
      id: 'docentes',
      label: 'Taller para docentes',
      audience: 'docente',
      subtitle: 'De la idea a la experiencia',
      quote:
        'La inteligencia artificial no transforma la enseñanza por sí sola. La transforman los docentes que se atreven a imaginar con ella.',
      moments: MOMENTS,
      screens: SCREENS,
      outcomes: D_OUTCOMES,
      certificateScreen: 'certificados',
      certificate: {
        title: 'Aula IA: De la idea a la experiencia',
        text: 'por su participación en el taller de creación de recursos educativos interactivos con inteligencia artificial y Google AI Studio',
      },
      labScreen: 'laboratorio',
      introCover: 'inicio',
    }),
    total: TOTAL_MINUTES,
  },
  estudiantes: build({
    id: 'estudiantes',
    label: 'Taller para estudiantes',
    audience: 'estudiante',
    subtitle: 'Crea tu propia aplicación con IA',
    quote: 'La inteligencia artificial es una gran ayudante. Las ideas, las preguntas y las decisiones siguen siendo tuyas.',
    moments: E_MOMENTS,
    screens: E_SCREENS,
    outcomes: E_OUTCOMES,
    certificateScreen: 'e-certificados',
    certificate: {
      title: 'Crea tu propia aplicación con IA',
      text: 'por su participación en el taller de inteligencia artificial y creación de aplicaciones con Google AI Studio',
    },
    labScreen: 'e-lab',
    introCover: 'e-inicio',
  }),
};

/* ───────── Taller activo (se guarda en este dispositivo) ───────── */
const KEY = 'aula-ia:workshop:mode';
const EVENT = 'aula-ia:workshop';

function read(): WorkshopId {
  try {
    const v = window.localStorage.getItem(KEY);
    if (v === 'docentes' || v === 'estudiantes') return v;
  } catch {
    /* sin almacenamiento */
  }
  return 'docentes';
}

export function getWorkshopId(): WorkshopId {
  return read();
}

export function setWorkshopId(id: WorkshopId) {
  try {
    window.localStorage.setItem(KEY, id);
  } catch {
    /* sin almacenamiento */
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Convierte el parámetro `w` de la URL (`e` / `d`) en el taller correspondiente. */
export function workshopFromParam(w: string): WorkshopId | null {
  if (w === 'e') return 'estudiantes';
  if (w === 'd') return 'docentes';
  return null;
}

export const workshopParam = (id: WorkshopId) => (id === 'estudiantes' ? 'e' : 'd');

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}

export interface ActiveWorkshop extends WorkshopDef {
  screenIndex: (id: string) => number;
  momentOf: (id: string) => Moment | undefined;
}

export function withHelpers(def: WorkshopDef): ActiveWorkshop {
  return {
    ...def,
    screenIndex: (id) => Math.max(0, def.screens.findIndex((s) => s.id === id)),
    momentOf: (id) => def.moments.find((m) => m.id === id),
  };
}

const cache = new Map<WorkshopId, ActiveWorkshop>();
function active(id: WorkshopId): ActiveWorkshop {
  let w = cache.get(id);
  if (!w) {
    w = withHelpers(WORKSHOPS[id]);
    cache.set(id, w);
  }
  return w;
}

export function getWorkshop(): ActiveWorkshop {
  return active(read());
}

export function useWorkshop(): ActiveWorkshop {
  const id = useSyncExternalStore(subscribe, read, () => 'docentes' as WorkshopId);
  return active(id);
}

/** Ruta del celular para este taller y esta sesión (el QR de ingreso la usa). */
export function joinRoute(code: string): string {
  return `/m/vivo?s=${code}&w=${workshopParam(read())}`;
}

export function allScreenIds(): string[] {
  return [...WORKSHOPS.docentes.screens, ...WORKSHOPS.estudiantes.screens].map((s) => s.id);
}
