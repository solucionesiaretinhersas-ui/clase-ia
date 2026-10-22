import { AppWindow, ArrowLeft, ArrowRight, Eye, ExternalLink, ListChecks, LogIn, Mic, MousePointerClick, PanelRightOpen, Pause, Play, ScreenShare, Target } from 'lucide-react';
import { Ambient, CopyButton } from '../components/ui';
import { useToast } from '../components/Toast';
import { ROCAS } from '../data/rocas';
import { sfx } from '../lib/sfx';
import { usePersistentState } from '../lib/storage';
import { AI_STUDIO_URL, CHATGPT_URL } from '../lib/urls';

/** Instrucción de la demostración: el ejemplo del ciclo del agua, armado con ROCAS. */
export const DEMO_PROMPT = ROCAS.map((r) => r.example).join(' ');
const IMPROVE_PROMPT = 'La retroalimentación solo dice "incorrecto". Explica por qué cada respuesta es correcta o no, haz los botones más grandes para proyectar y agrega una pantalla final con el resultado.';

interface Step {
  title: string;
  explain: string;
  observe: string;
  action: string;
  expect: string;
  verify: string;
  say: string;
  copy?: string;
}

/** Guion de la demostración en vivo: lo que explico, lo que observan, lo que hago, lo que espero y lo que verifico. */
export const DEMO_STEPS: Step[] = [
  {
    title: 'Abrir Google AI Studio',
    explain: 'AI Studio es un espacio de Google para trabajar con modelos de IA; lo abrimos en su sitio oficial.',
    observe: 'La dirección aistudio.google.com y que es una herramienta aparte de esta presentación.',
    action: 'Pulsar “Abrir Google AI Studio”: se abre en una ventana a la derecha.',
    expect: 'La página de inicio de AI Studio, o la pantalla de acceso de Google.',
    verify: 'Que la ventana esté visible junto a la presentación.',
    say: 'Esta herramienta no es de nosotros: es de Google. Lo que hacemos hoy es aprender a usarla con criterio pedagógico.',
  },
  {
    title: 'Iniciar sesión con Google',
    explain: 'Se inicia sesión directamente en el sitio de Google. Esta presentación nunca ve ni guarda contraseñas.',
    observe: 'Que el acceso ocurre en la ventana de Google, no en AULA IA.',
    action: 'Iniciar sesión con tu cuenta de Google en esa ventana (la tuya o la institucional).',
    expect: 'Ver el panel de AI Studio con tu cuenta. Algunas funciones dependen de la cuenta y de su plan.',
    verify: 'Que aparezca tu cuenta y el menú de la herramienta.',
    say: 'Para ustedes también bastará una cuenta de Google. Lo que puedan usar depende de su cuenta y de lo que Google ofrezca en ese momento.',
  },
  {
    title: 'Entrar a Build',
    explain: 'Build es la sección donde se describe una aplicación y la IA la construye (cuando esté disponible en tu cuenta).',
    observe: 'Dónde está Build en el menú y cómo se ve su caja de instrucciones.',
    action: 'Abrir Build desde el menú.',
    expect: 'Un cuadro para escribir lo que quieres construir.',
    verify: 'Si Build no aparece, explica que depende de la cuenta o del momento, y continúa con el recurso de ejemplo de la galería.',
    say: 'Aquí es donde “programamos escribiendo”: el vibe coding que vimos en la animación.',
  },
  {
    title: 'Pegar la instrucción ROCAS',
    explain: 'Usamos el prompt del ciclo del agua construido con ROCAS: rol, objetivo, contexto, acción y solución.',
    observe: 'Cómo cada piedra de ROCAS aparece dentro del texto.',
    action: 'Copiar el prompt desde este panel, pegarlo en Build y enviarlo.',
    expect: 'Una primera versión del recurso tras unos segundos o minutos.',
    verify: 'Que el texto pegado esté completo antes de enviar.',
    say: 'Fíjense: el rol, el objetivo, el contexto, la acción y la solución. Nada de esto lo inventó la IA: lo pusimos nosotros.',
    copy: DEMO_PROMPT,
  },
  {
    title: 'Revisar la primera versión',
    explain: 'La primera versión es un borrador, no un producto terminado.',
    observe: 'Qué entendió bien la IA y qué dejó por fuera.',
    action: 'Recorrer lo generado sin modificar nada todavía.',
    expect: 'Un recurso con explicación, actividades y evaluación, con fallas probables.',
    verify: 'Anota en voz alta dos aciertos y una falla.',
    say: 'Si algo está mal, no es un fracaso: es información para mejorar la instrucción.',
  },
  {
    title: 'Probarlo como estudiante',
    explain: 'Usar el recurso como lo haría un estudiante es la única forma de saber si funciona.',
    observe: 'Qué ocurre al responder bien y al equivocarse a propósito.',
    action: 'Pedir a un docente voluntario que lo use frente al grupo.',
    expect: 'Una respuesta del recurso ante aciertos y errores.',
    verify: 'Si hay retroalimentación que explique, si se entienden las instrucciones, si se ve bien proyectado.',
    say: 'Aquí la lupa pedagógica: contenido, claridad, usabilidad, accesibilidad.',
  },
  {
    title: 'Detectar un error y pedir una mejora',
    explain: 'Nombrar el problema con claridad es la mejor instrucción de mejora.',
    observe: 'Cómo se describe el defecto en lenguaje natural, con una sola petición.',
    action: 'Copiar el prompt de mejora, pegarlo en la conversación de Build y enviarlo.',
    expect: 'Una versión corregida; puede haber nuevos detalles por revisar.',
    verify: 'Probar de nuevo lo que se pidió cambiar.',
    say: 'Un cambio a la vez. Y siempre vuelvan a probar: la IA puede resolver una cosa y descomponer otra.',
    copy: IMPROVE_PROMPT,
  },
  {
    title: 'Guardar, compartir y decidir',
    explain: 'Usa las opciones que AI Studio ofrezca para guardar o compartir; pueden variar según tu cuenta.',
    observe: 'Qué opciones aparecen y qué se necesita para que otra persona lo abra.',
    action: 'Probar el enlace o la exportación en otro dispositivo antes de prometer que funciona.',
    expect: 'Un recurso que puedas abrir de nuevo, o un plan alterno si no hay compartir.',
    verify: 'Que el docente decida si el recurso está listo para sus estudiantes: esa decisión es humana.',
    say: 'La responsabilidad final del recurso es del docente.',
  },
];

