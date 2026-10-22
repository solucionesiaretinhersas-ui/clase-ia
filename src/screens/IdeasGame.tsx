import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Check, Flag, Layers, Pause, Play, RotateCcw, Shuffle } from 'lucide-react';
import { Art, type ArtName } from '../components/MuralArt';
import { Scoreboard } from '../components/Scoreboard';
import { useWorkshop } from '../data/workshops';
import { sfx } from '../lib/sfx';
import { confetti } from '../lib/confetti';
import { usePersistentState } from '../lib/storage';
import { shuffle, useTeams, type TeamId } from '../lib/teams';
import { useAnnounce } from '../presenter/announce';

interface Card {
  cat: string;
  color: string;
  art: ArtName;
  q: string;
}

const DOCENTES: Card[] = [
  { cat: 'Tiempo', color: 'var(--amber)', art: 'bulb', q: '¿Qué tarea repetitiva de tu semana te gustaría adelantar con un primer borrador automático, para dedicar ese tiempo a tus estudiantes?' },
  { cat: 'Tiempo', color: 'var(--amber)', art: 'trophy', q: 'Si tuvieras cinco horas libres cada semana, ¿qué clase soñada por fin diseñarías?' },
  { cat: 'Estudiantes', color: 'var(--blue)', art: 'heart', q: '¿Qué estudiante de tu grupo aprendería mejor si la clase fuera a su medida? ¿Cómo sería esa clase?' },
  { cat: 'Estudiantes', color: 'var(--blue)', art: 'rocket', q: '¿Y si tus estudiantes pudieran explorar el tema solos, con pistas y reintentos, mientras tú acompañas a quien más lo necesita?' },
  { cat: 'Evaluación', color: 'var(--rose)', art: 'star', q: '¿Cómo sería una evaluación que enseñe mientras evalúa y explique cada respuesta?' },
  { cat: 'Evaluación', color: 'var(--rose)', art: 'book', q: '¿Qué tema se les hace más difícil a tus estudiantes y cómo lo convertirías en un juego?' },
  { cat: 'Creatividad', color: 'var(--violet)', art: 'planet', q: '¿Qué experimento o lugar imposible de visitar te gustaría llevar al salón en una pantalla?' },
  { cat: 'Creatividad', color: 'var(--violet)', art: 'robot', q: 'Si tu aula fuera una misión o una aventura, ¿cómo se llamaría y cuál sería el reto final?' },
  { cat: 'Comunidad', color: 'var(--mint)', art: 'cloud', q: '¿Qué de tu región o de tu comunidad podría ser el protagonista de una clase?' },
  { cat: 'Comunidad', color: 'var(--mint)', art: 'pencil', q: '¿Qué le dirías a un colega para que se anime a probar esto en su aula?' },
];

const ESTUDIANTES: Card[] = [
  { cat: 'Juego', color: 'var(--violet)', art: 'rocket', q: 'Inventa un juego para aprender algo que te cuesta. ¿Cómo se gana?' },
  { cat: 'Juego', color: 'var(--violet)', art: 'trophy', q: '¿Qué reto final tendría un juego donde cuidas el planeta?' },
  { cat: 'Mundo real', color: 'var(--mint)', art: 'cloud', q: '¿Qué problema de tu barrio resolverías con una aplicación?' },
  { cat: 'Mundo real', color: 'var(--mint)', art: 'heart', q: '¿Qué app ayudaría a un compañero que se siente solo o perdido en clase?' },
  { cat: 'Personajes', color: 'var(--blue)', art: 'robot', q: 'Si pudieras conversar con un personaje histórico, ¿a quién elegirías y qué le preguntarías?' },
  { cat: 'Personajes', color: 'var(--blue)', art: 'star', q: 'Crea un asistente con personalidad. ¿Cómo habla y en qué te ayuda?' },
  { cat: 'Futuro', color: 'var(--amber)', art: 'planet', q: '¿Cómo será tu colegio dentro de diez años? Dibújalo con palabras.' },
  { cat: 'Futuro', color: 'var(--amber)', art: 'bulb', q: '¿Qué le pedirías a la IA que hiciera por ti… y qué NO le dejarías hacer nunca?' },
];

interface GameS {
  deck: number[];
  i: number;
  /** thinking: piensa el equipo en turno · pass: se entrega el turno · share: ambos terminaron */
  phase: 'idle' | 'thinking' | 'pass' | 'share';
  /** Equipo que abre la carta actual */
  first: TeamId;
  step: 0 | 1;
  endsAt: number;
  /** Segundos usados por cada equipo en esta carta */
  times: { a?: number; b?: number };
  /** Si se acabó el tiempo en vez de tocar "Terminamos" */
  timedOut: { a?: boolean; b?: boolean };
  given: boolean;
}

const THINK = 60;
const INITIAL: GameS = { deck: [], i: -1, phase: 'idle', first: 'a', step: 0, endsAt: 0, times: {}, timedOut: {}, given: false };
const other = (t: TeamId): TeamId => (t === 'a' ? 'b' : 'a');

