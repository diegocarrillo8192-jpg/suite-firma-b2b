/** Punto del trazo: x, y (px CSS) y factor de grosor (presión / velocidad). */
export type StrokePoint = [number, number, number];

export interface Stroke {
  color: string;
  width: number;
  points: StrokePoint[];
}

export const INK_COLORS = [
  { hex: "#0b1b3f", name: "Azul tinta" },
  { hex: "#111827", name: "Negro" },
  { hex: "#1d4ed8", name: "Azul bolígrafo" },
  { hex: "#0e7490", name: "Petróleo" },
  { hex: "#991b1b", name: "Vino" },
  { hex: "#ffffff", name: "Blanco" },
];

export const RENDER_SCALE = 2;
export const EXPORT_SCALE = 3;

/**
 * Factor de grosor para el siguiente punto.
 * - Lápiz (stylus): usa la presión real del dispositivo.
 * - Mouse / dedo: simula pluma; trazos rápidos más finos, lentos más gruesos.
 */
export function nextWidthFactor(
  prev: number,
  pointerType: string,
  pressure: number,
  velocity: number,
  natural: boolean,
): number {
  if (!natural) return 1;
  let target: number;
  if (pointerType === "pen" && pressure > 0) {
    target = 0.3 + pressure * 1.25;
  } else {
    target = Math.min(1.35, Math.max(0.5, 1.4 - velocity * 0.42));
  }
  return prev * 0.72 + target * 0.28;
}

