import { useState } from 'react';
import { Check, ExternalLink, HeartHandshake, ScanSearch, Sparkles } from 'lucide-react';
import { CheckinBars } from '../components/CheckinBars';
import { Lupa } from '../components/Lupa';
import { CopyButton } from '../components/ui';
import { REFINEMENTS } from '../data/prompts';
import { useWorkshop } from '../data/workshops';
import { usePersistentState } from '../lib/storage';
import { LIVE_SYNC_AVAILABLE, useLiveResponses, useParticipants, useSessionCode } from '../lib/sync';
import { AI_STUDIO_URL, CHATGPT_URL } from '../lib/urls';
import { useAnnounce } from '../presenter/announce';
import { usePresenter } from '../presenter/context';

const PHASES = [
  { title: 'Prompt listo', min: 4, text: 'Ten tu prompt ROCAS revisado en ChatGPT (Prompt 1) y la estructura de tu clase.' },
  { title: 'Primera versión', min: 6, text: 'En Build, pega el Prompt 2 con tu estructura. Pide siempre simuladores y actividades para el tablero.' },
  { title: 'Prueba con la lupa', min: 6, text: 'Úsalo como estudiante y revísalo con la lupa pedagógica: ¿enseña lo que quieres, como lo quieres?' },
  { title: 'Mejora y vuelve a probar', min: 6, text: 'Pide cambios, uno a la vez, con los prompts de abajo, y vuelve a probar.' },
];

const CHECK = ['¡Listo!', 'Voy en proceso', 'Necesito ayuda'];

export function PracticalWorkshop() {
  const ws = useWorkshop();
  const [phase, setPhase] = usePersistentState('taller:phase', 0);
  const [tab, setTab] = useState<'mejora' | 'lupa'>('mejora');
  const [ticks] = usePersistentState<number[]>('taller:lupa', []);
  const { goTo } = usePresenter();

  // Avance en vivo: cada docente marca desde su celular cómo va en la fase actual.
  const { code } = useSessionCode();
  const people = useParticipants(LIVE_SYNC_AVAILABLE ? code : '', ws.audience);
  const live = useLiveResponses(LIVE_SYNC_AVAILABLE ? code : '', `taller-${phase}`);
  const counts = CHECK.map((_, i) => live.responses.filter((r) => r.value === String(i)).length);
  useAnnounce('taller', { key: `taller-${phase}`, kind: 'choice', prompt: `Fase ${phase + 1}: ${PHASES[phase].title}. ¿Cómo vas?`, options: CHECK, open: true });

  return (
    <section className="practice enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">Etapa 4 · Construir y probar</span>
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

      <div className="practice__live">
        {LIVE_SYNC_AVAILABLE ? (
          <CheckinBars title={`Fase ${phase + 1} · ${PHASES[phase].title}`} labels={CHECK} counts={counts} total={people.length} />
        ) : (
          <p className="note-muted">Sin sincronización: pregunta al grupo con la mano en alto cómo va cada fase.</p>
        )}
        <aside className="human-note" role="note">
          <HeartHandshake />
          <p>
            <b>Esta es la parte humana.</b> La IA no conoce a tus estudiantes ni tu comunidad. Describe cosas puntuales de tu contexto: tú le das el sentido.
          </p>
        </aside>
      </div>

      <div className="seg seg--small" role="tablist" aria-label="Herramientas del taller">
        <button type="button" role="tab" aria-selected={tab === 'mejora'} className={`seg__btn ${tab === 'mejora' ? 'is-on' : ''}`} onClick={() => setTab('mejora')}>
          <Sparkles /> Prompts para perfeccionar
        </button>
        <button type="button" role="tab" aria-selected={tab === 'lupa'} className={`seg__btn ${tab === 'lupa' ? 'is-on' : ''}`} onClick={() => setTab('lupa')}>
          <ScanSearch /> Lupa pedagógica <b>{ticks.length}/7</b>
        </button>
      </div>

      {tab === 'mejora' ? (
        <div className="refine">
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
      ) : (
        <Lupa />
      )}
      <p className="note-muted">Reemplaza lo que aparece entre [CORCHETES] antes de enviar. Revisa siempre el contenido generado antes de usarlo con estudiantes.</p>
    </section>
  );
}
