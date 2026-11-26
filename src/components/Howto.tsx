import { Clock, ListChecks } from 'lucide-react';

/** Tarjeta “Qué vamos a hacer”: explica la actividad en pasos cortos antes de abrirla. */
export function Howto({ steps, minutes, kind }: { steps: string[]; minutes?: number; kind?: string }) {
  return (
    <div className="howto">
      <span className="howto__head">
        <ListChecks /> Qué vamos a hacer{kind ? ` · ${kind}` : ''}
        {minutes ? (
          <em>
            <Clock /> {minutes} min
          </em>
        ) : null}
      </span>
      <ol>
        {steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
    </div>
  );
}
