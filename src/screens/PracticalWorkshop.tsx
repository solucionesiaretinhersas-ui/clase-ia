import { Check, ExternalLink, HeartHandshake } from 'lucide-react';
import { CopyButton } from '../components/ui';
import { REFINEMENTS } from '../data/prompts';
import { usePersistentState } from '../lib/storage';
import { AI_STUDIO_URL, CHATGPT_URL } from '../lib/urls';
import { usePresenter } from '../presenter/context';

const PHASES = [
  { title: 'Estructura', min: 5, text: 'Ten lista la estructura de tu clase que te dio ChatGPT (Prompt 1).' },
  { title: 'Genera', min: 8, text: 'En Build, pega el Prompt 2 con tu estructura. Pide siempre simuladores y actividades para el tablero.' },
  { title: 'Humaniza', min: 7, text: 'Agrega lo que solo tú sabes: ejemplos de tu comunidad, tu voz, tu criterio.' },
  { title: 'Perfecciona', min: 10, text: 'Pruébalo como estudiante y pide mejoras, una a la vez, con los prompts de abajo.' },
];

export function PracticalWorkshop() {
  const [phase, setPhase] = usePersistentState('taller:phase', 0);
  const { goTo } = usePresenter();

  return (
    <section className="practice enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">Momento 4 · Crear y perfeccionar</span>
          <h2 className="h-xl">Tu turno: crea tu recurso</h2>
        </div>
        <div className="practice__links">
          <button type="button" className="btn btn--lg" onClick={() => goTo('laboratorio')}>
            Mis prompts
          </button>
          <a className="btn btn--lg" href={CHATGPT_URL} target="_blank" rel="noopener noreferrer">
            ChatGPT <ExternalLink />
          </a>
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
          <b>Esta es la parte humana.</b> La IA no conoce a tus estudiantes ni tu comunidad. Describe cosas puntuales de tu contexto y cómo quieres que se use el recurso: tú le das el sentido.
        </p>
      </aside>

      <div className="refine">
        <h3>Prompts para perfeccionar, listos para copiar</h3>
        <div className="refine__grid">
          {REFINEMENTS.map((r) => (
            <article key={r.title} className="refine__card glass">
              <strong>{r.title}</strong>
              <p>{r.prompt}</p>
              <CopyButton text={r.prompt} />
            </article>
          ))}
        </div>
      </div>
      <p className="note-muted">Reemplaza lo que aparece entre [CORCHETES] antes de enviar. Revisa siempre el contenido generado antes de usarlo con estudiantes.</p>
    </section>
  );
}
