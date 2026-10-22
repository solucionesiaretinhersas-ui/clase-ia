import { useMemo, useState, type CSSProperties } from 'react';
import { ArrowRight, Check, RotateCcw, Sparkles, Star } from 'lucide-react';
import { Art } from '../components/MuralArt';
import { CopyButton } from '../components/ui';
import { confetti } from '../lib/confetti';
import { sfx } from '../lib/sfx';
import { usePersistentState } from '../lib/storage';
import { shuffle } from '../lib/teams';
import { useBoardDrag } from '../lib/useBoardDrag';
import { useAnnounce } from '../presenter/announce';

/* ═════════ Momento 2 · Entrena a Robi ═════════ */

type Kind = 'dog' | 'cat';

interface Pet {
  id: string;
  emoji: string;
  kind: Kind;
}

const TRAIN: Pet[] = [
  { id: 'd1', emoji: '🐶', kind: 'dog' },
  { id: 'd2', emoji: '🐕', kind: 'dog' },
  { id: 'd3', emoji: '🐩', kind: 'dog' },
  { id: 'd4', emoji: '🦮', kind: 'dog' },
  { id: 'c1', emoji: '🐱', kind: 'cat' },
  { id: 'c2', emoji: '🐈', kind: 'cat' },
  { id: 'c3', emoji: '😺', kind: 'cat' },
  { id: 'c4', emoji: '😸', kind: 'cat' },
];

interface Test {
  emoji: string;
  name: string;
  truth: string;
  /** Lo que Robi cree cuando ya aprendió bien */
  guess: Kind;
  trap?: string;
}

const TESTS: Test[] = [
  { emoji: '🐕', name: 'un perro', truth: 'Era un perro.', guess: 'dog' },
  { emoji: '🐈', name: 'un gato', truth: 'Era un gato.', guess: 'cat' },
  { emoji: '🐺', name: 'un lobo', truth: 'Era un lobo, ¡no un perro!', guess: 'dog', trap: 'Robi nunca vio un lobo en sus ejemplos y creyó que era un perro.' },
  { emoji: '🐯', name: 'un tigre', truth: 'Era un tigre, ¡no un gato!', guess: 'cat', trap: 'Robi solo conocía gatos pequeños y se confundió con un felino grande.' },
];

const WORD: Record<Kind, string> = { dog: 'PERRO', cat: 'GATO' };

