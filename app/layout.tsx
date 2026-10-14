import type { Metadata, Viewport } from "next";
import SplashScreen from "@/components/shell/SplashScreen";
import { geistMono, geistSans, instrumentSerif } from "./fonts";
import "./globals.css";

const siteUrl = "https://suite-firma-b2b.vercel.app";

const SITE_TITLE = "Suite Firma B2B — Firmas de correo y firma digital";
const SITE_DESCRIPTION =
  "Crea firmas de correo profesionales para Gmail y Outlook con tu logo, firma a mano con mouse o lápiz digital y convierte firmas en papel a PNG transparente. 100% privado, en tu navegador.";

const OG_IMAGE_URL = `${siteUrl}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: "Suite Firma B2B",
  keywords: [
    "firma de correo",
    "firma email Gmail",
    "firma Outlook",
    "firma digital",
    "firma electrónica PNG",
    "generador de firmas Panamá",
  ],
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Suite Firma B2B",
    locale: "es_PA",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Suite Firma B2B — Generador de firmas de correo, lienzo digital y extractor a PNG transparente",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE_URL],
  },
};

export const viewport: Viewport = {
  themeColor: "#04060c",
  colorScheme: "dark",
};

// Oculta la splash antes del primer pintado si ya se mostró en esta sesión.
const SPLASH_SCRIPT = `try{if(sessionStorage.getItem("sf-splash"))document.documentElement.classList.add("no-splash")}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SPLASH_SCRIPT }} />
      </head>
      <body className="min-h-full">
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}
