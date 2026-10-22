import { Minus, Plus } from 'lucide-react';
import { useTeams, type TeamId } from '../lib/teams';

/** Marcador de los dos equipos. Con `editable` el facilitador puede sumar o restar puntos a mano. */
export function Scoreboard({ editable = false }: { editable?: boolean }) {
  const { teams, addPoints } = useTeams();
  const row = (id: TeamId) => {
    const name = id === 'a' ? teams.aName : teams.bName;
    const score = id === 'a' ? teams.aScore : teams.bScore;
    return (
      <div className={`score score--${id} ${teams.turn === id ? 'is-turn' : ''}`} key={id}>
        <span className="score__name">{name}</span>
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
