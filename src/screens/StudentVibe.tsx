import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Play, RotateCcw, Sparkles } from 'lucide-react';
import { confetti } from '../lib/confetti';
import { sfx } from '../lib/sfx';

const PROMPT = 'Crea un juego donde atrapo estrellas con un toque y esquivo meteoritos. Que tenga puntos y tres vidas.';

const CODE = ['<main class="juego">', '  const [puntos, setPuntos] = useState(0)', '  const [vidas, setVidas] = useState(3)', '  function atrapar(objeto) {', '    if (objeto.esEstrella) sumar(1)', '    else perderVida()', '  }', '</main>'];

interface Upgrade {
  id: 'fast' | 'sea' | 'bonus';
  label: string;
  ask: string;
}

const UPGRADES: Upgrade[] = [
  { id: 'fast', label: '⚡ Hazlo más rápido', ask: 'Haz que los objetos caigan más rápido.' },
  { id: 'sea', label: '🌊 Cambia a tema océano', ask: 'Cambia el tema a océano: peces en vez de estrellas.' },
  { id: 'bonus', label: '💎 Agrega una joya de bonus', ask: 'Agrega una joya especial que da 5 puntos.' },
];

interface Item {
  id: number;
  x: number;
  kind: 'good' | 'bad' | 'gem';
}

type Phase = 'idle' | 'typing' | 'coding' | 'ready' | 'playing' | 'over';
const TIME = 25;

