import type { Dispatch, SetStateAction } from "react";
import { Contrast, ScanLine, SlidersHorizontal, Sparkles } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import type { ExtractOptions } from "@/lib/processing";

const INK_COLORS = ["#0f172a", "#1d4ed8", "#111827", "#166534"];

export default function FilterControls({
  options,
  onChange,
}: {
  options: ExtractOptions;
  onChange: Dispatch<SetStateAction<ExtractOptions>>;
}) {
  return (
    <GlassCard className="p-6">
      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
        <SlidersHorizontal size={16} className="text-indigo-400" />
        Filtro automático
      </h3>

      <button
        type="button"
        onClick={() => onChange((o) => ({ ...o, mode: o.mode === "auto" ? "manual" : "auto" }))}
        className={`mt-5 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
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
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-[left] ${
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
            onChange={(e) => onChange((o) => ({ ...o, contrast: Number(e.target.value) }))}
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
            onChange={(e) => onChange((o) => ({ ...o, threshold: Number(e.target.value) }))}
            className="w-full"
          />
        </label>

        <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3">
          <span className="text-sm font-medium text-slate-300">Invertir tinta</span>
          <input
            type="checkbox"
            checked={options.invert}
            onChange={(e) => onChange((o) => ({ ...o, invert: e.target.checked }))}
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
                onClick={() => onChange((o) => ({ ...o, ink: c }))}
                className={`h-7 w-7 rounded-full border transition-transform hover:scale-110 ${
                  options.ink === c ? "border-white ring-2 ring-indigo-400" : "border-white/20"
                }`}
                style={{ backgroundColor: c }}
                aria-label={`Tinta ${c}`}
              />
            ))}
            <button
              type="button"
              onClick={() => onChange((o) => ({ ...o, ink: "original" }))}
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
  );
}
