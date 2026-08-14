import type { SignatureData } from "./templates";

const esc = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/{/g, "\\{").replace(/}/g, "\\}").replace(/\n/g, "\\line ");

const trim = (s: string) => s.trim();

export function buildSignatureRTF(data: SignatureData): string {
  const nombre = esc(trim(data.nombre) || "Tu Nombre");
  const cargo = esc(trim(data.cargo) || "Cargo");
  const empresa = esc(trim(data.empresa) || "Empresa");
  const telefono = trim(data.telefono);
  const email = trim(data.email);
  const web = trim(data.web);
  const linkedin = trim(data.linkedin);
  const instagram = trim(data.instagram);
  const facebook = trim(data.facebook);
  const twitter = trim(data.twitter);

  const linkLines: string[] = [
    telefono && `Teléfono: ${telefono}`,
    email && `Correo: ${email}`,
    web && `Web: ${web}`,
    linkedin && `LinkedIn: ${linkedin}`,
    instagram && `Instagram: ${instagram}`,
    facebook && `Facebook: ${facebook}`,
    twitter && `X/Twitter: ${twitter}`,
  ].filter(Boolean) as string[];

  // colores fijos: #111827 (nombre), #4b5563 (cargo/empresa), #374151 (contactos)
  const lines = [
    `\\f0\\fs22\\b\\cf1 ${nombre}`,
    `\\f0\\fs20\\cf2 ${cargo}`,
    `\\f0\\fs20\\cf2 ${empresa}`,
    ...linkLines.map((l) => `\\fs16\\cf3 ${esc(l)}`),
  ];

  const rtf = `{\\rtf1\\ansi\\ansicpg1252\\deff0{\\fonttbl{\\f0 Arial;}}{\\colortbl ;\\red17\\green24\\blue39;\\red75\\green85\\blue99;\\red55\\green65\\blue81;}\\f0\\fs22 ${lines.join("\\line\n")}\\line\n}`;

  return rtf;
}