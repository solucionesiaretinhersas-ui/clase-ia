import { useState, type CSSProperties } from 'react';
import { Check, ExternalLink, Pencil, RotateCcw, Wand2 } from 'lucide-react';
import { CopyButton } from '../components/ui';
import {
  ACCIONES,
  AREAS,
  EMPTY_FIELDS,
  EXAMPLES,
  GRADOS,
  ROLES,
  SOLUCIONES,
  buildChatGptPrompt,
  buildStudioPrompt,
  normalizeFields,
  type PromptFields,
} from '../data/prompts';
import { ROCAS, type Letter } from '../data/rocas';
import { sfx } from '../lib/sfx';
import { usePersistentState } from '../lib/storage';
import { AI_STUDIO_URL, CHATGPT_URL } from '../lib/urls';

type Tab = 'chatgpt' | 'studio';
const SHORT_SOL = ['Estructura en tabla + lista de verificación', 'Guía lista para usar + rúbrica', 'Secuencia de actividades numeradas'];

function ready(f: PromptFields): Record<Letter, boolean> {
  return {
    R: Boolean(f.rol.trim()),
    O: Boolean(f.tema.trim() && f.grado.trim() && f.objetivo.trim()),
    C: f.contexto.trim().length > 12,
    A: f.acciones.length >= 3 || Boolean(f.accionExtra.trim()),
    S: Boolean(f.solucion.trim()),
  };
}

/**
 * Constructor de prompts con ROCAS: escribe o elige cada parte, mira cómo se ensambla la
 * instrucción, edítala, cópiala y llévala a ChatGPT. No usa ningún modelo: solo estructura el texto.
 */
