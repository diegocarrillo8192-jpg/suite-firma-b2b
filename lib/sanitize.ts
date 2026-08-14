import DOMPurify from "dompurify";

const CONFIG = {
  FORBID_TAGS: [
    "script",
    "iframe",
    "object",
    "embed",
    "form",
    "input",
    "button",
    "textarea",
    "select",
    "meta",
    "link",
    "base",
    "math",
  ],
  FORBID_ATTR: [
    "onerror",
    "onload",
    "onclick",
    "onmouseover",
    "onfocus",
    "onblur",
    "onchange",
    "onsubmit",
    "srcdoc",
    "formaction",
  ],
};

/**
 * Sanitiza el HTML generado de la firma antes de renderizarlo o copiarlo.
 * Permite tablas, estilos inline y SVG (necesarios para clientes de correo),
 * pero elimina scripts, iframes, eventos y formularios.
 * En SSR (sin `window`) se devuelve el HTML tal cual: las plantillas ya
 * escapan todo el texto interpolado, por lo que no hay vector de inyección.
 */
export function sanitizeSignatureHTML(html: string): string {
  if (typeof window === "undefined") return html;
  try {
    return DOMPurify.sanitize(html, CONFIG) as string;
  } catch {
    return html;
  }
}