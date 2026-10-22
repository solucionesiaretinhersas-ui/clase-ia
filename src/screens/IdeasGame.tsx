import { useEffect, useState, type CSSProperties } from 'react';
import { Check, Layers, Pause, Play, RotateCcw, Shuffle } from 'lucide-react';
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
  phase: 'idle' | 'thinking' | 'share';
  endsAt: number;
  given: boolean;
}

const THINK = 60;
const INITIAL: GameS = { deck: [], i: -1, phase: 'idle', endsAt: 0, given: false };

/**
 * Dinámica "La baraja de ideas": una carta provocadora, un minuto para pensar en equipo,
 * cada equipo comparte y el grupo decide a quién premiar. Funciona con y sin celulares.
 */
export function IdeasGame() {
  const ws = useWorkshop();
  const cards = ws.audience === 'estudiante' ? ESTUDIANTES : DOCENTES;
  const { teams, addPoints, resetScores } = useTeams();
  const [g, setG] = usePersistentState<GameS>('ig:state', INITIAL);
  const [paused, setPaused] = useState<number | null>(null);
  const [, tick] = useState(0);

  useEffect(() => {
    if (g.phase !== 'thinking') return;
    const id = window.setInterval(() => tick((n) => n + 1), 250);
    return () => window.clearInterval(id);
  }, [g.phase]);

  const left = g.phase === 'thinking' ? (paused !== null ? paused : Math.max(0, Math.ceil((g.endsAt - Date.now()) / 1000))) : THINK;

  useEffect(() => {
    if (g.phase === 'thinking' && paused === null && left <= 0) {
      sfx.win();
      setG((s) => ({ ...s, phase: 'share' }));
    } else if (g.phase === 'thinking' && paused === null && left <= 10 && left > 0) sfx.tick?.();
  }, [left, g.phase, paused, setG]);

  const card = g.i >= 0 && g.deck[g.i] !== undefined ? cards[g.deck[g.i]] : null;

  useAnnounce('ideas-juego', {
    key: 'ideas-juego',
    kind: 'info',
    prompt: card ? card.q : 'La baraja de ideas: saca una carta y piensen en equipo.',
    options: [`${teams.aName}: ${teams.aScore} puntos`, `${teams.bName}: ${teams.bScore} puntos`],
    open: true,
  });

  function draw() {
    const needNew = g.deck.length !== cards.length || g.i + 1 >= g.deck.length;
    const deck = needNew ? shuffle(cards.map((_, i) => i)) : g.deck;
    const i = needNew ? 0 : g.i + 1;
    setPaused(null);
    setG({ deck, i, phase: 'thinking', endsAt: Date.now() + THINK * 1000, given: false });
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

  return (
    <section className="ig enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">Dinámica · en equipos</span>
          <h2 className="h-lg">
            La baraja de <span className="grad-text">ideas</span>
          </h2>
        </div>
        <div className="ig__ctl">
          <button type="button" className="btn btn--primary btn--lg" onClick={draw} disabled={g.phase === 'thinking' && paused === null}>
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
                <p className="igcard__hint">Saca una carta, léela en voz alta y den un minuto para pensar en equipo.</p>
              </>
            )}
          </div>

          {g.phase !== 'idle' && (
            <div className={`igtimer ${g.phase === 'share' ? 'is-done' : left <= 10 ? 'is-low' : ''}`} role="timer" aria-live="off">
              <div className="igtimer__bar">
                <i style={{ width: `${g.phase === 'share' ? 100 : pct}%` }} />
              </div>
              <b>{g.phase === 'share' ? '¡Tiempo!' : `${left} s`}</b>
              {g.phase === 'thinking' && (
                <button type="button" className="btn btn--ghost btn--icon" onClick={pause} aria-label={paused === null ? 'Pausar' : 'Reanudar'}>
                  {paused === null ? <Pause /> : <Play />}
                </button>
              )}
            </div>
          )}

          {g.phase === 'share' && (
            <div className="igshare">
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
        </div>

        <aside className="ig__side">
          <Scoreboard editable={false} />
          <p className="note-muted">
            Quedan {remaining} {remaining === 1 ? 'carta' : 'cartas'}. Pulsa E para armar los equipos. Si no hay equipos, deja que hablen todos juntos y no uses el marcador.
          </p>
        </aside>
      </div>
    </section>
  );
}
