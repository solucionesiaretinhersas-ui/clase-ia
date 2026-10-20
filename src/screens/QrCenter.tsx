import { useState } from 'react';
import { CircleAlert, CircleCheck, Download, Maximize2, Wifi } from 'lucide-react';
import { CopyButton, Modal } from '../components/ui';
import { QRCode, downloadQR } from '../components/QRCode';
import { useToast } from '../components/Toast';
import { QR_LINKS, resolveUrl, type QrLink } from '../data/qrLinks';
import { normalizeBase } from '../lib/urls';
import { LIVE_SYNC_AVAILABLE, useSessionCode } from '../lib/sync';
import { usePublicBase } from '../lib/usePublicBase';

export function QrCenter() {
  const { base, kind, reachable, override, setOverride, lan } = usePublicBase();
  const [draft, setDraft] = useState(override ?? '');
  const [big, setBig] = useState<QrLink | null>(null);
  const toast = useToast();
  const { code } = useSessionCode();
  const urlOf = (l: QrLink) => resolveUrl(l, base, LIVE_SYNC_AVAILABLE ? code : '');

  function apply(value: string) {
    if (!value.trim()) {
      setOverride(null);
      return;
    }
    const n = normalizeBase(value);
    if (!n) {
      toast('Escribe una dirección completa, por ejemplo https://mi-sitio.netlify.app/', 'error');
      return;
    }
    setOverride(n);
    setDraft(n);
    toast('Dirección base actualizada');
  }

  async function download(l: QrLink) {
    try {
      await downloadQR(urlOf(l), l.title, `qr-${l.id}.png`);
    } catch {
      toast('No se pudo descargar el QR', 'error');
    }
  }

  return (
    <section className="qrc enter">
      <header className="screen-head">
        <span className="kicker">Centro de códigos QR</span>
        <h2 className="h-lg">Comparte el taller con los celulares</h2>
      </header>

      <div className={`qrc__status ${reachable ? 'is-ok' : 'is-warn'}`}>
        <div className="qrc__status-msg">
          {reachable ? <CircleCheck /> : <CircleAlert />}
          <div>
            <strong>{reachable ? 'Los QR internos pueden abrirse desde otros dispositivos' : 'Los QR internos aún no funcionan desde otros celulares'}</strong>
            <span>
              {kind === 'local' && 'Estás en localhost: solo este equipo puede abrirlo. Publica la app o usa la dirección de red local.'}
              {kind === 'file' && 'Abriste el archivo directamente: publica la app o ejecútala con npm run dev.'}
              {kind === 'lan' && 'Dirección de red local: los celulares deben estar en el mismo Wi-Fi.'}
              {kind === 'public' && 'Dirección pública. Verifica que abre desde un celular con datos móviles.'}
            </span>
            <code>{base}</code>
          </div>
        </div>
        <div className="qrc__base">
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
            <input className="input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="URL pública, p. ej. https://aula-ia.netlify.app/" aria-label="Dirección base pública" />
            <button type="button" className="btn" onClick={() => apply(draft)}>
              Usar
            </button>
            {override && (
              <button type="button" className="btn btn--ghost" onClick={() => { setDraft(''); apply(''); }}>
                Restablecer
              </button>
            )}
          </div>
        </div>
      </div>

      <ul className="qrc__grid">
        {QR_LINKS.map((l) => {
          const url = urlOf(l);
          const needsPublic = !l.external && !reachable;
          return (
            <li key={l.id} className="qrc__card glass">
              <div className={`qrc__code ${needsPublic ? 'is-warn' : ''}`}>
                <QRCode value={url} size={170} />
              </div>
              <strong>{l.title}</strong>
              <span className="qrc__desc">{l.description}</span>
              <span className={`chip ${l.external ? 'chip--live' : needsPublic ? 'chip--warn' : 'chip--live'}`}>
                {l.external ? 'Enlace externo oficial' : needsPublic ? 'Requiere URL pública' : 'Ruta de la app'}
              </span>
              <div className="qrc__btns">
                <button type="button" className="btn btn--primary" onClick={() => setBig(l)}>
                  <Maximize2 /> Ampliar
                </button>
                <button type="button" className="btn btn--icon" onClick={() => download(l)} aria-label={`Descargar QR de ${l.title}`} title="Descargar PNG">
                  <Download />
                </button>
                <CopyButton text={url} label="Enlace" />
              </div>
            </li>
          );
        })}
      </ul>

      {big && (
        <Modal onClose={() => setBig(null)} label={`QR ${big.title}`}>
          <div className="qrbig">
            <h2>{big.title}</h2>
            <div className="qrbig__code">
              <QRCode value={urlOf(big)} size={560} />
            </div>
            <code>{urlOf(big)}</code>
            <p>Abre la cámara de tu celular y apunta al código.</p>
          </div>
        </Modal>
      )}
    </section>
  );
}
