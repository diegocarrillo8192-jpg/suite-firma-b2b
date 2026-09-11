import { useRef } from "react";
import {
  Briefcase,
  Building2,
  Globe,
  Loader2,
  Mail,
  Phone,
  Upload,
  User,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Field from "@/components/ui/Field";
import type { SignatureData } from "@/lib/templates";
import CardHeader from "./CardHeader";
import type { SetSignatureField } from "./types";

export default function ContactFields({
  data,
  onField,
  onImageFile,
  onRemoveImage,
  imageLoading,
  hasAvatar,
}: {
  data: SignatureData;
  onField: SetSignatureField;
  onImageFile: (file: File) => void;
  onRemoveImage: () => void;
  imageLoading: boolean;
  hasAvatar: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageFile(file);
    e.target.value = "";
  };

  return (
    <GlassCard>
      <CardHeader icon={User} title="Datos de contacto" />
      <div className="space-y-3 p-5">
        <Field
          label="Nombre completo"
          icon={User}
          value={data.nombre}
          onChange={(v) => onField("nombre", v)}
          placeholder="Ej. Juan Pérez"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            label="Puesto"
            icon={Briefcase}
            value={data.cargo}
            onChange={(v) => onField("cargo", v)}
            placeholder="Ej. Gerente General"
          />
          <Field
            label="Empresa"
            icon={Building2}
            value={data.empresa}
            onChange={(v) => onField("empresa", v)}
            placeholder="Ej. Mi Empresa S.A."
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            label="Teléfono"
            icon={Phone}
            value={data.telefono}
            onChange={(v) => onField("telefono", v)}
            placeholder="Ej. +507 6000-0000"
          />
          <Field
            label="Correo"
            icon={Mail}
            type="email"
            value={data.email}
            onChange={(v) => onField("email", v)}
            placeholder="Ej. usuario@empresa.com"
          />
        </div>
        <Field
          label="Sitio web"
          icon={Globe}
          value={data.web}
          onChange={(v) => onField("web", v)}
          placeholder="Ej. www.empresa.com"
        />
        <div>
          <label
            htmlFor="signature-photo-url"
            className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400"
          >
            <Upload size={13} strokeWidth={2.2} className="text-indigo-400" />
            Logo o foto (URL)
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2.5 transition-colors duration-200 focus-within:border-indigo-500/70 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]">
            <input
              id="signature-photo-url"
              type="text"
              value={data.fotoUrl}
              onChange={(e) => onField("fotoUrl", e.target.value)}
              placeholder="https://…/logo.png"
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
          <div className="mt-2 flex items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFile}
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
            {hasAvatar && (
              <button
                type="button"
                onClick={onRemoveImage}
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
  );
}
