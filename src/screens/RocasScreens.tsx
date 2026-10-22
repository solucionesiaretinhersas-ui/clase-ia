import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent } from 'react';
import { ArrowRight, Check, RotateCcw, Shuffle, Trophy } from 'lucide-react';
import { Scoreboard } from '../components/Scoreboard';
import { FRAGMENTS, ROCAS, type Fragment, type Letter } from '../data/rocas';
import { confetti } from '../lib/confetti';
import { sfx } from '../lib/sfx';
import { shuffle, useTeams } from '../lib/teams';
import { usePersistentState } from '../lib/storage';
import { usePresenter } from '../presenter/context';

/* ─────────── 1 · Piedras ROCAS: la metodología ─────────── */
const SIZES = ['9.5rem', '8.4rem', '9rem', '8.6rem', '9.2rem'];

export function RocasIntro() {
  const [i, setI] = useState(0);
  const r = ROCAS[i];
  return (
    <section className="rocas enter">
      <header className="screen-head">
        <span className="kicker">Metodología ROCAS</span>
        <h2 className="h-xl">
          Un prompt <span className="grad-text">fuerte como las rocas</span>
        </h2>
        <p className="lead">Cinco piedras que, bien colocadas, sostienen cualquier petición a la IA.</p>
      </header>

      <div className="rocas__stage">
        <ol className="rocks" aria-label="Las cinco piedras de ROCAS">
          {ROCAS.map((x, k) => (
            <li key={x.k}>
              <button
                type="button"
                className={`rock ${k === i ? 'is-on' : ''}`}
                style={{ '--c': x.color, '--s': SIZES[k], '--d': `${k * 0.14}s` } as CSSProperties}
                onClick={() => {
                  setI(k);
                  sfx.drop();
                }}
                aria-pressed={k === i}
              >
                <b>{x.k}</b>
                <small>{x.name}</small>
              </button>
            </li>
          ))}
        </ol>
        <div className="rocas__ground" aria-hidden="true" />
      </div>

      <article className="rocas__card glass" key={r.k} style={{ '--c': r.color } as CSSProperties}>
        <span className="rocas__letter">{r.k}</span>
        <div>
          <h3>
            {r.name} <small>· {r.question}</small>
          </h3>
          <p className="rocas__tip">{r.tip}</p>
          <p className="rocas__ex">“{r.example}”</p>
        </div>
      </article>
    </section>
  );
}

/* ─────────── 2 · Prompt frágil vs. prompt con ROCAS ─────────── */
export function RocasCompare() {
  const [on, setOn] = useState<Record<Letter, boolean>>({ R: false, O: false, C: false, A: false, S: false });
  const count = ROCAS.filter((x) => on[x.k]).length;
  const pct = count * 20;
  const full = count === 5;

  useEffect(() => {
    if (full) {
      sfx.win();
      confetti({ y: 0.4, count: 110 });
    }
  }, [full]);

  const toggle = (k: Letter) => {
    setOn((s) => ({ ...s, [k]: !s[k] }));
    sfx.pop();
  };

  return (
    <section className="cmp enter">
      <header className="screen-head">
        <span className="kicker">Antes y después</span>
        <h2 className="h-lg">
          Toca cada piedra y mira cómo se <span className="grad-text">fortalece</span> el prompt
        </h2>
      </header>

      <div className="cmp__chips" role="group" aria-label="Partes de ROCAS">
        {ROCAS.map((x) => (
          <button
            key={x.k}
            type="button"
            className={`cmp__chip ${on[x.k] ? 'is-on' : ''}`}
            style={{ '--c': x.color } as CSSProperties}
            onClick={() => toggle(x.k)}
            aria-pressed={on[x.k]}
          >
            <b>{x.k}</b> {x.name}
            {on[x.k] && <Check />}
          </button>
        ))}
      </div>

      <div className="cmp__grid">
        <div className="cmp__prompt glass">
          <span className="kicker">Tu prompt</span>
          <p>
            <span className={count === 0 ? '' : 'is-base'}>Haz una clase sobre las fracciones.</span>{' '}
            {ROCAS.filter((x) => on[x.k]).map((x) => (
              <mark key={x.k} style={{ '--c': x.color } as CSSProperties}>
                <i>{x.k}</i> {x.example}{' '}
              </mark>
            ))}
          </p>
        </div>

        <div className="cmp__meter glass">
          <span className="kicker">Fuerza del prompt</span>
          <div className="cmp__wall" aria-label={`Fuerza ${pct}%`}>
            {ROCAS.map((x) => (
              <i key={x.k} className={on[x.k] ? 'is-on' : ''} style={{ '--c': x.color } as CSSProperties} />
            ))}
          </div>
          <strong>{pct}%</strong>
          <p>{full ? 'Un recurso a la medida de tu clase: interactivo, con tu contexto y listo para usar.' : count === 0 ? 'Una respuesta genérica, como la que daría a cualquier docente.' : 'Cada parte que agregas acerca la respuesta a lo que realmente necesitas.'}</p>
          <small>Ilustración conceptual para entender la idea.</small>
        </div>
      </div>
    </section>
  );
}