/** Abre una ventana emergente en una mitad de la pantalla (para verla al lado de la presentación). */
function openSide(url: string, name: string, side: 'left' | 'right', width?: number) {
  const s = window.screen as Screen & { availLeft?: number; availTop?: number };
  const w = width ?? Math.round(s.availWidth / 2);
  const left = (s.availLeft ?? 0) + (side === 'right' ? s.availWidth - w : 0);
  return window.open(url, name, `popup=yes,width=${w},height=${s.availHeight},left=${left},top=${s.availTop ?? 0}`);
}

function useDemo() {
  const [step, setStep] = usePersistentState('demo:step', 0);
  const [paused, setPaused] = usePersistentState('demo:paused', false);
  const toast = useToast();
  const last = DEMO_STEPS.length - 1;
  const go = (n: number) => {
    setStep(Math.max(0, Math.min(last, n)));
    sfx.pop();
  };
  const blocked = () => toast('El navegador bloqueó la ventana. Permite las ventanas emergentes para este sitio.', 'error');
  return {
    step: Math.min(step, last),
    paused,
    go,
    last,
    togglePause: () => setPaused((p) => !p),
    openStudio: () => {
      if (!openSide(AI_STUDIO_URL, 'aistudio', 'right')) blocked();
    },
    openChat: () => {
      if (!openSide(CHATGPT_URL, 'chatgpt', 'right')) blocked();
    },
    openPanel: () => {
      if (!openSide(`${window.location.href.split('#')[0]}#/panel`, 'aulaiapanel', 'right', 400)) blocked();
    },
  };
}

const ROWS: { k: keyof Step; label: string; icon: typeof Mic }[] = [
  { k: 'explain', label: 'Qué estoy explicando', icon: Mic },
  { k: 'observe', label: 'Qué debe observar el docente', icon: Eye },
  { k: 'action', label: 'Qué hago en la herramienta', icon: MousePointerClick },
  { k: 'expect', label: 'Resultado esperado', icon: Target },
  { k: 'verify', label: 'Qué verifico antes de continuar', icon: ListChecks },
];

function Dots({ step, go }: { step: number; go: (n: number) => void }) {
  return (
    <ol className="ddots" aria-label="Pasos de la demostración">
      {DEMO_STEPS.map((s, i) => (
        <li key={s.title}>
          <button type="button" className={i === step ? 'is-on' : i < step ? 'is-past' : ''} onClick={() => go(i)} aria-label={`Paso ${i + 1}: ${s.title}`} aria-current={i === step ? 'step' : undefined}>
            {i + 1}
          </button>
        </li>
      ))}
    </ol>
  );
}

