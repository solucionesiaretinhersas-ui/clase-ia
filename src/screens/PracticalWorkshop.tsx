import { Check, ExternalLink } from 'lucide-react';
import { CopyButton } from '../components/ui';
import { REFINEMENTS } from '../data/prompts';
import { usePersistentState } from '../lib/storage';
import { AI_STUDIO_URL } from '../lib/urls';
import { usePresenter } from '../presenter/context';

const PHASES = [
  { title: 'Preparar', min: 5, text: 'Personaliza tu prompt en el laboratorio: tema, grado, área y objetivo.' },
  { title: 'Generar', min: 8, text: 'Pégalo en Build y espera la primera versión de tu recurso.' },
  { title: 'Probar', min: 7, text: 'Úsalo como estudiante. Anota qué falla o qué falta.' },
  { title: 'Mejorar', min: 10, text: 'Pide cambios concretos, uno a la vez, con los prompts de abajo.' },
];

export function PracticalWorkshop() {
  const [phase, setPhase] = usePersistentState('taller:phase', 0);
  const { goTo } = usePresenter();

  return (
    <section className="practice enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">Momento 4 · Crear</span>
          <h2 className="h-xl">Tu turno: crea tu recurso</h2>
        </div>
        <div className="practice__links">
          <button type="button" className="btn btn--lg" onClick={() => goTo('laboratorio')}>
            Laboratorio de prompts
          </button>
          <a className="btn btn--primary btn--lg" href={AI_STUDIO_URL} target="_blank" rel="noopener noreferrer">
            Abrir AI Studio <ExternalLink />
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

      <div className="refine">
        <h3>Prompts de mejora listos para copiar</h3>
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
