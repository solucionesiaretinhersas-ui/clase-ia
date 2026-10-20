import { useState } from 'react';
import { ArrowRight, HeartHandshake, Lightbulb, Scale, ShieldCheck } from 'lucide-react';
import { usePresenter } from '../presenter/context';

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

export function Ethics() {
  const [i, setI] = useState(0);
  const { goTo } = usePresenter();
  const p = PILLARS[i];
  const Icon = p.icon;
  return (
    <section className="ethics enter">
      <header className="screen-head">
        <span className="kicker">Momento 6 · Cierre</span>
        <h2 className="h-lg">La IA llegó para ayudarnos, <span className="grad-text">no para reemplazarnos</span></h2>
      </header>

      <div className="ethics__body">
        <ul className="ethics__tabs">
          {PILLARS.map((x, k) => {
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
        <button type="button" className="btn" onClick={() => setI((i + 1) % PILLARS.length)}>
          Siguiente eje <ArrowRight />
        </button>
        <button type="button" className="btn btn--primary btn--lg" onClick={() => goTo('cierre')}>
          Compromiso final <ArrowRight />
        </button>
      </div>
    </section>
  );
}
