import { Check, Download, Palette, PenLine, Trash2, Undo2 } from "lucide-react";
import { INK_COLORS } from "@/lib/signature-drawing";

export default function PadToolbar({
  color,
  width,
  hasInk,
  saved,
  onColorChange,
  onWidthChange,
  onUndo,
  onClear,
  onDownload,
}: {
  color: string;
  width: number;
  hasInk: boolean;
  saved: boolean;
  onColorChange: (value: string) => void;
  onWidthChange: (value: number) => void;
  onUndo: () => void;
  onClear: () => void;
  onDownload: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-white/10 bg-slate-950/60 px-4 py-4 sm:gap-4 sm:px-5">
      <div className="flex items-center gap-2">
        <Palette size={14} className="hidden text-slate-400 sm:block" />
        <div className="flex items-center gap-1.5">
          {INK_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Color ${c}`}
              onClick={() => onColorChange(c)}
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
              onChange={(e) => onColorChange(e.target.value)}
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
          onChange={(e) => onWidthChange(Number(e.target.value))}
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
          onClick={onUndo}
          disabled={!hasInk}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Undo2 size={14} /> Deshacer
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={!hasInk}
          className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 size={14} /> Limpiar
        </button>
        <button
          type="button"
          onClick={onDownload}
          disabled={!hasInk}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saved ? <Check size={16} strokeWidth={2.5} /> : <Download size={16} />}
          <span className="sm:hidden">PNG HD</span>
          <span className="hidden sm:inline">Descargar PNG Transparente HD</span>
        </button>
      </div>
    </div>
  );
}
