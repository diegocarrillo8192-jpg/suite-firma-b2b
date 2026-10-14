import { ShieldCheck } from "lucide-react";
import { scrollToWorkspace, type TabId } from "@/components/hooks";
import BrandMark from "./BrandMark";
import { TABS } from "./TabBar";

export default function SiteFooter({ onTab }: { onTab: (id: TabId) => void }) {
  return (
    <footer className="relative mt-24 border-t border-white/[0.06]">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <BrandMark size={30} />
            <span className="text-[15px] font-semibold text-white">
              Suite Firma <span className="text-gold">B2B</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
            Firmas de correo y firmas manuscritas digitales para empresas que cuidan cada detalle de su
            marca.
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Herramientas</p>
          <ul className="mt-4 space-y-2.5">
            {TABS.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => {
                    onTab(t.id);
                    scrollToWorkspace();
                  }}
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {t.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Privacidad</p>
          <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-slate-400">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald-400" />
            Todo se procesa en tu navegador. Tus datos, imágenes y firmas nunca se envían a ningún servidor.
          </p>
        </div>
      </div>
      <div className="border-t border-white/[0.04]">
        <p className="mx-auto w-full max-w-7xl px-4 py-5 text-xs text-slate-600 sm:px-6">
          © 2026 Suite Firma B2B · Diseñado en Panamá 🇵🇦
        </p>
      </div>
    </footer>
  );
}
