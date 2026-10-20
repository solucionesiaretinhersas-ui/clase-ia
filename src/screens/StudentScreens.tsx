import { useState } from 'react';
import { Brain, Database, Globe, MessageSquareText, Search, Smartphone, Sparkles, TriangleAlert, Wand2 } from 'lucide-react';

/* ── Momento 1 · ¿Qué es la inteligencia artificial? ── */
const PILLARS = [
  { icon: Database, title: 'Aprende de ejemplos', text: 'Ve millones de textos, imágenes y datos.' },
  { icon: Search, title: 'Encuentra patrones', text: 'Descubre qué suele ir junto con qué.' },
  { icon: MessageSquareText, title: 'Genera respuestas', text: 'Crea texto, imágenes o código con lo más probable.' },
];
const EXAMPLES = ['Recomendaciones de videos', 'Filtros de la cámara', 'Traductores', 'Asistentes de voz', 'Autocompletar del celular'];

export function WhatIsAI() {
  return (
    <section className="stu enter">
      <header className="screen-head">
        <span className="kicker">Momento 1 · Curiosidad</span>
        <h2 className="h-xl">
          ¿Qué es la <span className="grad-text">inteligencia artificial</span>?
        </h2>
        <p className="lead">Un programa que aprende de muchísimos ejemplos para reconocer patrones y ayudarte a crear.</p>
      </header>
      <div className="stu__cards">
        {PILLARS.map(({ icon: Icon, title, text }, i) => (
          <article key={title} className="stu__card glass" style={{ animationDelay: `${i * 0.08}s` }}>
            <Icon />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <ul className="stu__chips" aria-label="Ejemplos de IA en la vida diaria">
        {EXAMPLES.map((e) => (
          <li key={e} className="chip">
            {e}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── Momento 2 · Así aprende una IA ── */
const STEPS = [
  { title: 'Datos', icon: Database, text: 'Se le muestran millones de ejemplos: textos, imágenes, conversaciones.' },
  { title: 'Modelo', icon: Brain, text: 'Ajusta miles de millones de números para recordar qué suele ir con qué.' },
  { title: 'Predicción', icon: Sparkles, text: 'Cuando le preguntas, calcula la respuesta más probable, palabra por palabra.' },
];
const PROBS = [
  { w: 'paraguas', p: 72 },
  { w: 'ruana', p: 18 },
  { w: 'sombrilla', p: 8 },
  { w: 'bufanda', p: 2 },
];

export function HowAI() {
  const [i, setI] = useState(0);
  const s = STEPS[i];
  const Icon = s.icon;
  return (
    <section className="stu enter">
      <header className="screen-head">
        <span className="kicker">Momento 2 · Cómo funciona</span>
        <h2 className="h-xl">Así aprende una IA</h2>
      </header>
      <ol className="stu__steps">
        {STEPS.map((x, k) => (
          <li key={x.title}>
            <button type="button" className={k === i ? 'is-on' : k < i ? 'is-past' : ''} onClick={() => setI(k)} aria-pressed={k === i}>
              <b>{k + 1}</b> {x.title}
            </button>
          </li>
        ))}
      </ol>
      <article className="stu__panel glass" key={i}>
        <Icon className="stu__panel-icon" />
        <p className="stu__panel-text">{s.text}</p>
        {i === 2 && (
          <div className="stu__predict" aria-label="Ejemplo de predicción">
            <p>
              “Cuando llueve mucho, saco mi <b>____</b>”
            </p>
            {PROBS.map((r) => (
              <div key={r.w} className="stu__bar">
                <span>{r.w}</span>
                <i style={{ width: `${r.p}%` }} />
                <em>{r.p}%</em>
              </div>
            ))}
          </div>
        )}
      </article>
      <p className="stu__note">
        <TriangleAlert /> Como solo calcula lo más probable, la IA a veces se equivoca con total seguridad. Por eso verificamos.
      </p>
    </section>
  );
}

/* ── Momento 3 · Crear con Google AI Studio ── */
const APPS = ['Juego de memoria', 'Quiz de tu materia', 'Simulador de ciencias', 'Historia interactiva', 'Asistente de tareas', 'Generador de ideas'];

export function StudioForStudents() {
  return (
    <section className="stu enter">
      <header className="screen-head">
        <span className="kicker">Momento 3 · Crear</span>
        <h2 className="h-xl">
          Crea lo que <span className="grad-text">imagines</span>
        </h2>
        <p className="lead">En Google AI Studio describes tu idea y se convierte en una aplicación que puedes probar.</p>
      </header>
      <div className="stu__split">
        <ul className="stu__facts">
          <li>
            <Sparkles />
            <div>
              <strong>Modelos de Google para empezar gratis*</strong>
              <span>Puedes usar los modelos de Google con un nivel gratuito. *Tiene límites de uso y las condiciones pueden cambiar.</span>
            </div>
          </li>
          <li>
            <Globe />
            <div>
              <strong>Aplicaciones web</strong>
              <span>Funcionan en el navegador, en celular y computador. Las de Android son posibles pero más complejas.</span>
            </div>
          </li>
          <li>
            <Wand2 />
            <div>
              <strong>Con IA adentro</strong>
              <span>Tu app también puede usar inteligencia artificial: dar pistas, inventar preguntas, conversar.</span>
            </div>
          </li>
        </ul>
        <div className="stu__ideas">
          <h3>
            <Smartphone /> ¿Qué podrías crear?
          </h3>
          <ul>
            {APPS.map((a, k) => (
              <li key={a} style={{ animationDelay: `${k * 0.06}s` }}>
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ── Momento 3 · Programar escribiendo (vibe coding) ── */
const LOOP = [
  { title: 'Describes', text: 'Escribes lo que quieres con tus palabras.' },
  { title: 'La IA programa', text: 'Genera el código de tu aplicación.' },
  { title: 'Pruebas', text: 'La usas y ves si hace lo que querías.' },
  { title: 'Mejoras', text: 'Pides cambios y repites el ciclo.' },
];

export function VibeCoding() {
  const [i, setI] = useState(0);
  return (
    <section className="stu enter">
      <header className="screen-head">
        <span className="kicker">Momento 3 · Programar escribiendo</span>
        <h2 className="h-xl">
          Programar con IA es <span className="grad-text">conversar</span>
        </h2>
        <p className="lead">Programar es darle instrucciones a un computador. Ahora puedes escribirlas en lenguaje natural: tú diriges, la IA escribe el código.</p>
      </header>
      <div className="stu__split">
        <div className="stu__loop" role="list">
          {LOOP.map((x, k) => (
            <button key={x.title} type="button" role="listitem" className={`stu__loop-item ${k === i ? 'is-on' : ''}`} onClick={() => setI(k)}>
              <b>{k + 1}</b>
              <span>
                <strong>{x.title}</strong>
                <small>{x.text}</small>
              </span>
            </button>
          ))}
        </div>
        <div className="stu__code glass" aria-label="Ejemplo">
          <span className="kicker">Tú escribes</span>
          <p>“Crea un juego donde atrapo estrellas con la nave y esquivo meteoritos. Que tenga puntos y tres vidas.”</p>
          <span className="kicker">La IA responde con</span>
          <p>Un juego funcionando que puedes probar. Si no te gusta algo, lo dices y lo cambia.</p>
        </div>
      </div>
    </section>
  );
}
