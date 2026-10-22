import { ArrowRight, GraduationCap, Lightbulb, School, Sparkles, WandSparkles } from 'lucide-react';
import { usePresenter } from '../presenter/context';
import { resetWorkshop } from '../lib/storage';
import { navigate } from '../lib/router';
import { BrandLogo } from '../components/BrandLogo';
import { WORKSHOPS, setWorkshopId, useWorkshop, type WorkshopId } from '../data/workshops';

export function Welcome() {
  const { goTo } = usePresenter();
  const ws = useWorkshop();

  function pick(id: WorkshopId) {
    if (id === ws.id) return;
    setWorkshopId(id);
    navigate(`/s/${WORKSHOPS[id].introCover}`);
  }

  return (
    <section className="welcome">
      <div className="welcome__copy enter">
        <span className="welcome__inst">Institución Educativa Santa Rosa de Lima</span>
        <h1 className="welcome__title">
          Aula IA<span className="welcome__sub grad-text">{ws.subtitle}</span>
        </h1>
        <p className="welcome__quote">{ws.quote}</p>

        <div className="seg" role="group" aria-label="Elige el taller">
          {(Object.keys(WORKSHOPS) as WorkshopId[]).map((id) => (
            <button key={id} type="button" className={`seg__btn ${ws.id === id ? 'is-on' : ''}`} onClick={() => pick(id)} aria-pressed={ws.id === id}>
              {id === 'docentes' ? <School /> : <GraduationCap />}
              {WORKSHOPS[id].label}
            </button>
          ))}
        </div>

        <div className="welcome__actions">
          <button type="button" className="btn btn--primary btn--xl" onClick={() => goTo(ws.screens[1].id)}>
            Comenzar el taller <ArrowRight />
          </button>
          <span className="doodle" aria-hidden="true">
            <svg viewBox="0 0 90 50"><path d="M4 40 C 20 8, 50 6, 82 24" /><path d="M70 12 L84 25 L66 32" /></svg>
            ¡Empecemos!
          </span>
          <span className="welcome__meta">
            Taller para {ws.audience === 'docente' ? 'docentes' : 'estudiantes'} · {ws.total} minutos
          </span>
          <BrandLogo label="con Google AI Studio" />
          <button
            type="button"
            className="btn btn--ghost welcome__reset"
            onClick={() => {
              if (window.confirm('¿Empezar un taller nuevo? Se borrará todo lo del taller anterior (votos, ideas, ruleta, pizarra) y los celulares recibirán un código de sesión nuevo.')) resetWorkshop();
            }}
          >
            Empezar un taller nuevo (limpiar todo)
          </button>
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
            <b>{ws.audience === 'docente' ? 'Experiencia' : 'Tu app'}</b>
          </div>
        </div>
      </div>
    </section>
  );
}
