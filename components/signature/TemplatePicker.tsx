import { Check, Sparkles } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { templates } from "@/lib/templates";
import CardHeader from "./CardHeader";

export default function TemplatePicker({
  templateId,
  onSelect,
}: {
  templateId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <GlassCard>
      <CardHeader icon={Sparkles} title="Plantillas" />
      <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
        {templates.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.id)}
            className={`group relative rounded-xl border p-4 text-left transition-colors ${
              templateId === t.id
                ? "border-indigo-400 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                : "border-white/10 bg-slate-950/40 hover:border-white/25"
            }`}
          >
            <div className="h-1.5 w-16 rounded-full" style={{ background: t.swatch }} />
            <div
              className={`mt-3 flex items-center justify-between text-sm font-semibold ${
                templateId === t.id ? "text-indigo-300" : "text-slate-200"
              }`}
            >
              {t.name}
              {templateId === t.id && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500">
                  <Check className="h-3 w-3 text-white" />
                </span>
              )}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{t.description}</p>
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
