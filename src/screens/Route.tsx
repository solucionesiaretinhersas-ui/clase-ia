import { joinRoute } from '../data/workshops';
import type { CSSProperties } from 'react';
import { ArrowRight, Hammer, HeartHandshake, Layers, MessagesSquare, ShieldCheck, Smartphone, Telescope } from 'lucide-react';
import { QRCode } from '../components/QRCode';
import { useWorkshop } from '../data/workshops';
import { LIVE_SYNC_AVAILABLE, useParticipants, useSessionCode } from '../lib/sync';
import { internalUrl } from '../lib/urls';
import { usePublicBase } from '../lib/usePublicBase';
import { usePresenter } from '../presenter/context';

const ICONS = [HeartHandshake, Telescope, Layers, Hammer, MessagesSquare, ShieldCheck];

export function Route() {
  const { goTo, openJoin } = usePresenter();
  const ws = useWorkshop();
  const { moments: MOMENTS, screens: SCREENS, total: TOTAL_MINUTES, outcomes: OUTCOMES } = ws;
  const { base, reachable } = usePublicBase();
  const { code } = useSessionCode();
  const people = useParticipants(LIVE_SYNC_AVAILABLE ? code : '', ws.audience);
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
            <li key={m.id} className="route__step" style={{ '--accent': m.accent, '--i': i } as CSSProperties}>
              <button type="button" onClick={() => first && goTo(first.id)}>
                <span className="route__bar">
                  <span className="route__min">{m.minutes}′</span>
                </span>
                <span className="route__icon">
                  <Icon />
                </span>
                <span className="route__num">0{m.index}</span>
                <strong>{m.title}</strong>
                <span className="route__out">{ws.audience === 'docente' && <i>Te llevas: </i>}{OUTCOMES[i]}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="route__goal">
        <div className="route__follow">
          <QRCode value={internalUrl(base, joinRoute(code))} size={120} />
          <div>
            <span>
              <Smartphone /> Únete con tu nombre y grado
            </span>
            <small>{reachable ? 'Un solo QR: escribe tu nombre y grado y recibe aquí todos los enlaces del taller.' : 'Disponible al abrir la web publicada.'}</small>
            {LIVE_SYNC_AVAILABLE && <small><b>{people.length}</b> {ws.audience === 'docente' ? 'docentes' : 'estudiantes'} conectados</small>}
            <button type="button" className="btn" onClick={openJoin}>Ampliar QR</button>
          </div>
        </div>
        <strong>{ws.audience === 'docente' ? 'Cada docente sale con un recurso educativo interactivo, creado con su criterio.' : 'Cada estudiante sale con una aplicación propia, creada con inteligencia artificial.'}</strong>
        <button type="button" className="btn btn--primary btn--lg" onClick={() => goTo(SCREENS[2].id)}>
          Empezar <ArrowRight />
        </button>
      </div>
    </section>
  );
}
