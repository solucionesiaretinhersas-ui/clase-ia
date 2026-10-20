import { ArrowRight, Check, RotateCcw, X } from 'lucide-react';
import { ActivityControls, ActivityGate } from '../components/ActivityShell';
import { usePersistentState } from '../lib/storage';
import { usePresenter } from '../presenter/context';

const ID = 'construir';

interface Piece {
  key: string;
  label: string;
  hint: string;
  options: { text: string; good: boolean; why: string }[];
}

const PIECES: Piece[] = [
  {
    key: 'rol',
    label: 'Rol',
    hint: '¿Quién debe ser la IA?',
    options: [
      { text: 'Actúa como diseñador de experiencias educativas interactivas.', good: true, why: 'Un rol claro orienta el tipo de respuesta y su enfoque pedagógico.' },
      { text: 'Hazme algo para clase.', good: false, why: 'Sin rol ni intención, la IA adivina. El resultado suele ser genérico.' },
    ],
  },
  {
    key: 'tema',
    label: 'Tema y público',
    hint: '¿Qué se enseña y a quién?',
    options: [
      { text: 'Crea un recurso para enseñar el ciclo del agua a estudiantes de grado sexto.', good: true, why: 'Tema concreto y grado definido permiten ajustar lenguaje y dificultad.' },
      { text: 'Crea algo sobre ciencias para los estudiantes.', good: false, why: '“Ciencias” es demasiado amplio y “los estudiantes” no indica nivel.' },
    ],
  },
  {
    key: 'objetivo',
    label: 'Objetivo',
    hint: '¿Qué deben lograr?',
    options: [
      { text: 'El objetivo es que expliquen las etapas del ciclo y propongan dos acciones para cuidar el agua.', good: true, why: 'Un objetivo observable permite diseñar preguntas y evaluación coherentes.' },
      { text: 'El objetivo es que les guste el tema.', good: false, why: 'Gustar no se puede evaluar. Un buen objetivo describe lo que el estudiante hará.' },
    ],
  },
  {
    key: 'experiencia',
    label: 'Experiencia',
    hint: '¿Cómo debe sentirse?',
    options: [
      { text: 'Incluye explicación breve, ejemplos, actividades interactivas y preguntas con retroalimentación inmediata.', good: true, why: 'Nombrar los componentes evita recibir solo texto o diapositivas.' },
      { text: 'Haz un texto largo con toda la información.', good: false, why: 'Un texto largo es un documento, no una experiencia interactiva.' },
    ],
  },
  {
    key: 'tecnico',
    label: 'Requisitos técnicos',
    hint: '¿Dónde se usará?',
    options: [
      { text: 'Debe ser funcional, con navegación intuitiva y adaptable a computadores, tabletas y celulares.', good: true, why: 'Pedir adaptabilidad y funcionalidad evita maquetas estáticas.' },
      { text: 'Solo necesito que se vea bonito.', good: false, why: 'La estética sin funcionalidad produce una presentación decorativa.' },
    ],
  },
];

type Picks = Record<string, number | undefined>;

export function PromptBuilder() {
  const [picks, setPicks] = usePersistentState<Picks>(`activity:${ID}:data`, {});
  const { goTo } = usePresenter();
  const chosen = PIECES.filter((p) => picks[p.key] !== undefined);
  const good = PIECES.filter((p) => picks[p.key] !== undefined && p.options[picks[p.key]!].good).length;
  const complete = chosen.length === PIECES.length;

  return (
    <section className="builder enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">Momento 3 · Construye el prompt</span>
          <h2 className="h-lg">Elige la mejor pieza para cada parte</h2>
        </div>
        <ActivityControls id={ID} onReset={() => setPicks({})} />
      </header>

      <ActivityGate id={ID}>
        <div className="builder__grid">
          <div className="builder__pieces">
            {PIECES.map((p) => {
              const sel = picks[p.key];
              return (
                <div key={p.key} className={`piece ${sel !== undefined ? (p.options[sel].good ? 'is-good' : 'is-bad') : ''}`}>
                  <div className="piece__head">
                    <b>{p.label}</b>
                    <span>{p.hint}</span>
                  </div>
                  <div className="piece__opts">
                    {p.options.map((o, i) => (
                      <button key={i} type="button" className={`piece__opt ${sel === i ? 'is-sel' : ''}`} onClick={() => setPicks((s) => ({ ...s, [p.key]: i }))}>
                        {sel === i && (o.good ? <Check /> : <X />)}
                        {o.text}
                      </button>
                    ))}
                  </div>
                  {sel !== undefined && <p className="piece__why">{p.options[sel].why}</p>}
                </div>
              );
            })}
          </div>

          <aside className="builder__preview glass">
            <span className="kicker">Tu prompt</span>
            <p className="builder__text" aria-live="polite">
              {chosen.length === 0 && <em>Elige una pieza para empezar a armar el prompt.</em>}
              {chosen.map((p) => (
                <span key={p.key} className={p.options[picks[p.key]!].good ? '' : 'is-weak'}>
                  {p.options[picks[p.key]!].text}{' '}
                </span>
              ))}
            </p>
            <div className="meter" aria-label={`Calidad del prompt: ${good} de ${PIECES.length}`}>
              {PIECES.map((p) => (
                <i key={p.key} className={picks[p.key] === undefined ? '' : p.options[picks[p.key]!].good ? 'is-good' : 'is-bad'} />
              ))}
            </div>
            <p className="builder__score">
              {complete ? (good === PIECES.length ? 'Prompt completo y preciso. Listo para el laboratorio.' : `${good} de ${PIECES.length} piezas precisas. Cambia las marcadas en rojo.`) : `${chosen.length} de ${PIECES.length} piezas elegidas`}
            </p>
            <div className="builder__actions">
              <button type="button" className="btn btn--ghost" onClick={() => setPicks({})}>
                <RotateCcw /> Reiniciar
              </button>
              <button type="button" className="btn btn--primary" onClick={() => goTo('laboratorio')} disabled={good < PIECES.length}>
                Al laboratorio <ArrowRight />
              </button>
            </div>
          </aside>
        </div>
      </ActivityGate>
    </section>
  );
}
