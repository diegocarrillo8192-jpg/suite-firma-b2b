export interface ExtractOptions {
  mode: "auto" | "manual";
  threshold: number;
  contrast: number;
  invert: boolean;
  ink: string;
  maxDim: number;
}

export const defaultOptions: ExtractOptions = {
  mode: "auto",
  threshold: 140,
  contrast: 1.4,
  invert: false,
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

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  if (Number.isNaN(n)) return [15, 23, 42];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
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

  const hist = new Uint32Array(256);
  const gray = new Uint8ClampedArray(w * h);
  const c = opts.contrast;

  for (let i = 0; i < w * h; i++) {
    const r = srcData[i * 4];
    const g = srcData[i * 4 + 1];
    const b = srcData[i * 4 + 2];
    let v = 0.299 * r + 0.587 * g + 0.114 * b;
    v = (v - 128) * c + 128;
    v = v < 0 ? 0 : v > 255 ? 255 : v;
    gray[i] = Math.round(v);
    hist[gray[i]]++;
  }

  const t = opts.mode === "auto" ? otsu(hist) : opts.threshold;
  const [ir, ig, ib] = opts.ink === "original" ? [0, 0, 0] : hexToRgb(opts.ink);

  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const outCtx = out.getContext("2d")!;
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
