import { ArrowRight, Eye, Hand, MousePointerClick, RefreshCcw, Route as RouteIcon } from 'lucide-react';

export function Inspiration() {
  return (
    <section className="inspo enter">
      <span className="kicker">Momento 1 · Activación</span>
      <h2 className="inspo__q">
        ¿Y si tu clase <br />
        <span className="grad-text">se pudiera jugar?</span>
      </h2>

      <div className="inspo__shift">
        <div className="inspo__side inspo__side--before">
          <span className="inspo__tag">Mostrar</span>
          <div className="inspo__slides" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <ul>
            <li>
              <Eye /> El estudiante observa
            </li>
            <li>
              <RouteIcon /> Un solo camino
            </li>
          </ul>
        </div>

        <div className="inspo__arrow" aria-hidden="true">
          <ArrowRight />
        </div>

        <div className="inspo__side inspo__side--after">
          <span className="inspo__tag">Experimentar</span>
          <div className="inspo__app" aria-hidden="true">
            <span className="inspo__app-bar" />
            <span className="inspo__app-opt is-ok" />
            <span className="inspo__app-opt" />
            <span className="inspo__app-opt" />
          </div>
          <ul>
            <li>
              <MousePointerClick /> El estudiante decide
            </li>
            <li>
              <RefreshCcw /> Se equivoca y lo intenta otra vez
            </li>
            <li>
              <Hand /> Recibe retroalimentación al instante
            </li>
          </ul>
        </div>
      </div>

      <p className="inspo__prompt">¿Qué recurso has querido crear y nunca has tenido tiempo de hacer?</p>
    </section>
  );
}
