import { useState } from 'react';
import { Check, ChevronDown, ScanSearch } from 'lucide-react';
import { CopyButton } from './ui';
import { usePersistentState } from '../lib/storage';

export interface Criterion {
  title: string;
  review: string;
  fix: string;
  prompt: string;
}

/** Lupa pedagógica: criterios para revisar un recurso generado con IA. */
export const CRITERIA: Criterion[] = [
  {
    title: 'Pertinencia curricular',
    review: '¿Responde al tema, al grado y al objetivo de aprendizaje que planeaste? ¿Se relaciona con tus estándares o DBA?',
    fix: 'Quita lo que no aporta al objetivo y pide que se centre en lo que sí.',
    prompt: 'Ajusta el recurso al objetivo de aprendizaje [OBJETIVO] para estudiantes de [GRADO]. Elimina lo que no contribuya a ese objetivo y explícame qué quitaste.',
  },
  {
    title: 'Exactitud del contenido',
    review: '¿Los datos, conceptos, fechas y cálculos son correctos? Compáralos con una fuente confiable: la IA puede equivocarse con seguridad.',
    fix: 'Verifica en tu libro o fuente de referencia y pide corregir lo que esté mal.',
    prompt: 'Revisa la exactitud del contenido sobre [TEMA]. Señala cualquier afirmación dudosa, corrige los errores y dime qué cambiaste y por qué.',
  },
  {
    title: 'Claridad de las instrucciones',
    review: '¿Un estudiante entiende qué hacer sin ayuda? ¿Las instrucciones son cortas, ordenadas y con lenguaje del grado?',
    fix: 'Pide frases cortas, pasos numerados y un ejemplo resuelto.',
    prompt: 'Reescribe todas las instrucciones con frases cortas y pasos numerados, en un lenguaje adecuado para [GRADO], e incluye un ejemplo resuelto.',
  },
  {
    title: 'Calidad pedagógica',
    review: '¿Hay interacción real? ¿La retroalimentación explica el porqué? ¿Hay progresión y una evaluación coherente con el objetivo?',
    fix: 'Pide más participación del estudiante y retroalimentación que explique y permita reintentar.',
    prompt: 'Mejora la calidad pedagógica: que el estudiante decida y pruebe, que la retroalimentación explique por qué una respuesta es correcta o no, y que pueda intentarlo de nuevo.',
  },
  {
    title: 'Accesibilidad',
    review: '¿Hay buen contraste y texto grande? ¿Se entiende sin depender solo del color? ¿Se puede usar con el dedo y con teclado?',
    fix: 'Pide más contraste, textos más grandes, botones amplios y etiquetas claras.',
    prompt: 'Mejora la accesibilidad: texto más grande, buen contraste, no depender solo del color para indicar aciertos, botones grandes y uso con teclado y con pantalla táctil.',
  },
  {
    title: 'Usabilidad',
    review: '¿La navegación es intuitiva? ¿Se ve bien proyectado en el tablero y en el celular? ¿Se sabe siempre dónde estás y qué sigue?',
    fix: 'Simplifica la navegación y haz que se vea bien en tablero y celular.',
    prompt: 'Haz la navegación más simple e intuitiva, con indicador de progreso, y que se vea y se maneje bien proyectado en el tablero y en un celular.',
  },
  {
    title: 'Funcionamiento técnico',
    review: '¿Todos los botones hacen algo? ¿Hay errores al repetir o al equivocarse? ¿Funciona con conexión limitada?',
    fix: 'Describe qué hiciste y qué ocurrió, y pide corregirlo sin cambiar lo demás.',
    prompt: 'Hay un error: [DESCRIBE QUÉ HICISTE Y QUÉ PASÓ]. Corrígelo sin cambiar el resto del recurso y explícame qué modificaste.',
  },
];

export function Lupa({ compact = false }: { compact?: boolean }) {
  const [done, setDone] = usePersistentState<number[]>('taller:lupa', []);
  const [open, setOpen] = useState<number | null>(0);

  const toggle = (i: number) => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));

  return (
    <div className={`lupa2 ${compact ? 'lupa2--compact' : ''}`}>
      <div className="lupa2__head">
        <span>
          <ScanSearch /> Lupa pedagógica
        </span>
        <b>
          {done.length}/{CRITERIA.length} <small>revisados</small>
        </b>
      </div>
      <ul>
        {CRITERIA.map((c, i) => {
          const ok = done.includes(i);
          const isOpen = open === i;
          return (
            <li key={c.title} className={`${ok ? 'is-ok' : ''} ${isOpen ? 'is-open' : ''}`}>
              <div className="lupa2__row">
                <button type="button" className="lupa2__check" onClick={() => toggle(i)} aria-pressed={ok} aria-label={`${c.title}: ${ok ? 'revisado' : 'marcar como revisado'}`}>
                  {ok && <Check />}
                </button>
                <button type="button" className="lupa2__title" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
                  <span>{c.title}</span>
                  <ChevronDown />
                </button>
              </div>
              {isOpen && (
                <div className="lupa2__body">
                  <p>
                    <b>Qué se revisa:</b> {c.review}
                  </p>
                  <p>
                    <b>Cómo corregirlo:</b> {c.fix}
                  </p>
                  <CopyButton text={c.prompt} label="Copiar prompt de mejora" />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="note-muted">La lupa te sugiere qué mirar y cómo mejorar; no certifica que el recurso sea pedagógicamente correcto. Esa decisión es tuya.</p>
    </div>
  );
}
