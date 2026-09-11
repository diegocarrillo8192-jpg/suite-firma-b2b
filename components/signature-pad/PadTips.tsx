import { Eraser } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

export default function PadTips() {
  return (
    <GlassCard className="flex items-start gap-3 p-5">
      <Eraser size={18} className="mt-0.5 shrink-0 text-indigo-400" />
      <div className="text-sm leading-relaxed text-slate-400">
        <span className="font-semibold text-slate-200">Consejos:</span> la firma se exporta{" "}
        <span className="text-slate-200">recortada y sin fondo</span> (transparencia real) a 3× de
        resolución, ideal para insertar en documentos, PDFs o tu firma de correo. El lienzo usa
        trazado suavizado y eventos coalescidos para que el trazo con el dedo sea fluido y
        preciso en cualquier pantalla. Usa <span className="text-slate-200">blanco</span> para
        firmar sobre fondos oscuros.
      </div>
    </GlassCard>
  );
}
