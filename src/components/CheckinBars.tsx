import { Smartphone } from 'lucide-react';
import { CountUp } from './CountUp';

/** Barras de avance en vivo: cuántos docentes marcaron cada opción desde su celular. */
export function CheckinBars({ labels, counts, total, title = 'Avance del grupo' }: { labels: string[]; counts: number[]; total: number; title?: string }) {
  const sum = counts.reduce((a, b) => a + b, 0);
  const base = Math.max(1, total, sum);
  return (
    <div className="checkin" aria-live="polite">
      <div className="checkin__head">
        <span>
          <Smartphone /> {title}
        </span>
        <b>
          <CountUp value={counts[0] ?? 0} />
          <small> de {Math.max(total, sum)} listos</small>
        </b>
      </div>
      {labels.map((l, i) => (
        <div key={l} className={`checkin__row checkin__row--${i}`}>
          <span>{l}</span>
          <i>
            <u style={{ width: `${((counts[i] ?? 0) / base) * 100}%` }} />
          </i>
          <em>{counts[i] ?? 0}</em>
        </div>
      ))}
    </div>
  );
}
