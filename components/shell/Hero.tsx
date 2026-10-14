import { ArrowRight, BookOpen, Feather, LayoutTemplate, Lock, MousePointer2, Sparkles } from "lucide-react";

const STATS = [
  { value: "6", label: "plantillas premium", icon: LayoutTemplate },
  { value: "3", label: "formas de firmar a mano", icon: Feather },
  { value: "0", label: "datos enviados a servidores", icon: Lock },
];

const CLIENTS = ["Gmail", "Outlook", "Apple Mail", "Microsoft 365", "iPhone"];

export default function Hero({ onStart, onManual }: { onStart: () => void; onManual: () => void }) {
  return (
    <section className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pb-14 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:pb-20 lg:pt-20">
      <div className="animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/[0.06] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-gold-300">
          <Sparkles size={12} />
          Edición Panamá 2026
        </span>

        <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.035em] text-white sm:text-6xl lg:text-[4.1rem]">
          Firmas que{" "}
          <span className="font-display text-[1.08em] font-normal italic tracking-[-0.01em] text-gradient">
            abren puertas
          </span>
          <br className="hidden sm:block" /> y cierran negocios.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
          Diseña tu firma de correo corporativa con logo, botón de acción y WhatsApp. Firma a mano con
          el mouse o tu lápiz digital y conviértela en PNG transparente. Todo ocurre en tu navegador.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button type="button" onClick={onStart} className="btn-primary !px-6 !py-3.5 !text-[15px]">
            Crear mi firma gratis
            <ArrowRight size={17} />
          </button>
          <button type="button" onClick={onManual} className="btn-ghost !px-5 !py-3.5 !text-sm">
            <BookOpen size={16} />
            Ver manual paso a paso
          </button>
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
          <span className="font-medium uppercase tracking-[0.14em] text-slate-600">Compatible con</span>
          {CLIENTS.map((c) => (
            <span key={c} className="font-medium text-slate-400">
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="relative animate-fade-up [animation-delay:120ms]">
        <div aria-hidden className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-blue-600/20 via-cyan-400/5 to-gold-400/15 blur-3xl" />
        <div className="panel relative overflow-hidden rounded-[1.75rem] p-2">
          <div className="flex items-center gap-1.5 px-3 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 truncate text-[11px] text-slate-500">Nuevo mensaje · Propuesta comercial</span>
          </div>
          <div className="rounded-[1.25rem] bg-white p-6 text-slate-800 sm:p-7">
            <p className="text-[13px] leading-relaxed text-slate-500">
              Estimada Ana, adjunto la propuesta que conversamos. Quedo atento a sus comentarios.
            </p>
            <svg viewBox="0 0 320 90" className="mt-5 h-16 w-auto" aria-hidden>
              <path
                className="signature-draw"
                pathLength={1}
                d="M8 62 C 22 30, 40 18, 44 40 C 47 58, 30 70, 36 52 C 44 28, 62 26, 64 48 C 65 60, 72 60, 80 44 C 86 32, 94 34, 92 50 C 90 62, 100 62, 108 46 C 114 34, 122 36, 120 52 C 119 62, 128 60, 138 44 C 148 26, 160 22, 156 44 C 152 66, 170 60, 186 40 C 196 28, 210 30, 206 50 C 204 60, 214 58, 230 46 C 250 32, 270 40, 300 34"
                fill="none"
                stroke="#0b1b3f"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-lg font-bold text-white">
                AM
              </div>
              <div className="min-w-0">
                <p className="text-[17px] font-bold leading-tight text-slate-900">Andrés Morales</p>
                <p className="text-[13px] font-semibold text-blue-700">Director Comercial</p>
                <p className="text-[13px] text-slate-500">Grupo Istmo Logística</p>
              </div>
            </div>
            <div className="mt-3 h-[2px] w-9 bg-blue-700" />
            <div className="mt-3 grid gap-1 text-[12px] text-slate-600">
              <p>
                <b className="mr-2 text-blue-700">T</b>+507 6000-0000
              </p>
              <p>
                <b className="mr-2 text-blue-700">WA</b>Escríbeme por WhatsApp
              </p>
              <p>
                <b className="mr-2 text-blue-700">W</b>istmologistica.com
              </p>
            </div>
            <div className="mt-4 inline-flex items-center gap-1 rounded-lg bg-blue-700 px-3.5 py-2 text-[12px] font-bold text-white">
              Agenda una reunión →
            </div>
          </div>
        </div>

        <div className="panel absolute -bottom-5 -left-3 hidden items-center gap-3 rounded-2xl px-4 py-3 sm:flex">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/15 text-gold-300">
            <MousePointer2 size={17} />
          </span>
          <span className="text-xs leading-tight text-slate-300">
            Firma con mouse,
            <br />
            dedo o lápiz digital
          </span>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-3 lg:col-span-2">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="panel flex flex-col gap-1 rounded-2xl px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-6 sm:py-5">
              <Icon size={18} className="hidden text-gold-400 sm:block" />
              <dt className="order-2 text-[11px] leading-snug text-slate-400 sm:text-sm">{s.label}</dt>
              <dd className="order-1 font-display text-3xl italic text-white sm:text-4xl">{s.value}</dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
