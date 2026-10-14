"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** true solo en el navegador, después de la hidratación (sin errores de SSR). */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export const TAB_IDS = ["firma-correo", "firma-manuscrita", "manual"] as const;
export type TabId = (typeof TAB_IDS)[number];
const DEFAULT_TAB: TabId = "firma-correo";

function subscribeHash(cb: () => void) {
  window.addEventListener("hashchange", cb);
  window.addEventListener("popstate", cb);
  return () => {
    window.removeEventListener("hashchange", cb);
    window.removeEventListener("popstate", cb);
  };
}

const readHash = () => window.location.hash.slice(1);

/** Pestaña activa sincronizada con la URL (#manual, #firma-manuscrita…). */
export function useHashTab(): [TabId, (id: TabId) => void] {
  const hash = useSyncExternalStore(subscribeHash, readHash, () => "");
  const tab = (TAB_IDS as readonly string[]).includes(hash) ? (hash as TabId) : DEFAULT_TAB;

  const setTab = (id: TabId) => {
    if (readHash() === id) return;
    window.history.pushState(null, "", `#${id}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  return [tab, setTab];
}

export function scrollToWorkspace() {
  document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
