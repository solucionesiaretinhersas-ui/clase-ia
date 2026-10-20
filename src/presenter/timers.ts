import { usePersistentState } from '../lib/storage';
import type { MomentId } from '../data/workshop';

export interface TimerState {
  elapsed: number;
  since: number | null;
}

type Timers = Partial<Record<MomentId, TimerState>>;

export function elapsedOf(t: TimerState | undefined, now = Date.now()) {
  if (!t) return 0;
  return t.elapsed + (t.since ? now - t.since : 0);
}

/** Cronómetros por momento, persistentes: sobreviven a una recarga accidental. */
export function useTimers() {
  const [timers, setTimers] = usePersistentState<Timers>('timers', {});

  const toggle = (id: MomentId) =>
    setTimers((prev) => {
      const next: Timers = {};
      const now = Date.now();
      // Solo un cronómetro corre a la vez: al iniciar uno se pausan los demás.
      for (const [k, v] of Object.entries(prev) as [MomentId, TimerState][]) {
        next[k] = v.since ? { elapsed: elapsedOf(v, now), since: null } : v;
      }
      const cur = prev[id];
      next[id] = cur?.since ? { elapsed: elapsedOf(cur, now), since: null } : { elapsed: cur?.elapsed ?? 0, since: now };
      return next;
    });

  const reset = (id: MomentId) => setTimers((prev) => ({ ...prev, [id]: { elapsed: 0, since: null } }));
  const resetAll = () => setTimers({});
  const running = (Object.entries(timers) as [MomentId, TimerState][]).find(([, v]) => v.since)?.[0] ?? null;

  return { timers, toggle, reset, resetAll, running };
}
