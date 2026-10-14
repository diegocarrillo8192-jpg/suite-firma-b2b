import { safeAccent } from "./colors";
import {
  FONTS,
  defaultData,
  defaultSettings,
  isEmbedded,
  isTemplateId,
  safeHref,
  type SignatureData,
  type SignatureSettings,
} from "./templates";

export interface SignatureProfile {
  data: SignatureData;
  settings: SignatureSettings;
}

export const PROFILE_KEY = "suite-firma:perfil:v2";
export const PROFILE_FILE_VERSION = 2;

export const emptyProfile = (): SignatureProfile => ({
  data: { ...defaultData },
  settings: { ...defaultSettings },
});

const clamp = (n: unknown, min: number, max: number, fallback: number) =>
  typeof n === "number" && Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback;

/** Normaliza un perfil desconocido (localStorage o archivo importado). */
export function normalizeProfile(input: unknown): SignatureProfile | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as { data?: Record<string, unknown>; settings?: Record<string, unknown> };
  if (!raw.data || typeof raw.data !== "object") return null;

  const data = { ...defaultData };
  for (const key of Object.keys(defaultData) as Array<keyof SignatureData>) {
    const v = raw.data[key];
    if (typeof v === "string") data[key] = v.slice(0, key.endsWith("Url") ? 400_000 : 2_000);
  }

  const s = raw.settings ?? {};
  const settings: SignatureSettings = {
    templateId: isTemplateId(s.templateId) ? s.templateId : defaultSettings.templateId,
    accent: typeof s.accent === "string" ? safeAccent(s.accent) : defaultSettings.accent,
    font: FONTS.some((f) => f.id === s.font) ? (s.font as SignatureSettings["font"]) : defaultSettings.font,
    showFoto: typeof s.showFoto === "boolean" ? s.showFoto : defaultSettings.showFoto,
    showLogo: typeof s.showLogo === "boolean" ? s.showLogo : defaultSettings.showLogo,
    showFirma: typeof s.showFirma === "boolean" ? s.showFirma : defaultSettings.showFirma,
    logoWidth: clamp(s.logoWidth, 60, 220, defaultSettings.logoWidth),
    firmaWidth: clamp(s.firmaWidth, 100, 260, defaultSettings.firmaWidth),
  };
  return { data, settings };
}

/* ------------------------------------------------------------------ */
/* Puntaje de calidad                                                  */
/* ------------------------------------------------------------------ */

export interface QualityCheck {
  id: string;
  label: string;
  ok: boolean;
  tip: string;
  /** Advertencia (no bloquea, pero conviene revisarla). */
  warn?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isValidEmail = (v: string) => EMAIL_RE.test(v.trim());

export function qualityChecks({ data, settings }: SignatureProfile): QualityCheck[] {
  const v = (k: keyof SignatureData) => data[k].trim();
  const socialCount = (["linkedin", "instagram", "facebook", "twitter", "youtube", "tiktok"] as const).filter(
    (k) => v(k),
  ).length;
  const images = [
    settings.showFoto && v("fotoUrl"),
    settings.showLogo && v("logoUrl"),
    settings.showFirma && v("firmaUrl"),
  ].filter(Boolean) as string[];

  return [
    {
      id: "nombre",
      label: "Nombre completo",
      ok: v("nombre").split(/\s+/).filter(Boolean).length >= 2,
      tip: "Escribe nombre y apellido.",
    },
    {
      id: "cargo",
      label: "Cargo y empresa",
      ok: Boolean(v("cargo") && v("empresa")),
      tip: "Indica tu puesto y la empresa para generar confianza.",
    },
    {
      id: "contacto",
      label: "Email válido",
      ok: isValidEmail(v("email")),
      tip: "Agrega un correo con formato nombre@empresa.com.",
    },
    {
      id: "telefono",
      label: "Teléfono o WhatsApp",
      ok: Boolean(v("telefono") || v("whatsapp")),
      tip: "Un canal directo aumenta la tasa de respuesta.",
    },
    {
      id: "logo",
      label: "Logo de la empresa",
      ok: Boolean(v("logoUrl")) && settings.showLogo,
      tip: "Sube el logo para reforzar tu marca.",
    },
    {
      id: "redes",
      label: "Redes sociales (máx. 4)",
      ok: socialCount > 0 && socialCount <= 4,
      tip: socialCount > 4 ? "Más de 4 redes satura la firma." : "Enlaza al menos LinkedIn.",
    },
    {
      id: "gmail",
      label: "Imágenes compatibles con Gmail",
      ok: images.every((src) => !isEmbedded(src)),
      warn: true,
      tip: "Gmail no muestra imágenes subidas desde tu equipo: usa una URL pública (https://…).",
    },
    {
      id: "cta",
      label: "Botón de acción con enlace",
      ok: !v("ctaTexto") || Boolean(safeHref(v("ctaUrl"))),
      tip: "Tu botón necesita una URL (ej. calendly.com/tu-agenda).",
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Avisos legales                                                      */
/* ------------------------------------------------------------------ */

export const DISCLAIMERS = [
  {
    id: "confidencial",
    name: "Confidencialidad",
    text: "Este mensaje y sus anexos son confidenciales y de uso exclusivo de su destinatario. Si lo recibió por error, notifique al remitente y elimínelo. Queda prohibida su divulgación, copia o distribución sin autorización.",
  },
  {
    id: "datos-pa",
    name: "Datos personales (Panamá)",
    text: "Sus datos personales son tratados conforme a la Ley 81 de 2019 de Protección de Datos Personales de la República de Panamá. Puede ejercer sus derechos de acceso, rectificación, cancelación, oposición y portabilidad respondiendo a este correo.",
  },
  {
    id: "ambiental",
    name: "Ambiental",
    text: "Antes de imprimir este correo, piensa en tu compromiso con el medio ambiente.",
  },
] as const;