/** Juego de pizarra: los estudiantes dan ejemplos a Robi y descubren cómo aprende (y cómo se equivoca) una IA. */
export function RobiGame() {
  const [order, setOrder] = usePersistentState<string[]>('robi:order', ['d1', 'c1', 'd2', 'c2', 'd3', 'c3', 'd4', 'c4']);
  const [placed, setPlaced] = usePersistentState<string[]>('robi:placed', []);
  const [phase, setPhase] = usePersistentState<'train' | 'test' | 'end'>('robi:phase', 'train');
  const [t, setT] = usePersistentState('robi:t', 0);
  const [shown, setShown] = usePersistentState<number[]>('robi:shown', []);
  const [msg, setMsg] = useState('Dale ejemplos a Robi: arrastra cada animal a su casa.');
  const [bad, setBad] = useState<string | null>(null);

  const byId = (id: string) => TRAIN.find((p) => p.id === id) as Pet;
  const tray = order.filter((id) => !placed.includes(id));
  const learned = placed.length;
  const sure = Math.round(Math.min(96, 38 + learned * 7.5));

  useAnnounce('e-robi', { key: 'e-robi', kind: 'info', prompt: 'Entrena a Robi: ¿cuántos ejemplos le damos para que aprenda?', options: [`Ejemplos dados: ${learned} de ${TRAIN.length}`], open: true });

  const { bind, zone, armed } = useBoardDrag((id, z) => {
    if (phase !== 'train' || placed.includes(id)) return;
    const pet = byId(id);
    if (pet.kind === z) {
      setPlaced((p) => [...p, id]);
      setMsg(learned + 1 >= TRAIN.length ? '¡Robi ya vio todos los ejemplos!' : '¡Muy bien! Robi aprendió algo nuevo.');
      sfx.ok();
      if (learned + 1 >= TRAIN.length) confetti({ count: 80, y: 0.5 });
    } else {
      setBad(id);
      setMsg(`Ese animal no va ahí: si le das un ejemplo equivocado, Robi aprende mal.`);
      sfx.bad();
      window.setTimeout(() => setBad(null), 600);
    }
  }, phase === 'train');

  const test = TESTS[Math.min(t, TESTS.length - 1)];
  // Con muy pocos ejemplos Robi se equivoca incluso en lo fácil
  const guessFor = (i: number): Kind => (learned < 3 && i < 2 ? (TESTS[i].guess === 'dog' ? 'cat' : 'dog') : TESTS[i].guess);
  const guess = guessFor(t);
  const revealed = shown.includes(t);

  const results = useMemo(() => TESTS.map((x, i) => !x.trap && guessFor(i) === x.guess), [learned]); // eslint-disable-line react-hooks/exhaustive-deps
  const hits = results.filter(Boolean).length;

  function again() {
    setOrder(shuffle(TRAIN.map((p) => p.id)));
    setPlaced([]);
    setPhase('train');
    setT(0);
    setShown([]);
    setMsg('Dale ejemplos a Robi: arrastra cada animal a su casa.');
    sfx.whoosh();
  }

  return (
    <section className="robi enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">Juego · Momento 2</span>
          <h2 className="h-lg">
            Entrena a <span className="grad-text">Robi</span>
          </h2>
        </div>
        <div className="robi__stars" aria-label={`${learned} ejemplos dados`}>
          {TRAIN.map((p) => (
            <Star key={p.id} className={placed.includes(p.id) ? 'is-on' : ''} />
          ))}
        </div>
      </header>

      <div className="robi__grid">
        <div className="robi__bot">
          <Art name="robot" className={`robi__art ${phase === 'test' && revealed && !results[t] ? 'is-oops' : ''}`} />
          <div className="robi__bubble" aria-live="polite">
            {phase === 'train' && <p>{msg}</p>}
            {phase === 'test' && (
              <p>
                {revealed ? (
                  <>
                    Dije <b>{WORD[guess]}</b>… {results[t] ? '¡y acerté!' : '¡me equivoqué!'}
                  </>
                ) : (
                  <>
                    Veo {test.emoji}. Creo que es un <b>{WORD[guess]}</b> ({sure} % seguro).
                  </>
                )}
              </p>
            )}
            {phase === 'end' && (
              <p>
                Acerté <b>{hits}</b> de {TESTS.length}.
              </p>
            )}
          </div>
          <div className="robi__meter" aria-label={`Robi sabe ${sure} por ciento`}>
            <span>Lo que sabe Robi</span>
            <i>
              <u style={{ width: `${learned === 0 ? 4 : sure}%` }} />
            </i>
            <b>{learned} ejemplos</b>
          </div>
        </div>

        <div className="robi__play">
          {phase === 'train' && (
            <>
              <div className="robi__homes">
                {(['dog', 'cat'] as Kind[]).map((k) => (
                  <div key={k} className={`home home--${k} ${armed ? 'is-armed' : ''}`} {...zone(k)}>
                    <h3>
                      {k === 'dog' ? '🐶 Perros' : '🐱 Gatos'}
                    </h3>
                    <div className="home__items">
                      {placed.filter((id) => byId(id).kind === k).map((id) => (
                        <span key={id} className="petcard petcard--set">
                          {byId(id).emoji}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="robi__tray" {...zone('tray')} aria-label="Animales por clasificar">
                {tray.map((id) => {
                  const b = bind(id);
                  return (
                    <button key={id} type="button" {...b} className={`petcard ${b.className} ${bad === id ? 'is-bad' : ''}`}>
                      {byId(id).emoji}
                    </button>
                  );
                })}
                {tray.length === 0 && <em>¡Todos clasificados!</em>}
              </div>
              <div className="robi__actions">
                <span className="note-muted">{armed ? 'Ahora toca la casa donde va.' : 'Arrastra con el dedo, o toca el animal y luego su casa.'}</span>
                <button
                  type="button"
                  className="btn btn--primary btn--lg"
                  disabled={learned < 3}
                  onClick={() => {
                    setPhase('test');
                    sfx.whoosh();
                  }}
                >
                  ¡Probar a Robi! <ArrowRight />
                </button>
              </div>
            </>
          )}

          {phase === 'test' && (
            <div className="robi__test">
              <div className="robi__subject" key={t}>
                {test.emoji}
              </div>
              <p className="robi__count">
                Prueba {t + 1} de {TESTS.length}
              </p>
              {!revealed ? (
                <button
                  type="button"
                  className="btn btn--primary btn--xl"
                  onClick={() => {
                    setShown((s) => [...s, t]);
                    results[t] ? sfx.ok() : sfx.bad();
                  }}
                >
                  ¿Acertó Robi?
                </button>
              ) : (
                <div className={`robi__reveal ${results[t] ? 'is-ok' : 'is-bad'}`}>
                  <b>{test.truth}</b>
                  <span>{test.trap ?? (results[t] ? 'Robi aprendió bien con sus ejemplos.' : 'Robi vio muy pocos ejemplos y se confundió. Más datos, mejor aprendizaje.')}</span>
                  <button
                    type="button"
                    className="btn btn--primary btn--lg"
                    onClick={() => {
                      if (t + 1 >= TESTS.length) {
                        setPhase('end');
                        sfx.win();
                        confetti({ count: 90 });
                      } else setT(t + 1);
                    }}
                  >
                    {t + 1 >= TESTS.length ? 'Ver lo que descubrimos' : 'Siguiente'} <ArrowRight />
                  </button>
                </div>
              )}
            </div>
          )}

          {phase === 'end' && (
            <div className="robi__end">
              <h3>Lo que descubrimos</h3>
              <ul>
                <li>
                  <b>Más ejemplos, mejor aprende.</b> Robi acertó más cuando le dimos más datos.
                </li>
                <li>
                  <b>Con lo nuevo se equivoca.</b> Nunca había visto un lobo ni un tigre.
                </li>
                <li>
                  <b>Por eso verificamos.</b> La IA puede decir “perro” con mucha seguridad y estar equivocada.
                </li>
              </ul>
              <button type="button" className="btn btn--lg" onClick={again}>
                <RotateCcw /> Entrenar a Robi otra vez
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═════════ Momento 3 · Fábrica de apps ═════════ */

type Cat = 'tipo' | 'tema' | 'estilo' | 'extras';

interface Piece {
  id: string;
  cat: Cat;
  label: string;
  emoji: string;
  /** Texto dentro del prompt */
  say: string;
}

const PIECES: Piece[] = [
  { id: 'memoria', cat: 'tipo', label: 'Juego de memoria', emoji: '🧠', say: 'juego de memoria' },
  { id: 'quiz', cat: 'tipo', label: 'Quiz', emoji: '🎯', say: 'quiz de preguntas' },
  { id: 'simulador', cat: 'tipo', label: 'Simulador', emoji: '🔬', say: 'simulador' },
  { id: 'historia', cat: 'tipo', label: 'Historia interactiva', emoji: '📖', say: 'historia interactiva' },
  { id: 'espacio', cat: 'tema', label: 'Espacio', emoji: '🚀', say: 'el espacio' },
  { id: 'selva', cat: 'tema', label: 'Selva', emoji: '🌴', say: 'la selva' },
  { id: 'oceano', cat: 'tema', label: 'Océano', emoji: '🌊', say: 'el océano' },
  { id: 'dinos', cat: 'tema', label: 'Dinosaurios', emoji: '🦖', say: 'los dinosaurios' },
  { id: 'neon', cat: 'estilo', label: 'Neón', emoji: '💜', say: 'neón con colores brillantes sobre fondo oscuro' },
  { id: 'caricatura', cat: 'estilo', label: 'Caricatura', emoji: '🎨', say: 'caricatura con colores alegres' },
  { id: 'retro', cat: 'estilo', label: 'Retro', emoji: '👾', say: 'retro de videojuego antiguo' },
  { id: 'puntos', cat: 'extras', label: 'Puntos', emoji: '⭐', say: 'puntos' },
  { id: 'vidas', cat: 'extras', label: 'Vidas', emoji: '❤️', say: 'tres vidas' },
  { id: 'sonido', cat: 'extras', label: 'Sonido', emoji: '🔊', say: 'efectos de sonido' },
  { id: 'niveles', cat: 'extras', label: 'Niveles', emoji: '🪜', say: 'niveles cada vez más difíciles' },
  { id: 'tiempo', cat: 'extras', label: 'Tiempo', emoji: '⏱️', say: 'un cronómetro' },
];

const CATS: { id: Cat; title: string; hint: string; max: number }[] = [
  { id: 'tipo', title: '¿Qué es?', hint: 'el tipo de app', max: 1 },
  { id: 'tema', title: '¿De qué trata?', hint: 'el tema', max: 1 },
  { id: 'estilo', title: '¿Cómo se ve?', hint: 'el estilo', max: 1 },
  { id: 'extras', title: '¿Qué trae?', hint: 'dos extras', max: 2 },
];

interface Mission {
  title: string;
  need: string[];
}

const MISSIONS: Mission[] = [
  { title: 'Un juego de memoria del espacio con estilo neón', need: ['memoria', 'espacio', 'neon'] },
  { title: 'Un quiz de dinosaurios con puntos y vidas', need: ['quiz', 'dinos', 'puntos', 'vidas'] },
  { title: 'Un simulador del océano con estilo caricatura y niveles', need: ['simulador', 'oceano', 'caricatura', 'niveles'] },
  { title: 'Una historia interactiva retro de la selva con sonido', need: ['historia', 'selva', 'retro', 'sonido'] },
];

const SKIN: Record<string, { bg: string; ink: string; accent: string }> = {
  neon: { bg: 'linear-gradient(160deg,#1b0b3a,#0d1b4d)', ink: '#e8f4ff', accent: '#22e0ff' },
  caricatura: { bg: 'linear-gradient(160deg,#ffe27a,#ff9ec4)', ink: '#3b1d4f', accent: '#7c3aed' },
  retro: { bg: 'linear-gradient(160deg,#0f3d3e,#e07a3f)', ink: '#fff6d6', accent: '#ffd24a' },
  none: { bg: 'linear-gradient(160deg,#2a3354,#1a213b)', ink: '#c9d1ee', accent: '#8892b0' },
};

const SCENE: Record<string, string> = {
  memoria: 'Encuentra las parejas iguales',
  quiz: '¿Cuál es la respuesta correcta?',
  simulador: 'Mueve el control y mira qué pasa',
  historia: 'Tú eliges qué hace el héroe',
};

/** Juego de pizarra: se arma, pieza por pieza, la idea de una app; la maqueta cambia y se genera el prompt. */
export function AppFactory() {
  const [picked, setPicked] = usePersistentState<Record<Cat, string[]>>('fab:picked', { tipo: [], tema: [], estilo: [], extras: [] });
  const [mission, setMission] = usePersistentState<number | null>('fab:mission', 0);
  const [stars, setStars] = usePersistentState('fab:stars', 0);
  const [done, setDone] = usePersistentState<number[]>('fab:done', []);
  const [msg, setMsg] = useState<string>('');
  const [shake, setShake] = useState<string | null>(null);

  const all = Object.values(picked).flat();
  const pc = (id: string) => PIECES.find((p) => p.id === id) as Piece;
  const tipo = picked.tipo[0] ? pc(picked.tipo[0]) : null;
  const tema = picked.tema[0] ? pc(picked.tema[0]) : null;
  const estilo = picked.estilo[0] ? pc(picked.estilo[0]) : null;
  const extras = picked.extras.map(pc);
  const complete = Boolean(tipo && tema && estilo && extras.length === 2);
  const skin = SKIN[estilo?.id ?? 'none'];

  useAnnounce('e-fabrica', { key: 'e-fabrica', kind: 'info', prompt: 'Fábrica de apps: armen la idea de una app pieza por pieza.', options: [mission !== null ? `Misión: ${MISSIONS[mission].title}` : 'Modo libre: inventa tu app'], open: true });

  const { bind, zone, armed } = useBoardDrag((id, z) => {
    const p = pc(id);
    if (p.cat !== z) {
      setShake(id);
      setMsg('Esa pieza va en otra casilla. Mira el color y el título de cada una.');
      sfx.bad();
      window.setTimeout(() => setShake(null), 500);
      return;
    }
    setMsg('');
    setPicked((s) => {
      const cur = s[p.cat].filter((x) => x !== id);
      const max = CATS.find((c) => c.id === p.cat)?.max ?? 1;
      return { ...s, [p.cat]: [...cur, id].slice(-max) };
    });
    sfx.ok();
  });

  const remove = (cat: Cat, id: string) => {
    setPicked((s) => ({ ...s, [cat]: s[cat].filter((x) => x !== id) }));
    sfx.pop();
  };
  const reset = () => {
    setPicked({ tipo: [], tema: [], estilo: [], extras: [] });
    setMsg('');
    sfx.whoosh();
  };

  const prompt = `Crea un ${tipo?.say ?? '…'} sobre ${tema?.say ?? '…'}. Estilo visual: ${estilo?.say ?? '…'}. Debe tener ${extras.length ? extras.map((x) => x.say).join(' y ') : '…'}. Que funcione bien en celular y en computador, con botones grandes.`;

  function check() {
    if (mission === null) return;
    const m = MISSIONS[mission];
    const missing = m.need.filter((n) => !all.includes(n));
    const extra = all.filter((n) => !m.need.includes(n));
    if (!missing.length && !extra.length) {
      sfx.win();
      confetti({ count: 140, y: 0.55 });
      setMsg('¡Misión cumplida! Ganaste una estrella.');
      if (!done.includes(mission)) {
        setStars((s) => s + 1);
        setDone((d) => [...d, mission]);
      }
    } else {
      sfx.bad();
      setMsg(missing.length ? `Te falta: ${missing.map((n) => pc(n).label).join(', ')}.` : `Sobra: ${extra.map((n) => pc(n).label).join(', ')}.`);
    }
  }

  return (
    <section className="fab enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">Juego · Momento 3</span>
          <h2 className="h-lg">
            La <span className="grad-text">fábrica de apps</span>
          </h2>
          <p className="lead fab__lead">Así le hablas a la IA: cada pieza es una parte de tu idea.</p>
        </div>
        <div className="fab__score" aria-label={`${stars} estrellas`}>
          <Star /> <b>{stars}</b>
        </div>
      </header>

      <div className="fab__missions" role="group" aria-label="Elige una misión">
        <button type="button" className={`chipbtn ${mission === null ? 'is-on' : ''}`} onClick={() => setMission(null)}>
          ✨ Libre
        </button>
        {MISSIONS.map((m, i) => (
          <button key={m.title} type="button" className={`chipbtn ${mission === i ? 'is-on' : ''} ${done.includes(i) ? 'is-done' : ''}`} onClick={() => { setMission(i); setMsg(''); reset(); }}>
            {done.includes(i) ? '✅' : '🎯'} Misión {i + 1}
          </button>
        ))}
      </div>
      <p className="fab__goal">{mission === null ? 'Modo libre: inventa la app que quieras.' : <>Misión: crea <b>{MISSIONS[mission].title}</b>.</>}</p>

      <div className="fab__grid">
        <div className="fab__build">
          <div className="fab__slots">
            {CATS.map((c) => {
              const items = picked[c.id].map(pc);
              return (
                <div key={c.id} className={`fslot fslot--${c.id} ${armed ? 'is-armed' : ''}`} {...zone(c.id)}>
                  <h3>
                    {c.title} <small>{c.hint}</small>
                  </h3>
                  <div className="fslot__body">
                    {items.map((p) => (
                      <button key={p.id} type="button" className="piece piece--set" onClick={() => remove(c.id, p.id)} title="Toca para quitar">
                        {p.emoji} {p.label}
                      </button>
                    ))}
                    {items.length < c.max && <em>{armed ? 'Toca aquí' : 'Suelta aquí'}</em>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="fab__tray" {...zone('tray')} aria-label="Piezas disponibles">
            {PIECES.filter((p) => !picked[p.cat].includes(p.id)).map((p) => {
              const b = bind(p.id);
              return (
                <button key={p.id} type="button" {...b} className={`piece piece--${p.cat} ${b.className} ${shake === p.id ? 'is-bad' : ''}`}>
                  {p.emoji} {p.label}
                </button>
              );
            })}
          </div>
          {msg && (
            <p className="fab__msg" role="status">
              {msg}
            </p>
          )}
        </div>

        <div className="fab__right">
          <div className="phone" style={{ background: skin.bg, color: skin.ink, '--ac': skin.accent } as CSSProperties} aria-label="Maqueta de tu app">
            <span className="phone__notch" />
            <div className="phone__emoji">{tema?.emoji ?? '❓'}</div>
            <h3 className="phone__title">{tipo || tema ? `${tipo?.label ?? 'Tu app'}${tema ? `: ${tema.label}` : ''}` : 'Tu app aparecerá aquí'}</h3>
            <p className="phone__scene">{tipo ? SCENE[tipo.id] : 'Elige las piezas de tu idea'}</p>
            <div className="phone__chips">
              {extras.map((x) => (
                <span key={x.id}>
                  {x.emoji}
                  {x.id === 'puntos' ? ' 0' : x.id === 'vidas' ? ' ×3' : x.id === 'niveles' ? ' 1/3' : x.id === 'tiempo' ? ' 30 s' : ''}
                </span>
              ))}
            </div>
            <span className="phone__btn">¡Jugar!</span>
          </div>
          <span className="note-muted">Maqueta de cómo podría verse. La app real la crea AI Studio.</span>
        </div>
      </div>

      <div className="fab__prompt glass">
        <span className="kicker">
          <Sparkles /> Así se lo dirías a AI Studio
        </span>
        <p className={complete ? 'is-ready' : ''}>{prompt}</p>
        <div className="fab__btns">
          {mission !== null && (
            <button type="button" className="btn btn--primary btn--lg" onClick={check} disabled={!all.length}>
              <Check /> Comprobar misión
            </button>
          )}
          <CopyButton text={prompt} label="Copiar prompt" disabled={!complete} className={mission === null ? 'btn--primary btn--lg' : 'btn--lg'} />
          <button type="button" className="btn btn--ghost" onClick={reset}>
            <RotateCcw /> Empezar de nuevo
          </button>
        </div>
      </div>
    </section>
  );
}
