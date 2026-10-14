import { BookOpen, Mail, Signature } from "lucide-react";
import type { TabId } from "@/components/hooks";

export const TABS = [
  {
    id: "firma-correo",
    icon: Mail,
    title: "Firma de correo",
    short: "Firma de correo",
    subtitle: "Gmail · Outlook · Apple Mail",
  },
  {
    id: "firma-manuscrita",
    icon: Signature,
    title: "Firma manuscrita",
    short: "Firma a mano",
    subtitle: "Dibujar · Escribir · Subir foto",
  },
  {
    id: "manual",
    icon: BookOpen,
    title: "Manual de uso",
    short: "Manual",
    subtitle: "Guía paso a paso",
  },
] as const satisfies ReadonlyArray<{ id: TabId; [k: string]: unknown }>;

export default function TabBar({ tab, onTab }: { tab: TabId; onTab: (id: TabId) => void }) {
  return (
    <div role="tablist" aria-label="Herramientas" className="grid grid-cols-3 gap-2 sm:gap-3">
      {TABS.map((t) => {
        const Icon = t.icon;
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={active}
            aria-controls={`panel-${t.id}`}
            onClick={() => onTab(t.id)}
            className={`group relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl px-2 py-3.5 text-center transition-all duration-300 sm:flex-row sm:gap-3.5 sm:px-5 sm:py-4 sm:text-left ${
              active ? "panel panel-gold" : "border border-white/[0.06] bg-white/[0.015] hover:border-white/15 hover:bg-white/[0.03]"
            }`}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
                active
                  ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-900/60"
                  : "bg-white/[0.04] text-slate-400 group-hover:text-slate-200"
              }`}
            >
              <Icon size={19} />
            </span>
            <span className="min-w-0">
              <span
                className={`block text-[12px] font-semibold leading-tight sm:text-sm ${active ? "text-white" : "text-slate-300"}`}
              >
                <span className="sm:hidden">{t.short}</span>
                <span className="hidden sm:inline">{t.title}</span>
              </span>
              <span className="mt-0.5 hidden text-[11px] text-slate-500 sm:block">{t.subtitle}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
