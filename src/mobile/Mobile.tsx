import { useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { ArrowLeft, Check, ChevronRight, ExternalLink, FileText, Gamepad2, Hand, Presentation, Rocket, Sparkles } from 'lucide-react';
import { CopyButton } from '../components/ui';
import { ANSWER_KEYS } from '../data/answers';
import { REFINEMENTS } from '../data/prompts';
import { STUDIO_STEPS } from '../data/studioSteps';
import { navigate, queryParam, segments } from '../lib/router';
import { LIVE_SYNC_AVAILABLE, sendResponse } from '../lib/sync';
import { usePersistentState } from '../lib/storage';
import { AI_STUDIO_URL } from '../lib/urls';
import { PromptLab } from '../screens/PromptLab';

function Shell({ title, children, back = true }: { title: string; children: ReactNode; back?: boolean }) {
  return (
    <div className="mob">
      <header className="mob__head">
        {back ? (
          <button type="button" className="btn btn--ghost btn--icon" onClick={() => navigate('/m')} aria-label="Volver al menú">
            <ArrowLeft />
          </button>
        ) : (
          <span className="brand__mark" aria-hidden="true">A</span>
        )}
        <div>
          <strong>{title}</strong>
          <small>Aula IA · Santa Rosa de Lima</small>
        </div>
      </header>
      <main className="mob__main">{children}</main>
    </div>
  );
}

export function Mobile({ path }: { path: string }) {
  const [, page] = segments(path);
  switch (page) {
    case 'responder':
      return <Respond session={queryParam(path, 's')} />;
    case 'prompt':
      return (
        <Shell title="Prompt del taller">
          <PromptLab compact />
        </Shell>
      );
    case 'guia':
      return <Guide />;
    case 'cierre':
      return <Exit session={queryParam(path, 's')} />;
    default:
      return <Hub />;
  }
}

function Hub() {
  const items = [
    { to: '/m/responder', icon: Hand, title: 'Tarjeta de respuesta', text: 'Elige tu letra y levanta el celular' },
    { to: '/m/prompt', icon: Sparkles, title: 'Prompt del taller', text: 'Personaliza y copia tu prompt' },
    { to: '/m/guia', icon: FileText, title: 'Guía de creación', text: 'Pasos y prompts de mejora' },
    { to: '/demo', icon: Gamepad2, title: 'Recurso de demostración', text: 'Misión: salvar el planeta' },
    { to: '/m/cierre', icon: Rocket, title: 'Actividad de cierre', text: 'Tu compromiso docente' },
  ];
  return (
    <Shell title="Modo participación" back={false}>
      <p className="mob__lead">Elige lo que necesitas durante el taller.</p>
      <ul className="mob__list">
        {items.map(({ to, icon: Icon, title, text }) => (
          <li key={to}>
            <button type="button" className="mob__item glass" onClick={() => navigate(to)}>
              <Icon />
              <span>
                <strong>{title}</strong>
                <small>{text}</small>
              </span>
              <ChevronRight />
            </button>
          </li>
        ))}
        <li>
          <a className="mob__item glass" href={AI_STUDIO_URL} target="_blank" rel="noopener noreferrer">
            <ExternalLink />
            <span>
              <strong>Google AI Studio</strong>
              <small>Se abre en una pestaña nueva</small>
            </span>
            <ChevronRight />
          </a>
        </li>
        <li>
          <button type="button" className="mob__item glass" onClick={() => navigate('/')}>
            <Presentation />
            <span>
              <strong>Pantalla del facilitador</strong>
              <small>Vista de presentación</small>
            </span>
            <ChevronRight />
          </button>
        </li>
      </ul>
    </Shell>
  );
}

type SendState = 'idle' | 'sending' | 'sent' | 'error';

/** Envía a Firebase solo si hay sincronización configurada y un código de sesión válido. */
function useSender(session: string, activityId: string) {
  const live = LIVE_SYNC_AVAILABLE && Boolean(session);
  const [state, setState] = useState<SendState>('idle');
  const send = async (value: string) => {
    if (!live) return;
    setState('sending');
    try {
      await sendResponse(session, activityId, value);
      setState('sent');
    } catch {
      setState('error');
    }
  };
  return { live, state, send };
}

function SendNote({ live, state, session }: { live: boolean; state: SendState; session: string }) {
  if (!live)
    return (
      <p className="note-muted">
        {session ? 'La sincronización en vivo no está configurada en esta web.' : 'Este enlace no trae código de sesión.'} Tu respuesta se guarda solo en este celular.
      </p>
    );
  if (state === 'sending') return <p className="note-muted">Enviando…</p>;
  if (state === 'sent') return <p className="note-ok">Enviado a la pantalla del facilitador.</p>;
  if (state === 'error') return <p className="note-warn">No se pudo enviar. Revisa tu conexión y vuelve a tocar tu respuesta.</p>;
  return <p className="note-muted">Tu respuesta se enviará a la pantalla del facilitador (sesión {session.toUpperCase()}).</p>;
}

function Respond({ session }: { session: string }) {
  const [choice, setChoice] = usePersistentState<number | null>('mobile:card', null);
  const { live, state, send } = useSender(session, 'apertura');
  const k = choice !== null ? ANSWER_KEYS[choice] : null;
  const pick = (i: number) => {
    setChoice(i);
    void send(String(i));
  };
  return (
    <Shell title="Tarjeta de respuesta">
      {k ? (
        <div className="card-up" style={{ '--c': k.color } as CSSProperties}>
          <span>{k.letter}</span>
          <p>{live ? 'Tu respuesta quedó registrada.' : 'Levanta tu celular para que el facilitador cuente tu respuesta.'}</p>
          <button type="button" className="btn btn--lg" onClick={() => setChoice(null)}>
            Cambiar respuesta
          </button>
        </div>
      ) : (
        <>
          <p className="mob__lead">Toca la letra que elegiste en la pantalla principal.</p>
          <div className="mob__keys">
            {ANSWER_KEYS.map((a, i) => (
              <button key={a.letter} type="button" style={{ '--c': a.color } as CSSProperties} onClick={() => pick(i)}>
                {a.letter}
              </button>
            ))}
          </div>
        </>
      )}
      <SendNote live={live} state={state} session={session} />
    </Shell>
  );
}

function Guide() {
  const [done, setDone] = usePersistentState<number[]>('mobile:guide', []);
  return (
    <Shell title="Guía de creación">
      <ol className="mob__steps">
        {STUDIO_STEPS.map((s, i) => (
          <li key={s.title} className={done.includes(i) ? 'is-done' : ''}>
            <button type="button" onClick={() => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))} aria-pressed={done.includes(i)} aria-label={`Paso ${i + 1} ${done.includes(i) ? 'completado' : 'pendiente'}`}>
              {done.includes(i) ? <Check /> : i + 1}
            </button>
            <div>
              <strong>{s.title}</strong>
              <p>{s.detail}</p>
            </div>
          </li>
        ))}
      </ol>
      <a className="btn btn--primary btn--lg mob__cta" href={AI_STUDIO_URL} target="_blank" rel="noopener noreferrer">
        Abrir Google AI Studio <ExternalLink />
      </a>
      <h3 className="mob__h">Prompts de mejora</h3>
      {REFINEMENTS.map((r) => (
        <article key={r.title} className="refine__card glass">
          <strong>{r.title}</strong>
          <p>{r.prompt}</p>
          <CopyButton text={r.prompt} />
        </article>
      ))}
    </Shell>
  );
}

