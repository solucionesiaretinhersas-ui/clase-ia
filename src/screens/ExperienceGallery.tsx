import { useState, type ReactNode } from 'react';
import { BookOpen, FlaskConical, Gamepad2, ListChecks, MessagesSquare, SlidersHorizontal, Wand2, type LucideIcon } from 'lucide-react';
import { ActivityControls, useActivityStatus } from '../components/ActivityShell';
import { CopyButton } from '../components/ui';
import { useAnnounce } from '../presenter/announce';
import { LIVE_SYNC_AVAILABLE, useLiveResponses, useSessionCode } from '../lib/sync';

interface Kind {
  id: string;
  title: string;
  icon: LucideIcon;
  text: string;
  areas: string;
  example: string;
  mock: ReactNode;
}

const KINDS: Kind[] = [
  {
    id: 'quiz',
    title: 'Quiz con retroalimentación',
    icon: ListChecks,
    text: 'Preguntas que dan pistas y explican cada respuesta al instante.',
    areas: 'Todas las áreas',
    example: 'Crea un quiz de 8 preguntas sobre [TEMA] para [GRADO], con pistas y una explicación breve después de cada respuesta.',
    mock: (
      <div className="mock mock--quiz">
        <i className="is-bar" />
        <i />
        <i className="is-ok" />
        <i />
      </div>
    ),
  },
  {
    id: 'simulador',
    title: 'Simulador',
    icon: SlidersHorizontal,
    text: 'El estudiante cambia variables y observa qué ocurre.',
    areas: 'Ciencias, Matemáticas, Tecnología',
    example: 'Crea un simulador de [FENÓMENO] donde el estudiante pueda cambiar [VARIABLES] con controles deslizantes y ver el resultado al instante.',
    mock: (
      <div className="mock mock--sim">
        <i className="is-slider" />
        <i className="is-slider is-short" />
        <b />
      </div>
    ),
  },
  {
    id: 'juego',
    title: 'Juego de retos',
    icon: Gamepad2,
    text: 'Niveles, puntos y vidas para practicar sin darse cuenta.',
    areas: 'Matemáticas, Lengua, Inglés',
    example: 'Crea un juego de [HABILIDAD] con 3 niveles, puntos, vidas y una pantalla final con el resultado, para [GRADO].',
    mock: (
      <div className="mock mock--game">
        <i className="is-bar" />
        <span>★</span>
        <span>★</span>
        <span className="is-off">★</span>
      </div>
    ),
  },
  {
    id: 'historia',
    title: 'Historia interactiva',
    icon: BookOpen,
    text: 'El estudiante decide y ve las consecuencias de sus decisiones.',
    areas: 'Sociales, Lengua, Ética',
    example: 'Crea una historia interactiva sobre [SITUACIÓN] donde el estudiante toma 4 decisiones y descubre sus consecuencias, para [GRADO].',
    mock: (
      <div className="mock mock--story">
        <i />
        <div>
          <b />
          <b />
        </div>
      </div>
    ),
  },
  {
    id: 'tutor',
    title: 'Tutor socrático',
    icon: MessagesSquare,
    text: 'Un guía que pregunta en lugar de dar la respuesta.',
    areas: 'Todas las áreas',
    example: 'Crea un tutor que enseñe [TEMA] a [GRADO] haciendo UNA pregunta a la vez, dando pistas y sin revelar la respuesta final.',
    mock: (
      <div className="mock mock--chat">
        <i />
        <i className="is-me" />
        <i />
      </div>
    ),
  },
  {
    id: 'laboratorio',
    title: 'Laboratorio de práctica',
    icon: FlaskConical,
    text: 'Ejercicios nuevos cada vez, con ayuda paso a paso.',
    areas: 'Matemáticas, Física, Química',
    example: 'Crea un laboratorio que genere ejercicios de [TEMA] de dificultad creciente para [GRADO], con ayuda paso a paso y solución al final.',
    mock: (
      <div className="mock mock--lab">
        <i />
        <i />
        <i />
        <i />
      </div>
    ),
  },
];

const STEPS = ['Describe', 'Genera', 'Prueba', 'Mejora'];

/** Reemplaza la charla sobre AI Studio: qué se puede crear, visto y elegido por los docentes. */
export function ExperienceGallery() {
  const [status] = useActivityStatus('experiencias');
  const { code } = useSessionCode();
  const live = useLiveResponses(LIVE_SYNC_AVAILABLE ? code : '', 'experiencias');
  const [sel, setSel] = useState(0);
  const votes = KINDS.map((_, i) => live.responses.filter((r) => r.value === String(i)).length);
  const total = votes.reduce((a, b) => a + b, 0);
  const top = total ? votes.indexOf(Math.max(...votes)) : -1;
  const k = KINDS[sel];
  const Icon = k.icon;

  useAnnounce('ai-studio', {
    key: 'experiencias',
    kind: 'choice',
    prompt: '¿Qué tipo de experiencia te gustaría crear hoy?',
    options: KINDS.map((x) => x.title),
    open: status === 'open',
  });

  return (
    <section className="xp enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">Explorar lo posible · con Google AI Studio</span>
          <h2 className="h-lg">
            ¿Qué <span className="grad-text">experiencia</span> quieres crear?
          </h2>
        </div>
        <ActivityControls id="experiencias" openLabel="Abrir votación" />
      </header>

      <div className="xp__grid">
        <ul className="xp__cards">
          {KINDS.map((x, i) => {
            const I = x.icon;
            return (
              <li key={x.id}>
                <button type="button" className={`xp__card ${i === sel ? 'is-on' : ''} ${i === top ? 'is-top' : ''}`} onClick={() => setSel(i)} aria-pressed={i === sel}>
                  <span className="xp__ico">
                    <I />
                  </span>
                  <strong>{x.title}</strong>
                  {LIVE_SYNC_AVAILABLE && total > 0 && (
                    <span className="xp__votes" aria-label={`${votes[i]} votos`}>
                      <i style={{ width: `${(votes[i] / Math.max(1, ...votes)) * 100}%` }} />
                      <b>{votes[i]}</b>
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <article className="xp__detail glass" key={k.id}>
          <div className="xp__detail-top">
            <span className="xp__ico xp__ico--lg">
              <Icon />
            </span>
            <div>
              <h3>{k.title}</h3>
              <p>{k.text}</p>
              <span className="chip">Ideal para: {k.areas}</span>
            </div>
          </div>
          <div className="xp__preview" aria-hidden="true">
            {k.mock}
          </div>
          <div className="xp__prompt">
            <span className="kicker">
              <Wand2 /> Así se lo pides a Build
            </span>
            <p>“{k.example}”</p>
            <CopyButton text={k.example} label="Copiar ejemplo" />
          </div>
        </article>
      </div>

      <ol className="xp__loop" aria-label="Ciclo de creación en Build">
        {STEPS.map((s, i) => (
          <li key={s}>
            <b>{i + 1}</b> {s}
          </li>
        ))}
        <li className="xp__loop-note">Sin programar: tú describes, Gemini construye, tú decides.</li>
      </ol>
    </section>
  );
}
