import { useState, type CSSProperties } from 'react';
import { BookOpenCheck, ClipboardCheck, Compass, Gamepad2, Globe2, Hand, Heart, Sprout, Thermometer, type LucideIcon } from 'lucide-react';
import { Mission } from '../demo/Mission';
import { Modal } from '../components/ui';
import { sfx } from '../lib/sfx';
import { confetti } from '../lib/confetti';

type Kind = 'demo' | 'maqueta';

interface Item {
  id: string;
  title: string;
  area: string;
  text: string;
  color: string;
  icon: LucideIcon;
  kind: Kind;
}

const ITEMS: Item[] = [
  { id: 'sim', title: 'Simulador de ciencias', area: 'Ciencias Naturales', text: 'El estudiante cambia una variable y observa el efecto, como la temperatura en el ciclo del agua.', color: 'var(--cyan)', icon: Thermometer, kind: 'demo' },
  { id: 'juego', title: 'Juego matemático', area: 'Matemáticas', text: 'Niveles, vidas y retroalimentación inmediata para practicar fracciones sin sentir que es un examen.', color: 'var(--violet)', icon: Gamepad2, kind: 'demo' },
  { id: 'guia', title: 'Guía de aprendizaje interactiva', area: 'Todas las áreas', text: 'Una guía por momentos con preguntas, pistas y un cierre de metacognición.', color: 'var(--mint)', icon: BookOpenCheck, kind: 'maqueta' },
  { id: 'eval', title: 'Actividad de evaluación', area: 'Todas las áreas', text: 'Preguntas que explican cada respuesta y dejan volver a intentar, con resumen para el docente.', color: 'var(--amber)', icon: ClipboardCheck, kind: 'demo' },
  { id: 'app', title: 'Aplicación educativa', area: 'Ciencias Naturales', text: 'Una pequeña aplicación completa: introducción, retos, puntos y resultados.', color: 'var(--blue)', icon: Globe2, kind: 'demo' },
  { id: 'explora', title: 'Recurso de exploración', area: 'Sociales · Lengua', text: 'Un mapa o una historia donde el estudiante recorre, decide y descubre.', color: 'var(--rose)', icon: Compass, kind: 'maqueta' },
];

/* ───── Demostración 1: simulador del ciclo del agua ───── */
function WaterSim() {
  const [t, setT] = useState(22);
  const [ans, setAns] = useState<number | null>(null);
  const evap = Math.max(0, (t - 5) / 35);
  const rain = Math.max(0, evap - 0.25) * 1.2;
  return (
    <div className="demo-sim">
      <h3>Ciclo del agua</h3>
      <div className="demo-sim__scene" aria-hidden="true">
        <span className="demo-sim__sun" style={{ opacity: 0.35 + evap * 0.65, scale: String(0.8 + evap * 0.5) }} />
        <span className="demo-sim__cloud" style={{ scale: String(0.7 + evap * 0.9), opacity: 0.4 + evap * 0.6 }} />
        {Array.from({ length: 6 }, (_, i) => (
          <i key={i} className="demo-sim__vapor" style={{ left: `${12 + i * 13}%`, animationDuration: `${Math.max(1.2, 4 - evap * 2.6)}s`, animationDelay: `${i * 0.4}s`, opacity: evap > 0.05 ? 1 : 0 }} />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <i key={i} className="demo-sim__rain" style={{ left: `${40 + i * 6}%`, animationDelay: `${i * 0.18}s`, opacity: rain > 0.1 ? 1 : 0 }} />
        ))}
        <span className="demo-sim__lake" />
      </div>
      <label className="demo-sim__ctl">
        <span>
          <Thermometer /> Temperatura: <b>{t} °C</b>
        </span>
        <input type="range" min={0} max={40} value={t} onChange={(e) => setT(Number(e.target.value))} aria-label="Temperatura" />
      </label>
      <ul className="demo-sim__meters">
        <li>
          Evaporación <i><u style={{ width: `${evap * 100}%` }} /></i>
        </li>
        <li>
          Lluvia <i><u style={{ width: `${Math.min(1, rain) * 100}%` }} /></i>
        </li>
      </ul>
      <p className="demo-sim__q">¿Qué pasa con la evaporación si baja la temperatura?</p>
      <div className="demo-sim__opts">
        {['Aumenta', 'Disminuye', 'Se queda igual'].map((o, i) => (
          <button
            key={o}
            type="button"
            className={ans === i ? (i === 1 ? 'is-ok' : 'is-bad') : ''}
            onClick={() => {
              setAns(i);
              if (i === 1) {
                sfx.ok();
                confetti({ count: 40, y: 0.6 });
              } else sfx.bad();
            }}
          >
            {o}
          </button>
        ))}
      </div>
      {ans !== null && <p className="demo-sim__fb">{ans === 1 ? 'Correcto: con menos calor, el agua se evapora más lentamente. Pruébalo moviendo la temperatura.' : 'No exactamente. Mueve la temperatura y observa la barra de evaporación; luego vuelve a responder.'}</p>}
    </div>
  );
}

