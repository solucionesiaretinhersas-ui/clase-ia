import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Check, ExternalLink, HeartHandshake, RotateCcw, Zap } from 'lucide-react';
import { CheckinBars } from '../components/CheckinBars';
import { CopyButton } from '../components/ui';
import { STUDENT_REFINEMENTS } from '../data/prompts';
import { useWorkshop } from '../data/workshops';
import { confetti } from '../lib/confetti';
import { sfx } from '../lib/sfx';
import { usePersistentState } from '../lib/storage';
import { AI_STUDIO_URL } from '../lib/urls';
import { LIVE_SYNC_AVAILABLE, useLiveResponses, useParticipants, useSessionCode } from '../lib/sync';
import { useAnnounce } from '../presenter/announce';
import { usePresenter } from '../presenter/context';

interface Mission {
  emoji: string;
  title: string;
  min: number;
  color: string;
  tasks: string[];
}

const MISSIONS: Mission[] = [
  { emoji: '💡', title: 'Idea y prompt', min: 6, color: 'var(--amber)', tasks: ['Escribí mi idea en una frase', 'Completé mi prompt en “Mi prompt”', 'Copié mi prompt'] },
  { emoji: '🪄', title: 'Genera tu app', min: 6, color: 'var(--violet)', tasks: ['Abrí Build en Google AI Studio', 'Pegué mi prompt y lo envié', 'Apareció la primera versión de mi app'] },
  { emoji: '🔍', title: 'Prueba y mejora', min: 14, color: 'var(--cyan)', tasks: ['Probé mi app como si fuera otra persona', 'Pedí UN cambio con un poder', 'Probé el cambio y funcionó'] },
  { emoji: '🚀', title: 'Potencia con IA', min: 8, color: 'var(--mint)', tasks: ['Le pedí una función con IA a mi app', 'Le puse un nombre y un estilo que me gustan', 'Sé explicar con mis palabras qué hace'] },
];

const LEVELS = [
  { at: 0, name: 'Aprendiz', emoji: '🌱' },
  { at: 4, name: 'Creador', emoji: '🛠️' },
  { at: 8, name: 'Inventor', emoji: '⚡' },
  { at: 12, name: 'Maestro de apps', emoji: '👑' },
];

const POWER_EMOJI: Record<string, string> = {
  'Agrega IA con Gemini': '🤖',
  'Más niveles y puntos': '🏆',
  'Cambia el estilo': '🎨',
  'Ajusta la dificultad': '🎚️',
  'Animaciones y sonido': '🔊',
  'Corregir un error': '🩹',
  'Explícame el código': '🔎',
};

const CHECK = ['¡Listo!', 'Voy en proceso', 'Necesito ayuda'];

