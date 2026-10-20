import { ExternalLink, RotateCcw } from 'lucide-react';
import { CopyButton } from '../components/ui';
import { EMPTY_STUDENT, STUDENT_TYPES, buildStudentPrompt, missingStudent, type StudentFields } from '../data/prompts';
import { usePersistentState } from '../lib/storage';
import { AI_STUDIO_URL } from '../lib/urls';

/** Constructor del prompt del estudiante: idea → prompt listo para Google AI Studio (Build). */
export function StudentLab({ compact = false }: { compact?: boolean }) {
  const [stored, setFields] = usePersistentState<StudentFields>('lab:student', EMPTY_STUDENT);
  const f = { ...EMPTY_STUDENT, ...stored };
  const prompt = buildStudentPrompt(f);
  const missing = missingStudent(f);
  const set = (k: keyof StudentFields, v: string) => setFields((s) => ({ ...EMPTY_STUDENT, ...s, [k]: v }));

  return (
    <section className={`lab ${compact ? 'lab--compact' : 'enter'}`}>
      {!compact && (
        <header className="screen-head">
          <span className="kicker">Momento 4 · Tu prompt</span>
          <h2 className="h-lg">De tu idea a un prompt</h2>
        </header>
      )}
      <div className="lab__grid">
        <form className="lab__form glass" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span>¿Qué quieres crear?</span>
            <textarea className="input" rows={2} value={f.idea} onChange={(e) => set('idea', e.target.value)} placeholder="Ej.: un juego donde atrapo estrellas esquivando meteoritos" />
          </label>
          <label className="field">
            <span>Tipo de aplicación</span>
            <select className="input" value={f.tipo} onChange={(e) => set('tipo', e.target.value)}>
              {STUDENT_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>¿Para quién es?</span>
            <input className="input" value={f.usuarios} onChange={(e) => set('usuarios', e.target.value)} placeholder="Ej.: mis compañeros de grado octavo" />
          </label>
          <label className="field">
            <span>¿Cómo se juega o se usa?</span>
            <textarea className="input" rows={3} value={f.funciona} onChange={(e) => set('funciona', e.target.value)} placeholder="Ej.: muevo la nave con las flechas, gano puntos con cada estrella y pierdo una vida con cada meteorito" />
          </label>
          <label className="field">
            <span>¿Cómo se ve? (estilo)</span>
            <input className="input" value={f.estilo} onChange={(e) => set('estilo', e.target.value)} placeholder="Ej.: espacio, colores neón, estilo retro" />
          </label>
          <button type="button" className="btn btn--ghost" onClick={() => setFields(EMPTY_STUDENT)}>
            <RotateCcw /> Empezar de nuevo
          </button>
        </form>

        <div className="lab__out glass">
          <div className="lab__out-head">
            <span className="kicker">Tu prompt</span>
            {missing.length > 0 ? <span className="chip chip--warn">Faltan {missing.length} campos</span> : <span className="chip chip--live">Completo</span>}
          </div>
          <textarea className="input lab__textarea" value={prompt} readOnly rows={compact ? 9 : 10} aria-label="Tu prompt" />
          <div className="lab__actions">
            <CopyButton text={prompt} label="Copiar prompt" className="btn--primary btn--lg" />
            <a className="btn btn--lg" href={AI_STUDIO_URL} target="_blank" rel="noopener noreferrer">
              Abrir AI Studio <ExternalLink />
            </a>
          </div>
          <p className="note-muted">Pégalo en la sección Build de Google AI Studio. Los campos vacíos quedan entre [CORCHETES].</p>
        </div>
      </div>
    </section>
  );
}
