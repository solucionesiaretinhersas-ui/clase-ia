import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Hand, MessageCircleQuestion, Plus, RotateCcw, Shuffle, Trash2 } from 'lucide-react';
import { Modal } from '../components/ui';
import { usePersistentState } from '../lib/storage';
import { LIVE_SYNC_AVAILABLE, useParticipants, useSessionCode } from '../lib/sync';
import { useTheme } from '../lib/theme';
import { useWorkshop } from '../data/workshops';
import { sfx } from '../lib/sfx';
import { confetti } from '../lib/confetti';

const COLORS = ['#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#a855f7', '#0ea5e9'];
const SIZE = 560;
const TAU = Math.PI * 2;

const QUESTIONS = [
  '¿Qué necesidad educativa resolviste?',
  '¿Qué parte del prompt fue más importante?',
  '¿Qué tuviste que corregir?',
  '¿Qué decisiones siguen siendo responsabilidad del docente?',
  '¿Cómo adaptarías el recurso a tu grupo?',
  '¿Qué le pediste exactamente a la IA y qué te devolvió?',
  '¿Qué aprendiste hoy sobre trabajar con la IA?',
];
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

/** Ruleta de docentes: se arma con los registrados desde el celular (y nombres añadidos a mano). */
export function Wheel({ onClose }: { onClose: () => void }) {
  const [theme] = useTheme();
  const { code } = useSessionCode();
  const everyoneRegistered = useParticipants(LIVE_SYNC_AVAILABLE ? code : '');
  const ws = useWorkshop();
  const registered = useMemo(() => everyoneRegistered.filter((p) => !p.kind || p.kind === ws.audience), [everyoneRegistered, ws.audience]);
  const [manual, setManual] = usePersistentState<string[]>('wheel:manual', []);
  const [winners, setWinners] = usePersistentState<string[]>('wheel:winners', []);
  const [excludeWinners, setExcludeWinners] = usePersistentState<boolean>('wheel:exclude', true);
  const [name, setName] = useState('');
  const [winner, setWinner] = useState<string | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rot = useRef(0);
  const raf = useRef(0);
  const lastQ = useRef(-1);
  const lastTick = useRef(-1);

  const everyone = useMemo(() => {
    const seen = new Set<string>();
    return [...registered.map((p) => p.name), ...manual].filter((n) => {
      const k = n.trim().toLowerCase();
      if (!k || seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, [registered, manual]);
  // Quienes ya participaron salen de la ruleta, pero el último ganador sigue visible hasta el próximo giro.
  const names = useMemo(() => (excludeWinners ? everyone.filter((n) => !winners.includes(n) || n === winner) : everyone), [everyone, winners, excludeWinners, winner]);
  const pool = useMemo(() => (excludeWinners ? everyone.filter((n) => !winners.includes(n)) : everyone), [everyone, winners, excludeWinners]);

  const draw = (angle: number, list: string[] = names) => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = SIZE * dpr;
    c.height = SIZE * dpr;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, SIZE, SIZE);
    const cx = SIZE / 2;
    const r = SIZE / 2 - 14;
    if (list.length === 0) {
      ctx.fillStyle = theme === 'light' ? 'rgba(60,60,67,0.08)' : 'rgba(255,255,255,0.06)';
      ctx.beginPath();
      ctx.arc(cx, cx, r, 0, TAU);
      ctx.fill();
      ctx.fillStyle = theme === 'light' ? '#6e6e73' : '#b9bad0';
      ctx.font = '600 22px "Inter Variable", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Sin docentes en la ruleta', cx, cx);
      return;
    }
    const a = TAU / list.length;
    const fs = Math.max(11, Math.min(26, 300 / Math.max(8, list.length) + 8));
    list.forEach((n, i) => {
      const start = angle + i * a;
      ctx.beginPath();
      ctx.moveTo(cx, cx);
      ctx.arc(cx, cx, r, start, start + a);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = 'rgba(7,7,13,0.55)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.save();
      ctx.translate(cx, cx);
      ctx.rotate(start + a / 2);
      ctx.fillStyle = '#fff';
      ctx.font = `600 ${fs}px "Inter Variable", "Segoe UI", sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      const label = n.length > 16 ? n.slice(0, 15) + '…' : n;
      ctx.fillText(label, r - 18, 0);
      ctx.restore();
    });
    ctx.beginPath();
    ctx.arc(cx, cx, 34, 0, TAU);
    ctx.fillStyle = theme === 'light' ? '#ffffff' : '#1c1c1e';
    ctx.fill();
    ctx.strokeStyle = theme === 'light' ? 'rgba(60,60,67,0.35)' : 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  useEffect(() => {
    if (!spinning) draw(rot.current);
  });
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  function spin() {
    if (spinning || pool.length === 0) return;
    const spinList = pool;
    const i = Math.floor(Math.random() * spinList.length);
    const a = TAU / spinList.length;
    const jitter = (Math.random() - 0.5) * a * 0.7;
    // El puntero está arriba (-90°): el centro del segmento i debe quedar allí.
    const target = -Math.PI / 2 - (i + 0.5) * a - jitter;
    const from = rot.current;
    const delta = (((target - from) % TAU) + TAU) % TAU;
    const to = from + delta + TAU * (5 + Math.floor(Math.random() * 2));
    const t0 = performance.now();
    const dur = 5200;
    setSpinning(true);
    setWinner(null);
    setQuestion(null);
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      rot.current = from + (to - from) * easeOut(p);
      draw(rot.current, spinList);
      // tic cada vez que un nombre pasa por el puntero
      const under = Math.floor(((((-Math.PI / 2 - rot.current) % TAU) + TAU) % TAU) / a);
      if (under !== lastTick.current) {
        lastTick.current = under;
        sfx.tick();
      }
      if (p < 1) raf.current = requestAnimationFrame(step);
      else {
        sfx.win();
        confetti({ y: 0.4, count: 120 });
        rot.current = to % TAU;
        const picked = spinList[i];
        setWinner(picked);
        setWinners((w) => (w.includes(picked) ? w : [...w, picked]));
        setSpinning(false);
      }
    };
    raf.current = requestAnimationFrame(step);
  }

  function nextQuestion() {
    let k = Math.floor(Math.random() * QUESTIONS.length);
    if (QUESTIONS.length > 1 && k === lastQ.current) k = (k + 1) % QUESTIONS.length;
    lastQ.current = k;
    setQuestion(QUESTIONS[k]);
  }

  function addName(e: FormEvent) {
    e.preventDefault();
    const n = name.trim().slice(0, 40);
    if (!n) return;
    setManual((l) => [...l, n]);
    setName('');
  }

  return (
    <Modal onClose={onClose} label="Ruleta de docentes">
      <div className="wheel">
        <div className="wheel__stage">
          <div className="wheel__pointer" aria-hidden="true" />
          <canvas ref={canvasRef} className="wheel__canvas" style={{ width: SIZE, height: SIZE }} role="img" aria-label={`Ruleta con ${names.length} docentes`} />
        </div>

        <div className="wheel__panel">
          <span className="kicker">Ruleta de participación</span>
          <div className="wheel__result" aria-live="polite">
            {spinning ? (
              <span className="wheel__spinning">Girando…</span>
            ) : winner ? (
              <>
                <span>Le toca a</span>
                <strong>{winner}</strong>
              </>
            ) : (
              <span>{pool.length === 0 ? (everyone.length === 0 ? 'Añade docentes para empezar' : 'Ya participaron todos') : 'Pulsa girar'}</span>
            )}
          </div>

          {question && (
            <p className="wheel__question">
              <MessageCircleQuestion /> {question}
            </p>
          )}

          {winner && !spinning && (
            <button type="button" className="btn btn--lg wheel__applause" onClick={() => { sfx.win(); confetti({ count: 160, y: 0.5 }); }}>
              <Hand /> ¡Aplausos para {winner}!
            </button>
          )}

          <div className="wheel__actions">
            <button type="button" className="btn btn--primary btn--xl" onClick={spin} disabled={spinning || pool.length === 0}>
              <Shuffle /> Girar
            </button>
            <button type="button" className="btn btn--lg" onClick={nextQuestion}>
              <MessageCircleQuestion /> {question ? 'Otra pregunta' : 'Sacar pregunta'}
            </button>
          </div>

          <label className="wheel__check">
            <input type="checkbox" checked={excludeWinners} onChange={(e) => setExcludeWinners(e.target.checked)} />
            No repetir a quien ya participó
          </label>

          <form className="wall-screen__add" onSubmit={addName}>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Añadir un nombre a mano" maxLength={40} aria-label="Añadir un nombre" />
            <button type="submit" className="btn btn--icon btn--primary" disabled={!name.trim()} aria-label="Añadir nombre">
              <Plus />
            </button>
          </form>

          <div className="wheel__lists">
            <div>
              <h4>
                Por participar <b>{pool.length}</b>
                {LIVE_SYNC_AVAILABLE && <small> · {registered.length} registrados</small>}
              </h4>
              {!LIVE_SYNC_AVAILABLE && <p className="note-muted">Sin sincronización: escribe los nombres a mano.</p>}
            </div>
            {winners.length > 0 && (
              <div>
                <h4>
                  Ya participaron <b>{winners.length}</b>
                </h4>
                <ul className="wheel__chips">
                  {winners.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
                <div className="wheel__small">
                  <button type="button" className="btn btn--ghost" onClick={() => setWinners([])}>
                    <RotateCcw /> Volver a incluirlos
                  </button>
                </div>
              </div>
            )}
            {manual.length > 0 && (
              <div className="wheel__small">
                <button type="button" className="btn btn--ghost" onClick={() => setManual([])}>
                  <Trash2 /> Quitar los nombres añadidos a mano
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
