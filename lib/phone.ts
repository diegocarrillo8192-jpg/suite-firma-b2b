const digitsOf = (raw: string) => raw.replace(/\D/g, "");

/**
 * Da formato panameño a un número: +507 6000-0000 (móvil) o +507 200-0000 (fijo).
 * Si el número no parece de Panamá se devuelve tal cual (solo recortado).
 */
export function formatPhonePA(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  let d = digitsOf(trimmed);
  const hasOtherCountry = trimmed.startsWith("+") && !d.startsWith("507");
  if (hasOtherCountry) return trimmed;
  if (d.startsWith("507") && (d.length === 10 || d.length === 11)) d = d.slice(3);
  if (d.length === 8) return `+507 ${d.slice(0, 4)}-${d.slice(4)}`;
  if (d.length === 7) return `+507 ${d.slice(0, 3)}-${d.slice(3)}`;
  return trimmed;
}

/** Enlace tel: con solo dígitos y el signo +. */
export function telHref(raw: string): string {
  const t = raw.trim();
  const d = digitsOf(t);
  if (!d) return "";
  return `tel:${t.startsWith("+") ? "+" : ""}${d}`;
}

/** Enlace de WhatsApp (wa.me). Números locales de 7–8 dígitos asumen +507. */
export function whatsappHref(raw: string): string {
  let d = digitsOf(raw);
  if (!d) return "";
  if (d.length === 7 || d.length === 8) d = `507${d}`;
  return `https://wa.me/${d}`;
}
