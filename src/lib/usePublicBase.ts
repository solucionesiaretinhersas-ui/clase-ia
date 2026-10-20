import { usePersistentState } from './storage';
import { classifyHost, currentBase, lanUrls, type HostKind } from './urls';

/**
 * Dirección base que usan los QR internos. Por defecto es la dirección actual
 * del navegador; el facilitador puede reemplazarla por la URL pública (tras
 * publicar la app) o por la dirección de red local del equipo.
 */
export function usePublicBase() {
  const [override, setOverride] = usePersistentState<string | null>('publicBase', null);
  const base = override ?? currentBase();
  const kind: HostKind = classifyHost(base);
  return {
    base,
    kind,
    reachable: kind === 'public' || kind === 'lan',
    override,
    setOverride,
    lan: lanUrls(),
  };
}
