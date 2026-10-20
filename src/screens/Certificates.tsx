import { useMemo, useState } from 'react';
import { Download, History, Users } from 'lucide-react';
import { CertificateCard } from '../components/CertificateCard';
import { useToast } from '../components/Toast';
import { useWorkshop } from '../data/workshops';
import { attendanceCsv, downloadBlob } from '../lib/certificate';
import { usePersistentState } from '../lib/storage';
import { LIVE_SYNC_AVAILABLE, useParticipants, useSessionCode, type SessionRecord } from '../lib/sync';

const fmtDate = (t: number) => new Date(t).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });

/**
 * Cierre: lista de asistencia (CSV) y certificados. Cada taller (docentes / estudiantes)
 * tiene su propia sesión: las listas nunca se mezclan. Las sesiones anteriores del mismo
 * taller se pueden volver a abrir para descargar su asistencia o sus certificados.
 */
export function Certificates() {
  const ws = useWorkshop();
  const { code: current } = useSessionCode();
  const [history] = usePersistentState<SessionRecord[]>('history:sessions', []);
  const [facilitator, setFacilitator] = usePersistentState('cert:facilitator', '');
  const [sel, setSel] = useState('');
  const [picked, setPicked] = useState('');
  const toast = useToast();
  const isStudent = ws.audience === 'estudiante';

  // Solo sesiones de este taller, la más reciente primero.
  const sessions = useMemo(() => history.filter((h) => h.kind === ws.audience).sort((a, b) => b.startedAt - a.startedAt), [history, ws.audience]);
  const code = sel || current;
  const record = sessions.find((s) => s.code === code);

  const all = useParticipants(LIVE_SYNC_AVAILABLE ? code : '');
  const people = useMemo(() => all.filter((p) => !p.kind || p.kind === ws.audience), [all, ws.audience]);
  const sorted = useMemo(() => [...people].sort((a, b) => a.name.localeCompare(b.name, 'es')), [people]);
  const who = people.find((p) => p.id === picked) ?? sorted[0];

  function csv() {
    const when = record ? new Date(record.startedAt) : new Date();
    downloadBlob(
      attendanceCsv(sorted.map((p) => ({ name: p.name, grade: p.grade, at: p.at })), { workshop: ws.certificate.title, audience: ws.audience, date: when }),
      `asistencia-${ws.id}-${code}.csv`,
    );
    toast('Lista de asistencia descargada');
  }

  return (
    <section className="certs enter">
      <header className="screen-head screen-head--row">
        <div>
          <span className="kicker">Cierre · {isStudent ? 'Estudiantes' : 'Docentes'}</span>
          <h2 className="h-lg">Asistencia y certificados</h2>
        </div>
        <button type="button" className="btn btn--primary btn--lg" onClick={csv} disabled={people.length === 0}>
          <Download /> Lista de asistencia (CSV)
        </button>
      </header>

      <div className="certs__body">
        <div className="certs__list glass">
          <label className="field">
            <span>
              <History /> Sesión de {isStudent ? 'estudiantes' : 'docentes'}
            </span>
            <select className="input" value={code} onChange={(e) => { setSel(e.target.value === current ? '' : e.target.value); setPicked(''); }}>
              {sessions.map((s) => (
                <option key={s.code} value={s.code}>
                  {fmtDate(s.startedAt)} · {s.code}
                  {s.code === current ? ' (actual)' : ''}
                </option>
              ))}
              {sessions.length === 0 && <option value={current}>{current} (actual)</option>}
            </select>
          </label>
          <h3>
            <Users /> {people.length} {people.length === 1 ? 'registrado' : 'registrados'}
          </h3>
          {!LIVE_SYNC_AVAILABLE ? (
            <p className="note-muted">La sincronización no está configurada: no hay registro de asistentes.</p>
          ) : people.length === 0 ? (
            <p className="note-muted">No hay participantes registrados en esta sesión.</p>
          ) : (
            <ul>
              {sorted.map((p) => (
                <li key={p.id}>
                  <button type="button" className={who?.id === p.id ? 'is-on' : ''} onClick={() => setPicked(p.id)}>
                    <b>{p.name}</b>
                    <span>{p.grade}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <label className="field">
            <span>Tu nombre como facilitador (aparece en el certificado)</span>
            <input className="input" value={facilitator} onChange={(e) => setFacilitator(e.target.value)} placeholder="Ej.: Luis Alejandro Caldera" maxLength={60} />
          </label>
          <p className="note-muted">
            Cada participante descarga su certificado desde su celular y queda guardado ahí. Si lo pierde, puede pedirlo de nuevo con el código <b>{code}</b> y su nombre.
          </p>
        </div>

        <div className="certs__preview">
          <CertificateCard
            data={{
              name: who?.name ?? (isStudent ? 'Nombre del estudiante' : 'Nombre del docente'),
              grade: who?.grade,
              audience: ws.audience,
              title: ws.certificate.title,
              text: ws.certificate.text,
              minutes: ws.total,
              facilitator,
              date: who ? new Date(who.at) : record ? new Date(record.startedAt) : new Date(),
            }}
          />
        </div>
      </div>
    </section>
  );
}
