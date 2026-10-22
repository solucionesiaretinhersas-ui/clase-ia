export type Letter = 'R' | 'O' | 'C' | 'A' | 'S';

export interface Rock {
  k: Letter;
  name: string;
  question: string;
  tip: string;
  example: string;
  /** Color de la piedra (variable CSS) */
  color: string;
  /** Pista corta para el juego */
  short: string;
  /** Qué aporta esta parte a la instrucción (comparador) */
  adds: string;
}

/** ROCAS: Rol · Objetivo · Contexto · Acción · Salida — un prompt fuerte como las rocas. */
export const ROCAS: Rock[] = [
  {
    k: 'R',
    name: 'Rol',
    question: '¿Quién debe ser la IA? ¿Qué perfil, especialidad o enfoque debe asumir?',
    tip: 'Dale una identidad y un enfoque: cambia el tipo de respuesta que recibes.',
    example: 'Actúa como un diseñador de experiencias educativas para ciencias naturales.',
    color: 'var(--violet)',
    short: '¿Quién es la IA?',
    adds: 'Define el enfoque y la voz de la IA',
  },
  {
    k: 'O',
    name: 'Objetivo',
    question: '¿Qué queremos lograr? ¿Qué aprendizaje, problema o producto buscamos?',
    tip: 'Di el tema, el grado y qué debe poder hacer el estudiante al final.',
    example: 'Diseña una actividad para que estudiantes de sexto grado expliquen las etapas del ciclo del agua y relacionen el proceso con su entorno.',
    color: 'var(--blue)',
    short: '¿Qué quiero lograr?',
    adds: 'Precisa el aprendizaje buscado y el grado',
  },
  {
    k: 'C',
    name: 'Contexto',
    question: '¿Para quién se construye? Grado, asignatura, entorno, recursos y necesidades de los estudiantes.',
    tip: 'Aquí está tu parte humana: tu grupo, tu aula, tu comunidad.',
    example: 'El grupo tiene 30 estudiantes, dispone de un video beam y presenta conectividad limitada.',
    color: 'var(--cyan)',
    short: '¿Para quién y con qué?',
    adds: 'Adapta la respuesta a tu grupo y a tus recursos reales',
  },
  {
    k: 'A',
    name: 'Acción',
    question: '¿Qué debe hacer la IA, paso a paso? ¿Qué actividades, explicaciones o tareas debe desarrollar?',
    tip: 'Pide partes concretas: explicación, ejemplos, actividades, simuladores, evaluación.',
    example: 'Organiza una explicación visual breve, tres actividades participativas y una evaluación con retroalimentación.',
    color: 'var(--mint)',
    short: '¿Qué debe hacer?',
    adds: 'Ordena qué debe producir, paso a paso',
  },
  {
    k: 'S',
    name: 'Salida',
    question: '¿Qué salida debe entregar la IA? ¿En qué formato, con qué requisitos y cómo comprobamos que funciona?',
    tip: 'Es el producto esperado, no los pasos: formato, requisitos y criterio para verificarlo.',
    example: 'Entrega una guía estructurada con tiempos, instrucciones, recursos y criterios de evaluación, lista para que el docente la revise y adapte.',
    color: 'var(--amber)',
    short: '¿Qué entrega y cómo lo reviso?',
    adds: 'Fija el formato, los requisitos y cómo comprobar el resultado',
  },
];

/** Instrucción genérica del comparador y lo que se obtiene según cuántas piedras se agregan. */
export const GENERIC_PROMPT = 'Crea una clase sobre el ciclo del agua.';
export const COMPARE_RESULTS = [
  'Un texto general sobre el ciclo del agua, igual para cualquier grupo.',
  'Con enfoque de diseñador educativo, pero sin saber a quién ni para qué.',
  'Ya apunta al aprendizaje de sexto grado y a relacionar el proceso con el entorno.',
  'Se adapta a 30 estudiantes, con video beam y poca conectividad.',
  'Propone partes concretas: explicación visual, tres actividades y evaluación.',
  'Una guía lista para revisar y adaptar, con tiempos, instrucciones, recursos y criterios.',
];

