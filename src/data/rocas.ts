export type Letter = 'R' | 'O' | 'C' | 'A' | 'S';

export interface Rock {
  k: Letter;
  name: string;
  question: string;
  tip: string;
  example: string;
  /** Color de la piedra (variable CSS) */
  color: string;
  /** Qué aporta esta parte a la instrucción (comparador) */
  adds: string;
}

/** ROCAS: Rol · Objetivo · Contexto · Acción · Solución — un prompt fuerte como las rocas. */
export const ROCAS: Rock[] = [
  {
    k: 'R',
    name: 'Rol',
    question: '¿Quién debe ser la IA? ¿Qué perfil, especialidad o enfoque debe asumir?',
    tip: 'Dale una identidad y un enfoque: cambia el tipo de respuesta que recibes.',
    example: 'Actúa como un diseñador de experiencias educativas para ciencias naturales.',
    color: 'var(--violet)',
    adds: 'Define el enfoque y la voz de la IA',
  },
  {
    k: 'O',
    name: 'Objetivo',
    question: '¿Qué queremos lograr? ¿Qué aprendizaje, problema o producto buscamos?',
    tip: 'Di el tema, el grado y qué debe poder hacer el estudiante al final.',
    example: 'Diseña una actividad para que estudiantes de sexto grado expliquen las etapas del ciclo del agua y relacionen el proceso con su entorno.',
    color: 'var(--blue)',
    adds: 'Precisa el aprendizaje buscado y el grado',
  },
  {
    k: 'C',
    name: 'Contexto',
    question: '¿Para quién se construye? Grado, asignatura, entorno, recursos y necesidades de los estudiantes.',
    tip: 'Aquí está tu parte humana: tu grupo, tu aula, tu comunidad.',
    example: 'El grupo tiene 30 estudiantes, dispone de un video beam y presenta conectividad limitada.',
    color: 'var(--cyan)',
    adds: 'Adapta la respuesta a tu grupo y a tus recursos reales',
  },
  {
    k: 'A',
    name: 'Acción',
    question: '¿Qué debe hacer la IA, paso a paso? ¿Qué actividades, explicaciones o tareas debe desarrollar?',
    tip: 'Pide partes concretas: explicación, ejemplos, actividades, simuladores, evaluación.',
    example: 'Organiza una explicación visual breve, tres actividades participativas y una evaluación con retroalimentación.',
    color: 'var(--mint)',
    adds: 'Ordena qué debe producir, paso a paso',
  },
  {
    k: 'S',
    name: 'Solución',
    question: '¿Qué resultado final debe entregar y en qué formato? ¿Qué requisitos cumple y cómo comprobamos que funciona?',
    tip: 'Es el producto esperado, no los pasos: formato, requisitos y criterio para verificarlo.',
    example: 'Entrega una guía estructurada con tiempos, instrucciones, recursos y criterios de evaluación, lista para que el docente la revise y adapte.',
    color: 'var(--amber)',
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

/** Retos del juego "Construye el prompt más sólido": cada uno trae 10 fragmentos (2 por letra). */
export const CHALLENGES: Challenge[] = [
  {
    id: 'agua',
    title: 'El ciclo del agua en sexto',
    intro: 'Ciencias Naturales · grado sexto · conectividad limitada',
    fragments: [
      { id: 'a-r1', letter: 'R', text: 'Actúa como diseñador de experiencias educativas para ciencias naturales.' },
      { id: 'a-r2', letter: 'R', text: 'Eres un tutor experto en didáctica de las ciencias.' },
      { id: 'a-o1', letter: 'O', text: 'Que mis estudiantes expliquen las etapas del ciclo del agua.' },
      { id: 'a-o2', letter: 'O', text: 'Que relacionen el ciclo del agua con el río de su pueblo.' },
      { id: 'a-c1', letter: 'C', text: '30 estudiantes de sexto, con un video beam en el aula.' },
      { id: 'a-c2', letter: 'C', text: 'Poca conectividad en casa: las actividades deben funcionar sin internet.' },
      { id: 'a-a1', letter: 'A', text: 'Organiza una explicación visual breve y tres actividades participativas.' },
      { id: 'a-a2', letter: 'A', text: 'Incluye una evaluación con retroalimentación inmediata.' },
      { id: 'a-s1', letter: 'S', text: 'Entrega una guía con tiempos, instrucciones y recursos.' },
      { id: 'a-s2', letter: 'S', text: 'Que sea revisable y adaptable por el docente, con criterios de evaluación.' },
    ],
  },
  {
    id: 'fracciones',
    title: 'Fracciones equivalentes en quinto',
    intro: 'Matemáticas · grado quinto · grupo con ritmos distintos',
    fragments: [
      { id: 'f-r1', letter: 'R', text: 'Actúa como un diseñador de juegos de matemáticas para primaria.' },
      { id: 'f-r2', letter: 'R', text: 'Eres un tutor de matemáticas que explica con ejemplos de la vida diaria.' },
      { id: 'f-o1', letter: 'O', text: 'Quiero que reconozcan y comparen fracciones equivalentes.' },
      { id: 'f-o2', letter: 'O', text: 'Que resuelvan problemas de repartir pizzas y recetas.' },
      { id: 'f-c1', letter: 'C', text: 'Grupo de 28 estudiantes con ritmos de aprendizaje muy distintos.' },
      { id: 'f-c2', letter: 'C', text: 'Les motivan los juegos y trabajar en parejas.' },
      { id: 'f-a1', letter: 'A', text: 'Diseña un juego con tres niveles y retroalimentación inmediata.' },
      { id: 'f-a2', letter: 'A', text: 'Agrega pistas para quien se atasque y un reto extra para quien termine.' },
      { id: 'f-s1', letter: 'S', text: 'Entrega una aplicación web que funcione en celular y en el tablero.' },
      { id: 'f-s2', letter: 'S', text: 'Con una lista para comprobar que el juego enseña lo que se busca.' },
    ],
  },
  {
    id: 'algoritmos',
    title: 'Algoritmos con un robot en octavo',
    intro: 'Tecnología e Informática · grado octavo · sala con pocos equipos',
    fragments: [
      { id: 't-r1', letter: 'R', text: 'Actúa como diseñador de experiencias de pensamiento computacional.' },
      { id: 't-r2', letter: 'R', text: 'Eres un coach que acompaña a docentes de tecnología.' },
      { id: 't-o1', letter: 'O', text: 'Que diseñen una secuencia de instrucciones para guiar a un robot.' },
      { id: 't-o2', letter: 'O', text: 'Que encuentren y corrijan errores en un algoritmo.' },
      { id: 't-c1', letter: 'C', text: 'Sala de informática con 15 computadores; trabajan en parejas.' },
      { id: 't-c2', letter: 'C', text: 'Varios estudiantes nunca han programado.' },
      { id: 't-a1', letter: 'A', text: 'Crea un laberinto con retos de dificultad creciente.' },
      { id: 't-a2', letter: 'A', text: 'Explica cada error con una pista, sin dar la solución.' },
      { id: 't-s1', letter: 'S', text: 'Entrega un simulador web listo para proyectar y usar en parejas.' },
      { id: 't-s2', letter: 'S', text: 'Con una rúbrica de tres niveles para valorar el trabajo.' },
    ],
  },
];
