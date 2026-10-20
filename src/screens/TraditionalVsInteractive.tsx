import { BookOpen, Sparkles } from 'lucide-react';
import { ClassifyActivity, type ClassifyConfig } from './ClassifyActivity';

const CFG: ClassifyConfig = {
  id: 'tradicional',
  kicker: 'Actividad · Al tablero',
  title: '¿Clase tradicional o clase interactiva?',
  labels: { A: { label: 'Tradicional', icon: BookOpen }, B: { label: 'Interactiva', icon: Sparkles } },
  items: [
    { text: 'El docente explica y los estudiantes copian del tablero.', answer: 'A', why: 'El estudiante recibe información, pero no toma decisiones ni recibe retroalimentación.' },
    { text: 'Cada estudiante resuelve un reto y ve al instante si acertó y por qué.', answer: 'B', why: 'La retroalimentación inmediata convierte el error en una oportunidad de aprendizaje.' },
    { text: 'Se proyectan 30 diapositivas con definiciones.', answer: 'A', why: 'Mostrar contenido no es lo mismo que diseñar una experiencia. La atención cae rápido.' },
    { text: 'Los estudiantes eligen un camino en una historia y ven sus consecuencias.', answer: 'B', why: 'Decidir y ver el efecto de la decisión activa el pensamiento y la motivación.' },
    { text: 'La evaluación llega una semana después en una hoja calificada.', answer: 'A', why: 'Cuando la retroalimentación llega tarde, el estudiante ya no puede ajustar su comprensión.' },
    { text: 'Un simulador permite cambiar variables y observar qué pasa.', answer: 'B', why: 'Manipular y experimentar construye comprensión, no solo memoria.' },
    { text: 'Todos avanzan al mismo ritmo, sin importar si entendieron.', answer: 'A', why: 'Un recurso interactivo puede adaptar el ritmo y dar pistas a quien lo necesita.' },
    { text: 'Un estudiante pasa al tablero proyectado y resuelve el reto con sus compañeros.', answer: 'B', why: 'Compartir la pantalla convierte el recurso en una experiencia colectiva.' },
  ],
  result: {
    heading: 'Una clase interactiva le pide al estudiante:',
    bullets: ['Decidir', 'Equivocarse sin miedo', 'Recibir retroalimentación inmediata', 'Pasar al tablero y experimentar'],
    closing: 'Eso es exactamente lo que vamos a pedirle a la IA que construya.',
  },
};

export function TraditionalVsInteractive() {
  return <ClassifyActivity cfg={CFG} />;
}
