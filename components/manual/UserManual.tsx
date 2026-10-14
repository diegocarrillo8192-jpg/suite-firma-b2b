"use client";

import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Camera,
  ChevronRight,
  CircleQuestionMark,
  Gauge,
  Images,
  LayoutTemplate,
  Lightbulb,
  Mail,
  Megaphone,
  Palette,
  PenTool,
  Phone,
  Rocket,
  Type,
  User,
} from "lucide-react";
import type { TabId } from "@/components/hooks";
import { Panel } from "@/components/ui/Panel";

const QUICK_STEPS = [
  {
    icon: LayoutTemplate,
    title: "Elige una plantilla",
    text: "En el paso 01 toca la miniatura que más te guste. Las miniaturas muestran tus datos reales, así comparas al instante.",
  },
  {
    icon: Images,
    title: "Sube tu logo y tu foto",
    text: "En el paso 02 pulsa «Subir imagen». El logo ideal es un PNG horizontal con fondo transparente; la foto, cuadrada y bien iluminada. Ajusta el ancho del logo con el control deslizante.",
  },
  {
    icon: User,
    title: "Completa tus datos",
    text: "Nombre, cargo, departamento y empresa. Escribe tal como quieres que aparezca: mayúsculas y tildes incluidas.",
  },
  {
    icon: Phone,
    title: "Agrega tu contacto",
    text: "Escribe tu número de 8 dígitos y al salir del campo se convierte a +507 automáticamente. El WhatsApp crea un enlace directo a tu chat y la dirección se enlaza a Google Maps.",
  },
  {
    icon: Palette,
    title: "Aplica tu marca",
    text: "Elige el color corporativo (o tu color exacto con el selector) y una tipografía segura para correo. El sistema evita colores ilegibles automáticamente.",
  },
  {
    icon: PenTool,
    title: "Añade tu firma a mano (opcional)",
    text: "En el paso 07 abre el estudio, crea tu firma y pulsa «Usar en mi firma de correo». Aparecerá sobre tu nombre.",
  },
  {
    icon: Megaphone,
    title: "Botón de acción y aviso legal",
    text: "Agrega un botón como «Agenda una reunión» con su enlace, y si lo necesitas, un aviso de confidencialidad o de protección de datos.",
  },
  {
    icon: Gauge,
    title: "Revisa y copia",
    text: "Mira la vista previa en PC, móvil y modo oscuro. Sube tu puntaje de calidad siguiendo las recomendaciones y pulsa «Copiar firma».",
  },
];

