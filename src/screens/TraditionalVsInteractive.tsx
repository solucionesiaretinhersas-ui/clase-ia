import { ArrowRight, BookOpen, Check, RotateCcw, Sparkles, X } from 'lucide-react';
import { ActivityControls, ActivityGate } from '../components/ActivityShell';
import { usePersistentState } from '../lib/storage';

const ID = 'tradicional';
type Kind = 'T' | 'I';

const ITEMS: { text: string; answer: Kind; why: string }[] = [
  {
    text: 'El docente explica y los estudiantes copian del tablero.',
    answer: 'T',
    why: 'El estudiante recibe información, pero no toma decisiones ni recibe retroalimentación.',
  },
  {
    text: 'Cada estudiante resuelve un reto y ve al instante si acertó y por qué.',
    answer: 'I',
    why: 'La retroalimentación inmediata convierte el error en una oportunidad de aprendizaje.',
  },
  {
    text: 'Se proyectan 30 diapositivas con definiciones.',
    answer: 'T',
    why: 'Mostrar contenido no es lo mismo que diseñar una experiencia. La atención cae rápido.',
  },
  {
    text: 'Los estudiantes eligen un camino en una historia y ven sus consecuencias.',
    answer: 'I',
    why: 'Decidir y ver el efecto de la decisión activa el pensamiento y la motivación.',
  },
  {
    text: 'La evaluación llega una semana después en una hoja calificada.',
    answer: 'T',
    why: 'Cuando la retroalimentación llega tarde, el estudiante ya no puede ajustar su comprensión.',
  },
  {
    text: 'Un simulador permite cambiar variables y observar qué pasa.',
    answer: 'I',
    why: 'Manipular y experimentar construye comprensión, no solo memoria.',
  },
  {
    text: 'Todos avanzan al mismo ritmo, sin importar si entendieron.',
    answer: 'T',
    why: 'Un recurso interactivo puede adaptar el ritmo y dar pistas a quien lo necesita.',
  },
  {
    text: 'El estudiante gana puntos, ve su progreso y vuelve a intentar.',
    answer: 'I',
    why: 'Progreso visible y segundas oportunidades sostienen el esfuerzo.',
  },
];

interface State {
  index: number;
  picks: (Kind | null)[];
}
const INITIAL: State = { index: 0, picks: ITEMS.map(() => null) };

export function TraditionalVsInteractive() {
  const [st, setSt] = usePersistentState<State>(`activity:${ID}:data`, INITIAL);
  const done = st.index >= ITEMS.length;
  const item = ITEMS[Math.min(st.index, ITEMS.length - 1)];
  const pick = st.picks[st.index] ?? null;
  const correct = st.picks.filter((p, i) => p === ITEMS[i].answer).length;
  const answered = st.picks.filter(Boolean).length;

  const choose = (k: Kind) => {
    if (pick) return;
    setSt((s) => ({ ...s, picks: s.picks.map((p, i) => (i === s.index ? k : p)) }));
  };

  return (
    <section className="tvi enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">Actividad · Al tablero</span>
          <h2 className="h-lg">¿Clase tradicional o clase interactiva?</h2>
        </div>
        <ActivityControls id={ID} onReset={() => setSt(INITIAL)} />
      </header>

      <ActivityGate id={ID}>
        {!done ? (
          <div className="tvi__stage">
            <div className="tvi__count">
              <span>
                Situación {st.index + 1} de {ITEMS.length}
              </span>
              <div className="tvi__dots" aria-hidden="true">
                {ITEMS.map((it, i) => (
                  <i
                    key={i}
                    className={
                      st.picks[i] ? (st.picks[i] === it.answer ? 'is-ok' : 'is-bad') : i === st.index ? 'is-now' : ''
                    }
                  />
                ))}
              </div>
            </div>

            <blockquote className="tvi__card" key={st.index}>
              “{item.text}”
            </blockquote>

            <div className="tvi__choices">
              {(['T', 'I'] as Kind[]).map((k) => {
                const isPicked = pick === k;
                const isAnswer = item.answer === k;
                const cls = pick ? (isAnswer ? 'is-ok' : isPicked ? 'is-bad' : 'is-dim') : '';
                return (
                  <button key={k} type="button" className={`tvi__choice tvi__choice--${k} ${cls}`} onClick={() => choose(k)} disabled={Boolean(pick)}>
                    {k === 'T' ? <BookOpen /> : <Sparkles />}
                    <span>{k === 'T' ? 'Tradicional' : 'Interactiva'}</span>
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
                    {st.index === ITEMS.length - 1 ? 'Ver resultado' : 'Siguiente situación'} <ArrowRight />
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="tvi__result">
            <div className="ring" style={{ ['--p' as string]: `${(correct / ITEMS.length) * 100}` }}>
              <b>
                {correct}/{ITEMS.length}
              </b>
              <span>aciertos del grupo</span>
            </div>
            <div className="tvi__takeaway">
              <h3>Una clase interactiva le pide al estudiante:</h3>
              <ul>
                <li>Decidir</li>
                <li>Equivocarse sin miedo</li>
                <li>Recibir retroalimentación inmediata</li>
                <li>Ver su progreso</li>
              </ul>
              <p>Eso es exactamente lo que vamos a pedirle a la IA que construya.</p>
              <button type="button" className="btn" onClick={() => setSt(INITIAL)}>
                <RotateCcw /> Repetir ({answered} respondidas)
              </button>
            </div>
          </div>
        )}
      </ActivityGate>
    </section>
  );
}
