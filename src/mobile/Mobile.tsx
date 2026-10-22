import { useEffect, useLayoutEffect, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { Award, Check, ChevronLeft, ChevronRight, ExternalLink, FileText, Gamepad2, Hand, Presentation, Radio, Rocket, Sparkles } from 'lucide-react';
import { WORKSHOPS, getWorkshopId, setWorkshopId, useWorkshop, workshopFromParam } from '../data/workshops';
import type { CertificateData } from '../lib/certificate';
import { CertificateCard } from '../components/CertificateCard';
import { StudentLab } from '../screens/StudentLab';
import { CopyButton } from '../components/ui';
import { ThemeToggle } from '../components/ThemeToggle';
import { SoundToggle } from '../components/SoundToggle';
import { sfx } from '../lib/sfx';
import { ANSWER_KEYS } from '../data/answers';
import { STUDENT_REFINEMENTS } from '../data/prompts';
import { studioStepsFor } from '../data/studioSteps';
import { navigate, queryParam, segments } from '../lib/router';
import { LIVE_SYNC_AVAILABLE, lookupCertificate, registerParticipant, sendIdea, sendResponse, useLiveState, type IssuedCertificate, type LiveAct } from '../lib/sync';
import { clearStored, usePersistentState } from '../lib/storage';
import { unlockedLinks } from '../data/links';
import { AI_STUDIO_URL, CHATGPT_URL } from '../lib/urls';
import { PromptLab } from '../screens/PromptLab';

function Shell({ title, children, back = true, wide = false }: { title: string; children: ReactNode; back?: boolean; wide?: boolean }) {
  return (
    <div className={`mob ${wide ? 'mob--wide' : ''}`}>
      <header className="mob__bar">
        <div className="mob__bar-in">
          {back ? (
            <button type="button" className="mob__back" onClick={() => navigate(LIVE_SYNC_AVAILABLE ? '/m/vivo' : '/m')} aria-label="Volver">
              <ChevronLeft /> Taller
            </button>
          ) : (
            <span className="brand__mark" aria-hidden="true">A</span>
          )}
          <span className="mob__bar-title">Aula IA · Santa Rosa de Lima</span>
          <SoundToggle />
          <ThemeToggle />
        </div>
      </header>
      <main className="mob__main">
        <h1 className="mob__title">{title}</h1>
        {children}
      </main>
    </div>
  );
}

const STUDENT_GRADES = ['Sexto', 'Séptimo', 'Octavo', 'Noveno', 'Décimo', 'Undécimo', 'Otro'];

export function Mobile({ path }: { path: string }) {
  const [, page] = segments(path);
  // El enlace del QR indica a qué taller pertenece (w=d docentes, w=e estudiantes).
  const wParam = workshopFromParam(queryParam(path, 'w'));
  useLayoutEffect(() => {
    if (wParam && getWorkshopId() !== wParam) setWorkshopId(wParam);
  }, [wParam]);
  switch (page) {
    case 'vivo':
      return <Live session={queryParam(path, 's')} />;
    case 'responder':
      return <Respond session={queryParam(path, 's')} />;
    case 'prompt':
      return (
        <PromptPage />
      );
    case 'certificados':
      return <MyCertificates />;
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
    sfx.ok();
    navigator.vibrate?.(30);
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
    sfx.ok();
    navigator.vibrate?.(30);
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

  // Actividad informativa (por ejemplo, el juego por equipos): reto y marcador sin pedir respuesta.
  if (act.kind === 'info') {
    return (
      <section className="part glass" aria-label="En juego">
        <span className="kicker">En juego ahora</span>
        <h3>{act.prompt}</h3>
        <ul className="part__info">
          {(act.options ?? []).map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </section>
    );
  }

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

/** Registro obligatorio: nombre y grado (o área). Con ellos se arma la ruleta, la asistencia y el certificado. */
function Register({ session, onDone }: { session: string; onDone: () => void }) {
  const ws = useWorkshop();
  const isStudent = ws.audience === 'estudiante';
  const [savedName, setSavedName] = usePersistentState('mobile:name', '');
  const [savedGrade, setSavedGrade] = usePersistentState('mobile:grade', '');
  const [, setRegAt] = usePersistentState('mobile:regAt', 0);
  const [name, setName] = useState(savedName);
  const [grade, setGrade] = useState(savedGrade);
  const [state, setState] = useState<SendState>('idle');

  async function submit(e: FormEvent) {
    e.preventDefault();
    const n = name.trim();
    const g = grade.trim();
    if (!n || !g) return;
    setState('sending');
    try {
      await registerParticipant(session, n, g, ws.audience);
      setRegAt(Date.now());
      setSavedName(n);
      setSavedGrade(g);
      onDone();
    } catch {
      setState('error');
    }
  }

  return (
    <Shell title="Bienvenido al taller" back={false}>
      <p className="mob__lead">
        {isStudent ? 'Escribe tu nombre y tu grado para entrar.' : 'Escribe tu nombre y el área o grado en que enseñas para entrar.'} Los usaremos en la ruleta, la asistencia y tu
        certificado.
      </p>
      <form className="mob__form" onSubmit={submit}>
        <label className="field">
          <span>Nombre completo</span>
          <input className="input input--xl" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej.: Marta Rodríguez" maxLength={40} autoComplete="name" required />
        </label>
        {isStudent ? (
          <label className="field">
            <span>Grado</span>
            <select className="input input--xl" value={grade} onChange={(e) => setGrade(e.target.value)} required>
              <option value="">Elige tu grado</option>
              {STUDENT_GRADES.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </label>
        ) : (
          <label className="field">
            <span>Área o grado en que enseñas</span>
            <input className="input input--xl" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="Ej.: Matemáticas · grado sexto" maxLength={40} required />
          </label>
        )}
        <button type="submit" className="btn btn--primary btn--lg" disabled={!name.trim() || !grade.trim() || state === 'sending'}>
          {state === 'sending' ? 'Entrando…' : 'Entrar al taller'}
        </button>
      </form>
      {state === 'error' && <p className="note-warn">No se pudo registrar. Revisa tu conexión e inténtalo de nuevo.</p>}
      <p className="note-muted">Sesión {session}. Solo se guardan estos datos para este taller.</p>
      <button type="button" className="btn btn--ghost" onClick={() => navigate('/m/certificados')}>
        ¿Ya participaste? Consulta tu certificado
      </button>
    </Shell>
  );
}

/** Seguimiento en vivo: refleja la pantalla que el facilitador proyecta. Es el único punto de entrada del taller. */
function Live({ session: fromUrl }: { session: string }) {
  const ws = useWorkshop();
  const [saved, setSaved] = usePersistentState('mobile:session', '');
  const [registered, setRegistered] = usePersistentState('mobile:registered', '');
  const [name] = usePersistentState('mobile:name', '');
  const [grade] = usePersistentState('mobile:grade', '');
  const [certOpen, setCertOpen] = usePersistentState('mobile:cert', false);
  const [regAt] = usePersistentState('mobile:regAt', 0);
  const [, setSavedCerts] = usePersistentState<IssuedCertificate[]>('cert:saved', []);
  const [draft, setDraft] = useState('');
  const session = (fromUrl || saved).trim().toUpperCase();
  const { state, status } = useLiveState(LIVE_SYNC_AVAILABLE && registered === session ? session : '');

  // Un taller nuevo (otro código de sesión) empieza limpio en este celular.
  useEffect(() => {
    const incoming = fromUrl.trim().toUpperCase();
    if (incoming && incoming !== saved) {
      clearStored((k) => k.startsWith('mobile:') && k !== 'mobile:name' && k !== 'mobile:grade');
      setSaved(incoming);
    }
  }, [fromUrl, saved, setSaved]);

  const current = state ? ws.screens.find((s) => s.id === state.screenId) : undefined;
  const curIdx = current ? ws.screens.indexOf(current) : -1;
  const moment = current ? ws.moments.find((m) => m.id === current.moment) : undefined;
  const links = current ? unlockedLinks(ws.screens, current.id) : [];
  const certUnlocked = certOpen || (curIdx >= 0 && curIdx >= ws.screenIndex(ws.certificateScreen));

  useEffect(() => {
    if (certUnlocked && !certOpen) setCertOpen(true);
  }, [certUnlocked, certOpen, setCertOpen]);

  // El certificado queda guardado en este dispositivo para consultarlo después (no se borra al cambiar de taller).
  useEffect(() => {
    if (!certUnlocked || !name || registered !== session) return;
    const issued: IssuedCertificate = { session, kind: ws.audience, name, grade, at: regAt || Date.now(), facilitator: state?.fac };
    setSavedCerts((list) => {
      const prev = list.find((c) => c.session === session);
      if (prev && prev.name === issued.name && prev.grade === issued.grade && prev.facilitator === issued.facilitator) return list;
      return [issued, ...list.filter((c) => c.session !== session)];
    });
  }, [certUnlocked, name, grade, registered, session, ws.audience, regAt, state?.fac, setSavedCerts]);

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
    <Shell title={`Hola, ${name.split(' ')[0] || (ws.audience === 'estudiante' ? 'estudiante' : 'docente')}`} back={false} wide>
      <span className={`chip ${status === 'live' ? 'chip--live' : status === 'error' ? 'chip--warn' : 'chip--muted'}`}>
        {status === 'live' && <span className="dot dot--pulse" />}
        {status === 'live' ? 'Conectado' : status === 'error' ? 'Sin conexión' : 'Conectando…'} · sesión {session}
      </span>

      {curIdx >= 0 && (
        <div className="mob__stage" aria-label="Avance del taller">
          <div className="mob__stage-top">
            <span>
              <b>{moment ? `Etapa ${moment.index}` : 'Inicio'}</b> {moment ? `· ${moment.title}` : ''}
            </span>
            <span>
              {curIdx + 1} / {ws.screens.length}
            </span>
          </div>
          <div className="mob__progress" role="progressbar" aria-valuemin={0} aria-valuemax={ws.screens.length} aria-valuenow={curIdx + 1}>
            <i style={{ width: `${((curIdx + 1) / ws.screens.length) * 100}%` }} />
          </div>
        </div>
      )}

      <div className="mob__cols">
        <div className="mob__col">
          {certUnlocked && (
            <section className="part glass" aria-label="Tu certificado">
              <span className="kicker">Tu certificado</span>
              <h3>¡Gracias por participar, {name.split(' ')[0]}!</h3>
              <CertificateCard
                data={{
                  name,
                  grade,
                  audience: ws.audience,
                  title: ws.certificate.title,
                  text: ws.certificate.text,
                  minutes: ws.total,
                  facilitator: state?.fac,
                  date: new Date(regAt || Date.now()),
                }}
              />
              <button type="button" className="btn btn--ghost" onClick={() => navigate('/m/certificados')}>
                Ver todos mis certificados
              </button>
            </section>
          )}

          {current ? (
            <article className="live-now glass" style={{ '--accent': moment?.accent ?? 'var(--violet)' } as CSSProperties}>
              <span className="kicker">{moment ? `Momento ${moment.index} · ${moment.title}` : 'Introducción'}</span>
              <h2>{current.title}</h2>
              <p className="live-now__label">Qué hacemos ahora</p>
              <p className="live-now__text">{current.notes.participant}</p>
              {(current.id === 'cierre') && (
                <div className="live-now__links">
                  <button type="button" className="btn btn--primary" onClick={() => navigate(`/m/cierre?s=${session}`)}>Escribir mi compromiso</button>
                </div>
              )}
            </article>
          ) : (
            <p className="mob__lead">{status === 'live' ? 'Esperando a que el facilitador inicie el taller…' : 'Conectando con el taller…'}</p>
          )}

          {state?.act && <Participate session={session} act={state.act} />}
        </div>

        <div className="mob__col">
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
            {ws.screens.map((s, i) => (
              <li key={s.id} className={i === curIdx ? 'is-now' : i < curIdx ? 'is-past' : ''}>
                <i />
                {s.title}
              </li>
            ))}
          </ol>
        </div>
      </div>
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
    { to: '/m/certificados', icon: Award, title: 'Mis certificados', text: 'Los que ya tienes guardados' },
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

function PromptPage() {
  const ws = useWorkshop();
  const student = ws.audience === 'estudiante';
  return (
    <Shell title={student ? 'Tu prompt' : 'Prompt del taller'} wide>
      {student ? <StudentLab compact /> : <PromptLab compact />}
    </Shell>
  );
}

function Guide() {
  const ws = useWorkshop();
  const STUDIO_STEPS = studioStepsFor(ws.audience);
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
      {ws.audience === 'estudiante' && <h3 className="mob__h">Prompts de mejora</h3>}
      {(ws.audience === 'estudiante' ? STUDENT_REFINEMENTS : []).map((r) => (
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
            <span>¿Qué recurso educativo vas a crear o mejorar con IA durante las próximas semanas?</span>
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

/* ───────── Mis certificados: guardados en este dispositivo y consulta por código + nombre ───────── */
function certData(c: IssuedCertificate): CertificateData {
  const def = WORKSHOPS[c.kind === 'estudiante' ? 'estudiantes' : 'docentes'];
  return {
    name: c.name,
    grade: c.grade,
    audience: c.kind,
    title: def.certificate.title,
    text: def.certificate.text,
    minutes: def.total,
    facilitator: c.facilitator,
    date: new Date(c.at),
  };
}

function MyCertificates() {
  const [saved, setSaved] = usePersistentState<IssuedCertificate[]>('cert:saved', []);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'notfound' | 'error'>('idle');
  const list = [...saved].sort((a, b) => b.at - a.at);

  async function find(e: FormEvent) {
    e.preventDefault();
    setState('loading');
    try {
      const c = await lookupCertificate(code, name);
      if (!c) return setState('notfound');
      setSaved((l) => [c, ...l.filter((x) => x.session !== c.session)]);
      setCode('');
      setName('');
      setState('idle');
    } catch {
      setState('error');
    }
  }

  return (
    <Shell title="Mis certificados" wide>
      <div className="mob__cols">
        <div className="mob__col">
          {list.length === 0 ? (
            <p className="mob__lead">Aún no tienes certificados guardados en este dispositivo. Aparecen aquí cuando el facilitador cierra el taller, o puedes buscarlos con el código del taller.</p>
          ) : (
            list.map((c) => (
              <section key={c.session} className="part glass" aria-label={`Certificado ${c.session}`}>
                <span className="kicker">
                  {c.kind === 'estudiante' ? 'Taller para estudiantes' : 'Taller para docentes'} · {new Date(c.at).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <CertificateCard data={certData(c)} />
              </section>
            ))
          )}
        </div>
        <div className="mob__col">
          <form className="part glass mob__form" onSubmit={find}>
            <span className="kicker">Buscar un certificado</span>
            <p className="note-muted">Escribe el código del taller (el que aparecía en el tablero) y tu nombre tal como lo registraste.</p>
            <label className="field">
              <span>Código del taller</span>
              <input className="input" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Ej.: K7M2Q" maxLength={12} autoCapitalize="characters" required />
            </label>
            <label className="field">
              <span>Tu nombre</span>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej.: Marta Rodríguez" maxLength={40} required />
            </label>
            <button type="submit" className="btn btn--primary btn--lg" disabled={state === 'loading' || !code.trim() || !name.trim()}>
              {state === 'loading' ? 'Buscando…' : 'Buscar mi certificado'}
            </button>
            {state === 'notfound' && <p className="note-warn">No encontramos ese nombre en ese taller. Revisa el código y escribe el nombre igual que al registrarte.</p>}
            {state === 'error' && <p className="note-warn">No se pudo consultar. Revisa tu conexión y el código.</p>}
            {!LIVE_SYNC_AVAILABLE && <p className="note-warn">La consulta en línea no está disponible en esta web.</p>}
          </form>
        </div>
      </div>
    </Shell>
  );
}