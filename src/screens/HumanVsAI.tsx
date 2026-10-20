import { HeartHandshake, Sparkles } from 'lucide-react';
import { ClassifyActivity, type ClassifyConfig } from './ClassifyActivity';

const CFG: ClassifyConfig = {
  id: 'humano-ia',
  kicker: 'Actividad · Al tablero',
  title: '¿La IA te ayuda o solo tú puedes?',
  labels: { A: { label: 'La IA ayuda', icon: Sparkles }, B: { label: 'Solo tú', icon: HeartHandshake } },
  items: [
    { text: 'Generar cinco borradores de preguntas sobre un tema.', answer: 'A', why: 'Un buen punto de partida. Tú eliges, corriges y adaptas.' },
    { text: 'Notar que un estudiante llegó triste hoy y acercarte a él.', answer: 'B', why: 'La atención al otro y el vínculo son profundamente humanos.' },
    { text: 'Crear un simulador para proyectar en el tablero.', answer: 'A', why: 'La IA construye en minutos lo que tomaría días. Tú defines qué debe enseñar.' },
    { text: 'Decidir qué necesita aprender este grupo ahora mismo.', answer: 'B', why: 'La IA puede sugerir, pero conocer a tus estudiantes es criterio tuyo.' },
    { text: 'Adaptar un texto a distintos niveles de lectura.', answer: 'A', why: 'Ahorra mucho tiempo. Revisa que el sentido y el lenguaje sean adecuados.' },
    { text: 'Darle confianza a un estudiante que quiere rendirse.', answer: 'B', why: 'La motivación nace de una relación de confianza que solo tú construyes.' },
    { text: 'Verificar que lo generado sea correcto, justo y apropiado para tu aula.', answer: 'B', why: 'La responsabilidad final es del docente: la IA puede equivocarse.' },
    { text: 'Redactar una primera versión de tu guía de aprendizaje.', answer: 'A', why: 'Una primera versión ágil que luego humanizas con tu contexto.' },
  ],
  result: {
    heading: 'Docencia aumentada significa:',
    bullets: ['La IA acelera el borrador', 'Tú aportas contexto y criterio', 'Tú verificas y decides', 'Tú cuidas el vínculo con tus estudiantes'],
    closing: 'La IA es la copiloto. El piloto eres tú.',
  },
};

export function HumanVsAI() {
  return <ClassifyActivity cfg={CFG} />;
}
