export const ACCEPTED_IMAGES = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml";
const MAX_FILE_BYTES = 15 * 1024 * 1024;

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Lectura fallida"));
    reader.readAsDataURL(file);
  });
}

export function loadImageFromSrc(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Carga fallida"));
    img.src = src;
  });
}

/** Valida tipo y tamaño. Devuelve un mensaje de error o null si es válido. */
export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) return "El archivo no es una imagen (usa PNG, JPG o WEBP).";
  if (/hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name))
    return "El formato HEIC no es compatible con el navegador. Expórtalo como JPG o PNG.";
  if (file.size > MAX_FILE_BYTES) return "La imagen supera 15 MB. Usa una versión más ligera.";
  return null;
}

export interface FitOptions {
  /** Ancho máximo en px del resultado. */
  maxWidth: number;
  /** Alto máximo en px del resultado. */
  maxHeight: number;
  /** Recorte cuadrado centrado (fotos de perfil). */
  square?: boolean;
  /** JPEG reduce mucho el peso, pero pierde la transparencia. */
  format?: "image/png" | "image/jpeg";
}

/**
 * Reescala una imagen subida para incrustarla en la firma sin inflar el HTML.
 * Se genera al doble del tamaño de visualización para pantallas retina.
 */
export async function fitImageFile(file: File, opts: FitOptions): Promise<string> {
  const src = await readFileAsDataURL(file);
  const img = await loadImageFromSrc(src);
  const nw = img.naturalWidth || opts.maxWidth;
  const nh = img.naturalHeight || opts.maxHeight;

  let sx = 0,
    sy = 0,
    sw = nw,
    sh = nh;
  if (opts.square) {
    const side = Math.min(nw, nh);
    sx = (nw - side) / 2;
    sy = (nh - side) / 2;
    sw = sh = side;
  }

  const scale = Math.min(1, opts.maxWidth / sw, opts.maxHeight / sh);
  const w = Math.max(1, Math.round(sw * scale));
  const h = Math.max(1, Math.round(sh * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return src;
  ctx.imageSmoothingQuality = "high";
  const format = opts.format ?? "image/png";
  if (format === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  return canvas.toDataURL(format, 0.9);
}

/** Recorta un lienzo al contenido no transparente, con un margen. */
export function trimCanvas(source: HTMLCanvasElement, padding = 12): HTMLCanvasElement | null {
  const ctx = source.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  const { width, height } = source;
  const data = ctx.getImageData(0, 0, width, height).data;

  let minX = width,
    minY = height,
    maxX = -1,
    maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;

  const x0 = Math.max(0, minX - padding);
  const y0 = Math.max(0, minY - padding);
  const x1 = Math.min(width, maxX + padding + 1);
  const y1 = Math.min(height, maxY + padding + 1);

  const out = document.createElement("canvas");
  out.width = x1 - x0;
  out.height = y1 - y0;
  out.getContext("2d")?.drawImage(source, x0, y0, out.width, out.height, 0, 0, out.width, out.height);
  return out;
}

/** Reduce una firma PNG para incrustarla en el correo (ligera y nítida). */
export async function shrinkPngDataUrl(dataUrl: string, maxWidth = 640): Promise<string> {
  const img = await loadImageFromSrc(dataUrl);
  if (img.naturalWidth <= maxWidth) return dataUrl;
  const scale = maxWidth / img.naturalWidth;
  const canvas = document.createElement("canvas");
  canvas.width = maxWidth;
  canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}

export function timestamp(): string {
  return new Date().toISOString().replace(/[:T]/g, "-").slice(0, 19);
}

export function downloadURL(href: string, filename: string): void {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function downloadText(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  downloadURL(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Copia una imagen PNG al portapapeles (para pegarla en Word, Docs, PDF…). */
export async function copyImageToClipboard(dataUrl: string): Promise<boolean> {
  try {
    if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) return false;
    const blob = await (await fetch(dataUrl)).blob();
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    return true;
  } catch {
    return false;
  }
}