/**
 * Dinámica "La baraja de ideas": una carta provocadora; cada equipo piensa por turnos (un minuto)
 * y toca "¡Terminamos!" cuando acaba, así queda registrado su tiempo y pasa el otro equipo.
 */
export function IdeasGame() {
  const ws = useWorkshop();
  const cards = ws.audience === 'estudiante' ? ESTUDIANTES : DOCENTES;
  const { teams, addPoints, resetScores, update } = useTeams();
  const [stored, setG] = usePersistentState<GameS>('ig:state', INITIAL);
  // Mezcla con los valores por defecto por si hay datos guardados de una versión anterior
  const g: GameS = { ...INITIAL, ...stored, times: stored?.times ?? {}, timedOut: stored?.timedOut ?? {}, deck: Array.isArray(stored?.deck) ? stored.deck : [] };
  const [paused, setPaused] = useState<number | null>(null);
  const [, tick] = useState(0);

  const turn: TeamId = g.step === 0 ? g.first : other(g.first);
  const turnName = turn === 'a' ? teams.aName : teams.bName;
  const nameOf = (t: TeamId) => (t === 'a' ? teams.aName : teams.bName);
  const thinking = g.phase === 'thinking';

  useEffect(() => {
    if (!thinking) return;
    const id = window.setInterval(() => tick((n) => n + 1), 250);
    return () => window.clearInterval(id);
  }, [thinking]);

  const left = thinking ? (paused !== null ? paused : Math.max(0, Math.ceil((g.endsAt - Date.now()) / 1000))) : THINK;

  /** Cierra el turno actual: registra el tiempo usado y pasa al otro equipo (o a compartir). */
  function finish(timedOut: boolean) {
    setPaused(null);
    setG((s) => {
      if (s.phase !== 'thinking') return s;
      const t: TeamId = s.step === 0 ? s.first : other(s.first);
      const remaining = Math.max(0, Math.ceil((s.endsAt - Date.now()) / 1000));
      const usedSec = timedOut ? THINK : Math.min(THINK, THINK - remaining);
      const times = { ...s.times, [t]: usedSec };
      const to = { ...s.timedOut, [t]: timedOut };
      return s.step === 0 ? { ...s, times, timedOut: to, phase: 'pass', step: 1 } : { ...s, times, timedOut: to, phase: 'share' };
    });
    if (timedOut) sfx.bad();
    else sfx.ding();
  }

  // Fin del tiempo del equipo en turno
  useEffect(() => {
    if (thinking && paused === null && left <= 0) finish(true);
    // finish usa el estado más reciente mediante setG
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, thinking, paused]);

  // Tic-tac de reloj mientras piensa el equipo en turno
  const lastLeft = useRef(-1);
  useEffect(() => {
    if (thinking && paused === null && left > 0 && left !== lastLeft.current) {
      lastLeft.current = left;
      sfx.clock(left, left <= 10);
    }
  }, [left, thinking, paused]);

  const card = g.i >= 0 && g.deck[g.i] !== undefined ? cards[g.deck[g.i]] : null;

  useAnnounce('ideas-juego', {
    key: 'ideas-juego',
    kind: 'info',
    prompt: card ? card.q : 'La baraja de ideas: saca una carta y piensen en equipo.',
    options: [thinking ? `Turno de ${turnName}` : `${teams.aName}: ${teams.aScore} puntos`, `${teams.bName}: ${teams.bScore} puntos`],
    open: true,
  });

  function startThinking(step: 0 | 1, first: TeamId) {
    const t = step === 0 ? first : other(first);
    update({ turn: t });
    setPaused(null);
    lastLeft.current = -1;
    setG((s) => ({ ...s, phase: 'thinking', step, first, endsAt: Date.now() + THINK * 1000 }));
    sfx.whoosh();
  }
  function draw() {
    const needNew = g.deck.length !== cards.length || g.i + 1 >= g.deck.length;
    const deck = needNew ? shuffle(cards.map((_, i) => i)) : g.deck;
    const i = needNew ? 0 : g.i + 1;
    const first: TeamId = g.i < 0 ? 'a' : other(g.first);
    setG({ deck, i, phase: 'thinking', first, step: 0, endsAt: Date.now() + THINK * 1000, times: {}, timedOut: {}, given: false });
    update({ turn: first });
    setPaused(null);
    lastLeft.current = -1;
    sfx.whoosh();
  }
  function pause() {
    if (paused === null) setPaused(left);
    else {
      setG((s) => ({ ...s, endsAt: Date.now() + (paused ?? THINK) * 1000 }));
      setPaused(null);
    }
  }
  function award(t: TeamId) {
    addPoints(t, 10);
    setG((s) => ({ ...s, given: true }));
    sfx.ok();
    confetti({ count: 60, y: 0.55 });
  }

  const pct = ((THINK - left) / THINK) * 100;
  const remaining = g.deck.length ? g.deck.length - g.i - 1 : cards.length;
  const fastest: TeamId | null = g.times.a !== undefined && g.times.b !== undefined && g.times.a !== g.times.b ? (g.times.a < g.times.b ? 'a' : 'b') : null;
  const timeTxt = (t: TeamId) => (g.timedOut[t] ? 'se acabó el tiempo' : `${g.times[t] ?? 0} s`);

  return (
    <section className="ig enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">Dinámica · por turnos</span>
          <h2 className="h-lg">
            La baraja de <span className="grad-text">ideas</span>
          </h2>
        </div>
        <div className="ig__ctl">
          <button type="button" className="btn btn--primary btn--lg" onClick={draw} disabled={g.phase === 'thinking' || g.phase === 'pass'}>
            <Layers /> {g.phase === 'idle' ? 'Sacar una carta' : remaining === 0 && g.phase === 'share' ? 'Barajar de nuevo' : 'Siguiente carta'}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setG(INITIAL);
              setPaused(null);
              resetScores();
              sfx.whoosh();
            }}
          >
            <RotateCcw /> Reiniciar
          </button>
        </div>
      </header>

      <div className="ig__grid">
        <div className="ig__stage">
          <div key={g.i} className={`igcard ${card ? 'is-up' : ''}`} style={{ '--c': card?.color ?? 'var(--violet)' } as CSSProperties}>
            {card ? (
              <>
                <span className="igcard__cat">{card.cat}</span>
                <Art name={card.art} className="igcard__art" />
                <p>{card.q}</p>
              </>
            ) : (
              <>
                <Shuffle className="igcard__ph" />
                <p className="igcard__hint">Saca una carta y léela en voz alta. Piensa un equipo a la vez: al terminar, toca “¡Terminamos!” y pasa el otro.</p>
              </>
            )}
          </div>

          {g.phase !== 'idle' && (
            <div className={`igturn igturn--${turn}`}>
              {thinking ? (
                <>
                  <span>Turno de</span> <b>{turnName}</b>
                </>
              ) : g.phase === 'pass' ? (
                <>
                  <span>Tiempo registrado de</span> <b>{nameOf(g.first)}</b>
                  <em>{timeTxt(g.first)}</em>
                </>
              ) : (
                <span>Los dos equipos ya pensaron</span>
              )}
            </div>
          )}

          {thinking && (
            <div className={`igtimer ${left <= 10 ? 'is-low' : ''}`} role="timer" aria-live="off">
              <div className="igtimer__bar">
                <i style={{ width: `${pct}%` }} />
              </div>
              <b>{left} s</b>
              <button type="button" className="btn btn--ghost btn--icon" onClick={pause} aria-label={paused === null ? 'Pausar' : 'Reanudar'}>
                {paused === null ? <Pause /> : <Play />}
              </button>
            </div>
          )}

          {thinking && (
            <button type="button" className="btn btn--primary btn--xl btn--done" onClick={() => finish(false)}>
              <Flag /> ¡Terminamos!
            </button>
          )}

          {g.phase === 'pass' && (
            <div className="igshare">
              <p>
                <b>{nameOf(g.first)}</b> terminó en <b>{timeTxt(g.first)}</b>. Ahora piensa <b>{nameOf(other(g.first))}</b>.
              </p>
              <button type="button" className="btn btn--primary btn--xl" onClick={() => startThinking(1, g.first)}>
                <Play /> Empezar {nameOf(other(g.first))}
              </button>
            </div>
          )}

          {g.phase === 'share' && (
            <div className="igshare">
              <p>
                <b>{teams.aName}:</b> {timeTxt('a')} · <b>{teams.bName}:</b> {timeTxt('b')}
                {fastest && <> · terminó primero {nameOf(fastest)}</>}
              </p>
              <p>
                <b>Ahora cada equipo comparte su idea.</b> El grupo decide cuál fue la más original o la más útil.
              </p>
              <div className="igshare__btns">
                <button type="button" className="btn btn--lg" disabled={g.given} onClick={() => award('a')}>
                  <Check /> +10 · {teams.aName}
                </button>
                <button type="button" className="btn btn--lg" disabled={g.given} onClick={() => award('b')}>
                  <Check /> +10 · {teams.bName}
                </button>
              </div>
            </div>
          )}

          {g.phase === 'idle' && (
            <button type="button" className="btn btn--primary btn--xl" onClick={draw}>
              <Layers /> Sacar una carta
            </button>
          )}
        </div>

        <aside className="ig__side">
          <Scoreboard editable={false} />
          <p className="note-muted">
            Quedan {remaining} {remaining === 1 ? 'carta' : 'cartas'}. Pulsa E para armar los equipos. Cada carta abre un equipo distinto y el tiempo de cada uno queda registrado.
          </p>
        </aside>
      </div>
    </section>
  );
}