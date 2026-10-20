import { useEffect, useState, type FormEvent } from 'react';
import { Dices, ExternalLink, Pause, Play, Plus, Presentation, Trash2, X } from 'lucide-react';
import { ActivityControls, ActivityGate } from '../components/ActivityShell';
import { QRCode } from '../components/QRCode';
import { AREAS } from '../data/prompts';
import { usePersistentState } from '../lib/storage';
import { fmt, useTicker } from '../components/ui';

const ID = 'galeria';
const SLOT = 120000;

interface Entry {
  id: string;
  teacher: string;
  title: string;
  area: string;
  link: string;
  presented?: boolean;
}

function safeLink(v: string): string {
  try {
    const u = new URL(v.trim());
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString() : '';
  } catch {
    return '';
  }
}

export function Gallery() {
  const [entries, setEntries] = usePersistentState<Entry[]>('gallery:entries', []);
  const [focusId, setFocusId] = usePersistentState<string | null>('gallery:focus', null);
  const [form, setForm] = useState({ teacher: '', title: '', area: '', link: '' });
  const [linkErr, setLinkErr] = useState(false);
  const [timer, setTimer] = usePersistentState<{ elapsed: number; since: number | null }>('gallery:timer', { elapsed: 0, since: null });
  useTicker(Boolean(timer.since));

  const focus = entries.find((e) => e.id === focusId) ?? null;
  const elapsed = timer.elapsed + (timer.since ? Date.now() - timer.since : 0);
  const left = SLOT - elapsed;

  useEffect(() => {
    if (focusId && !entries.some((e) => e.id === focusId)) setFocusId(null);
  }, [entries, focusId, setFocusId]);

  function add(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    let link = '';
    if (form.link.trim()) {
      link = safeLink(form.link);
      if (!link) {
        setLinkErr(true);
        return;
      }
    }
    setLinkErr(false);
    setEntries((l) => [...l, { id: Date.now().toString(36), teacher: form.teacher.trim() || 'Docente', title: form.title.trim(), area: form.area, link }]);
    setForm({ teacher: '', title: '', area: '', link: '' });
  }

  function present(id: string) {
    setFocusId(id);
    setTimer({ elapsed: 0, since: null });
    setEntries((l) => l.map((x) => (x.id === id ? { ...x, presented: true } : x)));
  }

  function randomPick() {
    const pool = entries.filter((e) => !e.presented);
    if (!pool.length) return;
    present(pool[Math.floor(Math.random() * pool.length)].id);
  }

  const toggleTimer = () =>
    setTimer(timer.since ? { elapsed, since: null } : { elapsed: timer.elapsed, since: Date.now() });

  return (
    <section className="gallery enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">Momento 5 · Socialización</span>
          <h2 className="h-lg">Galería de recursos creados</h2>
        </div>
        <ActivityControls id={ID} onReset={() => { setEntries([]); setFocusId(null); setTimer({ elapsed: 0, since: null }); }} openLabel="Abrir galería" />
      </header>

      <ActivityGate id={ID}>
        {focus ? (
          <div className="spot glass">
            <button type="button" className="btn btn--ghost btn--icon spot__x" onClick={() => setFocusId(null)} aria-label="Cerrar foco">
              <X />
            </button>
            <div className="spot__main">
              <span className="chip">{focus.area || 'Recurso educativo'}</span>
              <h3>{focus.title}</h3>
              <p>Por {focus.teacher}</p>
              <div className="spot__ask">
                <b>En 2 minutos cuéntanos:</b> qué problema resuelve · para qué grado · qué mejorarías
              </div>
              <div className="spot__timer">
                <span className={left < 0 ? 'is-over' : left < 30000 ? 'is-low' : ''}>{fmt(left)}</span>
                <button type="button" className="btn" onClick={toggleTimer}>
                  {timer.since ? <Pause /> : <Play />} {timer.since ? 'Pausar' : 'Iniciar'}
                </button>
              </div>
            </div>
            {focus.link ? (
              <div className="spot__qr">
                <QRCode value={focus.link} size={200} />
                <a className="btn" href={focus.link} target="_blank" rel="noopener noreferrer">
                  Abrir recurso <ExternalLink />
                </a>
              </div>
            ) : (
              <div className="spot__qr spot__qr--none">Sin enlace compartido: se presenta desde la pantalla del docente.</div>
            )}
          </div>
        ) : (
          <>
            <form className="gallery__form" onSubmit={add}>
              <input className="input" placeholder="Nombre del docente" value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} aria-label="Docente" />
              <input className="input input--grow" placeholder="Título del recurso creado" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} aria-label="Título del recurso" required />
              <select className="input" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} aria-label="Área">
                <option value="">Área</option>
                {AREAS.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
              <input className={`input ${linkErr ? 'is-invalid' : ''}`} placeholder="Enlace (opcional)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} aria-label="Enlace del recurso" inputMode="url" />
              <button type="submit" className="btn btn--primary" disabled={!form.title.trim()}>
                <Plus /> Registrar
              </button>
            </form>
            {linkErr && <p className="note-warn">El enlace debe comenzar por https:// o http://</p>}

            {entries.length === 0 ? (
              <div className="empty">
                <p>Aún no hay recursos registrados.</p>
                <span>Registra los que se van a presentar y usa el sorteo para elegir el orden.</span>
              </div>
            ) : (
              <>
                <div className="gallery__bar">
                  <span>
                    {entries.filter((e) => e.presented).length} de {entries.length} presentados
                  </span>
                  <button type="button" className="btn btn--primary" onClick={randomPick} disabled={entries.every((e) => e.presented)}>
                    <Dices /> Elegir al azar
                  </button>
                </div>
                <ul className="gallery__list">
                  {entries.map((e) => (
                    <li key={e.id} className={`gcard glass ${e.presented ? 'is-done' : ''}`}>
                      <span className="chip">{e.area || 'Recurso'}</span>
                      <strong>{e.title}</strong>
                      <span>{e.teacher}</span>
                      <div className="gcard__btns">
                        <button type="button" className="btn" onClick={() => present(e.id)}>
                          <Presentation /> {e.presented ? 'Ver de nuevo' : 'Presentar'}
                        </button>
                        <button type="button" className="btn btn--ghost btn--icon" onClick={() => setEntries((l) => l.filter((x) => x.id !== e.id))} aria-label={`Eliminar ${e.title}`}>
                          <Trash2 />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </ActivityGate>
    </section>
  );
}
