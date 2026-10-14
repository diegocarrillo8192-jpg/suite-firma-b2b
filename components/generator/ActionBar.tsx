"use client";

import { useState } from "react";
import { BookOpen, Check, CodeXml, Copy, FileDown, FileText, Mail } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { useToast } from "@/components/ui/Toast";
import { copyPlainText, copySignatureHTML, copySignatureRichText } from "@/lib/clipboard";
import { downloadText } from "@/lib/images";
import type { SignatureProfile } from "@/lib/profile";
import { buildSignatureRTF } from "@/lib/rtf";
import { buildPlainText, buildSignatureDocument, buildSignatureHTML } from "@/lib/templates";

type Done = "html" | "rtf" | "code" | null;

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "firma";

export default function ActionBar({
  profile,
  onOpenManual,
}: {
  profile: SignatureProfile;
  onOpenManual: () => void;
}) {
  const toast = useToast();
  const [done, setDone] = useState<Done>(null);
  const { data, settings } = profile;
  const empty = !data.nombre.trim() && !data.email.trim() && !data.empresa.trim();

  const flash = (kind: Done) => {
    setDone(kind);
    setTimeout(() => setDone((d) => (d === kind ? null : d)), 2200);
  };

  // Siempre se exporta sin textos de ejemplo.
  const exportHtml = () => buildSignatureHTML(data, settings);

  const guard = () => {
    if (empty) {
      toast("Completa al menos tu nombre, empresa o correo", "error");
      return false;
    }
    return true;
  };

  const copyHtml = async () => {
    if (!guard()) return;
    const ok = await copySignatureHTML(exportHtml(), buildPlainText(data));
    if (ok) flash("html");
    toast(ok ? "Firma copiada. Pégala en Gmail, Apple Mail u Outlook web" : "Tu navegador bloqueó el portapapeles", ok ? "success" : "error");
  };

  const copyRtf = async () => {
    if (!guard()) return;
    const ok = await copySignatureRichText(exportHtml(), buildSignatureRTF(data, settings.accent), buildPlainText(data));
    if (ok) flash("rtf");
    toast(ok ? "Copiada para Outlook escritorio y Word" : "Tu navegador bloqueó el portapapeles", ok ? "success" : "error");
  };

  const copyCode = async () => {
    if (!guard()) return;
    const ok = await copyPlainText(exportHtml());
    if (ok) flash("code");
    toast(ok ? "Código HTML copiado" : "No se pudo copiar el código", ok ? "success" : "error");
  };

  const name = slug(data.nombre || data.empresa);

  const downloadHtm = () => {
    if (!guard()) return;
    downloadText(buildSignatureDocument(exportHtml(), `Firma · ${data.nombre}`), `firma-${name}.htm`, "text/html");
    toast("Archivo .htm descargado");
  };

  const downloadTxt = () => {
    if (!guard()) return;
    downloadText(buildPlainText(data), `firma-${name}.txt`, "text/plain");
    toast("Versión de texto descargada");
  };

  return (
    <Panel className="p-5">
      <div className="grid gap-2.5 sm:grid-cols-2">
        <button type="button" onClick={copyHtml} className="btn-primary !py-3.5">
          {done === "html" ? <Check size={17} strokeWidth={2.6} /> : <Copy size={17} />}
          {done === "html" ? "¡Firma copiada!" : "Copiar firma"}
        </button>
        <button type="button" onClick={copyRtf} className="btn-ghost !py-3.5 !text-sm">
          {done === "rtf" ? <Check size={16} strokeWidth={2.6} /> : <Mail size={16} />}
          {done === "rtf" ? "¡Copiada!" : "Copiar para Outlook"}
        </button>
      </div>
      <div className="mt-2.5 grid grid-cols-3 gap-2">
        <button type="button" onClick={downloadHtm} className="btn-ghost !px-2 !text-xs" title="Archivo para Outlook escritorio">
          <FileDown size={14} /> .htm
        </button>
        <button type="button" onClick={downloadTxt} className="btn-ghost !px-2 !text-xs" title="Versión solo texto">
          <FileText size={14} /> .txt
        </button>
        <button type="button" onClick={copyCode} className="btn-ghost !px-2 !text-xs" title="Copiar el código fuente HTML">
          {done === "code" ? <Check size={14} /> : <CodeXml size={14} />} HTML
        </button>
      </div>
      <button
        type="button"
        onClick={onOpenManual}
        className="mt-4 flex w-full items-center justify-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-white"
      >
        <BookOpen size={13} />
        ¿Cómo la instalo en Gmail u Outlook? Ver manual paso a paso
      </button>
    </Panel>
  );
}
