import {
  AtSign,
  Briefcase,
  Building2,
  Globe,
  Layers,
  Link2,
  MapPin,
  MessageCircle,
  Phone,
  User,
} from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { Field } from "@/components/ui/Field";
import { formatPhonePA } from "@/lib/phone";
import { isValidEmail } from "@/lib/profile";
import { safeHref, type SignatureData } from "@/lib/templates";
import type { SetField } from "./types";

type Props = { data: SignatureData; onField: SetField };

const urlError = (v: string) => (v.trim() && !safeHref(v) ? "Usa una dirección web (ej. www.empresa.com)." : null);

export function PersonalPanel({ data, onField }: Props) {
  return (
    <Panel>
      <PanelHeader step="03" icon={User} title="Tus datos" description="Cómo te verán tus clientes." />
      <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
        <div className="sm:col-span-2">
          <Field
            label="Nombre completo"
            icon={User}
            value={data.nombre}
            onChange={(v) => onField("nombre", v)}
            placeholder="Ej. Andrés Morales"
            autoComplete="name"
            maxLength={80}
          />
        </div>
        <Field
          label="Cargo"
          icon={Briefcase}
          value={data.cargo}
          onChange={(v) => onField("cargo", v)}
          placeholder="Ej. Director Comercial"
          autoComplete="organization-title"
          maxLength={80}
        />
        <Field
          label="Departamento"
          icon={Layers}
          value={data.departamento}
          onChange={(v) => onField("departamento", v)}
          placeholder="Ej. Ventas Corporativas"
          optional
          maxLength={80}
        />
        <div className="sm:col-span-2">
          <Field
            label="Empresa"
            icon={Building2}
            value={data.empresa}
            onChange={(v) => onField("empresa", v)}
            placeholder="Ej. Grupo Istmo Logística, S.A."
            autoComplete="organization"
            maxLength={100}
          />
        </div>
      </div>
    </Panel>
  );
}

export function ContactPanel({ data, onField }: Props) {
  const emailError = data.email.trim() && !isValidEmail(data.email) ? "Revisa el formato: nombre@empresa.com" : null;
  const canCopyPhone = data.telefono.trim() && !data.whatsapp.trim();

  return (
    <Panel>
      <PanelHeader
        step="04"
        icon={Phone}
        title="Contacto"
        description="Los números de Panamá se formatean solos al salir del campo (+507)."
      />
      <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
        <Field
          label="Teléfono"
          icon={Phone}
          type="tel"
          inputMode="tel"
          value={data.telefono}
          onChange={(v) => onField("telefono", v)}
          onBlur={() => onField("telefono", formatPhonePA(data.telefono))}
          placeholder="Ej. 6000-0000"
          autoComplete="tel"
          maxLength={30}
        />
        <div>
          <Field
            label="WhatsApp"
            icon={MessageCircle}
            type="tel"
            inputMode="tel"
            value={data.whatsapp}
            onChange={(v) => onField("whatsapp", v)}
            onBlur={() => onField("whatsapp", formatPhonePA(data.whatsapp))}
            placeholder="Ej. 6000-0000"
            optional
            maxLength={30}
          />
          {canCopyPhone && (
            <button
              type="button"
              onClick={() => onField("whatsapp", data.telefono)}
              className="mt-1.5 text-[11px] font-medium text-blue-300 transition-colors hover:text-blue-200"
            >
              Usar el mismo número del teléfono
            </button>
          )}
        </div>
        <Field
          label="Correo"
          icon={AtSign}
          type="email"
          inputMode="email"
          value={data.email}
          onChange={(v) => onField("email", v)}
          placeholder="Ej. andres@empresa.com"
          autoComplete="email"
          error={emailError}
          maxLength={120}
        />
        <Field
          label="Sitio web"
          icon={Globe}
          inputMode="url"
          value={data.web}
          onChange={(v) => onField("web", v)}
          placeholder="Ej. www.empresa.com"
          autoComplete="url"
          error={urlError(data.web)}
          maxLength={120}
        />
        <div className="sm:col-span-2">
          <Field
            label="Dirección"
            icon={MapPin}
            value={data.direccion}
            onChange={(v) => onField("direccion", v)}
            placeholder="Ej. Torre BICSA, Piso 20, Ciudad de Panamá"
            hint="Se enlaza a Google Maps automáticamente."
            optional
            maxLength={140}
          />
        </div>
      </div>
    </Panel>
  );
}

const SOCIAL_FIELDS = [
  { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/usuario" },
  { key: "instagram", label: "Instagram", placeholder: "instagram.com/empresa" },
  { key: "facebook", label: "Facebook", placeholder: "facebook.com/empresa" },
  { key: "twitter", label: "X / Twitter", placeholder: "x.com/empresa" },
  { key: "youtube", label: "YouTube", placeholder: "youtube.com/@empresa" },
  { key: "tiktok", label: "TikTok", placeholder: "tiktok.com/@empresa" },
] as const;

export function SocialPanel({ data, onField }: Props) {
  const count = SOCIAL_FIELDS.filter((s) => data[s.key].trim()).length;
  return (
    <Panel>
      <PanelHeader
        step="05"
        icon={Link2}
        title="Redes sociales"
        description="Recomendado: máximo 4 para una firma limpia."
        action={
          <span
            className={`rounded-full px-2.5 py-1 font-mono text-[11px] ${
              count > 4 ? "bg-amber-400/10 text-amber-300" : "bg-white/5 text-slate-400"
            }`}
          >
            {count}/6
          </span>
        }
      />
      <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
        {SOCIAL_FIELDS.map((s) => (
          <Field
            key={s.key}
            label={s.label}
            inputMode="url"
            value={data[s.key]}
            onChange={(v) => onField(s.key, v)}
            placeholder={s.placeholder}
            error={urlError(data[s.key])}
            maxLength={160}
          />
        ))}
      </div>
    </Panel>
  );
}
