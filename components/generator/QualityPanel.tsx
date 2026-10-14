import { CircleCheck, Gauge, TriangleAlert, Circle } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { qualityChecks, type SignatureProfile } from "@/lib/profile";

/** Puntaje de calidad de la firma con recomendaciones accionables. */
export default function QualityPanel({ profile }: { profile: SignatureProfile }) {
  const checks = qualityChecks(profile);
  const passed = checks.filter((c) => c.ok).length;
  const pending = checks.filter((c) => !c.ok);
  const score = Math.round((passed / checks.length) * 100);
  const level = score >= 85 ? "Excelente" : score >= 60 ? "Buena" : "Por completar";
  const color = score >= 85 ? "#34d399" : score >= 60 ? "#e8c98a" : "#60a5fa";
  const r = 26;
  const circ = 2 * Math.PI * r;

  return (
    <Panel className="p-5">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0">
          <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90" aria-hidden>
            <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
            <circle
              cx="32"
              cy="32"
              r={r}
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - score / 100)}
              style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.22,1,0.36,1)" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-semibold text-white">
            {score}
          </span>
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
            <Gauge size={12} /> Calidad de tu firma
          </p>
          <p className="mt-0.5 text-lg font-semibold text-white">{level}</p>
          <p className="text-xs text-slate-400">
            {passed} de {checks.length} recomendaciones cumplidas
          </p>
        </div>
      </div>

      {pending.length ? (
        <ul className="mt-4 grid gap-1">
          {pending.slice(0, 3).map((c) => (
            <li key={c.id} className="flex items-start gap-2.5 rounded-lg px-1 py-1 text-[12.5px]">
              {c.warn ? (
                <TriangleAlert size={15} className="mt-px shrink-0 text-amber-300" />
              ) : (
                <Circle size={15} className="mt-px shrink-0 text-slate-600" />
              )}
              <span className="min-w-0">
                <span className="text-slate-200">{c.label}</span>
                <span className="block text-[11px] leading-relaxed text-slate-500">{c.tip}</span>
              </span>
            </li>
          ))}
          {pending.length > 3 && (
            <li className="px-1 pt-1 text-[11px] text-slate-500">y {pending.length - 3} recomendación(es) más…</li>
          )}
        </ul>
      ) : (
        <p className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-400/[0.06] px-3 py-2 text-[12.5px] text-emerald-200">
          <CircleCheck size={15} className="shrink-0" />
          ¡Firma lista para impresionar! Cópiala e instálala.
        </p>
      )}
    </Panel>
  );
}
