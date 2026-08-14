"use client";

import { useCallback, useRef, useState } from "react";
import {
  Briefcase,
  Building2,
  Check,
  Clipboard,
  FileText,
  Globe,
  Link2,
  Loader2,
  Mail,
  Palette,
  Phone,
  RotateCcw,
  Save,
  Sparkles,
  Upload,
  User,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Field from "@/components/ui/Field";
import {
  defaultData,
  buildPlainText,
  buildSignatureHTML,
  templates,
  type SignatureData,
} from "@/lib/templates";
import { buildSignatureRTF } from "@/lib/rtf";
import { BRAND_SWATCHES, DEFAULT_ACCENT, safeAccent } from "@/lib/colors";
import { copySignatureHTML, copySignatureRichText } from "@/lib/clipboard";

function CardHeader({ icon: Icon, title }: { icon: typeof User; title: string }) {
  return (
    <div className="flex items-center gap-2 px-5 pt-4">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
        <Icon size={15} strokeWidth={2.2} />
      </span>
      <h2 className="text-sm font-bold text-white">{title}</h2>
    </div>
  );
}

export default function SignatureGenerator() {
  const [data, setData] = useState<SignatureData>(defaultData);
  const [templateId, setTemplateId] = useState(templates[0].id);
  const [accent, setAccent] = useState(DEFAULT_ACCENT);
  const [copied, setCopied] = useState<"html" | "rtf" | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const avatarSrc = data.fotoUrl;
  const html = buildSignatureHTML(data, templateId, avatarSrc ?? "", accent);
  const rtf = buildSignatureRTF(data);

  const showToast = (kind: "html" | "rtf") => {
    setCopied(kind);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setCopied(null), 2200);
  };

  const setField = <K extends keyof SignatureData>(key: K, value: SignatureData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const handleImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageLoading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Lectura fallida"));
        reader.readAsDataURL(file);
      });
      setField("fotoUrl", dataUrl);
    } catch (err) {
      console.error("Error al procesar la imagen:", err);
    } finally {
      setImageLoading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }, []);

  const handleCopyHTML = async () => {
    const ok = await copySignatureHTML(html, buildPlainText(data));
    if (ok) showToast("html");
  };

  const handleCopyRTF = async () => {
    const ok = await copySignatureRichText(html, rtf, buildPlainText(data));
    if (ok) showToast("rtf");
  };

  const handleDownloadHTML = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "firma-correo.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadText = () => {
    const blob = new Blob([buildPlainText(data)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "firma-correo.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section>
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          <GlassCard>
            <CardHeader icon={User} title="Datos de contacto" />
            <div className="space-y-3 p-5">
              <Field
                label="Nombre completo"
                icon={User}
                value={data.nombre}
                onChange={(v) => setField("nombre", v)}
                placeholder="Nombre completo"
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                  label="Puesto"
                  icon={Briefcase}
                  value={data.cargo}
                  onChange={(v) => setField("cargo", v)}
                  placeholder="Puesto"
                />
                <Field
                  label="Empresa"
                  icon={Building2}
                  value={data.empresa}
                  onChange={(v) => setField("empresa", v)}
                  placeholder="Empresa"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                  label="Teléfono"
                  icon={Phone}
                  value={data.telefono}
                  onChange={(v) => setField("telefono", v)}
                  placeholder="Teléfono"
                />
                <Field
                  label="Correo"
                  icon={Mail}
                  type="email"
                  value={data.email}
                  onChange={(v) => setField("email", v)}
                  placeholder="Correo"
                />
              </div>
              <Field
                label="Sitio web"
                icon={Globe}
                value={data.web}
                onChange={(v) => setField("web", v)}
                placeholder="Sitio web"
              />
              <div>
                <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
                  <Upload size={13} strokeWidth={2.2} className="text-indigo-400" />
                  Logo o foto (URL)
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2.5 transition-all duration-200 focus-within:border-indigo-500/70 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]">
                  <input
                    type="text"
                    value={data.fotoUrl}
                    onChange={(e) => setField("fotoUrl", e.target.value)}
                    placeholder="https://…/logo.png"
                    className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                  />
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={imageLoading}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/40 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-indigo-400/60 hover:text-white disabled:opacity-50"
                  >
                    {imageLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Subir archivo
                  </button>
                  {avatarSrc && (
                    <button
                      type="button"
                      onClick={() => setField("fotoUrl", "")}
                      className="text-xs font-medium text-red-400 transition-colors hover:text-red-300"
                    >
                      Quitar
                    </button>
                  )}
                </div>
                <span className="mt-1 block text-[11px] text-slate-500">
                  Pega la URL directa o sube un PNG/JPG · Se recorta en círculo
                </span>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <CardHeader icon={Palette} title="Color de marca" />
            <div className="p-5">
              <p className="text-xs leading-relaxed text-slate-400">
                Se aplica solo a líneas divisoras, íconos de contacto y redes sociales. El texto
                siempre permanece legible.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                {BRAND_SWATCHES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAccent(c)}
                    aria-label={`Color ${c}`}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110 ${
                      accent === c
                        ? "ring-2 ring-white ring-offset-2 ring-offset-slate-950"
                        : "ring-1 ring-white/20"
                    }`}
                    style={{ backgroundColor: c }}
                  >
                    {accent === c && <Check className="h-4 w-4 text-white" />}
                  </button>
                ))}
                <label className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-dashed border-white/25 text-slate-400 transition-colors hover:border-white/60 hover:text-white">
                  <input
                    type="color"
                    value={accent}
                    onChange={(e) => setAccent(safeAccent(e.target.value))}
                    className="h-0 w-0 opacity-0"
                    aria-label="Color personalizado"
                  />
                  <Palette size={15} />
                </label>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
                  {accent.toUpperCase()}
                </span>
                {accent !== DEFAULT_ACCENT && (
                  <button
                    type="button"
                    onClick={() => setAccent(DEFAULT_ACCENT)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-300 transition-colors hover:text-indigo-200"
                  >
                    <RotateCcw size={12} />
                    Restablecer
                  </button>
                )}
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <CardHeader icon={Link2} title="Redes sociales" />
            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
              <Field
                label="LinkedIn"
                value={data.linkedin}
                onChange={(v) => setField("linkedin", v)}
                placeholder="linkedin.com/in/usuario"
              />
              <Field
                label="Instagram"
                value={data.instagram}
                onChange={(v) => setField("instagram", v)}
                placeholder="instagram.com/usuario"
              />
              <Field
                label="Facebook"
                value={data.facebook}
                onChange={(v) => setField("facebook", v)}
                placeholder="facebook.com/usuario"
              />
              <Field
                label="X / Twitter"
                value={data.twitter}
                onChange={(v) => setField("twitter", v)}
                placeholder="x.com/usuario"
              />
            </div>
          </GlassCard>
        </div>

        <div className="space-y-4 lg:col-span-7">
          <GlassCard>
            <CardHeader icon={Sparkles} title="Plantillas" />
            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplateId(t.id)}
                  className={`group relative rounded-xl border p-4 text-left transition-all ${
                    templateId === t.id
                      ? "border-indigo-400 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                      : "border-white/10 bg-slate-950/40 hover:border-white/25"
                  }`}
                >
                  <div className="h-1.5 w-16 rounded-full" style={{ background: t.swatch }} />
                  <div
                    className={`mt-3 flex items-center justify-between text-sm font-semibold ${
                      templateId === t.id ? "text-indigo-300" : "text-slate-200"
                    }`}
                  >
                    {t.name}
                    {templateId === t.id && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500">
                        <Check className="h-3 w-3 text-white" />
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{t.description}</p>
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <CardHeader icon={FileText} title="Vista previa" />
            <div className="p-5">
              <div className="rounded-xl bg-white p-5 shadow-inner">
                <div dangerouslySetInnerHTML={{ __html: html }} />
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
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={handleCopyHTML}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-transform hover:scale-[1.02] active:scale-95"
        >
          <Clipboard className="h-4 w-4" />
          {copied === "html" ? "¡Copiado!" : "Copiar como HTML"}
        </button>
        <button
          onClick={handleCopyRTF}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/40 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-indigo-400/60 hover:text-white"
        >
          <FileText className="h-4 w-4" />
          {copied === "rtf" ? "¡Copiado!" : "Copiar como texto enriquecido"}
        </button>
        <button
          onClick={handleDownloadHTML}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/40 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-indigo-400/60 hover:text-white"
        >
          <Save className="h-4 w-4" />
          Descargar HTML
        </button>
        <button
          onClick={handleDownloadText}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/40 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-indigo-400/60 hover:text-white"
        >
          <Save className="h-4 w-4" />
          Descargar TXT
        </button>
      </div>
    </section>
  );
}