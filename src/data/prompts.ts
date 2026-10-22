export interface PromptFields {
  tema: string;
  grado: string;
  area: string;
  objetivo: string;
  contexto: string;
  /** R · quién debe ser la IA */
  rol: string;
  /** A · partes que debe incluir (marcadas) */
  acciones: string[];
  /** S · formato del resultado esperado */
  solucion: string;
}

export const ROLES = [
  'diseñador de experiencias educativas interactivas',
  'diseñador instruccional experto en metodologías activas',
  'tutor experto en didáctica de la materia',
  'coach pedagógico que acompaña a docentes',
];

export const ACCIONES = [
  'una explicación breve',
  'ejemplos cercanos a mi contexto',
  'actividades interactivas',
  'un simulador que se pueda proyectar en el tablero',
  'preguntas con retroalimentación inmediata',
  'una evaluación final',
];

export const SOLUCIONES = [
  'la estructura de la clase en una tabla con el propósito, la duración y lo que hace el estudiante en cada parte, y una lista de verificación para revisarla',
  'una guía de aprendizaje lista para usar, con títulos claros y una rúbrica de 3 niveles',
  'una secuencia de actividades numeradas con instrucciones para el docente y para el estudiante',
];

export const EMPTY_FIELDS: PromptFields = {
  tema: '',
  grado: '',
  area: '',
  objetivo: '',
  contexto: '',
  rol: ROLES[0],
  acciones: ACCIONES.slice(0, 5),
  solucion: SOLUCIONES[0],
};

/** Mezcla datos guardados con la forma actual (por si vienen de una versión anterior). */
export function normalizeFields(f: Partial<PromptFields> | null | undefined): PromptFields {
  const m = { ...EMPTY_FIELDS, ...(f ?? {}) };
  return { ...m, acciones: Array.isArray(m.acciones) ? m.acciones : EMPTY_FIELDS.acciones };
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
  const list = f.acciones.length ? f.acciones : ACCIONES.slice(0, 3);
  return {
    rol: f.rol.trim() || ROLES[0],
    tema: f.tema.trim() || '[TEMA]',
    grado: f.grado.trim() || '[GRADO]',
    areaTxt: area ? ` del área de ${area}` : '',
    objetivo: f.objetivo.trim().replace(/\.$/, '') || '[OBJETIVO DE APRENDIZAJE]',
    contexto: f.contexto.trim().replace(/\.$/, '') || '[CONTEXTO DE TU AULA Y TUS ESTUDIANTES]',
    acciones: list.length > 1 ? `${list.slice(0, -1).join(', ')} y ${list[list.length - 1]}` : list[0],
    solucion: f.solucion.trim() || SOLUCIONES[0],
  };
}

/** Prompt 1 · ChatGPT, con la metodología ROCAS: la estructura de la clase. */
export function buildChatGptPrompt(f: PromptFields): string {
  const p = parts(f);
  return (
    `R — ROL: Actúa como ${p.rol}.\n\n` +
    `O — OBJETIVO: Quiero crear una clase sobre ${p.tema}${p.areaTxt} para estudiantes de ${p.grado}. El objetivo de aprendizaje es ${p.objetivo}.\n\n` +
    `C — CONTEXTO: ${p.contexto}.\n\n` +
    `A — ACCIÓN: Diseña la clase indicando qué debe tener cada parte: ${p.acciones}. Prioriza experiencias interactivas y no solo texto; ` +
    `para cada parte indica su propósito, una duración sugerida y qué hace el estudiante.\n\n` +
    `S — SOLUCIÓN: Entrégame ${p.solucion}.`
  );
}

/** Prompt 2 · Google AI Studio (Build), también con ROCAS: construir el recurso. */
export function buildStudioPrompt(f: PromptFields): string {
  const p = parts(f);
  return (
    `R — ROL: Actúa como desarrollador de experiencias educativas interactivas, experto en diseño pedagógico.\n\n` +
    `O — OBJETIVO: Crea una aplicación web para enseñar ${p.tema}${p.areaTxt} a estudiantes de ${p.grado}. El objetivo de aprendizaje es ${p.objetivo}.\n\n` +
    `C — CONTEXTO: ${p.contexto}.\n\n` +
    `A — ACCIÓN: Sigue esta estructura de clase: [PEGA AQUÍ LA ESTRUCTURA QUE TE DIO CHATGPT]. Incluye ${p.acciones}, ` +
    `y al menos una actividad en la que un estudiante pase al tablero a manejarla frente al grupo.\n\n` +
    `S — SOLUCIÓN: Una aplicación web funcional (no una presentación estática), con textos y botones grandes para proyectar, navegación intuitiva y adaptable a computador, tableta y celular.`
  );
}

