import { Megaphone, Scale } from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { Field, TextArea } from "@/components/ui/Field";
import { DISCLAIMERS } from "@/lib/profile";
import { whatsappHref } from "@/lib/phone";
import { safeHref, type SignatureData } from "@/lib/templates";
import type { SetField } from "./types";

export default function ExtrasPanel({ data, onField }: { data: SignatureData; onField: SetField }) {
  const ctaPresets = [
    { label: "Agenda una reunión", url: "" },
    { label: "Escríbeme por WhatsApp", url: whatsappHref(data.whatsapp || data.telefono) },
    { label: "Solicita una cotización", url: data.web },
    { label: "Descarga nuestro catálogo", url: "" },
  ];

  const ctaError =
    data.ctaTexto.trim() && !safeHref(data.ctaUrl) ? "Agrega el enlace del botón para que se muestre." : null;

  return (
    <Panel>
      <PanelHeader
        step="08"
        icon={Megaphone}
        title="Botón de acción y aviso legal"
        description="Convierte cada correo en una oportunidad comercial."
      />
      <div className="space-y-6 p-5 sm:p-6">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {ctaPresets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  onField("ctaTexto", p.label);
                  if (p.url) onField("ctaUrl", p.url);
                }}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  data.ctaTexto === p.label
                    ? "border-blue-400/60 bg-blue-500/10 text-white"
                    : "border-white/10 text-slate-400 hover:border-white/25 hover:text-slate-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Texto del botón"
              value={data.ctaTexto}
              onChange={(v) => onField("ctaTexto", v)}
              placeholder="Ej. Agenda una reunión"
              optional
              maxLength={40}
            />
            <Field
              label="Enlace del botón"
              inputMode="url"
              value={data.ctaUrl}
              onChange={(v) => onField("ctaUrl", v)}
              placeholder="Ej. calendly.com/tu-agenda"
              error={ctaError}
              maxLength={300}
            />
          </div>
          {data.ctaTexto && (
            <button
              type="button"
              onClick={() => {
                onField("ctaTexto", "");
                onField("ctaUrl", "");
              }}
              className="text-[11px] font-medium text-rose-300/90 hover:text-rose-200"
            >
              Quitar botón
            </button>
          )}
        </div>

        <div className="space-y-3 border-t border-white/[0.06] pt-5">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
            <Scale size={12} className="text-blue-300/80" /> Aviso legal · plantillas rápidas
          </span>
          <div className="flex flex-wrap gap-2">
            {DISCLAIMERS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => onField("disclaimer", d.text)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  data.disclaimer === d.text
                    ? "border-blue-400/60 bg-blue-500/10 text-white"
                    : "border-white/10 text-slate-400 hover:border-white/25 hover:text-slate-200"
                }`}
              >
                {d.name}
              </button>
            ))}
            {data.disclaimer && (
              <button
                type="button"
                onClick={() => onField("disclaimer", "")}
                className="rounded-full px-3 py-1.5 text-xs font-medium text-rose-300/90 hover:text-rose-200"
              >
                Quitar aviso
              </button>
            )}
          </div>
          <TextArea
            label="Texto del aviso"
            value={data.disclaimer}
            onChange={(v) => onField("disclaimer", v)}
            placeholder="Opcional. Aparece en letra pequeña al final de la firma."
            rows={3}
          />
        </div>
      </div>
    </Panel>
  );
}
