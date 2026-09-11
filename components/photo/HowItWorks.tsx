import { Sparkles } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

export default function HowItWorks() {
  return (
    <GlassCard className="flex items-start gap-3 p-5">
      <Sparkles size={18} className="mt-0.5 shrink-0 text-emerald-400" />
      <div className="text-sm leading-relaxed text-slate-400">
        <span className="font-semibold text-slate-200">Cómo funciona:</span> la imagen se
        convierte a escala de grises, se aplica contraste y el{" "}
        <span className="text-slate-200">umbral automático de Otsu</span> separa la tinta del
        fondo. El resultado queda con <span className="text-slate-200">transparencia real</span>{" "}
        (canal alfa) y bordes suavizados. Si el fondo es muy sucio, sube el contraste o cambia a
        umbral manual.
      </div>
    </GlassCard>
  );
}
