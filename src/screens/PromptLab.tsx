import { useEffect, useState } from 'react';
import { ExternalLink, Pencil, RotateCcw, Wand2 } from 'lucide-react';
import { CopyButton } from '../components/ui';
import { AREAS, EMPTY_FIELDS, EXAMPLES, GRADOS, buildPrompt, missingFields, type PromptFields } from '../data/prompts';
import { usePersistentState } from '../lib/storage';
import { AI_STUDIO_URL } from '../lib/urls';

const LABELS: Record<keyof PromptFields, string> = { tema: 'Tema', grado: 'Grado', area: 'Área', objetivo: 'Objetivo de aprendizaje' };

export function PromptLab({ compact = false }: { compact?: boolean }) {
  const [fields, setFields] = usePersistentState<PromptFields>('lab:fields', EMPTY_FIELDS);
  const [manual, setManual] = usePersistentState<string | null>('lab:manual', null);
  const [active, setActive] = useState<string | null>(null);
  const generated = buildPrompt(fields);
  const text = manual ?? generated;
  const missing = missingFields(fields);

  useEffect(() => {
    if (manual !== null && manual === generated) setManual(null);
  }, [manual, generated, setManual]);

  const set = (k: keyof PromptFields, v: string) => {
    setManual(null);
    setFields((f) => ({ ...f, [k]: v }));
  };

  return (
    <section className={`lab ${compact ? 'lab--compact' : 'enter'}`}>
      {!compact && (
        <header className="screen-head">
          <span className="kicker">Laboratorio de prompts</span>
          <h2 className="h-lg">Personaliza el prompt maestro</h2>
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
              setManual(null);
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
            <textarea className="input" rows={3} value={fields.objetivo} onChange={(e) => set('objetivo', e.target.value)} placeholder="Ej.: que los estudiantes comparen fracciones y justifiquen su respuesta" />
          </label>
          <button type="button" className="btn btn--ghost" onClick={() => { setFields(EMPTY_FIELDS); setManual(null); setActive(null); }}>
            <RotateCcw /> Limpiar campos
          </button>
        </form>

        <div className="lab__out glass">
          <div className="lab__out-head">
            <span className="kicker">Prompt listo</span>
            {manual !== null ? <span className="chip chip--warn"><Pencil /> Editado a mano</span> : missing.length > 0 ? <span className="chip chip--warn">Faltan: {missing.map((m) => LABELS[m].split(' ')[0].toLowerCase()).join(', ')}</span> : <span className="chip chip--live">Completo</span>}
          </div>
          <textarea className="input lab__textarea" value={text} onChange={(e) => setManual(e.target.value)} rows={compact ? 9 : 11} aria-label="Prompt editable" />
          <div className="lab__actions">
            <CopyButton text={text} label="Copiar prompt" className="btn--primary btn--lg" />
            <a className="btn btn--lg" href={AI_STUDIO_URL} target="_blank" rel="noopener noreferrer">
              Abrir AI Studio <ExternalLink />
            </a>
          </div>
          {missing.length > 0 && manual === null && <p className="note-muted">Los campos vacíos quedan entre [CORCHETES] para completarlos después.</p>}
        </div>
      </div>
    </section>
  );
}
