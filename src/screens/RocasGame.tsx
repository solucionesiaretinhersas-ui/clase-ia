import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent } from 'react';
import { ArrowRight, CircleCheck, Flag, Hand, Play, RotateCcw, Trophy } from 'lucide-react';
import { Scoreboard } from '../components/Scoreboard';
import { useTicker } from '../components/ui';
import { CHALLENGES, ROCAS, type Challenge, type Fragment, type Letter } from '../data/rocas';
import { confetti } from '../lib/confetti';
import { sfx } from '../lib/sfx';
import { usePersistentState } from '../lib/storage';
import { shuffle, useTeams, type TeamId } from '../lib/teams';
import { useAnnounce } from '../presenter/announce';
import { usePresenter } from '../presenter/context';

const DURATION = 90; // segundos por turno
const HIT = 10;
const COMPLETE_BONUS = 20;

type Phase = 'ready' | 'playing' | 'review' | 'roundEnd' | 'final';

interface Turn {
  round: number;
  team: TeamId;
  pts: number;
  ok: number;
  errors: number;
  left: number;
  complete: boolean;
}

interface GameState {
  round: number;
  first: TeamId;
  step: 0 | 1;
  phase: Phase;
  order: string[];
  placed: Record<string, Letter | null>;
  locked: string[];
  endsAt: number | null;
  errors: number;
  turnPts: number;
  turns: Turn[];
}

const INITIAL: GameState = { round: 0, first: 'a', step: 0, phase: 'ready', order: [], placed: {}, locked: [], endsAt: null, errors: 0, turnPts: 0, turns: [] };
const other = (t: TeamId): TeamId => (t === 'a' ? 'b' : 'a');

interface Drag {
  id: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  sx: number;
  sy: number;
  moved: boolean;
}

