import { useState, type CSSProperties } from 'react';
import { Check, ExternalLink, Pencil, RotateCcw, Wand2 } from 'lucide-react';
import { Art } from '../components/MuralArt';
import { CopyButton } from '../components/ui';
import { ACCIONES, AREAS, EMPTY_FIELDS, EXAMPLES, GRADOS, ROLES, SOLUCIONES, buildChatGptPrompt, normalizeFields, type PromptFields } from '../data/prompts';
import { ROCAS, type Letter } from '../data/rocas';
import { sfx } from '../lib/sfx';
import { usePersistentState } from '../lib/storage';
import { AI_STUDIO_URL, CHATGPT_URL } from '../lib/urls';

const SHORT_SOL = ['Aula con menú por momentos', 'Recorrido guiado con progreso', 'Estaciones o misiones'];

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
 * Constructor del mensaje para ChatGPT con ROCAS: el docente completa las cinco piedras, mira cómo se
 * ensambla y copia un único mensaje que le pide a ChatGPT el prompt para Google AI Studio.
 * No usa ningún modelo: solo ordena el texto.
 */
export function PromptLab({ compact = false }: { compact?: boolean }) {
  const [stored, setFields] = usePersistentState<PromptFields>('lab:fields', EMPTY_FIELDS);
  const fields = normalizeFields(stored);
  const [manual, setManual] = usePersistentState<string | null>('lab:manual3', null);
  const [active, setActive] = useState<string | null>(null);

  const generated = buildChatGptPrompt(fields);
  const text = manual ?? generated;
  const ok = ready(fields);
  const done = ROCAS.filter((r) => ok[r.k]).length;
  const blocks = generated.split('\n\n');

  const set = <K extends keyof PromptFields>(k: K, v: PromptFields[K]) => {
    setManual(null);
    setFields((f) => ({ ...normalizeFields(f), [k]: v }));
  };
  const toggleAction = (a: string) => {
    sfx.pop();
    set('acciones', fields.acciones.includes(a) ? fields.acciones.filter((x) => x !== a) : [...fields.acciones, a]);
  };
  const reset = () => {
    setFields({ ...EMPTY_FIELDS, rol: '', acciones: [], solucion: '' });
    setManual(null);
    setActive(null);
    sfx.whoosh();
  };

  return (
    <section className={`lab ${compact ? 'lab--compact' : 'enter'}`}>
      {!compact && (
        <header className="screen-head lab__hero">
          <div>
            <span className="kicker">Pídele a ChatGPT tu aula</span>
            <h2 className="h-lg">
              Cinco piedras y <span className="grad-text">ChatGPT te escribe el prompt</span>
            </h2>
          </div>
          <ol className="journey" aria-label="El camino de tu mensaje">
            <li>
              <Art name="bulb" />
              <b>Tu idea</b>
              <small>ROCAS</small>
            </li>
            <li>
              <Art name="robot" />
              <b>ChatGPT</b>
              <small>te da el prompt</small>
            </li>
            <li>
              <Art name="rocket" />
              <b>AI Studio</b>
              <small>construye tu aula</small>
            </li>
          </ol>
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
                setManual(null);
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
              <b>O</b> Objetivo <small>¿Qué clase quieres crear?</small>
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
              <b>A</b> Acción <small>¿Qué debe tener tu aula?</small>
            </legend>
            <div className="lab__checks">
              {ACCIONES.map((a) => (
                <button key={a} type="button" className={`lab__check ${fields.acciones.includes(a) ? 'is-on' : ''}`} onClick={() => toggleAction(a)} aria-pressed={fields.acciones.includes(a)}>
                  {fields.acciones.includes(a) && <Check />} {a}
                </button>
              ))}
            </div>
            <input className="input" value={fields.accionExtra} onChange={(e) => set('accionExtra', e.target.value)} placeholder="Otra cosa que necesites (opcional)" aria-label="Otras acciones" />
          </fieldset>

          <fieldset className="stone" style={{ '--c': ROCAS[4].color } as CSSProperties}>
            <legend>
              <b>S</b> Salida <small>¿Qué resultado esperas y cómo lo compruebas?</small>
            </legend>
            <textarea className="input" rows={2} value={fields.solucion} onChange={(e) => set('solucion', e.target.value)} placeholder="Describe el resultado final, su formato y cómo verificarás que funciona" aria-label="Salida esperada" />
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
          <div className="lab__chat-bar">
            <i /> <i /> <i />
            <span>Mensaje para ChatGPT</span>
          </div>

          <ol className="assembly" aria-label="Cómo se ensambla tu mensaje">
            {ROCAS.map((r, i) => (
              <li key={r.k} className={ok[r.k] ? 'is-ready' : ''} style={{ '--c': r.color, '--i': i } as CSSProperties}>
                <b>{r.k}</b>
                <span>{(blocks[i] ?? '').replace(/^[A-Z] — [A-ZÓÁÉÍÚ]+: /, '')}</span>
              </li>
            ))}
          </ol>

          <div className="lab__out-head">
            <span className="kicker">Mensaje final · puedes editarlo</span>
            {manual !== null ? (
              <span className="chip chip--warn">
                <Pencil /> Editado a mano
              </span>
            ) : done === 5 ? (
              <span className="chip chip--live">5 de 5 piedras</span>
            ) : (
              <span className="chip chip--warn">{done} de 5 piedras</span>
            )}
          </div>
          <textarea className="input lab__textarea" value={text} onChange={(e) => setManual(e.target.value)} rows={compact ? 10 : 9} aria-label="Mensaje editable" />
          <div className="lab__actions">
            <CopyButton text={text} label="Copiar mensaje para ChatGPT" className="btn--primary btn--lg" />
            <a className="btn btn--lg" href={CHATGPT_URL} target="_blank" rel="noopener noreferrer">
              Abrir ChatGPT <ExternalLink />
            </a>
            <a className="btn btn--lg" href={AI_STUDIO_URL} target="_blank" rel="noopener noreferrer">
              Abrir AI Studio <ExternalLink />
            </a>
          </div>
          <p className="note-muted">
            ChatGPT te responderá con el prompt listo. Léelo, ajústalo si hace falta y pégalo en Build de Google AI Studio. Este constructor solo ordena tu mensaje; no genera nada por sí mismo.
          </p>
        </div>
      </div>
    </section>
  );
}
