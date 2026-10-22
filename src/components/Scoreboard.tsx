import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useTeams, type TeamId } from '../lib/teams';

/** Marcador de los dos equipos. Con `editable` el facilitador puede sumar o restar puntos a mano. */
export function Scoreboard({ editable = false }: { editable?: boolean }) {
  const { teams, addPoints, update } = useTeams();
  const [editing, setEditing] = useState<TeamId | null>(null);
  const [draft, setDraft] = useState('');
  const save = (id: TeamId) => {
    const v = draft.trim().slice(0, 24);
    if (v) update(id === 'a' ? { aName: v } : { bName: v });
    setEditing(null);
  };
  const row = (id: TeamId) => {
    const name = id === 'a' ? teams.aName : teams.bName;
    const score = id === 'a' ? teams.aScore : teams.bScore;
    return (
      <div className={`score score--${id} ${teams.turn === id ? 'is-turn' : ''}`} key={id}>
        {editing === id ? (
          <input
            className="score__edit"
            autoFocus
            value={draft}
            maxLength={24}
            aria-label={`Nuevo nombre para ${name}`}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => save(id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save(id);
              if (e.key === 'Escape') setEditing(null);
              e.stopPropagation();
            }}
          />
        ) : (
          <span
            className="score__name"
            title="Doble clic para cambiar el nombre"
            onDoubleClick={() => {
              setDraft(name);
              setEditing(id);
            }}
          >
            {name}
          </span>
        )}
        <b key={score} className="score__num">
          {score}
        </b>
        {editable && (
          <span className="score__btns">
            <button type="button" onClick={() => addPoints(id, -5)} aria-label={`Restar 5 a ${name}`}>
              <Minus />
            </button>
            <button type="button" onClick={() => addPoints(id, 5)} aria-label={`Sumar 5 a ${name}`}>
              <Plus />
            </button>
          </span>
        )}
        {teams.turn === id && <i className="score__turn">Su turno</i>}
      </div>
    );
  };
  return (
    <div className="scoreboard" role="group" aria-label="Marcador de equipos">
      {row('a')}
      <span className="scoreboard__vs">vs</span>
      {row('b')}
    </div>
  );
}
