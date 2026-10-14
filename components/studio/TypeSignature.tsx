"use client";

import { useState } from "react";
import { Type } from "lucide-react";
import { SIGNATURE_FONTS } from "@/app/fonts";
import { Field, RangeField } from "@/components/ui/Field";
import { trimCanvas } from "@/lib/images";
import { INK_COLORS } from "@/lib/signature-drawing";
import ResultActions from "./ResultActions";

const PNG_FONT_PX = 160;

/** Genera una firma caligráfica a partir de tu nombre con fuentes manuscritas. */
export default function TypeSignature({
  defaultName,
  onUseInEmail,
}: {
  defaultName: string;
  onUseInEmail: (dataUrl: string) => void;
}) {
  const [name, setName] = useState(defaultName);
  const [fontId, setFontId] = useState<string>(SIGNATURE_FONTS[0].id);
  const [color, setColor] = useState(INK_COLORS[0].hex);
  const [size, setSize] = useState(64);
  const [slant, setSlant] = useState(0);

  const font = SIGNATURE_FONTS.find((f) => f.id === fontId) ?? SIGNATURE_FONTS[0];
  // Si el campo está vacío se usa el nombre de la firma de correo.
  const text = (name || defaultName).trim();

  const toPng = async (): Promise<string | null> => {
    if (!text) return null;
    const px = Math.round(PNG_FONT_PX * font.scale);
    const spec = `${px}px ${font.family}`;
    try {
      await document.fonts.load(spec, text);
    } catch {
      // si falla la carga se usa la fuente de respaldo
    }
    const measure = document.createElement("canvas").getContext("2d");
    if (!measure) return null;
    measure.font = spec;
    const w = Math.ceil(measure.measureText(text).width + px * 1.6);
    const h = Math.ceil(px * 2.4);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.font = spec;
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.setTransform(1, 0, Math.tan((-slant * Math.PI) / 180), 1, px * 0.6, h / 2);
    ctx.fillText(text, 0, 0);
    return trimCanvas(canvas, 16)?.toDataURL("image/png") ?? null;
  };

  return (
    <div className="space-y-5">
      <div className="panel overflow-hidden">
        <div className="grid gap-4 border-b border-white/[0.06] p-5 sm:grid-cols-[1.4fr_1fr] sm:p-6">
          <Field
            label="Tu nombre como firma"
            icon={Type}
            value={name}
            onChange={setName}
            placeholder={defaultName || "Ej. Andrés Morales"}
            maxLength={40}
            hint="Puedes usar solo nombre, iniciales o nombre completo."
          />
          <div className="grid grid-cols-2 gap-4">
            <RangeField label="Tamaño" value={size} min={36} max={96} onChange={setSize} />
            <RangeField label="Inclinación" value={slant} min={-15} max={15} unit="°" onChange={setSlant} />
          </div>
        </div>

        <div className="paper flex min-h-[220px] items-center justify-center overflow-hidden px-6 py-8 sm:min-h-[260px]">
          <p
            className="max-w-full break-words text-center leading-[1.3]"
            style={{
              fontFamily: font.family,
              fontSize: size * font.scale,
              color,
              transform: `skewX(${-slant}deg)`,
            }}
          >
            {text || <span className="text-slate-300">Tu firma aquí</span>}
          </p>
        </div>

        <div className="border-t border-white/[0.06] p-5 sm:p-6">
          <span className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
            Estilo caligráfico
          </span>
          <div role="radiogroup" aria-label="Estilo caligráfico" className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {SIGNATURE_FONTS.map((f) => {
              const activeFont = f.id === fontId;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="radio"
                  aria-checked={activeFont}
                  onClick={() => setFontId(f.id)}
                  className={`overflow-hidden rounded-xl border px-3 pb-2 pt-1 text-left transition-colors ${
                    activeFont
                      ? "border-gold-400/70 bg-gold-400/[0.07]"
                      : "border-white/[0.07] bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <span
                    className="block truncate text-white"
                    style={{ fontFamily: f.family, fontSize: 28 * f.scale, lineHeight: 1.6 }}
                  >
                    {text || "Firma"}
                  </span>
                  <span className="block text-[11px] text-slate-500">{f.name}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-center gap-2" role="radiogroup" aria-label="Color de tinta">
            {INK_COLORS.filter((c) => c.hex !== "#ffffff").map((c) => (
              <button
                key={c.hex}
                type="button"
                role="radio"
                aria-checked={color === c.hex}
                aria-label={c.name}
                title={c.name}
                onClick={() => setColor(c.hex)}
                className={`h-7 w-7 rounded-full transition-transform hover:scale-110 ${
                  color === c.hex ? "ring-2 ring-gold-400 ring-offset-2 ring-offset-[#070a14]" : "ring-1 ring-white/20"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-white/[0.06] bg-black/20 px-5 py-4">
          <ResultActions disabled={!text} getPng={toPng} onUseInEmail={onUseInEmail} filename="firma-escrita" />
        </div>
      </div>
    </div>
  );
}