function Exit({ session }: { session: string }) {
  const [data, setData] = usePersistentState('mobile:exit', { resource: '', problem: '', how: '', saved: false });
  const [draft, setDraft] = useState(data);
  const { live, state, send } = useSender(session, 'cierre');

  function submit(e: FormEvent) {
    e.preventDefault();
    setData({ ...draft, saved: true });
    void send(JSON.stringify({ resource: draft.resource.trim(), problem: draft.problem.trim(), how: draft.how.trim() }));
  }
  const summary = `Voy a crear: ${data.resource}\nPara resolver: ${data.problem}\nLo aplicaré: ${data.how}`;

  return (
    <Shell title="Actividad de cierre">
      {data.saved ? (
        <div className="exit-done">
          <Check />
          <h2>Compromiso guardado en este celular</h2>
          <pre>{summary}</pre>
          <SendNote live={live} state={state} session={session} />
          {live && state === 'error' && (
            <button type="button" className="btn" onClick={() => void send(JSON.stringify({ resource: data.resource, problem: data.problem, how: data.how }))}>
              Reintentar envío
            </button>
          )}
          <CopyButton text={summary} label="Copiar mi compromiso" className="btn--primary btn--lg" />
          <button type="button" className="btn btn--ghost" onClick={() => { setDraft({ ...data, saved: false }); setData({ ...data, saved: false }); }}>
            Editar
          </button>
        </div>
      ) : (
        <form className="mob__form" onSubmit={submit}>
          <label className="field">
            <span>¿Qué recurso vas a crear?</span>
            <input className="input" value={draft.resource} onChange={(e) => setDraft({ ...draft, resource: e.target.value })} required />
          </label>
          <label className="field">
            <span>¿Qué problema de aprendizaje resuelve?</span>
            <textarea className="input" rows={3} value={draft.problem} onChange={(e) => setDraft({ ...draft, problem: e.target.value })} />
          </label>
          <label className="field">
            <span>¿Cómo y cuándo lo aplicarás?</span>
            <textarea className="input" rows={3} value={draft.how} onChange={(e) => setDraft({ ...draft, how: e.target.value })} />
          </label>
          <button type="submit" className="btn btn--primary btn--lg">
            Guardar mi compromiso
          </button>
        </form>
      )}
    </Shell>
  );
}
