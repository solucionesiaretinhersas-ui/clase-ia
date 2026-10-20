import { useState } from 'react';
import { ExternalLink, Pencil, RotateCcw, Wand2 } from 'lucide-react';
import { CopyButton } from '../components/ui';
import {
  AREAS,
  EMPTY_FIELDS,
  EXAMPLES,
  GRADOS,
  buildChatGptPrompt,
  buildStudioPrompt,
  missingFields,
  normalizeFields,
  type PromptFields,
} from '../data/prompts';
import { usePersistentState } from '../lib/storage';
import { AI_STUDIO_URL, CHATGPT_URL } from '../lib/urls';

const LABELS: Record<keyof PromptFields, string> = {
  tema: 'Tema',
  grado: 'Grado',
  area: 'Área',
  objetivo: 'Objetivo de aprendizaje',
  contexto: 'Contexto de tu aula y estudiantes',
};

type Tab = 'chatgpt' | 'studio';

export function PromptLab({ compact = false }: { compact?: boolean }) {
  const [stored, setFields] = usePersistentState<PromptFields>('lab:fields', EMPTY_FIELDS);
  const fields = normalizeFields(stored);
  const [tab, setTab] = usePersistentState<Tab>('lab:tab', 'chatgpt');
  const [manual, setManual] = usePersistentState<Record<Tab, string | null>>('lab:manual2', { chatgpt: null, studio: null });
  const [active, setActive] = useState<string | null>(null);

  const generated = tab === 'chatgpt' ? buildChatGptPrompt(fields) : buildStudioPrompt(fields);
  const edited = manual[tab] ?? null;
  const text = edited ?? generated;
  const missing = missingFields(fields);

  const set = (k: keyof PromptFields, v: string) => {
    setManual({ chatgpt: null, studio: null });
    setFields((f) => ({ ...normalizeFields(f), [k]: v }));
  };

  return (
    <section className={`lab ${compact ? 'lab--compact' : 'enter'}`}>
      {!compact && (
        <header className="screen-head">
          <span className="kicker">Momento 3 · Laboratorio de prompts</span>
          <h2 className="h-lg">Dos prompts: planear y construir</h2>
        </header>
      )}

      <div className="lab__examples" role="group" aria-label="Ejemplos listos">
        <span>Ejemplos:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.id}
            type="button"
            className={`btn ${active === ex.id ? 'btn--primary' : ''}`}
            onClick={() => {
              setActive(ex.id);
              setManual({ chatgpt: null, studio: null });
              setFields(ex.fields);
            }}
          >
            <Wand2 /> {ex.kind} · {ex.label}
          </button>
        ))}
      </div>

      <div className="lab__grid">
        <form className="lab__form glass" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span>{LABELS.tema}</span>
            <input className="input" value={fields.tema} onChange={(e) => set('tema', e.target.value)} placeholder="Ej.: las fracciones equivalentes" />
          </label>
          <div className="lab__row">
            <label className="field">
              <span>{LABELS.grado}</span>
              <input className="input" list="grados" value={fields.grado} onChange={(e) => set('grado', e.target.value)} placeholder="Ej.: grado sexto" />
              <datalist id="grados">
                {GRADOS.map((g) => (
                  <option key={g} value={g} />
                ))}
              </datalist>
            </label>
            <label className="field">
              <span>{LABELS.area}</span>
              <input className="input" list="areas" value={fields.area} onChange={(e) => set('area', e.target.value)} placeholder="Ej.: Matemáticas" />
              <datalist id="areas">
                {AREAS.map((a) => (
                  <option key={a} value={a} />
                ))}
              </datalist>
            </label>
          </div>
          <label className="field">
            <span>{LABELS.objetivo}</span>
            <textarea className="input" rows={2} value={fields.objetivo} onChange={(e) => set('objetivo', e.target.value)} placeholder="Ej.: que los estudiantes comparen fracciones y justifiquen su respuesta" />
          </label>
          <label className="field">
            <span>{LABELS.contexto}</span>
            <textarea className="input" rows={3} value={fields.contexto} onChange={(e) => set('contexto', e.target.value)} placeholder="Ej.: 30 estudiantes, video beam, poca conectividad, les gustan los retos en equipo" />
          </label>
          <p className="note-muted lab__human">Esta es tu parte humana: cuanto más puntual tu contexto, mejor resultado.</p>
          <button type="button" className="btn btn--ghost" onClick={() => { setFields(EMPTY_FIELDS); setManual({ chatgpt: null, studio: null }); setActive(null); }}>
            <RotateCcw /> Limpiar campos
          </button>
        </form>

        <div className="lab__out glass">
          <div className="lab__tabs" role="tablist" aria-label="Elige el prompt">
            <button type="button" role="tab" aria-selected={tab === 'chatgpt'} className={tab === 'chatgpt' ? 'is-active' : ''} onClick={() => setTab('chatgpt')}>
              <b>1</b> ChatGPT · estructura la clase
            </button>
            <button type="button" role="tab" aria-selected={tab === 'studio'} className={tab === 'studio' ? 'is-active' : ''} onClick={() => setTab('studio')}>
              <b>2</b> AI Studio · crea el recurso
            </button>
          </div>
          <div className="lab__out-head">
            <span className="kicker">{tab === 'chatgpt' ? 'Pégalo en ChatGPT' : 'Pégalo en Build'}</span>
            {edited !== null ? (
              <span className="chip chip--warn"><Pencil /> Editado a mano</span>
            ) : missing.length > 0 ? (
              <span className="chip chip--warn">Faltan: {missing.map((m) => LABELS[m].split(' ')[0].toLowerCase()).join(', ')}</span>
            ) : (
              <span className="chip chip--live">Completo</span>
            )}
          </div>
          <textarea
            className="input lab__textarea"
            value={text}
            onChange={(e) => setManual({ ...manual, [tab]: e.target.value })}
            rows={compact ? 9 : 10}
            aria-label="Prompt editable"
          />
          <div className="lab__actions">
            <CopyButton text={text} label={`Copiar prompt ${tab === 'chatgpt' ? '1' : '2'}`} className="btn--primary btn--lg" />
            <a className="btn btn--lg" href={tab === 'chatgpt' ? CHATGPT_URL : AI_STUDIO_URL} target="_blank" rel="noopener noreferrer">
              {tab === 'chatgpt' ? 'Abrir ChatGPT' : 'Abrir AI Studio'} <ExternalLink />
            </a>
          </div>
          {tab === 'studio' && <p className="note-muted">Antes de enviarlo, reemplaza [PEGA AQUÍ LA ESTRUCTURA…] por la respuesta de ChatGPT.</p>}
          {tab === 'chatgpt' && missing.length > 0 && edited === null && <p className="note-muted">Los campos vacíos quedan entre [CORCHETES] para completarlos después.</p>}
        </div>
      </div>
    </section>
  );
}
