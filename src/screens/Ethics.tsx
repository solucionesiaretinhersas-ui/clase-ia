import { useState } from 'react';
import { ArrowRight, HeartHandshake, Lightbulb, Scale, ShieldCheck } from 'lucide-react';
import { usePresenter } from '../presenter/context';
import { useWorkshop } from '../data/workshops';

const PILLARS = [
  {
    icon: HeartHandshake,
    title: 'El criterio es tuyo',
    lead: 'La IA puede ayudar a diseñar, pero el docente mantiene el criterio pedagógico.',
    points: [
      'Tú decides qué enseñar, cómo y por qué.',
      'La IA propone un borrador; tú lo adaptas a tu grupo y a tu comunidad.',
      'El vínculo, la empatía y la sabiduría no se delegan.',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Todo se revisa',
    lead: 'Todo contenido generado debe revisarse antes de utilizarlo.',
    points: [
      'Comprueba datos, conceptos y fuentes: la IA puede equivocarse con seguridad.',
      'Prueba el recurso como lo haría un estudiante.',
      'Sé transparente: cuenta cuándo y cómo usaste IA.',
    ],
  },
  {
    icon: Scale,
    title: 'Protege a tus estudiantes',
    lead: 'La privacidad y los datos de los estudiantes deben protegerse.',
    points: [
      'No ingreses nombres, fotos ni datos personales de estudiantes en herramientas de IA.',
      'Usa solo cuentas y servicios autorizados por tu institución.',
      'Pide permisos cuando el recurso lo requiera.',
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
