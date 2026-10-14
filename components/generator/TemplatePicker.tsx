import { useMemo } from "react";
import { LayoutTemplate } from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import type { SignatureProfile } from "@/lib/profile";
import { buildSignatureHTML, templates, type TemplateId } from "@/lib/templates";

/** Galería con miniaturas reales de cada plantilla usando los datos actuales. */
export default function TemplatePicker({
  profile,
  value,
  onSelect,
}: {
  profile: SignatureProfile;
  value: TemplateId;
  onSelect: (id: TemplateId) => void;
}) {
  const thumbs = useMemo(
    () =>
      templates.map((t) => ({
        ...t,
        // Sin enlaces: la miniatura vive dentro de un botón.
        html: buildSignatureHTML(profile.data, { ...profile.settings, templateId: t.id }, { preview: true })
          .replace(/<a\b/g, "<span")
          .replace(/<\/a>/g, "</span>"),
      })),
    [profile],
  );

  return (
    <Panel>
      <PanelHeader
        step="01"
        icon={LayoutTemplate}
        title="Elige tu plantilla"
        description="Las miniaturas usan tus datos en tiempo real."
      />
      <div role="radiogroup" aria-label="Plantillas" className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 sm:p-6">
        {thumbs.map((t) => {
          const active = value === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(t.id)}
              className={`group relative overflow-hidden rounded-xl text-left transition-all duration-200 ${
                active
                  ? "ring-2 ring-gold-400 ring-offset-2 ring-offset-[#070a14]"
                  : "ring-1 ring-white/10 hover:ring-white/30"
              }`}
            >
              <div className="pointer-events-none relative h-[104px] overflow-hidden bg-white">
                <div
                  aria-hidden
                  className="absolute left-0 top-0 w-[600px] origin-top-left scale-[0.42] [&_*]:!cursor-default"
                  dangerouslySetInnerHTML={{ __html: t.html }}
                />
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent" />
              </div>
              <div className={`flex items-start justify-between gap-2 px-3 py-2.5 ${active ? "bg-gold-400/[0.08]" : "bg-white/[0.02]"}`}>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] font-semibold text-white">
                    {t.name}
                    {t.tag && (
                      <span className="rounded-full bg-gold-400/15 px-1.5 py-px text-[9px] font-semibold uppercase tracking-wider text-gold-300">
                        {t.tag}
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-[10.5px] leading-snug text-slate-500">
                    {t.description}
                  </span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}
