import { hexToRgb, safeAccent } from "./colors";
import { telHref, whatsappHref } from "./phone";
import { safeHref, type SignatureData } from "./templates";

/**
 * Escapa texto para RTF. Los caracteres no ASCII (tildes, ñ, emojis) se
 * codifican como \uN? para que Outlook y Word los muestren correctamente.
 */
function esc(s: string): string {
  let out = "";
  for (const ch of s) {
    if (ch === "\\" || ch === "{" || ch === "}") {
      out += `\\${ch}`;
    } else if (ch === "\n") {
      out += "\\line ";
    } else if (ch.charCodeAt(0) < 128 && ch.length === 1) {
      out += ch;
    } else {
      for (let i = 0; i < ch.length; i++) {
        const unit = ch.charCodeAt(i);
        out += `\\u${unit > 32767 ? unit - 65536 : unit}?`;
      }
    }
  }
  return out;
}

const trim = (s: string) => s.trim();

function hyperlink(url: string, text: string): string {
  if (!url) return esc(text);
  const safe = url.replace(/\\/g, "\\\\").replace(/"/g, "%22");
  return `{\\field{\\*\\fldinst{HYPERLINK "${safe}"}}{\\fldrslt{\\cf3\\ul0 ${esc(text)}}}}`;
}

export function buildSignatureRTF(data: SignatureData, accentHex: string): string {
  const [ar, ag, ab] = hexToRgb(safeAccent(accentHex));
  const v = (k: keyof SignatureData) => trim(data[k]);

  const contact: Array<[string, string, string]> = [];
  if (v("telefono")) contact.push(["Tel.", v("telefono"), telHref(v("telefono"))]);
  if (v("whatsapp")) contact.push(["WhatsApp", v("whatsapp"), whatsappHref(v("whatsapp"))]);
  if (v("email")) contact.push(["Email", v("email"), `mailto:${v("email")}`]);
  if (v("web")) contact.push(["Web", v("web"), safeHref(v("web"))]);
  if (v("direccion")) contact.push(["Dirección", v("direccion"), ""]);

  const socials: Array<[string, string]> = (
    [
      ["LinkedIn", "linkedin"],
      ["Instagram", "instagram"],
      ["Facebook", "facebook"],
      ["X", "twitter"],
      ["YouTube", "youtube"],
      ["TikTok", "tiktok"],
    ] as const
  )
    .filter(([, k]) => v(k))
    .map(([name, k]) => [name, safeHref(v(k))]);

  const role = [v("cargo"), v("departamento")].filter(Boolean).join(" · ");
  const lines: string[] = [];
  if (v("nombre")) lines.push(`\\fs28\\b\\cf1 ${esc(v("nombre"))}\\b0`);
  if (role) lines.push(`\\fs20\\b\\cf4 ${esc(role)}\\b0`);
  if (v("empresa")) lines.push(`\\fs20\\cf2 ${esc(v("empresa"))}`);
  if (contact.length) {
    lines.push(
      ...contact.map(
        ([label, value, href]) => `\\fs18\\b\\cf4 ${esc(label)}\\b0\\cf3  ${hyperlink(href, value)}`,
      ),
    );
  }
  if (socials.length) {
    lines.push(`\\fs18\\cf3 ${socials.map(([name, href]) => hyperlink(href, name)).join(" \\u183?  ")}`);
  }
  if (v("ctaTexto") && v("ctaUrl")) {
    lines.push(`\\fs18\\b\\cf4 ${hyperlink(safeHref(v("ctaUrl")), `${v("ctaTexto")} →`)}\\b0`);
  }
  if (v("disclaimer")) lines.push(`\\fs14\\cf2 ${esc(v("disclaimer"))}`);

  const colors = `{\\colortbl ;\\red17\\green24\\blue39;\\red75\\green85\\blue99;\\red55\\green65\\blue81;\\red${ar}\\green${ag}\\blue${ab};}`;
  return `{\\rtf1\\ansi\\ansicpg1252\\deff0\\uc1{\\fonttbl{\\f0\\fswiss Arial;}}${colors}\\f0 ${lines.join("\\line\n")}\\line\n}`;
}
