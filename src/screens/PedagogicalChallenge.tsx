import { useState, type FormEvent } from 'react';
import { ArrowRight, Plus, Star, X } from 'lucide-react';
import { ActivityControls, ActivityGate } from '../components/ActivityShell';
import { AREAS, EMPTY_FIELDS, type PromptFields } from '../data/prompts';
import { usePersistentState } from '../lib/storage';
import { usePresenter } from '../presenter/context';

const ID = 'reto';

export interface Topic {
  id: string;
  text: string;
  area: string;
  starred?: boolean;
}

export function PedagogicalChallenge() {
  const [topics, setTopics] = usePersistentState<Topic[]>('board:topics', []);
  const [, setFields] = usePersistentState<PromptFields>('lab:fields', EMPTY_FIELDS);
  const [text, setText] = useState('');
  const [area, setArea] = useState('');
  const { goTo } = usePresenter();
  const starred = topics.find((t) => t.starred);

  function add(e: FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setTopics((list) => [...list, { id: Date.now().toString(36), text: t, area }]);
    setText('');
  }

  const toggleStar = (id: string) => setTopics((list) => list.map((t) => ({ ...t, starred: t.id === id ? !t.starred : false })));

  const useInLab = () => {
    if (!starred) return;
    setFields((f) => ({ ...f, tema: starred.text, area: starred.area || f.area }));
    goTo('laboratorio');
  };

  const byArea = topics.reduce<Record<string, number>>((acc, t) => {
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
        <ActivityControls id={ID} onReset={() => setTopics([])} openLabel="Abrir tablero" />
      </header>

      <ActivityGate id={ID}>
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

        {topics.length === 0 ? (
          <div className="empty">
            <p>El tablero está vacío.</p>
            <span>Invita a un docente a pasar y escribir el primer tema.</span>
          </div>
        ) : (
          <ul className="topics" aria-live="polite">
            {topics.map((t, i) => (
              <li key={t.id} className={`topic ${t.starred ? 'is-starred' : ''}`} style={{ animationDelay: `${Math.min(i, 8) * 0.03}s` }}>
                <button type="button" className="topic__star" onClick={() => toggleStar(t.id)} aria-label={t.starred ? 'Quitar selección' : 'Elegir para la demostración'} aria-pressed={Boolean(t.starred)}>
                  <Star />
                </button>
                <span className="topic__text">{t.text}</span>
                {t.area && <span className="topic__area">{t.area}</span>}
                <button type="button" className="topic__del" onClick={() => setTopics((l) => l.filter((x) => x.id !== t.id))} aria-label={`Eliminar ${t.text}`}>
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
