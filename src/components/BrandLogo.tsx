import { useState } from 'react';
import { Sparkles } from 'lucide-react';

/**
 * Logo de Google AI Studio. Carga /brand/ai-studio.svg (o .png) desde `public/brand/`
 * y, si el archivo no está, muestra un ícono genérico para no dejar la interfaz rota.
 * Para usar el logo oficial, copia el archivo a `public/brand/ai-studio.svg`
 * (ver public/brand/README.md).
 */
const SOURCES = ['brand/ai-studio.svg', 'brand/ai-studio.png'];

export function BrandLogo({ label = 'Google AI Studio', size = '1.8em' }: { label?: string; size?: string }) {
  const [attempt, setAttempt] = useState(0);
  const src = SOURCES[attempt];
  return (
    <span className="brand-logo">
      {src ? (
        <img src={`${import.meta.env.BASE_URL}${src}`} alt="" style={{ width: size, height: size }} onError={() => setAttempt((a) => a + 1)} />
      ) : (
        <Sparkles aria-hidden="true" style={{ width: size, height: size, color: 'var(--cyan)' }} />
      )}
      <span>{label}</span>
    </span>
  );
}
