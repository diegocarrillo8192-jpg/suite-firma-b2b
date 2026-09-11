export interface Stroke {
  color: string;
  width: number;
  points: Array<[number, number]>;
}

export const INK_COLORS = ["#0f172a", "#1e293b", "#4f46e5", "#2563eb", "#b91c1c", "#ffffff"];

export const RENDER_SCALE = 2;
export const EXPORT_SCALE = 3;

export function paintStroke(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
  scale: number,
): void {
  const pts = stroke.points;
  if (!pts.length) return;
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.width * scale;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(pts[0][0] * scale, pts[0][1] * scale);
  if (pts.length === 1) {
    ctx.lineTo(pts[0][0] * scale + 0.01, pts[0][1] * scale);
  } else {
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i][0] + pts[i + 1][0]) / 2;
      const my = (pts[i][1] + pts[i + 1][1]) / 2;
      ctx.quadraticCurveTo(pts[i][0] * scale, pts[i][1] * scale, mx * scale, my * scale);
    }
    const last = pts[pts.length - 1];
    ctx.lineTo(last[0] * scale, last[1] * scale);
  }
  ctx.stroke();
}

export function drawPlaceholder(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = "rgba(148,163,184,0.45)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(24 * RENDER_SCALE, (height - 60) * RENDER_SCALE);
  ctx.lineTo((width - 24) * RENDER_SCALE, (height - 60) * RENDER_SCALE);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(148,163,184,0.55)";
  ctx.font = `${13 * RENDER_SCALE}px var(--font-geist-sans), ui-sans-serif, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(
    "Firma aquí con el mouse o el dedo ✍",
    (width / 2) * RENDER_SCALE,
    (height / 2) * RENDER_SCALE,
  );
}
