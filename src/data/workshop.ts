export type MomentId = 'm0' | 'm1' | 'm2' | 'm3' | 'm4' | 'm5';

export interface Moment {
  id: MomentId;
  index: number;
  title: string;
  short: string;
  minutes: number;
  /** Variable CSS del color de acento del momento */
  accent: string;
}

export const MOMENTS: Moment[] = [
  { id: 'm1', index: 1, title: 'Activación e inspiración', short: 'Activar', minutes: 10, accent: 'var(--violet)' },
  { id: 'm2', index: 2, title: 'Conociendo Google AI Studio', short: 'Conocer', minutes: 15, accent: 'var(--blue)' },
  { id: 'm3', index: 3, title: 'Del prompt al recurso interactivo', short: 'Diseñar', minutes: 20, accent: 'var(--cyan)' },
  { id: 'm4', index: 4, title: 'Taller práctico de creación', short: 'Crear', minutes: 35, accent: 'var(--mint)' },
  { id: 'm5', index: 5, title: 'Socialización y cierre', short: 'Compartir', minutes: 10, accent: 'var(--rose)' },
];

export const TOTAL_MINUTES = MOMENTS.reduce((s, m) => s + m.minutes, 0);

export interface FacilitatorNotes {
  objective: string;
  explanation: string;
  steps: string[];
  activity?: string;
  /** Minutos sugeridos para esta pantalla dentro del momento */
  minutes: number;
}

export interface ScreenMeta {
  id: string;
  moment: MomentId;
  title: string;
  kind: 'cover' | 'content' | 'activity' | 'tool';
  notes: FacilitatorNotes;
}

