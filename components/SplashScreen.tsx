"use client";

import { useEffect, useState } from "react";
import { PenTool } from "lucide-react";

type Phase = "visible" | "fading" | "gone";

const FADE_AT = 1600;
const GONE_AT = 2450;

export default function SplashScreen() {
  const [phase, setPhase] = useState<Phase>("visible");

  useEffect(() => {
    const fade = setTimeout(() => setPhase("fading"), FADE_AT);
    const done = setTimeout(() => setPhase("gone"), GONE_AT);
    return () => {
      clearTimeout(fade);
      clearTimeout(done);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      role="status"
      aria-label="Cargando Suite Firma B2B"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-slate-950 transition-opacity duration-700 ease-in-out ${
        phase === "fading" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="splash-logo flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 shadow-xl shadow-indigo-900/50 ring-1 ring-white/20 sm:h-24 sm:w-24">
        <PenTool size={38} strokeWidth={2.2} className="text-white sm:hidden" />
        <PenTool size={46} strokeWidth={2.2} className="hidden text-white sm:block" />
      </div>
      <p className="splash-word text-xl font-bold tracking-tight text-white sm:text-2xl">
        Suite Firma{" "}
        <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
          B2B
        </span>
      </p>
    </div>
  );
}