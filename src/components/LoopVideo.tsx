import { useEffect, useRef, useState } from 'react';

interface Props {
  src: string;
  /** Si el audio del video debe oírse */
  sound: boolean;
  /** Segundos de cruce entre el final y el inicio, para que no se note el corte (imagen y sonido) */
  fade?: number;
  /** Avisa si el navegador bloqueó el sonido automático */
  onBlocked?: (blocked: boolean) => void;
}

/**
 * Video de fondo en bucle sin saltos: dos copias del mismo video se alternan y se cruzan
 * (fundido de imagen y de volumen) justo antes de que termine la actual.
 */
export function LoopVideo({ src, sound, fade = 1.8, onBlocked }: Props) {
  const refs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];
  const [front, setFront] = useState<0 | 1>(0);
  const [shown, setShown] = useState(false);
  const live = useRef({ front: 0 as 0 | 1, fading: false, sound, blocked: false });
  live.current.sound = sound;
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const vids = () => refs.map((r) => r.current).filter(Boolean) as HTMLVideoElement[];

  // Sube o baja el volumen de un video de forma gradual
  const ramp = (v: HTMLVideoElement, from: number, to: number, secs: number, done?: () => void) => {
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / (secs * 1000));
      v.volume = Math.max(0, Math.min(1, from + (to - from) * k));
      if (k < 1) requestAnimationFrame(step);
      else done?.();
    };
    requestAnimationFrame(step);
  };

  useEffect(() => {
    const [a, b] = vids();
    if (!a || !b || reduce) return;
    const state = live.current;
    let cancelled = false;
    a.muted = !state.sound;
    b.muted = !state.sound;
    a.volume = 0;
    b.volume = 0;

    const start = () => {
      a.play()
        .then(() => {
          if (cancelled) return;
          state.blocked = false;
          onBlocked?.(false);
          ramp(a, 0, 1, 1.6);
          setShown(true);
        })
        .catch((err: unknown) => {
          // Una pausa o un desmontaje no es un bloqueo del navegador
          if (cancelled || (err instanceof DOMException && err.name === 'AbortError')) return;
          // El navegador exige un toque antes de reproducir con sonido: se inicia mudo y se activa al primer toque
          a.muted = true;
          b.muted = true;
          state.blocked = true;
          onBlocked?.(true);
          a.volume = 1;
          a.play().then(() => setShown(true)).catch(() => undefined);
        });
    };
    start();

    const unlock = () => {
      if (!state.blocked || !state.sound) return;
      const cur = state.front === 0 ? a : b;
      cur.muted = false;
      cur.volume = 0;
      cur.play().catch(() => undefined);
      ramp(cur, 0, 1, 1.2);
      (cur === a ? b : a).muted = false;
      state.blocked = false;
      onBlocked?.(false);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);

    // Cruce: cuando la copia actual está por terminar, la otra arranca desde el principio
    const timer = window.setInterval(() => {
      const cur = state.front === 0 ? a : b;
      const next = state.front === 0 ? b : a;
      if (state.fading || document.hidden || !cur.duration || cur.paused) return;
      if (cur.duration - cur.currentTime > fade) return;
      state.fading = true;
      next.currentTime = 0;
      next.volume = 0;
      next.muted = cur.muted;
      next.play().catch(() => undefined);
      state.front = state.front === 0 ? 1 : 0;
      setFront(state.front);
      if (!cur.muted) ramp(cur, cur.volume, 0, fade);
      if (!next.muted) ramp(next, 0, 1, fade);
      window.setTimeout(() => {
        cur.pause();
        cur.currentTime = 0;
        state.fading = false;
      }, fade * 1000 + 80);
    }, 100);

    // No gasta batería con la pestaña oculta
    const onVis = () => {
      const cur = state.front === 0 ? a : b;
      if (document.hidden) cur.pause();
      else cur.play().catch(() => undefined);
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      document.removeEventListener('visibilitychange', onVis);
      a.pause();
      b.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Activar o silenciar el sonido sin reiniciar el video
  useEffect(() => {
    const [a, b] = vids();
    if (!a || !b) return;
    const cur = live.current.front === 0 ? a : b;
    if (!sound) {
      a.muted = true;
      b.muted = true;
    } else if (!live.current.blocked) {
      a.muted = false;
      b.muted = false;
      cur.volume = 1;
    }
  }, [sound]);

  const common = { src, playsInline: true, preload: 'auto' as const, 'aria-hidden': true, tabIndex: -1 };
  return (
    <div className={`loopvideo ${shown || reduce ? 'is-shown' : ''}`} style={{ '--fade': `${fade}s` } as React.CSSProperties} aria-hidden="true">
      <video ref={refs[0]} {...common} className={front === 0 ? 'is-front' : ''} muted />
      <video ref={refs[1]} {...common} className={front === 1 ? 'is-front' : ''} muted />
    </div>
  );
}
