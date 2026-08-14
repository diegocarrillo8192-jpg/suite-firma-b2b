"use client";

import { useState } from "react";
import { Mail, PenTool, ScanLine, ShieldCheck } from "lucide-react";
import SignatureGenerator from "@/components/SignatureGenerator";
import SignaturePad from "@/components/SignaturePad";
import PhotoExtractor from "@/components/PhotoExtractor";

const TABS = [
  {
    id: "generador",
    icon: Mail,
    title: "Generador de Firmas Email",
    short: "Firmas Email",
    subtitle: "HTML para Gmail · Outlook",
  },
  {
    id: "lienzo",
    icon: PenTool,
    title: "Lienzo Digital de Firma",
    short: "Lienzo",
    subtitle: "Canvas táctil · PNG HD",
  },
  {
    id: "extractor",
    icon: ScanLine,
    title: "Extractor Foto → PNG",
    short: "Extractor",
    subtitle: "Tinta nítida sin fondo",
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("generador");

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px]"
        style={{
          background:
            "radial-gradient(600px 260px at 20% 0%, rgba(99,102,241,0.16), transparent 70%), radial-gradient(600px 260px at 80% 0%, rgba(37,99,235,0.14), transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6">
        <header className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 shadow-xl shadow-indigo-900/50 ring-1 ring-white/20">
            <PenTool size={26} className="text-white" />
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Suite Firma{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
              B2B
            </span>
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
            Módulo 2 · Genera firmas de correo profesionales, firma digitalmente sobre lienzo y
            convierte firmas en papel a PNG con transparencia real. Todo en tu navegador.
          </p>
        </header>

        <nav
          aria-label="Herramientas"
          className="mx-auto mt-8 flex w-full max-w-3xl gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2 backdrop-blur-xl"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-pressed={active}
                className={`flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2.5 transition-all duration-200 sm:flex-row sm:justify-center sm:gap-2.5 sm:px-4 ${
                  active
                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-900/50"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.4 : 2} />
                <span className="flex flex-col items-center sm:items-start">
                  <span className="text-[11px] font-semibold leading-tight sm:text-sm">
                    <span className="sm:hidden">{tab.short}</span>
                    <span className="hidden sm:inline">{tab.title}</span>
                  </span>
                  <span
                    className={`hidden text-[10px] sm:block ${
                      active ? "text-indigo-100/80" : "text-slate-500"
                    }`}
                  >
                    {tab.subtitle}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mx-auto mt-4 flex max-w-3xl items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-2.5 text-center backdrop-blur-xl">
          <ShieldCheck size={15} className="shrink-0 text-emerald-400" />
          <p className="text-xs leading-relaxed text-emerald-200/80">
            Procesamiento <span className="font-semibold text-emerald-100">100% local</span> en tu
            navegador: tus datos, imágenes y firmas nunca salen de tu dispositivo.
          </p>
        </div>

        <div key={activeTab} className="animate-fade-up mt-8">
          {activeTab === "generador" && <SignatureGenerator />}
          {activeTab === "lienzo" && <SignaturePad />}
          {activeTab === "extractor" && <PhotoExtractor />}
        </div>

        <footer className="mt-16 flex items-center justify-center gap-2 border-t border-white/5 pt-6 text-center text-xs text-slate-600">
          <ShieldCheck size={13} />
          Suite Firma B2B · Módulo 2 — procesamiento 100% client-side, nada sale de tu navegador.
        </footer>
      </div>
    </main>
  );
}
