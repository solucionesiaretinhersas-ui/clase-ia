import { ExternalLink } from 'lucide-react';
import { Mission } from '../demo/Mission';

const MAP = [
  ['Rol y objetivo', 'Pantalla de introducción'],
  ['Actividades interactivas', 'Tres retos con selección múltiple'],
  ['Retroalimentación inmediata', 'Explicación tras cada respuesta'],
  ['Evaluación final', 'Puntos, progreso y resultados'],
];

export function DemoScreen() {
  return (
    <section className="demo enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">Momento 3 · Recurso de demostración</span>
          <h2 className="h-lg">Esto es lo que vas a poder construir</h2>
        </div>
        <a className="btn btn--lg" href="#/demo" target="_blank" rel="noopener noreferrer">
          Abrir a pantalla completa <ExternalLink />
        </a>
      </header>
      <div className="demo__body">
        <div className="demo__frame glass">
          <Mission embedded />
        </div>
        <aside className="demo__map">
          <h3>Del prompt al recurso</h3>
          <ul>
            {MAP.map(([a, b]) => (
              <li key={a}>
                <b>{a}</b>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