/* ───── Demostración 2: juego de fracciones ───── */
const PAIRS: [string, number, string, number][] = [
  ['1/2', 0.5, '2/3', 0.667],
  ['3/4', 0.75, '4/5', 0.8],
  ['5/8', 0.625, '3/5', 0.6],
  ['2/5', 0.4, '1/3', 0.333],
  ['7/10', 0.7, '3/4', 0.75],
];

function FractionGame() {
  const [i, setI] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [fb, setFb] = useState<string | null>(null);
  const done = i >= PAIRS.length || lives === 0;
  const [a, av, b, bv] = PAIRS[Math.min(i, PAIRS.length - 1)];

  const choose = (isA: boolean) => {
    const right = isA ? av > bv : bv > av;
    if (right) {
      sfx.ok();
      setScore((s) => s + 10);
      setFb(`¡Bien! ${a} = ${av.toFixed(2)} y ${b} = ${bv.toFixed(2)}.`);
      window.setTimeout(() => {
        setFb(null);
        setI((n) => n + 1);
      }, 900);
    } else {
      sfx.bad();
      setLives((l) => l - 1);
      setFb(`Todavía no: ${a} = ${av.toFixed(2)} y ${b} = ${bv.toFixed(2)}. Compara los decimales.`);
    }
  };

  if (done)
    return (
      <div className="demo-fr demo-fr--end">
        <h3>{lives === 0 ? 'Se acabaron las vidas' : '¡Completaste el reto!'}</h3>
        <p>Puntos: <b>{score}</b></p>
        <button type="button" className="btn btn--primary btn--lg" onClick={() => { setI(0); setLives(3); setScore(0); setFb(null); }}>
          Jugar de nuevo
        </button>
      </div>
    );

  return (
    <div className="demo-fr">
      <div className="demo-fr__hud">
        <span>
          Reto {i + 1} de {PAIRS.length}
        </span>
        <b>
          {Array.from({ length: lives }, (_, k) => (
            <Heart key={k} />
          ))}
        </b>
        <span>★ {score}</span>
      </div>
      <h3>¿Cuál fracción es mayor?</h3>
      <div className="demo-fr__opts">
        <button type="button" onClick={() => choose(true)}>{a}</button>
        <button type="button" onClick={() => choose(false)}>{b}</button>
      </div>
      {fb && <p className="demo-fr__fb" role="status">{fb}</p>}
    </div>
  );
}

/* ───── Maqueta: lo que podría ser (identificada como tal) ───── */
function Maqueta({ item }: { item: Item }) {
  const Icon = item.icon;
  return (
    <div className="demo-mock">
      <span className="chip chip--warn">Maqueta ilustrativa · no es un recurso funcional</span>
      <div className="demo-mock__frame" style={{ '--c': item.color } as CSSProperties}>
        <div className="demo-mock__top"><Icon /> {item.title}</div>
        <div className="demo-mock__blocks"><i /><i /><i /></div>
        <div className="demo-mock__btns"><span /><span /></div>
      </div>
      <p>{item.text}</p>
      <p className="note-muted">Así podría verse. Para tenerlo de verdad hay que construirlo en AI Studio con un buen prompt ROCAS, probarlo y corregirlo.</p>
    </div>
  );
}

/** Galería de recursos: lo que se puede construir, con demostraciones locales y maquetas rotuladas. */
export function ResourceGallery() {
  const [open, setOpen] = useState<Item | null>(null);

  return (
    <section className="res enter">
      <header className="screen-head">
        <span className="kicker">Etapa 4 · Lo que se puede construir</span>
        <h2 className="h-lg">
          Seis recursos, <span className="grad-text">seis identidades</span>
        </h2>
        <p className="lead">Toca cada uno. Los marcados “demostración” funcionan aquí; los de “maqueta” solo muestran la idea.</p>
      </header>

      <ul className="res__grid">
        {ITEMS.map((x, i) => {
          const Icon = x.icon;
          return (
            <li key={x.id} style={{ '--c': x.color, '--i': i } as CSSProperties}>
              <button type="button" className={`rescard rescard--${x.id}`} onClick={() => { setOpen(x); sfx.pop(); }}>
                <span className="rescard__art" aria-hidden="true">
                  <Icon />
                </span>
                <strong>{x.title}</strong>
                <small>{x.area}</small>
                <p>{x.text}</p>
                <span className={`rescard__tag ${x.kind === 'demo' ? 'is-demo' : ''}`}>
                  {x.kind === 'demo' ? <Hand /> : <Sprout />} {x.kind === 'demo' ? 'Demostración funcional' : 'Maqueta'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {open && (
        <Modal onClose={() => setOpen(null)} label={open.title}>
          <div className="res__modal" style={{ '--c': open.color } as CSSProperties}>
            {open.id === 'sim' && <WaterSim />}
            {open.id === 'juego' && <FractionGame />}
            {(open.id === 'eval' || open.id === 'app') && (
              <div className="res__mission">
                <Mission embedded />
              </div>
            )}
            {open.kind === 'maqueta' && <Maqueta item={open} />}
          </div>
        </Modal>
      )}
    </section>
  );
}
