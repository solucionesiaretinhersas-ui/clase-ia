import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, Copy, X } from 'lucide-react';
import { copyText } from '../lib/clipboard';
import { useToast } from './Toast';

export function Ambient() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="orb orb--a" />
      <div className="orb orb--b" />
      <div className="orb orb--c" />
    </div>
  );
}

export function CopyButton({
  text,
  label = 'Copiar',
  className = '',
  disabled,
}: {
  text: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}) {
  const [done, setDone] = useState(false);
  const toast = useToast();
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function onCopy() {
    const ok = await copyText(text);
    if (ok) {
      setDone(true);
      toast('Copiado al portapapeles');
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setDone(false), 1800);
    } else {
      toast('No se pudo copiar. Selecciona el texto y cópialo manualmente.', 'error');
    }
  }

  return (
    <button type="button" className={`btn ${className}`} onClick={onCopy} disabled={disabled}>
      {done ? <Check /> : <Copy />}
      {done ? 'Copiado' : label}
    </button>
  );
}

export function Modal({ onClose, children, label }: { onClose: () => void; children: ReactNode; label: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose]);

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={label} onClick={onClose} data-modal>
      <div className="modal__panel glass" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="btn btn--icon btn--ghost modal__close" onClick={onClose} aria-label="Cerrar">
          <X />
        </button>
        {children}
      </div>
    </div>
  );
}

/** Cronómetro con formato mm:ss */
export function fmt(ms: number): string {
  const neg = ms < 0;
  const total = Math.floor(Math.abs(ms) / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${neg ? '−' : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Re-render periódico mientras `active` sea verdadero */
export function useTicker(active: boolean, every = 500) {
  const [, setT] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setT((t) => t + 1), every);
    return () => window.clearInterval(id);
  }, [active, every]);
}
