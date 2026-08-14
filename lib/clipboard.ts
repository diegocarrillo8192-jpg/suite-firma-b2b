function fallbackCopy(html: string, plainText: string): boolean {
  const container = document.createElement("div");
  container.setAttribute("contenteditable", "true");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.innerHTML = html;
  document.body.appendChild(container);

  const range = document.createRange();
  range.selectNodeContents(container);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);

  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }

  if (!ok) {
    const ta = document.createElement("textarea");
    ta.value = plainText;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    ta.remove();
  }

  selection?.removeAllRanges();
  container.remove();
  return ok;
}

function makeItem(
  mime: string,
  content: string,
): { mime: string; blob: Blob } {
  return { mime, blob: new Blob([content], { type: mime }) };
}

export async function copySignatureHTML(html: string, plainText: string): Promise<boolean> {
  try {
    if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
      const item = new ClipboardItem({
        "text/html": makeItem("text/html", html).blob,
        "text/plain": makeItem("text/plain", plainText).blob,
      });
      await navigator.clipboard.write([item]);
      return true;
    }
  } catch {
    // continua con el fallback
  }
  return fallbackCopy(html, plainText);
}

export async function copySignatureRichText(
  html: string,
  rtf: string,
  plainText: string,
): Promise<boolean> {
  try {
    if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
      const item = new ClipboardItem({
        "text/html": makeItem("text/html", html).blob,
        "text/rtf": makeItem("text/rtf", rtf).blob,
        "text/plain": makeItem("text/plain", plainText).blob,
      });
      await navigator.clipboard.write([item]);
      return true;
    }
  } catch {
    // algunos navegadores rechazan text/rtf; reintentar sin él
  }
  try {
    if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
      const item = new ClipboardItem({
        "text/html": makeItem("text/html", html).blob,
        "text/plain": makeItem("text/plain", plainText).blob,
      });
      await navigator.clipboard.write([item]);
      return true;
    }
  } catch {
    // continua con el fallback
  }
  return fallbackCopy(html, plainText);
}