/* ─────────── 3 · Juego: arma el ROCAS en la pizarra táctil (dos equipos) ─────────── */
interface Drag {
  id: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export function RocasGame() {
  const { teams, addPoints, switchTurn, resetScores } = useTeams();
  const { next } = usePresenter();
  const [order, setOrder] = usePersistentState<string[]>('rocas:order', []);
  const [placed, setPlaced] = usePersistentState<Record<string, TeamKey>>('rocas:placed', {});
  const [drag, setDrag] = useState<Drag | null>(null);
  const [wrong, setWrong] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // Mezcla inicial de los fragmentos (se conserva si recargas)
  const ids = useMemo(() => (order.length === FRAGMENTS.length ? order : FRAGMENTS.map((f) => f.id)), [order]);
  useEffect(() => {
    if (order.length !== FRAGMENTS.length) setOrder(shuffle(FRAGMENTS.map((f) => f.id)));
  }, [order.length, setOrder]);

  const byId = (id: string) => FRAGMENTS.find((f) => f.id === id) as Fragment;
  const remaining = ids.filter((id) => !placed[id]);
  const total = FRAGMENTS.length;
  const finished = remaining.length === 0;

  useEffect(() => {
    if (finished && !done) {
      setDone(true);
      sfx.win();
      confetti({ count: 200 });
    }
  }, [finished, done]);

  function down(e: RPointerEvent<HTMLButtonElement>, id: string) {
    if (placed[id]) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ id, x: r.left, y: r.top, dx: e.clientX - r.left, dy: e.clientY - r.top });
    sfx.pop();
  }
  function move(e: RPointerEvent<HTMLButtonElement>) {
    setDrag((d) => (d ? { ...d, x: e.clientX - d.dx, y: e.clientY - d.dy } : d));
  }
  function up(e: RPointerEvent<HTMLButtonElement>) {
    if (!drag) return;
    const el = document.elementsFromPoint(e.clientX, e.clientY).find((n) => (n as HTMLElement).dataset?.slot) as HTMLElement | undefined;
    const frag = byId(drag.id);
    setDrag(null);
    if (!el) return;
    if (el.dataset.slot === frag.letter) {
      setPlaced((p) => ({ ...p, [frag.id]: teams.turn }));
      addPoints(teams.turn, 10);
      sfx.ok();
      confetti({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight, count: 28 });
    } else {
      setWrong(frag.id);
      sfx.bad();
      window.setTimeout(() => setWrong(null), 600);
    }
    switchTurn();
  }

  function restart() {
    setOrder(shuffle(FRAGMENTS.map((f) => f.id)));
    setPlaced({});
    setDone(false);
    resetScores();
  }

  const winner = teams.aScore === teams.bScore ? null : teams.aScore > teams.bScore ? teams.aName : teams.bName;

  return (
    <section className="game enter" ref={box}>
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">Juego en la pizarra · dos equipos</span>
          <h2 className="h-lg">Arma el prompt: arrastra cada piedra a su letra</h2>
        </div>
        <div className="game__tools">
          <button type="button" className="btn" onClick={restart}>
            <Shuffle /> Reiniciar
          </button>
        </div>
      </header>

      <Scoreboard />

      <div className="game__slots">
        {ROCAS.map((r) => {
          const got = FRAGMENTS.filter((f) => f.letter === r.k && placed[f.id]);
          return (
            <div key={r.k} className={`slot ${drag ? 'is-armed' : ''} ${got.length === 2 ? 'is-full' : ''}`} data-slot={r.k} style={{ '--c': r.color } as CSSProperties}>
              <div className="slot__head" data-slot={r.k}>
                <b>{r.k}</b>
                <span>{r.name}</span>
              </div>
              <ul data-slot={r.k}>
                {got.map((f) => (
                  <li key={f.id} className={`is-${placed[f.id]}`} data-slot={r.k}>
                    {f.text}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {!finished ? (
        <div className="game__pool" aria-label="Piedras por colocar">
          {remaining.map((id) => {
            const f = byId(id);
            const dragging = drag?.id === id;
            return (
              <button
                key={id}
                type="button"
                className={`chipstone ${dragging ? 'is-drag' : ''} ${wrong === id ? 'is-wrong' : ''}`}
                style={dragging && drag ? ({ left: drag.x, top: drag.y } as CSSProperties) : undefined}
                onPointerDown={(e) => down(e, id)}
                onPointerMove={move}
                onPointerUp={up}
                onPointerCancel={() => setDrag(null)}
              >
                {f.text}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="game__win glass">
          <Trophy />
          <h3>{winner ? `¡Gana ${winner}!` : '¡Empate!'}</h3>
          <p>
            Las {total} piedras están en su lugar. {teams.aName}: {teams.aScore} · {teams.bName}: {teams.bScore}
          </p>
          <div className="game__win-btns">
            <button type="button" className="btn" onClick={restart}>
              <RotateCcw /> Jugar otra vez
            </button>
            <button type="button" className="btn btn--primary" onClick={next}>
              Seguir <ArrowRight />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

type TeamKey = 'a' | 'b';
