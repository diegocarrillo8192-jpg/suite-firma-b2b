"use client";

import { useRef, useState } from "react";
import {
  buildPlainText,
  buildSignatureHTML,
  defaultData,
  templates,
  type SignatureData,
} from "@/lib/templates";
import { buildSignatureRTF } from "@/lib/rtf";
import { DEFAULT_ACCENT } from "@/lib/colors";
import { copySignatureHTML, copySignatureRichText } from "@/lib/clipboard";
import { readFileAsDataURL } from "@/lib/processing";
import GeneratorHeader from "@/components/signature/GeneratorHeader";
import ContactFields from "@/components/signature/ContactFields";
import BrandColorPicker from "@/components/signature/BrandColorPicker";
import SocialFields from "@/components/signature/SocialFields";
import TemplatePicker from "@/components/signature/TemplatePicker";
import SignaturePreview from "@/components/signature/SignaturePreview";
import ActionBar from "@/components/signature/ActionBar";
import type { SetSignatureField } from "@/components/signature/types";

export default function SignatureGenerator() {
  const [data, setData] = useState<SignatureData>(defaultData);
  const [templateId, setTemplateId] = useState(templates[0].id);
  const [accent, setAccent] = useState(DEFAULT_ACCENT);
  const [copied, setCopied] = useState<"html" | "rtf" | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const avatarSrc = data.fotoUrl;
  const html = buildSignatureHTML(data, templateId, avatarSrc ?? "", accent);
  const rtf = buildSignatureRTF(data);

  const showToast = (kind: "html" | "rtf") => {
    setCopied(kind);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setCopied(null), 2200);
  };

  const setField: SetSignatureField = (key, value) =>
    setData((d) => ({ ...d, [key]: value }));

  const handleImageFile = async (file: File) => {
    setImageLoading(true);
    try {
      const dataUrl = await readFileAsDataURL(file);
      setField("fotoUrl", dataUrl);
    } catch (err) {
      console.error("Error al procesar la imagen:", err);
    } finally {
      setImageLoading(false);
    }
  };

  const handleCopyHTML = async () => {
    const ok = await copySignatureHTML(html, buildPlainText(data));
    if (ok) showToast("html");
  };

  const handleCopyRTF = async () => {
    const ok = await copySignatureRichText(html, rtf, buildPlainText(data));
    if (ok) showToast("rtf");
  };

  const handleDownloadHTML = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "firma-correo.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadText = () => {
    const blob = new Blob([buildPlainText(data)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "firma-correo.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section>
      <GeneratorHeader />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          <ContactFields
            data={data}
            onField={setField}
            onImageFile={handleImageFile}
            onRemoveImage={() => setField("fotoUrl", "")}
            imageLoading={imageLoading}
            hasAvatar={Boolean(avatarSrc)}
          />
          <BrandColorPicker accent={accent} onAccentChange={setAccent} />
          <SocialFields data={data} onField={setField} />
        </div>

        <div className="space-y-4 lg:col-span-7">
          <TemplatePicker templateId={templateId} onSelect={setTemplateId} />
          <SignaturePreview html={html} />
        </div>
      </div>

      <ActionBar
        copied={copied}
        onCopyHTML={handleCopyHTML}
        onCopyRTF={handleCopyRTF}
        onDownloadHTML={handleDownloadHTML}
        onDownloadText={handleDownloadText}
      />
    </section>
  );
}
