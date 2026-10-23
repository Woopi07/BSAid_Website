// Draws a certificate of achievement on a canvas. The same drawing is shown on screen and saved as a PNG,
// so what players see is exactly what lands in their gallery.
import { certificateId, DEFAULT_NAME } from './data/certificates.js';

export const CERT_W = 1500;
export const CERT_H = 1060;

const NAVY = '#0E2244';
const GOLD = '#EDA90D';
const GOLD_DARK = '#C98A08';
const FOREST = '#21733F';
const INK = '#334155';
const SANS = '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial, sans-serif';
const BODY = 'Montserrat, "Helvetica Neue", Arial, sans-serif';
const SERIF = 'Georgia, "Times New Roman", "DejaVu Serif", serif';

function star(ctx, x, y, r, fill) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

// Shrinks the font until the text fits the width.
function fit(ctx, text, maxW, size, font) {
  let s = size;
  do {
    ctx.font = font(s);
    s -= 2;
  } while (ctx.measureText(text).width > maxW && s > 18);
}

export function drawCertificate(canvas, { name, caseObj, date, rating }) {
  canvas.width = CERT_W;
  canvas.height = CERT_H;
  const ctx = canvas.getContext('2d');
  const W = CERT_W;
  const H = CERT_H;
  const cx = W / 2;

  // Paper
  const paper = ctx.createRadialGradient(cx, H * 0.45, 100, cx, H * 0.5, W * 0.7);
  paper.addColorStop(0, '#FFFDF6');
  paper.addColorStop(1, '#F3E7CF');
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, W, H);

  // Frame: gold band, navy rule, thin gold rule
  ctx.lineWidth = 34;
  ctx.strokeStyle = GOLD;
  ctx.strokeRect(17, 17, W - 34, H - 34);
  ctx.lineWidth = 6;
  ctx.strokeStyle = GOLD_DARK;
  ctx.strokeRect(36, 36, W - 72, H - 72);
  ctx.lineWidth = 4;
  ctx.strokeStyle = NAVY;
  ctx.strokeRect(58, 58, W - 116, H - 116);
  ctx.lineWidth = 2;
  ctx.strokeStyle = GOLD_DARK;
  ctx.strokeRect(70, 70, W - 140, H - 140);
  // Corner diamonds
  [[70, 70], [W - 70, 70], [70, H - 70], [W - 70, H - 70]].forEach(([x, y]) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = NAVY;
    ctx.fillRect(-16, -16, 32, 32);
    ctx.fillStyle = GOLD;
    ctx.fillRect(-9, -9, 18, 18);
    ctx.restore();
  });

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // Header
  ctx.fillStyle = FOREST;
  ctx.font = `700 22px ${SANS}`;
  ctx.fillText('ENTRY POINT  ·  BSAid', cx, 150);
  ctx.fillStyle = NAVY;
  ctx.font = `800 96px ${SANS}`;
  ctx.fillText('CERTIFICATE', cx, 255);
  ctx.font = `700 30px ${SANS}`;
  ctx.fillText('OF ACHIEVEMENT', cx, 305);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 4;
  [[cx - 330, cx - 175], [cx + 175, cx + 330]].forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(a, 295);
    ctx.lineTo(b, 295);
    ctx.stroke();
  });

  // Recipient
  ctx.fillStyle = INK;
  ctx.font = `500 30px ${BODY}`;
  ctx.fillText('This certificate is proudly presented to', cx, 385);
  const display = (name || '').trim() || DEFAULT_NAME;
  ctx.fillStyle = FOREST;
  fit(ctx, display, W - 360, 92, (s) => `italic 700 ${s}px ${SERIF}`);
  ctx.fillText(display, cx, 500);
  ctx.strokeStyle = GOLD_DARK;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 420, 530);
  ctx.lineTo(cx + 420, 530);
  ctx.stroke();

  // What for
  ctx.fillStyle = INK;
  ctx.font = `500 30px ${BODY}`;
  ctx.fillText('for successfully closing the books of', cx, 595);
  ctx.fillStyle = NAVY;
  fit(ctx, caseObj.name, W - 400, 54, (s) => `800 ${s}px ${SANS}`);
  ctx.fillText(caseObj.name, cx, 660);
  ctx.fillStyle = INK;
  ctx.font = `500 26px ${BODY}`;
  ctx.fillText(`Case #${caseObj.id}  ·  ${caseObj.game.name}  ·  all four levels cleared`, cx, 708);

  // Rating stars
  for (let i = 0; i < 3; i++) star(ctx, cx - 70 + i * 70, 770, 26, i < rating ? GOLD : '#E2D6BC');

  // Signature (left)
  const sx = 330;
  ctx.fillStyle = NAVY;
  fit(ctx, caseObj.owner, 340, 52, (s) => `italic 400 ${s}px ${SERIF}`);
  ctx.fillText(caseObj.owner, sx, 885);
  ctx.strokeStyle = NAVY;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sx - 180, 905);
  ctx.lineTo(sx + 180, 905);
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.font = `600 22px ${BODY}`;
  ctx.fillText(caseObj.owner === 'Dispatch Manager' ? caseObj.name : `Owner, ${caseObj.name}`, sx, 940);

  // Date (right)
  const dx = W - 330;
  const when = new Date(date).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
  ctx.fillStyle = NAVY;
  ctx.font = `700 34px ${SANS}`;
  ctx.fillText(when, dx, 885);
  ctx.beginPath();
  ctx.moveTo(dx - 180, 905);
  ctx.lineTo(dx + 180, 905);
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.font = `600 22px ${BODY}`;
  ctx.fillText('Date completed', dx, 940);

  // Gold seal (centre bottom)
  const sy = 880;
  ctx.fillStyle = FOREST;
  ctx.beginPath();
  ctx.moveTo(cx - 52, sy + 30);
  ctx.lineTo(cx - 74, sy + 100);
  ctx.lineTo(cx - 50, sy + 86);
  ctx.lineTo(cx - 30, sy + 104);
  ctx.lineTo(cx - 12, sy + 40);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + 52, sy + 30);
  ctx.lineTo(cx + 74, sy + 100);
  ctx.lineTo(cx + 50, sy + 86);
  ctx.lineTo(cx + 30, sy + 104);
  ctx.lineTo(cx + 12, sy + 40);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  for (let i = 0; i < 48; i++) {
    const a = (i * Math.PI) / 24;
    const r = i % 2 ? 74 : 82;
    ctx.lineTo(cx + Math.cos(a) * r, sy + Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fillStyle = GOLD_DARK;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, sy, 64, 0, Math.PI * 2);
  ctx.fillStyle = GOLD;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#FFE38A';
  ctx.beginPath();
  ctx.arc(cx, sy, 54, 0, Math.PI * 2);
  ctx.stroke();
  star(ctx, cx, sy - 8, 28, '#FFF6D6');
  ctx.fillStyle = NAVY;
  ctx.font = `800 16px ${SANS}`;
  ctx.fillText('CASE CLOSED', cx, sy + 38);

  // Certificate number
  ctx.fillStyle = '#94A3B8';
  ctx.font = `600 16px ${BODY}`;
  ctx.textAlign = 'left';
  ctx.fillText(`Certificate No. ${certificateId(caseObj.id, date)}`, 96, H - 92);
}

export function certificateBlob(opts) {
  const canvas = document.createElement('canvas');
  drawCertificate(canvas, opts);
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}
