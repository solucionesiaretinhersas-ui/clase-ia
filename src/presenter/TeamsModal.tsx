import { useMemo, useState, type FormEvent } from 'react';
import { Plus, RotateCcw, Shuffle, Users } from 'lucide-react';
import { Modal } from '../components/ui';
import { Scoreboard } from '../components/Scoreboard';
import { useWorkshop } from '../data/workshops';
import { sfx } from '../lib/sfx';
import { LIVE_SYNC_AVAILABLE, useParticipants, useSessionCode } from '../lib/sync';
import { useTeams, type TeamId } from '../lib/teams';

/** Divide el salón en dos equipos con los docentes registrados (y los nombres añadidos a mano). */
export function TeamsModal({ onClose }: { onClose: () => void }) {
  const ws = useWorkshop();
  const { code } = useSessionCode();
  const registered = useParticipants(LIVE_SYNC_AVAILABLE ? code : '', ws.audience);
  const { teams, update, split, resetScores } = useTeams();
  const [name, setName] = useState('');

  const everyone = useMemo(() => {
    const seen = new Set<string>();
    return [...registered.map((p) => p.name), ...teams.manual].filter((n) => {
      const k = n.trim().toLowerCase();
      if (!k || seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, [registered, teams.manual]);

  const members = (t: TeamId) => everyone.filter((n) => teams.assign[n] === t);
  const unassigned = everyone.filter((n) => !teams.assign[n]);

  const move = (n: string) => update((c) => ({ assign: { ...c.assign, [n]: c.assign[n] === 'a' ? 'b' : 'a' } }));
  const add = (e: FormEvent) => {
    e.preventDefault();
    const v = name.trim().slice(0, 40);
    if (!v) return;
    update((c) => ({ manual: [...c.manual, v] }));
    setName('');
  };

  return (
    <Modal onClose={onClose} label="Equipos">
      <div className="teams">
        <header>
          <span className="kicker">Dinámica de equipos</span>
          <h2>Dividir el salón en dos equipos</h2>
        </header>

        <Scoreboard editable />

        <div className="teams__actions">
          <button
            type="button"
            className="btn btn--primary btn--lg"
            onClick={() => {
              split(everyone);
              sfx.whoosh();
            }}
            disabled={everyone.length < 2}
          >
            <Shuffle /> Dividir al azar ({everyone.length})
          </button>
          <button type="button" className="btn btn--lg" onClick={resetScores}>
            <RotateCcw /> Reiniciar puntajes
          </button>
        </div>

        <div className="teams__cols">
          {(['a', 'b'] as TeamId[]).map((t) => (
            <section key={t} className={`teams__col teams__col--${t}`}>
              <input
                className="input teams__name"
                value={t === 'a' ? teams.aName : teams.bName}
                onChange={(e) => update(t === 'a' ? { aName: e.target.value.slice(0, 24) } : { bName: e.target.value.slice(0, 24) })}
                aria-label={`Nombre del equipo ${t === 'a' ? 1 : 2}`}
              />
              <h3>
                <Users /> {members(t).length}
              </h3>
              <ul>
                {members(t).map((n) => (
                  <li key={n}>
                    <button type="button" onClick={() => move(n)} title="Pasar al otro equipo">
                      {n}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {unassigned.length > 0 && (
          <p className="note-muted">
            Sin equipo: {unassigned.join(', ')}. Pulsa “Dividir al azar” para repartirlos.
          </p>
        )}

        <form className="wall-screen__add" onSubmit={add}>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Añadir un nombre a mano" maxLength={40} aria-label="Añadir un nombre" />
          <button type="submit" className="btn btn--icon btn--primary" disabled={!name.trim()} aria-label="Añadir nombre">
            <Plus />
          </button>
        </form>
      </div>
    </Modal>
  );
}
