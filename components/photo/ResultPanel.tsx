import Image from "next/image";
import { Check, Download, Loader2, RefreshCw, ScanLine } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

export default function ResultPanel({
  result,
  processing,
  saved,
  source,
  width,
  height,
  onDownload,
  onReset,
}: {
  result: string | null;
  processing: boolean;
  saved: boolean;
  source: string | null;
  width?: number;
  height?: number;
  onDownload: () => void;
  onReset: () => void;
}) {
  return (
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
        {result ? (
          <div className="relative h-[340px] w-full sm:h-[420px]">
            <Image
              src={result}
              alt="Firma extraída"
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, 640px"
              className={`object-contain transition-opacity duration-150 ${
                processing ? "opacity-40" : "opacity-100"
              }`}
            />
          </div>
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
          onClick={onDownload}
          disabled={!result || processing}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saved ? <Check size={16} strokeWidth={2.5} /> : <Download size={16} />}
          Descargar PNG
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10"
        >
          <RefreshCw size={15} />
          Nueva imagen
        </button>
        {source && (
          <span className="ml-auto text-xs text-slate-500">
            {width} × {height} px
          </span>
        )}
      </div>
    </GlassCard>
  );
}
