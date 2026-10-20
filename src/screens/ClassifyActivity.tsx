import type { LucideIcon } from 'lucide-react';
import { ArrowRight, Check, RotateCcw, X } from 'lucide-react';
import { ActivityControls, ActivityGate } from '../components/ActivityShell';
import { usePersistentState } from '../lib/storage';

type Side = 'A' | 'B';

export interface ClassifyItem {
  text: string;
  answer: Side;
  why: string;
}

export interface ClassifyConfig {
  id: string;
  kicker: string;
  title: string;
  labels: Record<Side, { label: string; icon: LucideIcon }>;
  items: ClassifyItem[];
  result: { heading: string; bullets: string[]; closing: string };
}

interface State {
  index: number;
  picks: (Side | null)[];
}

/** Actividad de clasificación en dos categorías con retroalimentación inmediata. */
export function ClassifyActivity({ cfg }: { cfg: ClassifyConfig }) {
  const { id, items } = cfg;
  const initial: State = { index: 0, picks: items.map(() => null) };
  const [st, setSt] = usePersistentState<State>(`activity:${id}:v2`, initial);
  const done = st.index >= items.length;
  const item = items[Math.min(st.index, items.length - 1)];
  const pick = st.picks[st.index] ?? null;
  const correct = st.picks.filter((p, i) => p === items[i].answer).length;

  const choose = (k: Side) => {
    if (pick) return;
    setSt((s) => ({ ...s, picks: s.picks.map((p, i) => (i === s.index ? k : p)) }));
  };

  return (
    <section className="tvi enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">{cfg.kicker}</span>
          <h2 className="h-lg">{cfg.title}</h2>
        </div>
        <ActivityControls id={id} onReset={() => setSt(initial)} />
      </header>

      <ActivityGate id={id}>
        {!done ? (
          <div className="tvi__stage">
            <div className="tvi__count">
              <span>
                Situación {st.index + 1} de {items.length}
              </span>
              <div className="tvi__dots" aria-hidden="true">
                {items.map((it, i) => (
                  <i key={i} className={st.picks[i] ? (st.picks[i] === it.answer ? 'is-ok' : 'is-bad') : i === st.index ? 'is-now' : ''} />
                ))}
              </div>
            </div>

            <blockquote className="tvi__card" key={st.index}>
              “{item.text}”
            </blockquote>

            <div className="tvi__choices">
              {(['A', 'B'] as Side[]).map((k) => {
                const isPicked = pick === k;
                const isAnswer = item.answer === k;
                const cls = pick ? (isAnswer ? 'is-ok' : isPicked ? 'is-bad' : 'is-dim') : '';
                const Icon = cfg.labels[k].icon;
                return (
                  <button key={k} type="button" className={`tvi__choice tvi__choice--${k} ${cls}`} onClick={() => choose(k)} disabled={Boolean(pick)}>
                    <Icon />
                    <span>{cfg.labels[k].label}</span>
                    {pick && isAnswer && <Check className="tvi__mark" />}
                    {pick && isPicked && !isAnswer && <X className="tvi__mark" />}
                  </button>
                );
              })}
            </div>

            <div className={`tvi__feedback ${pick ? 'is-shown' : ''} ${pick === item.answer ? 'is-ok' : 'is-bad'}`} aria-live="polite">
              {pick && (
                <>
                  <strong>{pick === item.answer ? '¡Exacto!' : 'Miremos de nuevo.'}</strong>
                  <span>{item.why}</span>
                  <button type="button" className="btn btn--primary" onClick={() => setSt((s) => ({ ...s, index: s.index + 1 }))}>
                    {st.index === items.length - 1 ? 'Ver resultado' : 'Siguiente situación'} <ArrowRight />
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="tvi__result">
            <div className="ring" style={{ ['--p' as string]: `${(correct / items.length) * 100}` }}>
              <b>
                {correct}/{items.length}
              </b>
              <span>aciertos del grupo</span>
            </div>
            <div className="tvi__takeaway">
              <h3>{cfg.result.heading}</h3>
              <ul>
                {cfg.result.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <p>{cfg.result.closing}</p>
              <button type="button" className="btn" onClick={() => setSt(initial)}>
                <RotateCcw /> Repetir
              </button>
            </div>
          </div>
        )}
      </ActivityGate>
    </section>
  );
}
