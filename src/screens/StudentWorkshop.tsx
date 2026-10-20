import { Check, ExternalLink, HeartHandshake } from 'lucide-react';
import { CopyButton } from '../components/ui';
import { STUDENT_REFINEMENTS } from '../data/prompts';
import { usePersistentState } from '../lib/storage';
import { AI_STUDIO_URL } from '../lib/urls';
import { usePresenter } from '../presenter/context';

const PHASES = [
  { title: 'Idea y prompt', min: 5, text: 'Ten listo tu prompt: qué es, para quién, cómo funciona y cómo se ve.' },
  { title: 'Genera', min: 6, text: 'Pégalo en Build de AI Studio y espera la primera versión de tu app.' },
  { title: 'Prueba y mejora', min: 7, text: 'Úsala como otro usuario. Pide un cambio a la vez con los prompts de abajo.' },
  { title: 'Potencia con IA', min: 5, text: 'Agrega una función con inteligencia artificial dentro de tu app.' },
];

export function StudentWorkshop() {
  const [phase, setPhase] = usePersistentState('estudiante:phase', 0);
  const { goTo } = usePresenter();
  return (
    <section className="practice enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">Momento 4 · Crea y mejora</span>
          <h2 className="h-xl">Tu turno: crea tu app</h2>
        </div>
        <div className="practice__links">
          <button type="button" className="btn btn--lg" onClick={() => goTo('e-lab')}>
            Mi prompt
          </button>
          <a className="btn btn--primary btn--lg" href={AI_STUDIO_URL} target="_blank" rel="noopener noreferrer">
            AI Studio <ExternalLink />
          </a>
        </div>
      </header>

      <ol className="phases">
        {PHASES.map((p, i) => (
          <li key={p.title}>
            <button type="button" className={`phase ${i === phase ? 'is-active' : ''} ${i < phase ? 'is-done' : ''}`} onClick={() => setPhase(i)}>
              <span className="phase__num">{i < phase ? <Check /> : i + 1}</span>
              <strong>{p.title}</strong>
              <span className="phase__min">~{p.min} min</span>
              {i === phase && <span className="phase__text">{p.text}</span>}
            </button>
          </li>
        ))}
      </ol>

      <aside className="human-note" role="note">
        <HeartHandshake />
        <p>
          <b>Tú diriges.</b> La IA escribe el código, pero las ideas, los cambios y las decisiones son tuyos. Pruébala siempre y pregúntate si de verdad hace lo que querías.
        </p>
      </aside>

      <div className="refine">
        <h3>Prompts para mejorar tu app, listos para copiar</h3>
        <div className="refine__grid">
          {STUDENT_REFINEMENTS.map((r) => (
            <article key={r.title} className="refine__card glass">
              <strong>{r.title}</strong>
              <p>{r.prompt}</p>
              <CopyButton text={r.prompt} />
            </article>
          ))}
        </div>
      </div>
      <p className="note-muted">Reemplaza lo que aparece entre [CORCHETES]. No compartas datos personales en tu app ni en los prompts.</p>
    </section>
  );
}