export const SCREENS: ScreenMeta[] = [
  {
    id: 'inicio',
    moment: 'm0',
    title: 'Bienvenida',
    kind: 'cover',
    notes: {
      minutes: 1,
      objective: 'Dar la bienvenida y generar expectativa sobre lo que se va a construir hoy.',
      explanation:
        'Hoy no venimos a ver una presentación sobre IA: venimos a salir con un recurso interactivo creado por cada docente.',
      steps: [
        'Proyecta esta portada mientras llegan los participantes.',
        'Pide que tengan a mano su celular o computador y su cuenta de Google.',
        'Presiona F para pantalla completa y N para abrir o cerrar estas notas.',
      ],
    },
  },
  {
    id: 'ruta',
    moment: 'm0',
    title: 'La ruta de hoy',
    kind: 'content',
    notes: {
      minutes: 1,
      objective: 'Mostrar el recorrido completo de 90 minutos y el producto final esperado.',
      explanation:
        'Cinco momentos: activar, conocer la herramienta, diseñar el prompt, crear y compartir. El 40 % del tiempo es práctica.',
      steps: [
        'Recorre los cinco momentos señalando el tiempo de cada uno.',
        'Enfatiza el producto final: un recurso educativo funcional por docente.',
        'Inicia el cronómetro del Momento 1 desde la barra superior.',
      ],
    },
  },
  {
    id: 'inspiracion',
    moment: 'm1',
    title: '¿Y si tu clase se pudiera jugar?',
    kind: 'content',
    notes: {
      minutes: 3,
      objective: 'Provocar la reflexión sobre la diferencia entre mostrar contenido y diseñar experiencias.',
      explanation:
        'La IA no reemplaza al docente: reduce el tiempo entre una buena idea pedagógica y un recurso que los estudiantes pueden usar.',
      steps: [
        'Lee la pregunta central en voz alta y deja 10 segundos de silencio.',
        'Pregunta: ¿qué recurso han querido crear y nunca tuvieron tiempo de hacer?',
        'Recoge dos o tres respuestas orales y avanza a la votación.',
      ],
    },
  },
  {
    id: 'votacion',
    moment: 'm1',
    title: 'Votación de apertura',
    kind: 'activity',
    notes: {
      minutes: 3,
      objective: 'Diagnosticar la experiencia previa del grupo con la IA.',
      explanation: 'El resultado ajusta el ritmo: si la mayoría nunca ha usado IA, dedica más tiempo al Momento 2.',
      steps: [
        'Activa la actividad con el botón “Abrir votación”.',
        'Invita a los docentes a pasar al tablero y tocar su opción, o a levantar su tarjeta de respuesta desde el celular.',
        'Oculta los resultados mientras votan; muéstralos al cerrar.',
      ],
      activity: 'Votación en el tablero o con tarjetas de respuesta en el celular (QR en pantalla).',
    },
  },
  {
    id: 'tradicional',
    moment: 'm1',
    title: 'Tradicional o interactiva',
    kind: 'activity',
    notes: {
      minutes: 4,
      objective: 'Identificar rasgos de una clase interactiva frente a una clase centrada en la exposición.',
      explanation:
        'Una experiencia interactiva le pide al estudiante decidir, equivocarse y recibir retroalimentación inmediata.',
      steps: [
        'Abre la actividad y llama a un docente por cada situación.',
        'El docente toca “Tradicional” o “Interactiva”; comenta la retroalimentación con el grupo.',
        'Cierra mostrando el puntaje grupal.',
      ],
      activity: 'Clasificación de 8 situaciones de aula con retroalimentación inmediata.',
    },
  },
  {
    id: 'ai-studio',
    moment: 'm2',
    title: 'Google AI Studio',
    kind: 'content',
    notes: {
      minutes: 4,
      objective: 'Presentar Google AI Studio y su modo Build como un taller para construir aplicaciones con lenguaje natural.',
      explanation:
        'En Build se describe la aplicación con palabras; Gemini genera el código, lo muestra funcionando y permite pedir cambios conversando.',
      steps: [
        'Explica el ciclo: describir → generar → probar → mejorar.',
        'Aclara que se usa con una cuenta de Google y que el docente siempre revisa el contenido.',
        'Si hay conexión, abre AI Studio en otra pestaña y muestra la sección Build.',
      ],
    },
  },
  {
    id: 'estacion',
    moment: 'm2',
    title: 'Estación AI Studio',
    kind: 'tool',
    notes: {
      minutes: 6,
      objective: 'Guiar paso a paso el acceso a Google AI Studio y a la sección Build.',
      explanation:
        'Cada docente debe llegar a la pantalla de Build antes de terminar este momento. La interfaz de Google puede cambiar: guíate por los nombres de las secciones.',
      steps: [
        'Proyecta el QR “Abrir Google AI Studio” desde el Centro QR o desde esta pantalla.',
        'Avanza paso a paso y pide una mano arriba cuando cada docente complete el paso.',
        'Ayuda primero a quienes tengan problemas para iniciar sesión.',
      ],
      activity: 'Checklist grupal: los docentes marcan cada paso completado.',
    },
  },
  {
    id: 'reto',
    moment: 'm2',
    title: 'Reto pedagógico',
    kind: 'activity',
    notes: {
      minutes: 5,
      objective: 'Conectar la herramienta con un problema de aprendizaje real de los docentes.',
      explanation:
        'Los mejores recursos nacen de una dificultad concreta, no de la herramienta. Este tablero será la materia prima del laboratorio.',
      steps: [
        'Abre el tablero y pide a 4 o 5 docentes que pasen a escribir el tema que más les cuesta enseñar.',
        'Agrupa por área y pregunta qué tienen en común.',
        'Marca con la estrella el tema que se usará en la demostración del laboratorio.',
      ],
      activity: 'Tablero de temas difíciles con selección del tema para la demostración.',
    },
  },
  {
    id: 'construir',
    moment: 'm3',
    title: 'Construye el prompt',
    kind: 'activity',
    notes: {
      minutes: 6,
      objective: 'Comprender las partes de un prompt efectivo para generar un recurso educativo.',
      explanation:
        'Un prompt efectivo tiene rol, tarea, público, objetivo, experiencia y requisitos técnicos. La metodología ROCAS ayuda a recordarlo.',
      steps: [
        'Abre la actividad. Para cada pieza, pide a un docente que elija el bloque más preciso.',
        'Lee la retroalimentación en voz alta y discute por qué los bloques vagos fallan.',
        'Al final, compara el prompt construido con el medidor de calidad.',
      ],
      activity: 'Ensamblaje del prompt por partes con retroalimentación por bloque.',
    },
  },
  {
    id: 'laboratorio',
    moment: 'm3',
    title: 'Laboratorio de prompts',
    kind: 'tool',
    notes: {
      minutes: 7,
      objective: 'Personalizar el prompt maestro para un tema, grado y objetivo concretos.',
      explanation:
        'El prompt se adapta con cuatro datos. Copiado con un clic, se pega en Build y genera la primera versión del recurso.',
      steps: [
        'Carga el tema marcado en el reto pedagógico o uno de los tres ejemplos.',
        'Completa grado, área y objetivo con aportes del grupo.',
        'Copia el prompt y genera en vivo el recurso en Google AI Studio (si hay conexión).',
      ],
      activity: 'Personalización colectiva del prompt y demostración en vivo.',
    },
  },
  {
    id: 'demo',
    moment: 'm3',
    title: 'Recurso de demostración',
    kind: 'content',
    notes: {
      minutes: 7,
      objective: 'Mostrar un ejemplo terminado del tipo de recurso que van a crear.',
      explanation:
        '“Misión: salvar el planeta” tiene introducción, tres retos, puntos, progreso y resultados: todos los elementos que pide el prompt.',
      steps: [
        'Abre la misión en pantalla completa y juega el primer reto con el grupo.',
        'Pide a un voluntario que resuelva el reto de clasificación en el tablero.',
        'Señala qué partes del prompt produjeron cada elemento de la aplicación.',
      ],
      activity: 'Un voluntario juega un reto frente al grupo.',
    },
  },
  {
    id: 'taller',
    moment: 'm4',
    title: 'Taller práctico',
    kind: 'tool',
    notes: {
      minutes: 30,
      objective: 'Cada docente crea, prueba y mejora su propio recurso educativo interactivo.',
      explanation:
        'Producción guiada en cuatro fases: preparar el prompt, generar, probar como estudiante y pedir mejoras.',
      steps: [
        'Inicia el temporizador de 35 minutos del Momento 4.',
        'Proyecta el QR del prompt para que lo abran en el celular o computador.',
        'Recorre las mesas. Avanza las fases en pantalla para marcar el ritmo del grupo.',
        'A los 30 minutos, pide que guarden o compartan su recurso desde AI Studio.',
      ],
      activity: 'Reto de creación con fases y prompts de mejora listos para copiar.',
    },
  },
  {
    id: 'qr',
    moment: 'm4',
    title: 'Centro de códigos QR',
    kind: 'tool',
    notes: {
      minutes: 5,
      objective: 'Distribuir a los participantes los enlaces del taller.',
      explanation:
        'Los QR internos solo funcionan desde otros dispositivos si la app está publicada o se sirve en la misma red Wi-Fi.',
      steps: [
        'Verifica el estado de la dirección base en la parte superior de la pantalla.',
        'Toca “Ampliar” para proyectar un QR a pantalla completa.',
        'Descarga los QR como imagen si quieres compartirlos por WhatsApp.',
      ],
    },
  },
  {
    id: 'galeria',
    moment: 'm5',
    title: 'Galería de recursos',
    kind: 'activity',
    notes: {
      minutes: 6,
      objective: 'Socializar los recursos creados y recibir retroalimentación entre pares.',
      explanation:
        'Cada presentación dura máximo 2 minutos: qué problema resuelve, para qué grado, y qué mejorarían.',
      steps: [
        'Registra en el tablero cada recurso que se va a presentar.',
        'Usa “Elegir al azar” para sortear el orden.',
        'Activa el foco: muestra el recurso en grande y su QR si el docente compartió un enlace.',
      ],
      activity: 'Galería con sorteo, foco de presentación y temporizador de 2 minutos.',
    },
  },
  {
    id: 'cierre',
    moment: 'm5',
    title: 'Cierre y compromiso',
    kind: 'activity',
    notes: {
      minutes: 4,
      objective: 'Consolidar aprendizajes y concretar un compromiso de aplicación en el aula.',
      explanation: 'La IA propone, el docente dispone: el criterio pedagógico sigue siendo humano.',
      steps: [
        'Repasa el resumen visual de los aprendizajes.',
        'Proyecta el QR de la actividad de salida para que respondan en el celular.',
        'Invita a 3 docentes a escribir su compromiso en el muro.',
      ],
      activity: 'Ticket de salida en el celular y muro de compromisos en el tablero.',
    },
  },
];

export function screenIndex(id: string): number {
  const i = SCREENS.findIndex((s) => s.id === id);
  return i < 0 ? 0 : i;
}

export function momentOf(id: MomentId): Moment | undefined {
  return MOMENTS.find((m) => m.id === id);
}
