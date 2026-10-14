"use client";

import { useState } from "react";
import { Check, Copy, Download, FileCode, Loader2, Mail } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { copyImageToClipboard, downloadText, downloadURL, timestamp } from "@/lib/images";

/** Acciones comunes del estudio: descargar, copiar y enviar a la firma de correo. */
export default function ResultActions({
  getPng,
  getSvg,
  disabled,
  onUseInEmail,
  filename,
}: {
  getPng: () => Promise<string | null> | string | null;
  getSvg?: () => string | null;
  disabled: boolean;
  onUseInEmail: (dataUrl: string) => void;
  filename: string;
}) {
  const toast = useToast();
  const [busy, setBusy] = useState<"png" | "copy" | "email" | null>(null);
  const [saved, setSaved] = useState(false);

  const run = async (kind: "png" | "copy" | "email") => {
    setBusy(kind);
    try {
      const png = await getPng();
      if (!png) {
        toast("Primero crea tu firma", "error");
        return;
      }
      if (kind === "png") {
        downloadURL(png, `${filename}-${timestamp()}.png`);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        toast("PNG transparente en alta resolución descargado");
      } else if (kind === "copy") {
        const ok = await copyImageToClipboard(png);
        toast(
          ok ? "Imagen copiada: pégala en Word, Docs o tu PDF" : "Tu navegador no permite copiar imágenes; usa Descargar",
          ok ? "success" : "error",
        );
      } else {
        onUseInEmail(png);
      }
    } finally {
      setBusy(null);
    }
  };

  const downloadSvg = () => {
    const svg = getSvg?.();
    if (!svg) return;
    downloadText(svg, `${filename}-${timestamp()}.svg`, "image/svg+xml");
    toast("SVG vectorial descargado");
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button type="button" onClick={() => run("email")} disabled={disabled || busy !== null} className="btn-primary btn-gold">
        {busy === "email" ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
        Usar en mi firma de correo
      </button>
      <button type="button" onClick={() => run("png")} disabled={disabled || busy !== null} className="btn-primary">
        {saved ? <Check size={16} strokeWidth={2.6} /> : <Download size={16} />}
        <span className="hidden sm:inline">Descargar</span> PNG HD
      </button>
      <button type="button" onClick={() => run("copy")} disabled={disabled || busy !== null} className="btn-ghost">
        <Copy size={15} /> Copiar imagen
      </button>
      {getSvg && (
        <button type="button" onClick={downloadSvg} disabled={disabled} className="btn-ghost" title="Formato vectorial, escalable sin pérdida">
          <FileCode size={15} /> SVG
        </button>
      )}
    </div>
  );
}
