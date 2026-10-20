export interface PromptFields {
  tema: string;
  grado: string;
  area: string;
  objetivo: string;
}

export const EMPTY_FIELDS: PromptFields = { tema: '', grado: '', area: '', objetivo: '' };

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

/** Construye el prompt maestro del taller. Los campos vacíos quedan como [MARCADOR]. */
export function buildPrompt(f: PromptFields): string {
  const tema = f.tema.trim() || '[TEMA]';
  const grado = f.grado.trim() || '[GRADO]';
  const area = f.area.trim();
  const objetivo = f.objetivo.trim().replace(/\.$/, '') || '[OBJETIVO]';
  const areaTxt = area ? ` del área de ${area}` : '';
  return (
    `Actúa como diseñador de experiencias educativas interactivas. ` +
    `Crea un recurso para enseñar ${tema}${areaTxt} a estudiantes de ${grado}. ` +
    `El objetivo de aprendizaje es ${objetivo}. ` +
    `Diseña una experiencia visual moderna con una explicación breve, ejemplos, actividades interactivas, ` +
    `preguntas con retroalimentación inmediata y una actividad final de evaluación. ` +
    `Utiliza instrucciones claras, navegación intuitiva y una interfaz adaptable a computadores, tabletas y celulares. ` +
    `El recurso debe ser funcional y no limitarse a una presentación estática.`
  );
}

export function missingFields(f: PromptFields): (keyof PromptFields)[] {
  return (Object.keys(f) as (keyof PromptFields)[]).filter((k) => !f[k].trim());
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
      objetivo:
        'que los estudiantes expliquen las etapas del ciclo del agua y propongan dos acciones para proteger una fuente de agua de su entorno',
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
      objetivo:
        'que los estudiantes reconozcan, representen y comparen fracciones equivalentes resolviendo problemas de la vida cotidiana',
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
      objetivo:
        'que los estudiantes diseñen secuencias de instrucciones, identifiquen errores en un algoritmo y los corrijan',
    },
  },
];

/** Prompts de iteración para pedir mejoras en Build */
export const REFINEMENTS: { title: string; prompt: string }[] = [
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
    title: 'Accesibilidad',
    prompt:
      'Mejora la accesibilidad: textos más grandes, buen contraste, botones grandes para celular y que todo funcione también con el teclado.',
  },
  {
    title: 'Corregir un error',
    prompt:
      'Hay un error: [DESCRIBE QUÉ HICISTE Y QUÉ PASÓ]. Corrígelo sin cambiar el resto del diseño y explícame qué modificaste.',
  },
];
