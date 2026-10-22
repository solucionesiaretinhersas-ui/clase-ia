import { useState, type CSSProperties } from 'react';
import { Art, type ArtName } from '../components/MuralArt';
import { sfx } from '../lib/sfx';

interface Uso {
  art: ArtName;
  title: string;
  text: string;
  example: string;
  color: string;
}

const USOS: Uso[] = [
  { art: 'book', title: 'Clases completas', text: 'Un aula con inicio, exploración, práctica y cierre, lista para proyectar y recorrer con tus estudiantes.', example: 'Ej.: la unidad de fracciones, con sus actividades y su evaluación.', color: 'var(--blue)' },
  { art: 'rocket', title: 'Refuerzo y nivelación', text: 'Versiones del mismo tema para quienes necesitan más práctica o quieren ir más allá.', example: 'Ej.: un aula de refuerzo con pistas y reintentos.', color: 'var(--violet)' },
  { art: 'planet', title: 'Simuladores y laboratorios', text: 'Experimentos que no caben en el salón: cambiar una variable y ver qué pasa.', example: 'Ej.: temperatura y ciclo del agua, o el sistema solar.', color: 'var(--cyan)' },
  { art: 'trophy', title: 'Evaluación que enseña', text: 'Preguntas que explican cada respuesta y dejan volver a intentar, con resumen para ti.', example: 'Ej.: un quiz por periodos con retroalimentación inmediata.', color: 'var(--amber)' },
  { art: 'bulb', title: 'Proyectos y retos', text: 'Misiones por equipos que conectan el tema con problemas reales de tu comunidad.', example: 'Ej.: “Cuida nuestro río”: investigar, proponer y presentar.', color: 'var(--mint)' },
  { art: 'heart', title: 'Familias y comunidad', text: 'Guías sencillas para que las familias acompañen el aprendizaje en casa.', example: 'Ej.: una mini aula para repasar con sus hijos en el celular.', color: 'var(--rose)' },
];

/** Cierre del facilitador: para qué se puede usar lo que se creó, con tarjetas ilustradas. */
export function Usos() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="usos enter">
      <header className="screen-head">
        <span className="kicker">Etapa 6 · Llévalo a tu aula</span>
        <h2 className="h-xl">
          ¿Para qué lo <span className="grad-text">puedes usar</span>?
        </h2>
      </header>
      <ul className="usos__grid">
        {USOS.map((u, i) => (
          <li key={u.title} style={{ '--c': u.color, '--i': i } as CSSProperties}>
            <button
              type="button"
              className={`uso ${open === i ? 'is-open' : ''}`}
              onClick={() => {
                setOpen(open === i ? null : i);
                sfx.pop();
              }}
              aria-expanded={open === i}
            >
              <Art name={u.art} className="uso__art" />
              <strong>{u.title}</strong>
              <p>{u.text}</p>
              {open === i && <small>{u.example}</small>}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
