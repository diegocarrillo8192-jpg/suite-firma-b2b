export const DEFAULT_ACCENT = "#1d4ed8";

export const BRAND_SWATCHES: Array<{ hex: string; name: string }> = [
  { hex: "#1d4ed8", name: "Azul Canal" },
  { hex: "#005293", name: "Azul Panamá" },
  { hex: "#d21034", name: "Rojo Panamá" },
  { hex: "#0e7490", name: "Pacífico" },
  { hex: "#047857", name: "Selva" },
  { hex: "#b8860b", name: "Oro" },
  { hex: "#ea580c", name: "Atardecer" },
  { hex: "#7c3aed", name: "Violeta" },
  { hex: "#be185d", name: "Orquídea" },
  { hex: "#0f172a", name: "Grafito" },
];

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export function safeAccent(value: string): string {
  return HEX_RE.test(value.trim()) ? value.trim().toLowerCase() : DEFAULT_ACCENT;
}

export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  if (Number.isNaN(n)) return [15, 23, 42];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Luminancia relativa WCAG. */
function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Color de texto legible (blanco o tinta) sobre un fondo de marca. */
export function readableOn(hex: string): string {
  return luminance(hex) > 0.42 ? "#111827" : "#ffffff";
}

/** Contraste del color de marca sobre blanco (para avisar si es muy claro). */
export function contrastOnWhite(hex: string): number {
  return 1.05 / (luminance(hex) + 0.05);
}
