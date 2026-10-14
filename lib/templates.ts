import { sanitizeSignatureHTML } from "./sanitize";
import { contrastOnWhite, readableOn, safeAccent, DEFAULT_ACCENT } from "./colors";
import { telHref, whatsappHref } from "./phone";

/* ------------------------------------------------------------------ */
/* Modelo                                                              */
/* ------------------------------------------------------------------ */

export interface SignatureData {
  nombre: string;
  cargo: string;
  departamento: string;
  empresa: string;
  telefono: string;
  whatsapp: string;
  email: string;
  web: string;
  direccion: string;
  fotoUrl: string;
  logoUrl: string;
  firmaUrl: string;
  linkedin: string;
  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;
  tiktok: string;
  ctaTexto: string;
  ctaUrl: string;
  disclaimer: string;
}

export const defaultData: SignatureData = {
  nombre: "",
  cargo: "",
  departamento: "",
  empresa: "",
  telefono: "",
  whatsapp: "",
  email: "",
  web: "",
  direccion: "",
  fotoUrl: "",
  logoUrl: "",
  firmaUrl: "",
  linkedin: "",
  instagram: "",
  facebook: "",
  twitter: "",
  youtube: "",
  tiktok: "",
  ctaTexto: "",
  ctaUrl: "",
  disclaimer: "",
};

export const FONTS = [
  { id: "arial", name: "Arial", stack: "Arial, Helvetica, sans-serif" },
  { id: "verdana", name: "Verdana", stack: "Verdana, Geneva, sans-serif" },
  { id: "tahoma", name: "Tahoma", stack: "Tahoma, Geneva, sans-serif" },
  { id: "trebuchet", name: "Trebuchet", stack: "'Trebuchet MS', Helvetica, sans-serif" },
  { id: "georgia", name: "Georgia", stack: "Georgia, 'Times New Roman', serif" },
] as const;

export type FontId = (typeof FONTS)[number]["id"];

export const TEMPLATE_IDS = [
  "ejecutivo",
  "corporativa",
  "moderna",
  "manuscrita",
  "clasica",
  "minimal",
] as const;

export type TemplateId = (typeof TEMPLATE_IDS)[number];

export interface SignatureSettings {
  templateId: TemplateId;
  accent: string;
  font: FontId;
  showFoto: boolean;
  showLogo: boolean;
  showFirma: boolean;
  /** Ancho del logo en px (60–220). */
  logoWidth: number;
  /** Ancho de la firma manuscrita en px (100–260). */
  firmaWidth: number;
}

export const defaultSettings: SignatureSettings = {
  templateId: "ejecutivo",
  accent: DEFAULT_ACCENT,
  font: "arial",
  showFoto: true,
  showLogo: true,
  showFirma: true,
  logoWidth: 120,
  firmaWidth: 170,
};

export interface SignatureTemplate {
  id: TemplateId;
  name: string;
  description: string;
  tag?: string;
}

export const templates: SignatureTemplate[] = [
  {
    id: "ejecutivo",
    name: "Ejecutivo",
    description: "Foto circular, jerarquía clara y logo al pie.",
    tag: "Popular",
  },
  {
    id: "corporativa",
    name: "Corporativa B2B",
    description: "Logo protagonista con línea de marca vertical.",
  },
  {
    id: "moderna",
    name: "Panamá 2026",
    description: "Barra de marca, contacto en línea y franja inferior.",
    tag: "Nuevo",
  },
  {
    id: "manuscrita",
    name: "Firma Manuscrita",
    description: "Tu firma a mano como elemento principal.",
    tag: "Nuevo",
  },
  {
    id: "clasica",
    name: "Clásica Elegante",
    description: "Serif sobria con doble línea separadora.",
  },
  {
    id: "minimal",
    name: "Minimalista",
    description: "Solo texto, ligera y perfecta en móviles.",
  },
];

