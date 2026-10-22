import { Volume2, VolumeX } from 'lucide-react';
import { sfx, useMuted } from '../lib/sfx';

/** Activa o silencia los efectos de sonido (se recuerda en el dispositivo). */
export function SoundToggle({ className = 'btn btn--ghost btn--icon' }: { className?: string }) {
  const [muted, toggle] = useMuted();
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        toggle();
        if (muted) window.setTimeout(() => sfx.pop(), 30);
      }}
      title={muted ? 'Activar sonido' : 'Silenciar'}
      aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}
      aria-pressed={!muted}
    >
      {muted ? <VolumeX /> : <Volume2 />}
    </button>
  );
}
