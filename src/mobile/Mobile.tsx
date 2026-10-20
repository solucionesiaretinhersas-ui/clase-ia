import { useEffect, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { ArrowLeft, Check, ChevronRight, ExternalLink, FileText, Gamepad2, Hand, Presentation, Radio, Rocket, Sparkles } from 'lucide-react';
import { MOMENTS, SCREENS } from '../data/workshop';
import { CopyButton } from '../components/ui';
import { ANSWER_KEYS } from '../data/answers';
import { REFINEMENTS } from '../data/prompts';
import { STUDIO_STEPS } from '../data/studioSteps';
import { navigate, queryParam, segments } from '../lib/router';
import { LIVE_SYNC_AVAILABLE, registerParticipant, sendIdea, sendResponse, useLiveState, type LiveAct } from '../lib/sync';
import { clearStored, usePersistentState } from '../lib/storage';
import { unlockedLinks } from '../data/links';
import { AI_STUDIO_URL, CHATGPT_URL } from '../lib/urls';
import { PromptLab } from '../screens/PromptLab';

function Shell({ title, children, back = true }: { title: string; children: ReactNode; back?: boolean }) {
  return (
    <div className="mob">
      <header className="mob__head">
        {back ? (
          <button type="button" className="btn btn--ghost btn--icon" onClick={() => navigate(LIVE_SYNC_AVAILABLE ? '/m/vivo' : '/m')} aria-label="Volver">
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
    case 'vivo':
      return <Live session={queryParam(path, 's')} />;
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
      return LIVE_SYNC_AVAILABLE ? <Live session={queryParam(path, 's')} /> : <Hub />;
  }
}

/** Participación: el docente responde o envía ideas que aparecen en el tablero. */
function Participate({ session, act }: { session: string; act: LiveAct }) {
  const [picks, setPicks] = usePersistentState<Record<string, number>>('mobile:picks', {});
  const [sent, setSent] = usePersistentState<Record<string, string[]>>('mobile:ideas', {});
  const [text, setText] = useState('');
  const [state, setState] = useState<SendState>('idle');
  const [wait, setWait] = useState(false);

  async function choose(i: number) {
    setState('sending');
    setPicks((p) => ({ ...p, [act.key]: i }));
    try {
      await sendResponse(session, act.key, String(i));
      setState('sent');
    } catch {
      setState('error');
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t || wait) return;
    setState('sending');
    setWait(true);
    window.setTimeout(() => setWait(false), 1200);
    try {
      await sendIdea(session, act.key, t);
      setSent((s) => ({ ...s, [act.key]: [...(s[act.key] ?? []), t] }));
      setText('');
      setState('sent');
    } catch {
      setState('error');
    }
  }

  const mine = sent[act.key] ?? [];
  const picked = picks[act.key];

  return (
    <section className="part glass" aria-label="Participa">
      <span className="kicker">Tu turno</span>
      <h3>{act.prompt}</h3>
      {!act.open && <p className="note-warn">Esperando a que el facilitador abra la participación…</p>}

      {act.kind === 'choice' ? (
        <div className="part__opts">
          {(act.options ?? []).map((o, i) => (
            <button
              key={o}
              type="button"
              className={`part__opt ${picked === i ? 'is-picked' : ''}`}
              style={{ '--c': ANSWER_KEYS[i % 4].color } as CSSProperties}
              disabled={!act.open}
              onClick={() => choose(i)}
            >
              <b>{ANSWER_KEYS[i % 4].letter}</b>
              {o}
              {picked === i && <Check />}
            </button>
          ))}
        </div>
      ) : (
        <form className="mob__form" onSubmit={submit}>
          <textarea
            className="input"
            rows={3}
            value={text}
            maxLength={280}
            disabled={!act.open}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe tu idea…"
            aria-label="Tu idea"
          />
          <button type="submit" className="btn btn--primary btn--lg" disabled={!act.open || !text.trim() || wait}>
            Enviar al tablero
          </button>
        </form>
      )}

      {state === 'sending' && <p className="note-muted">Enviando…</p>}
      {state === 'sent' && <p className="note-ok">¡Enviado! Míralo en el tablero.</p>}
      {state === 'error' && <p className="note-warn">No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.</p>}
      {act.kind === 'ideas' && mine.length > 0 && (
        <ul className="part__sent" aria-label="Tus ideas enviadas">
          {mine.slice(-3).map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Registro: cada docente escribe su nombre al entrar. Con él se arma la ruleta. */
function Register({ session, onDone }: { session: string; onDone: () => void }) {
  const [savedName, setSavedName] = usePersistentState('mobile:name', '');
  const [name, setName] = useState(savedName);
  const [state, setState] = useState<SendState>('idle');

  async function submit(e: FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    setState('sending');
    try {
      await registerParticipant(session, n);
      setSavedName(n);
      onDone();
    } catch {
      setState('error');
    }
  }

  return (
    <Shell title="Bienvenido al taller" back={false}>
      <p className="mob__lead">Escribe tu nombre para entrar. Lo usaremos en la ruleta de participación.</p>
      <form className="mob__form" onSubmit={submit}>
        <label className="field">
          <span>Tu nombre</span>
          <input className="input input--xl" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej.: Marta Rodríguez" maxLength={40} autoComplete="name" required />
        </label>
        <button type="submit" className="btn btn--primary btn--lg" disabled={!name.trim() || state === 'sending'}>
          {state === 'sending' ? 'Entrando…' : 'Entrar al taller'}
        </button>
      </form>
      {state === 'error' && <p className="note-warn">No se pudo registrar. Revisa tu conexión e inténtalo de nuevo.</p>}
      <p className="note-muted">Sesión {session}. Solo se guarda tu nombre para este taller.</p>
    </Shell>
  );
}

/** Seguimiento en vivo: refleja la pantalla que el facilitador proyecta. Es el único punto de entrada del taller. */
function Live({ session: fromUrl }: { session: string }) {
  const [saved, setSaved] = usePersistentState('mobile:session', '');
  const [registered, setRegistered] = usePersistentState('mobile:registered', '');
  const [name] = usePersistentState('mobile:name', '');
  const [draft, setDraft] = useState('');
  const session = (fromUrl || saved).trim().toUpperCase();
  const { state, status } = useLiveState(LIVE_SYNC_AVAILABLE && registered === session ? session : '');

  // Un taller nuevo (otro código de sesión) empieza limpio en este celular.
  useEffect(() => {
    const incoming = fromUrl.trim().toUpperCase();
    if (incoming && incoming !== saved) {
      clearStored((k) => k.startsWith('mobile:') && k !== 'mobile:name');
      setSaved(incoming);
    }
  }, [fromUrl, saved, setSaved]);

  const current = state ? SCREENS.find((s) => s.id === state.screenId) : undefined;
  const curIdx = current ? SCREENS.indexOf(current) : -1;
  const moment = current ? MOMENTS.find((m) => m.id === current.moment) : undefined;
  const links = current ? unlockedLinks(current.id) : [];

  if (!LIVE_SYNC_AVAILABLE) return <Hub />;

  if (!session) {
    return (
      <Shell title="Taller en vivo" back={false}>
        <p className="mob__lead">Escribe el código de sesión que aparece en el tablero.</p>
        <form className="mob__form" onSubmit={(e) => { e.preventDefault(); setSaved(draft.trim().toUpperCase()); }}>
          <input className="input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Código, p. ej. K7M2Q" maxLength={12} autoCapitalize="characters" aria-label="Código de sesión" />
          <button type="submit" className="btn btn--primary btn--lg" disabled={!draft.trim()}>Conectar</button>
        </form>
      </Shell>
    );
  }

  if (registered !== session) return <Register session={session} onDone={() => setRegistered(session)} />;

  return (
    <Shell title={`Hola, ${name.split(' ')[0] || 'docente'}`} back={false}>
      <span className={`chip ${status === 'live' ? 'chip--live' : status === 'error' ? 'chip--warn' : 'chip--muted'}`}>
        {status === 'live' && <span className="dot dot--pulse" />}
        {status === 'live' ? 'Conectado' : status === 'error' ? 'Sin conexión' : 'Conectando…'} · sesión {session}
      </span>

      {current ? (
        <article className="live-now glass" style={{ '--accent': moment?.accent ?? 'var(--violet)' } as CSSProperties}>
          <span className="kicker">{moment ? `Momento ${moment.index} · ${moment.title}` : 'Introducción'}</span>
          <h2>{current.title}</h2>
          <p className="live-now__label">Qué hacemos ahora</p>
          <p className="live-now__text">{current.notes.participant}</p>
          {current.id === 'cierre' && (
            <div className="live-now__links">
              <button type="button" className="btn btn--primary" onClick={() => navigate(`/m/cierre?s=${session}`)}>Escribir mi compromiso</button>
            </div>
          )}
        </article>
      ) : (
        <p className="mob__lead">{status === 'live' ? 'Esperando a que el facilitador inicie el taller…' : 'Conectando con el taller…'}</p>
      )}

      {state?.act && <Participate session={session} act={state.act} />}

      {links.length > 0 && (
        <section className="links-card glass" aria-label="Enlaces del taller">
          <h3>Enlaces del taller</h3>
          <ul>
            {links.map((l) => {
              const body = (
                <>
                  <span>
                    <strong>{l.label}</strong>
                    <small>{l.description}</small>
                  </span>
                  {l.url ? <ExternalLink /> : <ChevronRight />}
                </>
              );
              return (
                <li key={l.id}>
                  {l.url ? (
                    <a className="links-card__item" href={l.url} target="_blank" rel="noopener noreferrer">{body}</a>
                  ) : (
                    <button type="button" className="links-card__item" onClick={() => navigate(l.route ?? '/m/vivo')}>{body}</button>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="note-muted">Los enlaces aparecen aquí a medida que el facilitador avanza.</p>
        </section>
      )}

      <h3 className="mob__h">Recorrido del taller</h3>
      <ol className="timeline">
        {SCREENS.map((s, i) => (
          <li key={s.id} className={i === curIdx ? 'is-now' : i < curIdx ? 'is-past' : ''}>
            <i />
            {s.title}
          </li>
        ))}
      </ol>
    </Shell>
  );
}

function Hub() {
  const items = [
    { to: '/m/vivo', icon: Radio, title: 'Seguir el taller en vivo', text: 'Lo que pasa en el tablero, ahora' },
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
          <a className="mob__item glass" href={CHATGPT_URL} target="_blank" rel="noopener noreferrer">
            <ExternalLink />
            <span>
              <strong>ChatGPT</strong>
              <small>Para estructurar tu clase</small>
            </span>
            <ChevronRight />
          </a>
        </li>
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