export function paintStroke(ctx: CanvasRenderingContext2D, stroke: Stroke, scale: number): void {
  const pts = stroke.points;
  if (!pts.length) return;
  ctx.strokeStyle = stroke.color;
  ctx.fillStyle = stroke.color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (pts.length === 1) {
    const [x, y, f] = pts[0];
    ctx.beginPath();
    ctx.arc(x * scale, y * scale, Math.max(0.6, (stroke.width * f * scale) / 2), 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  if (pts.length === 2) {
    ctx.lineWidth = stroke.width * ((pts[0][2] + pts[1][2]) / 2) * scale;
    ctx.beginPath();
    ctx.moveTo(pts[0][0] * scale, pts[0][1] * scale);
    ctx.lineTo(pts[1][0] * scale, pts[1][1] * scale);
    ctx.stroke();
    return;
  }

  // Segmentos cuadráticos entre puntos medios: curva suave y grosor variable.
  let sx = pts[0][0];
  let sy = pts[0][1];
  for (let i = 1; i < pts.length - 1; i++) {
    const [cx, cy, f] = pts[i];
    const mx = (cx + pts[i + 1][0]) / 2;
    const my = (cy + pts[i + 1][1]) / 2;
    ctx.lineWidth = Math.max(0.5, stroke.width * f * scale);
    ctx.beginPath();
    ctx.moveTo(sx * scale, sy * scale);
    ctx.quadraticCurveTo(cx * scale, cy * scale, mx * scale, my * scale);
    ctx.stroke();
    sx = mx;
    sy = my;
  }
  const last = pts[pts.length - 1];
  ctx.lineWidth = Math.max(0.5, stroke.width * last[2] * scale);
  ctx.beginPath();
  ctx.moveTo(sx * scale, sy * scale);
  ctx.lineTo(last[0] * scale, last[1] * scale);
  ctx.stroke();
}

/** Línea base y marca "×" de un formulario de firma. */
export function drawGuide(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dark: boolean,
  showHint: boolean,
): void {
  const s = RENDER_SCALE;
  const baseY = height - 56;
  const tone = dark ? "rgba(148,163,184,0.45)" : "rgba(100,116,139,0.45)";
  ctx.save();
  ctx.strokeStyle = tone;
  ctx.lineWidth = 1.2 * s;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(48 * s, baseY * s);
  ctx.lineTo((width - 32) * s, baseY * s);
  ctx.stroke();

  ctx.lineWidth = 1.6 * s;
  ctx.beginPath();
  ctx.moveTo(26 * s, (baseY - 14) * s);
  ctx.lineTo(38 * s, (baseY - 2) * s);
  ctx.moveTo(38 * s, (baseY - 14) * s);
  ctx.lineTo(26 * s, (baseY - 2) * s);
  ctx.stroke();

  if (showHint) {
    ctx.fillStyle = dark ? "rgba(148,163,184,0.6)" : "rgba(100,116,139,0.7)";
    ctx.font = `500 ${13 * s}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(
      "Firma sobre la línea con el mouse, el dedo o tu lápiz digital",
      (width / 2) * s,
      (height / 2 - 6) * s,
    );
  }
  ctx.restore();
}

/** Caja contenedora de todos los trazos (incluye el grosor). */
export function strokesBounds(strokes: Stroke[]) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const s of strokes) {
    const r = s.width * 1.6;
    for (const [x, y] of s.points) {
      minX = Math.min(minX, x - r);
      minY = Math.min(minY, y - r);
      maxX = Math.max(maxX, x + r);
      maxY = Math.max(maxY, y + r);
    }
  }
  return { minX, minY, maxX, maxY };
}

/** Renderiza los trazos recortados, sin fondo, a alta resolución. */
export function exportStrokes(strokes: Stroke[], scale = EXPORT_SCALE, pad = 16): string | null {
  if (!strokes.length) return null;
  const { minX, minY, maxX, maxY } = strokesBounds(strokes);
  const out = document.createElement("canvas");
  out.width = Math.ceil((maxX - minX + pad * 2) * scale);
  out.height = Math.ceil((maxY - minY + pad * 2) * scale);
  const ctx = out.getContext("2d");
  if (!ctx) return null;
  ctx.translate(-(minX - pad) * scale, -(minY - pad) * scale);
  for (const s of strokes) paintStroke(ctx, s, scale);
  return out.toDataURL("image/png");
}

/** Exporta los trazos como SVG vectorial (escalable sin pérdida). */
export function exportStrokesSVG(strokes: Stroke[], pad = 16): string | null {
  if (!strokes.length) return null;
  const { minX, minY, maxX, maxY } = strokesBounds(strokes);
  const w = Math.ceil(maxX - minX + pad * 2);
  const h = Math.ceil(maxY - minY + pad * 2);
  const ox = minX - pad;
  const oy = minY - pad;
  const r = (n: number) => Math.round(n * 100) / 100;

  const paths: string[] = [];
  for (const s of strokes) {
    const p = s.points;
    if (p.length === 1) {
      paths.push(
        `<circle cx="${r(p[0][0] - ox)}" cy="${r(p[0][1] - oy)}" r="${r((s.width * p[0][2]) / 2)}" fill="${s.color}"/>`,
      );
      continue;
    }
    let sx = p[0][0] - ox;
    let sy = p[0][1] - oy;
    for (let i = 1; i < p.length - 1; i++) {
      const cx = p[i][0] - ox;
      const cy = p[i][1] - oy;
      const mx = (p[i][0] + p[i + 1][0]) / 2 - ox;
      const my = (p[i][1] + p[i + 1][1]) / 2 - oy;
      paths.push(
        `<path d="M${r(sx)} ${r(sy)}Q${r(cx)} ${r(cy)} ${r(mx)} ${r(my)}" stroke-width="${r(s.width * p[i][2])}" stroke="${s.color}"/>`,
      );
      sx = mx;
      sy = my;
    }
    const last = p[p.length - 1];
    paths.push(
      `<path d="M${r(sx)} ${r(sy)}L${r(last[0] - ox)} ${r(last[1] - oy)}" stroke-width="${r(s.width * last[2])}" stroke="${s.color}"/>`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" stroke-linecap="round" stroke-linejoin="round">${paths.join("")}</svg>`;
}