const CLIENTS = [
  {
    id: "gmail",
    name: "Gmail",
    button: "Copiar firma",
    steps: [
      "Abre Gmail en la computadora y pulsa el engranaje ⚙ (arriba a la derecha) → «Ver todos los ajustes».",
      "En la pestaña «General», baja hasta la sección «Firma» y pulsa «+ Crear nueva». Ponle un nombre.",
      "Haz clic dentro del cuadro de la firma y pega con Ctrl + V (Cmd + V en Mac).",
      "En «Valores predeterminados de firma», elige tu firma para correos nuevos y para respuestas.",
      "Baja al final de la página y pulsa «Guardar cambios».",
    ],
    note: "Gmail no acepta imágenes subidas desde tu equipo dentro de la firma pegada. Usa la opción «URL» del logo/foto con un enlace público (https://…), o inserta la imagen después con el ícono de imagen del editor de firmas de Gmail.",
  },
  {
    id: "outlook-web",
    name: "Outlook web / nuevo Outlook",
    button: "Copiar firma",
    steps: [
      "Abre Outlook en el navegador (outlook.com o Microsoft 365) o el nuevo Outlook para Windows.",
      "Ve a Configuración ⚙ → «Cuentas» → «Firmas».",
      "Pulsa «+ Nueva firma», escribe un nombre y pega la firma en el editor.",
      "Elige la firma predeterminada para mensajes nuevos y para respuestas/reenvíos.",
      "Pulsa «Guardar».",
    ],
  },
  {
    id: "outlook-desktop",
    name: "Outlook clásico (Windows)",
    button: "Copiar para Outlook",
    steps: [
      "En Outlook, ve a «Archivo» → «Opciones» → «Correo» → botón «Firmas…».",
      "Pulsa «Nueva», escribe un nombre y acepta.",
      "Haz clic en el cuadro «Editar firma» y pega con Ctrl + V.",
      "A la derecha elige la cuenta y la firma para «Mensajes nuevos» y «Respuestas o reenvíos».",
      "Pulsa «Aceptar». Opcional: guarda también el archivo .htm como respaldo.",
    ],
    note: "El botón «Copiar para Outlook» incluye formato RTF, que el Outlook clásico y Word conservan mejor.",
  },
  {
    id: "apple",
    name: "Apple Mail (Mac)",
    button: "Copiar firma",
    steps: [
      "Abre Mail → menú «Mail» → «Ajustes…» (o «Preferencias») → pestaña «Firmas».",
      "Selecciona tu cuenta y pulsa «+» para crear una firma nueva.",
      "Desmarca «Usar siempre mi tipo de letra predeterminado».",
      "Borra el texto de ejemplo y pega tu firma con Cmd + V.",
      "Cierra la ventana: los cambios se guardan solos.",
    ],
  },
  {
    id: "iphone",
    name: "iPhone y iPad",
    button: "Copiar firma",
    steps: [
      "Abre esta página en Safari desde tu iPhone y pulsa «Copiar firma».",
      "Ve a Ajustes → Apps → Mail → «Firma» (en versiones anteriores: Ajustes → Mail → Firma).",
      "Borra el texto actual, mantén presionado y elige «Pegar».",
      "Si el formato se simplifica, agita el iPhone y elige «Deshacer» para recuperar el diseño original.",
    ],
    note: "La app de Gmail para móviles solo admite firmas de texto: usa la versión .txt.",
  },
] as const;

const STUDIO = [
  {
    icon: PenTool,
    title: "Dibujar",
    points: [
      "Firma sobre la línea con el mouse, el dedo o un lápiz digital (Apple Pencil, S Pen, Wacom).",
      "Con lápiz, el grosor responde a la presión real. Con mouse, a la velocidad del trazo.",
      "Usa «Pantalla completa» en tabletas para tener más espacio.",
      "Ctrl + Z deshace y Ctrl + Y rehace. Puedes exportar a PNG HD o SVG vectorial.",
    ],
  },
  {
    icon: Type,
    title: "Escribir",
    points: [
      "Escribe tu nombre (o iniciales) y elige entre 6 estilos caligráficos.",
      "Ajusta tamaño, inclinación y color de tinta.",
      "Ideal si no tienes lápiz digital y quieres una firma limpia y uniforme.",
    ],
  },
  {
    icon: Camera,
    title: "Subir foto",
    points: [
      "Firma con bolígrafo oscuro sobre una hoja blanca y toma la foto de frente, con buena luz.",
      "La corrección de sombras y el umbral automático limpian el papel por ti.",
      "Si quedan manchas, sube el contraste o cambia a umbral manual.",
      "«Recortar al contenido» elimina el papel sobrante automáticamente.",
    ],
  },
];

const TIPS = [
  "Usa una sola firma por empresa: exporta el «kit de marca» y compártelo con tu equipo para que todos importen el mismo diseño.",
  "Aloja tu logo en tu propio sitio web (https://tuempresa.com/logo.png) para que se vea en todos los clientes de correo, incluido Gmail.",
  "Máximo 4 redes sociales y un solo botón de acción: una firma limpia transmite más confianza.",
  "Revisa la vista previa en modo oscuro: la firma lleva fondo blanco para mantenerse legible en cualquier tema.",
  "Tu trabajo se guarda solo en este navegador. Exporta tu perfil si vas a cambiar de computadora.",
];

