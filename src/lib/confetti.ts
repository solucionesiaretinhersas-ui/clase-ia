const COLORS = ['#bf5af2', '#0a84ff', '#64d2ff', '#30d158', '#ff9f0a', '#ff375f', '#ffd60a'];

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  r: number;
  vr: number;
  c: string;
}

/** Lluvia de confeti sobre toda la pantalla. `x`/`y` (0 a 1) indican de dónde sale. */
export function confetti({ x = 0.5, y = 0.35, count = 140 }: { x?: number; y?: number; count?: number } = {}) {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:400';
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas.remove();
  ctx.scale(dpr, dpr);
  const W = window.innerWidth;
  const H = window.innerHeight;
  const pieces: Piece[] = Array.from({ length: count }, () => {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4;
    const s = 6 + Math.random() * 11;
    return {
      x: x * W,
      y: y * H,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      w: 6 + Math.random() * 7,
      h: 4 + Math.random() * 6,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.4,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  });
  let frame = 0;
  const step = () => {
    frame++;
    ctx.clearRect(0, 0, W, H);
    let alive = 0;
    for (const p of pieces) {
      p.vy += 0.28;
      p.vx *= 0.992;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      if (p.y < H + 30) alive++;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.globalAlpha = Math.max(0, 1 - frame / 170);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (alive > 0 && frame < 190) requestAnimationFrame(step);
    else canvas.remove();
  };
  requestAnimationFrame(step);
  // Por si el navegador pausa la animación (pestaña oculta): nunca deja el lienzo pegado
  window.setTimeout(() => canvas.remove(), 6000);
}