/** Juego "Construye el prompt más sólido": dos equipos, retos por rondas, cronómetro y comprobación. */
export function RocasGame() {
  const { teams, update, addPoints, resetScores } = useTeams();
  const { next } = usePresenter();
  const [g, setG] = usePersistentState<GameState>('rg:state', INITIAL);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string[]>([]);
  const ref = useRef(g);
  ref.current = g;

  const challenge: Challenge = CHALLENGES[Math.min(g.round, CHALLENGES.length - 1)];
  const team: TeamId = g.step === 0 ? g.first : other(g.first);
  const teamName = team === 'a' ? teams.aName : teams.bName;
  const frags = challenge.fragments;
  const byId = (id: string) => frags.find((f) => f.id === id) as Fragment;
  const playing = g.phase === 'playing';
  useTicker(playing, 250);
  const left = playing && g.endsAt ? Math.max(0, Math.ceil((g.endsAt - Date.now()) / 1000)) : DURATION;

  const pool = g.order.filter((id) => !g.placed[id] && frags.some((f) => f.id === id));
  const inSlot = (l: Letter) => frags.filter((f) => g.placed[f.id] === l);

  // Anuncia el reto y el marcador en los celulares
  useAnnounce('rocas-juego', {
    key: 'rocas-juego',
    kind: 'info',
    prompt: g.phase === 'final' ? '¡Fin del juego!' : `Reto ${g.round + 1}: ${challenge.title}. Turno de ${teamName}.`,
    options: [`${teams.aName}: ${teams.aScore} puntos`, `${teams.bName}: ${teams.bScore} puntos`, 'Fragmentos: R, O, C, A y S. Piensen juntos y animen a su equipo.'],
    open: true,
  });

  /* ───── Turno ───── */
  function startTurn() {
    setSelected(null);
    update({ turn: team });
    setG((s) => ({ ...s, phase: 'playing', order: shuffle(frags.map((f) => f.id)), placed: {}, locked: [], endsAt: Date.now() + DURATION * 1000, errors: 0, turnPts: 0 }));
    sfx.whoosh();
  }

  /** Comprueba lo colocado: las correctas se fijan y suman; las incorrectas vuelven para corregirse. */
  function check(auto = false, manual = false) {
    const s = ref.current;
    if (s.phase !== 'playing') return;
    const t: TeamId = s.step === 0 ? s.first : other(s.first);
    const ch = CHALLENGES[Math.min(s.round, CHALLENGES.length - 1)];
    const locked = [...s.locked];
    const placed = { ...s.placed };
    const bad: string[] = [];
    let gain = 0;
    for (const f of ch.fragments) {
      const slot = placed[f.id];
      if (!slot || locked.includes(f.id)) continue;
      if (slot === f.letter) {
        locked.push(f.id);
        gain += HIT;
      } else {
        bad.push(f.id);
        placed[f.id] = null;
      }
    }
    if (gain) addPoints(t, gain);
    if (bad.length) {
      setWrong(bad);
      window.setTimeout(() => setWrong([]), 700);
    }
    if (gain && !bad.length) sfx.ok();
    else if (bad.length) sfx.bad();
    if (gain) confetti({ y: 0.55, count: 30 });

    const complete = locked.length === ch.fragments.length;
    const remaining = s.endsAt ? Math.max(0, Math.ceil((s.endsAt - Date.now()) / 1000)) : 0;
    const errors = s.errors + bad.length;
    let turnPts = s.turnPts + gain;
    if (complete || auto || remaining === 0) {
      let bonus = 0;
      if (complete) {
        bonus = COMPLETE_BONUS + Math.min(22, Math.floor(remaining / 4));
        addPoints(t, bonus);
        turnPts += bonus;
        sfx.win();
        confetti({ count: 180 });
      } else if (manual) sfx.ding();
      else sfx.bad();
      const turn: Turn = { round: s.round, team: t, pts: turnPts, ok: locked.length, errors, left: remaining, complete };
      setG({ ...s, placed, locked, errors, turnPts, phase: 'review', endsAt: null, turns: [...s.turns, turn] });
    } else {
      setG({ ...s, placed, locked, errors, turnPts });
    }
  }

  // Fin del tiempo: se comprueba una última vez y se cierra el turno
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const s = ref.current;
      if (s.phase === 'playing' && s.endsAt && Date.now() >= s.endsAt) check(true);
    }, 250);
    return () => window.clearInterval(id);
    // check usa siempre el estado más reciente mediante ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  // Tic-tac de reloj cada segundo; más urgente en los últimos 10
  const lastLeft = useRef(-1);
  useEffect(() => {
    if (playing && left > 0 && left !== lastLeft.current) {
      lastLeft.current = left;
      sfx.clock(left, left <= 10);
    }
  }, [left, playing]);

  const reviewTurn = [...g.turns].reverse().find((t) => t.round === g.round);
  const roundTurns = g.turns.filter((t) => t.round === g.round);
  const roundPts = (t: TeamId) => roundTurns.filter((x) => x.team === t).reduce((a, x) => a + x.pts, 0);
  const used = (x: Turn) => DURATION - x.left;
  const roundTime = (t: TeamId) => roundTurns.filter((x) => x.team === t).reduce((a, x) => a + used(x), 0);
  const totalTime = (t: TeamId) => g.turns.filter((x) => x.team === t).reduce((a, x) => a + used(x), 0);

  function afterReview() {
    if (g.step === 0) setG((s) => ({ ...s, step: 1, phase: 'ready', placed: {}, locked: [], turnPts: 0, errors: 0 }));
    else {
      setG((s) => ({ ...s, phase: 'roundEnd' }));
      sfx.win();
    }
  }
  function afterRound() {
    if (g.round < CHALLENGES.length - 1) setG((s) => ({ ...s, round: s.round + 1, first: other(s.first), step: 0, phase: 'ready', placed: {}, locked: [], turnPts: 0, errors: 0 }));
    else {
      setG((s) => ({ ...s, phase: 'final' }));
      sfx.win();
      confetti({ count: 240 });
      window.setTimeout(() => confetti({ x: 0.2, count: 120 }), 400);
      window.setTimeout(() => confetti({ x: 0.8, count: 120 }), 700);
    }
  }
  function restart() {
    setG(INITIAL);
    resetScores();
    setSelected(null);
  }

  /* ───── Mover fragmentos: arrastrar o tocar y asignar ───── */
  const place = (id: string, l: Letter | null) => setG((s) => (s.locked.includes(id) ? s : { ...s, placed: { ...s.placed, [id]: l } }));

  function down(e: RPointerEvent<HTMLButtonElement>, id: string) {
    if (!playing || g.locked.includes(id)) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ id, x: r.left, y: r.top, dx: e.clientX - r.left, dy: e.clientY - r.top, sx: e.clientX, sy: e.clientY, moved: false });
  }
  function move(e: RPointerEvent<HTMLButtonElement>) {
    setDrag((d) => (d ? { ...d, x: e.clientX - d.dx, y: e.clientY - d.dy, moved: d.moved || Math.hypot(e.clientX - d.sx, e.clientY - d.sy) > 8 } : d));
  }
  function up(e: RPointerEvent<HTMLButtonElement>) {
    if (!drag) return;
    const d = drag;
    setDrag(null);
    if (!d.moved) {
      // un toque: seleccionar / deseleccionar (alternativa a arrastrar)
      setSelected((cur) => (cur === d.id ? null : d.id));
      sfx.pop();
      return;
    }
    const hit = document.elementsFromPoint(e.clientX, e.clientY).find((n) => (n as HTMLElement).dataset?.slot) as HTMLElement | undefined;
    if (hit?.dataset.slot === 'pool') place(d.id, null);
    else if (hit?.dataset.slot) {
      place(d.id, hit.dataset.slot as Letter);
      sfx.drop();
    }
    setSelected(null);
  }
  function assign(l: Letter) {
    if (!selected || !playing) return;
    place(selected, l);
    setSelected(null);
    sfx.drop();
  }

  const placedCount = frags.filter((f) => g.placed[f.id]).length;
  const tieByTime = teams.aScore === teams.bScore && totalTime('a') !== totalTime('b');
  const winnerFinal = teams.aScore !== teams.bScore ? (teams.aScore > teams.bScore ? teams.aName : teams.bName) : tieByTime ? (totalTime('a') < totalTime('b') ? teams.aName : teams.bName) : null;
  const ring = useMemo(() => 2 * Math.PI * 44, []);

  const chip = (f: Fragment, where: 'pool' | 'slot') => {
    const dragging = drag?.id === f.id;
    const isLocked = g.locked.includes(f.id);
    return (
      <button
        key={f.id}
        type="button"
        disabled={!playing && !isLocked}
        className={`chipstone ${where === 'slot' ? 'chipstone--slot' : ''} ${dragging && drag?.moved ? 'is-drag' : ''} ${wrong.includes(f.id) ? 'is-wrong' : ''} ${selected === f.id ? 'is-selected' : ''} ${isLocked ? 'is-locked' : ''}`}
        style={dragging && drag?.moved ? ({ left: drag.x, top: drag.y } as CSSProperties) : undefined}
        onPointerDown={(e) => down(e, f.id)}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={() => setDrag(null)}
        aria-pressed={selected === f.id}
      >
        {isLocked && <CircleCheck />}
        {f.text}
      </button>
    );
  };

  return (
    <section className="game enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">
            Construye el prompt más sólido · Reto {Math.min(g.round + 1, CHALLENGES.length)} de {CHALLENGES.length}
          </span>
          <h2 className="h-lg">{g.phase === 'final' ? '¡Fin del juego!' : challenge.title}</h2>
          <p className="lead game__intro">{challenge.intro}</p>
        </div>
        {playing && (
          <div className={`gtimer ${left <= 10 ? 'is-low' : ''}`} role="timer" aria-label={`${left} segundos`}>
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" className="gtimer__bg" />
              <circle cx="50" cy="50" r="44" className="gtimer__fg" strokeDasharray={ring} strokeDashoffset={ring * (1 - left / DURATION)} />
            </svg>
            <b>{left}</b>
            <small>seg</small>
          </div>
        )}
      </header>

      <Scoreboard editable={false} />

      {g.phase !== 'final' && g.phase !== 'roundEnd' && (
        <div className="game__slots">
          {ROCAS.map((r) => {
            const got = inSlot(r.k);
            return (
              <div
                key={r.k}
                className={`slot ${playing && (drag?.moved || selected) ? 'is-armed' : ''} ${got.length > 0 && got.every((f) => g.locked.includes(f.id)) && got.length === 2 ? 'is-full' : ''}`}
                data-slot={r.k}
                style={{ '--c': r.color } as CSSProperties}
                onClick={() => assign(r.k)}
              >
                <div className="slot__head" data-slot={r.k}>
                  <b>{r.k}</b>
                  <span>{r.name}</span>
                </div>
                <div className="slot__body" data-slot={r.k}>
                  {got.map((f) => chip(f, 'slot'))}
                  {got.length === 0 && <em data-slot={r.k}>{selected ? 'Toca aquí para colocar' : 'Suelta aquí'}</em>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {g.phase === 'ready' && (
        <div className="game__panel glass">
          <h3>
            Turno de <span style={{ color: team === 'a' ? 'var(--violet)' : 'var(--cyan)' }}>{teamName}</span>
          </h3>
          <p>
            Tienen {DURATION} segundos para colocar los 10 fragmentos en su letra de ROCAS. Arrastren, o toquen un fragmento y luego su letra. Pulsen <b>Comprobar</b> para fijar los aciertos y
            corregir los errores. +{HIT} por acierto y +{COMPLETE_BONUS} por completar la estructura, más un bonus por tiempo.
          </p>
          <button type="button" className="btn btn--primary btn--xl" onClick={startTurn}>
            <Play /> ¡Empezar!
          </button>
        </div>
      )}

      {playing && (
        <>
          <div className="game__pool" data-slot="pool" aria-label="Fragmentos por colocar">
            {pool.map((id) => chip(byId(id), 'pool'))}
            {pool.length === 0 && <em data-slot="pool">Todos colocados: pulsen Comprobar</em>}
          </div>
          <div className="game__bar">
            <span className="game__hint">
              <Hand /> {selected ? 'Ahora toca la letra donde va' : 'Arrastra un fragmento, o tócalo y luego toca su letra'}
            </span>
            <div className="game__btns">
              <button type="button" className="btn btn--lg" onClick={() => setG((s) => ({ ...s, placed: Object.fromEntries(Object.entries(s.placed).map(([k, v]) => [k, s.locked.includes(k) ? v : null])) }))}>
                <RotateCcw /> Vaciar
              </button>
              <button type="button" className="btn btn--primary btn--xl" onClick={() => check(false)} disabled={placedCount === g.locked.length}>
                <CircleCheck /> Comprobar
              </button>
              <button type="button" className="btn btn--xl btn--done" onClick={() => check(true, true)}>
                <Flag /> ¡Terminamos!
              </button>
            </div>
          </div>
        </>
      )}

      {g.phase === 'review' && reviewTurn && (
        <div className="game__panel glass">
          <h3>{reviewTurn.complete ? `¡${teamName} completó la estructura!` : `Se acabó el tiempo para ${teamName}`}</h3>
          <ul className="game__stats">
            <li>
              <b>{reviewTurn.ok}</b> de {frags.length} bien colocados
            </li>
            <li>
              <b>{reviewTurn.errors}</b> errores corregidos
            </li>
            <li>
              <b>+{reviewTurn.pts}</b> puntos en este turno
            </li>
            <li>
              Tiempo registrado: <b>{used(reviewTurn)} s</b>
            </li>
          </ul>
          <button type="button" className="btn btn--primary btn--lg" onClick={afterReview}>
            {g.step === 0 ? `Turno de ${g.first === 'a' ? teams.bName : teams.aName}` : 'Ver resultado del reto'} <ArrowRight />
          </button>
        </div>
      )}

      {g.phase === 'roundEnd' && (
        <div className="game__panel glass">
          <h3>Resultado del reto {g.round + 1}</h3>
          <div className="game__round">
            <span>
              {teams.aName} <b>{roundPts('a')}</b>
            </span>
            <span>
              {teams.bName} <b>{roundPts('b')}</b>
            </span>
          </div>
          <p className="game__time">
            Tiempo usado: {teams.aName} <b>{roundTime('a')} s</b> · {teams.bName} <b>{roundTime('b')} s</b>
          </p>
          <p>
            {roundPts('a') !== roundPts('b')
              ? `${roundPts('a') > roundPts('b') ? teams.aName : teams.bName} gana el reto.`
              : roundTime('a') !== roundTime('b')
                ? `Empate en puntos: ${roundTime('a') < roundTime('b') ? teams.aName : teams.bName} gana por terminar más rápido.`
                : 'Empate en este reto.'}
          </p>
          <button type="button" className="btn btn--primary btn--lg" onClick={afterRound}>
            {g.round < CHALLENGES.length - 1 ? 'Siguiente reto' : 'Ver resultado final'} <ArrowRight />
          </button>
        </div>
      )}

      {g.phase === 'final' && (
        <div className="game__win glass">
          <Trophy />
          <h3>{winnerFinal ? `¡Gana ${winnerFinal}!` : '¡Empate!'}</h3>
          <p>
            {teams.aName}: {teams.aScore} puntos · {teams.bName}: {teams.bScore} puntos
          </p>
          {tieByTime && <p>Empataron en puntos: se decide por el menor tiempo total ({teams.aName} {totalTime('a')} s · {teams.bName} {totalTime('b')} s).</p>}
          <div className="game__win-btns">
            <button type="button" className="btn btn--lg" onClick={restart}>
              <RotateCcw /> Jugar otra ronda con nuevos retos
            </button>
            <button type="button" className="btn btn--primary btn--lg" onClick={next}>
              Seguir <ArrowRight />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
