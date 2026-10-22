import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  BookOpen,
  Check,
  ClipboardCheck,
  Compass,
  FlaskConical,
  Flag,
  Hammer,
  Lightbulb,
  MessageSquareText,
  MonitorPlay,
  PencilRuler,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  Wand2,
  type LucideIcon,
} from 'lucide-react';
import { sfx } from '../lib/sfx';
import { confetti } from '../lib/confetti';

/* ═════════ ¿Qué es Google AI Studio? ═════════ */

const HOTSPOTS = [
  { n: 1, t: 'Build', d: 'La sección donde se construyen aplicaciones: aquí vamos a crear el aula.' },
  { n: 2, t: 'Tu instrucción', d: 'Pegas el prompt que te dio ChatGPT. Aquí describes la clase, no programas.' },
  { n: 3, t: 'Vista previa', d: 'Tu aula aparece funcionando. La puedes usar como lo haría un estudiante.' },
  { n: 4, t: 'Mejorar conversando', d: 'Si algo no te gusta, lo pides con palabras y Gemini lo cambia.' },
];

const HOW = [
  { icon: MessageSquareText, t: 'Describes', d: 'Cuentas qué aula quieres, para quién y qué debe tener.' },
  { icon: Wand2, t: 'Gemini construye', d: 'Genera una aplicación web con todas las partes de tu clase.' },
  { icon: MonitorPlay, t: 'Pruebas', d: 'La recorres como estudiante y revisas si enseña lo que quieres.' },
  { icon: PencilRuler, t: 'Mejoras', d: 'Pides cambios hasta que sea tu aula.' },
];

const HOTSPOTS_KIDS = [
  { n: 1, t: 'Build', d: 'Aquí se construyen las aplicaciones. ¡Es tu taller de inventos!' },
  { n: 2, t: 'Tu idea', d: 'Escribes qué quieres crear, con tus palabras. No necesitas saber programar.' },
  { n: 3, t: 'Tu app funcionando', d: 'Aparece al instante y puedes probarla como si fuera un videojuego.' },
  { n: 4, t: 'Pide cambios', d: 'Si algo no te gusta, escribes “hazlo más rápido” y la IA lo cambia.' },
];

const HOW_KIDS = [
  { icon: MessageSquareText, t: 'Escribes tu idea', d: 'Cuentas qué quieres crear: un juego, un quiz, una historia…' },
  { icon: Wand2, t: 'La IA programa', d: 'Escribe el código de tu aplicación en un momento.' },
  { icon: MonitorPlay, t: 'Tú la pruebas', d: 'La juegas y miras si hace lo que querías.' },
  { icon: PencilRuler, t: 'Pides mejoras', d: 'Cambias colores, niveles, puntos… ¡hasta que sea tuya!' },
];

