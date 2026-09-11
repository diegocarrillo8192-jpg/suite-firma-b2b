import { Clipboard, FileText, Save } from "lucide-react";

export default function ActionBar({
  copied,
  onCopyHTML,
  onCopyRTF,
  onDownloadHTML,
  onDownloadText,
}: {
  copied: "html" | "rtf" | null;
  onCopyHTML: () => void;
  onCopyRTF: () => void;
  onDownloadHTML: () => void;
  onDownloadText: () => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button
        onClick={onCopyHTML}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-transform hover:scale-[1.02] active:scale-95"
      >
        <Clipboard className="h-4 w-4" />
        {copied === "html" ? "¡Copiado!" : "Copiar como HTML"}
      </button>
      <button
        onClick={onCopyRTF}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/40 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-indigo-400/60 hover:text-white"
      >
        <FileText className="h-4 w-4" />
        {copied === "rtf" ? "¡Copiado!" : "Copiar como texto enriquecido"}
      </button>
      <button
        onClick={onDownloadHTML}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/40 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-indigo-400/60 hover:text-white"
      >
        <Save className="h-4 w-4" />
        Descargar HTML
      </button>
      <button
        onClick={onDownloadText}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/40 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-indigo-400/60 hover:text-white"
      >
        <Save className="h-4 w-4" />
        Descargar TXT
      </button>
    </div>
  );
}
