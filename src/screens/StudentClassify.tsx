import { Cog, Brain, ShieldCheck, Search } from 'lucide-react';
import { ClassifyActivity, type ClassifyConfig } from './ClassifyActivity';

const IA_O_NO: ClassifyConfig = {
  id: 'e-ia-o-no',
  kicker: 'Actividad · desde tu celular',
  title: '¿Es IA o no es IA?',
  labels: { A: { label: 'Es IA', icon: Brain }, B: { label: 'No es IA', icon: Cog } },
  items: [
    { text: 'Un asistente de voz que entiende lo que le dices y responde.', answer: 'A', why: 'Aprendió de muchos ejemplos de voz y lenguaje para entenderte.' },
    { text: 'Una calculadora que suma 2 + 2.', answer: 'B', why: 'Sigue reglas exactas que alguien programó: no aprende de ejemplos.' },
    { text: 'La app que te recomienda videos según lo que ves.', answer: 'A', why: 'Encuentra patrones en lo que ves para predecir qué te gustará.' },
    { text: 'Un semáforo que cambia de color cada 30 segundos.', answer: 'B', why: 'Es un temporizador con reglas fijas, no aprende nada.' },
    { text: 'Un chatbot que escribe un cuento a partir de tu idea.', answer: 'A', why: 'Genera texto nuevo prediciendo palabra por palabra.' },
    { text: 'Un reloj despertador que suena a las 6:00.', answer: 'B', why: 'Hace exactamente lo que se le programó, sin aprender.' },
  ],
  result: {
    heading: 'Una IA se reconoce porque:',
    bullets: ['Aprende de ejemplos', 'Encuentra patrones', 'Puede equivocarse', 'No solo sigue reglas fijas'],
    closing: 'Hoy vas a aprender a crear cosas con ella.',
  },
};

const CONFIAR: ClassifyConfig = {
  id: 'e-confiar',
  kicker: 'Actividad · desde tu celular',
  title: '¿Confío o verifico?',
  labels: { A: { label: 'Verifico', icon: Search }, B: { label: 'Puedo confiar', icon: ShieldCheck } },
  items: [
    { text: 'La IA me da la fecha de un hecho histórico para mi tarea.', answer: 'A', why: 'Los datos y las fechas se verifican en fuentes confiables.' },
    { text: 'La IA me da ideas para el nombre de mi juego.', answer: 'B', why: 'Las ideas creativas no necesitan ser “verdaderas”: tú eliges la que te guste.' },
    { text: 'La IA me explica un tema y cita un libro que no conozco.', answer: 'A', why: 'Puede inventar fuentes. Busca si el libro existe.' },
    { text: 'La IA me sugiere colores para el diseño de mi app.', answer: 'B', why: 'Es una sugerencia estética: la decisión final es tuya.' },
    { text: 'La IA me da una receta de química para un experimento.', answer: 'A', why: 'Si hay riesgo para tu seguridad, siempre verifica con tu docente.' },
    { text: 'La IA me da el código de mi app y la pruebo para ver si funciona.', answer: 'B', why: 'Probar el resultado es una forma de verificar. Si falla, lo corriges.' },
  ],
  result: {
    heading: 'Usar bien la IA es:',
    bullets: ['Verificar datos y fuentes', 'Probar lo que genera', 'Decidir tú lo importante', 'Pedir ayuda a tu docente'],
    closing: 'La IA propone, yo verifico.',
  },
};

export const EIaONo = () => <ClassifyActivity cfg={IA_O_NO} />;
export const EConfiar = () => <ClassifyActivity cfg={CONFIAR} />;