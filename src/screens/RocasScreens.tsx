import { useEffect, useState, type CSSProperties } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { COMPARE_RESULTS, GENERIC_PROMPT, ROCAS, type Letter } from '../data/rocas';
import { confetti } from '../lib/confetti';
import { sfx } from '../lib/sfx';

/* ─────────── 1 · Piedras ROCAS: escalera de piedras que se construye ─────────── */
const SIZES = ['8.2rem', '8.9rem', '9.6rem', '10.3rem', '11rem'];

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
        <p className="lead">Cada piedra cumple una función y todas juntas le dan solidez a la instrucción.</p>
      </header>

      <div className="rocas__body">
        <div className="rocas__stage">
          <svg className="rocas__trail" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
            <path d="M3 36 C 22 34, 30 26, 44 24 S 70 14, 97 4" />
          </svg>
          <ol className="rocks" aria-label="Las cinco piedras de ROCAS">
            {ROCAS.map((x, k) => (
              <li key={x.k}>
                <button
                  type="button"
                  className={`rock ${k === i ? 'is-on' : ''}`}
                  style={{ '--c': x.color, '--s': SIZES[k], '--d': `${k * 0.16}s`, '--k': k } as CSSProperties}
                  onClick={() => {
                    setI(k);
                    sfx.drop();
                  }}
                  aria-pressed={k === i}
                  aria-label={`${x.k}: ${x.name}`}
                >
                  <b>{x.k}</b>
                  <small>{x.name}</small>
                </button>
              </li>
            ))}
          </ol>
          <div className="rocas__ground" aria-hidden="true" />
          <p className="rocas__motto">Toca cada piedra para descubrir qué aporta</p>
        </div>

        <article className="rocas__card glass" key={r.k} style={{ '--c': r.color } as CSSProperties}>
          <span className="rocas__letter">{r.k}</span>
          <div>
            <h3>{r.name}</h3>
            <p className="rocas__q">{r.question}</p>
            <p className="rocas__tip">{r.tip}</p>
            <p className="rocas__ex">“{r.example}”</p>
          </div>
        </article>
      </div>
    </section>
  );
}

/* ─────────── 2 · Comparador: instrucción genérica vs. instrucción ROCAS ─────────── */
export function RocasCompare() {
  const [on, setOn] = useState<Record<Letter, boolean>>({ R: false, O: false, C: false, A: false, S: false });
  const count = ROCAS.filter((x) => on[x.k]).length;
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
  const all = (v: boolean) => {
    setOn({ R: v, O: v, C: v, A: v, S: v });
    sfx.whoosh();
  };

  return (
    <section className="cmp enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">Antes y después</span>
          <h2 className="h-lg">
            Toca cada piedra y mira cómo se <span className="grad-text">fortalece</span> el prompt
          </h2>
        </div>
        <div className="cmp__ctl">
          <button type="button" className="btn" onClick={() => all(false)}>
            Solo la genérica
          </button>
          <button type="button" className="btn btn--primary" onClick={() => all(true)}>
            <Sparkles /> Con ROCAS completo
          </button>
        </div>
      </header>

      <div className="cmp__chips" role="group" aria-label="Partes de ROCAS">
        {ROCAS.map((x) => (
          <button key={x.k} type="button" className={`cmp__chip ${on[x.k] ? 'is-on' : ''}`} style={{ '--c': x.color } as CSSProperties} onClick={() => toggle(x.k)} aria-pressed={on[x.k]}>
            <b>{x.k}</b> {x.name}
            {on[x.k] && <Check />}
          </button>
        ))}
      </div>

      <div className="cmp__grid">
        <div className="cmp__prompt glass">
          <span className="kicker">Tu instrucción</span>
          <p>
            {count === 0 && <span className="is-generic">{GENERIC_PROMPT}</span>}
            {ROCAS.filter((x) => on[x.k]).map((x) => (
              <mark key={x.k} style={{ '--c': x.color } as CSSProperties}>
                <i>{x.k}</i> {x.example}{' '}
              </mark>
            ))}
          </p>
          <ul className="cmp__adds">
            {ROCAS.filter((x) => on[x.k]).map((x) => (
              <li key={x.k} style={{ '--c': x.color } as CSSProperties}>
                <b>{x.k}</b> {x.adds}
              </li>
            ))}
          </ul>
        </div>

        <div className="cmp__meter glass">
          <span className="kicker">Fuerza de la instrucción</span>
          <div className="cmp__wall" role="img" aria-label={`${count} de 5 piedras`}>
            {ROCAS.map((x) => (
              <i key={x.k} className={on[x.k] ? 'is-on' : ''} style={{ '--c': x.color } as CSSProperties} />
            ))}
          </div>
          <strong>
            {count}
            <small>/5</small>
          </strong>
          <p key={count}>{COMPARE_RESULTS[count]}</p>
          <small>Ilustración conceptual del efecto de cada parte; la respuesta real puede variar.</small>
        </div>
      </div>
    </section>
  );
}
