"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Link2, Loader2, Trash2, TriangleAlert } from "lucide-react";
import { ACCEPTED_IMAGES, fitImageFile, validateImageFile, type FitOptions } from "@/lib/images";
import { isEmbedded, safeImgSrc } from "@/lib/templates";

/**
 * Selector de imagen: subir desde el equipo (se optimiza en el navegador),
 * arrastrar y soltar, o pegar una URL pública (recomendado para Gmail).
 */
export default function ImageInput({
  label,
  value,
  onChange,
  fit,
  shape = "square",
  emptyHint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  fit: FitOptions;
  shape?: "circle" | "square" | "wide";
  emptyHint: string;
}) {
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const [broken, setBroken] = useState<string | null>(null);

  const src = safeImgSrc(value);
  const embedded = isEmbedded(value);
  const urlFieldVisible = showUrl || (Boolean(value) && !embedded);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const problem = validateImageFile(file);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      onChange(await fitImageFile(file, fit));
    } catch {
      setError("No se pudo leer la imagen. Prueba con otro archivo.");
    } finally {
      setBusy(false);
    }
  };

  const frame =
    shape === "circle" ? "h-16 w-16 rounded-full" : shape === "wide" ? "h-16 w-28 rounded-xl" : "h-16 w-16 rounded-xl";

  return (
    <div>
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
        {label}
      </span>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`flex items-center gap-4 rounded-2xl border border-dashed p-3 transition-colors ${
          dragging ? "border-blue-400 bg-blue-500/10" : "border-white/12 bg-black/20"
        }`}
      >
        <div className={`relative shrink-0 overflow-hidden ring-1 ring-white/10 ${frame} ${src ? "bg-checker" : "bg-white/[0.03]"}`}>
          {src && broken !== src ? (
            <Image
              src={src}
              alt={`Vista previa: ${label}`}
              fill
              unoptimized
              sizes="112px"
              onError={() => setBroken(src)}
              className={shape === "circle" ? "object-cover" : "object-contain p-1"}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-slate-600">
              {broken === src && src ? <TriangleAlert size={20} className="text-amber-400" /> : <ImagePlus size={20} />}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="btn-ghost !px-3 !py-2 !text-xs"
            >
              {busy ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
              {value ? "Cambiar" : "Subir imagen"}
            </button>
            <button
              type="button"
              onClick={() => setShowUrl((v) => !v)}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-medium text-slate-400 transition-colors hover:text-white"
              aria-expanded={urlFieldVisible}
              aria-controls={`${id}-url`}
            >
              <Link2 size={13} /> URL
            </button>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setError(null);
                }}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-medium text-rose-300/90 transition-colors hover:text-rose-200"
              >
                <Trash2 size={13} /> Quitar
              </button>
            )}
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
            {embedded
              ? "Imagen optimizada e incrustada. Para Gmail usa mejor una URL pública."
              : broken === src && src
                ? "No se pudo cargar esa URL. Verifica que sea pública y termine en .png o .jpg."
                : emptyHint}
          </p>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPTED_IMAGES}
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      {urlFieldVisible && (
        <div className="input-shell mt-2">
          <Link2 size={14} className="shrink-0 text-slate-500" />
          <input
            id={`${id}-url`}
            type="url"
            inputMode="url"
            value={embedded ? "" : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={embedded ? "Reemplazar por URL pública: https://…" : "https://tuempresa.com/logo.png"}
            aria-label={`URL pública de ${label}`}
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none"
          />
        </div>
      )}
      {error && <p className="mt-1.5 text-[11px] text-rose-300">{error}</p>}
    </div>
  );
}
