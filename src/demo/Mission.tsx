import { useMemo, useState } from 'react';
import { ArrowRight, Check, Droplets, Globe2, Leaf, RotateCcw, Sun, Trophy, X, Zap } from 'lucide-react';
import { CHALLENGES, POINTS_CORRECT, POINTS_RETRY } from '../data/mission';

type Phase = 'intro' | 'play' | 'end';

const ICONS = [Droplets, Leaf, Sun];
const TOTAL_Q = CHALLENGES.reduce((s, c) => s + c.questions.length, 0);

/**
 * Recurso educativo de demostración: "Misión: salvar el planeta" (grado sexto).
 * Funciona sin conexión; no guarda datos de estudiantes.
 */
export function Mission({ embedded = false }: { embedded?: boolean }) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [ci, setCi] = useState(0);
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [firstTry, setFirstTry] = useState(true);

  const challenge = CHALLENGES[ci];
  const question = challenge.questions[qi];
  const answered = CHALLENGES.slice(0, ci).reduce((s, c) => s + c.questions.length, 0) + qi + (solved ? 1 : 0);
  const pct = Math.round((answered / TOTAL_Q) * 100);

  function restart() {
    setPhase('intro');
    setCi(0);
    setQi(0);
    setScore(0);
    setPicked([]);
    setSolved(false);
    setCorrectCount(0);
    setFirstTry(true);
  }

  function choose(i: number) {
    if (solved || picked.includes(i)) return;
    setPicked((p) => [...p, i]);
    if (question.choices[i].correct) {
      setSolved(true);
      setScore((s) => s + (firstTry ? POINTS_CORRECT : POINTS_RETRY));
      if (firstTry) setCorrectCount((c) => c + 1);
    } else {
      setFirstTry(false);
    }
  }

  function next() {
    setPicked([]);
    setSolved(false);
    setFirstTry(true);
    if (qi < challenge.questions.length - 1) setQi(qi + 1);
    else if (ci < CHALLENGES.length - 1) {
      setCi(ci + 1);
      setQi(0);
    } else setPhase('end');
  }

  const medal = useMemo(() => {
    const max = TOTAL_Q * POINTS_CORRECT;
    const r = score / max;
    if (r >= 0.9) return { title: 'Guardián del planeta', text: '¡Dominaste los tres retos casi sin errores!' };
    if (r >= 0.6) return { title: 'Explorador ambiental', text: 'Vas muy bien. Repasa los retos con errores para llegar a guardián.' };
    return { title: 'Aprendiz verde', text: 'Cada intento enseña algo. Vuelve a jugar para mejorar tu puntaje.' };
  }, [score]);

  return (
    <div className={`mission ${embedded ? 'mission--embedded' : ''}`}>
      <div className="mission__hud">
        <span className="mission__logo">
          <Globe2 /> Misión: salvar el planeta
        </span>
        {phase === 'play' && (
          <>
            <div className="mission__bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progreso de la misión">
              <span style={{ width: `${pct}%` }} />
            </div>
            <span className="mission__score">
              <Zap /> {score}
            </span>
          </>
        )}
      </div>

      {phase === 'intro' && (
        <div className="mission__intro">
          <div className="mission__planet" aria-hidden="true" />
          <span className="kicker">Grado sexto · Ciencias Naturales</span>
          <h2>El planeta necesita ayuda</h2>
          <p>Supera tres retos sobre agua, residuos y energía. Gana puntos por cada acierto y recibe pistas cuando te equivoques.</p>
          <ul className="mission__tags">
            {CHALLENGES.map((c, i) => {
              const Icon = ICONS[i];
              return (
                <li key={c.id}>
                  <Icon /> {c.theme}
                </li>
              );
            })}
          </ul>
          <button type="button" className="btn btn--primary btn--xl" onClick={() => setPhase('play')}>
            Aceptar la misión <ArrowRight />
          </button>
        </div>
      )}

      {phase === 'play' && (
        <div className="mission__play" key={`${ci}-${qi}`}>
          {qi === 0 && !solved && picked.length === 0 && <p className="mission__story">{challenge.story}</p>}
          <span className="kicker">
            {challenge.title} · pregunta {qi + 1} de {challenge.questions.length}
          </span>
          <h3>{question.q}</h3>
          <div className="mission__choices">
            {question.choices.map((c, i) => {
              const was = picked.includes(i);
              const state = was ? (c.correct ? 'is-ok' : 'is-bad') : solved ? 'is-dim' : '';
              return (
                <button key={c.text} type="button" className={`mission__choice ${state}`} onClick={() => choose(i)} disabled={solved || was}>
                  <span>{c.text}</span>
                  {was && (c.correct ? <Check /> : <X />)}
                </button>
              );
            })}
          </div>
          <div className={`mission__feedback ${solved ? 'is-ok' : picked.length ? 'is-bad' : ''}`} aria-live="polite">
            {solved && (
              <>
                <strong>{firstTry ? `¡Correcto! +${POINTS_CORRECT}` : `¡Lo lograste! +${POINTS_RETRY}`}</strong>
                <span>{question.ok}</span>
                <button type="button" className="btn btn--primary" onClick={next}>
                  {ci === CHALLENGES.length - 1 && qi === challenge.questions.length - 1 ? 'Ver resultados' : 'Continuar'} <ArrowRight />
                </button>
              </>
            )}
            {!solved && picked.length > 0 && (
              <>
                <strong>Todavía no.</strong>
                <span>{question.bad.split('.')[0]}… ¡Inténtalo de nuevo!</span>
              </>
            )}
          </div>
        </div>
      )}

      {phase === 'end' && (
        <div className="mission__end">
          <Trophy className="mission__trophy" />
          <span className="kicker">Misión cumplida</span>
          <h2>{medal.title}</h2>
          <p>{medal.text}</p>
          <div className="mission__stats">
            <div>
              <b>{score}</b>
              <span>puntos</span>
            </div>
            <div>
              <b>
                {correctCount}/{TOTAL_Q}
              </b>
              <span>a la primera</span>
            </div>
            <div>
              <b>{CHALLENGES.length}</b>
              <span>retos</span>
            </div>
          </div>
          <button type="button" className="btn btn--lg" onClick={restart}>
            <RotateCcw /> Jugar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}
