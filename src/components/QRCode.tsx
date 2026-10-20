import { useEffect, useRef, useState } from 'react';
import QR from 'qrcode';

/**
 * QR real generado en el navegador con la biblioteca `qrcode`.
 * Se dibuja en blanco y negro (máximo contraste) para que los celulares lo
 * lean bien también desde un proyector.
 */
export function QRCode({ value, size = 220, className = '' }: { value: string; size?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    setError(false);
    QR.toCanvas(ref.current, value, {
      width: size,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#0a0a14', light: '#ffffff' },
    }).catch(() => setError(true));
  }, [value, size]);

  if (error) return <div className={`qr qr--error ${className}`}>No se pudo generar el QR</div>;
  return <canvas ref={ref} className={`qr ${className}`} role="img" aria-label={`Código QR para ${value}`} />;
}

/** Descarga el QR como PNG con el título y la URL debajo. */
export async function downloadQR(value: string, title: string, filename: string) {
  const qr = await QR.toDataURL(value, { width: 1024, margin: 2, errorCorrectionLevel: 'M' });
  const img = new Image();
  img.src = qr;
  await img.decode();
  const pad = 64;
  const canvas = document.createElement('canvas');
  canvas.width = 1024 + pad * 2;
  canvas.height = 1024 + pad * 2 + 170;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, pad, pad);
  ctx.fillStyle = '#0a0a14';
  ctx.textAlign = 'center';
  ctx.font = '600 52px "Inter Variable", "Segoe UI", sans-serif';
  ctx.fillText(title, canvas.width / 2, 1024 + pad + 70);
  ctx.fillStyle = '#4a4a63';
  ctx.font = '400 28px "Inter Variable", "Segoe UI", sans-serif';
  const shown = value.length > 70 ? value.slice(0, 67) + '…' : value;
  ctx.fillText(shown, canvas.width / 2, 1024 + pad + 125);
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
