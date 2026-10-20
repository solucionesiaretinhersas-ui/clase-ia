import { Clock, Flag, Keyboard, ListChecks, MessageSquareText, RotateCcw, Smartphone, Users, X } from 'lucide-react';
import { MOMENTS, momentOf, type ScreenMeta } from '../data/workshop';
import { resetWorkshop } from '../lib/storage';
import { fmt } from '../components/ui';
import { elapsedOf, useTimers } from './timers';

const SHORTCUTS: [string, string][] = [
  ['→ / Espacio', 'Siguiente'],
  ['←', 'Anterior'],
  ['Inicio', 'Portada'],
  ['F', 'Pantalla completa'],
  ['N', 'Notas'],
  ['G', 'Vista general'],
  ['T', 'Cronómetro'],
  ['D', 'Pizarra'],
  ['J', 'QR de ingreso'],
  ['R', 'Ruleta'],
];

export function FacilitatorDrawer({ screen, onClose }: { screen: ScreenMeta; onClose: () => void }) {
  const moment = momentOf(screen.moment);
  const { timers, reset, resetAll } = useTimers();
  const n = screen.notes;

  return (
    <aside className="drawer" aria-label="Notas del facilitador">
      <div className="drawer__head">
        <div>
          <span className="kicker">Guía del facilitador</span>
          <h3>{screen.title}</h3>
        </div>
        <button type="button" className="btn btn--icon btn--ghost" onClick={onClose} aria-label="Cerrar notas">
          <X />
        </button>
      </div>

      <div className="drawer__meta">
        <span className="chip">
          <Clock /> {n.minutes} min sugeridos
        </span>
        {moment && <span className="chip">Momento {moment.index} · {moment.minutes} min</span>}
      </div>

      <section className="drawer__block">
        <h4>
          <Flag /> Objetivo
        </h4>
        <p>{n.objective}</p>
      </section>
      <section className="drawer__block">
        <h4>
          <MessageSquareText /> Idea para decir
        </h4>
        <p>{n.explanation}</p>
      </section>
      <section className="drawer__block">
        <h4>
          <ListChecks /> Instrucciones
        </h4>
        <ol>
          {n.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>
      <section className="drawer__block">
        <h4>
          <Smartphone /> En el celular de los docentes
        </h4>
        <p>{n.participant}</p>
      </section>
      {n.activity && (
        <section className="drawer__block drawer__block--accent">
          <h4>
            <Users /> Actividad participativa
          </h4>
          <p>{n.activity}</p>
        </section>
      )}

      <section className="drawer__block">
        <h4>
          <Clock /> Tiempos del taller
        </h4>
        <ul className="drawer__times">
          {MOMENTS.map((m) => {
            const e = elapsedOf(timers[m.id]);
            return (
              <li key={m.id}>
                <span>
                  {m.index}. {m.short}
                </span>
                <span className={e > m.minutes * 60000 ? 'is-over' : ''}>
                  {fmt(e)} / {m.minutes}:00
                </span>
                <button type="button" className="btn btn--ghost btn--icon" aria-label={`Reiniciar cronómetro ${m.short}`} onClick={() => reset(m.id)}>
                  <RotateCcw />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="drawer__block">
        <h4>
          <Keyboard /> Atajos
        </h4>
        <dl className="drawer__keys">
          {SHORTCUTS.map(([k, v]) => (
            <div key={k}>
              <dt>
                <kbd>{k}</kbd>
              </dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <button
        type="button"
        className="btn btn--danger"
        onClick={() => {
          if (window.confirm('¿Preparar un taller nuevo? Se borrarán votos, ideas, tableros, galería, cronómetros, ruleta y pizarra, y se creará un código de sesión nuevo: los celulares empezarán de cero.')) {
            resetWorkshop();
            resetAll();
          }
        }}
      >
        <RotateCcw /> Nuevo taller: limpiar todo
      </button>
    </aside>
  );
}
