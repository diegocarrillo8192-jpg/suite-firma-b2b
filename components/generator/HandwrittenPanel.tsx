import Image from "next/image";
import { Feather, PenLine } from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import ImageInput from "@/components/ui/ImageInput";
import { Toggle } from "@/components/ui/Controls";
import { RangeField } from "@/components/ui/Field";
import { safeImgSrc, type SignatureData, type SignatureSettings } from "@/lib/templates";
import type { SetField, SetSetting } from "./types";

export default function HandwrittenPanel({
  data,
  settings,
  onField,
  onSetting,
  onOpenStudio,
}: {
  data: SignatureData;
  settings: SignatureSettings;
  onField: SetField;
  onSetting: SetSetting;
  onOpenStudio: () => void;
}) {
  const src = safeImgSrc(data.firmaUrl);

  return (
    <Panel gold={!src}>
      <PanelHeader
        step="07"
        icon={Feather}
        title="Firma manuscrita"
        description="Añade tu firma a mano: dibújala con mouse o lápiz, escríbela o sube una foto."
      />
      <div className="space-y-4 p-5 sm:p-6">
        {src ? (
          <div className="bg-checker relative h-28 overflow-hidden rounded-xl ring-1 ring-white/10">
            <Image src={src} alt="Tu firma manuscrita" fill unoptimized sizes="400px" className="object-contain p-3" />
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenStudio}
            className="group flex w-full items-center gap-4 rounded-xl border border-dashed border-gold-400/30 bg-gold-400/[0.04] p-4 text-left transition-colors hover:border-gold-400/60 hover:bg-gold-400/[0.07]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-400/15 text-gold-300">
              <PenLine size={20} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-white">Crear mi firma a mano</span>
              <span className="block text-xs text-slate-400">
                Abre el estudio: dibuja con mouse, dedo o lápiz digital
              </span>
            </span>
          </button>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={onOpenStudio} className="btn-ghost !py-2 !text-xs">
            <PenLine size={14} />
            {src ? "Rehacer en el estudio" : "Abrir estudio de firma"}
          </button>
        </div>

        <ImageInput
          label="…o sube tu firma en PNG"
          value={data.firmaUrl}
          onChange={(v) => onField("firmaUrl", v)}
          fit={{ maxWidth: 520, maxHeight: 220, format: "image/png" }}
          shape="wide"
          emptyHint="PNG con fondo transparente. Si tienes una foto en papel, usa el estudio para limpiarla."
        />

        {src && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Toggle
              checked={settings.showFirma}
              onChange={(v) => onSetting("showFirma", v)}
              label="Incluir en la firma"
            />
            <RangeField
              label="Ancho"
              value={settings.firmaWidth}
              min={100}
              max={260}
              step={5}
              onChange={(v) => onSetting("firmaWidth", v)}
            />
          </div>
        )}
      </div>
    </Panel>
  );
}