export function isTemplateId(v: unknown): v is TemplateId {
  return typeof v === "string" && (TEMPLATE_IDS as readonly string[]).includes(v);
}

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const trim = (s: string | undefined) => (s ?? "").trim();

/** URL navegable segura: añade https:// y descarta esquemas peligrosos. */
export function safeHref(u: string): string {
  const t = trim(u);
  if (!t) return "";
  if (/^(mailto:|tel:|https?:\/\/)/i.test(t)) return t;
  if (/^[a-z][a-z0-9+.-]*:/i.test(t)) return "";
  return `https://${t.replace(/^\/+/, "")}`;
}

/** Fuente de imagen segura: https o PNG/JPG/WEBP/GIF incrustado. */
export function safeImgSrc(u: string): string {
  const t = trim(u);
  if (!t) return "";
  if (/^data:image\/(png|jpe?g|webp|gif);base64,/i.test(t)) return t;
  if (/^https?:\/\//i.test(t)) return t;
  if (/^[\w-]+(\.[\w-]+)+\//.test(t)) return `https://${t}`;
  return "";
}

export const isEmbedded = (u: string) => trim(u).startsWith("data:");

const prettyUrl = (u: string) => trim(u).replace(/^https?:\/\//i, "").replace(/\/$/, "");

const initials = (name: string) => {
  const parts = trim(name).split(/\s+/).filter(Boolean);
  if (!parts.length) return "";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
};

const PLACEHOLDERS: Partial<Record<keyof SignatureData, string>> = {
  nombre: "Tu Nombre Apellido",
  cargo: "Cargo / Puesto",
  empresa: "Nombre de tu Empresa",
  telefono: "+507 6000-0000",
  email: "tu.correo@empresa.com",
  web: "www.empresa.com",
};

/* ------------------------------------------------------------------ */
/* Contexto de renderizado                                             */
/* ------------------------------------------------------------------ */

interface Ctx {
  d: SignatureData;
  s: SignatureSettings;
  accent: string;
  /** Acento apto para texto sobre blanco (si el acento es muy claro, gris). */
  accentText: string;
  onAccent: string;
  font: string;
  preview: boolean;
  foto: string;
  logo: string;
  firma: string;
}

function makeCtx(data: SignatureData, settings: SignatureSettings, preview: boolean): Ctx {
  const d = { ...defaultData } as SignatureData;
  for (const key of Object.keys(defaultData) as Array<keyof SignatureData>) {
    const v = trim(data[key]);
    d[key] = v || (preview ? (PLACEHOLDERS[key] ?? "") : "");
  }
  const accent = safeAccent(settings.accent);
  return {
    d,
    s: settings,
    accent,
    accentText: contrastOnWhite(accent) >= 3 ? accent : "#374151",
    onAccent: readableOn(accent),
    font: (FONTS.find((f) => f.id === settings.font) ?? FONTS[0]).stack,
    preview,
    foto: settings.showFoto ? safeImgSrc(data.fotoUrl) : "",
    logo: settings.showLogo ? safeImgSrc(data.logoUrl) : "",
    firma: settings.showFirma ? safeImgSrc(data.firmaUrl) : "",
  };
}

/** Estilo de texto inline con la fuente elegida. */
const t = (c: Ctx, size: number, color: string, extra = "") =>
  `font-family:${c.font}; font-size:${size}px; line-height:1.45; color:${color}; ${extra}`;

const link = (href: string, text: string, style: string) =>
  href
    ? `<a href="${esc(href)}" target="_blank" rel="noopener" style="${style} text-decoration:none;">${esc(text)}</a>`
    : `<span style="${style}">${esc(text)}</span>`;

const TABLE = `cellpadding="0" cellspacing="0" border="0" role="presentation"`;
const TABLE_STYLE = "border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;";

const roleLine = (c: Ctx) =>
  [c.d.cargo, c.d.departamento].filter(Boolean).map(esc).join(" &middot; ");

interface ContactItem {
  short: string;
  label: string;
  value: string;
  href: string;
}

function contactItems(c: Ctx): ContactItem[] {
  const { d } = c;
  const items: ContactItem[] = [];
  if (d.telefono) items.push({ short: "T", label: "Tel.", value: d.telefono, href: telHref(d.telefono) });
  if (d.whatsapp)
    items.push({ short: "WA", label: "WhatsApp", value: d.whatsapp, href: whatsappHref(d.whatsapp) });
  if (d.email) items.push({ short: "E", label: "Email", value: d.email, href: `mailto:${d.email}` });
  if (d.web) items.push({ short: "W", label: "Web", value: prettyUrl(d.web), href: safeHref(d.web) });
  if (d.direccion)
    items.push({
      short: "D",
      label: "Dirección",
      value: d.direccion,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.direccion)}`,
    });
  return items;
}

/** Contacto en filas: etiqueta en color de marca + valor legible. */
function contactTable(c: Ctx, labels: "short" | "long" = "short"): string {
  const items = contactItems(c);
  if (!items.length) return "";
  const rows = items
    .map(
      (it) => `
      <tr>
        <td valign="top" style="padding:2px 10px 2px 0; ${t(c, 11, c.accentText, "font-weight:bold; letter-spacing:0.5px; white-space:nowrap;")}">${labels === "short" ? it.short : it.label}</td>
        <td valign="top" style="padding:2px 0;">${link(it.href, it.value, t(c, 12, "#374151"))}</td>
      </tr>`,
    )
    .join("");
  return `<table ${TABLE} style="${TABLE_STYLE} margin-top:10px;">${rows}</table>`;
}

/** Contacto en línea separado por barras (plantillas compactas). */
function contactInline(c: Ctx, size = 12): string {
  const items = contactItems(c);
  if (!items.length) return "";
  return items
    .map(
      (it) =>
        `<span style="${t(c, size - 1, c.accentText, "font-weight:bold;")}">${it.short}</span>&nbsp;${link(it.href, it.value, t(c, size, "#374151"))}`,
    )
    .join(`<span style="${t(c, size, "#cbd5e1")}">&nbsp;&nbsp;|&nbsp;&nbsp;</span>`);
}

const SOCIALS: Array<{ key: keyof SignatureData; short: string; name: string }> = [
  { key: "linkedin", short: "in", name: "LinkedIn" },
  { key: "instagram", short: "IG", name: "Instagram" },
  { key: "facebook", short: "f", name: "Facebook" },
  { key: "twitter", short: "X", name: "X" },
  { key: "youtube", short: "YT", name: "YouTube" },
  { key: "tiktok", short: "TT", name: "TikTok" },
];

const socialList = (c: Ctx) =>
  SOCIALS.map((s) => ({ ...s, href: safeHref(c.d[s.key]) })).filter((s) => s.href);

/** Botones cuadrados de redes en celdas de tabla (compatibles con Outlook). */
function socialButtons(c: Ctx, marginTop = 12): string {
  const list = socialList(c);
  if (!list.length) return "";
  const cells = list
    .map(
      (s) => `
      <td width="24" height="24" align="center" valign="middle" bgcolor="${c.accent}" style="width:24px; height:24px; border-radius:6px; background-color:${c.accent};">
        <a href="${esc(s.href)}" target="_blank" rel="noopener" title="${s.name}" style="${t(c, 10, c.onAccent, "font-weight:bold; line-height:24px; display:block; text-decoration:none;")}">${s.short}</a>
      </td>
      <td width="6" style="width:6px; font-size:0; line-height:0;">&nbsp;</td>`,
    )
    .join("");
  return `<table ${TABLE} style="${TABLE_STYLE} margin-top:${marginTop}px;"><tr>${cells}</tr></table>`;
}

/** Redes como enlaces de texto (plantillas sobrias). */
function socialText(c: Ctx): string {
  const list = socialList(c);
  if (!list.length) return "";
  return `<div style="margin-top:10px; ${t(c, 12, "#9ca3af")}">${list
    .map((s) => link(s.href, s.name, t(c, 12, c.accentText, "font-weight:bold;")))
    .join("&nbsp;&nbsp;&middot;&nbsp;&nbsp;")}</div>`;
}

/** Botón de llamada a la acción "bulletproof". */
function ctaButton(c: Ctx, marginTop = 14): string {
  const text = c.d.ctaTexto;
  const href = safeHref(c.d.ctaUrl);
  if (!text || !href) return "";
  return `
  <table ${TABLE} style="${TABLE_STYLE} margin-top:${marginTop}px;">
    <tr>
      <td bgcolor="${c.accent}" style="background-color:${c.accent}; border-radius:8px; padding:8px 16px;">
        <a href="${esc(href)}" target="_blank" rel="noopener" style="${t(c, 12, c.onAccent, "font-weight:bold; text-decoration:none; display:inline-block;")}">${esc(text)}&nbsp;&rarr;</a>
      </td>
    </tr>
  </table>`;
}

function disclaimerBlock(c: Ctx): string {
  if (!c.d.disclaimer) return "";
  return `<div style="margin-top:14px; padding-top:10px; border-top:1px solid #e5e7eb; max-width:520px; ${t(c, 10, "#9ca3af", "line-height:1.5;")}">${esc(c.d.disclaimer).replace(/\n/g, "<br />")}</div>`;
}

function fotoImg(c: Ctx, size: number, radius: string): string {
  if (!c.s.showFoto) return "";
  if (c.foto) {
    return `<img src="${esc(c.foto)}" width="${size}" height="${size}" alt="${esc(c.d.nombre)}" style="display:block; width:${size}px; height:${size}px; border-radius:${radius}; border:0; outline:none; object-fit:cover;" />`;
  }
  const ini = initials(c.d.nombre);
  if (!ini) return "";
  return `
  <table ${TABLE} width="${size}" height="${size}" style="${TABLE_STYLE} width:${size}px; height:${size}px;">
    <tr>
      <td width="${size}" height="${size}" align="center" valign="middle" bgcolor="${c.accent}" style="width:${size}px; height:${size}px; border-radius:${radius}; background-color:${c.accent}; ${t(c, Math.round(size / 2.8), c.onAccent, "font-weight:bold; line-height:1;")}">${ini}</td>
    </tr>
  </table>`;
}

function logoImg(c: Ctx, width = c.s.logoWidth): string {
  if (!c.s.showLogo) return "";
  if (c.logo) {
    return `<img src="${esc(c.logo)}" width="${width}" alt="${esc(c.d.empresa || "Logo")}" style="display:block; width:${width}px; max-width:${width}px; height:auto; border:0; outline:none;" />`;
  }
  if (!c.preview) return "";
  return `<div style="width:${width}px; padding:9px 0; border:1px dashed #cbd5e1; border-radius:8px; text-align:center; ${t(c, 10, "#94a3b8", "font-weight:bold; letter-spacing:2px;")}">TU LOGO</div>`;
}

function firmaImg(c: Ctx, marginBottom = 6): string {
  if (!c.firma) return "";
  return `<img src="${esc(c.firma)}" width="${c.s.firmaWidth}" alt="Firma de ${esc(c.d.nombre)}" style="display:block; width:${c.s.firmaWidth}px; max-width:${c.s.firmaWidth}px; height:auto; border:0; outline:none; margin-bottom:${marginBottom}px;" />`;
}

const accentBar = (c: Ctx, w: number, h = 2, margin = "10px 0 0 0") =>
  `<table ${TABLE} style="${TABLE_STYLE} margin:${margin};"><tr><td width="${w}" height="${h}" bgcolor="${c.accent}" style="width:${w}px; height:${h}px; font-size:0; line-height:0; background-color:${c.accent};">&nbsp;</td></tr></table>`;

/* ------------------------------------------------------------------ */
/* Plantillas                                                          */
/* ------------------------------------------------------------------ */

function nameBlock(c: Ctx, nameSize = 19): string {
  const role = roleLine(c);
  return [
    c.d.nombre &&
      `<div style="${t(c, nameSize, "#111827", "font-weight:bold; line-height:1.2;")}">${esc(c.d.nombre)}</div>`,
    role && `<div style="margin-top:3px; ${t(c, 13, c.accentText, "font-weight:bold;")}">${role}</div>`,
    c.d.empresa && `<div style="margin-top:1px; ${t(c, 13, "#4b5563")}">${esc(c.d.empresa)}</div>`,
  ]
    .filter(Boolean)
    .join("");
}

function buildEjecutivo(c: Ctx): string {
  const foto = fotoImg(c, 84, "50%");
  const logo = logoImg(c);
  const cta = ctaButton(c, 0);
  const cols = foto ? 2 : 1;
  const footer =
    logo || cta
      ? `<tr><td colspan="${cols}" style="padding-top:14px;">
          <table ${TABLE} style="${TABLE_STYLE} border-top:1px solid #e5e7eb;" width="100%"><tr>
            ${logo ? `<td valign="middle" style="padding-top:12px; padding-right:16px;">${logo}</td>` : ""}
            ${cta ? `<td valign="middle" align="${logo ? "right" : "left"}" style="padding-top:12px;">${cta}</td>` : ""}
          </tr></table>
        </td></tr>`
      : "";

  return `
  <table ${TABLE} style="${TABLE_STYLE}">
    <tr>
      ${foto ? `<td valign="top" style="padding-right:18px;">${foto}</td>` : ""}
      <td valign="top">
        ${firmaImg(c)}
        ${nameBlock(c)}
        ${accentBar(c, 36)}
        ${contactTable(c)}
        ${socialButtons(c)}
      </td>
    </tr>
    ${footer}
  </table>`;
}

function buildCorporativa(c: Ctx): string {
  const side = logoImg(c) || fotoImg(c, 84, "12px");
  const role = roleLine(c);
  return `
  <table ${TABLE} style="${TABLE_STYLE}">
    <tr>
      ${side ? `<td valign="middle" style="padding-right:20px;">${side}</td>` : ""}
      <td valign="middle" style="border-left:3px solid ${c.accent}; padding-left:20px;">
        ${firmaImg(c)}
        ${c.d.nombre ? `<div style="${t(c, 18, "#111827", "font-weight:bold; line-height:1.2;")}">${esc(c.d.nombre)}</div>` : ""}
        ${role ? `<div style="margin-top:3px; ${t(c, 12, "#4b5563")}">${role}</div>` : ""}
        ${c.d.empresa ? `<div style="margin-top:4px; ${t(c, 11, c.accentText, "font-weight:bold; letter-spacing:1.5px; text-transform:uppercase;")}">${esc(c.d.empresa)}</div>` : ""}
        ${contactTable(c, "long")}
        ${socialButtons(c)}
        ${ctaButton(c)}
      </td>
    </tr>
  </table>`;
}

function buildModerna(c: Ctx): string {
  const foto = fotoImg(c, 72, "14px");
  const logo = logoImg(c, Math.min(c.s.logoWidth, 140));
  const social = socialButtons(c, 0);
  const contact = contactInline(c);
  const band =
    logo || social
      ? `<tr><td colspan="2" style="padding-top:12px;">
          <table ${TABLE} width="100%" style="${TABLE_STYLE}"><tr>
            <td bgcolor="#f3f6fb" style="background-color:#f3f6fb; border-radius:10px; padding:10px 14px;">
              <table ${TABLE} width="100%" style="${TABLE_STYLE}"><tr>
                ${logo ? `<td valign="middle">${logo}</td>` : ""}
                ${social ? `<td valign="middle" align="right">${social}</td>` : ""}
              </tr></table>
            </td>
          </tr></table>
        </td></tr>`
      : "";

  return `
  <table ${TABLE} width="520" style="${TABLE_STYLE} width:520px; max-width:100%;">
    <tr><td colspan="2" height="4" bgcolor="${c.accent}" style="height:4px; font-size:0; line-height:0; background-color:${c.accent}; border-radius:4px;">&nbsp;</td></tr>
    <tr>
      ${foto ? `<td width="72" valign="middle" style="padding:16px 16px 0 0; width:72px;">${foto}</td>` : ""}
      <td valign="middle" style="padding-top:16px;" ${foto ? "" : `colspan="2"`}>
        ${firmaImg(c, 4)}
        ${nameBlock(c, 20)}
      </td>
    </tr>
    ${contact ? `<tr><td colspan="2" style="padding-top:12px; ${t(c, 12, "#374151")}">${contact}</td></tr>` : ""}
    ${band}
    ${ctaButton(c) ? `<tr><td colspan="2">${ctaButton(c, 12)}</td></tr>` : ""}
  </table>`;
}

function buildManuscrita(c: Ctx): string {
  const role = [roleLine(c), c.d.empresa && esc(c.d.empresa)].filter(Boolean).join(" &middot; ");
  const firma =
    firmaImg(c, 4) ||
    (c.d.nombre
      ? `<div style="font-family:'Segoe Script','Brush Script MT','Snell Roundhand',cursive; font-size:30px; line-height:1.15; color:#0b1b3f; margin-bottom:4px;">${esc(c.d.nombre)}</div>`
      : "");
  const logo = logoImg(c, Math.min(c.s.logoWidth, 130));
  return `
  <table ${TABLE} style="${TABLE_STYLE}">
    <tr>
      <td valign="top">
        ${firma}
        ${accentBar(c, 160, 1, "0 0 8px 0")}
        ${c.d.nombre ? `<div style="${t(c, 13, "#111827", "font-weight:bold; letter-spacing:1.5px; text-transform:uppercase;")}">${esc(c.d.nombre)}</div>` : ""}
        ${role ? `<div style="margin-top:2px; ${t(c, 12, "#4b5563")}">${role}</div>` : ""}
        ${contactInline(c) ? `<div style="margin-top:10px;">${contactInline(c)}</div>` : ""}
        ${socialButtons(c)}
        ${ctaButton(c)}
        ${logo ? `<div style="margin-top:14px;">${logo}</div>` : ""}
      </td>
    </tr>
  </table>`;
}

function buildClasica(c: Ctx): string {
  const serif = "Georgia, 'Times New Roman', serif";
  const side = fotoImg(c, 64, "8px") || logoImg(c, Math.min(c.s.logoWidth, 110));
  const role = roleLine(c);
  return `
  <table ${TABLE} style="${TABLE_STYLE}">
    <tr><td style="border-top:3px double ${c.accent}; padding-top:14px;">
      <table ${TABLE} style="${TABLE_STYLE}"><tr>
        <td valign="top">
          ${firmaImg(c)}
          ${c.d.nombre ? `<div style="font-family:${serif}; font-size:21px; font-weight:bold; letter-spacing:0.4px; color:#111827; line-height:1.2;">${esc(c.d.nombre)}</div>` : ""}
          ${role ? `<div style="font-family:${serif}; font-size:13px; font-style:italic; color:#4b5563; margin-top:3px;">${role}</div>` : ""}
          ${c.d.empresa ? `<div style="font-family:${serif}; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:${c.accentText}; margin-top:3px;">${esc(c.d.empresa)}</div>` : ""}
        </td>
        ${side ? `<td valign="top" style="padding-left:22px;">${side}</td>` : ""}
      </tr></table>
      ${contactTable(c, "long")}
      ${socialText(c)}
      ${ctaButton(c)}
    </td></tr>
    <tr><td style="border-bottom:1px solid ${c.accent}; padding-top:12px; font-size:0; line-height:0;">&nbsp;</td></tr>
  </table>`;
}

function buildMinimal(c: Ctx): string {
  const second = [roleLine(c), c.d.empresa && esc(c.d.empresa)].filter(Boolean).join(" &middot; ");
  const logo = logoImg(c, Math.min(c.s.logoWidth, 100));
  return `
  <table ${TABLE} style="${TABLE_STYLE}">
    <tr><td valign="top">
      ${firmaImg(c)}
      ${c.d.nombre ? `<div style="${t(c, 16, "#111827", "font-weight:bold;")}">${esc(c.d.nombre)}</div>` : ""}
      ${second ? `<div style="${t(c, 12, "#4b5563")}">${second}</div>` : ""}
      ${contactInline(c) ? `<div style="margin-top:8px;">${contactInline(c)}</div>` : ""}
      ${socialText(c)}
      ${ctaButton(c, 12)}
      ${logo ? `<div style="margin-top:12px;">${logo}</div>` : ""}
    </td></tr>
  </table>`;
}

const BUILDERS: Record<TemplateId, (c: Ctx) => string> = {
  ejecutivo: buildEjecutivo,
  corporativa: buildCorporativa,
  moderna: buildModerna,
  manuscrita: buildManuscrita,
  clasica: buildClasica,
  minimal: buildMinimal,
};

/* ------------------------------------------------------------------ */
/* Punto de entrada                                                    */
/* ------------------------------------------------------------------ */

/**
 * Genera el HTML de la firma.
 * - `preview: true` rellena los campos vacíos con textos de ejemplo.
 * - `preview: false` (copiar / descargar) solo incluye lo que el usuario escribió.
 */
export function buildSignatureHTML(
  data: SignatureData,
  settings: SignatureSettings,
  { preview = false }: { preview?: boolean } = {},
): string {
  const c = makeCtx(data, settings, preview);
  const build = BUILDERS[settings.templateId] ?? buildEjecutivo;
  const html = `
<table ${TABLE} style="${TABLE_STYLE} background-color:#ffffff;">
  <tr>
    <td valign="top" style="padding:16px 18px; background-color:#ffffff; ${t(c, 12, "#111827")}">
      ${build(c)}
      ${disclaimerBlock(c)}
    </td>
  </tr>
</table>`;
  return sanitizeSignatureHTML(html.replace(/\n\s*/g, "\n").trim());
}

/** Documento completo (con UTF-8) para descargar como .htm (Outlook escritorio). */
export function buildSignatureDocument(html: string, title: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
</head>
<body style="margin:0; padding:0; background-color:#ffffff;">
${html}
</body>
</html>`;
}

export function buildPlainText(data: SignatureData): string {
  const v = (k: keyof SignatureData) => trim(data[k]);
  const role = [v("cargo"), v("departamento")].filter(Boolean).join(" · ");
  const socials = SOCIALS.filter((s) => safeHref(v(s.key))).map((s) => `${s.name}: ${prettyUrl(v(s.key))}`);
  const sections = [
    [v("nombre"), role, v("empresa")],
    [
      v("telefono") && `Tel.: ${v("telefono")}`,
      v("whatsapp") && `WhatsApp: ${v("whatsapp")}`,
      v("email") && `Email: ${v("email")}`,
      v("web") && `Web: ${prettyUrl(v("web"))}`,
      v("direccion") && `Dirección: ${v("direccion")}`,
    ],
    socials,
    [v("ctaTexto") && v("ctaUrl") && `${v("ctaTexto")}: ${safeHref(v("ctaUrl"))}`],
    [v("disclaimer")],
  ]
    .map((lines) => lines.filter(Boolean).join("\n"))
    .filter(Boolean);
  return sections.length ? `--\n${sections.join("\n\n")}` : "";
}
