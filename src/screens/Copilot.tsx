const HUMAN = ['Conoces a tus estudiantes', 'Empatía y vínculo', 'Criterio pedagógico', 'Contexto de tu comunidad', 'Sabiduría y experiencia'];
const AI = ['Borradores en segundos', 'Ejemplos y variantes', 'Simuladores interactivos', 'Adaptar niveles y lenguaje', 'Disponible 24/7'];

export function Copilot() {
  return (
    <section className="copilot enter">
      <header className="screen-head">
        <span className="kicker">Momento 1 · Docencia aumentada</span>
        <h2 className="h-xl">
          La IA llegó para <span className="grad-text">ayudarte</span>,<br />
          no para reemplazarte
        </h2>
      </header>

      <div className="venn" role="img" aria-label="Diagrama: docente más inteligencia artificial es igual a docencia aumentada">
        <div className="venn__side venn__side--human">
          <b>Tú · el piloto</b>
          <ul>
            {HUMAN.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="venn__core">
          <span>Docencia</span>
          <strong>aumentada</strong>
        </div>
        <div className="venn__side venn__side--ai">
          <b>La IA · el copiloto</b>
          <ul>
            {AI.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="copilot__line">
        El docente <b>dirige</b>. La IA <b>propone</b>. La parte humana no se delega.
      </p>
    </section>
  );
}
