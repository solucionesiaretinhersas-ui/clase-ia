import type { ReactNode } from 'react';
import { Lock, Play, RotateCcw, Square } from 'lucide-react';
import { usePersistentState } from '../lib/storage';

export type ActivityStatus = 'idle' | 'open' | 'closed';

export function useActivityStatus(id: string) {
  return usePersistentState<ActivityStatus>(`activity:${id}:status`, 'idle');
}

/**
 * Controles del facilitador para una actividad: abrir, cerrar y reiniciar.
 * Mientras está en espera, el contenido se muestra atenuado y bloqueado.
 */
export function ActivityControls({
  id,
  onReset,
  openLabel = 'Abrir actividad',
}: {
  id: string;
  onReset?: () => void;
  openLabel?: string;
}) {
  const [status, setStatus] = useActivityStatus(id);
  return (
    <div className="activity-controls" role="group" aria-label="Control de la actividad">
      {status === 'open' ? (
        <span className="chip chip--live">
          <span className="dot dot--pulse" /> En curso
        </span>
      ) : status === 'closed' ? (
        <span className="chip chip--muted">
          <Lock /> Cerrada
        </span>
      ) : (
        <span className="chip chip--muted">En espera</span>
      )}
      {status !== 'open' && (
        <button type="button" className="btn btn--ok" onClick={() => setStatus('open')}>
          <Play /> {status === 'closed' ? 'Reabrir' : openLabel}
        </button>
      )}
      {status === 'open' && (
        <button type="button" className="btn" onClick={() => setStatus('closed')}>
          <Square /> Cerrar
        </button>
      )}
      {onReset && (
        <button
          type="button"
          className="btn btn--ghost btn--icon"
          title="Reiniciar actividad"
          aria-label="Reiniciar actividad"
          onClick={() => {
            if (window.confirm('¿Reiniciar esta actividad? Se borrarán sus respuestas en este navegador.')) {
              onReset();
              setStatus('idle');
            }
          }}
        >
          <RotateCcw />
        </button>
      )}
    </div>
  );
}

export function ActivityGate({ id, children }: { id: string; children: ReactNode }) {
  const [status, setStatus] = useActivityStatus(id);
  return (
    <div className={`gate gate--${status}`}>
      <div className="gate__content" inert={status !== 'open' ? true : undefined}>
        {children}
      </div>
      {status === 'closed' && (
        <span className="gate__closed chip chip--muted">
          <Lock /> Actividad cerrada por el facilitador
        </span>
      )}
      {status === 'idle' && (
        <div className="gate__veil">
          <button type="button" className="btn btn--primary btn--lg" onClick={() => setStatus('open')}>
            <Play /> Abrir actividad
          </button>
        </div>
      )}
    </div>
  );
}
