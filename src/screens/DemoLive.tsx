import { AppWindow, Check, ExternalLink, LogIn, PanelRightOpen, ScreenShare } from 'lucide-react';
import { Ambient, CopyButton } from '../components/ui';
import { useToast } from '../components/Toast';
import { usePersistentState } from '../lib/storage';
import { AI_STUDIO_URL } from '../lib/urls';

export const DEMO_PROMPT =
  'Crea un juego para estudiantes de grado sexto donde deben atrapar la fracción correcta. Con 3 niveles, puntos, retroalimentación inmediata y botones grandes para proyectar en el tablero.';
const IMPROVE_PROMPT = 'Hazlo más difícil y agrega una barra de vidas.';

interface Step {
  title: string;
  text: string;
  copy?: string;
}

/** Guion de la demostración en vivo de Google AI Studio. */
export const DEMO_STEPS: Step[] = [
  { title: 'Abrir Google AI Studio', text: 'Se abre en una ventana aparte, al lado de esta presentación.' },
  { title: 'Iniciar sesión con Google', text: 'Se hace en esa ventana. Google no permite mostrar el inicio de sesión dentro de otra página.' },
  { title: 'Entrar a Build', text: 'En el menú de la izquierda elige Build: aquí se crean aplicaciones describiéndolas.' },
  { title: 'Pegar el prompt', text: 'Un juego de fracciones para sexto. Enviar y esperar la primera versión.', copy: DEMO_PROMPT },
  { title: 'Probarlo como estudiante', text: 'Responde bien y mal a propósito: mira la retroalimentación.' },
  { title: 'Pedir una mejora', text: 'Un cambio a la vez, en lenguaje natural.', copy: IMPROVE_PROMPT },
  { title: 'Guardar o compartir', text: 'Usa las opciones de AI Studio y prueba el enlace en otro dispositivo antes de prometer que funciona.' },
];

/** Abre una ventana emergente en una mitad de la pantalla (para verla al lado de la presentación). */
function openSide(url: string, name: string, side: 'left' | 'right', width?: number) {
  const s = window.screen as Screen & { availLeft?: number; availTop?: number };
  const w = width ?? Math.round(s.availWidth / 2);
  const left = (s.availLeft ?? 0) + (side === 'right' ? s.availWidth - w : 0);
  return window.open(url, name, `popup=yes,width=${w},height=${s.availHeight},left=${left},top=${s.availTop ?? 0}`);
}

function useDemo() {
  const [done, setDone] = usePersistentState<number[]>('demo:done', []);
  const toast = useToast();
  const toggle = (i: number) => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));
  const openStudio = () => {
    const w = openSide(AI_STUDIO_URL, 'aistudio', 'right');
    if (!w) toast('El navegador bloqueó la ventana. Permite las ventanas emergentes para este sitio.', 'error');
    else if (!done.includes(0)) setDone((d) => [...d, 0]);
  };
  const openPanel = () => {
    const w = openSide(`${window.location.href.split('#')[0]}#/panel`, 'aulaiapanel', 'right', 380);
    if (!w) toast('El navegador bloqueó la ventana. Permite las ventanas emergentes para este sitio.', 'error');
  };
  return { done, toggle, openStudio, openPanel };
}

function StepList({ done, toggle, compact = false }: { done: number[]; toggle: (i: number) => void; compact?: boolean }) {
  return (
    <ol className={`dsteps ${compact ? 'dsteps--compact' : ''}`}>
      {DEMO_STEPS.map((s, i) => (
        <li key={s.title} className={done.includes(i) ? 'is-done' : ''}>
          <button type="button" className="dsteps__check" onClick={() => toggle(i)} aria-pressed={done.includes(i)} aria-label={`Paso ${i + 1}: ${done.includes(i) ? 'hecho' : 'pendiente'}`}>
            {done.includes(i) ? <Check /> : i + 1}
          </button>
          <div>
            <strong>{s.title}</strong>
            <span>{s.text}</span>
            {s.copy && <CopyButton text={s.copy} label="Copiar prompt" />}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Pantalla de la presentación: lanza AI Studio en una ventana al lado y guía la demostración. */
export function DemoLive() {
  const { done, toggle, openStudio, openPanel } = useDemo();
  return (
    <section className="live enter">
      <header className="screen-head">
        <span className="kicker">Demostración en vivo</span>
        <h2 className="h-lg">
          Vamos a <span className="grad-text">crear algo juntos</span> en Google AI Studio
        </h2>
      </header>

      <div className="live__grid">
        <div className="live__launch">
          <button type="button" className="launch launch--main" onClick={openStudio}>
            <span className="launch__ico">
              <AppWindow />
            </span>
            <span>
              <strong>Abrir Google AI Studio</strong>
              <small>En una ventana a la derecha, lista para iniciar sesión</small>
            </span>
            <ExternalLink />
          </button>
          <button type="button" className="launch" onClick={openPanel}>
            <span className="launch__ico launch__ico--alt">
              <PanelRightOpen />
            </span>
            <span>
              <strong>Abrir el panel del guion</strong>
              <small>Una ventana pequeña con los pasos y los prompts para copiar</small>
            </span>
          </button>

          <div className="live__tip">
            <ScreenShare />
            <p>
              <b>Para verlas lado a lado:</b> en Windows presiona <kbd>Win</kbd> + <kbd>←</kbd> sobre esta presentación y <kbd>Win</kbd> + <kbd>→</kbd> sobre AI Studio. En una pizarra
              táctil basta con arrastrar cada ventana a un borde.
            </p>
          </div>
          <div className="live__tip live__tip--warn">
            <LogIn />
            <p>
              <b>Inicio de sesión:</b> Google no deja mostrar AI Studio ni su inicio de sesión dentro de otra página, por eso se abre en su propia ventana. Inicia sesión allí; esta app nunca ve tu contraseña.
            </p>
          </div>
        </div>

        <div className="live__script glass">
          <h3>Guion de la demostración</h3>
          <StepList done={done} toggle={toggle} />
        </div>
      </div>
    </section>
  );
}

/** Ventana pequeña flotante con el guion: se arrastra sobre AI Studio mientras se explica. */
export function DemoPanel() {
  const { done, toggle, openStudio } = useDemo();
  return (
    <div className="panel">
      <Ambient />
      <div className="panel__in">
        <header>
          <span className="kicker">Guion en vivo</span>
          <button type="button" className="btn btn--primary" onClick={openStudio}>
            Abrir AI Studio <ExternalLink />
          </button>
        </header>
        <StepList done={done} toggle={toggle} compact />
      </div>
    </div>
  );
}
