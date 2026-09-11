import { Sparkles } from "lucide-react";

export default function GeneratorHeader() {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 shadow-lg shadow-indigo-500/25">
        <Sparkles className="h-5 w-5 text-white" />
      </div>
      <div>
        <h1 className="text-lg font-bold text-white">Generador de Firmas</h1>
        <p className="text-xs text-slate-400">
          Crea tu firma profesional de correo con estilos corporativos
        </p>
      </div>
    </div>
  );
}
