import { useRef, useState, type ReactNode } from 'react';
import {
  Bot,
  Dices,
  Expand,
  ExternalLink,
  LayoutGrid,
  MessageSquare,
  Moon,
  NotebookPen,
  PenTool,
  QrCode,
  RotateCcw,
  Smartphone,
  Sun,
  Timer,
  Users,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Modal } from '../components/ui';
import { useWorkshop } from '../data/workshops';
import { navigate } from '../lib/router';
import { sfx, useMuted } from '../lib/sfx';
import { resetWorkshop } from '../lib/storage';
import { useTheme } from '../lib/theme';
import { AI_STUDIO_URL, CHATGPT_URL } from '../lib/urls';

export interface DockActions {
  goTo: (id: string) => void;
  notes: () => void;
  overview: () => void;
  join: () => void;
  wheel: () => void;
  teams: () => void;
  board: () => void;
  full: () => void;
  timer: () => void;
}

function Tile({ icon, label, hint, onClick, href, tone }: { icon: ReactNode; label: string; hint?: string; onClick?: () => void; href?: string; tone?: string }) {
  const body = (
    <>
      <span className="tile__ico">{icon}</span>
      <strong>{label}</strong>
      {hint && <small>{hint}</small>}
    </>
  );
  return href ? (
    <a className={`tile ${tone ?? ''}`} href={href} target="_blank" rel="noopener noreferrer">
      {body}
    </a>
  ) : (
    <button type="button" className={`tile ${tone ?? ''}`} onClick={onClick}>
      {body}
    </button>
  );
}

/** Botón que solo actúa si se mantiene presionado: evita reinicios accidentales con el dedo. */
function HoldButton({ label, onDone }: { label: string; onDone: () => void }) {
  const [p, setP] = useState(0);
  const raf = useRef(0);
  const t0 = useRef(0);
  const HOLD = 1800;

  const stop = () => {
    cancelAnimationFrame(raf.current);
    setP(0);
  };
  const start = () => {
    t0.current = performance.now();
    const step = (now: number) => {
      const v = Math.min(1, (now - t0.current) / HOLD);
      setP(v);
      if (v >= 1) {
        setP(0);
        onDone();
      } else raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  return (
    <button type="button" className="hold" onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop} onKeyDown={(e) => e.key === 'Enter' && onDone()}>
      <i style={{ width: `${p * 100}%` }} />
      <span>
        <RotateCcw /> {label}
      </span>
    </button>
  );
}

/** Centro de mando: todos los controles del facilitador en botones grandes y táctiles. */
export function CommandDock({ onClose, a }: { onClose: () => void; a: DockActions }) {
  const ws = useWorkshop();
  const [theme, toggleTheme] = useTheme();
  const [muted, toggleMute] = useMuted();
  const run = (fn: () => void) => () => {
    onClose();
    fn();
  };
  const quick = ws.screens.filter((s) => s.kind === 'activity' || s.kind === 'tool');

  return (
    <Modal onClose={onClose} label="Centro de mando">
      <div className="dock">
        <header>
          <span className="kicker">Centro de mando</span>
          <h2>Todo a un toque</h2>
        </header>

        <div className="dock__tiles">
          <Tile icon={<Users />} label="Equipos y marcador" hint="Tecla E" onClick={run(a.teams)} />
          <Tile icon={<Dices />} label="Ruleta" hint="Tecla R" onClick={run(a.wheel)} />
          <Tile icon={<QrCode />} label="QR de ingreso" hint="Tecla J" onClick={run(a.join)} />
          <Tile icon={<PenTool />} label="Pizarra" hint="Tecla D" onClick={run(a.board)} />
          <Tile icon={<NotebookPen />} label="Notas del facilitador" hint="Tecla N" onClick={run(a.notes)} />
          <Tile icon={<LayoutGrid />} label="Vista general" hint="Tecla G" onClick={run(a.overview)} />
          <Tile icon={<Timer />} label="Cronómetro de la etapa" hint="Tecla T" onClick={() => a.timer()} />
          <Tile icon={<Expand />} label="Pantalla completa" hint="Tecla F" onClick={run(a.full)} />
          <Tile icon={muted ? <VolumeX /> : <Volume2 />} label={muted ? 'Activar sonido' : 'Silenciar'} onClick={() => { toggleMute(); if (muted) window.setTimeout(() => sfx.pop(), 30); }} />
          <Tile icon={theme === 'dark' ? <Sun /> : <Moon />} label={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'} onClick={toggleTheme} />
          <Tile icon={<Smartphone />} label="Vista de participación" hint="Como la ven los docentes" onClick={run(() => navigate('/m'))} />
          <Tile icon={<Bot />} label="Google AI Studio" hint="Pestaña nueva" href={AI_STUDIO_URL} tone="tile--blue" />
          <Tile icon={<MessageSquare />} label="ChatGPT" hint="Pestaña nueva" href={CHATGPT_URL} tone="tile--mint" />
        </div>

        <section className="dock__quick">
          <h3>Ir a una actividad</h3>
          <ul>
            {quick.map((s) => (
              <li key={s.id}>
                <button type="button" className="btn" onClick={run(() => a.goTo(s.id))}>
                  {s.title}
                  <ExternalLink />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <details className="dock__danger">
          <summary>Herramientas de reinicio</summary>
          <p>Borra votos, ideas, tableros, equipos, ruleta y pizarra, y crea un código de sesión nuevo. Mantén presionado el botón para confirmar.</p>
          <HoldButton
            label="Mantén presionado: nuevo taller"
            onDone={() => {
              resetWorkshop();
              onClose();
            }}
          />
        </details>
      </div>
    </Modal>
  );
}
