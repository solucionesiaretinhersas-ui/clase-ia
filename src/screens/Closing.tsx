import { useState, type FormEvent } from 'react';
import { Compass, Plus, Puzzle, Rocket, Sparkles, Trash2, Wand2 } from 'lucide-react';
import { ActivityControls, ActivityGate } from '../components/ActivityShell';
import { QRCode } from '../components/QRCode';
import { usePersistentState } from '../lib/storage';
import { LIVE_SYNC_AVAILABLE, useLiveResponses, useSessionCode } from '../lib/sync';
import { internalUrl } from '../lib/urls';
import { usePublicBase } from '../lib/usePublicBase';

const ID = 'cierre';

export interface Commitment {
  id: string;
  who: string;
  resource: string;
  problem: string;
  how: string;
}

const LEARNED = [
  { icon: Compass, title: 'Interactivo es decidir', text: 'Una clase interactiva da voz, error y retroalimentación.' },
  { icon: Wand2, title: 'Un buen prompt es pedagogía', text: 'Rol, tema, grado, objetivo y experiencia.' },
  { icon: Puzzle, title: 'Build crea y mejora', text: 'Describe, prueba y pide cambios, uno a la vez.' },
  { icon: Sparkles, title: 'La IA propone, tú dispones', text: 'Revisa siempre el contenido antes de usarlo.' },
];

export function Closing() {
  const [items, setItems] = usePersistentState<Commitment[]>('closing:items', []);
  const [f, setF] = useState({ who: '', resource: '', problem: '', how: '' });
  const { base, reachable } = usePublicBase();
  const { code } = useSessionCode();
  const live = useLiveResponses(LIVE_SYNC_AVAILABLE ? code : '', 'cierre');
  const remoteItems: Commitment[] = live.responses.flatMap((r) => {
    try {
      const v = JSON.parse(r.value) as Partial<Commitment>;
      return v.resource ? [{ id: `r-${r.device}`, who: v.who ?? '', resource: v.resource, problem: v.problem ?? '', how: v.how ?? '' }] : [];
    } catch {
      return [];
    }
  });
  const all = [...items, ...remoteItems];

  function add(e: FormEvent) {
    e.preventDefault();
    if (!f.resource.trim()) return;
    setItems((l) => [...l, { id: Date.now().toString(36), ...f }]);
    setF({ who: '', resource: '', problem: '', how: '' });
  }

  return (
    <section className="closing enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">Cierre y compromiso</span>
          <h2 className="h-lg">
            Mañana, en tu clase: <span className="grad-text">¿qué vas a crear?</span>
          </h2>
        </div>
        <ActivityControls id={ID} onReset={() => setItems([])} openLabel="Abrir muro" />
      </header>

      <div className="closing__grid">
        <ul className="learned">
          {LEARNED.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <Icon />
              <div>
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="closing__wall">
          <ActivityGate id={ID}>
            <form className="closing__form" onSubmit={add}>
              <input className="input" placeholder="Tu nombre" value={f.who} onChange={(e) => setF({ ...f, who: e.target.value })} aria-label="Nombre" />
              <input className="input" placeholder="Voy a crear… (recurso)" value={f.resource} onChange={(e) => setF({ ...f, resource: e.target.value })} aria-label="Recurso a crear" required />
              <input className="input" placeholder="Para resolver… (problema de aprendizaje)" value={f.problem} onChange={(e) => setF({ ...f, problem: e.target.value })} aria-label="Problema de aprendizaje" />
              <input className="input" placeholder="Lo aplicaré… (cómo y cuándo)" value={f.how} onChange={(e) => setF({ ...f, how: e.target.value })} aria-label="Cómo lo aplicaré" />
              <button type="submit" className="btn btn--primary" disabled={!f.resource.trim()}>
                <Plus /> Publicar compromiso
              </button>
            </form>
            {all.length === 0 ? (
              <div className="empty">
                <Rocket />
                <p>El muro está vacío.</p>
                <span>Invita a tres docentes a escribir su compromiso.</span>
              </div>
            ) : (
              <ul className="wall">
                {all.map((c) => (
                  <li key={c.id} className="note glass">
                    <b>{c.resource}</b>
                    {c.problem && <span>Para: {c.problem}</span>}
                    {c.how && <span>Cómo: {c.how}</span>}
                    <i>{c.who || 'Docente'}</i>
                    {c.id.startsWith('r-') ? (
                      <span className="chip chip--live note__live">Desde celular</span>
                    ) : (
                      <button type="button" className="btn btn--ghost btn--icon" onClick={() => setItems((l) => l.filter((x) => x.id !== c.id))} aria-label="Eliminar compromiso">
                        <Trash2 />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </ActivityGate>
        </div>

        <aside className="closing__exit glass">
          <strong>Ticket de salida en tu celular</strong>
          <QRCode value={internalUrl(base, `/m/cierre?s=${code}`)} size={150} />
          <span>{LIVE_SYNC_AVAILABLE ? 'Los compromisos enviados aparecen en el muro al instante.' : 'Cada docente guarda su compromiso en su propio celular.'}</span>
          {!reachable && <span className="note-warn">Requiere URL pública o red local.</span>}
        </aside>
      </div>
    </section>
  );
}
