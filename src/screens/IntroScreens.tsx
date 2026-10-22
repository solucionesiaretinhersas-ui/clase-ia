import { useState, type CSSProperties } from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';
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

export function Potencia() {
  const [ia, setIa] = useState(false);
  const [sel, setSel] = useState<number | null>(null);
  const a = sel !== null ? AXES[sel] : null;

  const pick = (i: number) => {
    setSel(i === sel ? null : i);
    if (!ia) setIa(true);
    sfx.pop();
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
        <p className="pot__ask">¿Y si lo que te falta no son ideas… sino tiempo para convertirlas en clases?</p>
      </header>

      <div className="pot__body">
        <div className="pot__orbit" aria-hidden="true">
          <i className="pot__ring pot__ring--1" />
          <i className="pot__ring pot__ring--2" />
          <i className="pot__ring pot__ring--3" />
          <span className="pot__core">
            <GraduationCap />
            <b>Docente</b>
          </span>
          {['Diseñar', 'Personalizar', 'Crear', 'Evaluar', 'Comunicar'].map((t, i) => (
            <span key={t} className="pot__sat" style={{ '--a': `${i * 72}deg` } as CSSProperties}>
              <em>{t}</em>
            </span>
          ))}
          <span className="pot__ai">
            <Sparkles /> IA
          </span>
        </div>

        <div className="pot__chart glass">
          <div className="seg seg--small" role="group" aria-label="Comparar capacidades">
            <button type="button" className={`seg__btn ${!ia ? 'is-on' : ''}`} onClick={() => { setIa(false); sfx.pop(); }} aria-pressed={!ia}>
              Docente
            </button>
            <button type="button" className={`seg__btn ${ia ? 'is-on' : ''}`} onClick={() => { setIa(true); sfx.whoosh(); }} aria-pressed={ia}>
              <Sparkles /> Docente + IA
            </button>
          </div>
          <svg viewBox="0 0 320 300" role="img" aria-label="Gráfica ilustrativa de capacidades de diseño del docente, solo y con IA">
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
              <span className="pot__hint">Toca un eje de la gráfica para ver qué cambia y qué sigue siendo humano.</span>
            )}
          </div>
          <small>Ilustración conceptual para ayudar a pensar; no son datos científicos.</small>
        </div>
      </div>

      <p className="pot__line">
        El criterio, el vínculo y la sabiduría siguen siendo <b>tuyos</b>. La IA acelera el borrador; <b>tú diriges el diseño</b>.
      </p>
    </section>
  );
}
