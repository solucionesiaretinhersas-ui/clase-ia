export interface Choice {
  text: string;
  correct: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  theme: string;
  story: string;
  questions: { q: string; choices: Choice[]; ok: string; bad: string }[];
}

export const CHALLENGES: Challenge[] = [
  {
    id: 'agua',
    title: 'Reto 1 · El río en peligro',
    theme: 'Agua',
    story: 'El río de tu pueblo está perdiendo agua. Tu misión es entender el ciclo del agua para protegerlo.',
    questions: [
      {
        q: '¿Cómo se llama el proceso por el cual el agua líquida pasa a vapor por el calor del sol?',
        choices: [
          { text: 'Evaporación', correct: true },
          { text: 'Condensación', correct: false },
          { text: 'Precipitación', correct: false },
        ],
        ok: 'El calor del sol convierte el agua en vapor que sube a la atmósfera.',
        bad: 'La respuesta es evaporación. La condensación ocurre después, cuando el vapor se enfría.',
      },
      {
        q: '¿Cuál de estas acciones ayuda a cuidar una fuente de agua?',
        choices: [
          { text: 'Arrojar basura cerca del río', correct: false },
          { text: 'Sembrar árboles en las orillas', correct: true },
          { text: 'Dejar abierta la llave al cepillarse', correct: false },
        ],
        ok: 'Los árboles protegen el suelo y ayudan a que el agua se conserve.',
        bad: 'Sembrar árboles en las orillas protege el cauce y mantiene el agua limpia.',
      },
    ],
  },
  {
    id: 'residuos',
    title: 'Reto 2 · Misión reciclaje',
    theme: 'Residuos',
    story: 'La ciudad se llena de basura. Aprende a separar los residuos para salvar el planeta.',
    questions: [
      {
        q: '¿En qué caneca va una botella de plástico limpia?',
        choices: [
          { text: 'Blanca (aprovechables)', correct: true },
          { text: 'Negra (no aprovechables)', correct: false },
          { text: 'Verde (orgánicos)', correct: false },
        ],
        ok: 'Las botellas limpias se aprovechan y se convierten en nuevos productos.',
        bad: 'Va en la caneca blanca: el plástico limpio se puede reciclar.',
      },
      {
        q: '¿Qué residuo es orgánico y sirve para hacer compost?',
        choices: [
          { text: 'Una lata de atún', correct: false },
          { text: 'Cáscaras de frutas', correct: true },
          { text: 'Una bolsa de papas fritas', correct: false },
        ],
        ok: 'Las cáscaras se descomponen y se transforman en abono para las plantas.',
        bad: 'Las cáscaras de fruta son orgánicas y se pueden convertir en abono.',
      },
    ],
  },
  {
    id: 'energia',
    title: 'Reto 3 · Energía limpia',
    theme: 'Energía',
    story: 'Para frenar el calentamiento del planeta debemos usar mejor la energía.',
    questions: [
      {
        q: '¿Cuál de estas es una fuente de energía renovable?',
        choices: [
          { text: 'El carbón', correct: false },
          { text: 'El petróleo', correct: false },
          { text: 'El sol', correct: true },
        ],
        ok: 'El sol no se agota y no produce gases contaminantes al generar energía.',
        bad: 'El carbón y el petróleo se agotan. La energía solar es renovable.',
      },
      {
        q: '¿Qué hábito ahorra energía en casa?',
        choices: [
          { text: 'Apagar las luces al salir de un cuarto', correct: true },
          { text: 'Dejar cargadores conectados todo el día', correct: false },
          { text: 'Mantener el televisor encendido sin verlo', correct: false },
        ],
        ok: 'Pequeños hábitos, repetidos por muchas personas, reducen mucho el consumo.',
        bad: 'Apagar lo que no usas es el hábito más simple para ahorrar energía.',
      },
    ],
  },
];

export const POINTS_CORRECT = 100;
export const POINTS_RETRY = 40;