const FAQ = [
  {
    q: "¿Mis datos se envían a algún servidor?",
    a: "No. Todo se procesa en tu navegador: textos, imágenes y firmas. El autoguardado usa el almacenamiento local de tu propio navegador y puedes borrarlo con «Empezar de cero».",
  },
  {
    q: "¿Por qué mi logo no aparece en Gmail?",
    a: "Gmail elimina las imágenes incrustadas al pegar una firma. Usa una URL pública para el logo (opción «URL») o inserta la imagen desde el editor de firmas de Gmail después de pegar.",
  },
  {
    q: "¿Por qué se ve un poco diferente en Outlook?",
    a: "Outlook de escritorio usa el motor de Word y no soporta esquinas redondeadas ni algunas sombras. Las plantillas están construidas con tablas para que la estructura, colores y textos se mantengan iguales.",
  },
  {
    q: "¿La firma manuscrita en PNG tiene validez legal?",
    a: "Una imagen de tu firma es útil para documentos internos, cotizaciones o cartas. Para trámites con validez legal plena en Panamá existe la firma electrónica calificada (regulada por la Ley 51 de 2008), que requiere un certificado emitido por un proveedor autorizado.",
  },
  {
    q: "¿Cómo creo firmas iguales para todo mi equipo?",
    a: "Diseña la firma con los datos de la empresa, pulsa «Exportar kit de marca» y comparte el archivo .json. Cada persona lo importa y solo completa sus datos personales.",
  },
  {
    q: "¿Puedo usar la firma en el celular?",
    a: "Sí. Abre esta página en el navegador del celular, crea la firma y cópiala. En iPhone puedes pegarla en Ajustes de Mail; en la app de Gmail solo se admite la versión de texto.",
  },
];

const SECTIONS = [
  { id: "pasos", label: "Paso a paso", icon: Rocket },
  { id: "instalar", label: "Instalar en tu correo", icon: Mail },
  { id: "manuscrita", label: "Firma a mano", icon: PenTool },
  { id: "faq", label: "Consejos y preguntas", icon: CircleQuestionMark },
] as const;

