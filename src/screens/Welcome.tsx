import { ArrowRight, Lightbulb, Sparkles, WandSparkles } from 'lucide-react';
import { usePresenter } from '../presenter/context';
import { BrandLogo } from '../components/BrandLogo';
import { TOTAL_MINUTES } from '../data/workshop';

export function Welcome() {
  const { goTo } = usePresenter();
  return (
    <section className="welcome">
      <div className="welcome__copy enter">
        <span className="welcome__inst">Institución Educativa Santa Rosa de Lima</span>
        <h1 className="welcome__title">
          Aula IA<span className="welcome__sub grad-text">De la idea a la experiencia</span>
        </h1>
        <p className="welcome__quote">
          La inteligencia artificial no transforma la enseñanza por sí sola. La transforman los docentes que se atreven a
          imaginar con ella.
        </p>
        <div className="welcome__actions">
          <button type="button" className="btn btn--primary btn--xl" onClick={() => goTo('ruta')}>
            Comenzar el taller <ArrowRight />
          </button>
          <span className="welcome__meta">
            Taller docente · {TOTAL_MINUTES} minutos
          </span>
          <BrandLogo label="con Google AI Studio" />
        </div>
      </div>

      <div className="orbit" aria-hidden="true">
        <div className="orbit__ring orbit__ring--1" />
        <div className="orbit__ring orbit__ring--2" />
        <div className="orbit__ring orbit__ring--3" />
        <div className="orbit__core">
          <span>IA</span>
        </div>
        <div className="orbit__spin">
          <div className="orbit__node orbit__node--a">
            <Lightbulb />
            <b>Idea</b>
          </div>
          <div className="orbit__node orbit__node--b">
            <WandSparkles />
            <b>Prompt</b>
          </div>
          <div className="orbit__node orbit__node--c">
            <Sparkles />
            <b>Experiencia</b>
          </div>
        </div>
      </div>
    </section>
  );
}
