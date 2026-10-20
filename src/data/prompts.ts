export interface PromptFields {
  tema: string;
  grado: string;
  area: string;
  objetivo: string;
  contexto: string;
}

export const EMPTY_FIELDS: PromptFields = { tema: '', grado: '', area: '', objetivo: '', contexto: '' };

/** Mezcla datos guardados con la forma actual (por si vienen de una versión anterior). */
export function normalizeFields(f: Partial<PromptFields> | null | undefined): PromptFields {
  return { ...EMPTY_FIELDS, ...(f ?? {}) };
}

export const GRADOS = [
  'Transición',
  'grado primero',
  'grado segundo',
  'grado tercero',
  'grado cuarto',
  'grado quinto',
  'grado sexto',
  'grado séptimo',
  'grado octavo',
  'grado noveno',
  'grado décimo',
  'grado undécimo',
];

export const AREAS = [
  'Ciencias Naturales',
  'Matemáticas',
  'Lengua Castellana',
  'Ciencias Sociales',
  'Inglés',
  'Tecnología e Informática',
  'Educación Artística',
  'Educación Física',
  'Ética y Valores',
  'Educación Religiosa',
  'Filosofía',
  'Química',
  'Física',
];

function parts(raw: PromptFields) {
  const f = normalizeFields(raw);
  const area = f.area.trim();
  return {
    tema: f.tema.trim() || '[TEMA]',
    grado: f.grado.trim() || '[GRADO]',
    areaTxt: area ? ` del área de ${area}` : '',
    objetivo: f.objetivo.trim().replace(/\.$/, '') || '[OBJETIVO DE APRENDIZAJE]',
    contexto: f.contexto.trim().replace(/\.$/, '') || '[CONTEXTO DE TU AULA Y TUS ESTUDIANTES]',
  };
}

/** Prompt 1 · ChatGPT: estructura de la clase, qué debe tener cada parte. */
export function buildChatGptPrompt(f: PromptFields): string {
  const p = parts(f);
  return (
    `Actúa como un diseñador instruccional y pedagogo experto en experiencias de aprendizaje interactivas. ` +
    `Voy a crear una clase sobre ${p.tema}${p.areaTxt} para estudiantes de ${p.grado}. ` +
    `El objetivo de aprendizaje es ${p.objetivo}. ` +
    `Contexto de mi aula: ${p.contexto}. ` +
    `Entrégame la estructura de la clase indicando qué debe tener cada parte: 1) inicio o motivación, 2) explicación breve, ` +
    `3) ejemplos cercanos a mi contexto, 4) actividades interactivas y simuladores que se puedan proyectar en el tablero ` +
    `para que los estudiantes pasen a usarlos, 5) preguntas con retroalimentación inmediata y 6) evaluación final. ` +
    `Para cada parte indica su propósito, una duración sugerida y qué hace el estudiante. ` +
    `Prioriza recursos interactivos y no solo texto. Al final, dame una lista breve para revisar la clase antes de usarla.`
  );
}

/** Prompt 2 · Google AI Studio (Build): construir el recurso a partir de la estructura. */
export function buildStudioPrompt(f: PromptFields): string {
  const p = parts(f);
  return (
    `Actúa como diseñador de experiencias educativas interactivas. ` +
    `Crea un recurso para enseñar ${p.tema}${p.areaTxt} a estudiantes de ${p.grado}. ` +
    `El objetivo de aprendizaje es ${p.objetivo}. ` +
    `Contexto de mis estudiantes y mi aula: ${p.contexto}. ` +
    `Sigue esta estructura de clase: [PEGA AQUÍ LA ESTRUCTURA QUE TE DIO CHATGPT]. ` +
    `Diseña una experiencia visual moderna con una explicación breve, ejemplos, actividades interactivas y al menos un simulador, ` +
    `preguntas con retroalimentación inmediata y una actividad final de evaluación. ` +
    `Debe poder proyectarse en el tablero: textos grandes, botones grandes y un estudiante que pase a manejarlo frente al grupo. ` +
    `Utiliza instrucciones claras, navegación intuitiva y una interfaz adaptable a computadores, tabletas y celulares. ` +
    `El recurso debe ser funcional y no limitarse a una presentación estática.`
  );
}

