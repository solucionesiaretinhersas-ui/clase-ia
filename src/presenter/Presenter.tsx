import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  House,
  LayoutGrid,
  NotebookPen,
  Pause,
  Play,
  Shrink,
  Smartphone,
} from 'lucide-react';
import { MOMENTS, SCREENS, TOTAL_MINUTES, momentOf, screenIndex } from '../data/workshop';
import { navigate } from '../lib/router';
import { writeStored } from '../lib/storage';
import { LIVE_SYNC_AVAILABLE, publishLive, useSessionCode } from '../lib/sync';
import { fmt, useTicker } from '../components/ui';
import { PresenterCtx } from './context';
import { elapsedOf, useTimers } from './timers';
import { FacilitatorDrawer } from './FacilitatorDrawer';
import { Overview } from './Overview';
import { SCREEN_COMPONENTS } from '../screens';

function isTyping(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  return el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName);
}

export function Presenter({ screenId }: { screenId: string }) {
  const idx = screenIndex(screenId);
  const screen = SCREENS[idx];
  const moment = momentOf(screen.moment);
  const [notesOpen, setNotesOpen] = useState(false);
  const [overview, setOverview] = useState(false);
  const [isFull, setIsFull] = useState(() => Boolean(document.fullscreenElement));
  const { timers, toggle, running } = useTimers();
  useTicker(running !== null);

  useEffect(() => writeStored('presenter:last', screen.id), [screen.id]);

  // Seguimiento en vivo: publica la pantalla actual para los celulares.
  const { code } = useSessionCode();
  const [liveState, setLiveState] = useState<'pending' | 'ok' | 'error'>('pending');
  useEffect(() => {
    if (!LIVE_SYNC_AVAILABLE || !code) return;
    let cancelled = false;
    publishLive(code, screen.id).then(
      () => !cancelled && setLiveState('ok'),
      () => !cancelled && setLiveState('error'),
    );
    return () => {
      cancelled = true;
    };
  }, [code, screen.id]);

  const goTo = useCallback((id: string) => navigate(`/s/${id}`), []);
  const next = useCallback(() => {
    if (idx < SCREENS.length - 1) goTo(SCREENS[idx + 1].id);
  }, [idx, goTo]);
  const prev = useCallback(() => {
    if (idx > 0) goTo(SCREENS[idx - 1].id);
  }, [idx, goTo]);

  const toggleFull = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);

  useEffect(() => {
    const onFs = () => setIsFull(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return;
      if (document.querySelector('[data-modal]')) return;
      const k = e.key;
      if (k === 'ArrowRight' || k === 'PageDown' || (k === ' ' && !(e.target instanceof HTMLButtonElement))) {
        e.preventDefault();
        next();
      } else if (k === 'ArrowLeft' || k === 'PageUp') {
        e.preventDefault();
        prev();
      } else if (k === 'Home') {
        e.preventDefault();
        goTo('inicio');
      } else if (k === 'End') {
        goTo(SCREENS[SCREENS.length - 1].id);
      } else if (k === 'f' || k === 'F') {
        toggleFull();
      } else if (k === 'n' || k === 'N') {
        setNotesOpen((v) => !v);
      } else if (k === 'g' || k === 'G') {
        setOverview(true);
      } else if (k === 'Escape') {
        setNotesOpen(false);
      } else if ((k === 't' || k === 'T') && moment) {
        toggle(moment.id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, goTo, toggleFull, toggle, moment]);

  const api = useMemo(() => ({ goTo, next, prev, current: screen.id }), [goTo, next, prev, screen.id]);
  const Screen = SCREEN_COMPONENTS[screen.id];
  const isCover = screen.kind === 'cover';
  const accent = moment?.accent ?? 'var(--violet)';

  return (
    <PresenterCtx.Provider value={api}>
      <div className={`stage ${isCover ? 'stage--cover' : ''}`} style={{ '--accent': accent } as CSSProperties}>
        <header className="topbar">
          <button type="button" className="brand" onClick={() => goTo('inicio')} aria-label="Ir al inicio">
            <span className="brand__mark" aria-hidden="true">
              A
            </span>
            <span className="brand__text">
              <strong>Aula IA</strong>
              <small>I.E. Santa Rosa de Lima</small>
            </span>
          </button>

          <div className="topbar__moment" aria-live="polite">
            {moment ? (
              <>
                <span className="topbar__num">0{moment.index}</span>
                <span>{moment.title}</span>
              </>
            ) : (
              <span>Introducción</span>
            )}
          </div>

          <div className="topbar__tools">
            {LIVE_SYNC_AVAILABLE && code && (
              <button
                type="button"
                className={`chip chip--btn ${liveState === 'ok' ? 'chip--live' : liveState === 'error' ? 'chip--warn' : 'chip--muted'}`}
                onClick={() => goTo('qr')}
                title={liveState === 'error' ? 'No se pudo conectar con Firebase: revisa que Firestore esté activo y las reglas publicadas' : 'Sesión en vivo: abre el Centro QR'}
              >
                {liveState === 'ok' && <span className="dot dot--pulse" />}
                {liveState === 'ok' ? 'En vivo' : liveState === 'error' ? 'Sin conexión' : 'Conectando'} · {code}
              </button>
            )}
            <TimerPill momentId={moment?.id} timers={timers} onToggle={toggle} />
            <button
              type="button"
              className="btn btn--ghost btn--icon"
              title="Modo participación (celular)"
              aria-label="Abrir modo participación"
              onClick={() => navigate('/m')}
            >
              <Smartphone />
            </button>
          </div>
        </header>

        <main className="stage__main" key={screen.id} id="contenido">
          {Screen ? <Screen /> : <p>Pantalla no encontrada.</p>}
        </main>

        <footer className="navbar">
          <div className="navbar__group">
            <button type="button" className="btn btn--ghost btn--icon" onClick={() => goTo('inicio')} title="Inicio (Inicio)" aria-label="Inicio">
              <House />
            </button>
            <button type="button" className="btn btn--ghost btn--icon" onClick={() => setOverview(true)} title="Vista general (G)" aria-label="Vista general">
              <LayoutGrid />
            </button>
            <button
              type="button"
              className={`btn btn--ghost btn--icon ${notesOpen ? 'is-on' : ''}`}
              onClick={() => setNotesOpen((v) => !v)}
              title="Notas del facilitador (N)"
              aria-label="Notas del facilitador"
              aria-pressed={notesOpen}
            >
              <NotebookPen />
            </button>
            <button type="button" className="btn btn--ghost btn--icon" onClick={toggleFull} title="Pantalla completa (F)" aria-label="Pantalla completa">
              {isFull ? <Shrink /> : <Expand />}
            </button>
          </div>

          <nav className="progress" aria-label="Progreso del taller">
            {MOMENTS.map((m) => {
              const list = SCREENS.filter((s) => s.moment === m.id);
              return (
                <div key={m.id} className={`progress__moment ${m.id === screen.moment ? 'is-current' : ''}`} style={{ '--accent': m.accent, flexGrow: m.minutes } as CSSProperties}>
                  <span className="progress__label">{m.short}</span>
                  <div className="progress__track">
                    {list.map((s) => {
                      const i = screenIndex(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          className={`progress__seg ${i < idx ? 'is-done' : ''} ${i === idx ? 'is-active' : ''}`}
                          onClick={() => goTo(s.id)}
                          title={s.title}
                          aria-label={s.title}
                          aria-current={i === idx ? 'step' : undefined}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="navbar__group">
            <span className="navbar__count" aria-label={`Pantalla ${idx + 1} de ${SCREENS.length}`}>
              {String(idx + 1).padStart(2, '0')}
              <i>/{SCREENS.length}</i>
            </span>
            <button type="button" className="btn btn--icon" onClick={prev} disabled={idx === 0} aria-label="Anterior">
              <ChevronLeft />
            </button>
            <button type="button" className="btn btn--icon btn--primary" onClick={next} disabled={idx === SCREENS.length - 1} aria-label="Siguiente">
              <ChevronRight />
            </button>
          </div>
        </footer>

        {notesOpen && <FacilitatorDrawer screen={screen} onClose={() => setNotesOpen(false)} />}
        {overview && <Overview currentId={screen.id} onPick={(id) => { goTo(id); setOverview(false); }} onClose={() => setOverview(false)} />}
      </div>
    </PresenterCtx.Provider>
  );
}

function TimerPill({
  momentId,
  timers,
  onToggle,
}: {
  momentId: string | undefined;
  timers: ReturnType<typeof useTimers>['timers'];
  onToggle: (id: (typeof MOMENTS)[number]['id']) => void;
}) {
  const moment = MOMENTS.find((m) => m.id === momentId);
  if (!moment) {
    const total = MOMENTS.reduce((s, m) => s + elapsedOf(timers[m.id]), 0);
    return (
      <span className="timer timer--total" title="Tiempo total transcurrido">
        <span className="timer__value">{fmt(total)}</span>
        <span className="timer__of">/ {TOTAL_MINUTES} min</span>
      </span>
    );
  }
  const t = timers[moment.id];
  const remaining = moment.minutes * 60000 - elapsedOf(t);
  const state = remaining < 0 ? 'over' : remaining < 120000 ? 'low' : '';
  const isRunning = Boolean(t?.since);
  return (
    <button
      type="button"
      className={`timer ${state ? `timer--${state}` : ''} ${isRunning ? 'is-running' : ''}`}
      onClick={() => onToggle(moment.id)}
      title={`${isRunning ? 'Pausar' : 'Iniciar'} cronómetro del momento (T)`}
      aria-label={`${isRunning ? 'Pausar' : 'Iniciar'} cronómetro. Restan ${fmt(remaining)}`}
    >
      {isRunning ? <Pause /> : <Play />}
      <span className="timer__value">{fmt(remaining)}</span>
      <span className="timer__of">{moment.minutes} min</span>
    </button>
  );
}
