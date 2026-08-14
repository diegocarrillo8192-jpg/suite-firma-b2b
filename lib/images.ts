export async function resolveImageToDataUrl(url: string): Promise<string | null> {
  const t = url.trim();
  if (!t) return null;
  if (t.startsWith("data:")) return t;

  try {
    const res = await fetch(t, { mode: "cors" });
    if (!res.ok) return null;
    const blob = await res.blob();
    if (!blob.type.startsWith("image/")) return null;
    const objectUrl = URL.createObjectURL(blob);

    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("carga fallida"));
      img.src = objectUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);
    const dataUrl = canvas.toDataURL("image/png");
    URL.revokeObjectURL(objectUrl);
    return dataUrl;
  } catch {
    return null;
  }
}
