import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { GraduationCap, Pause, Play, RotateCcw, ShieldAlert, Sparkles } from 'lucide-react';
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

/* ═════════ Vibe coding: de una idea a un recurso, paso a paso (y con revisión) ═════════ */
const PROMPT = 'Crea un juego para grado sexto donde el estudiante atrapa la fracción correcta. Con 3 niveles y puntos.';
const IMPROVE = 'El botón es pequeño y no explica el error. Hazlo más grande, explica por qué y agrega vidas.';
const CODE = ['<main class="juego">', '  <h1>Atrapa la fracción</h1>', '  const [nivel, setNivel] = useState(1)', '  const [puntos, setPuntos] = useState(0)', '  function responder(op) {', '    if (op.correcta) sumar(10)', '  }', '</main>'];
const STEPS = [
  { t: 'Describes', d: 'El docente explica lo que necesita.' },
  { t: 'La IA interpreta', d: 'Identifica público, tema y mecánica.' },
  { t: 'Primera versión', d: 'Genera un recurso funcional.' },
  { t: 'Pruebas', d: 'El docente lo usa como estudiante.' },
  { t: 'Errores y ajustes', d: 'Detecta fallas y pide mejoras.' },
  { t: 'Versión mejorada', d: 'Vuelve a probar y decide.' },
];
const TAGS = ['Público: grado sexto', 'Tema: fracciones', 'Mecánica: juego', '3 niveles', 'Puntos'];

export function VibeDemo() {
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState(0);
  const [lines, setLines] = useState(0);
  const [playing, setPlaying] = useState(!reduce);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    window.clearInterval(timer.current);
    window.clearTimeout(timer.current);
    const go = (ms: number, to: number) => {
      if (playing) timer.current = window.setTimeout(() => setStep(to), ms);
    };
    if (step === 0) {
      setTyped(reduce ? PROMPT.length : 0);
      if (reduce) return go(1200, 1);
      timer.current = window.setInterval(() => {
        setTyped((n) => {
          if (n >= PROMPT.length) {
            window.clearInterval(timer.current);
            go(800, 1);
            return n;
          }
          if (n % 3 === 0) sfx.tick();
          return n + 1;
        });
      }, 30);
    } else if (step === 1) {
      go(2600, 2);
    } else if (step === 2) {
      setLines(0);
      timer.current = window.setInterval(() => {
        setLines((n) => {
          if (n >= CODE.length) {
            window.clearInterval(timer.current);
            sfx.ok();
            go(1500, 3);
            return n;
          }
          return n + 1;
        });
      }, 260);
    } else if (step === 3) go(3200, 4);
    else if (step === 4) {
      sfx.pop();
      go(3800, 5);
    } else if (step === 5) {
      sfx.ok();
      go(6000, 0);
    }
    return () => {
      window.clearInterval(timer.current);
      window.clearTimeout(timer.current);
    };
  }, [step, playing, reduce]);

  const built = step >= 2 && lines >= CODE.length - 1;
  const improved = step === 5;

  return (
    <section className="vibe enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">Google AI Studio · Build</span>
          <h2 className="h-lg">
            Vibe coding: <span className="grad-text">programar escribiendo</span>
          </h2>
        </div>
        <div className="vibe__ctl">
          <button type="button" className="btn" onClick={() => setPlaying((p) => !p)} aria-pressed={playing}>
            {playing ? <Pause /> : <Play />} {playing ? 'Pausar' : 'Reproducir'}
          </button>
          <button type="button" className="btn btn--icon" onClick={() => { setStep(0); setPlaying(true); }} aria-label="Reiniciar animación">
            <RotateCcw />
          </button>
        </div>
      </header>

      <ol className="vibe__flow" aria-label="Pasos del vibe coding">
        {STEPS.map((s, i) => (
          <li key={s.t} className={i === step ? 'is-on' : i < step ? 'is-past' : ''}>
            <button type="button" onClick={() => { setStep(i); setPlaying(false); }}>
              <b>{i + 1}</b>
              <span>
                <strong>{s.t}</strong>
                <small>{s.d}</small>
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div className="vibe__stage">
        <div className="vibe__win vibe__win--chat">
          <div className="vibe__bar">
            <i /> <i /> <i /> <span>Build · tu instrucción</span>
          </div>
          <p className="vibe__prompt">
            {PROMPT.slice(0, typed)}
            {step === 0 && <span className="vibe__caret" />}
          </p>
          {step >= 1 && (
            <div className="vibe__tags" aria-label="Lo que la IA interpretó">
              {TAGS.map((t, i) => (
                <span key={t} style={{ animationDelay: `${i * 0.18}s` }}>
                  {t}
                </span>
              ))}
            </div>
          )}
          {step >= 2 && (
            <div className="vibe__code" aria-hidden="true">
              {CODE.slice(0, step === 2 ? lines : CODE.length).map((l, i) => (
                <code key={i}>{l}</code>
              ))}
            </div>
          )}
          {step >= 4 && <p className="vibe__prompt vibe__prompt--improve">{IMPROVE}</p>}
        </div>

        <div className={`vibe__win vibe__win--app ${step >= 2 ? 'is-on' : ''}`}>
          <div className="vibe__bar">
            <i /> <i /> <i /> <span>Vista previa del recurso</span>
          </div>
          {built || step > 2 ? (
            <div className={`vibe__app ${improved ? 'is-better' : ''}`}>
              <div className="vibe__hud">
                <span>Nivel 1</span>
                <b>{improved ? '♥ ♥ ♥' : '★ 0'}</b>
              </div>
              <h4>¿Cuál es mayor?</h4>
              <div className="vibe__opts">
                <span>1/2</span>
                <span className={step >= 3 && !improved ? 'is-bad' : ''}>2/5</span>
                <span className={improved ? 'is-ok' : ''}>3/4</span>
              </div>
              {step === 3 && <em className="vibe__flag">Al fallar solo dice “incorrecto”</em>}
              {improved && <p className="vibe__why">Porque 3/4 = 0,75 y 1/2 = 0,5. ¡Inténtalo de nuevo!</p>}
            </div>
          ) : (
            <p className="vibe__wait">{step === 2 ? 'Generando la primera versión…' : 'Aquí aparecerá el recurso.'}</p>
          )}
        </div>
      </div>

      <p className="vibe__note">
        <ShieldAlert /> La IA no es infalible: <b>prueba, revisa y corrige</b> siempre antes de usar un recurso con estudiantes.
      </p>
    </section>
  );
}
