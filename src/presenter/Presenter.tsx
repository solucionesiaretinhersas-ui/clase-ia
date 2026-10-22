import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Expand,
  House,
  LayoutGrid,
  NotebookPen,
  Pause,
  PenTool,
  Play,
  QrCode,
  Dices,
  Users,
  LayoutDashboard,
  Shrink,
  Smartphone,
} from 'lucide-react';
import { useWorkshop } from '../data/workshops';
import { navigate } from '../lib/router';
import { readStored, resetWorkshop, usePersistentState, writeStored } from '../lib/storage';
import { LIVE_SYNC_AVAILABLE, publishLive, useParticipants, useSessionCode, type LiveAct } from '../lib/sync';
import { fmt, useTicker } from '../components/ui';
import { PresenterCtx } from './context';
import { AnnounceCtx, type AnnounceApi } from './announce';
import { Whiteboard } from './Whiteboard';
import { JoinModal } from './JoinModal';
import { Wheel } from './Wheel';
import { ThemeToggle } from '../components/ThemeToggle';
import { SoundToggle } from '../components/SoundToggle';
import { TeamsModal } from './TeamsModal';
import { CommandDock } from './CommandDock';
import { ScreenGuard } from './ScreenGuard';
import { sfx } from '../lib/sfx';
import { CountUp } from '../components/CountUp';
import { elapsedOf, useTimers } from './timers';
import { FacilitatorDrawer } from './FacilitatorDrawer';
import { Overview } from './Overview';
import { SCREEN_COMPONENTS } from '../screens';
import { useUiSounds } from '../lib/uiSounds';

function isTyping(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  return el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName);
}

