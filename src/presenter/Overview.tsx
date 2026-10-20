import type { CSSProperties } from 'react';
import { MOMENTS, SCREENS } from '../data/workshop';
import { Modal } from '../components/ui';

export function Overview({ currentId, onPick, onClose }: { currentId: string; onPick: (id: string) => void; onClose: () => void }) {
  const intro = SCREENS.filter((s) => s.moment === 'm0');
  return (
    <Modal onClose={onClose} label="Vista general del taller">
      <div className="overview">
        <h2>Vista general</h2>
        <div className="overview__cols">
          <div className="overview__col" style={{ '--accent': 'var(--text-2)' } as CSSProperties}>
            <span className="overview__head">Inicio</span>
            {intro.map((s) => (
              <Item key={s.id} id={s.id} title={s.title} active={s.id === currentId} onPick={onPick} />
            ))}
          </div>
          {MOMENTS.map((m) => (
            <div key={m.id} className="overview__col" style={{ '--accent': m.accent } as CSSProperties}>
              <span className="overview__head">
                {m.index}. {m.title} <em>{m.minutes} min</em>
              </span>
              {SCREENS.filter((s) => s.moment === m.id).map((s) => (
                <Item key={s.id} id={s.id} title={s.title} active={s.id === currentId} onPick={onPick} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function Item({ id, title, active, onPick }: { id: string; title: string; active: boolean; onPick: (id: string) => void }) {
  const n = SCREENS.findIndex((s) => s.id === id) + 1;
  return (
    <button type="button" className={`overview__item ${active ? 'is-active' : ''}`} onClick={() => onPick(id)}>
      <span>{String(n).padStart(2, '0')}</span>
      {title}
    </button>
  );
}
