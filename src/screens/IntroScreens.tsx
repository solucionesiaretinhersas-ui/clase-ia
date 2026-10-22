import { useState, type CSSProperties } from 'react';
import { Clock, GraduationCap, HeartHandshake, Lightbulb, MessageCircleQuestion, Sparkles, type LucideIcon } from 'lucide-react';
import { sfx } from '../lib/sfx';

/* ═════════ La IA llegó a la educación ═════════ */
interface Axis {
  label: string;
  base: number;
  plus: number;
  how: string;
  human: string;
}

const AXES: Axis[] = [
  { label: 'Diseñar materiales', base: 0.5, plus: 0.92, how: 'Borradores de guías, rúbricas y ejemplos en minutos, listos para que los revises y adaptes.', human: 'Tú decides qué enseñar y cómo.' },
  { label: 'Personalizar', base: 0.4, plus: 0.86, how: 'Versiones del mismo recurso para distintos ritmos, niveles de lectura y contextos.', human: 'Tú conoces a cada estudiante.' },
  { label: 'Interactividad', base: 0.3, plus: 0.9, how: 'Simuladores, juegos y actividades que antes exigían saber programar.', human: 'Tú pruebas que enseñen lo que quieres.' },
  { label: 'Retroalimentación', base: 0.42, plus: 0.82, how: 'Respuestas con explicación inmediata para que el estudiante corrija y vuelva a intentar.', human: 'Tú acompañas el aprendizaje.' },
  { label: 'Tiempo con estudiantes', base: 0.36, plus: 0.84, how: 'Menos horas preparando el borrador, más tiempo conversando, observando y cuidando.', human: 'Ese tiempo es tuyo.' },
];
const CX = 160;
const CY = 150;
const R = 100;

function pt(i: number, v: number): [number, number] {
  const a = (Math.PI * 2 * i) / AXES.length - Math.PI / 2;
  return [CX + Math.cos(a) * R * v, CY + Math.sin(a) * R * v];
}
const poly = (vals: number[]) => vals.map((v, i) => pt(i, v).join(',')).join(' ');

const ASKS = [
  '¿Cuántas horas de tu semana se van en preparar, copiar, calificar y registrar?',
  '¿Qué clase has soñado diseñar y nunca tuviste el tiempo para hacerla?',
  '¿Y si cada estudiante pudiera tener una versión de la clase a su medida?',
  '¿Qué harías con cinco horas más cada semana?',
];

interface Slice {
  label: string;
  solo: number;
  con: number;
  color: string;
}

const DAY: Slice[] = [
  { label: 'Preparar materiales', solo: 38, con: 18, color: 'var(--amber)' },
  { label: 'Calificar y registrar', solo: 27, con: 15, color: 'var(--rose)' },
  { label: 'Estar con tus estudiantes', solo: 25, con: 40, color: 'var(--mint)' },
  { label: 'Diseñar e innovar', solo: 10, con: 27, color: 'var(--violet)' },
];

interface Myth {
  icon: LucideIcon;
  myth: string;
  truth: string;
  color: string;
}

const MYTHS: Myth[] = [
  { icon: GraduationCap, myth: '“La IA me va a reemplazar.”', truth: 'No conoce a tus estudiantes, su historia ni tu comunidad. Tú pones el sentido, el vínculo y el criterio.', color: 'var(--blue)' },
  { icon: Lightbulb, myth: '“Usarla es hacer trampa.”', truth: 'Es un asistente de borradores. Tú decides qué se queda, qué se corrige y qué se descarta.', color: 'var(--amber)' },
  { icon: Sparkles, myth: '“Es muy difícil de usar.”', truth: 'Se le habla en español, como a un colega. Hoy lo vas a comprobar con tu propia clase.', color: 'var(--violet)' },
  { icon: HeartHandshake, myth: '“Los estudiantes aprenderán menos.”', truth: 'Depende del diseño. Una buena aula interactiva da práctica, pistas y retroalimentación inmediata.', color: 'var(--rose)' },
];

