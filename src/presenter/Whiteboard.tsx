import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import {
  ArrowUpRight,
  Circle,
  Eraser,
  Flashlight,
  Highlighter,
  MousePointer2,
  Pencil,
  Presentation,
  Redo2,
  Square,
  Target,
  Trash2,
  Type,
  Undo2,
  X,
} from 'lucide-react';

type Tool = 'cursor' | 'pen' | 'marker' | 'eraser' | 'text' | 'arrow' | 'rect' | 'ellipse' | 'laser' | 'spot';
interface Pt {
  x: number;
  y: number;
}
type Item =
  | { k: 'stroke'; color: string; size: number; alpha: number; pts: Pt[] }
  | { k: 'shape'; shape: 'arrow' | 'rect' | 'ellipse'; color: string; size: number; a: Pt; b: Pt }
  | { k: 'text'; color: string; size: number; at: Pt; text: string };

interface Board {
  items: Item[];
  past: Item[][];
  future: Item[][];
}

const COLORS = ['#ffffff', '#111827', '#fb7185', '#fbbf24', '#34d399', '#22d3ee', '#a78bfa'];
const SIZES = [3, 6, 12];
const TOOLS: { id: Tool; label: string; icon: typeof Pencil }[] = [
  { id: 'cursor', label: 'Usar la pantalla', icon: MousePointer2 },
  { id: 'pen', label: 'Lápiz', icon: Pencil },
  { id: 'marker', label: 'Resaltador', icon: Highlighter },
  { id: 'text', label: 'Texto', icon: Type },
  { id: 'arrow', label: 'Flecha', icon: ArrowUpRight },
  { id: 'rect', label: 'Rectángulo', icon: Square },
  { id: 'ellipse', label: 'Círculo', icon: Circle },
  { id: 'eraser', label: 'Borrador', icon: Eraser },
  { id: 'laser', label: 'Puntero láser', icon: Target },
  { id: 'spot', label: 'Foco', icon: Flashlight },
];

type Bg = 'none' | 'dark' | 'white';

function segDist(p: Pt, a: Pt, b: Pt) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = dx * dx + dy * dy;
  const t = len === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

function textMetrics(size: number) {
  return 22 + size * 5;
}

/**
 * Pizarra interactiva superpuesta a la presentación: lápiz, resaltador, texto,
 * figuras, borrador, puntero láser y foco. Cada pantalla conserva sus anotaciones.
 * También ofrece una pizarra en blanco (oscura o blanca).
 */
