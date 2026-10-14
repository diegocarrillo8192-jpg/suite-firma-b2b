"use client";

import { useEffect, useState } from "react";
import { scrollToWorkspace, useHashTab, useIsClient, type TabId } from "@/components/hooks";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import SiteHeader from "@/components/shell/SiteHeader";
import Hero from "@/components/shell/Hero";
import TabBar from "@/components/shell/TabBar";
import SiteFooter from "@/components/shell/SiteFooter";
import SignatureGenerator from "@/components/generator/SignatureGenerator";
import HandwritingStudio from "@/components/studio/HandwritingStudio";
import UserManual from "@/components/manual/UserManual";
import { shrinkPngDataUrl } from "@/lib/images";
import { emptyProfile, normalizeProfile, PROFILE_KEY, type SignatureProfile } from "@/lib/profile";
import { loadJSON, saveJSON } from "@/lib/storage";

export default function Workspace() {
  const [tab, setTab] = useHashTab();
  const isClient = useIsClient();

  const go = (id: TabId) => {
    setTab(id);
    scrollToWorkspace();
  };

  return (
    <ToastProvider>
      <div aria-hidden className="atmosphere" />
      <div aria-hidden className="grain" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader tab={tab} onTab={setTab} />
        <main className="flex-1">
          <Hero onStart={() => go("firma-correo")} onManual={() => go("manual")} />

          <section id="workspace" aria-label="Herramientas" className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 sm:px-6">
            <TabBar tab={tab} onTab={setTab} />
            <div className="mt-6">{isClient ? <Tools tab={tab} onTab={go} /> : <WorkspaceSkeleton />}</div>
          </section>
        </main>
        <SiteFooter onTab={setTab} />
      </div>
    </ToastProvider>
  );
}

/**
 * Herramientas: solo se montan en el navegador, así el estado guardado en
 * localStorage se lee en el primer render sin errores de hidratación.
 */
function Tools({ tab, onTab }: { tab: TabId; onTab: (id: TabId) => void }) {
  const toast = useToast();
  const [profile, setProfile] = useState<SignatureProfile>(
    () => normalizeProfile(loadJSON(PROFILE_KEY)) ?? emptyProfile(),
  );

  // Autoguardado (con pequeña espera para no escribir en cada tecla).
  useEffect(() => {
    const id = setTimeout(() => saveJSON(PROFILE_KEY, profile), 400);
    return () => clearTimeout(id);
  }, [profile]);

  const addToEmail = async (dataUrl: string) => {
    const firmaUrl = await shrinkPngDataUrl(dataUrl, 520).catch(() => dataUrl);
    setProfile((p) => ({
      data: { ...p.data, firmaUrl },
      settings: { ...p.settings, showFirma: true },
    }));
    onTab("firma-correo");
    toast("Firma manuscrita añadida a tu firma de correo");
  };

  // Los tres paneles quedan montados para conservar el trabajo al cambiar de pestaña.
  return (
    <>
      <div role="tabpanel" id="panel-firma-correo" aria-labelledby="tab-firma-correo" hidden={tab !== "firma-correo"}>
        <SignatureGenerator
          profile={profile}
          onProfile={setProfile}
          onOpenStudio={() => onTab("firma-manuscrita")}
          onOpenManual={() => onTab("manual")}
        />
      </div>
      <div
        role="tabpanel"
        id="panel-firma-manuscrita"
        aria-labelledby="tab-firma-manuscrita"
        hidden={tab !== "firma-manuscrita"}
      >
        <HandwritingStudio
          active={tab === "firma-manuscrita"}
          defaultName={profile.data.nombre}
          onUseInEmail={addToEmail}
        />
      </div>
      <div role="tabpanel" id="panel-manual" aria-labelledby="tab-manual" hidden={tab !== "manual"}>
        <UserManual onTab={onTab} />
      </div>
    </>
  );
}

function WorkspaceSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]" aria-busy="true" aria-label="Cargando herramientas">
      <div className="space-y-5">
        <div className="skeleton h-64 rounded-[1.25rem]" />
        <div className="skeleton h-80 rounded-[1.25rem]" />
      </div>
      <div className="skeleton h-[560px] rounded-[1.25rem]" />
    </div>
  );
}