/** Simulación jugable de lo que la IA puede crear a partir de una frase. Es una ilustración: cada app real se crea en AI Studio. */
export function VibeKids() {
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [phase, setPhase] = useState<Phase>('idle');
  const [typed, setTyped] = useState(0);
  const [lines, setLines] = useState(0);
  const [ups, setUps] = useState<string[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [left, setLeft] = useState(TIME);
  const [best, setBest] = useState(0);
  const seq = useRef(0);
  const timers = useRef<number[]>([]);

  const sea = ups.includes('sea');
  const fast = ups.includes('fast');
  const bonus = ups.includes('bonus');
  const GOOD = sea ? '🐠' : '⭐';
  const BAD = sea ? '🦑' : '☄️';

  const clear = () => {
    timers.current.forEach((t) => {
      window.clearInterval(t);
      window.clearTimeout(t);
    });
    timers.current = [];
  };
  useEffect(() => clear, []);

  function build() {
    clear();
    setPhase('typing');
    setTyped(0);
    setLines(0);
    setItems([]);
    sfx.whoosh();
    if (reduce) {
      setTyped(PROMPT.length);
      setLines(CODE.length);
      setPhase('ready');
      return;
    }
    let n = 0;
    const typing = window.setInterval(() => {
      n += 3;
      setTyped(Math.min(n, PROMPT.length));
      if (n >= PROMPT.length) {
        window.clearInterval(typing);
        setPhase('coding');
        let l = 0;
        const coding = window.setInterval(() => {
          l += 1;
          setLines(l);
          sfx.tick();
          if (l >= CODE.length) {
            window.clearInterval(coding);
            setPhase('ready');
            sfx.win();
            confetti({ count: 60, y: 0.5 });
          }
        }, 260);
        timers.current.push(coding);
      }
    }, 28);
    timers.current.push(typing);
  }

  function play() {
    clear();
    setScore(0);
    setLives(3);
    setLeft(TIME);
    setItems([]);
    setPhase('playing');
    sfx.whoosh();
    const spawn = window.setInterval(() => {
      const r = Math.random();
      const kind: Item['kind'] = bonus && r > 0.9 ? 'gem' : r > 0.68 ? 'bad' : 'good';
      const it: Item = { id: ++seq.current, x: 6 + Math.random() * 82, kind };
      setItems((l) => [...l, it]);
      const life = (fast ? 1800 : 3000) + 100;
      timers.current.push(window.setTimeout(() => setItems((l) => l.filter((x) => x.id !== it.id)), life));
    }, fast ? 520 : 780);
    const clock = window.setInterval(() => setLeft((s) => s - 1), 1000);
    timers.current.push(spawn, clock);
  }

  useEffect(() => {
    if (phase !== 'playing') return;
    if (left <= 0 || lives <= 0) {
      clear();
      setItems([]);
      setBest((b) => Math.max(b, score));
      setPhase('over');
      sfx.win();
      if (score >= 8) confetti({ count: 120 });
    }
  }, [left, lives, phase, score]);

  function hit(it: Item) {
    if (phase !== 'playing') return;
    setItems((l) => l.filter((x) => x.id !== it.id));
    if (it.kind === 'bad') {
      setLives((v) => v - 1);
      sfx.bad();
    } else {
      setScore((s) => s + (it.kind === 'gem' ? 5 : 1));
      sfx.ok();
    }
  }

  function toggle(id: string) {
    setUps((u) => (u.includes(id) ? u.filter((x) => x !== id) : [...u, id]));
    sfx.pop();
    if (phase === 'over' || phase === 'playing') {
      clear();
      setItems([]);
      setPhase('ready');
    }
  }

  const showGame = phase === 'ready' || phase === 'playing' || phase === 'over';

  return (
    <section className="vk enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">Momento 3 · Programar escribiendo</span>
          <h2 className="h-lg">
            Tú escribes, la IA <span className="grad-text">programa</span>
          </h2>
        </div>
        <button type="button" className="btn btn--primary btn--lg" onClick={build} disabled={phase === 'typing' || phase === 'coding'}>
          {phase === 'idle' ? (
            <>
              <Play /> Pídele el juego a la IA
            </>
          ) : (
            <>
              <RotateCcw /> Empezar de nuevo
            </>
          )}
        </button>
      </header>

      <div className="vk__grid">
        <aside className="vk__chat glass" aria-label="Conversación con la IA">
          <span className="kicker">
            <Sparkles /> Tú escribes
          </span>
          <p className="vk__bubble">{phase === 'idle' ? <i>Pulsa el botón y mira cómo se pide un juego.</i> : PROMPT.slice(0, typed)}</p>
          {(phase === 'coding' || showGame) && (
            <>
              <span className="kicker">La IA escribe el código</span>
              <pre className="vk__code" aria-hidden="true">
                {CODE.slice(0, lines).map((l, i) => (
                  <span key={l} style={{ '--i': i } as CSSProperties}>
                    {l}
                    {'\n'}
                  </span>
                ))}
              </pre>
            </>
          )}
          {showGame && (
            <div className="vk__ups">
              <span className="kicker">Pide mejoras</span>
              {UPGRADES.map((u) => (
                <button key={u.id} type="button" className={`btn ${ups.includes(u.id) ? 'btn--primary' : ''}`} onClick={() => toggle(u.id)} aria-pressed={ups.includes(u.id)} title={u.ask}>
                  {u.label}
                </button>
              ))}
            </div>
          )}
          <p className="note-muted">Ilustración de lo que podría crear. Tu app real la creas tú en AI Studio.</p>
        </aside>

        <div className={`arena ${sea ? 'arena--sea' : ''} ${showGame ? '' : 'is-empty'}`} aria-label="Juego creado por la IA">
          {!showGame && <div className="arena__ph">{phase === 'idle' ? '🎮 Aquí aparecerá tu juego' : '⚙️ La IA está programando…'}</div>}
          {showGame && (
            <>
              <div className="arena__hud">
                <span>
                  {GOOD} {score}
                </span>
                <span>{'❤️'.repeat(Math.max(0, lives)) || '💔'}</span>
                <span>⏱ {Math.max(0, left)}</span>
              </div>
              {phase === 'playing' &&
                items.map((it) => (
                  <button
                    key={it.id}
                    type="button"
                    className={`arena__item arena__item--${it.kind} ${fast ? 'is-fast' : ''}`}
                    style={{ left: `${it.x}%` }}
                    onPointerDown={() => hit(it)}
                    aria-label={it.kind === 'bad' ? 'Peligro' : 'Atrapar'}
                  >
                    {it.kind === 'gem' ? '💎' : it.kind === 'bad' ? BAD : GOOD}
                  </button>
                ))}
              {phase === 'ready' && (
                <div className="arena__center">
                  <h3>{sea ? 'Atrapa peces' : 'Atrapa estrellas'}</h3>
                  <p>Toca {GOOD} y esquiva {BAD}</p>
                  <button type="button" className="btn btn--primary btn--xl" onClick={play}>
                    <Play /> ¡Jugar!
                  </button>
                </div>
              )}
              {phase === 'over' && (
                <div className="arena__center">
                  <h3>{lives <= 0 ? '¡Sin vidas!' : '¡Tiempo!'}</h3>
                  <p>
                    Atrapaste <b>{score}</b> · mejor: {best}
                  </p>
                  <button type="button" className="btn btn--primary btn--xl" onClick={play}>
                    <RotateCcw /> Jugar otra vez
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
