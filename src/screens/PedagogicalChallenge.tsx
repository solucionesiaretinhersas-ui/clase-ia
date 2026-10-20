import { joinRoute } from '../data/workshops';
import { useMemo, useState, type FormEvent } from 'react';
import { ArrowRight, Plus, Smartphone, Star, X } from 'lucide-react';
import { ActivityControls, ActivityGate, useActivityStatus } from '../components/ActivityShell';
import { QRCode } from '../components/QRCode';
import { AREAS, EMPTY_FIELDS, type PromptFields } from '../data/prompts';
import { usePersistentState } from '../lib/storage';
import { LIVE_SYNC_AVAILABLE, useLiveResponses, useSessionCode } from '../lib/sync';
import { internalUrl } from '../lib/urls';
import { usePublicBase } from '../lib/usePublicBase';
import { useAnnounce } from '../presenter/announce';
import { usePresenter } from '../presenter/context';

const ID = 'reto';

export interface Topic {
  id: string;
  text: string;
  area: string;
  remote?: boolean;
}

export function PedagogicalChallenge() {
  const [status] = useActivityStatus(ID);
  const [topics, setTopics] = usePersistentState<Topic[]>('board:topics', []);
  const [hidden, setHidden] = usePersistentState<string[]>('board:hidden', []);
  const [starId, setStarId] = usePersistentState<string>('board:star', '');
  const [, setFields] = usePersistentState<PromptFields>('lab:fields', EMPTY_FIELDS);
  const [text, setText] = useState('');
  const [area, setArea] = useState('');
  const { goTo } = usePresenter();
  const { code } = useSessionCode();
  const { base } = usePublicBase();
  const live = useLiveResponses(LIVE_SYNC_AVAILABLE ? code : '', ID);

  useAnnounce('reto', {
    key: ID,
    kind: 'ideas',
    prompt: '¿Qué tema te cuesta más enseñar a tus estudiantes?',
    open: status === 'open',
  });

  // Temas escritos en el tablero + temas enviados desde los celulares.
  const all = useMemo<Topic[]>(
    () => [...topics, ...live.responses.map((r) => ({ id: r.id, text: r.value, area: '', remote: true }))].filter((t) => !hidden.includes(t.id)),
    [topics, live.responses, hidden],
  );
  const starred = all.find((t) => t.id === starId);

  function add(e: FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setTopics((list) => [...list, { id: Date.now().toString(36), text: t, area }]);
    setText('');
  }

  const useInLab = () => {
    if (!starred) return;
    setFields((f) => ({ ...f, tema: starred.text, area: starred.area || f.area }));
    goTo('laboratorio');
  };

  const byArea = all.reduce<Record<string, number>>((acc, t) => {
    const k = t.area || 'Sin área';
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className="challenge enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">Reto de pensamiento pedagógico</span>
          <h2 className="h-lg">
            ¿Qué tema les cuesta más <span className="grad-text">a tus estudiantes</span>?
          </h2>
        </div>
        <ActivityControls
          id={ID}
          onReset={() => {
            setTopics([]);
            setHidden(live.responses.map((r) => r.id));
            setStarId('');
          }}
          openLabel="Abrir tablero"
        />
      </header>

      <ActivityGate id={ID}>
        <div className="challenge__top">
          <form className="challenge__form" onSubmit={add}>
            <input
              className="input input--xl"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe un tema, por ejemplo: las fracciones"
              aria-label="Tema difícil de enseñar"
              maxLength={90}
            />
            <select className="input" value={area} onChange={(e) => setArea(e.target.value)} aria-label="Área">
              <option value="">Área (opcional)</option>
              {AREAS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
            <button type="submit" className="btn btn--primary btn--lg" disabled={!text.trim()}>
              <Plus /> Agregar
            </button>
          </form>
          {LIVE_SYNC_AVAILABLE && (
            <div className="challenge__qr glass">
              <span className="vote__phone-head">
                <Smartphone /> Desde tu celular
              </span>
              <QRCode value={internalUrl(base, joinRoute(code))} size={110} />
            </div>
          )}
        </div>

        {all.length === 0 ? (
          <div className="empty">
            <p>El tablero está vacío.</p>
            <span>Los docentes pueden escribir desde su celular o pasar al tablero.</span>
          </div>
        ) : (
          <ul className="topics" aria-live="polite">
            {all.map((t, i) => (
              <li key={t.id} className={`topic ${t.id === starId ? 'is-starred' : ''}`} style={{ animationDelay: `${Math.min(i, 8) * 0.03}s` }}>
                <button type="button" className="topic__star" onClick={() => setStarId(t.id === starId ? '' : t.id)} aria-label={t.id === starId ? 'Quitar selección' : 'Elegir para la demostración'} aria-pressed={t.id === starId}>
                  <Star />
                </button>
                <span className="topic__text">{t.text}</span>
                {t.area && <span className="topic__area">{t.area}</span>}
                {t.remote && <Smartphone className="topic__phone" aria-label="Enviado desde un celular" />}
                <button
                  type="button"
                  className="topic__del"
                  onClick={() => (t.remote ? setHidden((h) => [...h, t.id]) : setTopics((l) => l.filter((x) => x.id !== t.id)))}
                  aria-label={`Quitar ${t.text}`}
                >
                  <X />
                </button>
              </li>
            ))}
          </ul>
        )}
      </ActivityGate>

      <footer className="challenge__foot">
        <div className="challenge__areas">
          {Object.entries(byArea).map(([a, n]) => (
            <span key={a} className="chip">
              {a} <b>{n}</b>
            </span>
          ))}
        </div>
        <button type="button" className="btn btn--lg" onClick={useInLab} disabled={!starred}>
          {starred ? `Usar “${starred.text.slice(0, 28)}${starred.text.length > 28 ? '…' : ''}” en el laboratorio` : 'Marca un tema con la estrella'}
          <ArrowRight />
        </button>
      </footer>
    </section>
  );
}
