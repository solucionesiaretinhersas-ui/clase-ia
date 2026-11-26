import { useEffect, useMemo, useRef, type ComponentType, type CSSProperties } from 'react';
import { Smartphone } from 'lucide-react';
import { ActivityControls, useActivityStatus } from '../components/ActivityShell';
import { Howto } from '../components/Howto';
import { QRCode } from '../components/QRCode';
import { ANSWER_KEYS } from '../data/answers';
import { joinRoute } from '../data/workshops';
import { useAnnounce } from '../presenter/announce';
import { sfx } from '../lib/sfx';
import { LIVE_SYNC_AVAILABLE, useLiveResponses, useSessionCode } from '../lib/sync';
import { usePersistentState } from '../lib/storage';
import { internalUrl } from '../lib/urls';
import { usePublicBase } from '../lib/usePublicBase';
import { IdeaWall, type WallConfig } from './IdeaWall';

/**
 * Foro Georges Noble School. Las diapositivas de FORO.pdf se proyectan como imágenes
 * (public/foro/sNN.jpg) y entre ellas hay cuatro momentos de diálogo desde el celular:
 * una encuesta, una nube de palabras y dos muros de ideas. Son para escuchar opiniones:
 * no hay respuestas correctas ni se evalúa a nadie.
 */

/** Texto alternativo de cada diapositiva (lectores de pantalla y respaldo si falta la imagen). */
const ALT: Record<number, string> = {
  1: 'Portada: Inteligencia Artificial, de la innovación a la transformación de realidades. Luis Alejandro Caldera Caldera, Universidad de Córdoba.',
  2: '¿Qué pasaría si dejáramos de ser únicamente consumidores de inteligencia artificial y comenzáramos a ser creadores de soluciones? Consumidores de tecnología usan la IA para resolver preguntas, generar textos o crear contenido. Creadores de soluciones diseñan, desarrollan e implementan herramientas con IA que resuelven necesidades reales.',
  3: 'La evolución de la IA, de reconocer patrones a construir soluciones: IA tradicional, IA generativa, IA multimodal y agentes de IA.',
  4: 'Grandes hitos de la IA: 1950 Turing, 1956 Dartmouth, 1958 Perceptrón, años 80 sistemas expertos, 1997 Deep Blue, 2012 Deep Learning, 2017 Transformer, 2022 ChatGPT y hoy IA multimodal y agentes.',
  5: 'Gráfico GPQA Diamond: puntaje contra costo por tarea de distintos modelos de IA, con la frontera de Pareto.',
  6: 'Implicaciones de la IA, una transformación que va más allá de la tecnología: educación, salud, trabajo y sociedad.',
  7: 'Oportunidades y desafíos de la IA: un gran potencial, una gran responsabilidad.',
  8: '¿Cómo construimos soluciones con IA? Cuatro pasos: problema real, diseño de la solución, desarrollo con IA y validación e impacto.',
  9: 'Ecosistema de herramientas de IA: Google AI Studio, Google Antigravity, Claude Code y Python.',
  10: 'Vibe coding, una nueva forma de crear software: describe tu idea, genera, prueba y mejora.',
  11: 'Soluciones creadas con inteligencia artificial: InspiraTEC, Pasar Pro y Mentor STEM.',
  12: 'Accede a nuestras soluciones con IA: códigos QR de InspiraTEC, Pasar Pro y Mentor STEM.',
  13: 'Diferentes problemas, una misma visión: la inteligencia artificial como herramienta transversal.',
  14: 'Cierre: el verdadero poder de la inteligencia artificial está en las realidades que podemos transformar con ella. ¿Qué problema de tu entorno comenzarías a resolver hoy? ¡Atrévete a innovar!',
};

function Slide({ n }: { n: number }) {
  return (
    <section className="gslide enter">
      <img src={`${import.meta.env.BASE_URL}foro/s${String(n).padStart(2, '0')}.jpg`} alt={ALT[n]} draggable={false} />
    </section>
  );
}

const slideOf = (n: number): ComponentType => () => <Slide n={n} />;

/* ───────── Diálogo 1 · Encuesta: ¿consumidor o creador? ───────── */

interface PollCfg {
  id: string;
  kicker: string;
  title: string;
  /** Pregunta que ven en el celular. */
  prompt: string;
  options: { label: string; sub?: string }[];
  howto: string[];
  minutes: number;
}