/** Qué es Google AI Studio, cómo funciona y dónde está cada cosa en su pantalla (ilustración). */
export function StudioIntro({ kids = false }: { kids?: boolean }) {
  const [hot, setHot] = useState(1);
  const spots = kids ? HOTSPOTS_KIDS : HOTSPOTS;
  const how = kids ? HOW_KIDS : HOW;
  const cur = spots.find((h) => h.n === hot) ?? spots[0];

  return (
    <section className="stu enter">
      <header className="screen-head">
        <span className="kicker">{kids ? 'Momento 3 · Google AI Studio' : 'Etapa 2 · Google AI Studio'}</span>
        {kids ? (
          <>
            <h2 className="h-xl">
              Escribes una idea y la IA <span className="grad-text">crea tu app</span>
            </h2>
            <p className="lead">
              Google AI Studio es un lugar de Google donde se crean aplicaciones <b>escribiendo con tus palabras</b>. Hoy vas a inventar tu propio juego o tu propia herramienta.
            </p>
          </>
        ) : (
          <>
            <h2 className="h-xl">
              Describes tu clase y la IA <span className="grad-text">construye tu aula</span>
            </h2>
            <p className="lead">
              Google AI Studio es una herramienta de Google donde se crean aplicaciones hablando con Gemini. Para un docente significa algo muy concreto: una <b>aula interactiva completa</b>, con todo lo de tu clase en un solo lugar, sin
              escribir código.
            </p>
          </>
        )}
      </header>

      <div className="stu__body">
        <figure className="stu__mock" aria-label="Ilustración de la pantalla de Google AI Studio">
          <div className="stu__chrome">
            <i /> <i /> <i />
            <span>aistudio.google.com</span>
          </div>
          <div className="stu__app">
            <nav className="stu__side">
              <img src="/brand/ai-studio.png" alt="" />
              <span>Chat</span>
              <button type="button" className={`stu__hot ${hot === 1 ? 'is-on' : ''}`} onClick={() => { setHot(1); sfx.pop(); }} aria-label="Ver: Build">
                <b>1</b> Build
              </button>
              <span>Historial</span>
            </nav>
            <div className="stu__main">
              <button type="button" className={`stu__prompt stu__hot ${hot === 2 ? 'is-on' : ''}`} onClick={() => { setHot(2); sfx.pop(); }} aria-label="Ver: tu instrucción">
                <b>2</b>
                <span>{kids ? 'Crea un juego donde atrapo estrellas y esquivo meteoritos…' : 'Crea un aula interactiva sobre el ciclo del agua para grado sexto…'}</span>
              </button>
              <div className="stu__split">
                <button type="button" className={`stu__preview stu__hot ${hot === 3 ? 'is-on' : ''}`} onClick={() => { setHot(3); sfx.pop(); }} aria-label="Ver: vista previa">
                  <b>3</b>
                  <div className="stu__aula">
                    <em>{kids ? 'Atrapa estrellas ⭐' : 'El ciclo del agua'}</em>
                    <i /> <i /> <i />
                  </div>
                </button>
                <button type="button" className={`stu__chat stu__hot ${hot === 4 ? 'is-on' : ''}`} onClick={() => { setHot(4); sfx.pop(); }} aria-label="Ver: mejorar conversando">
                  <b>4</b>
                  <span>{kids ? 'Hazlo más rápido' : 'Hazlo más grande para el tablero'}</span>
                </button>
              </div>
            </div>
          </div>
          <figcaption>Ilustración: la pantalla real puede cambiar de aspecto. Toca los números.</figcaption>
        </figure>

        <aside className="stu__note glass" aria-live="polite" key={cur.n}>
          <span className="stu__num">{cur.n}</span>
          <h3>{cur.t}</h3>
          <p>{cur.d}</p>
        </aside>
      </div>

      <ol className="stu__how">
        {how.map(({ icon: Icon, t, d }, i) => (
          <li key={t} style={{ '--i': i } as CSSProperties}>
            <span>
              <Icon />
            </span>
            <strong>{t}</strong>
            <small>{d}</small>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ═════════ Aula interactiva completa (simulación ilustrativa) ═════════ */

interface Section {
  id: string;
  label: string;
  icon: LucideIcon;
}

const SECTIONS: Section[] = [
  { id: 'inicio', label: 'Bienvenida', icon: Flag },
  { id: 'explora', label: 'Explora', icon: Compass },
  { id: 'lab', label: 'Laboratorio', icon: FlaskConical },
  { id: 'practica', label: 'Practica', icon: Target },
  { id: 'evalua', label: 'Evalúa', icon: ClipboardCheck },
  { id: 'cierre', label: 'Reflexiona', icon: Lightbulb },
];

const PROMPT = 'Crea un aula interactiva sobre el ciclo del agua para grado sexto, con bienvenida, exploración, un laboratorio, práctica con retroalimentación, evaluación y cierre. Que se vea grande en el tablero y tenga navegación por momentos.';

const STAGES = [
  { t: 'Evaporación', d: 'El calor del sol convierte el agua de ríos y mares en vapor.' },
  { t: 'Condensación', d: 'El vapor sube, se enfría y forma las nubes.' },
  { t: 'Precipitación', d: 'Las gotas pesadas caen como lluvia, granizo o nieve.' },
  { t: 'Escorrentía', d: 'El agua baja por el terreno y vuelve a ríos y mares.' },
];

const QUIZ = [
  { q: '¿Qué provoca la evaporación?', o: ['El calor del sol', 'El frío', 'El viento solamente'], a: 0, fb: 'Con más calor, el agua se evapora más rápido.' },
  { q: '¿Cómo se forman las nubes?', o: ['Con humo', 'El vapor se enfría y se condensa', 'Con polvo'], a: 1, fb: 'El vapor, al enfriarse arriba, se convierte en gotitas.' },
  { q: '¿Qué viene después de la precipitación?', o: ['La escorrentía', 'La evaporación del sol', 'Nada'], a: 0, fb: 'El agua que cae corre por el terreno y regresa a ríos y mares.' },
];

const IMPROVE = [
  { id: 'big', label: 'Hazlo más grande para el tablero', ask: 'Haz todo más grande para proyectarlo en el tablero.' },
  { id: 'pts', label: 'Agrega puntos y logros', ask: 'Agrega puntos y una insignia por cada momento completado.' },
  { id: 'local', label: 'Usa ejemplos de mi comunidad', ask: 'Cambia los ejemplos por situaciones de mi río y mi municipio.' },
];

function Practice({ on }: { on: boolean }) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="aula__pane">
      <h4>Ordena el recorrido del agua</h4>
      <p>Toca la etapa que sigue después de la <b>condensación</b>.</p>
      <div className="aula__opts">
        {['Precipitación', 'Evaporación', 'Escorrentía'].map((o, i) => (
          <button key={o} type="button" className={picked === i ? (i === 0 ? 'is-ok' : 'is-bad') : ''} onClick={() => { setPicked(i); i === 0 ? sfx.ok() : sfx.bad(); }}>
            {o}
          </button>
        ))}
      </div>
      {picked !== null && <p className="aula__fb">{picked === 0 ? '¡Bien! Las nubes se cargan y el agua cae.' : 'Todavía no. Pista: piensa en lo que hacen las nubes cuando se cargan de agua.'}</p>}
      {on && <span className="aula__badge">+10 puntos por intentarlo</span>}
    </div>
  );
}

function Lab() {
  const [t, setT] = useState(22);
  const evap = Math.max(0, (t - 5) / 35);
  return (
    <div className="aula__pane">
      <h4>¿Qué pasa si sube la temperatura?</h4>
      <label className="aula__range">
        Temperatura: <b>{t} °C</b>
        <input type="range" min={0} max={40} value={t} onChange={(e) => setT(Number(e.target.value))} aria-label="Temperatura" />
      </label>
      <div className="aula__meter" aria-label={`Evaporación ${Math.round(evap * 100)} por ciento`}>
        <i style={{ width: `${evap * 100}%` }} />
      </div>
      <p>
        Evaporación: <b>{evap < 0.25 ? 'lenta' : evap < 0.6 ? 'media' : 'rápida'}</b>
      </p>
    </div>
  );
}

function Quiz({ onDone }: { onDone: (score: number) => void }) {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const q = QUIZ[Math.min(i, QUIZ.length - 1)];
  const finished = i >= QUIZ.length;

  if (finished)
    return (
      <div className="aula__pane">
        <h4>
          Resultado: {score} de {QUIZ.length}
        </h4>
        <p>{score === QUIZ.length ? '¡Dominas el ciclo del agua!' : 'Repasa la exploración y vuelve a intentarlo.'}</p>
        <button type="button" className="btn" onClick={() => { setI(0); setScore(0); setPick(null); }}>
          <RotateCcw /> Reintentar
        </button>
      </div>
    );

  return (
    <div className="aula__pane">
      <h4>
        Pregunta {i + 1} de {QUIZ.length}
      </h4>
      <p>{q.q}</p>
      <div className="aula__opts">
        {q.o.map((o, k) => (
          <button
            key={o}
            type="button"
            disabled={pick !== null}
            className={pick === null ? '' : k === q.a ? 'is-ok' : k === pick ? 'is-bad' : ''}
            onClick={() => {
              setPick(k);
              if (k === q.a) {
                setScore((s) => s + 1);
                sfx.ok();
              } else sfx.bad();
            }}
          >
            {o}
          </button>
        ))}
      </div>
      {pick !== null && (
        <>
          <p className="aula__fb">{q.fb}</p>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => {
              const last = i + 1 >= QUIZ.length;
              setI(i + 1);
              setPick(null);
              if (last) onDone(score);
            }}
          >
            {i + 1 >= QUIZ.length ? 'Ver resultado' : 'Siguiente'}
          </button>
        </>
      )}
    </div>
  );
}

/**
 * Simulación ilustrativa de lo que se puede pedir: un aula completa (no un recurso suelto).
 * Se construye por momentos, se recorre como estudiante y se mejora con una frase.
 */
export function AulaDemo() {
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [phase, setPhase] = useState<'idle' | 'building' | 'ready'>('idle');
  const [typed, setTyped] = useState(0);
  const [built, setBuilt] = useState(0);
  const [sec, setSec] = useState(0);
  const [seen, setSeen] = useState<number[]>([0]);
  const [open, setOpen] = useState<number | null>(null);
  const [asked, setAsked] = useState<string[]>([]);
  const timer = useRef<number | undefined>(undefined);

  const start = () => {
    window.clearInterval(timer.current);
    setPhase('building');
    setTyped(0);
    setBuilt(0);
    setSec(0);
    setSeen([0]);
    setOpen(null);
    setAsked([]);
    sfx.whoosh();
    if (reduce) {
      setTyped(PROMPT.length);
      setBuilt(SECTIONS.length);
      setPhase('ready');
      return;
    }
    let n = 0;
    timer.current = window.setInterval(() => {
      n += 3;
      setTyped(Math.min(n, PROMPT.length));
      if (n >= PROMPT.length) {
        window.clearInterval(timer.current);
        let b = 0;
        timer.current = window.setInterval(() => {
          b += 1;
          setBuilt(b);
          sfx.pop();
          if (b >= SECTIONS.length) {
            window.clearInterval(timer.current);
            setPhase('ready');
            sfx.win();
            confetti({ count: 70, y: 0.55 });
          }
        }, 650);
      }
    }, 28);
  };
  useEffect(() => () => window.clearInterval(timer.current), []);

  const go = (i: number) => {
    if (i >= built) return;
    setSec(i);
    setSeen((s) => (s.includes(i) ? s : [...s, i]));
    sfx.pop();
  };
  const progress = Math.round((seen.length / SECTIONS.length) * 100);
  const big = asked.includes('big');
  const pts = asked.includes('pts');
  const local = asked.includes('local');
  const cur = SECTIONS[sec];

  return (
    <section className="aulad enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">Etapa 2 · Lo que puedes pedir</span>
          <h2 className="h-lg">
            No un recurso suelto: <span className="grad-text">tu aula completa</span>
          </h2>
        </div>
        <div className="aulad__ctl">
          <button type="button" className="btn btn--primary btn--lg" onClick={start}>
            {phase === 'idle' ? (
              <>
                <Play /> Construir el aula
              </>
            ) : (
              <>
                <RotateCcw /> Empezar de nuevo
              </>
            )}
          </button>
        </div>
      </header>

      <div className="aulad__grid">
        <aside className="aulad__chat glass" aria-label="Conversación con Gemini">
          <span className="kicker">
            <Sparkles /> Tu instrucción
          </span>
          <p className="aulad__bubble">{phase === 'idle' ? <i>Pulsa “Construir el aula” para ver cómo se pide.</i> : PROMPT.slice(0, typed)}</p>
          {phase !== 'idle' && (
            <p className="aulad__status" role="status">
              {phase === 'building' && typed < PROMPT.length ? 'Escribiendo tu instrucción…' : phase === 'building' ? `Gemini construye el aula · ${built} de ${SECTIONS.length} momentos` : 'Aula lista. Recórrela como un estudiante.'}
            </p>
          )}
          {phase === 'ready' && (
            <div className="aulad__improve">
              <span className="kicker">Mejorar conversando</span>
              {IMPROVE.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`btn ${asked.includes(m.id) ? 'btn--primary' : ''}`}
                  onClick={() => {
                    setAsked((a) => (a.includes(m.id) ? a.filter((x) => x !== m.id) : [...a, m.id]));
                    sfx.ok();
                  }}
                  aria-pressed={asked.includes(m.id)}
                  title={m.ask}
                >
                  {asked.includes(m.id) && <Check />} {m.label}
                </button>
              ))}
            </div>
          )}
          <p className="note-muted">Ilustración de lo que podría generar. Cada aula real se construye, se prueba y se corrige en Google AI Studio.</p>
        </aside>

        <div className={`aula ${big ? 'aula--big' : ''} ${phase === 'idle' ? 'is-empty' : ''}`} aria-label="Vista previa del aula">
          <div className="aula__top">
            <strong>El ciclo del agua · grado sexto</strong>
            <span className="aula__prog" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <span className="aula__bar">
                <i style={{ width: `${progress}%` }} />
              </span>
              <small>{progress}% recorrido</small>
            </span>
            {pts && <span className="aula__badge">★ {seen.length * 10} puntos</span>}
          </div>
          <div className="aula__body">
            <nav className="aula__nav" aria-label="Momentos de la clase">
              {SECTIONS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <button key={s.id} type="button" className={`${i === sec && i < built ? 'is-on' : ''} ${i < built ? 'is-built' : ''}`} disabled={i >= built} onClick={() => go(i)} style={{ '--i': i } as CSSProperties}>
                    <Icon /> <span>{s.label}</span>
                    {seen.includes(i) && i < built && <Check className="aula__seen" />}
                  </button>
                );
              })}
            </nav>
            <div className="aula__content">
              {phase === 'idle' && (
                <div className="aula__ph">
                  <Hammer />
                  <p>Aquí aparecerá tu aula, con todos los momentos de la clase.</p>
                </div>
              )}
              {phase !== 'idle' && sec >= built && <div className="aula__ph"><p>Construyendo…</p></div>}
              {phase !== 'idle' && sec < built && cur.id === 'inicio' && (
                <div className="aula__pane">
                  <h4>¡Bienvenidos! Hoy seguimos el viaje de una gota</h4>
                  <ul className="aula__goals">
                    <li><BookOpen /> Explicar las etapas del ciclo del agua</li>
                    <li><Target /> {local ? 'Proponer cómo cuidar nuestro río' : 'Proponer cómo cuidar una fuente de agua'}</li>
                  </ul>
                  <button type="button" className="btn btn--primary" onClick={() => go(1)}>
                    Comenzar <Play />
                  </button>
                </div>
              )}
              {phase !== 'idle' && sec < built && cur.id === 'explora' && (
                <div className="aula__pane">
                  <h4>Toca cada etapa</h4>
                  <div className="aula__cards">
                    {STAGES.map((s, i) => (
                      <button key={s.t} type="button" className={open === i ? 'is-on' : ''} onClick={() => { setOpen(open === i ? null : i); sfx.pop(); }}>
                        <b>{i + 1}</b> {s.t}
                        {open === i && <small>{s.d}</small>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {phase !== 'idle' && sec < built && cur.id === 'lab' && <Lab />}
              {phase !== 'idle' && sec < built && cur.id === 'practica' && <Practice on={pts} />}
              {phase !== 'idle' && sec < built && cur.id === 'evalua' && <Quiz onDone={() => sfx.win()} />}
              {phase !== 'idle' && sec < built && cur.id === 'cierre' && (
                <div className="aula__pane">
                  <h4>Para pensar</h4>
                  <p>{local ? '¿Qué podemos hacer los vecinos para que nuestro río siga limpio?' : '¿Qué harías tú para cuidar el agua de tu entorno?'}</p>
                  <textarea className="input" rows={3} placeholder="Escribe tu reflexión…" aria-label="Reflexión del estudiante" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Versión para estudiantes. */
export const StudioIntroKids = () => <StudioIntro kids />;
