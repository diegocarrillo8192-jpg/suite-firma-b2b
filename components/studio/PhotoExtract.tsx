"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  CloudUpload,
  Contrast,
  Crop,
  Loader2,
  Moon,
  RefreshCw,
  ScanLine,
  SlidersHorizontal,
  Sparkles,
  Sun,
} from "lucide-react";
import { Segmented, Toggle } from "@/components/ui/Controls";
import { RangeField } from "@/components/ui/Field";
import { loadImageFromSrc, readFileAsDataURL, trimCanvas, validateImageFile } from "@/lib/images";
import { defaultOptions, extractInkToCanvas, type ExtractOptions } from "@/lib/processing";
import ResultActions from "./ResultActions";

const INKS = [
  { hex: "#0b1b3f", name: "Azul tinta" },
  { hex: "#111827", name: "Negro" },
  { hex: "#1d4ed8", name: "Azul bolígrafo" },
];

/** Convierte una foto de tu firma en papel a PNG con transparencia real. */
export default function PhotoExtract({ onUseInEmail }: { onUseInEmail: (dataUrl: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState<{ src: string; img: HTMLImageElement } | null>(null);
  const [options, setOptions] = useState<ExtractOptions>(defaultOptions);
  const [trim, setTrim] = useState(true);
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [bg, setBg] = useState<"light" | "dark">("light");

  const loadFile = async (file: File | undefined) => {
    if (!file) return;
    const problem = validateImageFile(file);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    try {
      const src = await readFileAsDataURL(file);
      const img = await loadImageFromSrc(src);
      setSource({ src, img });
    } catch {
      setError("No se pudo leer la imagen. Prueba con otro archivo.");
    }
  };

  useEffect(() => {
    if (!source) return;
    let work: ReturnType<typeof setTimeout> | undefined;
    const timer = setTimeout(() => {
      setProcessing(true);
      // Se cede un cuadro para que el indicador "Procesando" llegue a pintarse.
      work = setTimeout(() => {
        try {
          const canvas = extractInkToCanvas(source.img, options);
          const out = trim ? (trimCanvas(canvas, 14) ?? canvas) : canvas;
          setResult(out.toDataURL("image/png"));
        } catch {
          setError("No se pudo procesar la imagen.");
        } finally {
          setProcessing(false);
        }
      }, 16);
    }, 120);
    return () => {
      clearTimeout(timer);
      if (work) clearTimeout(work);
    };
  }, [source, options, trim]);

  const reset = () => {
    setSource(null);
    setResult(null);
    setProcessing(false);
    setOptions(defaultOptions);
    setError(null);
  };

  const shown = source ? result : null;
  const set = <K extends keyof ExtractOptions>(k: K, v: ExtractOptions[K]) => setOptions((o) => ({ ...o, [k]: v }));

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="space-y-5">
        <div className="panel p-5 sm:p-6">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              loadFile(e.dataTransfer.files?.[0]);
            }}
            className={`flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 py-9 text-center transition-colors ${
              dragging
                ? "border-blue-400 bg-blue-500/10"
                : "border-white/12 bg-black/20 hover:border-blue-400/50 hover:bg-blue-500/[0.04]"
            }`}
          >
            {source ? (
              <span className="relative block h-40 w-full max-w-sm">
                <Image src={source.src} alt="Foto original" fill unoptimized sizes="384px" className="rounded-xl object-contain" />
              </span>
            ) : (
              <>
                <span className="rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-4 text-white shadow-lg shadow-blue-900/50">
                  <CloudUpload size={28} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-100">Arrastra la foto de tu firma en papel</span>
                  <span className="mt-1 block text-xs text-slate-500">
                    o toca para elegirla / tomarla con la cámara · JPG, PNG, WEBP
                  </span>
                </span>
              </>
            )}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              loadFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          {error && (
            <p className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300">
              {error}
            </p>
          )}
          <p className="mt-3 text-[11.5px] leading-relaxed text-slate-500">
            Consejo: firma con bolígrafo oscuro en hoja blanca y toma la foto de frente, con buena luz y sin sombras.
          </p>
        </div>

        <div className="panel space-y-5 p-5 sm:p-6">
          <h3 className="flex items-center gap-2 text-[15px] font-semibold text-white">
            <SlidersHorizontal size={16} className="text-blue-300" /> Ajustes de limpieza
          </h3>

          <div className="grid gap-2.5">
            <Toggle
              checked={options.mode === "auto"}
              onChange={(v) => set("mode", v ? "auto" : "manual")}
              label="Umbral automático (Otsu)"
              description="Detecta solo dónde termina la tinta y empieza el papel"
            />
            <Toggle
              checked={options.flatten}
              onChange={(v) => set("flatten", v)}
              label="Corregir sombras e iluminación"
              description="Ideal para fotos tomadas con el celular"
            />
            <Toggle checked={trim} onChange={setTrim} label="Recortar al contenido" description="Elimina el papel sobrante" />
            <Toggle
              checked={options.invert}
              onChange={(v) => set("invert", v)}
              label="Tinta clara sobre fondo oscuro"
              description="Para pizarras o papel negro"
            />
          </div>

          <RangeField
            label="Contraste"
            value={options.contrast}
            min={0.5}
            max={2.5}
            step={0.05}
            unit="×"
            onChange={(v) => set("contrast", v)}
          />
          {options.mode === "manual" && (
            <RangeField label="Umbral" value={options.threshold} min={40} max={230} unit="" onChange={(v) => set("threshold", v)} />
          )}

          <div>
            <span className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              <Contrast size={12} className="text-blue-300/80" /> Color de tinta
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {INKS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => set("ink", c.hex)}
                  aria-label={c.name}
                  aria-pressed={options.ink === c.hex}
                  title={c.name}
                  className={`h-7 w-7 rounded-full transition-transform hover:scale-110 ${
                    options.ink === c.hex ? "ring-2 ring-gold-400 ring-offset-2 ring-offset-[#070a14]" : "ring-1 ring-white/20"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              <button
                type="button"
                onClick={() => set("ink", "original")}
                aria-pressed={options.ink === "original"}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  options.ink === "original"
                    ? "border-gold-400/70 bg-gold-400/10 text-gold-200"
                    : "border-white/15 text-slate-400 hover:border-white/30"
                }`}
              >
                Color original
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="panel flex flex-col overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.06] px-5 py-3.5">
          <ScanLine size={16} className="text-emerald-300" />
          <span className="text-[15px] font-semibold text-white">Resultado sin fondo</span>
          {processing && (
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <Loader2 size={13} className="animate-spin" /> Procesando…
            </span>
          )}
          <div className="ml-auto">
            <Segmented
              label="Fondo de prueba"
              size="sm"
              value={bg}
              onChange={setBg}
              options={[
                { value: "light", label: "Claro", icon: Sun },
                { value: "dark", label: "Oscuro", icon: Moon },
              ]}
            />
          </div>
        </div>

        <div className={`flex min-h-[300px] flex-1 items-center justify-center p-5 sm:min-h-[400px] ${bg === "light" ? "bg-checker" : "bg-checker-dark"}`}>
          {shown ? (
            <div className="relative h-[280px] w-full sm:h-[360px]">
              <Image
                src={shown}
                alt="Firma extraída con fondo transparente"
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 640px"
                className={`object-contain transition-opacity ${processing ? "opacity-40" : "opacity-100"}`}
              />
            </div>
          ) : (
            <div className="text-center">
              <Sparkles size={36} className="mx-auto text-slate-400" />
              <p className="mt-3 max-w-xs text-sm text-slate-500">
                Sube una foto y aquí verás tu firma limpia, lista para usar
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] bg-black/20 px-5 py-4">
          <ResultActions
            disabled={!shown || processing}
            getPng={() => shown}
            onUseInEmail={onUseInEmail}
            filename="firma-png-transparente"
          />
          <div className="flex items-center gap-3">
            {source && (
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <Crop size={12} />
                {source.img.naturalWidth} × {source.img.naturalHeight} px
              </span>
            )}
            {source && (
              <button type="button" onClick={reset} className="btn-ghost !px-3 !py-2 !text-xs">
                <RefreshCw size={13} /> Nueva
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
