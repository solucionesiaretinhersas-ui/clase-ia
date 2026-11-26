import { useSyncExternalStore } from 'react';
import { MOMENTS, SCREENS, TOTAL_MINUTES, type Moment, type ScreenMeta } from './workshop';
import { E_MOMENTS, E_OUTCOMES, E_SCREENS } from './workshop.estudiantes';
import { G_MOMENTS, G_OUTCOMES, G_SCREENS } from './workshop.george';

export type WorkshopId = 'docentes' | 'estudiantes' | 'george';

/** Institución de los talleres originales (los de Santa Rosa de Lima). */
const SANTA_ROSA = { name: 'Institución Educativa Santa Rosa de Lima', short: 'Santa Rosa de Lima' };

export interface WorkshopDef {
  id: WorkshopId;
  /** Institución que recibe el taller (portada, barra superior y certificado). */
  institution: { name: string; short: string };
  /** Solo si es distinta a la de la plantilla del certificado: nombre que se imprime en él. */
  certificateInstitution?: string;
  /** Si se indica, certificado de una sola firma emitido por el facilitador (sin institución). */
  certificateStyle?: 'foro';
  /** Nombre del facilitador que firma el certificado de ese estilo. */
  signer?: string;
  /** Datos del evento que se imprimen en el certificado de estilo `foro`. */
  certificateForo?: { event: string; venue: string; date: string; role: string };
  /** Público mixto (estudiantes y público general): el celular pide curso u ocupación en vez de grado. */
  mixedAudience: boolean;
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
  /** Falso en los talleres que no entregan certificado. */
  hasCertificate: boolean;
  /** Etiqueta del público en contadores y mensajes (p. ej. “docentes”). */
  who: string;
  certificate: { title: string; text: string };
  /** Pantalla cuya fase de laboratorio usa la estación para volver */
  labScreen: string;
  introCover: string;
}

const D_OUTCOMES = [
  'tu idea: qué quieres que la IA haga por ti',
  'una app creada en vivo y tu acceso a Build',
  'tu prompt ROCAS listo para ChatGPT',
  'tu recurso interactivo, probado con la lupa',
  'retroalimentación de tus colegas',
  'tu plan para aplicarlo y tu certificado',
];

function build(def: Omit<WorkshopDef, 'total'>): WorkshopDef {
  return { ...def, total: def.moments.reduce((s, m) => s + m.minutes, 0) };
}

export const WORKSHOPS: Record<WorkshopId, WorkshopDef> = {
  docentes: {
    ...build({
      id: 'docentes',
      institution: SANTA_ROSA,
      label: 'Taller para docentes',
      audience: 'docente',
      subtitle: 'De la idea a la experiencia',
      quote:
        'La inteligencia artificial no transforma la enseñanza por sí sola. La transforman los docentes que se atreven a imaginar con ella.',
      moments: MOMENTS,
      screens: SCREENS,
      outcomes: D_OUTCOMES,
      certificateScreen: 'certificados',
      hasCertificate: true,
      mixedAudience: false,
      who: 'docentes',
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
    institution: SANTA_ROSA,
    label: 'Taller para estudiantes',
    audience: 'estudiante',
    subtitle: 'Crea tu propia aplicación con IA',
    quote: 'La inteligencia artificial es una gran ayudante. Las ideas, las preguntas y las decisiones siguen siendo tuyas.',
    moments: E_MOMENTS,
    screens: E_SCREENS,
    outcomes: E_OUTCOMES,
    certificateScreen: 'e-certificados',
    hasCertificate: true,
    mixedAudience: false,
    who: 'estudiantes',
    certificate: {
      title: 'Crea tu propia aplicación con IA',
      text: 'por su participación en el taller de inteligencia artificial y creación de aplicaciones con Google AI Studio',
    },
    labScreen: 'e-lab',
    introCover: 'e-inicio',
  }),
  george: build({
    id: 'george',
    institution: { name: 'Georges Noble School', short: 'Georges Noble School' },
    label: 'Georges Noble School',
    audience: 'estudiante',
    subtitle: 'De la innovación a la transformación de realidades',
    quote: 'El verdadero poder de la inteligencia artificial no está en lo que puede generar, sino en las realidades que podemos transformar con ella.',
    moments: G_MOMENTS,
    screens: G_SCREENS,
    outcomes: G_OUTCOMES,
    certificateScreen: 'g-d14',
    hasCertificate: true,
    certificateStyle: 'foro',
    signer: 'Luis Alejandro Caldera Caldera',
    // Foro Intersectorial sobre Inteligencia Artificial, 28 de noviembre de 2026, 8:00 a. m. a 10:00 a. m.
    certificateForo: {
      event: 'Foro Intersectorial sobre Inteligencia Artificial',
      venue: 'Georges Noble School',
      date: '2026-11-28',
      role: 'Panelista · Universidad de Córdoba',
    },
    mixedAudience: true,
    who: 'participantes',
    certificate: {
      title: 'Inteligencia Artificial: de la innovación a la transformación de realidades',
      text: 'por su participación en la ponencia',
    },
    labScreen: 'g-d14',
    introCover: 'g-inicio',
  }),
};

/* ───────── Taller activo (se guarda en este dispositivo) ───────── */
const KEY = 'aula-ia:workshop:mode';
const EVENT = 'aula-ia:workshop';

function read(): WorkshopId {
  try {
    const v = window.localStorage.getItem(KEY);
    if (v === 'docentes' || v === 'estudiantes' || v === 'george') return v;
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

/** Convierte el parámetro `w` de la URL (`e` / `d` / `g`) en el taller correspondiente. */
export function workshopFromParam(w: string): WorkshopId | null {
  if (w === 'e') return 'estudiantes';
  if (w === 'd') return 'docentes';
  if (w === 'g') return 'george';
  return null;
}

export const workshopParam = (id: WorkshopId) => (id === 'estudiantes' ? 'e' : id === 'george' ? 'g' : 'd');

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
  return Object.values(WORKSHOPS).flatMap((w) => w.screens.map((s) => s.id));
}
