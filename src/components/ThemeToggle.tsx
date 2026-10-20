import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../lib/theme';

/** Alterna entre modo claro y oscuro (se recuerda en este dispositivo). */
export function ThemeToggle({ className = 'btn btn--ghost btn--icon' }: { className?: string }) {
  const [theme, toggle] = useTheme();
  const toLight = theme === 'dark';
  return (
    <button type="button" className={className} onClick={toggle} title={toLight ? 'Modo claro' : 'Modo oscuro'} aria-label={toLight ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
      {toLight ? <Sun /> : <Moon />}
    </button>
  );
}
