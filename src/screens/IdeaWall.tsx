import { joinRoute } from '../data/workshops';
import { useMemo, useState, type FormEvent } from 'react';
import { EyeOff, Plus, Smartphone, Star } from 'lucide-react';
import { ActivityControls, useActivityStatus } from '../components/ActivityShell';
import { QRCode } from '../components/QRCode';
import { useAnnounce } from '../presenter/announce';
import { usePersistentState } from '../lib/storage';
import { LIVE_SYNC_AVAILABLE, useLiveResponses, useSessionCode } from '../lib/sync';
import { internalUrl } from '../lib/urls';
import { usePublicBase } from '../lib/usePublicBase';

export interface WallConfig {
  /** Identificador de la actividad (también la clave de las respuestas). */
  id: string;
  screenId: string;
  kicker: string;
  title: string;
  /** Lo que ven los participantes en su celular. */
  prompt: string;
  /** Mostrar las respuestas como nube de palabras (las repetidas crecen). */
  cloud?: boolean;
}

interface Idea {
  id: string;
  text: string;
  at: number;
  local: boolean;
}

const TONES = ['violet', 'blue', 'cyan', 'mint', 'amber', 'rose'];

/** Muro de ideas: los docentes envían desde el celular y las ideas aparecen en el tablero al instante. */
export function IdeaWall({ cfg }: { cfg: WallConfig }) {
  const [status] = useActivityStatus(cfg.id);
  const { code } = useSessionCode();
  const { base } = usePublicBase();
  const live = useLiveResponses(LIVE_SYNC_AVAILABLE ? code : '', cfg.id);
  const [manual, setManual] = usePersistentState<Idea[]>(`wall:${cfg.id}:manual`, []);
  const [hidden, setHidden] = usePersistentState<string[]>(`wall:${cfg.id}:hidden`, []);
  const [stars, setStars] = usePersistentState<string[]>(`wall:${cfg.id}:stars`, []);
  const [text, setText] = useState('');

  useAnnounce(cfg.screenId, { key: cfg.id, kind: 'ideas', prompt: cfg.prompt, open: status === 'open' });

  const ideas = useMemo<Idea[]>(() => {
    const remote = live.responses.map((r) => ({ id: r.id, text: r.value, at: r.at, local: false }));
    return [...manual, ...remote].filter((i) => !hidden.includes(i.id)).sort((a, b) => b.at - a.at);
  }, [live.responses, manual, hidden]);

  // Nube de palabras: agrupa respuestas iguales.
  const words = useMemo(() => {
    const map = new Map<string, { text: string; ids: string[] }>();
    ideas.forEach((i) => {
      const k = i.text.trim().toLowerCase();
      const cur = map.get(k);
      if (cur) cur.ids.push(i.id);
      else map.set(k, { text: i.text.trim(), ids: [i.id] });
    });
    return [...map.values()].sort((a, b) => b.ids.length - a.ids.length);
  }, [ideas]);
  const maxCount = Math.max(1, ...words.map((w) => w.ids.length));

  function add(e: FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setManual((l) => [...l, { id: `m-${Date.now().toString(36)}`, text: t, at: Date.now(), local: true }]);
    setText('');
  }

  const toggleStar = (id: string) => setStars((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <section className="wall-screen enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">{cfg.kicker}</span>
          <h2 className="h-lg">{cfg.title}</h2>
        </div>
        <ActivityControls
          id={cfg.id}
          openLabel="Abrir muro"
          onReset={() => {
            setManual([]);
            setHidden(live.responses.map((r) => r.id));
            setStars([]);
          }}
        />
      </header>

      <div className="wall-screen__body">
        <div className="wall-screen__board">
          {ideas.length === 0 ? (
            <div className="empty">
              <p>{status === 'open' ? 'Esperando ideas…' : 'El muro está esperando.'}</p>
              <span>
                {status === 'open'
                  ? 'Los docentes escriben desde su celular y aparecerán aquí al instante.'
                  : 'Pulsa “Abrir muro” para que los docentes puedan enviar sus ideas.'}
              </span>
            </div>
          ) : cfg.cloud ? (
            <ul className="cloud" aria-live="polite">
              {words.map((w, i) => (
                <li key={w.text} className={`cloud__word cloud__word--${TONES[i % TONES.length]}`} style={{ fontSize: `calc(1.1rem + ${(w.ids.length / maxCount) * 3.2}rem)` }}>
                  {w.text}
                  {w.ids.length > 1 && <sup>{w.ids.length}</sup>}
                  <button type="button" onClick={() => setHidden((h) => [...h, ...w.ids])} aria-label={`Ocultar ${w.text}`}>
                    <EyeOff />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="stickies" aria-live="polite">
              {ideas.map((idea, i) => (
                <li key={idea.id} className={`sticky sticky--${TONES[i % TONES.length]} ${stars.includes(idea.id) ? 'is-star' : ''}`}>
                  <p>{idea.text}</p>
                  <div className="sticky__tools">
                    <button type="button" onClick={() => toggleStar(idea.id)} aria-label="Destacar idea" aria-pressed={stars.includes(idea.id)}>
                      <Star />
                    </button>
                    <button type="button" onClick={() => setHidden((h) => [...h, idea.id])} aria-label="Ocultar idea">
                      <EyeOff />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="wall-screen__side glass">
          <span className="wall-screen__count">
            <b>{ideas.length}</b> {ideas.length === 1 ? 'idea' : 'ideas'}
          </span>
          {LIVE_SYNC_AVAILABLE ? (
            <>
              <span className="vote__phone-head">
                <Smartphone /> Participa desde tu celular
              </span>
              <QRCode value={internalUrl(base, joinRoute(code))} size={150} />
              <span className={`chip ${live.status === 'live' ? 'chip--live' : live.status === 'error' ? 'chip--warn' : 'chip--muted'}`}>
                {live.status === 'live' ? 'En vivo' : live.status === 'error' ? 'Sin conexión' : 'Conectando…'} · {code}
              </span>
            </>
          ) : (
            <p className="note-muted">Sincronización no configurada: escribe aquí las ideas que dicen los docentes.</p>
          )}
          <form className="wall-screen__add" onSubmit={add}>
            <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribir una idea en el tablero" maxLength={200} aria-label="Escribir una idea en el tablero" />
            <button type="submit" className="btn btn--icon btn--primary" disabled={!text.trim()} aria-label="Agregar idea">
              <Plus />
            </button>
          </form>
        </aside>
      </div>
    </section>
  );
}
