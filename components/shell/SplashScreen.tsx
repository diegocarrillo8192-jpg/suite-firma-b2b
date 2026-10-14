"use client";

import { useEffect, useState } from "react";
import BrandMark from "./BrandMark";

type Phase = "visible" | "fading" | "gone";

const FADE_AT = 900;
const GONE_AT = 1500;

/** Pantalla de bienvenida breve; solo aparece la primera vez en cada sesión. */
export default function SplashScreen() {
  const [phase, setPhase] = useState<Phase>("visible");

  useEffect(() => {
    try {
      sessionStorage.setItem("sf-splash", "1");
    } catch {
      // sin sessionStorage: la splash se mostrará en cada visita
    }
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
      className={`splash-root fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-[#04060c] transition-opacity duration-500 ease-out ${
        phase === "fading" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="splash-logo rounded-[22px]">
        <BrandMark size={88} />
      </div>
      <p className="splash-word text-xl font-semibold tracking-tight text-white sm:text-2xl">
        Suite Firma <span className="text-gold">B2B</span>
      </p>
    </div>
  );
}
