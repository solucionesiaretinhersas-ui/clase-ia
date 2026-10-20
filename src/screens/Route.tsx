import type { CSSProperties } from 'react';
import { ArrowRight, Flame, Hammer, Layers, MessagesSquare, Telescope } from 'lucide-react';
import { MOMENTS, SCREENS, TOTAL_MINUTES } from '../data/workshop';
import { usePresenter } from '../presenter/context';

const ICONS = [Flame, Telescope, Layers, Hammer, MessagesSquare];
const OUTCOMES = [
  'Reconocer qué hace interactiva una clase',
  'Llegar a la sección Build',
  'Un prompt listo para tu tema',
  'Tu recurso funcionando',
  'Un compromiso para el aula',
];

export function Route() {
  const { goTo } = usePresenter();
  return (
    <section className="route enter">
      <header className="screen-head">
        <span className="kicker">La ruta de hoy</span>
        <h2 className="h-xl">
          {TOTAL_MINUTES} minutos para pasar <br />
          de <span className="grad-text">una idea</span> a <span className="grad-text">una experiencia</span>
        </h2>
      </header>

      <ol className="route__line">
        {MOMENTS.map((m, i) => {
          const Icon = ICONS[i];
          const first = SCREENS.find((s) => s.moment === m.id);
          return (
            <li key={m.id} className="route__step" style={{ '--accent': m.accent, flexGrow: m.minutes } as CSSProperties}>
              <button type="button" onClick={() => first && goTo(first.id)}>
                <span className="route__bar">
                  <span className="route__min">{m.minutes}′</span>
                </span>
                <span className="route__icon">
                  <Icon />
                </span>
                <span className="route__num">0{m.index}</span>
                <strong>{m.title}</strong>
                <span className="route__out">{OUTCOMES[i]}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="route__goal">
        <span>Producto final</span>
        <strong>Cada docente sale con un recurso educativo interactivo creado por sí mismo.</strong>
        <button type="button" className="btn btn--primary btn--lg" onClick={() => goTo('inspiracion')}>
          Empezar <ArrowRight />
        </button>
      </div>
    </section>
  );
}
