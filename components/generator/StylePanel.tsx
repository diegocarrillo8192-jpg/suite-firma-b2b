import { Check, Palette, RotateCcw, TriangleAlert } from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { BRAND_SWATCHES, DEFAULT_ACCENT, contrastOnWhite, readableOn, safeAccent } from "@/lib/colors";
import { FONTS, type SignatureSettings } from "@/lib/templates";
import type { SetSetting } from "./types";

export default function StylePanel({
  settings,
  onSetting,
}: {
  settings: SignatureSettings;
  onSetting: SetSetting;
}) {
  const accent = settings.accent;
  const lowContrast = contrastOnWhite(accent) < 3;
  const isCustom = !BRAND_SWATCHES.some((s) => s.hex === accent);

  return (
    <Panel>
      <PanelHeader
        step="06"
        icon={Palette}
        title="Marca y tipografía"
        description="El color se aplica a líneas, etiquetas, botones y redes. El texto siempre queda legible."
      />
      <div className="space-y-6 p-5 sm:p-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            {BRAND_SWATCHES.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => onSetting("accent", c.hex)}
                aria-label={`Color ${c.name}`}
                aria-pressed={accent === c.hex}
                title={c.name}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-110 ${
                  accent === c.hex ? "ring-2 ring-white ring-offset-2 ring-offset-[#070a14]" : "ring-1 ring-white/15"
                }`}
                style={{ backgroundColor: c.hex }}
              >
                {accent === c.hex && <Check size={15} style={{ color: readableOn(c.hex) }} strokeWidth={3} />}
              </button>
            ))}
            <label
              title="Color personalizado"
              className={`relative flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full transition-transform hover:scale-110 ${
                isCustom ? "ring-2 ring-white ring-offset-2 ring-offset-[#070a14]" : "ring-1 ring-white/30"
              }`}
              style={{
                background: isCustom
                  ? accent
                  : "conic-gradient(from 0deg, #ef4444, #f59e0b, #22c55e, #06b6d4, #3b82f6, #a855f7, #ef4444)",
              }}
            >
              <input
                type="color"
                value={accent}
                onChange={(e) => onSetting("accent", safeAccent(e.target.value))}
                className="absolute inset-0 h-full w-full opacity-0"
                aria-label="Elegir color personalizado"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-400">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: accent }} />
              {accent}
              {!isCustom && (
                <span className="font-sans normal-case tracking-normal text-slate-500">
                  · {BRAND_SWATCHES.find((s) => s.hex === accent)?.name}
                </span>
              )}
            </span>
            {accent !== DEFAULT_ACCENT && (
              <button
                type="button"
                onClick={() => onSetting("accent", DEFAULT_ACCENT)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-300 transition-colors hover:text-blue-200"
              >
                <RotateCcw size={12} /> Restablecer
              </button>
            )}
          </div>
          {lowContrast && (
            <p className="mt-3 flex items-start gap-2 rounded-lg border border-amber-400/20 bg-amber-400/[0.06] px-3 py-2 text-[11px] leading-relaxed text-amber-200">
              <TriangleAlert size={13} className="mt-px shrink-0" />
              Color muy claro: los textos de marca usarán gris oscuro para mantenerse legibles.
            </p>
          )}
        </div>

        <div>
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
            Tipografía (segura para correo)
          </span>
          <div role="radiogroup" aria-label="Tipografía" className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {FONTS.map((f) => {
              const active = settings.font === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onSetting("font", f.id)}
                  className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
                    active
                      ? "border-blue-400/60 bg-blue-500/10 text-white"
                      : "border-white/[0.07] bg-white/[0.02] text-slate-300 hover:border-white/20"
                  }`}
                >
                  <span className="block text-lg leading-none" style={{ fontFamily: f.stack }}>
                    Aa
                  </span>
                  <span className="mt-1 block text-[11px] text-slate-400">{f.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Panel>
  );
}
