import { ExternalLink, RotateCcw } from 'lucide-react';
import { Art } from '../components/MuralArt';
import { CopyButton } from '../components/ui';
import { EMPTY_STUDENT, STUDENT_TYPES, buildStudentPrompt, missingStudent, type StudentFields } from '../data/prompts';
import { sfx } from '../lib/sfx';
import { usePersistentState } from '../lib/storage';
import { AI_STUDIO_URL } from '../lib/urls';

const TYPE_EMOJI: Record<string, string> = {
  Juego: '🎮',
  'Quiz o trivia': '🎯',
  Simulador: '🔬',
  'Historia interactiva': '📖',
  'Herramienta para estudiar': '📝',
  'Asistente creativo': '🪄',
};
const WHO = ['mis compañeros de clase', 'niños de primaria', 'mi familia', 'quienes aman los videojuegos'];
const LOOK = ['espacio, colores neón', 'selva y animales', 'retro, como un videojuego antiguo', 'caricatura, colores alegres'];

/** Constructor del prompt del estudiante: idea → prompt listo para Google AI Studio (Build). */
export function StudentLab({ compact = false }: { compact?: boolean }) {
  const [stored, setFields] = usePersistentState<StudentFields>('lab:student', EMPTY_STUDENT);
  const f = { ...EMPTY_STUDENT, ...stored };
  const prompt = buildStudentPrompt(f);
  const missing = missingStudent(f);
  const set = (k: keyof StudentFields, v: string) => setFields((s) => ({ ...EMPTY_STUDENT, ...s, [k]: v }));
  const total = 4;
  const doneN = total - missing.length;

  return (
    <section className={`lab slab ${compact ? 'lab--compact' : 'enter'}`}>
      {!compact && (
        <header className="screen-head lab__hero">
          <div>
            <span className="kicker">Momento 4 · Tu prompt</span>
            <h2 className="h-lg">
              De tu idea a <span className="grad-text">un prompt</span>
            </h2>
            <div className="slab__dots" aria-label={`${doneN} de ${total} campos listos`}>
              {Array.from({ length: total }, (_, i) => (
                <i key={i} className={i < doneN ? 'is-on' : ''} />
              ))}
              <span>{doneN === total ? '¡Listo para copiar!' : `${doneN} de ${total} campos`}</span>
            </div>
          </div>
          <ol className="journey" aria-label="El camino de tu prompt">
            <li>
              <Art name="bulb" />
              <b>Tu idea</b>
              <small>este formulario</small>
            </li>
            <li>
              <Art name="pencil" />
              <b>Tu prompt</b>
              <small>se arma solo</small>
            </li>
            <li>
              <Art name="rocket" />
              <b>AI Studio</b>
              <small>crea tu app</small>
            </li>
          </ol>
        </header>
      )}
      <div className="lab__grid">
        <form className="lab__form" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="stone slab__f" style={{ '--c': 'var(--violet)' } as React.CSSProperties}>
            <legend>
              <b>1</b> ¿Qué quieres crear? <small>tu idea</small>
            </legend>
            <textarea className="input" rows={2} value={f.idea} onChange={(e) => set('idea', e.target.value)} placeholder="Ej.: un juego donde atrapo estrellas esquivando meteoritos" aria-label="Tu idea" />
            <div className="lab__checks">
              {STUDENT_TYPES.map((t) => (
                <button key={t} type="button" className={`lab__check ${f.tipo === t ? 'is-on' : ''}`} onClick={() => { set('tipo', t); sfx.pop(); }} aria-pressed={f.tipo === t}>
                  {TYPE_EMOJI[t] ?? '✨'} {t}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="stone slab__f" style={{ '--c': 'var(--blue)' } as React.CSSProperties}>
            <legend>
              <b>2</b> ¿Para quién es?
            </legend>
            <input className="input" value={f.usuarios} onChange={(e) => set('usuarios', e.target.value)} placeholder="Ej.: mis compañeros de grado octavo" aria-label="Para quién es" />
            <div className="lab__checks">
              {WHO.map((w) => (
                <button key={w} type="button" className="lab__check" onClick={() => { set('usuarios', w); sfx.pop(); }}>
                  {w}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="stone slab__f" style={{ '--c': 'var(--mint)' } as React.CSSProperties}>
            <legend>
              <b>3</b> ¿Cómo se juega o se usa?
            </legend>
            <textarea className="input" rows={3} value={f.funciona} onChange={(e) => set('funciona', e.target.value)} placeholder="Ej.: muevo la nave con las flechas, gano puntos con cada estrella y pierdo una vida con cada meteorito" aria-label="Cómo funciona" />
          </fieldset>

          <fieldset className="stone slab__f" style={{ '--c': 'var(--amber)' } as React.CSSProperties}>
            <legend>
              <b>4</b> ¿Cómo se ve? <small>estilo</small>
            </legend>
            <input className="input" value={f.estilo} onChange={(e) => set('estilo', e.target.value)} placeholder="Ej.: espacio, colores neón, estilo retro" aria-label="Estilo visual" />
            <div className="lab__checks">
              {LOOK.map((w) => (
                <button key={w} type="button" className="lab__check" onClick={() => { set('estilo', w); sfx.pop(); }}>
                  🎨 {w}
                </button>
              ))}
            </div>
          </fieldset>

          <button type="button" className="btn btn--ghost" onClick={() => { setFields(EMPTY_STUDENT); sfx.whoosh(); }}>
            <RotateCcw /> Empezar de nuevo
          </button>
        </form>

        <div className="lab__out glass">
          <div className="lab__chat-bar">
            <i /> <i /> <i />
            <span>Tu prompt para AI Studio</span>
          </div>
          <div className="lab__out-head">
            <span className="kicker">Se arma solo mientras escribes</span>
            {missing.length > 0 ? <span className="chip chip--warn">Faltan {missing.length} campos</span> : <span className="chip chip--live">Completo</span>}
          </div>
          <textarea className="input lab__textarea" value={prompt} readOnly rows={compact ? 9 : 10} aria-label="Tu prompt" />
          <div className="lab__actions">
            <CopyButton text={prompt} label="Copiar prompt" className="btn--primary btn--lg" />
            <a className="btn btn--lg" href={AI_STUDIO_URL} target="_blank" rel="noopener noreferrer">
              Abrir AI Studio <ExternalLink />
            </a>
          </div>
          <p className="note-muted">Pégalo en la sección Build de Google AI Studio. Los campos vacíos quedan entre [CORCHETES]: complétalos antes de enviarlo.</p>
        </div>
      </div>
    </section>
  );
}
