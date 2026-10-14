"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { CircleCheck, Info, TriangleAlert } from "lucide-react";

type Tone = "success" | "error" | "info";
type ToastFn = (message: string, tone?: Tone) => void;

const ToastContext = createContext<ToastFn>(() => {});

export const useToast = () => useContext(ToastContext);

const ICONS = { success: CircleCheck, error: TriangleAlert, info: Info };
const TONES = {
  success: "text-emerald-300",
  error: "text-rose-300",
  info: "text-sky-300",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; message: string; tone: Tone } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback<ToastFn>((message, tone = "success") => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ id: Date.now(), message, tone });
    timer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const Icon = toast ? ICONS[toast.tone] : null;

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex justify-center px-4"
      >
        {toast && Icon && (
          <div
            key={toast.id}
            role="status"
            className="animate-toast panel flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-medium text-white shadow-2xl"
          >
            <Icon size={17} className={TONES[toast.tone]} />
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}
