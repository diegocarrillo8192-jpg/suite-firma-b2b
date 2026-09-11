import { Check, Palette, RotateCcw } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { BRAND_SWATCHES, DEFAULT_ACCENT, safeAccent } from "@/lib/colors";
import CardHeader from "./CardHeader";

export default function BrandColorPicker({
  accent,
  onAccentChange,
}: {
  accent: string;
  onAccentChange: (value: string) => void;
}) {
  return (
    <GlassCard>
      <CardHeader icon={Palette} title="Color de marca" />
      <div className="p-5">
        <p className="text-xs leading-relaxed text-slate-400">
          Se aplica solo a líneas divisoras, íconos de contacto y redes sociales. El texto
          siempre permanece legible.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          {BRAND_SWATCHES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onAccentChange(c)}
              aria-label={`Color ${c}`}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110 ${
                accent === c
                  ? "ring-2 ring-white ring-offset-2 ring-offset-slate-950"
                  : "ring-1 ring-white/20"
              }`}
              style={{ backgroundColor: c }}
            >
              {accent === c && <Check className="h-4 w-4 text-white" />}
            </button>
          ))}
          <label className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-dashed border-white/25 text-slate-400 transition-colors hover:border-white/60 hover:text-white">
            <input
              type="color"
              value={accent}
              onChange={(e) => onAccentChange(safeAccent(e.target.value))}
              className="h-0 w-0 opacity-0"
              aria-label="Color personalizado"
            />
            <Palette size={15} />
          </label>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
            {accent.toUpperCase()}
          </span>
          {accent !== DEFAULT_ACCENT && (
            <button
              type="button"
              onClick={() => onAccentChange(DEFAULT_ACCENT)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-300 transition-colors hover:text-indigo-200"
            >
              <RotateCcw size={12} />
              Restablecer
            </button>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
