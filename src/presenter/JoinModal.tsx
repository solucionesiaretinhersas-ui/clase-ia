import { joinRoute, useWorkshop } from '../data/workshops';
import { useState } from 'react';
import { CircleAlert, CircleCheck, Download, Users, Wifi } from 'lucide-react';
import { CopyButton, Modal } from '../components/ui';
import { QRCode, downloadQR } from '../components/QRCode';
import { useToast } from '../components/Toast';
import { LIVE_SYNC_AVAILABLE, useParticipants, useSessionCode } from '../lib/sync';
import { internalUrl, normalizeBase } from '../lib/urls';
import { usePublicBase } from '../lib/usePublicBase';

/** QR único de ingreso al taller: se proyecta a pantalla grande. */
export function JoinModal({ onClose }: { onClose: () => void }) {
  const { base, kind, reachable, override, setOverride, lan } = usePublicBase();
  const { code } = useSessionCode();
  const ws = useWorkshop();
  const people = useParticipants(LIVE_SYNC_AVAILABLE ? code : '', ws.audience);
  const [draft, setDraft] = useState(override ?? '');
  const toast = useToast();
  const url = internalUrl(base, joinRoute(code));

  function apply(value: string) {
    if (!value.trim()) return setOverride(null);
    const n = normalizeBase(value);
    if (!n) return toast('Escribe una dirección completa, por ejemplo https://mi-sitio.vercel.app/', 'error');
    setOverride(n);
    setDraft(n);
    toast('Dirección base actualizada');
  }

  return (
    <Modal onClose={onClose} label="Únete al taller">
      <div className="join">
        <div className="join__main">
          <span className="kicker">Únete al taller</span>
          <h2>Escanea, escribe tu nombre y entra</h2>
          <div className="join__qr">
            <QRCode value={url} size={460} />
          </div>
          <div className="join__code" aria-label="Código de sesión">
            Código <b>{code}</b>
          </div>
          <code className="join__url">{url}</code>
          <div className="join__btns">
            <CopyButton text={url} label="Copiar enlace" />
            <button type="button" className="btn" onClick={() => downloadQR(url, 'Aula IA · Únete al taller', 'qr-aula-ia.png').catch(() => toast('No se pudo descargar el QR', 'error'))}>
              <Download /> Descargar QR
            </button>
          </div>
        </div>

        <aside className="join__side">
          <div className={`qrc__status ${reachable ? 'is-ok' : 'is-warn'}`}>
            <div className="qrc__status-msg">
              {reachable ? <CircleCheck /> : <CircleAlert />}
              <div>
                <strong>{reachable ? 'Los celulares pueden abrir este enlace' : 'Los celulares aún no pueden abrir este enlace'}</strong>
                <span>
                  {kind === 'local' && 'Estás en localhost: solo este equipo lo abre. Usa la web publicada o la dirección de red local.'}
                  {kind === 'file' && 'Abriste el archivo directamente: publica la app o ejecútala con npm run dev.'}
                  {kind === 'lan' && 'Red local: los celulares deben estar en el mismo Wi-Fi.'}
                  {kind === 'public' && 'Dirección pública.'}
                </span>
              </div>
            </div>
            {lan.length > 0 && (
              <div className="qrc__lan">
                <Wifi /> Red local:
                {lan.map((u) => (
                  <button key={u} type="button" className="btn" onClick={() => apply(u)}>
                    {u.replace('http://', '')}
                  </button>
                ))}
              </div>
            )}
            <div className="qrc__input">
              <input className="input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="https://tu-sitio.vercel.app/" aria-label="Dirección base pública" />
              <button type="button" className="btn" onClick={() => apply(draft)}>
                Usar
              </button>
              {override && (
                <button type="button" className="btn btn--ghost" onClick={() => { setDraft(''); setOverride(null); }}>
                  Restablecer
                </button>
              )}
            </div>
          </div>

          <div className="join__people">
            <h3>
              <Users /> Docentes conectados <b>{people.length}</b>
            </h3>
            {!LIVE_SYNC_AVAILABLE ? (
              <p className="note-muted">Sincronización no configurada: los nombres no se registran.</p>
            ) : people.length === 0 ? (
              <p className="note-muted">Todavía nadie se ha registrado.</p>
            ) : (
              <ul>
                {people.map((p) => (
                  <li key={p.id}>{p.name}</li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </Modal>
  );
}
