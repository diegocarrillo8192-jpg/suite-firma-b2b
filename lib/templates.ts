import { sanitizeSignatureHTML } from "./sanitize";
import { safeAccent } from "./colors";

export interface SignatureData {
  nombre: string;
  cargo: string;
  empresa: string;
  telefono: string;
  email: string;
  web: string;
  fotoUrl: string;
  linkedin: string;
  instagram: string;
  facebook: string;
  twitter: string;
}

export const defaultData: SignatureData = {
  nombre: "María Fernanda Torres",
  cargo: "Ejecutiva de Cuentas B2B",
  empresa: "Nexora Solutions",
  telefono: "+52 55 1234 5678",
  email: "maria.torres@nexora.mx",
  web: "www.nexora.mx",
  fotoUrl: "",
  linkedin: "linkedin.com/in/mftorres",
  instagram: "",
  facebook: "",
  twitter: "",
};

export interface SignatureTemplate {
  id: string;
  name: string;
  description: string;
  swatch: string;
}

export const templates: SignatureTemplate[] = [
  {
    id: "ejecutivo",
    name: "Ejecutivo Índigo",
    description: "Avatar circular, jerarquía clara y acentos corporativos.",
    swatch: "linear-gradient(135deg, #6366f1, #2563eb)",
  },
  {
    id: "script",
    name: "Script Aurora",
    description: "Nombre caligráfico con barra lateral de marca.",
    swatch: "linear-gradient(135deg, #38bdf8, #6366f1)",
  },
  {
    id: "clasica",
    name: "Clásica Elegante",
    description: "Tipografía serif sobria con doble línea separadora.",
    swatch: "linear-gradient(135deg, #334155, #94a3b8)",
  },
  {
    id: "corporativa",
    name: "Corporativa B2B",
    description: "Logo a la izquierda y barra de marca a la derecha.",
    swatch: "linear-gradient(135deg, #1e293b, #1d4ed8)",
  },
];

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const trim = (s: string) => s.trim();

const withScheme = (u: string) => {
  const t = trim(u);
  if (!t) return "";
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
};

const initials = (name: string) => {
  const parts = trim(name).split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const last = parts[parts.length - 1]?.[0] ?? "";
  return (first + (parts.length > 1 ? last : "")).toUpperCase();
};

/* ------------------------------------------------------------------ */
/* Íconos SVG de contacto — SIEMPRE en el color de marca (accent)      */
/* ------------------------------------------------------------------ */

