export type Letter = 'R' | 'O' | 'C' | 'A' | 'S';

export interface Rock {
  k: Letter;
  name: string;
  question: string;
  tip: string;
  example: string;
  /** Color de la piedra (variable CSS) */
  color: string;
}

/** ROCAS: Rol · Objetivo · Contexto · Acción · Solución — un prompt fuerte como las rocas. */
export const ROCAS: Rock[] = [
  {
    k: 'R',
    name: 'Rol',
    question: '¿Quién debe ser la IA?',
    tip: 'Dale una identidad y un enfoque: cambia el tipo de respuesta que recibes.',
    example: 'Actúa como un diseñador de experiencias educativas interactivas.',
    color: 'var(--violet)',
  },
  {
    k: 'O',
    name: 'Objetivo',
    question: '¿Qué quieres lograr?',
    tip: 'Di el tema, el grado y qué debe poder hacer el estudiante al final.',
    example: 'Quiero que mis estudiantes de grado sexto comparen fracciones y justifiquen su respuesta.',
    color: 'var(--blue)',
  },
  {
    k: 'C',
    name: 'Contexto',
    question: '¿Para quién y en qué condiciones?',
    tip: 'Aquí está tu parte humana: tu grupo, tu aula, tu comunidad.',
    example: 'Grupo de 30 estudiantes, con video beam y poca conectividad, que aprenden mejor con retos en equipo.',
    color: 'var(--cyan)',
  },
  {
    k: 'A',
    name: 'Acción',
    question: '¿Qué debe hacer, paso a paso?',
    tip: 'Pide partes concretas: explicación, ejemplos, actividades, simuladores, evaluación.',
    example: 'Diseña una explicación breve, tres actividades interactivas y un simulador que se pueda proyectar en el tablero.',
    color: 'var(--mint)',
  },
  {
    k: 'S',
    name: 'Solución',
    question: '¿Qué entrega esperas y en qué formato?',
    tip: 'Define el resultado final: una tabla, una guía, una aplicación que funcione.',
    example: 'Entrégame la estructura en una tabla con tiempos y una lista de verificación para revisar la clase.',
    color: 'var(--amber)',
  },
];

export interface Fragment {
  id: string;
  text: string;
  letter: Letter;
}

/** Fragmentos para el juego de arrastrar: cada uno pertenece a una letra de ROCAS. */
export const FRAGMENTS: Fragment[] = [
  { id: 'r1', letter: 'R', text: 'Eres un tutor experto en didáctica de las matemáticas.' },
  { id: 'r2', letter: 'R', text: 'Actúa como diseñador de experiencias educativas.' },
  { id: 'o1', letter: 'O', text: 'Quiero que expliquen el ciclo del agua con sus palabras.' },
  { id: 'o2', letter: 'O', text: 'El objetivo es que comparen fracciones y justifiquen.' },
  { id: 'c1', letter: 'C', text: '30 estudiantes de sexto, con video beam y poca conectividad.' },
  { id: 'c2', letter: 'C', text: 'Mi grupo aprende mejor con retos en equipo y ejemplos de la región.' },
  { id: 'a1', letter: 'A', text: 'Diseña 3 actividades interactivas y un simulador.' },
  { id: 'a2', letter: 'A', text: 'Incluye preguntas con retroalimentación inmediata.' },
  { id: 's1', letter: 'S', text: 'Entrégalo en una tabla con tiempos y una lista de verificación.' },
  { id: 's2', letter: 'S', text: 'Entrega una aplicación web que funcione en celular y tablero.' },
];