export function Presenter({ screenId }: { screenId: string }) {
  const ws = useWorkshop();
  const { screens: SCREENS, moments: MOMENTS } = ws;
  const idx = ws.screenIndex(screenId);
  const screen = SCREENS[idx];
  const moment = ws.momentOf(screen.moment);
  const [notesOpen, setNotesOpen] = useState(false);
  const [overview, setOverview] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [wheelOpen, setWheelOpen] = useState(false);
  const [teamsOpen, setTeamsOpen] = useState(false);
  const [dockOpen, setDockOpen] = useState(false);
  const [barHidden, setBarHidden] = usePersistentState('ui:bar-hidden', false);
  useUiSounds();

  const [isFull, setIsFull] = useState(() => Boolean(document.fullscreenElement));
  const { timers, toggle, running } = useTimers();
  useTicker(running !== null);
  // Avisos sonoros del cronómetro del momento: a 1 minuto del final y al terminar
  const lastWarn = useRef('');
  const runMoment = running ? ws.moments.find((m) => m.id === running) : undefined;
  const secsLeft = runMoment ? Math.floor((runMoment.minutes * 60000 - elapsedOf(timers[runMoment.id])) / 1000) : null;
  useEffect(() => {
    if (!runMoment || secsLeft === null) return;
    const k = `:`;
    if (k === lastWarn.current) return;
    if (secsLeft === 60) {
      lastWarn.current = k;
      sfx.open();
    } else if (secsLeft === 0) {
      lastWarn.current = k;
      sfx.ding();
    }
  }, [runMoment, secsLeft]);

  useEffect(() => writeStored('presenter:last', screen.id), [screen.id]);

  // Seguimiento en vivo: publica la pantalla actual para los celulares.
  const { code } = useSessionCode();
  const people = useParticipants(LIVE_SYNC_AVAILABLE ? code : '', ws.audience);

  // Un taller nuevo siempre empieza limpio: si la sesión guardada es de hace más de 12 horas, se reinicia.
  useEffect(() => {
    const started = readStored<number>(`session:started:${ws.id}`, 0);
    if (started && Date.now() - started > 12 * 3600 * 1000) resetWorkshop();
  }, []);
  const [fac] = usePersistentState('cert:facilitator', '');
  const [liveState, setLiveState] = useState<'pending' | 'ok' | 'error'>('pending');
  // La pantalla activa anuncia qué actividad deben mostrar los celulares.
  const [announced, setAnnounced] = useState<{ screenId: string; act: LiveAct } | null>(null);
  const announceApi = useMemo<AnnounceApi>(
    () => ({
      set: (sid, act) =>
        setAnnounced((cur) => {
          if (act) return { screenId: sid, act };
          return cur?.screenId === sid ? null : cur;
        }),
    }),
    [],
  );
  const act = announced?.screenId === screen.id ? announced.act : null;
  const actSig = act ? JSON.stringify(act) : '';

  useEffect(() => {
    if (!LIVE_SYNC_AVAILABLE || !code) return;
    let cancelled = false;
    publishLive(code, screen.id, actSig ? (JSON.parse(actSig) as LiveAct) : null, fac).then(
      () => !cancelled && setLiveState('ok'),
      () => !cancelled && setLiveState('error'),
    );
    return () => {
      cancelled = true;
    };
  }, [code, screen.id, actSig, fac]);

  const [boardOpen, setBoardOpen] = useState(false);

  const goTo = useCallback((id: string) => {
    sfx.whoosh();
    navigate(`/s/${id}`);
  }, []);
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
        goTo(ws.introCover);
      } else if (k === 'End') {
        goTo(SCREENS[SCREENS.length - 1].id);
      } else if (k === 'f' || k === 'F') {
        toggleFull();
      } else if (k === 'n' || k === 'N') {
        setNotesOpen((v) => !v);
      } else if (k === 'g' || k === 'G') {
        setOverview(true);
      } else if (k === 'd' || k === 'D') {
        setBoardOpen((v) => !v);
      } else if (k === 'j' || k === 'J') {
        setJoinOpen(true);
      } else if (k === 'r' || k === 'R') {
        setWheelOpen(true);
      } else if (k === 'e' || k === 'E') {
        setTeamsOpen(true);
      } else if (k === 'm' || k === 'M') {
        setDockOpen(true);
      } else if (k === 'b' || k === 'B') {
        setBarHidden((v) => !v);
      } else if (k === 'Escape') {
        setNotesOpen(false);
        setBoardOpen(false);
      } else if ((k === 't' || k === 'T') && moment) {
        toggle(moment.id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, goTo, toggleFull, toggle, moment, ws, setBarHidden]);

  const api = useMemo(
    () => ({ goTo, next, prev, current: screen.id, openJoin: () => setJoinOpen(true), openWheel: () => setWheelOpen(true) }),
    [goTo, next, prev, screen.id],
  );
  const Screen = SCREEN_COMPONENTS[screen.id];
  const isCover = screen.kind === 'cover';
  const accent = moment?.accent ?? 'var(--violet)';

  return (
    <PresenterCtx.Provider value={api}>
      <AnnounceCtx.Provider value={announceApi}>
      <div className={`stage ${isCover ? 'stage--cover' : ''} ${barHidden ? 'stage--nobar' : ''}`} style={{ '--accent': accent } as CSSProperties}>
        <header className="topbar">
          <button type="button" className="brand" onClick={() => goTo(ws.introCover)} aria-label="Ir al inicio">
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
                onClick={() => setJoinOpen(true)}
                title={liveState === 'error' ? 'No se pudo conectar con Firebase: revisa que Firestore esté activo y las reglas publicadas' : 'Sesión en vivo: muestra el QR de ingreso (J)'}
              >
                {liveState === 'ok' && <span className="dot dot--pulse" />}
                {liveState === 'ok' ? 'En vivo' : liveState === 'error' ? 'Sin conexión' : 'Conectando'} · {code} · <CountUp value={people.length} /> {ws.audience === 'docente' ? 'docentes' : 'estudiantes'}
              </button>
            )}
            <TimerPill momentId={moment?.id} timers={timers} onToggle={toggle} />
            <SoundToggle />
            <ThemeToggle />
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
          <ScreenGuard resetKey={screen.id}>{Screen ? <Screen /> : <p>Pantalla no encontrada.</p>}</ScreenGuard>
        </main>

        <footer className="navbar" hidden={barHidden}>
          <div className="navbar__group">
            <button type="button" className="btn btn--primary btn--icon" onClick={() => setDockOpen(true)} title="Centro de mando (M)" aria-label="Centro de mando">
              <LayoutDashboard />
            </button>
            <button type="button" className="btn btn--ghost btn--icon" onClick={() => goTo(ws.introCover)} title="Inicio (Inicio)" aria-label="Inicio">
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
            <button type="button" className="btn btn--ghost btn--icon" onClick={() => setJoinOpen(true)} title="QR de ingreso (J)" aria-label="QR de ingreso">
              <QrCode />
            </button>
            <button type="button" className="btn btn--ghost btn--icon" onClick={() => setWheelOpen(true)} title="Ruleta de docentes (R)" aria-label="Ruleta de docentes">
              <Dices />
            </button>
            <button type="button" className="btn btn--ghost btn--icon" onClick={() => setTeamsOpen(true)} title="Dividir en equipos y marcador (E)" aria-label="Equipos y marcador">
              <Users />
            </button>
            <button
              type="button"
              className={`btn btn--ghost btn--icon ${boardOpen ? 'is-on' : ''}`}
              onClick={() => setBoardOpen((v) => !v)}
              title="Pizarra: escribir, dibujar y señalar (D)"
              aria-label="Pizarra interactiva"
              aria-pressed={boardOpen}
            >
              <PenTool />
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
                      const i = ws.screenIndex(s.id);
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
            <button type="button" className="btn btn--ghost btn--icon" onClick={() => setBarHidden(true)} title="Ocultar la barra (B)" aria-label="Ocultar la barra inferior">
              <ChevronDown />
            </button>
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

        {barHidden && (
          <div className="minibar" role="toolbar" aria-label="Controles rápidos">
            <button type="button" className="btn btn--icon" onClick={prev} disabled={idx === 0} aria-label="Anterior">
              <ChevronLeft />
            </button>
            <span className="minibar__count">{idx + 1}/{SCREENS.length}</span>
            <button type="button" className="btn btn--icon btn--primary" onClick={next} disabled={idx === SCREENS.length - 1} aria-label="Siguiente">
              <ChevronRight />
            </button>
            <button type="button" className="btn btn--icon" onClick={() => setBarHidden(false)} title="Mostrar la barra (B)" aria-label="Mostrar la barra inferior">
              <ChevronUp />
            </button>
          </div>
        )}

        <Whiteboard screenId={screen.id} open={boardOpen} onClose={() => setBoardOpen(false)} />
        {joinOpen && <JoinModal onClose={() => setJoinOpen(false)} />}
        {wheelOpen && <Wheel onClose={() => setWheelOpen(false)} />}
        {teamsOpen && <TeamsModal onClose={() => setTeamsOpen(false)} />}
        {dockOpen && (
          <CommandDock
            onClose={() => setDockOpen(false)}
            a={{
              goTo,
              notes: () => setNotesOpen(true),
              overview: () => setOverview(true),
              join: () => setJoinOpen(true),
              wheel: () => setWheelOpen(true),
              teams: () => setTeamsOpen(true),
              board: () => setBoardOpen(true),
              full: toggleFull,
              timer: () => moment && toggle(moment.id),
              bar: () => setBarHidden((v) => !v),
            }}
          />
        )}
        {notesOpen && <FacilitatorDrawer screen={screen} onClose={() => setNotesOpen(false)} />}
        {overview && <Overview currentId={screen.id} onPick={(id) => { goTo(id); setOverview(false); }} onClose={() => setOverview(false)} />}
      </div>
      </AnnounceCtx.Provider>
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
  onToggle: (id: string) => void;
}) {
  const { moments: MOMENTS, total: TOTAL_MINUTES } = useWorkshop();
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