const svgIcon = (inner: string, accent: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;" role="img" aria-hidden="true">${inner}</svg>`;

const iconPhone = (accent: string) =>
  svgIcon(
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
    accent,
  );

const iconMail = (accent: string) =>
  svgIcon(
    '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    accent,
  );

const iconGlobe = (accent: string) =>
  svgIcon(
    '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    accent,
  );

/* ------------------------------------------------------------------ */
/* Bloques base (tablas puras con inline styles)                       */
/* ------------------------------------------------------------------ */

const F = {
  base: "font-family:Arial, Helvetica, sans-serif;",
  name: "font-family:Arial, Helvetica, sans-serif; font-size:18px; font-weight:bold; color:#111827 !important;",
  role: "font-family:Arial, Helvetica, sans-serif; font-size:12px; font-weight:600; color:#4b5563 !important;",
  company:
    "font-family:Arial, Helvetica, sans-serif; font-size:12px; color:#4b5563 !important;",
  contact:
    "font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:1.6; color:#374151 !important;",
  contactLink:
    "font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:1.6; color:#374151 !important; text-decoration:none;",
};

/** Tabla raíz rígida: fondo blanco forzado, jamás hereda el dark mode. */
function rootTable(inner: string): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:#ffffff !important; color:#111827 !important; mso-table-lspace:0pt; mso-table-rspace:0pt; border-collapse:collapse;">
    <tr>
      <td align="left" valign="top" style="padding:20px; ${F.base} color:#111827 !important;">
        ${inner}
      </td>
    </tr>
  </table>`;
}

/** Línea divisoria — color de marca (accent). */
function divider(accent: string, height = 1): string {
  return `
  <tr>
    <td colspan="2" style="padding:12px 0 0 0; font-size:0; line-height:0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td height="${height}" bgcolor="${accent}" style="font-size:0; line-height:${height}px; height:${height}px;">&nbsp;</td>
        </tr>
      </table>
    </td>
  </tr>`;
}

/** Fila de contacto: ícono SVG (accent) + valor en gris legible. */
function contactRow(iconHtml: string, value: string, href: string): string {
  return `
  <tr>
    <td width="18" style="padding:3px 0; vertical-align:middle; font-size:0;">${iconHtml}</td>
    <td style="padding:3px 0 3px 9px; vertical-align:middle;">
      <a href="${esc(href)}" target="_blank" style="${F.contactLink}">${esc(trim(value))}</a>
    </td>
  </tr>`;
}

/** Botones de redes sociales — relleno con el color de marca. */
function socialButtons(data: SignatureData, accent: string): string {
  const items: Array<[string, string]> = [];
  if (trim(data.linkedin)) items.push(["in", withScheme(data.linkedin)]);
  if (trim(data.instagram)) items.push(["ig", withScheme(data.instagram)]);
  if (trim(data.facebook)) items.push(["fb", withScheme(data.facebook)]);
  if (trim(data.twitter)) items.push(["𝕏", withScheme(data.twitter)]);
  if (!items.length) return "";
  const buttons = items
    .map(
      ([letter, href]) =>
        `<a href="${esc(href)}" target="_blank" style="display:inline-block; margin-right:6px; background-color:${accent}; color:#ffffff !important; font-family:Arial, Helvetica, sans-serif; font-size:10px; font-weight:bold; line-height:22px; height:22px; width:22px; text-align:center; border-radius:6px; text-decoration:none;">${letter}</a>`,
    )
    .join("");
  return `<tr><td colspan="2" style="padding-top:10px; font-size:0;">${buttons}</td></tr>`;
}

/** Avatar: imagen directa desde la URL o iniciales sobre gris neutro. */
function avatarHtml(
  avatarSrc: string,
  data: SignatureData,
  size: number,
  radius = "50%",
  initialsBg = "#e5e7eb",
  initialsColor = "#111827",
): string {
  if (avatarSrc) {
    return `<img src="${esc(avatarSrc)}" width="${size}" height="${size}" alt="${esc(data.nombre)}" style="display:block; border-radius:${radius}; border:0; outline:none; background-color:#f8fafc;" />`;
  }
  return `
  <table cellpadding="0" cellspacing="0" border="0" width="${size}" height="${size}" bgcolor="${initialsBg}" style="border-radius:${radius}; mso-table-lspace:0pt; mso-table-rspace:0pt;">
    <tr>
      <td width="${size}" height="${size}" align="center" valign="middle" style="font-family:Arial, Helvetica, sans-serif; font-size:${Math.round(size / 3)}px; font-weight:bold; color:${initialsColor} !important;">${initials(data.nombre)}</td>
    </tr>
  </table>`;
}

/* ------------------------------------------------------------------ */
/* Plantillas                                                          */
/* ------------------------------------------------------------------ */

function buildEjecutivo(data: SignatureData, avatarSrc: string, accent: string): string {
  const contactRows = [
    data.telefono &&
      contactRow(iconPhone(accent), data.telefono, `tel:${data.telefono.replace(/\s/g, "")}`),
    data.email && contactRow(iconMail(accent), data.email, `mailto:${data.email}`),
    data.web && contactRow(iconGlobe(accent), data.web, withScheme(data.web)),
  ]
    .filter(Boolean)
    .join("");

  return `
  <table cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td width="80" style="padding-right:18px; vertical-align:middle;">${avatarHtml(avatarSrc, data, 80)}</td>
      <td style="vertical-align:middle; ${F.base}">
        <div style="${F.name}">${esc(trim(data.nombre) || "Tu Nombre")}</div>
        <div style="${F.role}; margin-top:3px;">${esc(trim(data.cargo))}</div>
        <div style="${F.company}; margin-top:2px;">${esc(trim(data.empresa))}</div>
        ${contactRows ? `<table cellpadding="0" cellspacing="0" border="0" style="margin-top:10px;">${contactRows}</table>` : ""}
        ${socialButtons(data, accent)}
      </td>
    </tr>
    ${divider(accent)}
    <tr>
      <td colspan="2" style="padding-top:8px; ${F.contact}">
        Conoce más de <a href="${esc(withScheme(data.web) || "#")}" target="_blank" style="${F.contactLink}">${esc(trim(data.empresa) || "nuestra empresa")}</a>
      </td>
    </tr>
  </table>`;
}

function buildScript(data: SignatureData, avatarSrc: string, accent: string): string {
  const contactRows = [
    data.telefono &&
      contactRow(iconPhone(accent), data.telefono, `tel:${data.telefono.replace(/\s/g, "")}`),
    data.email && contactRow(iconMail(accent), data.email, `mailto:${data.email}`),
    data.web && contactRow(iconGlobe(accent), data.web, withScheme(data.web)),
  ]
    .filter(Boolean)
    .join("");

  return `
  <table cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td width="4" bgcolor="${accent}" style="border-radius:4px; font-size:0;">&nbsp;</td>
      <td style="padding:4px 0 4px 20px; vertical-align:middle; ${F.base}">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="vertical-align:middle;">
              ${avatarSrc
                ? `<img src="${esc(avatarSrc)}" width="64" height="64" alt="${esc(data.nombre)}" style="display:block; border-radius:50%; border:0; outline:none; background-color:#f8fafc;" />`
                : avatarHtml("", data, 64)}
            </td>
            <td style="padding-left:14px; vertical-align:middle;">
              <div style="font-family:'Segoe Script','Bradley Hand','Comic Sans MS',cursive; font-size:24px; line-height:1.2; color:#111827 !important;">${esc(trim(data.nombre) || "Tu Nombre")}</div>
              <div style="${F.role}; margin-top:3px;">${esc(trim(data.cargo))}</div>
              <div style="${F.company}; margin-top:2px;">${esc(trim(data.empresa))}</div>
            </td>
          </tr>
        </table>
        ${contactRows ? `<table cellpadding="0" cellspacing="0" border="0" style="margin-top:10px;">${contactRows}</table>` : ""}
        ${socialButtons(data, accent)}
      </td>
    </tr>
  </table>`;
}

function buildClasica(data: SignatureData, avatarSrc: string, accent: string): string {
  const contactRows = [
    data.telefono &&
      contactRow(iconPhone(accent), data.telefono, `tel:${data.telefono.replace(/\s/g, "")}`),
    data.email && contactRow(iconMail(accent), data.email, `mailto:${data.email}`),
    data.web && contactRow(iconGlobe(accent), data.web, withScheme(data.web)),
  ]
    .filter(Boolean)
    .join("");

  const socialLinks = [
    data.linkedin && `<a href="${esc(withScheme(data.linkedin))}" target="_blank" style="${F.contactLink}">LinkedIn</a>`,
    data.instagram && `<a href="${esc(withScheme(data.instagram))}" target="_blank" style="${F.contactLink}">Instagram</a>`,
    data.facebook && `<a href="${esc(withScheme(data.facebook))}" target="_blank" style="${F.contactLink}">Facebook</a>`,
    data.twitter && `<a href="${esc(withScheme(data.twitter))}" target="_blank" style="${F.contactLink}">X / Twitter</a>`,
  ]
    .filter(Boolean)
    .join("<span style='color:#9ca3af;'> &nbsp;·&nbsp; </span>");

  return `
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family:Georgia, 'Times New Roman', serif;">
    <tr>
      <td colspan="2" style="border-top:2px solid ${accent}; padding-top:10px;"></td>
    </tr>
    <tr>
      <td style="padding:14px 0 0 0; vertical-align:middle;">
        <div style="font-family:Georgia, 'Times New Roman', serif; font-size:21px; font-weight:bold; letter-spacing:0.5px; color:#111827 !important;">${esc(trim(data.nombre) || "Tu Nombre")}</div>
        <div style="font-family:Georgia, 'Times New Roman', serif; font-size:12px; font-style:italic; color:#4b5563 !important; margin-top:3px;">${esc(trim(data.cargo))}</div>
        <div style="font-family:Georgia, 'Times New Roman', serif; font-size:12px; letter-spacing:2px; text-transform:uppercase; color:#4b5563 !important; margin-top:1px;">${esc(trim(data.empresa))}</div>
      </td>
      <td style="padding:14px 0 0 18px; vertical-align:middle;">
        ${avatarSrc
          ? `<img src="${esc(avatarSrc)}" width="56" height="56" alt="${esc(data.nombre)}" style="display:block; border-radius:8px; border:0; outline:none; background-color:#f8fafc;" />`
          : `<div style="width:56px; height:56px; background-color:#1e293b; color:#f8fafc; font-family:Georgia, 'Times New Roman', serif; font-size:22px; font-weight:bold; text-align:center; line-height:56px; border-radius:8px;">${initials(data.nombre)}</div>`}
      </td>
    </tr>
    ${contactRows ? `<tr><td colspan="2"><table cellpadding="0" cellspacing="0" border="0" style="margin-top:10px;">${contactRows}</table></td></tr>` : ""}
    ${socialLinks ? `<tr><td colspan="2" style="padding-top:10px; font-size:12px; font-family:Georgia, 'Times New Roman', serif;">${socialLinks}</td></tr>` : ""}
    <tr>
      <td colspan="2" style="border-bottom:1px solid ${accent}; padding-bottom:10px;"></td>
    </tr>
  </table>`;
}

function buildCorporativa(data: SignatureData, avatarSrc: string, accent: string): string {
  const contactRows = [
    data.telefono &&
      contactRow(iconPhone(accent), data.telefono, `tel:${data.telefono.replace(/\s/g, "")}`),
    data.email && contactRow(iconMail(accent), data.email, `mailto:${data.email}`),
    data.web && contactRow(iconGlobe(accent), data.web, withScheme(data.web)),
  ]
    .filter(Boolean)
    .join("");

  return `
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f8fafc; border:1px solid #e5e7eb;">
    <tr>
      <td style="padding:20px; vertical-align:middle; ${F.base}">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td width="80" style="vertical-align:middle;">
              ${avatarSrc
                ? `<img src="${esc(avatarSrc)}" width="80" height="80" alt="${esc(data.nombre)}" style="display:block; border-radius:50%; border:0; outline:none; background-color:#f8fafc;" />`
                : `
                <table cellpadding="0" cellspacing="0" border="0" width="52" height="52" bgcolor="#1e293b" style="border-radius:10px; mso-table-lspace:0pt; mso-table-rspace:0pt;">
                  <tr><td width="52" height="52" align="center" valign="middle" style="color:#ffffff; font-family:Arial, sans-serif; font-size:22px; font-weight:bold;">${initials(data.empresa) || initials(data.nombre) || "B2B"}</td></tr>
                </table>`}
            </td>
            <td style="padding-left:16px; vertical-align:middle;">
              <div style="${F.name}">${esc(trim(data.nombre) || "Tu Nombre")}</div>
              <div style="${F.role}; margin-top:3px;">${esc(trim(data.cargo))}</div>
              <div style="${F.company}; margin-top:2px;">${esc(trim(data.empresa))}</div>
            </td>
          </tr>
        </table>
        ${divider(accent)}
        <table cellpadding="0" cellspacing="0" border="0">${contactRows}</table>
        ${socialButtons(data, accent)}
      </td>
      <td width="6" bgcolor="${accent}" style="font-size:0;">&nbsp;</td>
    </tr>
  </table>`;
}

/* ------------------------------------------------------------------ */
/* Entry point                                                         */
/* ------------------------------------------------------------------ */

export function buildSignatureHTML(
  data: SignatureData,
  templateId: string,
  avatarSrc: string,
  accentColor: string,
): string {
  const accent = safeAccent(accentColor);

  let body: string;
  switch (templateId) {
    case "script":
      body = buildScript(data, avatarSrc, accent);
      break;
    case "clasica":
      body = buildClasica(data, avatarSrc, accent);
      break;
    case "corporativa":
      body = buildCorporativa(data, avatarSrc, accent);
      break;
    default:
      body = buildEjecutivo(data, avatarSrc, accent);
  }

  return sanitizeSignatureHTML(rootTable(body).trim());
}

export function buildPlainText(data: SignatureData): string {
  const lines = [
    trim(data.nombre),
    trim(data.cargo),
    trim(data.empresa),
    "",
    data.telefono && `Teléfono: ${trim(data.telefono)}`,
    data.email && `Correo: ${trim(data.email)}`,
    data.web && `Web: ${trim(data.web)}`,
    data.linkedin && `LinkedIn: ${trim(data.linkedin)}`,
    data.instagram && `Instagram: ${trim(data.instagram)}`,
    data.facebook && `Facebook: ${trim(data.facebook)}`,
    data.twitter && `X/Twitter: ${trim(data.twitter)}`,
  ];
  return lines.filter(Boolean).join("\n");
}