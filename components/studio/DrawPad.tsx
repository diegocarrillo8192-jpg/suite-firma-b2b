"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, Moon, PenLine, Redo2, Sun, Trash2, Undo2 } from "lucide-react";
import { Segmented, Toggle } from "@/components/ui/Controls";
import {
  INK_COLORS,
  RENDER_SCALE,
  drawGuide,
  exportStrokes,
  exportStrokesSVG,
  nextWidthFactor,
  paintStroke,
  type Stroke,
} from "@/lib/signature-drawing";
import ResultActions from "./ResultActions";

type Paper = "light" | "dark";
interface Last {
  x: number;
  y: number;
  t: number;
  f: number;
}

/**
 * Lienzo de firma: mouse, dedo y lápiz digital (con presión real).
 * Los trazos se guardan como vectores, así se exportan a PNG HD o SVG.
 */
export default function DrawPad({
  active,
  onUseInEmail,
}: {
  active: boolean;
  onUseInEmail: (dataUrl: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseRef = useRef<HTMLCanvasElement | null>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const redoRef = useRef<Stroke[]>([]);
  const currentRef = useRef<Stroke | null>(null);
  const lastRef = useRef<Last | null>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const frameRef = useRef<number | null>(null);
  const paperRef = useRef<Paper>("light");

  const [color, setColor] = useState(INK_COLORS[0].hex);
  const [width, setWidth] = useState(3.2);
  const [natural, setNatural] = useState(true);
  const [paper, setPaper] = useState<Paper>("light");
  const [expanded, setExpanded] = useState(false);
  const [counts, setCounts] = useState({ strokes: 0, redo: 0 });
  const [device, setDevice] = useState<string | null>(null);

  const syncCounts = () =>
    setCounts({ strokes: strokesRef.current.length, redo: redoRef.current.length });

  const render = useCallback(() => {
    frameRef.current = null;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { w, h } = sizeRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const empty = strokesRef.current.length === 0 && !currentRef.current;
    drawGuide(ctx, w, h, paperRef.current === "dark", empty);
    if (baseRef.current) ctx.drawImage(baseRef.current, 0, 0);
    if (currentRef.current) paintStroke(ctx, currentRef.current, RENDER_SCALE);
  }, []);

  const scheduleRender = useCallback(() => {
    if (frameRef.current === null) frameRef.current = requestAnimationFrame(render);
  }, [render]);

  /** Reconstruye la capa de trazos confirmados (tras deshacer, rehacer o redimensionar). */
  const rebuildBase = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const base = document.createElement("canvas");
    base.width = canvas.width;
    base.height = canvas.height;
    const ctx = base.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, base.width, base.height);
    for (const s of strokesRef.current) paintStroke(ctx, s, RENDER_SCALE);
    baseRef.current = base;
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) return; // panel oculto
    const w = Math.floor(rect.width);
    const h = Math.floor(rect.height);
    if (w === sizeRef.current.w && h === sizeRef.current.h) return;
    sizeRef.current = { w, h };
    canvas.width = w * RENDER_SCALE;
    canvas.height = h * RENDER_SCALE;
    rebuildBase();
    render();
  }, [rebuildBase, render]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
    return () => {
      ro.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [resize]);

  useEffect(() => {
    paperRef.current = paper;
    render();
  }, [paper, render]);

  const undo = useCallback(() => {
    const s = strokesRef.current.pop();
    if (!s) return;
    redoRef.current.push(s);
    rebuildBase();
    render();
    syncCounts();
  }, [rebuildBase, render]);

  const redo = useCallback(() => {
    const s = redoRef.current.pop();
    if (!s) return;
    strokesRef.current.push(s);
    rebuildBase();
    render();
    syncCounts();
  }, [rebuildBase, render]);

  const clearAll = () => {
    strokesRef.current = [];
    redoRef.current = [];
    currentRef.current = null;
    rebuildBase();
    render();
    syncCounts();
  };

  // Atajos: Ctrl/Cmd+Z deshacer, Ctrl/Cmd+Shift+Z o Ctrl+Y rehacer, Esc salir de pantalla completa.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      if (e.key === "Escape") setExpanded(false);
      if (!(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      if (k === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((k === "z" && e.shiftKey) || k === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, undo, redo]);

  // Pantalla completa: bloquea el scroll del fondo.
  useEffect(() => {
    if (!expanded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [expanded]);

  const posOf = (e: PointerEvent): [number, number] => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return [
      Math.min(Math.max(e.clientX - rect.left, 0), rect.width),
      Math.min(Math.max(e.clientY - rect.top, 0), rect.height),
    ];
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    if (e.pointerType !== device) setDevice(e.pointerType);
    const [x, y] = posOf(e.nativeEvent);
    const f = natural && e.pointerType === "pen" && e.pressure > 0 ? 0.3 + e.pressure * 1.25 : 1;
    currentRef.current = { color, width, points: [[x, y, f]] };
    lastRef.current = { x, y, t: e.timeStamp, f };
    scheduleRender();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const stroke = currentRef.current;
    const last = lastRef.current;
    if (!stroke || !last) return;
    e.preventDefault();
    const native = e.nativeEvent;
    const coalesced = native.getCoalescedEvents?.() ?? [];
    for (const ev of coalesced.length ? coalesced : [native]) {
      const [x, y] = posOf(ev);
      const dist = Math.hypot(x - last.x, y - last.y);
      if (dist < 1) continue;
      const dt = Math.max(1, ev.timeStamp - last.t);
      const f = nextWidthFactor(last.f, e.pointerType, ev.pressure, dist / dt, natural);
      stroke.points.push([x, y, f]);
      last.x = x;
      last.y = y;
      last.t = ev.timeStamp;
      last.f = f;
    }
    scheduleRender();
  };

  const endStroke = () => {
    const stroke = currentRef.current;
    if (!stroke) return;
    currentRef.current = null;
    lastRef.current = null;
    strokesRef.current.push(stroke);
    redoRef.current = [];
    const ctx = baseRef.current?.getContext("2d");
    if (ctx) paintStroke(ctx, stroke, RENDER_SCALE);
    render();
    syncCounts();
  };

  const hasInk = counts.strokes > 0;

  return (
    <div className="space-y-5">
      <div
        className={
          expanded
            ? "fixed inset-0 z-[70] flex flex-col gap-3 bg-[#04060c]/95 p-3 backdrop-blur-xl sm:p-6"
            : "panel overflow-hidden"
        }
      >
        <div
          className={`flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-5 ${
            expanded ? "panel rounded-2xl" : "border-b border-white/[0.06]"
          }`}
        >
          <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Color de tinta">
            {INK_COLORS.map((c) => (
              <button
                key={c.hex}
                type="button"
                role="radio"
                aria-checked={color === c.hex}
                aria-label={c.name}
                title={c.name}
                onClick={() => {
                  setColor(c.hex);
                  if (c.hex === "#ffffff") setPaper("dark");
                }}
                className={`h-7 w-7 rounded-full transition-transform hover:scale-110 ${
                  color === c.hex ? "ring-2 ring-gold-400 ring-offset-2 ring-offset-[#070a14]" : "ring-1 ring-white/20"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
            <label
              title="Color personalizado"
              className="relative h-7 w-7 cursor-pointer overflow-hidden rounded-full ring-1 ring-white/25"
              style={{ background: "conic-gradient(#ef4444, #f59e0b, #22c55e, #06b6d4, #3b82f6, #a855f7, #ef4444)" }}
            >
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="absolute inset-0 h-full w-full opacity-0"
                aria-label="Color de tinta personalizado"
              />
            </label>
          </div>

          <label className="flex min-w-[150px] flex-1 items-center gap-2.5 sm:max-w-[220px]">
            <PenLine size={14} className="shrink-0 text-slate-400" />
            <input
              type="range"
              min={1}
              max={10}
              step={0.2}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full"
              aria-label="Grosor del trazo"
            />
            <span
              aria-hidden
              className="shrink-0 rounded-full"
              style={{ width: width + 2, height: width + 2, backgroundColor: color, boxShadow: "0 0 0 1px rgba(255,255,255,0.2)" }}
            />
          </label>

          <Segmented
            label="Papel"
            size="sm"
            value={paper}
            onChange={setPaper}
            options={[
              { value: "light", label: "Claro", icon: Sun },
              { value: "dark", label: "Oscuro", icon: Moon },
            ]}
          />

          <div className="ml-auto flex items-center gap-1.5">
            <button type="button" onClick={undo} disabled={!hasInk} className="btn-ghost !p-2.5" aria-label="Deshacer" title="Deshacer (Ctrl+Z)">
              <Undo2 size={16} />
            </button>
            <button type="button" onClick={redo} disabled={counts.redo === 0} className="btn-ghost !p-2.5" aria-label="Rehacer" title="Rehacer (Ctrl+Y)">
              <Redo2 size={16} />
            </button>
            <button
              type="button"
              onClick={clearAll}
              disabled={!hasInk}
              className="btn-ghost !p-2.5 hover:!border-rose-400/40 hover:!text-rose-300"
              aria-label="Limpiar lienzo"
              title="Limpiar"
            >
              <Trash2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="btn-ghost !p-2.5"
              aria-label={expanded ? "Salir de pantalla completa" : "Pantalla completa"}
              title={expanded ? "Salir (Esc)" : "Pantalla completa: ideal para tableta y lápiz"}
            >
              {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>

        <div className={expanded ? "min-h-0 flex-1" : "p-3 sm:p-5"}>
          <canvas
            ref={canvasRef}
            aria-label="Lienzo de firma. Dibuja con el mouse, el dedo o un lápiz digital."
            className={`block w-full cursor-crosshair touch-none select-none rounded-2xl shadow-inner ring-1 ${
              paper === "light" ? "paper ring-slate-300/40" : "bg-[#0b1020] ring-white/10"
            } ${expanded ? "h-full" : "h-[260px] sm:h-[340px]"}`}
            style={{ touchAction: "none" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endStroke}
            onPointerCancel={endStroke}
            onLostPointerCapture={endStroke}
          />
        </div>

        <div
          className={`flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5 ${
            expanded ? "panel rounded-2xl" : "border-t border-white/[0.06] bg-black/20"
          }`}
        >
          <ResultActions
            disabled={!hasInk}
            getPng={() => exportStrokes(strokesRef.current)}
            getSvg={() => exportStrokesSVG(strokesRef.current)}
            onUseInEmail={(png) => {
              setExpanded(false);
              onUseInEmail(png);
            }}
            filename="firma-digital"
          />
          <span className="text-[11px] text-slate-500">
            {device === "pen"
              ? "✓ Lápiz digital detectado · presión activa"
              : device === "touch"
                ? "✓ Pantalla táctil detectada"
                : "Mouse · táctil · lápiz digital"}
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle
          checked={natural}
          onChange={setNatural}
          label="Trazo de pluma natural"
          description="Grosor variable según presión del lápiz o velocidad del mouse"
        />
        <p className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5 text-[11.5px] leading-relaxed text-slate-400">
          Se exporta <b className="text-slate-200">recortada y sin fondo</b> a 3× de resolución. Atajos:{" "}
          <kbd className="rounded bg-white/10 px-1 font-mono text-[10px]">Ctrl+Z</kbd> deshacer ·{" "}
          <kbd className="rounded bg-white/10 px-1 font-mono text-[10px]">Ctrl+Y</kbd> rehacer.
        </p>
      </div>
    </div>
  );
}
