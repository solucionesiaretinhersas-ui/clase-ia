import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  /** Se reinicia el error al cambiar de pantalla */
  resetKey: string;
}

/** Evita que un fallo en una actividad deje toda la presentación en blanco. */
export class ScreenGuard extends Component<Props, { error: Error | null; key: string }> {
  state = { error: null as Error | null, key: this.props.resetKey };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  static getDerivedStateFromProps(props: Props, state: { error: Error | null; key: string }) {
    return props.resetKey !== state.key ? { error: null, key: props.resetKey } : null;
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error en la pantalla', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="empty" role="alert">
        <p>Esta pantalla tuvo un problema y no se pudo mostrar.</p>
        <span>Puedes reintentar o seguir con la siguiente. El resto del taller no se afecta.</span>
        <button type="button" className="btn btn--primary btn--lg" onClick={() => this.setState({ error: null })}>
          <RotateCcw /> Reintentar
        </button>
      </div>
    );
  }
}
