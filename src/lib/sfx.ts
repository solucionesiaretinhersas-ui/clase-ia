import { useSyncExternalStore } from 'react';

/**
 * Efectos de sonido sintetizados con WebAudio (sin archivos). El navegador exige un
 * gesto del usuario antes de reproducir audio: el primer toque o clic lo activa.
 */
const KEY = 'aula-ia:sound';
const EVENT = 'aula-ia:sound';
let ctx: AudioContext | null = null;

export function isMuted(): boolean {
  try {
    return window.localStorage.getItem(KEY) === 'off';
  } catch {
    return false;
  }
}

export function setMuted(m: boolean) {
  try {
    window.localStorage.setItem(KEY, m ? 'off' : 'on');
  } catch {
    /* sin almacenamiento */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

export function useMuted(): [boolean, () => void] {
  const muted = useSyncExternalStore(subscribe, isMuted, () => false);
  return [muted, () => setMuted(!muted)];
}

function audio(): AudioContext | null {
  if (isMuted()) return null;
  try {
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, at: number, dur: number, type: OscillatorType = 'sine', gain = 0.16, to?: number) {
  const c = audio();
  if (!c) return;
  const t0 = c.currentTime + at;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(c.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.05);
}

function noise(at: number, dur: number, from: number, to: number, gain = 0.08) {
  const c = audio();
  if (!c) return;
  const t0 = c.currentTime + at;
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.setValueAtTime(from, t0);
  f.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f).connect(g).connect(c.destination);
  src.start(t0);
}

export const sfx = {
  ok() {
    tone(660, 0, 0.14, 'triangle');
    tone(990, 0.1, 0.22, 'triangle');
  },
  bad() {
    tone(220, 0, 0.18, 'sawtooth', 0.1, 140);
    tone(160, 0.12, 0.22, 'sawtooth', 0.1, 100);
  },
  pop() {
    tone(520, 0, 0.09, 'sine', 0.14, 880);
  },
  tick() {
    tone(1400, 0, 0.03, 'square', 0.04);
  },
  /** Tic-tac de reloj: alterna dos tonos; más fuerte y agudo cuando queda poco tiempo. */
  clock(n: number, urgent = false) {
    const hi = n % 2 === 0;
    tone(hi ? 1900 : 1300, 0, 0.035, 'square', urgent ? 0.1 : 0.05);
    if (urgent) tone(hi ? 950 : 650, 0, 0.06, 'sine', 0.1);
  },
  /** Campanita al detener el reloj. */
  ding() {
    tone(1175, 0, 0.35, 'triangle', 0.16);
    tone(1568, 0.09, 0.5, 'triangle', 0.12);
  },
  drop() {
    tone(320, 0, 0.12, 'sine', 0.18, 120);
  },
  whoosh() {
    noise(0, 0.35, 400, 3200, 0.07);
  },
  win() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.32, 'triangle', 0.15));
    tone(1319, 0.5, 0.5, 'triangle', 0.12);
  },
  join() {
    tone(784, 0, 0.1, 'sine', 0.1);
    tone(1175, 0.08, 0.16, 'sine', 0.1);
  },
};
