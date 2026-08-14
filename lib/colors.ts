export const DEFAULT_ACCENT = "#6366f1";

export const BRAND_SWATCHES = [
  "#6366f1", // Índigo
  "#2563eb", // Azul
  "#0ea5e9", // Cielo
  "#059669", // Esmeralda
  "#dc2626", // Rojo
  "#ea580c", // Naranja
  "#d97706", // Ámbar
  "#7c3aed", // Violeta
  "#db2777", // Rosa
  "#0f172a", // Grafito
];

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export function safeAccent(value: string): string {
  return HEX_RE.test(value.trim()) ? value.trim().toLowerCase() : DEFAULT_ACCENT;
}