/** Taller de estudiantes en formato de misiones: cada tarea suma puntos y sube de nivel. */
export function StudentWorkshop() {
  const ws = useWorkshop();
  const [mission, setMission] = usePersistentState('estudiante:mision', 0);
  const [done, setDone] = usePersistentState<string[]>('estudiante:tareas', []);
  const { goTo } = usePresenter();
  const [chest, setChest] = useState(false);

  const total = MISSIONS.reduce((s, m) => s + m.tasks.length, 0);
  const xp = done.length;
  const level = [...LEVELS].reverse().find((l) => xp >= l.at) ?? LEVELS[0];
  const nextLevel = LEVELS.find((l) => l.at > xp);
  const m = MISSIONS[mission];

  // Celebra al subir de nivel
  const lastLevel = useRef(level.name);
  useEffect(() => {
    if (lastLevel.current !== level.name) {
      lastLevel.current = level.name;
      sfx.win();
      confetti({ count: 140, y: 0.5 });
    }
  }, [level.name]);

  // Avance en vivo: cada estudiante marca desde su celular cómo va en la misión actual.
  const { code } = useSessionCode();
  const people = useParticipants(LIVE_SYNC_AVAILABLE ? code : '', ws.audience);
  const live = useLiveResponses(LIVE_SYNC_AVAILABLE ? code : '', `e-taller-${mission}`);
  const counts = CHECK.map((_, i) => live.responses.filter((r) => r.value === String(i)).length);
  useAnnounce('e-taller', { key: `e-taller-${mission}`, kind: 'choice', prompt: `Misión ${mission + 1}: ${m.title}. ¿Cómo vas?`, options: CHECK, open: true });

  const key = (mi: number, ti: number) => `${mi}.${ti}`;
  const toggle = (mi: number, ti: number) => {
    const k = key(mi, ti);
    setDone((d) => (d.includes(k) ? d.filter((x) => x !== k) : [...d, k]));
    done.includes(k) ? sfx.pop() : sfx.ok();
  };
  const missionDone = (mi: number) => MISSIONS[mi].tasks.every((_, ti) => done.includes(key(mi, ti)));

  return (
    <section className="quest enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">Momento 4 · Crea y mejora</span>
          <h2 className="h-xl">
            Tu turno: <span className="grad-text">crea tu app</span>
          </h2>
        </div>
        <div className="practice__links">
          <button type="button" className="btn btn--lg" onClick={() => goTo('e-lab')}>
            Mi prompt
          </button>
          <a className="btn btn--primary btn--lg" href={AI_STUDIO_URL} target="_blank" rel="noopener noreferrer">
            AI Studio <ExternalLink />
          </a>
        </div>
      </header>

      <div className="quest__xp glass" aria-live="polite">
        <span className="quest__level">
          <b>{level.emoji}</b> {level.name}
        </span>
        <div className="quest__bar" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={xp} aria-label="Progreso de misiones">
          <i style={{ width: `${(xp / total) * 100}%` }} />
          {LEVELS.slice(1).map((l) => (
            <u key={l.name} style={{ left: `${(l.at / total) * 100}%` }} className={xp >= l.at ? 'is-on' : ''} title={l.name} />
          ))}
        </div>
        <span className="quest__pts">
          <Zap /> {xp * 10} pts {nextLevel ? `· faltan ${(nextLevel.at - xp) * 10} para ${nextLevel.name}` : '· ¡nivel máximo!'}
        </span>
      </div>

      <ol className="quest__missions">
        {MISSIONS.map((x, i) => (
          <li key={x.title} style={{ '--c': x.color } as CSSProperties}>
            <button type="button" className={`mcard ${i === mission ? 'is-active' : ''} ${missionDone(i) ? 'is-done' : ''}`} onClick={() => { setMission(i); sfx.pop(); }} aria-pressed={i === mission}>
              <span className="mcard__emoji">{missionDone(i) ? '✅' : x.emoji}</span>
              <strong>{x.title}</strong>
              <small>
                {x.tasks.filter((_, ti) => done.includes(key(i, ti))).length}/{x.tasks.length} · ~{x.min} min
              </small>
            </button>
          </li>
        ))}
      </ol>

      <article className="quest__card glass" key={mission} style={{ '--c': m.color } as CSSProperties}>
        <h3>
          {m.emoji} Misión {mission + 1}: {m.title}
        </h3>
        <ul className="quest__tasks">
          {m.tasks.map((t, ti) => {
            const on = done.includes(key(mission, ti));
            return (
              <li key={t}>
                <button type="button" className={`task ${on ? 'is-on' : ''}`} onClick={() => toggle(mission, ti)} aria-pressed={on}>
                  <span className="task__box">{on && <Check />}</span>
                  <span>{t}</span>
                  <em>+10</em>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="quest__nav">
          <button type="button" className="btn" onClick={() => setMission(Math.max(0, mission - 1))} disabled={mission === 0}>
            Misión anterior
          </button>
          <button type="button" className="btn btn--primary" onClick={() => setMission(Math.min(MISSIONS.length - 1, mission + 1))} disabled={mission === MISSIONS.length - 1}>
            Siguiente misión
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => setDone([])}>
            <RotateCcw /> Reiniciar misiones
          </button>
        </div>
      </article>

      {LIVE_SYNC_AVAILABLE && <CheckinBars title={`Misión ${mission + 1} · ${m.title}`} labels={CHECK} counts={counts} total={people.length} />}

      <aside className="human-note" role="note">
        <HeartHandshake />
        <p>
          <b>Tú diriges.</b> La IA escribe el código, pero las ideas, los cambios y las decisiones son tuyos. Pruébala siempre y pregúntate si de verdad hace lo que querías.
        </p>
      </aside>

      <div className="chest">
        <button type="button" className="btn btn--lg" onClick={() => { setChest((v) => !v); sfx.pop(); }} aria-expanded={chest}>
          🧰 {chest ? 'Cerrar el cofre de poderes' : 'Abrir el cofre de poderes'}
        </button>
        {chest && (
          <div className="refine__grid">
            {STUDENT_REFINEMENTS.map((r) => (
              <article key={r.title} className="refine__card glass power">
                <strong>
                  <span>{POWER_EMOJI[r.title] ?? '✨'}</span> {r.title}
                </strong>
                <p>{r.prompt}</p>
                <CopyButton text={r.prompt} />
              </article>
            ))}
          </div>
        )}
      </div>
      <p className="note-muted">Reemplaza lo que aparece entre [CORCHETES]. No compartas datos personales en tu app ni en los prompts.</p>
    </section>
  );
}