export function Whiteboard({ screenId, open, onClose }: { screenId: string; open: boolean; onClose: () => void }) {
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState(COLORS[0]);
  const [sizeIdx, setSizeIdx] = useState(1);
  const [bg, setBg] = useState<Bg>('none');
  const [dockTop, setDockTop] = useState(false);
  const [rect, setRect] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [textBox, setTextBox] = useState<{ pt: Pt; px: Pt } | null>(null);
  const [, bump] = useReducer((n: number) => n + 1, 0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const laserRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const boards = useRef<Record<string, Board>>({});
  const draft = useRef<Item | null>(null);
  const drawing = useRef(false);

  const boardKey = bg === 'none' ? screenId : `blank-${bg}`;
  const board = (boards.current[boardKey] ??= { items: [], past: [], future: [] });
  const active: Tool = open ? tool : 'cursor';
  const size = SIZES[sizeIdx];

  // El lienzo cubre el área de contenido (entre la barra superior y la inferior).
  const measure = useCallback(() => {
    const el = document.getElementById('contenido');
    if (!el) return;
    const r = el.getBoundingClientRect();
    setRect({ left: r.left, top: r.top, width: r.width, height: r.height });
  }, []);
  useLayoutEffect(() => {
    measure();
    const el = document.getElementById('contenido');
    const ro = el ? new ResizeObserver(measure) : null;
    if (el) ro?.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure, screenId]);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c || rect.width === 0) return;
    const dpr = window.devicePixelRatio || 1;
    if (c.width !== Math.round(rect.width * dpr) || c.height !== Math.round(rect.height * dpr)) {
      c.width = Math.round(rect.width * dpr);
      c.height = Math.round(rect.height * dpr);
    }
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const px = (p: Pt) => ({ x: p.x * rect.width, y: p.y * rect.height });
    const all = draft.current ? [...board.items, draft.current] : board.items;
    for (const it of all) {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = it.color;
      ctx.fillStyle = it.color;
      if (it.k === 'stroke') {
        ctx.globalAlpha = it.alpha;
        ctx.lineWidth = it.size;
        ctx.beginPath();
        const p0 = px(it.pts[0]);
        ctx.moveTo(p0.x, p0.y);
        if (it.pts.length === 1) ctx.lineTo(p0.x + 0.01, p0.y);
        for (let i = 1; i < it.pts.length - 1; i++) {
          const a = px(it.pts[i]);
          const b = px(it.pts[i + 1]);
          ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2);
        }
        const last = px(it.pts[it.pts.length - 1]);
        ctx.lineTo(last.x, last.y);
        ctx.stroke();
      } else if (it.k === 'shape') {
        ctx.lineWidth = it.size;
        const a = px(it.a);
        const b = px(it.b);
        ctx.beginPath();
        if (it.shape === 'rect') ctx.rect(a.x, a.y, b.x - a.x, b.y - a.y);
        else if (it.shape === 'ellipse') ctx.ellipse((a.x + b.x) / 2, (a.y + b.y) / 2, Math.abs(b.x - a.x) / 2, Math.abs(b.y - a.y) / 2, 0, 0, Math.PI * 2);
        else {
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          const ang = Math.atan2(b.y - a.y, b.x - a.x);
          const head = 12 + it.size * 3;
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(b.x - head * Math.cos(ang - 0.45), b.y - head * Math.sin(ang - 0.45));
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(b.x - head * Math.cos(ang + 0.45), b.y - head * Math.sin(ang + 0.45));
        }
        ctx.stroke();
      } else {
        const p = px(it.at);
        ctx.font = `600 ${textMetrics(it.size)}px "Space Grotesk Variable", "Segoe UI", sans-serif`;
        ctx.textBaseline = 'top';
        ctx.fillText(it.text, p.x, p.y);
      }
    }
    ctx.globalAlpha = 1;
  }, [rect, board]);

  useEffect(() => {
    draw();
  });

  const norm = (e: RPointerEvent): Pt => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  };

  const commit = (items: Item[]) => {
    board.past.push(board.items);
    if (board.past.length > 60) board.past.shift();
    board.future = [];
    board.items = items;
    bump();
  };

  const hit = (it: Item, p: Pt): boolean => {
    const W = rect.width;
    const H = rect.height;
    const P = { x: p.x * W, y: p.y * H };
    const r = 14;
    const px = (q: Pt) => ({ x: q.x * W, y: q.y * H });
    if (it.k === 'stroke') {
      if (it.pts.length === 1) return Math.hypot(px(it.pts[0]).x - P.x, px(it.pts[0]).y - P.y) < r;
      for (let i = 0; i < it.pts.length - 1; i++) if (segDist(P, px(it.pts[i]), px(it.pts[i + 1])) < r + it.size) return true;
      return false;
    }
    if (it.k === 'shape') {
      const a = px(it.a);
      const b = px(it.b);
      if (it.shape === 'arrow') return segDist(P, a, b) < r;
      const x1 = Math.min(a.x, b.x);
      const x2 = Math.max(a.x, b.x);
      const y1 = Math.min(a.y, b.y);
      const y2 = Math.max(a.y, b.y);
      const edges: [Pt, Pt][] = [
        [{ x: x1, y: y1 }, { x: x2, y: y1 }],
        [{ x: x2, y: y1 }, { x: x2, y: y2 }],
        [{ x: x2, y: y2 }, { x: x1, y: y2 }],
        [{ x: x1, y: y2 }, { x: x1, y: y1 }],
      ];
      return edges.some(([s, t]) => segDist(P, s, t) < r);
    }
    const t = px(it.at);
    const h = textMetrics(it.size);
    return P.x >= t.x - 6 && P.x <= t.x + it.text.length * h * 0.6 + 6 && P.y >= t.y - 6 && P.y <= t.y + h + 6;
  };

  const eraseAt = (p: Pt) => {
    const keep = board.items.filter((it) => !hit(it, p));
    if (keep.length !== board.items.length) {
      board.items = keep;
      draw();
    }
  };

  const onDown = (e: RPointerEvent<HTMLCanvasElement>) => {
    if (active === 'cursor' || active === 'laser' || active === 'spot') return;
    // Evita que el clic de compatibilidad le quite el foco al cuadro de texto.
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = norm(e);
    drawing.current = true;
    if (active === 'text') {
      drawing.current = false;
      setTextBox({ pt: p, px: { x: p.x * rect.width, y: p.y * rect.height } });
      return;
    }
    if (active === 'eraser') {
      board.past.push(board.items);
      board.future = [];
      eraseAt(p);
      return;
    }
    if (active === 'pen' || active === 'marker') {
      draft.current = { k: 'stroke', color, size: active === 'marker' ? size * 3 : size, alpha: active === 'marker' ? 0.38 : 1, pts: [p] };
    } else {
      draft.current = { k: 'shape', shape: active, color, size, a: p, b: p };
    }
    draw();
  };

  const onMove = (e: RPointerEvent<HTMLCanvasElement>) => {
    const r = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    if (active === 'laser' && laserRef.current) {
      laserRef.current.style.opacity = '1';
      laserRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
    if (active === 'spot' && spotRef.current) {
      spotRef.current.style.background = `radial-gradient(circle 150px at ${x}px ${y}px, transparent 96%, rgba(2,2,8,0.88) 100%)`;
    }
    if (!drawing.current) return;
    const p = norm(e);
    if (active === 'eraser') return eraseAt(p);
    const d = draft.current;
    if (!d) return;
    if (d.k === 'stroke') d.pts.push(p);
    else if (d.k === 'shape') d.b = p;
    draw();
  };

  const onUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (active === 'eraser') {
      bump();
      return;
    }
    const d = draft.current;
    draft.current = null;
    if (!d) return;
    if (d.k === 'shape' && Math.hypot((d.b.x - d.a.x) * rect.width, (d.b.y - d.a.y) * rect.height) < 6) {
      draw();
      return;
    }
    commit([...board.items, d]);
  };

  const onLeave = () => {
    if (laserRef.current) laserRef.current.style.opacity = '0';
    if (spotRef.current) spotRef.current.style.background = active === 'spot' ? 'rgba(2,2,8,0.88)' : 'none';
  };

  const undo = useCallback(() => {
    const prev = board.past.pop();
    if (!prev) return;
    board.future.push(board.items);
    board.items = prev;
    bump();
  }, [board]);
  const redo = () => {
    const next = board.future.pop();
    if (!next) return;
    board.past.push(board.items);
    board.items = next;
    bump();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, undo]);

  useEffect(() => {
    setTextBox(null);
  }, [boardKey, open, tool]);

  // Un taller nuevo empieza con la pizarra limpia.
  useEffect(() => {
    const clear = () => {
      boards.current = {};
      bump();
    };
    window.addEventListener('aula-ia:reset', clear);
    return () => window.removeEventListener('aula-ia:reset', clear);
  }, []);

  function commitText(value: string) {
    const t = value.trim();
    if (t && textBox) commit([...board.items, { k: 'text', color, size, at: textBox.pt, text: t }]);
    setTextBox(null);
  }

  const showBg = bg !== 'none';
  const interactive = active !== 'cursor';
  const defaultColor = bg === 'white' ? '#111827' : '#ffffff';

  return (
    <>
      {showBg && <div className={`wb-bg wb-bg--${bg}`} style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }} aria-hidden="true" />}

      <div className="wb" style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}>
        <canvas
          ref={canvasRef}
          className={`wb__canvas wb__canvas--${active}`}
          style={{ width: rect.width, height: rect.height, pointerEvents: interactive ? 'auto' : 'none' }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onPointerLeave={onLeave}
        />
        {active === 'laser' && <div ref={laserRef} className="wb__laser" />}
        {active === 'spot' && <div ref={spotRef} className="wb__spot" style={{ background: 'rgba(2,2,8,0.88)' }} />}
        {textBox && (
          <input
            className="wb__text"
            autoFocus
            style={{ left: textBox.px.x, top: textBox.px.y, color, fontSize: textMetrics(size) }}
            placeholder="Escribe y presiona Enter"
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitText(e.currentTarget.value);
              if (e.key === 'Escape') setTextBox(null);
              e.stopPropagation();
            }}
            onBlur={(e) => commitText(e.currentTarget.value)}
          />
        )}
      </div>

      {open && (
        <div className={`wb-bar ${dockTop ? 'wb-bar--top' : ''}`} role="toolbar" aria-label="Herramientas de pizarra">
          <div className="wb-bar__group">
            {TOOLS.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" className={`wb-btn ${tool === id ? 'is-on' : ''}`} onClick={() => setTool(id)} title={label} aria-label={label} aria-pressed={tool === id}>
                <Icon />
              </button>
            ))}
          </div>
          <span className="wb-bar__sep" />
          <div className="wb-bar__group">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`wb-color ${color === c ? 'is-on' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
                aria-label={`Color ${c}`}
                aria-pressed={color === c}
              />
            ))}
          </div>
          <div className="wb-bar__group">
            {SIZES.map((s, i) => (
              <button key={s} type="button" className={`wb-btn ${sizeIdx === i ? 'is-on' : ''}`} onClick={() => setSizeIdx(i)} aria-label={`Grosor ${i + 1}`} title="Grosor">
                <i style={{ width: 6 + i * 5, height: 6 + i * 5 }} />
              </button>
            ))}
          </div>
          <span className="wb-bar__sep" />
          <div className="wb-bar__group">
            <button type="button" className="wb-btn" onClick={undo} title="Deshacer (Ctrl+Z)" aria-label="Deshacer" disabled={board.past.length === 0}>
              <Undo2 />
            </button>
            <button type="button" className="wb-btn" onClick={redo} title="Rehacer" aria-label="Rehacer" disabled={board.future.length === 0}>
              <Redo2 />
            </button>
            <button type="button" className="wb-btn" onClick={() => board.items.length && commit([])} title="Borrar todo" aria-label="Borrar todo" disabled={board.items.length === 0}>
              <Trash2 />
            </button>
          </div>
          <span className="wb-bar__sep" />
          <div className="wb-bar__group">
            <button
              type="button"
              className={`wb-btn ${bg !== 'none' ? 'is-on' : ''}`}
              onClick={() => {
                const next: Bg = bg === 'none' ? 'dark' : bg === 'dark' ? 'white' : 'none';
                setBg(next);
                setColor(next === 'white' ? '#111827' : '#ffffff');
              }}
              title="Pizarra en blanco: oscura → blanca → volver"
              aria-label="Alternar pizarra en blanco"
            >
              <Presentation />
            </button>
            <button type="button" className="wb-btn" onClick={() => setDockTop((v) => !v)} title="Mover la barra" aria-label="Mover la barra">
              <span className="wb-dock" />
            </button>
            <button type="button" className="wb-btn" onClick={onClose} title="Cerrar herramientas (Esc)" aria-label="Cerrar herramientas">
              <X />
            </button>
          </div>
          {bg !== 'none' && <span className="sr-only">Pizarra en blanco activa. Color por defecto {defaultColor}</span>}
        </div>
      )}
    </>
  );
}