const POLL_CONSUMER: PollCfg = {
  id: 'g-q1',
  kicker: 'Diálogo 1 · encuesta desde tu celular',
  title: '¿Dónde te ubicas hoy: consumidor o creador?',
  prompt: '¿Dónde te ubicas hoy: consumidor o creador de IA?',
  options: [
    { label: 'Consumidor', sub: 'Uso la IA para consultar y generar contenido.' },
    { label: 'Consumidor frecuente', sub: 'La uso a diario y sé pedirle bien.' },
    { label: 'En camino', sub: 'Ya empecé a crear algo con ayuda de la IA.' },
    { label: 'Creador', sub: 'Construyo soluciones con IA.' },
  ],
  howto: ['Lee las cuatro opciones en la pantalla.', 'Toca en tu celular la que más se parece a ti hoy.', 'Mira cómo se reparte el grupo: no hay opción correcta.'],
  minutes: 2,
};

const POLL_FIELD: PollCfg = {
  id: 'g-q3',
  kicker: 'Diálogo 3 · votación de un toque desde tu celular',
  title: 'Si crearas una app con IA, ¿para qué campo sería?',
  prompt: 'Si pudieras crear una app con IA, ¿para qué campo sería?',
  options: [
    { label: 'Salud', sub: 'Cuidar y prevenir.' },
    { label: 'Educación', sub: 'Enseñar y aprender mejor.' },
    { label: 'Negocios y economía', sub: 'Emprender, vender, ahorrar.' },
    { label: 'Vida diaria y ocio', sub: 'Organizar, jugar, crear.' },
  ],
  howto: ['Piensa en una app que te gustaría tener.', 'Toca el campo al que pertenece (30 segundos).', 'Después, 2 o 3 personas nos cuentan su idea en voz alta.'],
  minutes: 1,
};

/** Conteo de la encuesta: celulares (uno por dispositivo) + ajuste manual del facilitador. */
function usePoll(id: string, n: number) {
  const [status] = useActivityStatus(id);
  const [adj, setAdj] = usePersistentState<number[]>(`poll:${id}`, Array(n).fill(0));
  const { code } = useSessionCode();
  const live = useLiveResponses(LIVE_SYNC_AVAILABLE ? code : '', id);
  const remote = useMemo(() => {
    const r = Array<number>(n).fill(0);
    live.responses.forEach((x) => {
      const k = Number(x.value);
      if (k >= 0 && k < n) r[k]++;
    });
    return r;
  }, [live.responses, n]);
  const votes = remote.map((v, k) => Math.max(0, v + (adj[k] ?? 0)));
  const total = votes.reduce((a, b) => a + b, 0);
  const last = useRef(total);
  useEffect(() => {
    if (total > last.current) sfx.pop();
    last.current = total;
  }, [total]);
  const bump = (k: number) => setAdj((a) => Array.from({ length: n }, (_, j) => (a[j] ?? 0) + (j === k ? 1 : 0)));
  const clear = () => setAdj(remote.map((v) => -v));
  return { status, open: status === 'open', votes, total, live, code, bump, clear };
}

