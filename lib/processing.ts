import { hexToRgb } from "./colors";

export interface ExtractOptions {
  mode: "auto" | "manual";
  threshold: number;
  contrast: number;
  invert: boolean;
  /** Compensa sombras y luz desigual de fotos tomadas con el celular. */
  flatten: boolean;
  ink: string;
  maxDim: number;
}

export const defaultOptions: ExtractOptions = {
  mode: "auto",
  threshold: 140,
  contrast: 1.4,
  invert: false,
  flatten: true,
  ink: "#0f172a",
  maxDim: 2400,
};

function otsu(hist: Uint32Array): number {
  const total = hist.reduce((a, b) => a + b, 0);
  if (total === 0) return 128;
  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * hist[i];

  let sumB = 0;
  let wB = 0;
  let maxVar = 0;
  let threshold = 127;

  for (let i = 0; i < 256; i++) {
    wB += hist[i];
    if (wB === 0) continue;
    const wF = total - wB;
    if (wF === 0) break;
    sumB += i * hist[i];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const between = wB * wF * (mB - mF) * (mB - mF);
    if (between > maxVar) {
      maxVar = between;
      threshold = i;
    }
  }
  return threshold;
}

/**
 * Normaliza la iluminación dividiendo cada píxel entre la media local
 * (imagen integral). Elimina sombras suaves y degradados del papel.
 */
function flattenIllumination(gray: Float32Array, w: number, h: number): void {
  const r = Math.max(12, Math.round(Math.min(w, h) / 14));
  const integral = new Float64Array((w + 1) * (h + 1));
  for (let y = 0; y < h; y++) {
    let row = 0;
    for (let x = 0; x < w; x++) {
      row += gray[y * w + x];
      integral[(y + 1) * (w + 1) + (x + 1)] = integral[y * (w + 1) + (x + 1)] + row;
    }
  }
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    const y0 = Math.max(0, y - r);
    const y1 = Math.min(h, y + r + 1);
    for (let x = 0; x < w; x++) {
      const x0 = Math.max(0, x - r);
      const x1 = Math.min(w, x + r + 1);
      const area = (x1 - x0) * (y1 - y0);
      const s =
        integral[y1 * (w + 1) + x1] -
        integral[y0 * (w + 1) + x1] -
        integral[y1 * (w + 1) + x0] +
        integral[y0 * (w + 1) + x0];
      const mean = s / area;
      out[y * w + x] = mean > 1 ? Math.min(255, (gray[y * w + x] / mean) * 235) : gray[y * w + x];
    }
  }
  gray.set(out);
}

export function extractInkToCanvas(
  img: HTMLImageElement,
  opts: ExtractOptions,
): HTMLCanvasElement {
  const scale = Math.min(1, opts.maxDim / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));

  const src = document.createElement("canvas");
  src.width = w;
  src.height = h;
  const srcCtx = src.getContext("2d", { willReadFrequently: true })!;
  srcCtx.drawImage(img, 0, 0, w, h);
  const srcData = srcCtx.getImageData(0, 0, w, h).data;

  const lum = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    lum[i] = 0.299 * srcData[i * 4] + 0.587 * srcData[i * 4 + 1] + 0.114 * srcData[i * 4 + 2];
  }
  // Con tinta clara sobre fondo oscuro la normalización no aplica.
  if (opts.flatten && !opts.invert) flattenIllumination(lum, w, h);

  const hist = new Uint32Array(256);
  const gray = new Uint8ClampedArray(w * h);
  const c = opts.contrast;
  for (let i = 0; i < w * h; i++) {
    let v = (lum[i] - 128) * c + 128;
    v = v < 0 ? 0 : v > 255 ? 255 : v;
    gray[i] = Math.round(v);
    hist[gray[i]]++;
  }

  const t = opts.mode === "auto" ? otsu(hist) : opts.threshold;
  const [ir, ig, ib] = opts.ink === "original" ? [0, 0, 0] : hexToRgb(opts.ink);

  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const outCtx = out.getContext("2d", { willReadFrequently: true })!;
  const outData = outCtx.createImageData(w, h);
  const px = outData.data;

  const feather = 6;
  for (let i = 0; i < w * h; i++) {
    const diff = opts.invert ? gray[i] - t : t - gray[i];
    const alpha = Math.max(0, Math.min(255, diff * feather));
    if (alpha > 0) {
      if (opts.ink === "original") {
        px[i * 4] = srcData[i * 4];
        px[i * 4 + 1] = srcData[i * 4 + 1];
        px[i * 4 + 2] = srcData[i * 4 + 2];
      } else {
        px[i * 4] = ir;
        px[i * 4 + 1] = ig;
        px[i * 4 + 2] = ib;
      }
      px[i * 4 + 3] = alpha;
    }
  }

  outCtx.putImageData(outData, 0, 0);
  return out;
}