export default function UserManual({ onTab }: { onTab: (id: TabId) => void }) {
  const [client, setClient] = useState<(typeof CLIENTS)[number]["id"]>("gmail");
  const [section, setSection] = useState<(typeof SECTIONS)[number]["id"]>("pasos");
  const current = CLIENTS.find((c) => c.id === client) ?? CLIENTS[0];

  return (
    <div className="animate-fade-up space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-400">
            <BookOpen size={13} /> Manual de uso
          </span>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Tu firma profesional en <span className="font-display font-normal italic text-gold">5 minutos</span>
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Sigue estos pasos para crear, instalar y compartir tu firma. No necesitas registrarte ni saber de diseño.
          </p>
        </div>
      </div>

      <div role="tablist" aria-label="Secciones del manual" className="panel flex gap-1 overflow-x-auto rounded-2xl p-1.5 no-scrollbar sm:grid sm:grid-cols-4">
        {SECTIONS.map((sec, i) => {
          const Icon = sec.icon;
          const on = section === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              role="tab"
              id={`manual-tab-${sec.id}`}
              aria-selected={on}
              aria-controls="manual-panel"
              onClick={() => setSection(sec.id)}
              className={`flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-3 text-[13px] font-medium transition-all ${
                on
                  ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-950/60"
                  : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100"
              }`}
            >
              <span className={`font-mono text-[10px] ${on ? "text-white/70" : "text-gold-400/80"}`}>0{i + 1}</span>
              <Icon size={15} />
              <span className="whitespace-nowrap">{sec.label}</span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id="manual-panel" aria-labelledby={`manual-tab-${section}`} key={section} className="animate-fade-up">
        {/* 1. Paso a paso */}
        {section === "pasos" && (
          <Panel className="p-5 sm:p-8" as="div">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
              <Rocket size={18} className="text-gold-400" /> Crear tu firma de correo, paso a paso
            </h3>
            <ol className="mt-6 grid gap-x-8 gap-y-1 md:grid-cols-2">
              {QUICK_STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <li key={s.title} className="relative flex gap-4 pb-6">
                    <div className="flex flex-col items-center">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 font-mono text-sm font-semibold text-white shadow-lg shadow-blue-900/50">
                        {i + 1}
                      </span>
                      <span aria-hidden className="mt-2 w-px flex-1 bg-gradient-to-b from-white/15 to-transparent" />
                    </div>
                    <div className="pt-1.5">
                      <p className="flex items-center gap-2 text-[15px] font-semibold text-white">
                        <Icon size={15} className="text-blue-300" /> {s.title}
                      </p>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">{s.text}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <button type="button" onClick={() => onTab("firma-correo")} className="btn-primary">
              Empezar a crear mi firma <ArrowRight size={16} />
            </button>
          </Panel>
        )}

        {/* 2. Instalar */}
        {section === "instalar" && (
          <Panel className="overflow-hidden" as="div">
            <div className="p-5 pb-0 sm:p-8 sm:pb-0">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Mail size={18} className="text-gold-400" /> Instalar la firma en tu correo
              </h3>
              <p className="mt-1.5 text-sm text-slate-400">Elige tu programa de correo:</p>
              <div role="tablist" aria-label="Cliente de correo" className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {CLIENTS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={client === c.id}
                    onClick={() => setClient(c.id)}
                    className={`shrink-0 rounded-xl px-4 py-2.5 text-[13px] font-medium transition-colors ${
                      client === c.id
                        ? "bg-white/[0.09] text-white ring-1 ring-inset ring-gold-400/50"
                        : "text-slate-400 ring-1 ring-inset ring-white/[0.07] hover:text-white"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
            <div role="tabpanel" className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[1.5fr_1fr]">
              <ol className="space-y-3">
                {current.steps.map((step, i) => (
                  <li key={step} className="flex gap-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gold-400/15 font-mono text-xs font-semibold text-gold-300">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-[13.5px] leading-relaxed text-slate-300">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="space-y-4">
                <div className="rounded-2xl border border-blue-400/20 bg-blue-500/[0.06] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-300">Botón a usar</p>
                  <p className="mt-1.5 text-lg font-semibold text-white">«{current.button}»</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    Está debajo de la vista previa, en la pestaña Firma de correo.
                  </p>
                  <button
                    type="button"
                    onClick={() => onTab("firma-correo")}
                    className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-blue-300 hover:text-blue-200"
                  >
                    Ir al generador <ChevronRight size={15} />
                  </button>
                </div>
                {"note" in current && current.note && (
                  <p className="flex gap-2.5 rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-4 text-[12.5px] leading-relaxed text-amber-100/90">
                    <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-300" />
                    {current.note}
                  </p>
                )}
              </div>
            </div>
          </Panel>
        )}

        {/* 3. Firma manuscrita */}
        {section === "manuscrita" && (
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
              <PenTool size={18} className="text-gold-400" /> Firma manuscrita: 3 formas de crearla
            </h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {STUDIO.map((m) => {
                const Icon = m.icon;
                return (
                  <Panel key={m.title} className="p-5 sm:p-6" as="article">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-[#1a1305]">
                      <Icon size={20} />
                    </span>
                    <h4 className="mt-4 text-base font-semibold text-white">{m.title}</h4>
                    <ul className="mt-3 space-y-2">
                      {m.points.map((p) => (
                        <li key={p} className="flex gap-2 text-[13px] leading-relaxed text-slate-400">
                          <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-400" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </Panel>
                );
              })}
            </div>
            <button type="button" onClick={() => onTab("firma-manuscrita")} className="btn-ghost mt-4">
              Abrir el estudio de firma <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* 4. Consejos + FAQ */}
        {section === "faq" && (
          <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
            <Panel gold className="p-5 sm:p-7" as="div">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Lightbulb size={18} className="text-gold-400" /> Consejos de experto
              </h3>
              <ul className="mt-5 space-y-3.5">
                {TIPS.map((tip, i) => (
                  <li key={tip} className="flex gap-3 text-[13px] leading-relaxed text-slate-300">
                    <span className="font-mono text-xs font-semibold text-gold-400">{String(i + 1).padStart(2, "0")}</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel className="p-5 sm:p-7" as="div">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                <CircleQuestionMark size={18} className="text-gold-400" /> Preguntas frecuentes
              </h3>
              <div className="mt-4 divide-y divide-white/[0.06]">
                {FAQ.map((f) => (
                  <details key={f.q} className="group py-3.5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-medium text-slate-200 transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <ChevronRight size={16} className="shrink-0 text-slate-500 transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-2.5 pr-6 text-[13px] leading-relaxed text-slate-400">{f.a}</p>
                  </details>
                ))}
              </div>
            </Panel>
          </div>
        )}
      </div>
    </div>
  );
}