export function PromptLab({ compact = false }: { compact?: boolean }) {
  const [stored, setFields] = usePersistentState<PromptFields>('lab:fields', EMPTY_FIELDS);
  const fields = normalizeFields(stored);
  const [tab, setTab] = usePersistentState<Tab>('lab:tab', 'chatgpt');
  const [manual, setManual] = usePersistentState<Record<Tab, string | null>>('lab:manual2', { chatgpt: null, studio: null });
  const [active, setActive] = useState<string | null>(null);

  const generated = tab === 'chatgpt' ? buildChatGptPrompt(fields) : buildStudioPrompt(fields);
  const edited = manual[tab] ?? null;
  const text = edited ?? generated;
  const ok = ready(fields);
  const done = ROCAS.filter((r) => ok[r.k]).length;
  const blocks = generated.split('\n\n');

  const set = <K extends keyof PromptFields>(k: K, v: PromptFields[K]) => {
    setManual({ chatgpt: null, studio: null });
    setFields((f) => ({ ...normalizeFields(f), [k]: v }));
  };
  const toggleAction = (a: string) => {
    sfx.pop();
    set('acciones', fields.acciones.includes(a) ? fields.acciones.filter((x) => x !== a) : [...fields.acciones, a]);
  };
  const reset = () => {
    setFields({ ...EMPTY_FIELDS, rol: '', acciones: [], solucion: '' });
    setManual({ chatgpt: null, studio: null });
    setActive(null);
    sfx.whoosh();
  };

  return (
    <section className={`lab ${compact ? 'lab--compact' : 'enter'}`}>
      {!compact && (
        <header className="screen-head">
          <span className="kicker">Constructor de prompts ROCAS</span>
          <h2 className="h-lg">Completa las cinco piedras</h2>
        </header>
      )}

      <div className="lab__top">
        <div className="lab__stones" role="img" aria-label={`${done} de 5 piedras completas`}>
          {ROCAS.map((r) => (
            <i key={r.k} className={ok[r.k] ? 'is-on' : ''} style={{ '--c': r.color } as CSSProperties}>
              {r.k}
            </i>
          ))}
        </div>
        <div className="lab__examples" role="group" aria-label="Cargar un ejemplo">
          <span>Cargar ejemplo:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              type="button"
              className={`btn ${active === ex.id ? 'btn--primary' : ''}`}
              onClick={() => {
                setActive(ex.id);
                setManual({ chatgpt: null, studio: null });
                setFields((f) => ({ ...normalizeFields(f), ...ex.fields }));
                sfx.ok();
              }}
            >
              <Wand2 /> {ex.label}
            </button>
          ))}
          <button type="button" className="btn btn--ghost" onClick={reset}>
            <RotateCcw /> Reiniciar
          </button>
        </div>
      </div>

      <div className="lab__grid">
        <form className="lab__form" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="stone" style={{ '--c': ROCAS[0].color } as CSSProperties}>
            <legend>
              <b>R</b> Rol <small>¿Quién debe ser la IA?</small>
            </legend>
            <input className="input" list="roles" value={fields.rol} onChange={(e) => set('rol', e.target.value)} placeholder="Escribe un rol o elige uno de la lista" aria-label="Rol de la IA" />
            <datalist id="roles">
              {ROLES.map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </fieldset>

          <fieldset className="stone" style={{ '--c': ROCAS[1].color } as CSSProperties}>
            <legend>
              <b>O</b> Objetivo <small>¿Qué queremos lograr?</small>
            </legend>
            <input className="input" value={fields.tema} onChange={(e) => set('tema', e.target.value)} placeholder="Tema. Ej.: el ciclo del agua" aria-label="Tema" />
            <div className="lab__row">
              <input className="input" list="grados" value={fields.grado} onChange={(e) => set('grado', e.target.value)} placeholder="Grado" aria-label="Grado" />
              <input className="input" list="areas" value={fields.area} onChange={(e) => set('area', e.target.value)} placeholder="Área" aria-label="Área" />
              <datalist id="grados">
                {GRADOS.map((g) => (
                  <option key={g} value={g} />
                ))}
              </datalist>
              <datalist id="areas">
                {AREAS.map((a) => (
                  <option key={a} value={a} />
                ))}
              </datalist>
            </div>
            <textarea className="input" rows={2} value={fields.objetivo} onChange={(e) => set('objetivo', e.target.value)} placeholder="Qué debe lograr el estudiante" aria-label="Objetivo de aprendizaje" />
          </fieldset>

          <fieldset className="stone" style={{ '--c': ROCAS[2].color } as CSSProperties}>
            <legend>
              <b>C</b> Contexto <small>Tu parte humana</small>
            </legend>
            <textarea className="input" rows={3} value={fields.contexto} onChange={(e) => set('contexto', e.target.value)} placeholder="Tu grupo, tu aula, tu comunidad: cuántos son, qué recursos tienen, qué les motiva" aria-label="Contexto" />
          </fieldset>

          <fieldset className="stone" style={{ '--c': ROCAS[3].color } as CSSProperties}>
            <legend>
              <b>A</b> Acción <small>¿Qué debe hacer, paso a paso?</small>
            </legend>
            <div className="lab__checks">
              {ACCIONES.map((a) => (
                <button key={a} type="button" className={`lab__check ${fields.acciones.includes(a) ? 'is-on' : ''}`} onClick={() => toggleAction(a)} aria-pressed={fields.acciones.includes(a)}>
                  {fields.acciones.includes(a) && <Check />} {a}
                </button>
              ))}
            </div>
            <input className="input" value={fields.accionExtra} onChange={(e) => set('accionExtra', e.target.value)} placeholder="Otra acción que necesites (opcional)" aria-label="Otras acciones" />
          </fieldset>

          <fieldset className="stone" style={{ '--c': ROCAS[4].color } as CSSProperties}>
            <legend>
              <b>S</b> Solución <small>¿Qué resultado, en qué formato y cómo lo compruebo?</small>
            </legend>
            <textarea className="input" rows={2} value={fields.solucion} onChange={(e) => set('solucion', e.target.value)} placeholder="Describe el resultado final, su formato y cómo verificarás que funciona" aria-label="Solución esperada" />
            <div className="lab__checks">
              {SOLUCIONES.map((s, i) => (
                <button key={s} type="button" className={`lab__check ${fields.solucion === s ? 'is-on' : ''}`} onClick={() => set('solucion', s)}>
                  {SHORT_SOL[i]}
                </button>
              ))}
            </div>
          </fieldset>
        </form>

        <div className="lab__out glass">
          <div className="lab__tabs" role="tablist" aria-label="Elige el prompt">
            <button type="button" role="tab" aria-selected={tab === 'chatgpt'} className={tab === 'chatgpt' ? 'is-active' : ''} onClick={() => setTab('chatgpt')}>
              <b>1</b> ChatGPT · afina tu prompt
            </button>
            <button type="button" role="tab" aria-selected={tab === 'studio'} className={tab === 'studio' ? 'is-active' : ''} onClick={() => setTab('studio')}>
              <b>2</b> AI Studio · recurso
            </button>
          </div>

          <ol className="assembly" aria-label="Cómo se ensambla tu instrucción">
            {ROCAS.map((r, i) => (
              <li key={r.k + tab} className={ok[r.k] ? 'is-ready' : ''} style={{ '--c': r.color, '--i': i } as CSSProperties}>
                <b>{r.k}</b>
                <span>{(blocks[i] ?? '').replace(/^[A-Z] — [A-ZÓÁÉÍÚ]+: /, '')}</span>
              </li>
            ))}
          </ol>

          <div className="lab__out-head">
            <span className="kicker">Texto final · puedes editarlo</span>
            {edited !== null ? (
              <span className="chip chip--warn">
                <Pencil /> Editado a mano
              </span>
            ) : done === 5 ? (
              <span className="chip chip--live">5 de 5 piedras</span>
            ) : (
              <span className="chip chip--warn">{done} de 5 piedras</span>
            )}
          </div>
          <textarea className="input lab__textarea" value={text} onChange={(e) => setManual({ ...manual, [tab]: e.target.value })} rows={compact ? 10 : 9} aria-label="Prompt editable" />
          <div className="lab__actions">
            <CopyButton text={text} label={`Copiar prompt ${tab === 'chatgpt' ? '1' : '2'}`} className="btn--primary btn--lg" />
            <a className="btn btn--lg" href={tab === 'chatgpt' ? CHATGPT_URL : AI_STUDIO_URL} target="_blank" rel="noopener noreferrer">
              {tab === 'chatgpt' ? 'Abrir ChatGPT' : 'Abrir AI Studio'} <ExternalLink />
            </a>
          </div>
          <p className="note-muted">
            {tab === 'chatgpt'
              ? 'Pégalo en ChatGPT para revisarlo y mejorarlo. Este constructor solo ordena tu instrucción; no genera nada por sí mismo.'
              : 'Antes de enviarlo a Build, reemplaza [PEGA AQUÍ LA ESTRUCTURA…] por la respuesta de ChatGPT.'}
          </p>
        </div>
      </div>
    </section>
  );
}
