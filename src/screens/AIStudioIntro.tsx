import { FlaskConical, MessageSquareText, MonitorPlay, PencilLine, ShieldCheck, Sparkles } from 'lucide-react';

const CYCLE = [
  { icon: PencilLine, title: 'Describe', text: 'Escribes con tus palabras qué recurso necesitas.' },
  { icon: Sparkles, title: 'Genera', text: 'Gemini escribe el código de la aplicación.' },
  { icon: MonitorPlay, title: 'Prueba', text: 'La ves funcionando y la usas como un estudiante.' },
  { icon: MessageSquareText, title: 'Mejora', text: 'Pides cambios conversando, sin programar.' },
];

export function AIStudioIntro() {
  return (
    <section className="studio enter">
      <header className="screen-head">
        <span className="kicker">Momento 2 · Conocer</span>
        <h2 className="h-xl">
          Google AI Studio <span className="studio__build">Build</span>
        </h2>
        <p className="lead">Un espacio de Google donde describes una aplicación con lenguaje natural y la IA la construye.</p>
      </header>

      <div className="studio__body">
        <div className="cycle" role="list" aria-label="Ciclo de creación en Build">
          <svg className="cycle__ring" viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <linearGradient id="cycleGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#a78bfa" />
                <stop offset="0.5" stopColor="#5b8cff" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />
            <circle className="cycle__arc" cx="100" cy="100" r="78" fill="none" stroke="url(#cycleGrad)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="120 370" />
          </svg>
          {CYCLE.map(({ icon: Icon, title, text }, i) => (
            <div key={title} role="listitem" className={`cycle__node cycle__node--${i}`}>
              <span className="cycle__icon">
                <Icon />
              </span>
              <strong>{title}</strong>
              <span>{text}</span>
            </div>
          ))}
          <div className="cycle__center">
            <b>Tú</b>
            <span>diriges el diseño pedagógico</span>
          </div>
        </div>

        <ul className="studio__facts">
          <li>
            <FlaskConical />
            <div>
              <strong>Sin saber programar</strong>
              <span>El código lo escribe la IA; tú defines qué y para qué.</span>
            </div>
          </li>
          <li>
            <MonitorPlay />
            <div>
              <strong>Resultado funcional</strong>
              <span>No es un documento: es una aplicación que se puede usar.</span>
            </div>
          </li>
          <li>
            <ShieldCheck />
            <div>
              <strong>Criterio docente</strong>
              <span>Necesitas una cuenta de Google y revisar siempre el contenido generado.</span>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
