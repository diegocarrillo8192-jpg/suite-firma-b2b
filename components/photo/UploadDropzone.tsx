"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { CloudUpload, FileImage } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

export default function UploadDropzone({
  source,
  error,
  onFile,
}: {
  source: string | null;
  error: string | null;
  onFile: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const pick = () => inputRef.current?.click();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    e.target.value = "";
  };

  return (
    <GlassCard className="p-6">
      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
        <FileImage size={16} className="text-indigo-400" />
        Foto de firma en papel
      </h3>

      <div
        role="button"
        tabIndex={0}
        onClick={pick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") pick();
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
          if (file) onFile(file);
        }}
        className={`mt-5 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 py-10 text-center transition-colors duration-200 sm:px-6 sm:py-12 ${
          dragging
            ? "border-indigo-400 bg-indigo-500/15"
            : "border-white/15 bg-slate-950/40 hover:border-indigo-400/60 hover:bg-indigo-500/5"
        }`}
      >
        {source ? (
          <div className="relative h-44 w-full max-w-sm">
            <Image
              src={source}
              alt="Original"
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, 384px"
              className="rounded-xl object-contain ring-1 ring-white/15"
            />
          </div>
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
        onChange={handleFile}
      />
      {error && (
        <p className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300">
          {error}
        </p>
      )}
    </GlassCard>
  );
}
