import { Lock } from "lucide-react";
import { scrollToWorkspace, type TabId } from "@/components/hooks";
import BrandMark from "./BrandMark";
import { TABS } from "./TabBar";

export default function SiteHeader({ tab, onTab }: { tab: TabId; onTab: (id: TabId) => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#04060c]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2.5" aria-label="Suite Firma B2B, inicio">
          <BrandMark size={34} />
          <span className="leading-tight">
            <span className="block text-[15px] font-semibold tracking-tight text-white">
              Suite Firma <span className="text-gold">B2B</span>
            </span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Panamá · 2026
            </span>
          </span>
        </a>

        <nav aria-label="Secciones" className="ml-auto hidden items-center gap-1 md:flex">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                onTab(t.id);
                scrollToWorkspace();
              }}
              aria-current={tab === t.id ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                tab === t.id ? "bg-white/[0.07] text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {t.short}
            </button>
          ))}
        </nav>

        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-[11px] font-medium text-emerald-200 md:ml-2">
          <Lock size={12} />
          <span className="hidden sm:inline">100% privado ·</span> local
        </span>
      </div>
    </header>
  );
}
