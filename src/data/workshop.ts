export type MomentId = string;

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
  { id: 'm1', index: 1, title: 'Apertura: la IA como copiloto', short: 'Abrir', minutes: 12, accent: 'var(--violet)' },
  { id: 'm2', index: 2, title: 'Conociendo Google AI Studio', short: 'Conocer', minutes: 10, accent: 'var(--blue)' },
  { id: 'm3', index: 3, title: 'Diseña tu clase con ChatGPT', short: 'Planear', minutes: 18, accent: 'var(--cyan)' },
  { id: 'm4', index: 4, title: 'Construye y perfecciona en AI Studio', short: 'Crear', minutes: 35, accent: 'var(--mint)' },
  { id: 'm5', index: 5, title: 'Socialización de recursos', short: 'Compartir', minutes: 7, accent: 'var(--amber)' },
  { id: 'm6', index: 6, title: 'Cierre ético y humano', short: 'Cerrar', minutes: 8, accent: 'var(--rose)' },
];

export const TOTAL_MINUTES = MOMENTS.reduce((s, m) => s + m.minutes, 0);

export interface FacilitatorNotes {
  objective: string;
  explanation: string;
  steps: string[];
  activity?: string;
  /** Qué ven y hacen los docentes en su celular mientras esta pantalla está proyectada */
  participant: string;
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
      participant: 'Escanea el QR de la siguiente pantalla para seguir el taller desde tu celular.',
      objective: 'Dar la bienvenida y generar expectativa sobre lo que se va a construir hoy.',
      explanation:
        'Hoy no venimos a ver una presentación sobre IA: venimos a salir con un recurso interactivo creado por cada docente, con su criterio y su contexto.',
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
      participant: 'Escanea el QR, escribe tu nombre y entra: tu celular te acompañará todo el taller con los enlaces que vayamos abriendo.',
      objective: 'Mostrar el recorrido de 90 minutos y conectar a los docentes con el seguimiento en vivo.',
      explanation:
        'Seis momentos: abrir con la charla, conocer AI Studio, planear con ChatGPT, crear y perfeccionar, compartir y cerrar. Más de un tercio del tiempo es práctica.',
      steps: [
        'Recorre los seis momentos señalando el tiempo de cada uno.',
        'Pide que escaneen el único QR del taller y escriban su nombre: con él se arma la ruleta de participación.',
        'Inicia el cronómetro del Momento 1 desde la barra superior (tecla T).',
      ],
    },
  },
  {
    id: 'votacion',
    moment: 'm1',
    title: 'Votación de apertura',
    kind: 'activity',
    notes: {
      minutes: 2,
      participant: 'Escanea el QR del tablero, toca tu respuesta y mira cómo se suma la del grupo.',
      objective: 'Diagnosticar cuánta experiencia tiene el grupo con la IA y romper el hielo.',
      explanation: 'El resultado ajusta el ritmo: si la mayoría nunca ha usado IA, dedica más tiempo al Momento 2.',
      steps: [
        'Activa la actividad con “Abrir votación”.',
        'Los docentes votan desde el celular (en vivo) o pasan al tablero.',
        'Muestra los resultados y comenta el punto de partida del grupo.',
      ],
      activity: 'Votación en vivo desde los celulares, o conteo manual en el tablero.',
    },
  },
  {
    id: 'copiloto',
    moment: 'm1',
    title: 'La IA es tu copiloto',
    kind: 'content',
    notes: {
      minutes: 4,
      participant: 'Escucha la charla. Idea clave: tú diriges, la IA propone. La sabiduría sigue siendo humana.',
      objective: 'Instalar la idea de docencia aumentada: la IA llegó para ayudar, no para reemplazar.',
      explanation:
        'Piloto y copiloto: el docente decide el rumbo; la IA acelera borradores, ejemplos y simuladores. Lo que ella no tiene: conocer a tus estudiantes, empatía, criterio y vínculo.',
      steps: [
        'Cuenta cómo se está usando hoy la IA en las clases (planeación, materiales, retroalimentación).',
        'Explica “docencia aumentada”: la suma del docente y la IA vale más que cada uno por separado.',
        'Insiste: la parte humana —sabiduría, contexto, cuidado— no se delega.',
        'Cierra con la pregunta: ¿qué te gustaría que la IA hiciera por ti para tener más tiempo con tus estudiantes?',
      ],
      activity: 'Charla breve con una pregunta abierta al grupo.',
    },
  },
  {
    id: 'lluvia',
    moment: 'm1',
    title: 'Lluvia de ideas',
    kind: 'activity',
    notes: {
      minutes: 3,
      participant: 'Escribe tu idea en el celular y envíala: aparecerá en el tablero al instante.',
      objective: 'Abrir un espacio de diálogo: que cada docente exprese qué espera de la IA.',
      explanation:
        'Las ideas del grupo muestran para qué se quiere la IA: ahorrar tiempo, crear recursos, personalizar. Ahí está la oportunidad de la docencia aumentada.',
      steps: [
        'Pulsa “Abrir muro” y pide que escaneen el QR y escriban su idea.',
        'Lee en voz alta 3 o 4 ideas, destaca las que más se repiten con la estrella y oculta las que no aplican.',
        'Conecta con la siguiente actividad: ¿qué tareas ayuda la IA y cuáles solo tú puedes hacer?',
      ],
      activity: 'Muro de ideas con participación desde los celulares.',
    },
  },
  {
    id: 'humano-ia',
    moment: 'm1',
    title: '¿La IA ayuda o solo tú?',
    kind: 'activity',
    notes: {
      minutes: 3,
      participant: 'Para cada situación, toca en tu celular si la IA ayuda o si solo tú puedes hacerlo.',
      objective: 'Distinguir qué tareas puede acelerar la IA y cuáles solo puede hacer el docente.',
      explanation:
        'La IA ayuda con borradores y variantes; la decisión pedagógica, el cuidado de los estudiantes y la verificación son responsabilidad humana.',
      steps: [
        'Abre la actividad y llama a un docente por situación.',
        'Pide que justifique su elección antes de tocar el botón.',
        'Comenta la retroalimentación y cierra con el resumen de lo humano.',
      ],
      activity: 'Clasificación de 8 tareas docentes: la IA ayuda / solo tú.',
    },
  },
  {
    id: 'ai-studio',
    moment: 'm2',
    title: 'Google AI Studio',
    kind: 'content',
    notes: {
      minutes: 3,
      participant: 'Conoce Google AI Studio y su sección Build: describes una aplicación y la IA la construye.',
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
      minutes: 7,
      participant: 'Sigue los pasos de la guía hasta llegar a Build. Marca cada paso cuando lo completes.',
      objective: 'Guiar paso a paso el acceso a Google AI Studio y a la sección Build.',
      explanation:
        'Cada docente debe llegar a la pantalla de Build antes de terminar este momento. La interfaz de Google puede cambiar: guíate por los nombres de las secciones.',
      steps: [
        'Pide que abran Google AI Studio desde el enlace que ya aparece en su celular.',
        'Avanza paso a paso y pide una mano arriba cuando cada docente complete el paso.',
        'Ayuda primero a quienes tengan problemas para iniciar sesión.',
      ],
      activity: 'Checklist grupal: los docentes marcan cada paso completado.',
    },
  },
  {
    id: 'reto',
    moment: 'm3',
    title: 'Reto pedagógico',
    kind: 'activity',
    notes: {
      minutes: 4,
      participant: 'Escribe desde tu celular el tema que más te cuesta enseñar: aparecerá en el tablero.',
      objective: 'Conectar la herramienta con un problema de aprendizaje real de cada docente.',
      explanation:
        'Los mejores recursos nacen de una dificultad concreta, no de la herramienta. Este tablero es la materia prima del laboratorio.',
      steps: [
        'Abre el tablero y pide a 4 o 5 docentes que pasen a escribir el tema que más les cuesta enseñar.',
        'Agrupa por área y pregunta qué tienen en común.',
        'Marca con la estrella el tema que se usará en la demostración del laboratorio.',
      ],
      activity: 'Tablero de temas difíciles con selección del tema para la demostración.',
    },
  },
  {
    id: 'tradicional',
    moment: 'm3',
    title: 'Tradicional o interactiva',
    kind: 'activity',
    notes: {
      minutes: 4,
      participant: 'Para cada situación, toca en tu celular: ¿clase tradicional o interactiva?',
      objective: 'Identificar qué hace interactiva una clase para pedírselo después a la IA: simuladores, decisiones, retroalimentación.',
      explanation:
        'Una experiencia interactiva le pide al estudiante decidir, equivocarse y recibir retroalimentación inmediata. Eso es lo que vamos a solicitar.',
      steps: [
        'Abre la actividad y llama a un docente por cada situación.',
        'El docente toca “Tradicional” o “Interactiva”; comenta la retroalimentación.',
        'Cierra pidiendo ideas de simuladores que serían útiles en sus áreas.',
      ],
      activity: 'Clasificación de 8 situaciones de aula con retroalimentación inmediata.',
    },
  },
  {
    id: 'construir',
    moment: 'm3',
    title: 'Construye el prompt',
    kind: 'activity',
    notes: {
      minutes: 4,
      participant: 'Observa qué piezas hacen un buen prompt: rol, tema, objetivo, experiencia y requisitos técnicos.',
      objective: 'Comprender las partes de un prompt efectivo para generar un recurso educativo.',
      explanation:
        'Un prompt efectivo tiene rol, tema y público, objetivo, experiencia y requisitos técnicos. Cuanto más concreto tu contexto, mejor el resultado.',
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
      minutes: 6,
      participant: 'Completa tus datos, copia el Prompt 1 y pégalo en ChatGPT para que estructure tu clase.',
      objective: 'Definir los parámetros de la clase y obtener la estructura con ChatGPT (Prompt 1).',
      explanation:
        'Primero se pregunta a ChatGPT qué debe tener cada parte de la clase. Esa estructura será la base del Prompt 2 para AI Studio.',
      steps: [
        'Carga el tema marcado en el reto pedagógico o uno de los tres ejemplos.',
        'Los docentes completan tema, grado, área, objetivo y contexto de su aula.',
        'Copian el Prompt 1, lo pegan en ChatGPT y guardan la estructura que les devuelve.',
        'Recuerda: describan cosas puntuales de su contexto. Esa es la parte humana que la IA no puede inventar.',
      ],
      activity: 'Personalización del prompt y consulta a ChatGPT en vivo.',
    },
  },
  {
    id: 'demo',
    moment: 'm4',
    title: 'Recurso de demostración',
    kind: 'content',
    notes: {
      minutes: 5,
      participant: 'Mira el ejemplo terminado: así puede verse el recurso que vas a crear.',
      objective: 'Mostrar un ejemplo terminado del tipo de recurso que van a crear.',
      explanation:
        '“Misión: salvar el planeta” tiene introducción, tres retos, puntos, progreso y resultados: lo que pide el prompt para AI Studio.',
      steps: [
        'Abre la misión en pantalla completa y juega el primer reto con el grupo.',
        'Pide a un voluntario que resuelva un reto en el tablero.',
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
      participant: 'Pega el Prompt 2 con tu estructura en AI Studio (Build), prueba el resultado y perfecciónalo con tus mejoras.',
      objective: 'Cada docente genera su recurso en AI Studio, lo humaniza con su contexto y lo perfecciona.',
      explanation:
        'Cuatro fases: estructura (ya con ChatGPT), generar en Build, humanizar con contexto propio y perfeccionar probando como estudiante.',
      steps: [
        'Inicia el temporizador de 35 minutos del Momento 4.',
        'Pide que incluyan siempre interactividad: simuladores y actividades para que un estudiante pase al tablero proyectado.',
        'Recorre las mesas. Avanza las fases en pantalla para marcar el ritmo del grupo.',
        'Recuerda en voz alta la parte humana: contexto, ejemplos de su comunidad, criterio para revisar.',
        'A los 30 minutos, pide que guarden o preparen su recurso para presentarlo.',
      ],
      activity: 'Reto de creación con fases y prompts de mejora listos para copiar.',
    },
  },
  {
    id: 'galeria',
    moment: 'm5',
    title: 'Galería de recursos',
    kind: 'activity',
    notes: {
      minutes: 4,
      participant: 'Uno o dos docentes presentan su recurso. Prepárate para dar retroalimentación.',
      objective: 'Socializar uno o dos recursos creados y recibir retroalimentación entre pares.',
      explanation:
        'Cada presentación dura máximo 2 minutos: qué problema resuelve, cómo lo hicieron y qué les pareció el proceso.',
      steps: [
        'Registra en el tablero los recursos que se van a presentar.',
        'Usa “Elegir al azar” o invita a voluntarios.',
        'Pregunta al docente: ¿qué mejoró después de la primera versión? ¿qué aportó usted que la IA no sabía?',
      ],
      activity: 'Galería con sorteo, foco de presentación y temporizador de 2 minutos.',
    },
  },
  {
    id: 'dialogo',
    moment: 'm5',
    title: 'Diálogo y reflexión',
    kind: 'activity',
    notes: {
      minutes: 3,
      participant: 'Después de ver los recursos, comparte un aprendizaje, una duda o una idea desde tu celular.',
      objective: 'Dialogar y reflexionar colectivamente sobre lo visto en los recursos presentados.',
      explanation:
        'El aprendizaje entre colegas multiplica el valor del taller: cada recurso despierta ideas para otra aula.',
      steps: [
        'Abre el muro y pide un aprendizaje, una duda o una idea.',
        'Lee y comenta algunas contribuciones; invita a responderlas oralmente.',
        'Pregunta: ¿qué se llevan para su propia práctica?',
      ],
      activity: 'Muro de diálogo con participación desde los celulares.',
    },
  },
  {
    id: 'etica',
    moment: 'm6',
    title: 'Ética y docencia humanizada',
    kind: 'content',
    notes: {
      minutes: 3,
      participant: 'Cierre: uso ético de la IA, docencia humanizada y cómo evaluar de otra manera.',
      objective: 'Cerrar con el uso ético de la IA, la docencia humanizada y una evaluación que amplíe el conocimiento.',
      explanation:
        'La IA llegó para ayudarnos, no para reemplazarnos. Ya no basta con pedir “investiga y entrega”: hay que evaluar cómo el estudiante crea, decide y mejora con la IA.',
      steps: [
        'Recorre los cuatro ejes tocando cada uno.',
        'Invita a motivar a los estudiantes a crear recursos con IA, con acompañamiento y transparencia.',
        'Cierra con la frase: tú diriges, la IA acompaña.',
      ],
      activity: 'Charla final con los cuatro ejes.',
    },
  },
  {
    id: 'reflexion',
    moment: 'm6',
    title: 'Una regla para mi aula',
    kind: 'activity',
    notes: {
      minutes: 2,
      participant: 'Escribe la regla ética que aplicarás al usar IA con tus estudiantes.',
      objective: 'Convertir la reflexión ética en compromisos concretos y compartidos.',
      explanation:
        'Una regla breve y propia, por ejemplo “siempre verifico y lo cuento”, vuelve práctico el uso ético.',
      steps: [
        'Abre el muro y pide una regla ética por docente.',
        'Lee las reglas, agrupa las repetidas y destaca con la estrella las que el grupo quiera adoptar.',
        'Cierra: estas son nuestras reglas como comunidad.',
      ],
      activity: 'Muro de reglas éticas con participación desde los celulares.',
    },
  },
  {
    id: 'cierre',
    moment: 'm6',
    title: 'Cierre y compromiso',
    kind: 'activity',
    notes: {
      minutes: 2,
      participant: 'Escribe tu compromiso desde el celular: qué recurso vas a crear y cómo lo aplicarás.',
      objective: 'Consolidar aprendizajes y concretar un compromiso de aplicación en el aula.',
      explanation: 'La IA propone, el docente dispone: el criterio pedagógico sigue siendo humano.',
      steps: [
        'Repasa el resumen visual de los aprendizajes.',
        'Los docentes envían su compromiso desde el celular y aparece en el muro.',
        'Invita a 3 docentes a leer el suyo y agradece su participación.',
      ],
      activity: 'Muro de compromisos alimentado desde los celulares.',
    },
  },
  {
    id: 'certificados',
    moment: 'm6',
    title: 'Asistencia y certificados',
    kind: 'tool',
    notes: {
      minutes: 1,
      participant: 'Tu certificado ya está disponible: descárgalo en tu celular como imagen o PDF.',
      objective: 'Cerrar el taller entregando la lista de asistencia y los certificados de participación.',
      explanation: 'Cada docente registrado puede descargar su certificado desde su celular; el facilitador descarga la lista de asistencia.',
      steps: [
        'Escribe tu nombre como facilitador para que aparezca en el certificado.',
        'Descarga la lista de asistencia (CSV, se abre en Excel).',
        'Pide que revisen su celular: en “Hola, …” aparece su certificado para guardar.',
      ],
      activity: 'Descarga de certificados desde los celulares.',
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
