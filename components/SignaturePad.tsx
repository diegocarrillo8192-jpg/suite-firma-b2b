"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  Download,
  Eraser,
  MousePointerClick,
  Palette,
  PenLine,
  Trash2,
  Undo2,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

interface Stroke {
  color: string;
  width: number;
  points: Array<[number, number]>;
}

const INK_COLORS = ["#0f172a", "#1e293b", "#4f46e5", "#2563eb", "#b91c1c", "#ffffff"];
const RENDER_SCALE = 2;
const EXPORT_SCALE = 3;

export default function SignaturePad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLCanvasElement | null>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentRef = useRef<Stroke | null>(null);
  const lastRef = useRef<[number, number] | null>(null);
  const drawingRef = useRef(false);
  const sizeRef = useRef({ w: 0, h: 0 });

  const [color, setColor] = useState(INK_COLORS[0]);
  const [width, setWidth] = useState(4);
  const [hasInk, setHasInk] = useState(false);
  const [saved, setSaved] = useState(false);

  const paintStroke = useCallback(
    (ctx: CanvasRenderingContext2D, stroke: Stroke, scale: number) => {
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
          ctx.quadraticCurveTo(
            pts[i][0] * scale,
            pts[i][1] * scale,
            mx * scale,
            my * scale,
          );
        }
        const last = pts[pts.length - 1];
        ctx.lineTo(last[0] * scale, last[1] * scale);
      }
      ctx.stroke();
    },
    [],
  );

  const drawPlaceholder = useCallback((ctx: CanvasRenderingContext2D) => {
    const { w, h } = sizeRef.current;
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = "rgba(148,163,184,0.45)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(24 * RENDER_SCALE, (h - 60) * RENDER_SCALE);
    ctx.lineTo((w - 24) * RENDER_SCALE, (h - 60) * RENDER_SCALE);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(148,163,184,0.55)";
    ctx.font = `${13 * RENDER_SCALE}px var(--font-geist-sans), ui-sans-serif, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Firma aquí con el mouse o el dedo ✍", (w / 2) * RENDER_SCALE, (h / 2) * RENDER_SCALE);
  }, []);

  const repaintBase = useCallback(() => {
    const canvas = baseRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const stroke of strokesRef.current) paintStroke(ctx, stroke, RENDER_SCALE);
  }, [paintStroke]);

  const paintOverlay = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (strokesRef.current.length === 0 && !currentRef.current) {
      drawPlaceholder(ctx);
    }
    if (currentRef.current) paintStroke(ctx, currentRef.current, RENDER_SCALE);
  }, [drawPlaceholder, paintStroke]);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(320, Math.floor(rect.width));
    const h = Math.max(200, Math.floor(rect.height));

    sizeRef.current = { w, h };
    canvas.width = w * RENDER_SCALE;
    canvas.height = h * RENDER_SCALE;
    baseRef.current = document.createElement("canvas");
    baseRef.current.width = w * RENDER_SCALE;
    baseRef.current.height = h * RENDER_SCALE;
    repaintBase();
    paintOverlay();
  }, [paintOverlay, repaintBase]);

  useEffect(() => {
    resize();
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => resize());
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [resize]);

  const getPos = (e: PointerEvent): [number, number] => {
    const rect = (canvasRef.current as HTMLCanvasElement).getBoundingClientRect();
    return [
      Math.min(Math.max(e.clientX - rect.left, 0), rect.width),
      Math.min(Math.max(e.clientY - rect.top, 0), rect.height),
    ];
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    const pos = getPos(e.nativeEvent);
    currentRef.current = { color, width, points: [pos] };
    lastRef.current = pos;
    paintOverlay();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || !currentRef.current) return;
    e.preventDefault();
    const native = e.nativeEvent;
    const coalesced = native.getCoalescedEvents?.() ?? [];
    const events = coalesced.length > 0 ? coalesced : [native];
    const last = lastRef.current;

    for (const ev of events) {
      const pos = getPos(ev);
      if (last && Math.abs(pos[0] - last[0]) + Math.abs(pos[1] - last[1]) < 1.2) continue;
      currentRef.current.points.push(pos);
      lastRef.current = pos;
    }
    paintOverlay();
  };

  const endStroke = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    if (currentRef.current && currentRef.current.points.length) {
      strokesRef.current.push(currentRef.current);
      setHasInk(true);
    }
    currentRef.current = null;
    lastRef.current = null;
    repaintBase();
    paintOverlay();
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    endStroke();
  };

  const onPointerLeave = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!drawingRef.current) return;
    // Con pointer capture activa seguimos recibiendo eventos aunque el puntero
    // salga del lienzo (trazo continuo, sin saltos). Si la captura falló,
    // cerramos el trazo para no dejarlo colgado.
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) endStroke();
  };

  const clearAll = () => {
    strokesRef.current = [];
    currentRef.current = null;
    lastRef.current = null;
    setHasInk(false);
    repaintBase();
    paintOverlay();
  };

  const undo = () => {
    strokesRef.current.pop();
    setHasInk(strokesRef.current.length > 0);
    repaintBase();
    paintOverlay();
  };

  const download = () => {
    const strokes = strokesRef.current;
    if (!strokes.length) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const s of strokes) {
      for (const [x, y] of s.points) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
    const pad = 20;
    const bw = maxX - minX + pad * 2;
    const bh = maxY - minY + pad * 2;

    const out = document.createElement("canvas");
    out.width = Math.ceil(bw * EXPORT_SCALE);
    out.height = Math.ceil(bh * EXPORT_SCALE);
    const ctx = out.getContext("2d");
    if (!ctx) return;
    ctx.translate(-(minX - pad) * EXPORT_SCALE, -(minY - pad) * EXPORT_SCALE);

    for (const s of strokes) paintStroke(ctx, s, EXPORT_SCALE);

    const a = document.createElement("a");
    a.href = out.toDataURL("image/png");
    const stamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 19);
    a.download = `firma-digital-${stamp}.png`;
    a.click();

    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <GlassCard className="overflow-hidden">
        <div className="flex items-center gap-2 border-b border-white/10 bg-slate-950/60 px-4 py-3 sm:px-5">
          <PenLine size={15} className="text-indigo-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Lienzo de firma
          </span>
          <span className="ml-auto hidden items-center gap-1.5 text-xs text-slate-500 sm:flex">
            <MousePointerClick size={13} /> Mouse · táctil · lápiz
          </span>
        </div>

        <div ref={wrapRef} className="bg-checker p-3 sm:p-6">
          <canvas
            ref={canvasRef}
            className="block h-[240px] w-full cursor-crosshair touch-none select-none rounded-xl bg-slate-950/70 ring-1 ring-white/10 sm:h-[280px]"
            style={{ touchAction: "none" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onPointerLeave={onPointerLeave}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 bg-slate-950/60 px-4 py-4 sm:gap-4 sm:px-5">
          <div className="flex items-center gap-2">
            <Palette size={14} className="hidden text-slate-400 sm:block" />
            <div className="flex items-center gap-1.5">
              {INK_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Color ${c}`}
                  onClick={() => setColor(c)}
                  className={`h-6 w-6 rounded-full border transition-transform hover:scale-110 ${
                    color === c ? "border-white ring-2 ring-indigo-400" : "border-white/20"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <label className="relative h-6 w-6 cursor-pointer overflow-hidden rounded-full border border-dashed border-white/30">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="absolute -inset-2 h-10 w-10"
                  aria-label="Color personalizado"
                />
              </label>
            </div>
          </div>

          <div className="flex min-w-[140px] flex-1 items-center gap-2 sm:min-w-[180px] sm:flex-none">
            <PenLine size={14} className="shrink-0 text-slate-400" />
            <input
              type="range"
              min={1}
              max={14}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full"
              aria-label="Grosor de línea"
            />
            <span
              className="shrink-0 rounded-full"
              style={{
                width: width,
                height: width,
                minWidth: 2,
                minHeight: 2,
                backgroundColor: color,
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={undo}
              disabled={!hasInk}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Undo2 size={14} /> Deshacer
            </button>
            <button
              type="button"
              onClick={clearAll}
              disabled={!hasInk}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 size={14} /> Limpiar
            </button>
            <button
              type="button"
              onClick={download}
              disabled={!hasInk}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saved ? <Check size={16} strokeWidth={2.5} /> : <Download size={16} />}
              <span className="sm:hidden">PNG HD</span>
              <span className="hidden sm:inline">Descargar PNG Transparente HD</span>
            </button>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="flex items-start gap-3 p-5">
        <Eraser size={18} className="mt-0.5 shrink-0 text-indigo-400" />
        <div className="text-sm leading-relaxed text-slate-400">
          <span className="font-semibold text-slate-200">Consejos:</span> la firma se exporta{" "}
          <span className="text-slate-200">recortada y sin fondo</span> (transparencia real) a 3× de
          resolución, ideal para insertar en documentos, PDFs o tu firma de correo. El lienzo usa
          trazado suavizado y eventos coalescidos para que el trazo con el dedo sea fluido y
          preciso en cualquier pantalla. Usa <span className="text-slate-200">blanco</span> para
          firmar sobre fondos oscuros.
        </div>
      </GlassCard>
    </div>
  );
}
