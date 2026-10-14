"use client";

import { useState } from "react";
import { Eye, Info, Monitor, Moon, Smartphone, Sun } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Segmented } from "@/components/ui/Controls";
import type { SignatureProfile } from "@/lib/profile";
import { isEmbedded } from "@/lib/templates";

type Device = "desktop" | "mobile";
type Theme = "light" | "dark";

/** Vista previa dentro de una ventana de correo simulada. */
export default function PreviewPanel({ html, profile }: { html: string; profile: SignatureProfile }) {
  const [device, setDevice] = useState<Device>("desktop");
  const [theme, setTheme] = useState<Theme>("light");
  const dark = theme === "dark";

  const { data, settings } = profile;
  const hasEmbedded =
    (settings.showLogo && isEmbedded(data.logoUrl)) ||
    (settings.showFoto && isEmbedded(data.fotoUrl)) ||
    (settings.showFirma && isEmbedded(data.firmaUrl));

  return (
    <Panel className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-3.5">
        <h2 className="flex items-center gap-2 text-[15px] font-semibold text-white">
          <Eye size={16} className="text-blue-300" />
          Vista previa en vivo
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <Segmented
            label="Dispositivo"
            size="sm"
            value={device}
            onChange={setDevice}
            options={[
              { value: "desktop", label: "PC", icon: Monitor },
              { value: "mobile", label: "Móvil", icon: Smartphone },
            ]}
          />
          <Segmented
            label="Tema del correo"
            size="sm"
            value={theme}
            onChange={setTheme}
            options={[
              { value: "light", label: "Claro", icon: Sun },
              { value: "dark", label: "Oscuro", icon: Moon },
            ]}
          />
        </div>
      </div>

      <div className="bg-black/20 p-3 sm:p-5">
        <div
          className={`mx-auto overflow-hidden shadow-2xl transition-all duration-300 ${
            device === "mobile" ? "max-w-[360px] rounded-[2rem] ring-[6px] ring-slate-800" : "max-w-full rounded-xl ring-1 ring-white/10"
          } ${dark ? "bg-[#1f2023]" : "bg-white"}`}
        >
          <div className={`border-b px-4 py-3 text-[12px] ${dark ? "border-white/10 text-slate-400" : "border-slate-200 text-slate-500"}`}>
            <p>
              <span className={dark ? "text-slate-500" : "text-slate-400"}>Para:</span> cliente@empresa.com
            </p>
            <p className={`mt-1 font-semibold ${dark ? "text-slate-200" : "text-slate-800"}`}>
              Propuesta comercial 2026
            </p>
          </div>
          <div className="px-4 py-4">
            <p className={`text-[13px] leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>
              Hola, le comparto la propuesta que conversamos. Quedo atento a sus comentarios.
            </p>
            <p className={`mt-3 text-[13px] ${dark ? "text-slate-300" : "text-slate-600"}`}>Saludos cordiales,</p>
            <div className="mt-3 overflow-x-auto">
              <div className="signature-preview max-w-full" dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </div>
        </div>
      </div>

      {hasEmbedded && (
        <p className="flex items-start gap-2 border-t border-white/[0.06] bg-sky-400/[0.04] px-5 py-3 text-[11.5px] leading-relaxed text-sky-200/90">
          <Info size={14} className="mt-px shrink-0" />
          <span>
            Las imágenes subidas desde tu equipo funcionan en Outlook y Apple Mail. <b>Gmail no las acepta</b>: para
            Gmail pega una URL pública (https://…) de tu logo o firma, o insértalas luego desde el editor de Gmail.
          </span>
        </p>
      )}
    </Panel>
  );
}
