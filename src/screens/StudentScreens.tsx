import { useState, type CSSProperties } from 'react';
import { Play, TriangleAlert } from 'lucide-react';
import { Art, type ArtName } from '../components/MuralArt';
import { sfx } from '../lib/sfx';

/* ═════════ Momento 1 · ¿Qué es la inteligencia artificial? ═════════ */

interface Pillar {
  art: ArtName;
  title: string;
  text: string;
  example: string;
  color: string;
}

const PILLARS: Pillar[] = [
  { art: 'book', title: 'Aprende de ejemplos', text: 'Ve millones de textos, imágenes y datos.', example: 'Para reconocer un gato, ve miles de fotos de gatos.', color: 'var(--blue)' },
  { art: 'planet', title: 'Encuentra patrones', text: 'Descubre qué suele ir junto con qué.', example: 'Aprende que “cuando llueve” suele ir con “paraguas”.', color: 'var(--violet)' },
  { art: 'robot', title: 'Genera respuestas', text: 'Crea texto, imágenes o código con lo más probable.', example: 'Escribe una historia palabra por palabra, eligiendo la que mejor encaja.', color: 'var(--cyan)' },
];

interface UseCase {
  emoji: string;
  name: string;
  how: string;
}

const USES: UseCase[] = [
  { emoji: '🎬', name: 'Videos recomendados', how: 'Aprende de lo que ves para adivinar qué te va a gustar.' },
  { emoji: '📸', name: 'Filtros de la cámara', how: 'Reconoce tu cara y dónde están tus ojos y tu nariz.' },
  { emoji: '🌍', name: 'Traductores', how: 'Aprendió de millones de textos en muchos idiomas.' },
  { emoji: '🎙️', name: 'Asistentes de voz', how: 'Convierte tu voz en texto y entiende lo que pides.' },
  { emoji: '⌨️', name: 'Autocompletar', how: 'Predice la siguiente palabra que vas a escribir.' },
  { emoji: '🎮', name: 'Rivales de videojuegos', how: 'Aprenden de tu forma de jugar para retarte.' },
];

export function WhatIsAI() {
  const [flip, setFlip] = useState<number | null>(null);
  const [uses, setUses] = useState<number[]>([]);
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="kid enter">
      <header className="screen-head">
        <span className="kicker">Momento 1 · Curiosidad</span>
        <h2 className="h-xl">
          ¿Qué es la <span className="grad-text">inteligencia artificial</span>?
        </h2>
        <p className="lead">Un programa que aprende de muchísimos ejemplos para reconocer patrones y ayudarte a crear. ¡Toca las tarjetas!</p>
      </header>

      <ul className="kid__pillars">
        {PILLARS.map((p, i) => (
          <li key={p.title} style={{ '--c': p.color, '--i': i } as CSSProperties}>
            <button
              type="button"
              className={`kcard ${flip === i ? 'is-flip' : ''}`}
              onClick={() => {
                setFlip(flip === i ? null : i);
                sfx.pop();
              }}
              aria-pressed={flip === i}
            >
              <Art name={p.art} className="kcard__art" />
              <strong>{p.title}</strong>
              <p>{flip === i ? p.example : p.text}</p>
              <small>{flip === i ? 'Un ejemplo' : 'Toca para ver un ejemplo'}</small>
            </button>
          </li>
        ))}
      </ul>

      <div className="kid__uses">
        <h3>
          ¿Cuáles de estas usas tú? <small>Toca las que usas y descubre cómo funcionan.</small>
        </h3>
        <ul>
          {USES.map((u, i) => (
            <li key={u.name}>
              <button
                type="button"
                className={`usetile ${uses.includes(i) ? 'is-on' : ''} ${open === i ? 'is-open' : ''}`}
                onClick={() => {
                  setUses((s) => (s.includes(i) ? s : [...s, i]));
                  setOpen(open === i ? null : i);
                  sfx.pop();
                }}
              >
                <span className="usetile__emoji">{u.emoji}</span>
                <strong>{u.name}</strong>
                {open === i && <small>{u.how}</small>}
              </button>
            </li>
          ))}
        </ul>
        <p className="kid__count" aria-live="polite">
          {uses.length === 0 ? 'Aún no has tocado ninguna.' : `Ya tocaste ${uses.length} de ${USES.length}: ¡la IA está en todas partes!`}
        </p>
      </div>
    </section>
  );
}

/* ═════════ Momento 2 · Así aprende una IA ═════════ */

const STEPS = [
  { title: 'Datos', emoji: '📚', art: 'book' as ArtName, text: 'Se le muestran millones de ejemplos: textos, imágenes, conversaciones.' },
  { title: 'Modelo', emoji: '🧠', art: 'robot' as ArtName, text: 'Ajusta miles de millones de números para recordar qué suele ir con qué.' },
  { title: 'Predicción', emoji: '✨', art: 'star' as ArtName, text: 'Cuando le preguntas, calcula la respuesta más probable, palabra por palabra.' },
];
const PROBS = [
  { w: 'paraguas', p: 72 },
  { w: 'ruana', p: 18 },
  { w: 'sombrilla', p: 8 },
  { w: 'bufanda', p: 2 },
];

export function HowAI() {
  const [i, setI] = useState(0);
  const [run, setRun] = useState(false);
  const s = STEPS[i];

  const play = () => {
    setRun(false);
    window.setTimeout(() => setRun(true), 30);
    sfx.whoosh();
  };

  return (
    <section className="kid enter">
      <header className="screen-head">
        <span className="kicker">Momento 2 · Cómo funciona</span>
        <h2 className="h-xl">
          Así <span className="grad-text">aprende</span> una IA
        </h2>
        <p className="lead">Como el autocompletar de tu celular, pero con millones de ejemplos.</p>
      </header>

      <ol className="kid__flow">
        {STEPS.map((x, k) => (
          <li key={x.title} className={k === i ? 'is-on' : k < i ? 'is-past' : ''}>
            <button
              type="button"
              onClick={() => {
                setI(k);
                sfx.pop();
              }}
              aria-pressed={k === i}
            >
              <span className="kid__flow-emoji">{x.emoji}</span>
              <b>{k + 1}</b>
              <strong>{x.title}</strong>
            </button>
          </li>
        ))}
      </ol>

      <article className="kid__panel glass" key={i}>
        <Art name={s.art} className="kid__panel-art" />
        <div>
          <h3>
            {s.emoji} {s.title}
          </h3>
          <p>{s.text}</p>
          {i === 2 && (
            <div className="kid__predict" aria-label="Ejemplo de predicción">
              <button type="button" className="btn btn--primary" onClick={play}>
                <Play /> Ver cómo piensa
              </button>
              <p>
                “Cuando llueve mucho, saco mi <b>{run ? 'paraguas' : '____'}</b>”
              </p>
              {run &&
                PROBS.map((r, k) => (
                  <div key={r.w} className="kid__bar" style={{ '--d': `${k * 0.15}s` } as CSSProperties}>
                    <span>{r.w}</span>
                    <i>
                      <u style={{ width: `${r.p}%` }} />
                    </i>
                    <em>{r.p}%</em>
                  </div>
                ))}
            </div>
          )}
        </div>
      </article>

      <p className="kid__warn">
        <TriangleAlert /> Como solo calcula lo más probable, la IA a veces se equivoca <b>con total seguridad</b>. Por eso verificamos.
      </p>
    </section>
  );
}
