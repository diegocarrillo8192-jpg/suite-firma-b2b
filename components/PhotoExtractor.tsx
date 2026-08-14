"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  CloudUpload,
  Contrast,
  Download,
  FileImage,
  Loader2,
  RefreshCw,
  ScanLine,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { defaultOptions, extractInkToCanvas, type ExtractOptions } from "@/lib/processing";

const INK_COLORS = ["#0f172a", "#1d4ed8", "#111827", "#166534"];

export default function PhotoExtractor() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState<string | null>(null);
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [options, setOptions] = useState<ExtractOptions>(defaultOptions);
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("El archivo no es una imagen válida.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setSource(reader.result as string);
      const img = new Image();
      img.onload = () => setSourceImg(img);
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  useEffect(() => {
    if (!sourceImg) return;
    const timer = setTimeout(() => {
      setProcessing(true);
      try {
        const canvas = extractInkToCanvas(sourceImg, options);
        setResult(canvas.toDataURL("image/png"));
      } catch {
        setError("No se pudo procesar la imagen.");
      } finally {
        setProcessing(false);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [sourceImg, options]);

  const displayResult = sourceImg ? result : null;

  const download = () => {
    if (!displayResult) return;
    const a = document.createElement("a");
    a.href = displayResult;
    const stamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 19);
    a.download = `firma-png-transparente-${stamp}.png`;
    a.click();
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const resetAll = () => {
    setSource(null);
    setSourceImg(null);
    setResult(null);
    setOptions(defaultOptions);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="space-y-6">
        <GlassCard className="p-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
            <FileImage size={16} className="text-indigo-400" />
            Foto de firma en papel
          </h3>

          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) loadFile(file);
            }}
            className={`mt-5 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 py-10 text-center transition-all duration-200 sm:px-6 sm:py-12 ${
              dragging
                ? "border-indigo-400 bg-indigo-500/15"
                : "border-white/15 bg-slate-950/40 hover:border-indigo-400/60 hover:bg-indigo-500/5"
            }`}
          >
            {source ? (
              <img
                src={source}
                alt="Original"
                className="max-h-44 rounded-xl object-contain ring-1 ring-white/15"
              />
            ) : (
              <>
                <span className="rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 p-4 text-white shadow-lg shadow-indigo-900/40">
                  <CloudUpload size={28} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Arrastra la foto de tu firma aquí
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    o haz clic para seleccionar · JPG, PNG, WEBP, HEIC
                  </p>
                </div>
              </>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) loadFile(file);
            }}
          />
          {error && (
            <p className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300">
              {error}
            </p>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
            <SlidersHorizontal size={16} className="text-indigo-400" />
            Filtro automático
          </h3>

          <button
            type="button"
            onClick={() =>
              setOptions((o) => ({ ...o, mode: o.mode === "auto" ? "manual" : "auto" }))
            }
            className={`mt-5 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
              options.mode === "auto"
                ? "border-indigo-500/60 bg-indigo-500/15 text-indigo-200"
                : "border-white/10 bg-slate-950/40 text-slate-300 hover:border-white/25"
            }`}
          >
            <span className="flex items-center gap-2">
              {options.mode === "auto" ? <Sparkles size={15} /> : <ScanLine size={15} />}
              {options.mode === "auto" ? "Umbral automático (Otsu)" : "Umbral manual"}
            </span>
            <span
              className={`relative h-5 w-9 rounded-full transition-colors ${
                options.mode === "auto" ? "bg-indigo-500" : "bg-slate-700"
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                  options.mode === "auto" ? "left-[18px]" : "left-0.5"
                }`}
              />
            </span>
          </button>

          <div className="mt-5 space-y-5">
            <label className="block">
              <span className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-400">
                <span className="flex items-center gap-1.5 uppercase tracking-wider">
                  <Contrast size={13} className="text-indigo-400" /> Contraste
                </span>
                <span className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-slate-300">
                  {options.contrast.toFixed(2)}×
                </span>
              </span>
              <input
                type="range"
                min={0.5}
                max={2.5}
                step={0.05}
                value={options.contrast}
                onChange={(e) =>
                  setOptions((o) => ({ ...o, contrast: Number(e.target.value) }))
                }
                className="w-full"
              />
            </label>

            <label className={`block ${options.mode === "auto" ? "pointer-events-none opacity-40" : ""}`}>
              <span className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-400">
                <span className="flex items-center gap-1.5 uppercase tracking-wider">
                  <ScanLine size={13} className="text-indigo-400" /> Umbral
                </span>
                <span className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-slate-300">
                  {options.threshold}
                </span>
              </span>
              <input
                type="range"
                min={40}
                max={220}
                value={options.threshold}
                onChange={(e) =>
                  setOptions((o) => ({ ...o, threshold: Number(e.target.value) }))
                }
                className="w-full"
              />
            </label>

            <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3">
              <span className="text-sm font-medium text-slate-300">Invertir tinta</span>
              <input
                type="checkbox"
                checked={options.invert}
                onChange={(e) => setOptions((o) => ({ ...o, invert: e.target.checked }))}
                className="h-4 w-4 accent-indigo-500"
              />
            </label>

            <div>
              <span className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
                <Contrast size={13} className="text-indigo-400" /> Color de tinta
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {INK_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setOptions((o) => ({ ...o, ink: c }))}
                    className={`h-7 w-7 rounded-full border transition-transform hover:scale-110 ${
                      options.ink === c ? "border-white ring-2 ring-indigo-400" : "border-white/20"
                    }`}
                    style={{ backgroundColor: c }}
                    aria-label={`Tinta ${c}`}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setOptions((o) => ({ ...o, ink: "original" }))}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    options.ink === "original"
                      ? "border-indigo-400 bg-indigo-500/15 text-indigo-200"
                      : "border-white/15 text-slate-400 hover:border-white/30"
                  }`}
                >
                  Color original
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="space-y-6">
        <GlassCard className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-white/10 bg-slate-950/60 px-5 py-3">
            <ScanLine size={15} className="text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Resultado · tinta nítida sobre fondo transparente
            </span>
            {processing && (
              <span className="ml-auto flex items-center gap-1.5 text-xs text-slate-400">
                <Loader2 size={13} className="animate-spin" /> Procesando…
              </span>
            )}
          </div>

          <div className="bg-checker flex min-h-[260px] items-center justify-center p-4 sm:min-h-[340px] sm:p-6">
            {displayResult ? (
              <img
                src={displayResult}
                alt="Firma extraída"
                className={`max-h-[340px] max-w-full object-contain transition-opacity duration-150 sm:max-h-[420px] ${
                  processing ? "opacity-40" : "opacity-100"
                }`}
              />
            ) : (
              <div className="text-center">
                <ScanLine size={40} className="mx-auto text-slate-600" />
                <p className="mt-3 text-sm text-slate-500">
                  Carga una foto y la tinta aparecerá aquí, lista para descargar
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-white/10 bg-slate-950/60 px-5 py-4">
            <button
              type="button"
              onClick={download}
              disabled={!displayResult || processing}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saved ? <Check size={16} strokeWidth={2.5} /> : <Download size={16} />}
              Descargar PNG
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10"
            >
              <RefreshCw size={15} />
              Nueva imagen
            </button>
            {source && (
              <span className="ml-auto text-xs text-slate-500">
                {sourceImg?.naturalWidth} × {sourceImg?.naturalHeight} px
              </span>
            )}
          </div>
        </GlassCard>

        <GlassCard className="flex items-start gap-3 p-5">
          <Sparkles size={18} className="mt-0.5 shrink-0 text-emerald-400" />
          <div className="text-sm leading-relaxed text-slate-400">
            <span className="font-semibold text-slate-200">Cómo funciona:</span> la imagen se
            convierte a escala de grises, se aplica contraste y el{" "}
            <span className="text-slate-200">umbral automático de Otsu</span> separa la tinta del
            fondo. El resultado queda con <span className="text-slate-200">transparencia real</span>{" "}
            (canal alfa) y bordes suavizados. Si el fondo es muy sucio, sube el contraste o cambia a
            umbral manual.
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
