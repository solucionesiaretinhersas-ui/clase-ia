import { useEffect, type CSSProperties } from 'react';
import { ArrowRight, Bot, ClipboardList, Eye, Hammer, MessageSquare, Play, RefreshCw, UserRound, type LucideIcon } from 'lucide-react';
import { sfx } from '../lib/sfx';
import { usePersistentState } from '../lib/storage';

type Who = 'tu' | 'chatgpt' | 'studio';

interface Node {
  icon: LucideIcon;
  title: string;
  text: string;
  who: Who;
}

const WHO: Record<Who, { label: string; color: string }> = {
  tu: { label: 'Tú decides', color: 'var(--amber)' },
  chatgpt: { label: 'ChatGPT', color: 'var(--mint)' },
  studio: { label: 'Google AI Studio', color: 'var(--blue)' },
};

const NODES: Node[] = [
  { icon: UserRound, title: 'Piensas tu clase', text: 'Qué tema, para qué grado y qué quieres que tus estudiantes logren.', who: 'tu' },
  { icon: ClipboardList, title: 'Armas tu mensaje con ROCAS', text: 'Rol, objetivo, contexto, acción y salida, con lo que solo tú sabes de tu grupo.', who: 'tu' },
  { icon: MessageSquare, title: 'ChatGPT te devuelve el prompt', text: 'Le pides que diseñe tu aula y te entregue el prompt listo para Google AI Studio.', who: 'chatgpt' },
  { icon: Bot, title: 'AI Studio construye tu aula', text: 'Pegas el prompt en Build y Gemini genera tu aula interactiva, con todos los momentos de la clase.', who: 'studio' },
  { icon: Play, title: 'La recorres como estudiante', text: 'Contestas, te equivocas a propósito y revisas con la lupa pedagógica si enseña lo que quieres.', who: 'tu' },
  { icon: RefreshCw, title: 'Pides mejoras y decides', text: 'Un cambio a la vez, hasta que sirva para tu clase. La decisión final es tuya.', who: 'studio' },
];

/** Etapa 4: del prompt al recurso, con cada herramienta en su función. Se revela paso a paso. */
export function FlowScreen() {
  const [n, setN] = usePersistentState('flujo:n', 1);

  const reveal = (to: number) => {
    setN(Math.max(1, Math.min(NODES.length, to)));
    sfx.pop();
  };
  useEffect(() => {
    if (n === NODES.length) sfx.ok();
  }, [n]);

  return (
    <section className="flow enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">Etapa 4 · Tu aula, paso a paso</span>
          <h2 className="h-lg">
            De tu idea a tu <span className="grad-text">aula lista</span>
          </h2>
        </div>
        <div className="flow__ctl">
          <button type="button" className="btn" onClick={() => reveal(n - 1)} disabled={n <= 1}>
            Ocultar
          </button>
          <button type="button" className="btn btn--primary btn--lg" onClick={() => reveal(n + 1)} disabled={n >= NODES.length}>
            Revelar siguiente <ArrowRight />
          </button>
          <button type="button" className="btn" onClick={() => reveal(NODES.length)}>
            Mostrar todo
          </button>
        </div>
      </header>

      <ul className="flow__legend" aria-label="Quién hace qué">
        {(Object.keys(WHO) as Who[]).map((w) => (
          <li key={w} style={{ '--c': WHO[w].color } as CSSProperties}>
            <i />
            {WHO[w].label}
            <small>{w === 'tu' ? 'criterio y decisiones' : w === 'chatgpt' ? 'formular y perfeccionar el prompt' : 'explorar el desarrollo del recurso'}</small>
          </li>
        ))}
      </ul>

      <ol className="flow__path">
        {NODES.map((x, i) => {
          const Icon = x.icon;
          const shown = i < n;
          return (
            <li key={x.title} className={`flow__node ${shown ? 'is-shown' : ''} ${i === n - 1 ? 'is-last' : ''}`} style={{ '--c': WHO[x.who].color } as CSSProperties}>
              <button type="button" onClick={() => reveal(i + 1)} disabled={!shown && i > n} aria-label={`Paso ${i + 1}: ${x.title}`}>
                <span className="flow__num">{i + 1}</span>
                <span className="flow__ico">{shown ? <Icon /> : <Eye />}</span>
                <strong>{shown ? x.title : '¿…?'}</strong>
                {shown && <small>{x.text}</small>}
                {shown && <em>{WHO[x.who].label}</em>}
              </button>
            </li>
          );
        })}
      </ol>

      {n >= NODES.length && (
        <p className="flow__end">
          <Hammer /> Las herramientas ayudan; el criterio pedagógico y la decisión final son del docente.
        </p>
      )}
    </section>
  );
}
