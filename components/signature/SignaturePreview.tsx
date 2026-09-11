import { FileText } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { sanitizeSignatureHTML } from "@/lib/sanitize";
import CardHeader from "./CardHeader";

export default function SignaturePreview({ html }: { html: string }) {
  return (
    <GlassCard>
      <CardHeader icon={FileText} title="Vista previa" />
      <div className="p-5">
        <div className="rounded-xl bg-white p-5 shadow-inner">
          <div dangerouslySetInnerHTML={{ __html: sanitizeSignatureHTML(html) }} />
        </div>
        <p className="mt-4 rounded-lg border border-white/10 bg-slate-950/40 px-4 py-3 text-xs leading-relaxed text-slate-400">
          <span className="font-semibold text-indigo-300">Consejo:</span> si tu correo es de
          Outlook, usa{" "}
          <span className="font-semibold text-slate-200">
            Copiar como texto enriquecido
          </span>{" "}
          para que el formato se conserve perfectamente.
        </p>
      </div>
    </GlassCard>
  );
}
