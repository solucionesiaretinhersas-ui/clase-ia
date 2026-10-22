import { useEffect, useRef, useState } from 'react';
import { Code2, GraduationCap, Pause, Play, RotateCcw, Sparkles } from 'lucide-react';
import { sfx } from '../lib/sfx';

/* ─────────── La IA llegó a la educación: potenciarte, no reemplazarte ─────────── */
const AXES = ['Diseñar materiales', 'Personalizar', 'Interactividad', 'Retroalimentación', 'Tiempo con estudiantes'];
const BASE = [0.5, 0.4, 0.3, 0.42, 0.36];
const PLUS = [0.92, 0.86, 0.9, 0.82, 0.84];
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
            <span key={t} className="pot__sat" style={{ '--a': `${i * 72}deg` } as React.CSSProperties}>
              <em>{t}</em>
            </span>
          ))}
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
          <svg viewBox="0 0 320 300" role="img" aria-label="Gráfica de capacidades de diseño del docente, sin y con IA">
            {[0.33, 0.66, 1].map((g) => (
              <polygon key={g} points={poly(AXES.map(() => g))} className="radar__grid" />
            ))}
            {AXES.map((_, i) => {
              const [x, y] = pt(i, 1);
              return <line key={i} x1={CX} y1={CY} x2={x} y2={y} className="radar__axis" />;
            })}
            <polygon points={poly(BASE)} className="radar__base" />
            <polygon points={poly(PLUS)} className={`radar__plus ${ia ? 'is-on' : ''}`} />
            {AXES.map((l, i) => {
              const [x, y] = pt(i, 1.2);
              return (
                <text key={l} x={x} y={y} textAnchor={x < CX - 8 ? 'end' : x > CX + 8 ? 'start' : 'middle'} className="radar__label">
                  {l}
                </text>
              );
            })}
          </svg>
          <small>Ilustración conceptual: muestra la idea, no una medición.</small>
        </div>
      </div>

      <p className="pot__line">
        El criterio, el vínculo y la sabiduría siguen siendo <b>tuyos</b>. La IA acelera el borrador; <b>tú diriges el diseño</b>.
      </p>
    </section>
  );
}

/* ─────────── Vibe coding: describir, generar, probar, mejorar ─────────── */
const PROMPT = 'Crea un juego para grado sexto donde el estudiante atrapa la fracción correcta. Con 3 niveles y puntos.';
const IMPROVE = 'Hazlo más difícil y agrega una barra de vidas.';
const CODE = ['<main class="juego">', '  <h1>Atrapa la fracción</h1>', '  const [nivel, setNivel] = useState(1)', '  const [puntos, setPuntos] = useState(0)', '  function responder(op) {', '    if (op.correcta) sumar(10)', '  }', '  <Pregunta nivel={nivel} />', '</main>'];
const STEPS = ['Describes', 'La IA programa', 'Pruebas', 'Mejoras'];

export function VibeDemo() {
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState(0);
  const [lines, setLines] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timer = useRef<number | undefined>(undefined);

  // Guion de la animación: cada paso avanza solo mientras esté en reproducción
  useEffect(() => {
    window.clearInterval(timer.current);
    window.clearTimeout(timer.current);
    if (step === 0) {
      setTyped(0);
      timer.current = window.setInterval(() => {
        setTyped((n) => {
          if (n >= PROMPT.length) {
            window.clearInterval(timer.current);
            if (playing) timer.current = window.setTimeout(() => setStep(1), 900);
            return n;
          }
          if (n % 3 === 0) sfx.tick();
          return n + 1;
        });
      }, 32);
    } else if (step === 1) {
      setLines(0);
      timer.current = window.setInterval(() => {
        setLines((n) => {
          if (n >= CODE.length) {
            window.clearInterval(timer.current);
            if (playing) timer.current = window.setTimeout(() => setStep(2), 700);
            return n;
          }
          return n + 1;
        });
      }, 300);
    } else if (step === 2) {
      sfx.ok();
      if (playing) timer.current = window.setTimeout(() => setStep(3), 2600);
    } else if (step === 3) {
      sfx.pop();
      if (playing) timer.current = window.setTimeout(() => setStep(0), 4200);
    }
    return () => {
      window.clearInterval(timer.current);
      window.clearTimeout(timer.current);
    };
  }, [step, playing]);

  const showApp = step >= 2;
  const improved = step === 3;

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

      <ol className="vibe__steps">
        {STEPS.map((s, i) => (
          <li key={s}>
            <button type="button" className={i === step ? 'is-on' : i < step ? 'is-past' : ''} onClick={() => { setStep(i); setPlaying(false); }}>
              <b>{i + 1}</b> {s}
            </button>
          </li>
        ))}
      </ol>

      <div className="vibe__stage">
        <div className="vibe__win vibe__win--chat">
          <div className="vibe__bar">
            <i /> <i /> <i /> <span>Build · prompt</span>
          </div>
          <p className="vibe__prompt">
            {PROMPT.slice(0, typed)}
            {step === 0 && <span className="vibe__caret" />}
          </p>
          {step === 3 && <p className="vibe__prompt vibe__prompt--improve">{IMPROVE}</p>}
          {step >= 1 && (
            <div className="vibe__code" aria-hidden="true">
              <Code2 />
              {CODE.slice(0, step === 1 ? lines : CODE.length).map((l, i) => (
                <code key={i}>{l}</code>
              ))}
            </div>
          )}
        </div>

        <div className={`vibe__win vibe__win--app ${showApp ? 'is-on' : ''}`}>
          <div className="vibe__bar">
            <i /> <i /> <i /> <span>Vista previa</span>
          </div>
          {showApp ? (
            <div className="vibe__app">
              <div className="vibe__hud">
                <span>Nivel 1</span>
                <b>{improved ? '♥ ♥ ♥' : '★ 0'}</b>
              </div>
              <h4>¿Cuál es mayor?</h4>
              <div className="vibe__opts">
                <span>1/2</span>
                <span className="is-ok">3/4</span>
                <span>2/5</span>
              </div>
              {improved && <em className="vibe__toast">Más difícil + vidas ✓</em>}
            </div>
          ) : (
            <p className="vibe__wait">{step === 1 ? 'Generando tu aplicación…' : 'Aquí aparecerá tu aplicación.'}</p>
          )}
        </div>
      </div>
    </section>
  );
}
