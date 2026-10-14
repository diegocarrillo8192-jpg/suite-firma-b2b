import { Images } from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import ImageInput from "@/components/ui/ImageInput";
import { Toggle } from "@/components/ui/Controls";
import { RangeField } from "@/components/ui/Field";
import type { SignatureData, SignatureSettings } from "@/lib/templates";
import type { SetField, SetSetting } from "./types";

export default function IdentityPanel({
  data,
  settings,
  onField,
  onSetting,
}: {
  data: SignatureData;
  settings: SignatureSettings;
  onField: SetField;
  onSetting: SetSetting;
}) {
  return (
    <Panel>
      <PanelHeader
        step="02"
        icon={Images}
        title="Logo y foto"
        description="Sube el logo de tu empresa y tu foto de perfil. Se optimizan automáticamente."
      />
      <div className="grid gap-5 p-5 sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <ImageInput
            label="Logo de la empresa"
            value={data.logoUrl}
            onChange={(v) => onField("logoUrl", v)}
            fit={{ maxWidth: 440, maxHeight: 220, format: "image/png" }}
            shape="wide"
            emptyHint="PNG con fondo transparente, horizontal, idealmente 400 px de ancho."
          />
          <ImageInput
            label="Foto de perfil"
            value={data.fotoUrl}
            onChange={(v) => onField("fotoUrl", v)}
            fit={{ maxWidth: 200, maxHeight: 200, square: true, format: "image/jpeg" }}
            shape="circle"
            emptyHint="Foto cuadrada y bien iluminada. Si no hay foto se usan tus iniciales."
          />
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          <Toggle
            checked={settings.showLogo}
            onChange={(v) => onSetting("showLogo", v)}
            label="Mostrar logo"
            description="En el pie o lateral según plantilla"
          />
          <Toggle
            checked={settings.showFoto}
            onChange={(v) => onSetting("showFoto", v)}
            label="Mostrar foto o iniciales"
            description="Avatar circular o redondeado"
          />
        </div>

        {settings.showLogo && (
          <RangeField
            label="Ancho del logo"
            value={settings.logoWidth}
            min={60}
            max={220}
            step={5}
            onChange={(v) => onSetting("logoWidth", v)}
          />
        )}
      </div>
    </Panel>
  );
}
