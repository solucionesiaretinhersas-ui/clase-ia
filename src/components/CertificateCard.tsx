import { useEffect, useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { canvasBlob, certificatePdf, downloadBlob, fileSlug, renderCertificate, type CertificateData } from '../lib/certificate';
import { useToast } from './Toast';

/** Vista previa del certificado y descarga como imagen (PNG) o PDF. */
export function CertificateCard({ data }: { data: CertificateData }) {
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState<'png' | 'pdf' | null>(null);
  const toast = useToast();
  const key = JSON.stringify(data);

  useEffect(() => {
    let cancelled = false;
    renderCertificate(data, 1200)
      .then((c) => !cancelled && setPreview(c.toDataURL('image/jpeg', 0.88)))
      .catch(() => !cancelled && setPreview(''));
    return () => {
      cancelled = true;
    };
    // data se resume en `key`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  async function download(kind: 'png' | 'pdf') {
    setBusy(kind);
    try {
      const canvas = await renderCertificate(data);
      const base = `certificado-${fileSlug(data.name)}`;
      if (kind === 'png') downloadBlob(await canvasBlob(canvas, 'image/png'), `${base}.png`);
      else downloadBlob(await certificatePdf(canvas), `${base}.pdf`);
      toast('Certificado descargado');
    } catch {
      toast('No se pudo generar el certificado. Intenta de nuevo.', 'error');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="certcard">
      {preview ? <img src={preview} alt={`Certificado de ${data.name}`} className="certcard__img" /> : <div className="empty">No se pudo mostrar la vista previa.</div>}
      <div className="certcard__btns">
        <button type="button" className="btn btn--primary btn--lg" onClick={() => download('png')} disabled={busy !== null}>
          <Download /> {busy === 'png' ? 'Generando…' : 'Descargar imagen'}
        </button>
        <button type="button" className="btn btn--lg" onClick={() => download('pdf')} disabled={busy !== null}>
          <FileText /> {busy === 'pdf' ? 'Generando…' : 'Descargar PDF'}
        </button>
      </div>
      <p className="note-muted">En el celular, la imagen queda en tus descargas. También puedes mantener presionada la vista previa para guardarla en tu galería.</p>
    </div>
  );
}
