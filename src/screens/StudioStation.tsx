import { Check, ShieldCheck, ChevronLeft, ChevronRight, ExternalLink, Lightbulb, WandSparkles } from 'lucide-react';
import { QRCode } from '../components/QRCode';
import { BrandLogo } from '../components/BrandLogo';
import { STUDIO_STEPS } from '../data/studioSteps';
import { usePersistentState } from '../lib/storage';
import { AI_STUDIO_URL } from '../lib/urls';
import { usePresenter } from '../presenter/context';
import { useWorkshop } from '../data/workshops';

export function StudioStation() {
  const [step, setStep] = usePersistentState('station:step', 0);
  const [done, setDone] = usePersistentState<number[]>('station:done', []);
  const { goTo } = usePresenter();
  const ws = useWorkshop();
  const s = STUDIO_STEPS[step];
  const isDone = done.includes(step);

  const toggleDone = () => setDone((d) => (d.includes(step) ? d.filter((x) => x !== step) : [...d, step]));

  return (
    <section className="station enter">
      <header className="screen-head screen-head--row">
        <div>
          <BrandLogo size="2.2em" />
          <span className="kicker">Estación Google AI Studio</span>
          <h2 className="h-lg">Seis pasos para crear tu primera aplicación</h2>
        </div>
        <a className="btn btn--primary btn--lg" href={AI_STUDIO_URL} target="_blank" rel="noopener noreferrer">
          Abrir Google AI Studio <ExternalLink />
        </a>
      </header>

      {ws.audience === 'estudiante' && (
        <p className="station__safe" role="note">
          <ShieldCheck /> Antes de empezar: usa la cuenta que tu docente indique, trabaja en pareja si hace falta y nunca compartas datos personales (tuyos ni de otros).
        </p>
      )}
      <div className="station__body">
        <ol className="stepper">
          {STUDIO_STEPS.map((it, i) => (
            <li key={it.title}>
              <button
                type="button"
                className={`stepper__item ${i === step ? 'is-active' : ''} ${done.includes(i) ? 'is-done' : ''}`}
                onClick={() => setStep(i)}
                aria-current={i === step ? 'step' : undefined}
              >
                <span className="stepper__num">{done.includes(i) ? <Check /> : i + 1}</span>
                <span>{it.title}</span>
              </button>
            </li>
          ))}
        </ol>

        <article className="station__detail glass" key={step}>
          <span className="station__big">{String(step + 1).padStart(2, '0')}</span>
          <div className="station__text">
            <h3>{s.action}</h3>
            <p>{s.detail}</p>
            <p className="station__tip">
              <Lightbulb /> {s.tip}
            </p>
            <div className="station__actions">
              <button type="button" className="btn" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} aria-label="Paso anterior">
                <ChevronLeft />
              </button>
              <button type="button" className={`btn ${isDone ? 'btn--ok' : ''}`} onClick={toggleDone}>
                <Check /> {isDone ? 'Paso completado por el grupo' : 'Marcar paso completado'}
              </button>
              {step === 3 && (
                <button type="button" className="btn" onClick={() => goTo(ws.labScreen)}>
                  <WandSparkles /> Ir al laboratorio
                </button>
              )}
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setStep(Math.min(STUDIO_STEPS.length - 1, step + 1))}
                disabled={step === STUDIO_STEPS.length - 1}
                aria-label="Paso siguiente"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
          {step === 0 && (
            <div className="station__qr">
              <QRCode value={AI_STUDIO_URL} size={200} />
              <span>aistudio.google.com</span>
            </div>
          )}
        </article>
      </div>

      <div className="station__meter" aria-label={`${done.length} de ${STUDIO_STEPS.length} pasos completados`}>
        <span style={{ width: `${(done.length / STUDIO_STEPS.length) * 100}%` }} />
      </div>
    </section>
  );
}
