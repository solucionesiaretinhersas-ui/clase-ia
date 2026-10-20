import { useState } from 'react';
import { ArrowRight, HeartHandshake, Lightbulb, Scale, ShieldCheck } from 'lucide-react';
import { usePresenter } from '../presenter/context';
import { useWorkshop } from '../data/workshops';

const PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Uso ético',
    lead: 'Transparencia, verificación y cuidado de los datos.',
    points: [
      'Revisa siempre lo que la IA genera: puede equivocarse o tener sesgos.',
      'No ingreses datos personales de estudiantes en herramientas de IA.',
      'Sé transparente: cuenta cuándo y cómo se usó la IA.',
      'El docente es el responsable final del recurso.',
    ],
  },
  {
    icon: HeartHandshake,
    title: 'Docencia humanizada',
    lead: 'La tecnología libera tiempo para lo que más importa.',
    points: [
      'Más tiempo para escuchar, acompañar y motivar.',
      'La sabiduría, la empatía y el ejemplo no se automatizan.',
      'La IA es copiloto: tú sigues siendo quien orienta el rumbo.',
    ],
  },
  {
    icon: Lightbulb,
    title: 'Inteligencia aumentada',
    lead: 'Docente + IA amplían lo que cada estudiante puede lograr.',
    points: [
      'Invita a tus estudiantes a crear recursos con IA, con tu guía.',
      'Que pregunten mejor, prueben, se equivoquen y mejoren.',
      'Del consumo de información a la creación de conocimiento.',
    ],
  },
  {
    icon: Scale,
    title: 'Evaluar de otra manera',
    lead: 'Ya no basta con “investiga y entrega”.',
    points: [
      'Evalúa el proceso: qué pidió, qué decidió, qué mejoró.',
      'Pide justificar y explicar con sus propias palabras.',
      'Diseña retos que amplíen su capacidad, no que la IA resuelva sola.',
    ],
  },
];

const PILLARS_E = [
  {
    icon: ShieldCheck,
    title: 'Verifica',
    lead: 'La IA puede equivocarse con total seguridad.',
    points: ['Comprueba datos, fechas y fuentes.', 'Prueba lo que genera antes de usarlo.', 'Si algo parece raro, pregunta a tu docente.'],
  },
  {
    icon: Scale,
    title: 'Cuida tu información',
    lead: 'Lo que escribes puede quedar guardado.',
    points: ['No compartas datos personales ni fotos tuyas o de otros.', 'No escribas contraseñas ni direcciones.', 'Usa solo la cuenta que tu docente indique.'],
  },
  {
    icon: Lightbulb,
    title: 'Crea tú',
    lead: 'Copiar sin entender no es aprender.',
    points: ['Pon tus ideas primero y luego pide ayuda.', 'Explica con tus palabras lo que hace tu app.', 'Cuenta siempre cuándo usaste IA.'],
  },
  {
    icon: HeartHandshake,
    title: 'Tú decides',
    lead: 'La IA es una ayudante, no la jefa.',
    points: ['Tú eliges qué pedir y qué cambiar.', 'Úsala para aprender más, no para hacer menos.', 'Úsala con respeto: nada que lastime a otros.'],
  },
];

export function Ethics() {
  const ws = useWorkshop();
  const student = ws.audience === 'estudiante';
  const pillars = student ? PILLARS_E : PILLARS;
  const [i, setI] = useState(0);
  const { next } = usePresenter();
  const p = pillars[i];
  const Icon = p.icon;
  return (
    <section className="ethics enter">
      <header className="screen-head">
        <span className="kicker">{student ? 'Momento 5 · Cierre' : 'Momento 6 · Cierre'}</span>
        <h2 className="h-lg">{student ? <>Usa la IA <span className="grad-text">con cabeza</span></> : <>La IA llegó para ayudarnos, <span className="grad-text">no para reemplazarnos</span></>}</h2>
      </header>

      <div className="ethics__body">
        <ul className="ethics__tabs">
          {pillars.map((x, k) => {
            const I = x.icon;
            return (
              <li key={x.title}>
                <button type="button" className={k === i ? 'is-active' : ''} onClick={() => setI(k)} aria-pressed={k === i}>
                  <I /> {x.title}
                </button>
              </li>
            );
          })}
        </ul>

        <article className="ethics__panel glass" key={i}>
          <Icon className="ethics__icon" />
          <h3>{p.title}</h3>
          <p className="ethics__lead">{p.lead}</p>
          <ul>
            {p.points.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="ethics__foot">
        <button type="button" className="btn" onClick={() => setI((i + 1) % pillars.length)}>
          Siguiente eje <ArrowRight />
        </button>
        <button type="button" className="btn btn--primary btn--lg" onClick={next}>
          Continuar <ArrowRight />
        </button>
      </div>
    </section>
  );
}