/** Pantalla de la presentación: cabina de demostración que acompaña la herramienta real. */
export function DemoLive() {
  const d = useDemo();
  const s = DEMO_STEPS[d.step];
  return (
    <section className="live enter">
      <header className="screen-head">
        <span className="kicker">Demostración en vivo · herramienta real</span>
        <h2 className="h-lg">
          Del prompt <span className="grad-text">al recurso</span>, en Google AI Studio
        </h2>
      </header>

      <div className="live__grid">
        <div className={`cabin glass ${d.paused ? 'is-paused' : ''}`}>
          <div className="cabin__top">
            <span className="cabin__num">
              Paso {d.step + 1}
              <small> de {DEMO_STEPS.length}</small>
            </span>
            <Dots step={d.step} go={d.go} />
          </div>
          <h3 key={d.step}>{s.title}</h3>
          <dl key={`r${d.step}`} className="cabin__rows">
            {ROWS.map(({ k, label, icon: Icon }, i) => (
              <div key={k} style={{ animationDelay: `${i * 0.06}s` }}>
                <dt>
                  <Icon /> {label}
                </dt>
                <dd>{s[k] as string}</dd>
              </div>
            ))}
          </dl>
          {s.copy && (
            <div className="cabin__copy">
              <p>{s.copy}</p>
              <CopyButton text={s.copy} label="Copiar prompt" className="btn--primary" />
            </div>
          )}
          <details className="cabin__say">
            <summary>Mi guion para este paso</summary>
            <p>{s.say}</p>
          </details>
          <div className="cabin__ctl">
            <button type="button" className="btn btn--lg" onClick={() => d.go(d.step - 1)} disabled={d.step === 0}>
              <ArrowLeft /> Anterior
            </button>
            <button type="button" className={`btn btn--lg ${d.paused ? 'btn--ok' : ''}`} onClick={d.togglePause} aria-pressed={d.paused}>
              {d.paused ? <Play /> : <Pause />} {d.paused ? 'Continuar' : 'Pausar'}
            </button>
            <button type="button" className="btn btn--primary btn--lg" onClick={() => d.go(d.step + 1)} disabled={d.step === d.last}>
              Siguiente <ArrowRight />
            </button>
          </div>
          {d.paused && <div className="cabin__pause">En pausa · volvemos en un momento</div>}
        </div>

        <div className="live__launch">
          <button type="button" className="launch launch--main" onClick={d.openStudio}>
            <span className="launch__ico">
              <AppWindow />
            </span>
            <span>
              <strong>Abrir Google AI Studio</strong>
              <small>Ventana a la derecha · inicia sesión en el sitio de Google</small>
            </span>
            <ExternalLink />
          </button>
          <button type="button" className="launch" onClick={d.openPanel}>
            <span className="launch__ico launch__ico--alt">
              <PanelRightOpen />
            </span>
            <span>
              <strong>Vista dividida: guion flotante</strong>
              <small>Una ventana pequeña con el paso actual y los prompts para copiar</small>
            </span>
          </button>
          <div className="live__links">
            <a className="btn" href={AI_STUDIO_URL} target="_blank" rel="noopener noreferrer">
              AI Studio en pestaña nueva <ExternalLink />
            </a>
            <a className="btn" href={CHATGPT_URL} target="_blank" rel="noopener noreferrer">
              ChatGPT <ExternalLink />
            </a>
          </div>

          <div className="live__tip">
            <ScreenShare />
            <p>
              <b>Lado a lado:</b> presiona <kbd>Win</kbd> + <kbd>←</kbd> sobre esta presentación y <kbd>Win</kbd> + <kbd>→</kbd> sobre AI Studio. En la pizarra táctil, arrastra cada ventana a un borde.
            </p>
          </div>
          <div className="live__tip live__tip--warn">
            <LogIn />
            <p>
              <b>Inicio de sesión:</b> Google no permite mostrar AI Studio ni su acceso dentro de otra página, por eso se abre en su propia ventana. Esta app nunca ve tu contraseña.
            </p>
          </div>
          <div className="live__kinds">
            <h4>Qué se puede construir</h4>
            <ul>
              {['Simuladores', 'Experiencias interactivas', 'Juegos educativos', 'Aplicaciones web', 'Herramientas de apoyo pedagógico'].map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
            <small>Lo que puedas usar depende de tu cuenta, tu conexión, el modelo disponible y tu plan.</small>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Ventana pequeña flotante con el guion: se coloca sobre AI Studio mientras se explica. */
export function DemoPanel() {
  const d = useDemo();
  const s = DEMO_STEPS[d.step];
  return (
    <div className="panel">
      <Ambient />
      <div className="panel__in">
        <header>
          <span className="kicker">
            Paso {d.step + 1} de {DEMO_STEPS.length}
          </span>
          <button type="button" className="btn btn--primary" onClick={d.openStudio}>
            AI Studio <ExternalLink />
          </button>
        </header>
        <Dots step={d.step} go={d.go} />
        <h3 className="panel__title">{s.title}</h3>
        <dl className="cabin__rows cabin__rows--compact">
          {ROWS.map(({ k, label, icon: Icon }) => (
            <div key={k}>
              <dt>
                <Icon /> {label}
              </dt>
              <dd>{s[k] as string}</dd>
            </div>
          ))}
        </dl>
        {s.copy && (
          <div className="cabin__copy">
            <p>{s.copy}</p>
            <CopyButton text={s.copy} label="Copiar prompt" className="btn--primary" />
          </div>
        )}
        <div className="cabin__ctl">
          <button type="button" className="btn" onClick={() => d.go(d.step - 1)} disabled={d.step === 0} aria-label="Paso anterior">
            <ArrowLeft />
          </button>
          <button type="button" className="btn btn--primary" onClick={() => d.go(d.step + 1)} disabled={d.step === d.last}>
            Siguiente <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
