async function blobToPngDataUrl(blob: Blob): Promise<string | null> {
  const objectUrl = URL.createObjectURL(blob);
  try {
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
    const dataUrl =
      ctx && (ctx.drawImage(img, 0, 0), canvas.toDataURL("image/png"));
    setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    return dataUrl;
  } catch {
    setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    return null;
  }
}

export async function resolveImageToDataUrl(url: string): Promise<string | null> {
  const t = url.trim();
  if (!t) return null;
  if (t.startsWith("data:")) return t;

  try {
    const res = await fetch(t, { mode: "cors" });
    if (!res.ok) return null;
    const blob = await res.blob();
    if (!blob.type.startsWith("image/")) return null;
    return await blobToPngDataUrl(blob);
  } catch {
    return null;
  }
}