/** Compatibilidad con el prompt maestro original. */
export const buildPrompt = buildStudioPrompt;

export function missingFields(f: PromptFields): (keyof PromptFields)[] {
  const n = normalizeFields(f);
  return (['tema', 'grado', 'objetivo', 'contexto'] as const).filter((k) => !n[k].trim());
}

export interface PromptExample {
  id: string;
  label: string;
  kind: string;
  fields: Partial<PromptFields>;
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

/* ───────── Taller de estudiantes ───────── */
export interface StudentFields {
  idea: string;
  tipo: string;
  usuarios: string;
  funciona: string;
  estilo: string;
}

export const EMPTY_STUDENT: StudentFields = { idea: '', tipo: 'Juego', usuarios: '', funciona: '', estilo: '' };
export const STUDENT_TYPES = ['Juego', 'Quiz o trivia', 'Simulador', 'Historia interactiva', 'Herramienta para estudiar', 'Asistente creativo'];

export function buildStudentPrompt(raw: Partial<StudentFields>): string {
  const f = { ...EMPTY_STUDENT, ...raw };
  const idea = f.idea.trim() || '[TU IDEA]';
  const usuarios = f.usuarios.trim() || '[PARA QUIÉN ES]';
  const funciona = f.funciona.trim() || '[CÓMO SE JUEGA O SE USA]';
  const estilo = f.estilo.trim() || '[ESTILO VISUAL: colores, ambiente, personajes]';
  return (
    `Actúa como un desarrollador web experto y creativo. Crea una aplicación web de tipo "${f.tipo}": ${idea}. ` +
    `Va dirigida a ${usuarios}. ` +
    `Así debe funcionar: ${funciona}. ` +
    `Estilo visual: ${estilo}. ` +
    `Incluye una pantalla de inicio, instrucciones claras, puntos o progreso visibles, retroalimentación inmediata y una pantalla final. ` +
    `Debe funcionar bien en celular y en computador, con botones grandes y buen contraste. ` +
    `Quiero que sea divertida y funcional, no solo un diseño. ` +
    `Cuando termines, explícame en tres frases sencillas cómo la construiste.`
  );
}

export function missingStudent(raw: Partial<StudentFields>): string[] {
  const f = { ...EMPTY_STUDENT, ...raw };
  return (['idea', 'usuarios', 'funciona', 'estilo'] as const).filter((k) => !f[k].trim());
}

export const STUDENT_REFINEMENTS: { title: string; prompt: string }[] = [
  {
    title: 'Agrega IA con Gemini',
    prompt:
      'Agrega una función de inteligencia artificial con Gemini dentro de mi aplicación: [QUÉ DEBE HACER, por ejemplo inventar preguntas nuevas, dar pistas o conversar con un personaje]. Si necesita una clave o permiso, explícame cómo configurarlo de forma segura.',
  },
  {
    title: 'Más niveles y puntos',
    prompt: 'Agrega 3 niveles que se vayan poniendo más difíciles, un sistema de puntos y una pantalla final con mi mejor puntaje.',
  },
  {
    title: 'Cambia el estilo',
    prompt: 'Cambia el diseño a un estilo [DESCRIBE: espacial, selva, retro, caricatura…] con colores llamativos, sin cambiar cómo funciona.',
  },
  {
    title: 'Ajusta la dificultad',
    prompt: 'Haz la aplicación [MÁS FÁCIL / MÁS DIFÍCIL] y agrega un botón para elegir la dificultad al empezar.',
  },
  {
    title: 'Animaciones y sonido',
    prompt: 'Agrega animaciones suaves y efectos de sonido sencillos, con un botón para silenciar.',
  },
  {
    title: 'Corregir un error',
    prompt: 'Hay un error: [DESCRIBE QUÉ HICISTE Y QUÉ PASÓ]. Corrígelo sin cambiar el resto y explícame qué modificaste.',
  },
  {
    title: 'Explícame el código',
    prompt: 'Explícame con palabras sencillas cómo funciona mi aplicación y qué parte controla [LO QUE QUIERO ENTENDER].',
  },
];