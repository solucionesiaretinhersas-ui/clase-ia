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
  /** A · otras acciones, en texto libre */
  accionExtra: string;
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
  'bienvenida y objetivos de la clase',
  'explicación breve con ejemplos de mi contexto',
  'un simulador o laboratorio para explorar',
  'actividades con retroalimentación inmediata',
  'una evaluación final',
  'un cierre con reflexión',
];

export const SOLUCIONES = [
  'un aula interactiva completa en una sola aplicación web, con menú de navegación por momentos de la clase y textos y botones grandes para proyectar en el tablero',
  'un aula interactiva con un recorrido guiado por la clase, donde el estudiante avanza de la exploración a la práctica y a la evaluación, y yo veo su progreso',
  'una experiencia por estaciones o misiones, en una sola aplicación, que se pueda manejar desde el computador, la tableta y el celular',
];
export const EMPTY_FIELDS: PromptFields = {
  tema: '',
  grado: '',
  area: '',
  objetivo: '',
  contexto: '',
  rol: ROLES[0],
  acciones: ACCIONES.slice(0, 5),
  accionExtra: '',
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
    acciones:
      (list.length > 1 ? `${list.slice(0, -1).join(', ')} y ${list[list.length - 1]}` : list[0]) +
      (f.accionExtra.trim() ? `; además, ${f.accionExtra.trim().replace(/\.$/, '')}` : ''),
    solucion: f.solucion.trim() || SOLUCIONES[0],
  };
}

/**
 * Mensaje para ChatGPT con ROCAS. Le pide que escriba el prompt que luego se pegará en Google AI Studio
 * para construir el aula interactiva completa.
 */
export function buildChatGptPrompt(f: PromptFields): string {
  const p = parts(f);
  return (
    `R — ROL: Actúa como ${p.rol}, experto en crear prompts para Google AI Studio (Build).\n\n` +
    `O — OBJETIVO: Quiero crear una clase sobre ${p.tema}${p.areaTxt} para estudiantes de ${p.grado} dentro de Google AI Studio. El objetivo de aprendizaje es ${p.objetivo}.\n\n` +
    `C — CONTEXTO: ${p.contexto}.\n\n` +
    `A — ACCIÓN: Diseña la clase completa y conviértela en un prompt para Google AI Studio. El aula debe incluir: ${p.acciones}. ` +
    `Organiza todo en momentos (inicio, exploración, práctica, evaluación y cierre) para que todo lo de la clase quede en un solo lugar.\n\n` +
    `S — SOLUCIÓN: Entrégame únicamente el prompt listo para copiar y pegar en Google AI Studio, que construya ${p.solucion}.`
  );
}
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