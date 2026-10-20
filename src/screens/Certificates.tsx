import { useMemo, useState } from 'react';
import { Download, Users } from 'lucide-react';
import { CertificateCard } from '../components/CertificateCard';
import { useToast } from '../components/Toast';
import { useWorkshop } from '../data/workshops';
import { attendanceCsv, downloadBlob, fileSlug } from '../lib/certificate';
import { usePersistentState } from '../lib/storage';
import { LIVE_SYNC_AVAILABLE, useParticipants, useSessionCode } from '../lib/sync';

/** Cierre: lista de asistencia (CSV) y certificados de quienes se registraron. */
export function Certificates() {
  const ws = useWorkshop();
  const { code } = useSessionCode();
  const people = useParticipants(LIVE_SYNC_AVAILABLE ? code : '');
  const [facilitator, setFacilitator] = usePersistentState('cert:facilitator', '');
  const [picked, setPicked] = useState('');
  const toast = useToast();
  const who = people.find((p) => p.id === picked) ?? people[0];
  const isStudent = ws.audience === 'estudiante';

  const sorted = useMemo(() => [...people].sort((a, b) => a.name.localeCompare(b.name, 'es')), [people]);

  function csv() {
    const now = new Date();
    downloadBlob(
      attendanceCsv(sorted.map((p) => ({ name: p.name, grade: p.grade, at: p.at })), { workshop: ws.certificate.title, audience: ws.audience, date: now }),
      `asistencia-${ws.id}-${fileSlug(now.toLocaleDateString('es-CO'))}.csv`,
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
          <h3>
            <Users /> {people.length} {people.length === 1 ? 'registrado' : 'registrados'}
          </h3>
          {!LIVE_SYNC_AVAILABLE ? (
            <p className="note-muted">La sincronización no está configurada: no hay registro de asistentes.</p>
          ) : people.length === 0 ? (
            <p className="note-muted">Aún no hay participantes registrados.</p>
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
          <p className="note-muted">Cada participante descarga su propio certificado desde su celular. Aquí puedes ver o descargar el de cualquiera.</p>
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
            }}
          />
        </div>
      </div>
    </section>
  );
}
