/**
 * Certificado de participación: se dibuja en un canvas (sin servidor) y se puede
 * descargar como imagen PNG o como PDF de una página (A4 horizontal).
 */
export interface CertificateData {
  name: string;
  /** Grado (estudiantes) o área/grado (docentes) */
  grade?: string;
  audience: 'docente' | 'estudiante';
  title: string;
  text: string;
  minutes: number;
  facilitator?: string;
  date?: Date;
}

const NAVY = '#14213d';
const GOLD = '#b8892b';
const GOLD_LIGHT = '#e6c46a';
const SERIF = '"Palatino Linotype", "Book Antiqua", Palatino, Georgia, "Times New Roman", serif';

function spaced(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number) {
  // Texto centrado con espaciado entre letras
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width + spacing);
  const total = widths.reduce((a, b) => a + b, 0) - spacing;
  let cx = x - total / 2;
  const align = ctx.textAlign;
  ctx.textAlign = 'left';
  chars.forEach((c, i) => {
    ctx.fillText(c, cx, y);
    cx += widths[i];
  });
  ctx.textAlign = align;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function star(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, points = 8) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? r : r * 0.55;
    const a = (Math.PI / points) * i - Math.PI / 2;
    ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  ctx.closePath();
}

function corner(ctx: CanvasRenderingContext2D, x: number, y: number, sx: number, sy: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sx, sy);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 4;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(0, 0, 70 + i * 26, 0, Math.PI / 2);
    ctx.stroke();
  }
  ctx.fillStyle = GOLD;
  star(ctx, 34, 34, 20, 4);
  ctx.fill();
  ctx.restore();
}

export function renderCertificate(d: CertificateData, width = 2000): HTMLCanvasElement {
  const W = width;
  const H = Math.round(width / 1.4142);
  const k = W / 2000;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas');
  ctx.scale(k, k);
  const w = 2000;
  const h = H / k;

  // Fondo
  const bg = ctx.createRadialGradient(w / 2, h / 2, 100, w / 2, h / 2, w * 0.7);
  bg.addColorStop(0, '#fffefb');
  bg.addColorStop(1, '#f6efdc');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Marcos
  ctx.strokeStyle = NAVY;
  ctx.lineWidth = 14;
  ctx.strokeRect(46, 46, w - 92, h - 92);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 4;
  ctx.strokeRect(74, 74, w - 148, h - 148);
  ctx.lineWidth = 2;
  ctx.strokeRect(90, 90, w - 180, h - 180);
  corner(ctx, 90, 90, 1, 1);
  corner(ctx, w - 90, 90, -1, 1);
  corner(ctx, 90, h - 90, 1, -1);
  corner(ctx, w - 90, h - 90, -1, -1);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // Encabezado
  ctx.fillStyle = GOLD;
  ctx.font = `600 34px ${SERIF}`;
  spaced(ctx, 'INSTITUCIÓN EDUCATIVA', w / 2, 210, 10);
  ctx.fillStyle = NAVY;
  ctx.font = `700 92px ${SERIF}`;
  ctx.fillText('SANTA ROSA DE LIMA', w / 2, 305);

  // Cinta de título
  ctx.fillStyle = GOLD;
  ctx.fillRect(w / 2 - 330, 345, 660, 3);
  ctx.font = `600 50px ${SERIF}`;
  spaced(ctx, 'CERTIFICADO DE PARTICIPACIÓN', w / 2, 425, 8);
  ctx.fillRect(w / 2 - 330, 452, 660, 3);

  ctx.fillStyle = '#5b6275';
  ctx.font = `italic 38px ${SERIF}`;
  ctx.fillText('Se otorga con aprecio a', w / 2, 535);

  // Nombre (se reduce si es largo)
  const name = d.name.trim();
  let size = 120;
  ctx.fillStyle = NAVY;
  ctx.font = `italic 700 ${size}px ${SERIF}`;
  while (ctx.measureText(name).width > w - 460 && size > 56) {
    size -= 4;
    ctx.font = `italic 700 ${size}px ${SERIF}`;
  }
  ctx.fillText(name, w / 2, 665);
  const nw = Math.min(ctx.measureText(name).width + 120, w - 360);
  const lg = ctx.createLinearGradient(w / 2 - nw / 2, 0, w / 2 + nw / 2, 0);
  lg.addColorStop(0, 'rgba(184,137,43,0)');
  lg.addColorStop(0.5, GOLD);
  lg.addColorStop(1, 'rgba(184,137,43,0)');
  ctx.fillStyle = lg;
  ctx.fillRect(w / 2 - nw / 2, 695, nw, 4);

  // Rol
  ctx.fillStyle = '#5b6275';
  ctx.font = `500 36px ${SERIF}`;
  const role = d.audience === 'estudiante' ? 'Estudiante' : 'Docente';
  ctx.fillText(d.grade ? `${role} · ${d.grade}` : role, w / 2, 758);

  // Cuerpo
  const date = (d.date ?? new Date()).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  ctx.fillStyle = '#2b3347';
  ctx.font = `400 42px ${SERIF}`;
  const lines = wrap(ctx, `${d.text}, realizado el ${date}, con una intensidad de ${d.minutes} minutos.`, w - 520);
  lines.forEach((l, i) => ctx.fillText(l, w / 2, 832 + i * 56));

  // Nombre del taller
  const ty = 832 + lines.length * 56 + 40;
  ctx.fillStyle = NAVY;
  ctx.font = `italic 700 54px ${SERIF}`;
  ctx.fillText(`«${d.title}»`, w / 2, ty);

  // Sello
  const sy = h - 262;
  ctx.save();
  ctx.translate(w / 2, sy);
  ctx.scale(0.8, 0.8);
  ctx.fillStyle = '#9c1c2b';
  ctx.beginPath();
  ctx.moveTo(-50, 40);
  ctx.lineTo(-95, 150);
  ctx.lineTo(-52, 128);
  ctx.lineTo(-22, 160);
  ctx.lineTo(0, 60);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(50, 40);
  ctx.lineTo(95, 150);
  ctx.lineTo(52, 128);
  ctx.lineTo(22, 160);
  ctx.lineTo(0, 60);
  ctx.closePath();
  ctx.fill();
  const sg = ctx.createRadialGradient(-20, -20, 8, 0, 0, 90);
  sg.addColorStop(0, GOLD_LIGHT);
  sg.addColorStop(1, GOLD);
  ctx.fillStyle = sg;
  star(ctx, 0, 0, 98, 16);
  ctx.fill();
  ctx.fillStyle = '#fff8e0';
  ctx.beginPath();
  ctx.arc(0, 0, 62, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = NAVY;
  star(ctx, 0, -2, 34, 5);
  ctx.fill();
  ctx.restore();

  // Firmas
  const lineY = h - 185;
  ctx.strokeStyle = NAVY;
  ctx.lineWidth = 2.5;
  [w * 0.24, w * 0.76].forEach((cx) => {
    ctx.beginPath();
    ctx.moveTo(cx - 260, lineY);
    ctx.lineTo(cx + 260, lineY);
    ctx.stroke();
  });
  ctx.fillStyle = NAVY;
  ctx.font = `700 36px ${SERIF}`;
  ctx.fillText(d.facilitator?.trim() || 'Facilitador(a) del taller', w * 0.24, lineY + 46);
  ctx.fillText('Rectoría', w * 0.76, lineY + 46);
  ctx.fillStyle = '#5b6275';
  ctx.font = `italic 30px ${SERIF}`;
  ctx.fillText('Facilitador(a)', w * 0.24, lineY + 84);
  ctx.fillText('I.E. Santa Rosa de Lima', w * 0.76, lineY + 84);

  ctx.fillStyle = GOLD;
  ctx.font = `600 24px ${SERIF}`;
  spaced(ctx, 'AULA IA · TALLER CON GOOGLE AI STUDIO', w / 2, 142, 6);

  return canvas;
}

export function canvasBlob(canvas: HTMLCanvasElement, type: 'image/png' | 'image/jpeg', quality = 0.92): Promise<Blob> {
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('blob'))), type, quality));
}

