"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MousePointerClick, PenLine } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import {
  EXPORT_SCALE,
  INK_COLORS,
  RENDER_SCALE,
  drawPlaceholder,
  paintStroke,
  type Stroke,
} from "@/lib/signature-drawing";
import PadToolbar from "@/components/signature-pad/PadToolbar";
import PadTips from "@/components/signature-pad/PadTips";

export default function SignaturePad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentRef = useRef<Stroke | null>(null);
  const lastRef = useRef<[number, number] | null>(null);
  const drawingRef = useRef(false);
  const sizeRef = useRef({ w: 0, h: 0 });

  const [color, setColor] = useState(INK_COLORS[0]);
  const [width, setWidth] = useState(4);
  const [hasInk, setHasInk] = useState(false);
  const [saved, setSaved] = useState(false);

  const repaint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (strokesRef.current.length === 0 && !currentRef.current) {
      drawPlaceholder(ctx, sizeRef.current.w, sizeRef.current.h);
    }
    for (const stroke of strokesRef.current) paintStroke(ctx, stroke, RENDER_SCALE);
    if (currentRef.current) paintStroke(ctx, currentRef.current, RENDER_SCALE);
  }, []);

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
    repaint();
  }, [repaint]);

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
    repaint();
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
    repaint();
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
    // No se limpia nada: el trazo queda guardado en strokesRef y se
    // repinta desde la referencia, por lo que permanece visible hasta
    // que el usuario presione 'Limpiar' o 'Deshacer'.
    repaint();
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
    repaint();
  };

  const undo = () => {
    strokesRef.current.pop();
    setHasInk(strokesRef.current.length > 0);
    repaint();
  };

  const download = () => {
    const strokes = strokesRef.current;
    if (!strokes.length) return;

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
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

        <PadToolbar
          color={color}
          width={width}
          hasInk={hasInk}
          saved={saved}
          onColorChange={setColor}
          onWidthChange={setWidth}
          onUndo={undo}
          onClear={clearAll}
          onDownload={download}
        />
      </GlassCard>

      <PadTips />
    </div>
  );
}