/** Compatibilidad con el prompt maestro original. */
export const buildPrompt = buildStudioPrompt;

export function missingFields(f: PromptFields): (keyof PromptFields)[] {
  const n = normalizeFields(f);
  return (Object.keys(n) as (keyof PromptFields)[]).filter((k) => !n[k].trim());
}

export interface PromptExample {
  id: string;
  label: string;
  kind: string;
  fields: PromptFields;
}

export const EXAMPLES: PromptExample[] = [
  {
    id: 'ciencias',
    label: 'Ciencias Naturales',
    kind: 'Actividad',
    fields: {
      tema: 'el ciclo del agua y su relación con el cuidado de las fuentes hídricas',
      grado: 'grado sexto',
      area: 'Ciencias Naturales',
      objetivo: 'que los estudiantes expliquen las etapas del ciclo del agua y propongan dos acciones para proteger una fuente de agua de su entorno',
      contexto: 'grupo de 32 estudiantes, una sala con video beam, conectividad limitada en casa y un río cercano a la institución',
    },
  },
  {
    id: 'matematicas',
    label: 'Matemáticas',
    kind: 'Reto',
    fields: {
      tema: 'las fracciones equivalentes a través de un reto de repartir pizzas y recetas',
      grado: 'grado quinto',
      area: 'Matemáticas',
      objetivo: 'que los estudiantes reconozcan, representen y comparen fracciones equivalentes resolviendo problemas de la vida cotidiana',
      contexto: 'grupo de 28 estudiantes con ritmos muy distintos, les motivan los juegos y el trabajo en parejas',
    },
  },
  {
    id: 'tecnologia',
    label: 'Tecnología e Informática',
    kind: 'Recurso',
    fields: {
      tema: 'los algoritmos y el pensamiento computacional guiando a un robot por un laberinto',
      grado: 'grado octavo',
      area: 'Tecnología e Informática',
      objetivo: 'que los estudiantes diseñen secuencias de instrucciones, identifiquen errores en un algoritmo y los corrijan',
      contexto: 'sala de informática con 15 computadores, trabajan en parejas y varios nunca han programado',
    },
  },
];

/** Prompts de iteración para pedir mejoras en Build */
export const REFINEMENTS: { title: string; prompt: string }[] = [
  {
    title: 'Añadir un simulador',
    prompt:
      'Agrega un simulador interactivo donde el estudiante pueda cambiar [VARIABLE] y ver de inmediato qué ocurre. Debe verse bien proyectado en el tablero.',
  },
  {
    title: 'Contexto de mi comunidad',
    prompt:
      'Cambia los ejemplos y los nombres por situaciones de mi contexto: [DESCRIBE TU MUNICIPIO, TU COLEGIO O TU REGIÓN].',
  },
  {
    title: 'Ajustar el nivel',
    prompt:
      'Revisa todo el contenido y ajusta el vocabulario y la dificultad para estudiantes de [GRADO]. Usa frases cortas y ejemplos del contexto colombiano.',
  },
  {
    title: 'Más retroalimentación',
    prompt:
      'Cuando el estudiante responda mal, no muestres solo “incorrecto”: explica por qué, da una pista y permite intentarlo de nuevo.',
  },
  {
    title: 'Puntos y progreso',
    prompt:
      'Agrega un sistema de puntos, una barra de progreso visible y una pantalla final con el resultado y un mensaje según el desempeño.',
  },
  {
    title: 'Para el tablero',
    prompt:
      'Haz que todo se vea y se use bien proyectado: textos grandes, buen contraste y botones grandes para que un estudiante pase a manejarlo frente al grupo.',
  },
  {
    title: 'Corregir un error',
    prompt:
      'Hay un error: [DESCRIBE QUÉ HICISTE Y QUÉ PASÓ]. Corrígelo sin cambiar el resto del diseño y explícame qué modificaste.',
  },
];