/** PDF de una página A4 horizontal con el certificado como imagen JPEG. */
export async function certificatePdf(canvas: HTMLCanvasElement): Promise<Blob> {
  const jpg = new Uint8Array(await (await canvasBlob(canvas, 'image/jpeg', 0.93)).arrayBuffer());
  const enc = new TextEncoder();
  const parts: Uint8Array[] = [];
  const offsets: number[] = [];
  let pos = 0;
  const push = (b: Uint8Array | string) => {
    const bytes = typeof b === 'string' ? enc.encode(b) : b;
    parts.push(bytes);
    pos += bytes.length;
  };
  const obj = (n: number) => {
    offsets[n] = pos;
  };
  const content = 'q 842 0 0 595 0 0 cm /Im0 Do Q';
  push('%PDF-1.4\n');
  obj(1);
  push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  obj(2);
  push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
  obj(3);
  push('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n');
  obj(4);
  push(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`);
  push(jpg);
  push('\nendstream\nendobj\n');
  obj(5);
  push(`5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`);
  const xref = pos;
  push('xref\n0 6\n0000000000 65535 f \n');
  for (let i = 1; i <= 5; i++) push(`${String(offsets[i]).padStart(10, '0')} 00000 n \n`);
  push(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  return new Blob(parts as BlobPart[], { type: 'application/pdf' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function fileSlug(name: string): string {
  return (
    name
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase() || 'participante'
  );
}

/** CSV con BOM y separador `;` para que Excel en español lo abra con tildes y columnas correctas. */
export function attendanceCsv(
  rows: { name: string; grade?: string; at: number }[],
  meta: { workshop: string; audience: string; date: Date },
): Blob {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const gradeHead = meta.audience === 'estudiante' ? 'Grado' : 'Área / grado';
  const lines = [
    ['N.°', 'Nombre', gradeHead, 'Hora de ingreso', 'Fecha', 'Taller'].map(esc).join(';'),
    ...rows.map((r, i) =>
      [
        String(i + 1),
        r.name,
        r.grade ?? '',
        new Date(r.at).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
        meta.date.toLocaleDateString('es-CO'),
        meta.workshop,
      ]
        .map(esc)
        .join(';'),
    ),
  ];
  return new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
}
