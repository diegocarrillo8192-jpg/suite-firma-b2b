"use client";

import { useRef, type Dispatch, type SetStateAction } from "react";
import { Download, FolderOpen, RotateCcw, Users, WandSparkles } from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { useToast } from "@/components/ui/Toast";
import { downloadText } from "@/lib/images";
import {
  DISCLAIMERS,
  PROFILE_FILE_VERSION,
  emptyProfile,
  normalizeProfile,
  type SignatureProfile,
} from "@/lib/profile";

const EXAMPLE: SignatureProfile["data"] = {
  ...emptyProfile().data,
  nombre: "Andrés Morales",
  cargo: "Director Comercial",
  departamento: "Ventas Corporativas",
  empresa: "Grupo Istmo Logística",
  telefono: "+507 6000-0000",
  whatsapp: "+507 6000-0000",
  email: "andres@istmologistica.com",
  web: "www.istmologistica.com",
  direccion: "Costa del Este, Ciudad de Panamá",
  linkedin: "linkedin.com/in/andres-morales",
  instagram: "instagram.com/istmologistica",
  ctaTexto: "Agenda una reunión",
  ctaUrl: "calendly.com/istmologistica",
  disclaimer: DISCLAIMERS[0].text,
};

export default function ProfilePanel({
  profile,
  onProfile,
}: {
  profile: SignatureProfile;
  onProfile: Dispatch<SetStateAction<SignatureProfile>>;
}) {
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const exportProfile = (brandOnly: boolean) => {
    const data = brandOnly
      ? {
          ...emptyProfile().data,
          empresa: profile.data.empresa,
          web: profile.data.web,
          direccion: profile.data.direccion,
          logoUrl: profile.data.logoUrl,
          linkedin: profile.data.linkedin,
          instagram: profile.data.instagram,
          facebook: profile.data.facebook,
          twitter: profile.data.twitter,
          youtube: profile.data.youtube,
          tiktok: profile.data.tiktok,
          ctaTexto: profile.data.ctaTexto,
          ctaUrl: profile.data.ctaUrl,
          disclaimer: profile.data.disclaimer,
        }
      : profile.data;
    const payload = { app: "suite-firma-b2b", version: PROFILE_FILE_VERSION, data, settings: profile.settings };
    downloadText(
      JSON.stringify(payload, null, 2),
      brandOnly ? "kit-de-marca-firma.json" : "mi-firma.json",
      "application/json",
    );
    toast(brandOnly ? "Kit de marca exportado: compártelo con tu equipo" : "Perfil exportado");
  };

  const importProfile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const parsed = normalizeProfile(JSON.parse(await file.text()));
      if (!parsed) throw new Error("formato");
      // Un kit de marca no borra los datos personales que ya tenías.
      onProfile((p) => {
        const data = { ...p.data };
        for (const [k, v] of Object.entries(parsed.data) as Array<[keyof typeof data, string]>) {
          if (v.trim()) data[k] = v;
        }
        return { data, settings: parsed.settings };
      });
      toast("Perfil importado correctamente");
    } catch {
      toast("El archivo no es un perfil válido de Suite Firma", "error");
    }
  };

  return (
    <Panel>
      <PanelHeader
        step="09"
        icon={Users}
        title="Perfil y equipo"
        description="Se guarda solo en este navegador. Exporta un kit de marca para que todo tu equipo use la misma firma."
      />
      <div className="grid gap-2.5 p-5 sm:grid-cols-2 sm:p-6">
        <button type="button" onClick={() => exportProfile(true)} className="btn-ghost justify-start">
          <Users size={15} className="text-gold-400" /> Exportar kit de marca
        </button>
        <button type="button" onClick={() => exportProfile(false)} className="btn-ghost justify-start">
          <Download size={15} /> Exportar mi perfil
        </button>
        <button type="button" onClick={() => fileRef.current?.click()} className="btn-ghost justify-start">
          <FolderOpen size={15} /> Importar perfil o kit
        </button>
        <button
          type="button"
          onClick={() => {
            onProfile((p) => ({ ...p, data: { ...EXAMPLE, logoUrl: p.data.logoUrl, fotoUrl: p.data.fotoUrl, firmaUrl: p.data.firmaUrl } }));
            toast("Datos de ejemplo cargados", "info");
          }}
          className="btn-ghost justify-start"
        >
          <WandSparkles size={15} /> Cargar ejemplo
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("¿Borrar todos los datos de la firma? Esta acción no se puede deshacer.")) {
              onProfile(emptyProfile());
              toast("Firma reiniciada", "info");
            }
          }}
          className="btn-ghost justify-start !text-rose-300 hover:!border-rose-400/40 hover:!bg-rose-500/10 sm:col-span-2"
        >
          <RotateCcw size={15} /> Empezar de cero
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            importProfile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
    </Panel>
  );
}
