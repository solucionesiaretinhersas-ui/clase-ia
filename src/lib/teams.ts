import { usePersistentState } from './storage';

export type TeamId = 'a' | 'b';

export interface TeamsState {
  aName: string;
  bName: string;
  aScore: number;
  bScore: number;
  /** De quién es el turno en los juegos */
  turn: TeamId;
  /** Integrantes: nombre → equipo */
  assign: Record<string, TeamId>;
  /** Nombres añadidos a mano */
  manual: string[];
}

export const DEFAULT_TEAMS: TeamsState = {
  aName: 'Equipo Luz',
  bName: 'Equipo Chispa',
  aScore: 0,
  bScore: 0,
  turn: 'a',
  assign: {},
  manual: [],
};

export function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Dos equipos con puntaje y turno, compartidos por los juegos de la pizarra. */
export function useTeams() {
  const [stored, set] = usePersistentState<TeamsState>('teams:data', DEFAULT_TEAMS);
  const teams: TeamsState = { ...DEFAULT_TEAMS, ...stored };

  const update = (patch: Partial<TeamsState> | ((t: TeamsState) => Partial<TeamsState>)) =>
    set((prev) => {
      const cur = { ...DEFAULT_TEAMS, ...prev };
      return { ...cur, ...(typeof patch === 'function' ? patch(cur) : patch) };
    });

  return {
    teams,
    update,
    addPoints: (t: TeamId, n: number) => update((c) => (t === 'a' ? { aScore: Math.max(0, c.aScore + n) } : { bScore: Math.max(0, c.bScore + n) })),
    switchTurn: () => update((c) => ({ turn: c.turn === 'a' ? 'b' : 'a' })),
    resetScores: () => update({ aScore: 0, bScore: 0, turn: 'a' }),
    /** Reparte al azar y de forma equilibrada a las personas indicadas. */
    split: (names: string[]) => {
      const assign: Record<string, TeamId> = {};
      shuffle(names).forEach((n, i) => (assign[n] = i % 2 === 0 ? 'a' : 'b'));
      update({ assign });
    },
  };
}
