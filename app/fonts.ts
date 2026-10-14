import {
  Allura,
  Dancing_Script,
  Geist,
  Geist_Mono,
  Great_Vibes,
  Herr_Von_Muellerhoff,
  Homemade_Apple,
  Instrument_Serif,
  Mrs_Saint_Delafield,
} from "next/font/google";

export const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
export const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
export const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

/* Fuentes caligráficas para la firma escrita (se cargan bajo demanda). */
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], preload: false });
const allura = Allura({ weight: "400", subsets: ["latin"], preload: false });
const saintDelafield = Mrs_Saint_Delafield({ weight: "400", subsets: ["latin"], preload: false });
const herrVon = Herr_Von_Muellerhoff({ weight: "400", subsets: ["latin"], preload: false });
const dancing = Dancing_Script({ weight: "600", subsets: ["latin"], preload: false });
const homemade = Homemade_Apple({ weight: "400", subsets: ["latin"], preload: false });

export const SIGNATURE_FONTS = [
  { id: "great-vibes", name: "Elegante", family: greatVibes.style.fontFamily, scale: 1 },
  { id: "saint", name: "Ejecutiva", family: saintDelafield.style.fontFamily, scale: 1.15 },
  { id: "herr", name: "Rápida", family: herrVon.style.fontFamily, scale: 1.2 },
  { id: "allura", name: "Clásica", family: allura.style.fontFamily, scale: 1 },
  { id: "dancing", name: "Legible", family: dancing.style.fontFamily, scale: 0.85 },
  { id: "homemade", name: "A mano", family: homemade.style.fontFamily, scale: 0.7 },
] as const;
