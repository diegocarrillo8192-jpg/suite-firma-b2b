"use client";

import { useState } from "react";
import { Camera, PenTool, Type } from "lucide-react";
import DrawPad from "./DrawPad";
import TypeSignature from "./TypeSignature";
import PhotoExtract from "./PhotoExtract";

const MODES = [
  {
    id: "dibujar",
    icon: PenTool,
    title: "Dibujar",
    text: "Con mouse, dedo o lápiz digital (Apple Pencil, S Pen, Wacom)",
  },
  {
    id: "escribir",
    icon: Type,
    title: "Escribir",
    text: "Tu nombre en 6 estilos caligráficos profesionales",
  },
  {
    id: "subir",
    icon: Camera,
    title: "Subir foto",
    text: "Convierte tu firma en papel a PNG transparente",
  },
] as const;

type Mode = (typeof MODES)[number]["id"];

export default function HandwritingStudio({
  active,
  defaultName,
  onUseInEmail,
}: {
  active: boolean;
  defaultName: string;
  onUseInEmail: (dataUrl: string) => void;
}) {
  const [mode, setMode] = useState<Mode>("dibujar");

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Estudio de <span className="font-display font-normal italic text-gold">firma manuscrita</span>
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Crea tu firma a mano de tres formas. Descárgala como PNG transparente en alta resolución para
            documentos y PDFs, o añádela con un clic a tu firma de correo.
          </p>
        </div>
      </div>

      <div role="radiogroup" aria-label="Forma de crear la firma" className="grid gap-3 sm:grid-cols-3">
        {MODES.map((m) => {
          const Icon = m.icon;
          const on = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-3.5 rounded-2xl p-4 text-left transition-all ${
                on ? "panel panel-gold" : "border border-white/[0.06] bg-white/[0.015] hover:border-white/15"
              }`}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  on ? "bg-gradient-to-br from-gold-300 to-gold-500 text-[#1a1305]" : "bg-white/[0.05] text-slate-400"
                }`}
              >
                <Icon size={20} />
              </span>
              <span>
                <span className={`block text-sm font-semibold ${on ? "text-white" : "text-slate-300"}`}>{m.title}</span>
                <span className="block text-[11.5px] leading-snug text-slate-500">{m.text}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Los tres modos permanecen montados para no perder el trabajo al alternar. */}
      <div hidden={mode !== "dibujar"}>
        <DrawPad active={active && mode === "dibujar"} onUseInEmail={onUseInEmail} />
      </div>
      <div hidden={mode !== "escribir"}>
        <TypeSignature defaultName={defaultName} onUseInEmail={onUseInEmail} />
      </div>
      <div hidden={mode !== "subir"}>
        <PhotoExtract onUseInEmail={onUseInEmail} />
      </div>
    </div>
  );
}
