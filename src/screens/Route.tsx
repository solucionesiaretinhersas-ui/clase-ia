import type { CSSProperties } from 'react';
import { ArrowRight, Hammer, HeartHandshake, Layers, MessagesSquare, ShieldCheck, Smartphone, Telescope } from 'lucide-react';
import { QRCode } from '../components/QRCode';
import { MOMENTS, SCREENS, TOTAL_MINUTES } from '../data/workshop';
import { useSessionCode } from '../lib/sync';
import { internalUrl } from '../lib/urls';
import { usePublicBase } from '../lib/usePublicBase';
import { usePresenter } from '../presenter/context';

const ICONS = [HeartHandshake, Telescope, Layers, Hammer, MessagesSquare, ShieldCheck];
const OUTCOMES = [
  'La IA como copiloto, no reemplazo',
  'Llegar a la sección Build',
  'La estructura de tu clase con ChatGPT',
  'Tu recurso interactivo funcionando',
  'Uno o dos recursos en el tablero',
  'Ética y docencia humanizada',
];

export function Route() {
  const { goTo } = usePresenter();
  const { base, reachable } = usePublicBase();
  const { code } = useSessionCode();
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
            <li key={m.id} className="route__step" style={{ '--accent': m.accent } as CSSProperties}>
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
        <div className="route__follow">
          <QRCode value={internalUrl(base, `/m/vivo?s=${code}`)} size={120} />
          <div>
            <span>
              <Smartphone /> Sigue el taller
            </span>
            <small>{reachable ? 'Escanea y verás en tu celular lo que está pasando en el tablero.' : 'Disponible al abrir la web publicada.'}</small>
          </div>
        </div>
        <strong>Cada docente sale con un recurso educativo interactivo, creado con su criterio.</strong>
        <button type="button" className="btn btn--primary btn--lg" onClick={() => goTo('votacion')}>
          Empezar <ArrowRight />
        </button>
      </div>
    </section>
  );
}