export interface Fragment {
  id: string;
  text: string;
  letter: Letter;
}

export interface Challenge {
  id: string;
  title: string;
  intro: string;
  fragments: Fragment[];
}

/**
 * Retos del juego "Construye el prompt más sólido": cada uno trae 10 fragmentos (2 por letra).
 * Cada fragmento empieza con una pista clara de su letra:
 *  R "Actúa como…" · O "Mi meta es…" · C "Mi grupo…" · A "Haz / Incluye…" · S "Entrégamelo… / Debe…"
 */
export const CHALLENGES: Challenge[] = [
  {
    id: 'agua',
    title: 'El ciclo del agua en sexto',
    intro: 'Ciencias Naturales · grado sexto · poca conectividad',
    fragments: [
      { id: 'a-r1', letter: 'R', text: 'Actúa como diseñador de experiencias educativas de ciencias naturales.' },
      { id: 'a-r2', letter: 'R', text: 'Quiero que seas un tutor experto en enseñar ciencias a niños.' },
      { id: 'a-o1', letter: 'O', text: 'Mi meta es que mis estudiantes expliquen las etapas del ciclo del agua.' },
      { id: 'a-o2', letter: 'O', text: 'También quiero que relacionen el ciclo del agua con el río de su pueblo.' },
      { id: 'a-c1', letter: 'C', text: 'Mi grupo: 30 estudiantes de sexto y un video beam en el aula.' },
      { id: 'a-c2', letter: 'C', text: 'Además: en casa casi no tienen internet, así que debe funcionar sin conexión.' },
      { id: 'a-a1', letter: 'A', text: 'Haz una explicación visual breve y tres actividades en las que participen todos.' },
      { id: 'a-a2', letter: 'A', text: 'Incluye al final una evaluación que explique cada respuesta.' },
      { id: 'a-s1', letter: 'S', text: 'Entrégamelo como una guía con tiempos, instrucciones y recursos.' },
      { id: 'a-s2', letter: 'S', text: 'Debe poder revisarlo y adaptarlo yo, con criterios para evaluar.' },
    ],
  },
  {
    id: 'fracciones',
    title: 'Fracciones equivalentes en quinto',
    intro: 'Matemáticas · grado quinto · ritmos de aprendizaje distintos',
    fragments: [
      { id: 'f-r1', letter: 'R', text: 'Actúa como diseñador de juegos de matemáticas para primaria.' },
      { id: 'f-r2', letter: 'R', text: 'Quiero que seas un tutor que explica con ejemplos de la vida diaria.' },
      { id: 'f-o1', letter: 'O', text: 'Mi meta es que mis estudiantes reconozcan y comparen fracciones equivalentes.' },
      { id: 'f-o2', letter: 'O', text: 'También quiero que resuelvan problemas de repartir pizzas y recetas.' },
      { id: 'f-c1', letter: 'C', text: 'Mi grupo: 28 estudiantes con ritmos de aprendizaje muy distintos.' },
      { id: 'f-c2', letter: 'C', text: 'Además: les motivan los juegos y trabajar en parejas.' },
      { id: 'f-a1', letter: 'A', text: 'Haz un juego de tres niveles con respuesta inmediata en cada intento.' },
      { id: 'f-a2', letter: 'A', text: 'Incluye pistas para quien se atasque y un reto extra para quien termine.' },
      { id: 'f-s1', letter: 'S', text: 'Entrégamelo como una aplicación web que se vea bien en celular y en el tablero.' },
      { id: 'f-s2', letter: 'S', text: 'Debe traer una lista para comprobar que el juego enseña lo que busco.' },
    ],
  },
  {
    id: 'algoritmos',
    title: 'Un robot y algoritmos en octavo',
    intro: 'Tecnología e Informática · grado octavo · sala con pocos equipos',
    fragments: [
      { id: 't-r1', letter: 'R', text: 'Actúa como diseñador de experiencias de pensamiento computacional.' },
      { id: 't-r2', letter: 'R', text: 'Quiero que seas un coach que acompaña a docentes de tecnología.' },
      { id: 't-o1', letter: 'O', text: 'Mi meta es que mis estudiantes escriban instrucciones para guiar a un robot.' },
      { id: 't-o2', letter: 'O', text: 'También quiero que encuentren y corrijan errores en un algoritmo.' },
      { id: 't-c1', letter: 'C', text: 'Mi grupo: sala con 15 computadores, trabajan en parejas.' },
      { id: 't-c2', letter: 'C', text: 'Además: varios estudiantes nunca han programado.' },
      { id: 't-a1', letter: 'A', text: 'Haz un laberinto con retos que se vayan poniendo más difíciles.' },
      { id: 't-a2', letter: 'A', text: 'Incluye pistas que expliquen cada error sin dar la solución.' },
      { id: 't-s1', letter: 'S', text: 'Entrégamelo como un simulador web listo para proyectar y usar en parejas.' },
      { id: 't-s2', letter: 'S', text: 'Debe traer una rúbrica de tres niveles para valorar el trabajo.' },
    ],
  },
  {
    id: 'cuentos',
    title: 'Escribir un cuento en cuarto',
    intro: 'Lengua Castellana · grado cuarto · grupo que lee poco',
    fragments: [
      { id: 'l-r1', letter: 'R', text: 'Actúa como un escritor que enseña a escribir a niños.' },
      { id: 'l-r2', letter: 'R', text: 'Quiero que seas un diseñador de actividades de lectura y escritura.' },
      { id: 'l-o1', letter: 'O', text: 'Mi meta es que mis estudiantes escriban un cuento con inicio, nudo y final.' },
      { id: 'l-o2', letter: 'O', text: 'También quiero que se animen a leer su cuento al grupo.' },
      { id: 'l-c1', letter: 'C', text: 'Mi grupo: 25 estudiantes de cuarto a los que les cuesta leer.' },
      { id: 'l-c2', letter: 'C', text: 'Además: les encantan los animales y las historias de su región.' },
      { id: 'l-a1', letter: 'A', text: 'Haz una actividad paso a paso para inventar personajes, lugar y problema.' },
      { id: 'l-a2', letter: 'A', text: 'Incluye una ayuda que sugiera ideas cuando se queden sin palabras.' },
      { id: 'l-s1', letter: 'S', text: 'Entrégamelo como una guía con un ejemplo de cuento ya resuelto.' },
      { id: 'l-s2', letter: 'S', text: 'Debe traer una lista de revisión para que cada niño corrija su texto.' },
    ],
  },
  {
    id: 'convivencia',
    title: 'Acuerdos de convivencia en séptimo',
    intro: 'Ciencias Sociales · grado séptimo · grupo con conflictos frecuentes',
    fragments: [
      { id: 'c-r1', letter: 'R', text: 'Actúa como mediador escolar con experiencia en convivencia.' },
      { id: 'c-r2', letter: 'R', text: 'Quiero que seas un diseñador de dinámicas para trabajar valores.' },
      { id: 'c-o1', letter: 'O', text: 'Mi meta es que mis estudiantes construyan acuerdos de convivencia propios.' },
      { id: 'c-o2', letter: 'O', text: 'También quiero que aprendan a resolver conflictos hablando.' },
      { id: 'c-c1', letter: 'C', text: 'Mi grupo: 35 estudiantes de séptimo con peleas frecuentes en el descanso.' },
      { id: 'c-c2', letter: 'C', text: 'Además: solo tengo una hora de clase y un salón sin proyector.' },
      { id: 'c-a1', letter: 'A', text: 'Haz una dinámica de casos en grupos pequeños con dramatización corta.' },
      { id: 'c-a2', letter: 'A', text: 'Incluye preguntas para que cada grupo escriba sus acuerdos.' },
      { id: 'c-s1', letter: 'S', text: 'Entrégamelo como un plan de clase de una hora con tiempos por momento.' },
      { id: 'c-s2', letter: 'S', text: 'Debe traer una forma sencilla de comprobar si se cumplen los acuerdos.' },
    ],
  },
];