import { joinRoute } from '../data/workshops';
import type { CSSProperties } from 'react';
import { Eye, EyeOff, Minus, RefreshCw, Smartphone } from 'lucide-react';
import { ActivityControls, useActivityStatus } from '../components/ActivityShell';
import { QRCode } from '../components/QRCode';
import { useWorkshop } from '../data/workshops';
import { useAnnounce } from '../presenter/announce';
import { ANSWER_KEYS } from '../data/answers';
import { LIVE_SYNC_AVAILABLE, useLiveResponses, useSessionCode } from '../lib/sync';
import { usePersistentState } from '../lib/storage';
import { usePublicBase } from '../lib/usePublicBase';
import { internalUrl } from '../lib/urls';

const ID = 'apertura';
const OPTIONS_D = ['Nunca la he usado', 'Alguna vez, por curiosidad', 'La uso para planear clases', 'Ya creo recursos con IA'];
const OPTIONS_E = ['Nunca la he usado', 'Alguna vez, por curiosidad', 'La uso para mis tareas', 'Ya creo cosas con IA'];

export function OpeningVote() {
  const ws = useWorkshop();
  const student = ws.audience === 'estudiante';
  const OPTIONS = student ? OPTIONS_E : OPTIONS_D;
  const QUESTION = student ? '¿Has usado inteligencia artificial?' : '¿Has usado inteligencia artificial para preparar tus clases?';
  const [status] = useActivityStatus(ID);
  const [manual, setManual] = usePersistentState<number[]>(`vote:${ID}`, [0, 0, 0, 0]);
  const [showResults, setShowResults] = usePersistentState(`vote:${ID}:show`, false);
  const { base, reachable } = usePublicBase();
  const { code, renew } = useSessionCode();
  const live = useLiveResponses(LIVE_SYNC_AVAILABLE ? code : '', ID);

  // Votos de los celulares (uno por dispositivo) + conteo manual de tarjetas levantadas.
  const remote = [0, 0, 0, 0];
  live.responses.forEach((r) => {
    const i = Number(r.value);
    if (i >= 0 && i < 4) remote[i]++;
  });
  const votes = manual.map((n, i) => n + remote[i]);
  const total = votes.reduce((a, b) => a + b, 0);
  const open = status === 'open';
  const reveal = showResults || status === 'closed';
  const max = Math.max(1, ...votes);
  const leader = total ? votes.indexOf(Math.max(...votes)) : -1;

  const bump = (i: number, d: number) => setManual((v) => v.map((n, j) => (j === i ? Math.max(0, n + d) : n)));
  const phoneUrl = internalUrl(base, joinRoute(code));
  useAnnounce('votacion', {
    key: ID,
    kind: 'choice',
    prompt: QUESTION,
    options: OPTIONS,
    open,
  });

  return (
    <section className="vote enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">Votación de apertura</span>
          <h2 className="h-lg">{QUESTION}</h2>
        </div>
        <ActivityControls id={ID} onReset={() => { setManual([0, 0, 0, 0]); setShowResults(false); renew(); }} openLabel="Abrir votación" />
      </header>

      <div className="vote__body">
        <div className={`vote__options ${!open ? 'is-locked' : ''}`}>
          {OPTIONS.map((label, i) => {
            const pct = total ? Math.round((votes[i] / total) * 100) : 0;
            const key = ANSWER_KEYS[i];
            return (
              <div key={label} className={`vote__opt ${reveal && i === leader ? 'is-leader' : ''}`} style={{ '--c': key.color } as CSSProperties}>
                <button type="button" className="vote__btn" disabled={!open} onClick={() => bump(i, 1)} aria-label={`Votar: ${label}`}>
                  <span className="vote__letter">{key.letter}</span>
                  <span className="vote__label">{label}</span>
                  <span className="vote__bar" style={{ width: reveal ? `${(votes[i] / max) * 100}%` : '0%' }} />
                  <span className="vote__num">{reveal ? `${votes[i]} · ${pct}%` : ''}</span>
                </button>
                {open && manual[i] > 0 && (
                  <button type="button" className="btn btn--ghost btn--icon vote__undo" onClick={() => bump(i, -1)} aria-label={`Restar un voto manual a ${key.letter}`}>
                    <Minus />
                  </button>
                )}
              </div>
            );
          })}
          <div className="vote__foot">
            <span className="vote__total">
              <b>{total}</b> {total === 1 ? 'voto' : 'votos'}
              {LIVE_SYNC_AVAILABLE && <small> · {live.responses.length} desde celulares</small>}
            </span>
            <button type="button" className="btn btn--ghost" onClick={() => setShowResults(!showResults)} disabled={status === 'closed'}>
              {reveal ? <EyeOff /> : <Eye />} {reveal ? 'Ocultar resultados' : 'Mostrar resultados'}
            </button>
          </div>
          {!open && status === 'idle' && <p className="locked-hint">El facilitador abrirá la votación en un momento.</p>}
        </div>

        <aside className="vote__phone glass">
          <span className="vote__phone-head">
            <Smartphone /> Vota desde tu celular
          </span>
          <QRCode value={phoneUrl} size={180} />
          {LIVE_SYNC_AVAILABLE ? (
            <>
              <span className={`chip ${live.status === 'live' ? 'chip--live' : live.status === 'error' ? 'chip--warn' : 'chip--muted'}`}>
                {live.status === 'live' && <span className="dot dot--pulse" />}
                {live.status === 'live' ? 'En vivo' : live.status === 'error' ? 'Sin conexión con Firebase' : 'Conectando…'} · sesión {code}
              </span>
              <p>Escanea, toca tu letra y el voto aparece aquí al instante.</p>
              <button type="button" className="btn btn--ghost" onClick={renew}>
                <RefreshCw /> Nueva sesión
              </button>
            </>
          ) : (
            <p className="note-muted">Sincronización en vivo no configurada. Los celulares muestran una tarjeta para levantar y el facilitador suma con +.</p>
          )}
          {!reachable && <p className="note-warn">Este QR necesita una dirección pública o de red local. Toca el botón del QR de la barra inferior (J) para ver el estado y cambiar la dirección.</p>}
        </aside>
      </div>
    </section>
  );
}
