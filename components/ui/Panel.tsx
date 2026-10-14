import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function Panel({
  children,
  className = "",
  gold = false,
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  gold?: boolean;
  as?: "section" | "div" | "article";
}) {
  return <Tag className={`panel ${gold ? "panel-gold" : ""} ${className}`}>{children}</Tag>;
}

export function PanelHeader({
  step,
  icon: Icon,
  title,
  description,
  action,
}: {
  step?: string;
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex items-start gap-3 px-5 pt-5 sm:px-6">
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 text-blue-200 ring-1 ring-inset ring-white/10">
        <Icon size={17} strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-white">
          {step && <span className="font-mono text-[11px] font-medium text-gold-400">{step}</span>}
          {title}
        </h2>
        {description && <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{description}</p>}
      </div>
      {action}
    </header>
  );
}
