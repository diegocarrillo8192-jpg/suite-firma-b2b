"use client";

import { useDeferredValue, useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Feather,
  Images,
  LayoutTemplate,
  Link2,
  Megaphone,
  Palette,
  Phone,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { SignatureProfile } from "@/lib/profile";
import { buildSignatureHTML } from "@/lib/templates";
import TemplatePicker from "./TemplatePicker";
import IdentityPanel from "./IdentityPanel";
import { ContactPanel, PersonalPanel, SocialPanel } from "./InfoPanels";
import StylePanel from "./StylePanel";
import HandwrittenPanel from "./HandwrittenPanel";
import ExtrasPanel from "./ExtrasPanel";
import PreviewPanel from "./PreviewPanel";
import ActionBar from "./ActionBar";
import QualityPanel from "./QualityPanel";
import ProfilePanel from "./ProfilePanel";
import type { SetField, SetSetting } from "./types";

interface Section {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Indica si la sección ya tiene contenido (punto verde en la pestaña). */
  done: (p: SignatureProfile) => boolean;
}

const has = (v: string) => v.trim().length > 0;

const SECTIONS: Section[] = [
  { id: "plantilla", label: "Plantilla", icon: LayoutTemplate, done: () => false },
  { id: "logo", label: "Logo y foto", icon: Images, done: (p) => has(p.data.logoUrl) || has(p.data.fotoUrl) },
  { id: "datos", label: "Datos", icon: User, done: (p) => has(p.data.nombre) && has(p.data.cargo) },
  { id: "contacto", label: "Contacto", icon: Phone, done: (p) => has(p.data.email) || has(p.data.telefono) },
  {
    id: "redes",
    label: "Redes",
    icon: Link2,
    done: (p) => [p.data.linkedin, p.data.instagram, p.data.facebook, p.data.twitter, p.data.youtube, p.data.tiktok].some(has),
  },
  { id: "marca", label: "Marca", icon: Palette, done: () => false },
  { id: "firma", label: "Firma a mano", icon: Feather, done: (p) => has(p.data.firmaUrl) },
  { id: "extras", label: "Botón y aviso", icon: Megaphone, done: (p) => has(p.data.ctaTexto) || has(p.data.disclaimer) },
  { id: "perfil", label: "Perfil y equipo", icon: Users, done: () => false },
];

export default function SignatureGenerator({
  profile,
  onProfile,
  onOpenStudio,
  onOpenManual,
}: {
  profile: SignatureProfile;
  onProfile: Dispatch<SetStateAction<SignatureProfile>>;
  onOpenStudio: () => void;
  onOpenManual: () => void;
}) {
  const { data, settings } = profile;
  const [index, setIndex] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);

  const setField: SetField = (key, value) =>
    onProfile((p) => ({ ...p, data: { ...p.data, [key]: value } }));
  const setSetting: SetSetting = (key, value) =>
    onProfile((p) => ({ ...p, settings: { ...p.settings, [key]: value } }));

  // La vista previa usa un valor diferido para que escribir sea siempre fluido.
  const deferred = useDeferredValue(profile);
  const previewHtml = useMemo(
    () => buildSignatureHTML(deferred.data, deferred.settings, { preview: true }),
    [deferred],
  );

  const goTo = (i: number) => {
    const next = Math.max(0, Math.min(SECTIONS.length - 1, i));
    setIndex(next);
    tabsRef.current
      ?.querySelector<HTMLElement>(`[data-index="${next}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const section = SECTIONS[index];

  const renderSection = () => {
    switch (section.id) {
      case "plantilla":
        return (
          <TemplatePicker profile={deferred} value={settings.templateId} onSelect={(id) => setSetting("templateId", id)} />
        );
      case "logo":
        return <IdentityPanel data={data} settings={settings} onField={setField} onSetting={setSetting} />;
      case "datos":
        return <PersonalPanel data={data} onField={setField} />;
      case "contacto":
        return <ContactPanel data={data} onField={setField} />;
      case "redes":
        return <SocialPanel data={data} onField={setField} />;
      case "marca":
        return <StylePanel settings={settings} onSetting={setSetting} />;
      case "firma":
        return (
          <HandwrittenPanel
            data={data}
            settings={settings}
            onField={setField}
            onSetting={setSetting}
            onOpenStudio={onOpenStudio}
          />
        );
      case "extras":
        return <ExtrasPanel data={data} onField={setField} />;
      default:
        return <ProfilePanel profile={profile} onProfile={onProfile} />;
    }
  };

  return (
    <div className="animate-fade-up grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] xl:gap-6">
      <div className="min-w-0 space-y-4">
        <div
          ref={tabsRef}
          role="tablist"
          aria-label="Secciones de la firma"
          className="panel flex gap-1 overflow-x-auto rounded-2xl p-1.5 no-scrollbar lg:grid lg:grid-cols-3 lg:overflow-visible"
        >
          {SECTIONS.map((s, i) => {
            const Icon = s.icon;
            const active = i === index;
            const done = s.done(profile);
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                data-index={i}
                id={`gen-tab-${s.id}`}
                aria-selected={active}
                aria-controls="gen-panel"
                onClick={() => goTo(i)}
                className={`relative flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[12.5px] font-medium transition-all ${
                  active
                    ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-950/60"
                    : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100"
                }`}
              >
                <span
                  className={`font-mono text-[10px] ${active ? "text-white/70" : "text-gold-400/80"}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon size={14} className="shrink-0" />
                <span className="whitespace-nowrap">{s.label}</span>
                {done && !active && (
                  <span aria-label="con contenido" className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}
        </div>

        <div role="tabpanel" id="gen-panel" aria-labelledby={`gen-tab-${section.id}`} key={section.id} className="animate-fade-up">
          {renderSection()}
        </div>

        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => goTo(index - 1)} disabled={index === 0} className="btn-ghost">
            <ArrowLeft size={15} /> Anterior
          </button>
          <span className="font-mono text-xs text-slate-500">
            {index + 1} / {SECTIONS.length}
          </span>
          {index < SECTIONS.length - 1 ? (
            <button type="button" onClick={() => goTo(index + 1)} className="btn-primary">
              {SECTIONS[index + 1].label} <ArrowRight size={15} />
            </button>
          ) : (
            <button type="button" onClick={onOpenManual} className="btn-primary btn-gold">
              Instalar mi firma <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-5 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto lg:pb-2 lg:pr-1">
        <PreviewPanel html={previewHtml} profile={deferred} />
        <ActionBar profile={profile} onOpenManual={onOpenManual} />
        <QualityPanel profile={deferred} />
      </div>
    </div>
  );
}
