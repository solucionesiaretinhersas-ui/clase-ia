import { useEffect, type CSSProperties } from 'react';
import { ArrowRight, Bot, ClipboardList, Eye, Hammer, MessageSquare, Play, RefreshCw, Search, Sparkles, UserRound, type LucideIcon } from 'lucide-react';
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
  { icon: UserRound, title: 'Identificas una necesidad', text: 'Un tema que cuesta, un material que falta, una actividad que quieres mejorar.', who: 'tu' },
  { icon: ClipboardList, title: 'Construyes el prompt con ROCAS', text: 'Rol, objetivo, contexto, acción y solución, con lo que solo tú sabes de tu grupo.', who: 'tu' },
  { icon: MessageSquare, title: 'Lo revisas y mejoras en ChatGPT', text: 'Pides que lo evalúe, detecte vacíos y lo deje más claro y completo.', who: 'chatgpt' },
  { icon: Bot, title: 'Llevas las instrucciones a AI Studio', text: 'Usas la instrucción ya afinada para explorar un recurso o prototipo interactivo (en Build, si está disponible en tu cuenta).', who: 'studio' },
  { icon: Sparkles, title: 'Obtienes una primera versión', text: 'Es un borrador funcional, no un producto terminado.', who: 'studio' },
  { icon: Play, title: 'Lo pruebas como estudiante', text: 'Aciertas, te equivocas a propósito y miras cómo responde.', who: 'tu' },
  { icon: Search, title: 'Detectas errores', text: 'Pedagógicos, visuales o funcionales. Aquí ayuda la lupa pedagógica.', who: 'tu' },
  { icon: RefreshCw, title: 'Pides mejoras y vuelves a probar', text: 'Un cambio a la vez, y se repite el ciclo hasta que sirva para tu clase.', who: 'studio' },
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
          <span className="kicker">Etapa 4 · Construir un recurso</span>
          <h2 className="h-lg">
            De la necesidad al <span className="grad-text">recurso probado</span>
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