export function Potencia() {
  const [ia, setIa] = useState(false);
  const [sel, setSel] = useState<number | null>(null);
  const [ask, setAsk] = useState(0);
  const [flip, setFlip] = useState<number[]>([]);
  const a = sel !== null ? AXES[sel] : null;

  const pick = (i: number) => {
    setSel(i === sel ? null : i);
    if (!ia) setIa(true);
    sfx.pop();
  };
  const toggleIa = (v: boolean) => {
    setIa(v);
    v ? sfx.whoosh() : sfx.pop();
  };

  return (
    <section className="pot enter">
      <header className="screen-head">
        <span className="kicker">La IA llegó a la educación</span>
        <h2 className="h-xl">
          No viene a reemplazarte.
          <br />
          Viene a <span className="grad-text">ampliar lo que puedes diseñar</span>.
        </h2>
      </header>

      <div className="pot__asks" role="group" aria-label="Preguntas para pensar">
        <span className="pot__asks-ico">
          <MessageCircleQuestion />
        </span>
        <div className="pot__asks-main">
          <span className="kicker">Antes de seguir, pregúntate…</span>
          <p key={ask} className="pot__asks-q">
            {ASKS[ask]}
          </p>
        </div>
        <div className="pot__asks-dots">
          {ASKS.map((q, i) => (
            <button key={q} type="button" className={i === ask ? 'is-on' : ''} onClick={() => { setAsk(i); sfx.pop(); }} aria-label={`Pregunta ${i + 1}`}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="pot__switch">
        <div className="seg" role="group" aria-label="Comparar al docente solo y con IA">
          <button type="button" className={`seg__btn ${!ia ? 'is-on' : ''}`} onClick={() => toggleIa(false)} aria-pressed={!ia}>
            <GraduationCap /> Docente
          </button>
          <button type="button" className={`seg__btn ${ia ? 'is-on' : ''}`} onClick={() => toggleIa(true)} aria-pressed={ia}>
            <Sparkles /> Docente + IA
          </button>
        </div>
        <span className="pot__switch-hint">Cambia entre los dos y mira qué se mueve.</span>
      </div>

      <div className="pot__body">
        <div className="pot__time glass">
          <h3>
            <Clock /> ¿En qué se va tu tiempo?
          </h3>
          <ul>
            {DAY.map((s) => {
              const v = ia ? s.con : s.solo;
              return (
                <li key={s.label} style={{ '--c': s.color } as CSSProperties}>
                  <span>
                    {s.label} <b>{v}%</b>
                  </span>
                  <i>
                    <u style={{ width: `${v}%` }} />
                  </i>
                </li>
              );
            })}
          </ul>
          <p className="pot__time-note" aria-live="polite">
            {ia ? 'Menos tiempo en lo repetitivo, más en estar con tus estudiantes y en diseñar. Ese tiempo es tuyo.' : 'Hoy, buena parte de tu semana se va en tareas que se repiten.'}
          </p>
          <small>Ilustración para pensar, no un dato medido.</small>
        </div>

        <div className="pot__chart glass">
          <h3>
            <Sparkles /> ¿Qué puedes diseñar?
          </h3>
          <svg viewBox="-50 0 420 300" role="img" aria-label="Gráfica ilustrativa de capacidades de diseño del docente, solo y con IA">
            {[0.33, 0.66, 1].map((g) => (
              <polygon key={g} points={poly(AXES.map(() => g))} className="radar__grid" />
            ))}
            {AXES.map((_, i) => {
              const [x, y] = pt(i, 1);
              return <line key={i} x1={CX} y1={CY} x2={x} y2={y} className={`radar__axis ${sel === i ? 'is-sel' : ''}`} />;
            })}
            <polygon points={poly(AXES.map((x) => x.base))} className="radar__base" />
            <polygon points={poly(AXES.map((x) => x.plus))} className={`radar__plus ${ia ? 'is-on' : ''}`} />
            {sel !== null && (
              <>
                <circle cx={pt(sel, AXES[sel].base)[0]} cy={pt(sel, AXES[sel].base)[1]} r="6" className="radar__dot radar__dot--base" />
                {ia && <circle cx={pt(sel, AXES[sel].plus)[0]} cy={pt(sel, AXES[sel].plus)[1]} r="7" className="radar__dot radar__dot--plus" />}
              </>
            )}
            {AXES.map((x, i) => {
              const [lx, ly] = pt(i, 1.22);
              return (
                <g key={x.label} className={`radar__hit ${sel === i ? 'is-sel' : ''}`} onClick={() => pick(i)} role="button" tabIndex={0} aria-label={x.label} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && pick(i)}>
                  <circle cx={pt(i, 1)[0]} cy={pt(i, 1)[1]} r="15" fill="transparent" />
                  <text x={lx} y={ly} textAnchor={lx < CX - 8 ? 'end' : lx > CX + 8 ? 'start' : 'middle'} className="radar__label">
                    {x.label}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="pot__info" aria-live="polite">
            {a ? (
              <>
                <b>{a.label}</b>
                <span>{a.how}</span>
                <em>{a.human}</em>
              </>
            ) : (
              <span className="pot__hint">Toca un eje para ver qué cambia y qué sigue siendo humano.</span>
            )}
          </div>
          <small>Ilustración conceptual; no son datos científicos.</small>
        </div>
      </div>

      <div className="pot__myths">
        <h3>Lo que muchos docentes piensan… y lo que vas a comprobar hoy</h3>
        <ul>
          {MYTHS.map((m, i) => {
            const Icon = m.icon;
            const open = flip.includes(i);
            return (
              <li key={m.myth} style={{ '--c': m.color } as CSSProperties}>
                <button type="button" className={`myth ${open ? 'is-open' : ''}`} onClick={() => { setFlip((f) => (f.includes(i) ? f.filter((x) => x !== i) : [...f, i])); sfx.pop(); }} aria-expanded={open}>
                  <Icon />
                  <strong>{m.myth}</strong>
                  <p>{open ? m.truth : 'Toca para ver otra mirada'}</p>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="pot__line">
        El criterio, el vínculo y la sabiduría siguen siendo <b>tuyos</b>. La IA acelera el borrador; <b>tú diriges el diseño</b>.
      </p>
    </section>
  );
}