function TapPoll({ cfg }: { cfg: PollCfg }) {
  const { id: POLL_ID, options: POLL_OPTIONS, howto: POLL_HOWTO } = cfg;
  const p = usePoll(POLL_ID, POLL_OPTIONS.length);
  const [, setStatus] = useActivityStatus(POLL_ID);
  // La votación se abre sola al llegar a la pantalla y las barras se ven desde el primer voto.
  useEffect(() => {
    if (p.status === 'idle') setStatus('open');
  }, [p.status, setStatus]);
  const { base, reachable } = usePublicBase();
  // Los resultados siempre se ven: no hay botón para ocultarlos (así ningún ensayo guardado los deja ocultos).
  const show = true;
  const max = Math.max(1, ...p.votes);
  const leader = p.total ? p.votes.indexOf(Math.max(...p.votes)) : -1;
  useAnnounce(POLL_ID, {
    key: POLL_ID,
    kind: 'choice',
    prompt: cfg.prompt,
    options: POLL_OPTIONS.map((o) => (o.sub ? `${o.label}: ${o.sub}` : o.label)),
    open: p.open,
    howto: POLL_HOWTO,
  });
  return (
    <section className="vote enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">{cfg.kicker}</span>
          <h2 className="h-lg">{cfg.title}</h2>
        </div>
        <ActivityControls id={POLL_ID} openLabel="Abrir encuesta" onReset={() => p.clear()} />
      </header>

      <div className="vote__body">
        <div>
          {p.total === 0 && <Howto steps={POLL_HOWTO} minutes={cfg.minutes} kind="votación de un toque" />}
          <div className={`vote__options ${!p.open ? 'is-locked' : ''}`}>
            {POLL_OPTIONS.map((o, k) => {
              const key = ANSWER_KEYS[k % 4];
              const pct = p.total ? Math.round((p.votes[k] / p.total) * 100) : 0;
              return (
                <div key={o.label} className={`vote__opt ${show && k === leader ? 'is-leader' : ''}`} style={{ '--c': key.color } as CSSProperties}>
                  <button type="button" className="vote__btn" disabled={!p.open} onClick={() => p.bump(k)} aria-label={`Sumar un voto manual a ${o.label}`}>
                    <span className="vote__letter">{key.letter}</span>
                    <span className="vote__label">
                      {o.label}
                      {o.sub && <small className="gn-sub">{o.sub}</small>}
                    </span>
                    <span className="vote__bar" style={{ width: show ? `${(p.votes[k] / max) * 100}%` : '0%' }} />
                    <span className="vote__num">{show ? `${p.votes[k]} · ${pct}%` : ''}</span>
                  </button>
                </div>
              );
            })}
          </div>
          <div className="vote__foot">
            <span className="vote__total">
              <b>{p.total}</b> {p.total === 1 ? 'voto' : 'votos'}
            </span>
          </div>
        </div>

        <aside className="vote__phone glass">
          <span className="vote__phone-head">
            <Smartphone /> Responde desde tu celular
          </span>
          <QRCode value={internalUrl(base, joinRoute(p.code))} size={170} />
          {LIVE_SYNC_AVAILABLE ? (
            <span className={`chip ${p.live.status === 'live' ? 'chip--live' : p.live.status === 'error' ? 'chip--warn' : 'chip--muted'}`}>
              {p.live.status === 'live' && <span className="dot dot--pulse" />}
              {p.live.status === 'live' ? 'En vivo' : p.live.status === 'error' ? 'Sin conexión' : 'Conectando…'} · {p.code}
            </span>
          ) : (
            <p className="note-muted">Sincronización en vivo no configurada: suma los votos con el botón de cada opción.</p>
          )}
          {!reachable && <p className="note-warn">Este QR necesita una dirección pública o de red local (tecla J).</p>}
        </aside>
      </div>
    </section>
  );
}

/* ───────── Diálogos 2, 3 y 4 · muros ───────── */

const Q2: WallConfig = {
  id: 'g-q2',
  screenId: 'g-q2',
  kicker: 'Diálogo 2 · nube de palabras desde tu celular',
  title: 'En una palabra: ¿qué sientes frente a la IA y a lo que sueñas ser?',
  prompt: 'En UNA sola palabra: ¿qué sientes cuando piensas en la IA y en lo que sueñas ser? (emoción, curiosidad, duda, miedo…)',
  cloud: true,
  art: ['star', 'cloud', 'heart'],
  tone: 'cyan',
  minutes: 1,
  autoOpen: true,
  howto: ['Piensa en la IA y en lo que sueñas ser.', 'Escribe UNA palabra y envíala (10 segundos).', 'Mira cómo crecen las palabras que más se repiten.'],
};
const Q4: WallConfig = {
  id: 'g-q4',
  screenId: 'g-q4',
  kicker: 'Diálogo 4 · lluvia de ideas desde tu celular',
  title: '¿Qué problema de tu entorno comenzarías a resolver hoy?',
  prompt: 'En una frase corta (máx. 15 palabras): ¿qué problema de tu entorno (barrio, colegio, familia, trabajo…) comenzarías a resolver hoy con IA?',
  art: ['rocket', 'heart', 'trophy'],
  tone: 'rose',
  minutes: 2,
  autoOpen: true,
  howto: ['Piensa en un problema real de tu entorno.', 'Escríbelo en una frase corta (máximo 15 palabras).', 'Envíalo: enseguida comentamos algunas ideas en voz alta.'],
};

export const GEORGE_SCREENS: Record<string, ComponentType> = {
  ...Object.fromEntries(Array.from({ length: 14 }, (_, i) => [`g-d${String(i + 1).padStart(2, '0')}`, slideOf(i + 1)])),
  'g-q1': () => <TapPoll cfg={POLL_CONSUMER} />,
  'g-q2': () => <IdeaWall cfg={Q2} />,
  'g-q3': () => <TapPoll cfg={POLL_FIELD} />,
  'g-q4': () => <IdeaWall cfg={Q4} />,
};
