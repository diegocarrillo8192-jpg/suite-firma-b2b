import type { LucideIcon } from "lucide-react";
import { useState } from "react";

export default function Field({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  icon?: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
        {Icon && <Icon size={13} strokeWidth={2.2} className="text-indigo-400" />}
        {label}
      </span>
      <div
        className={`flex items-center gap-2 rounded-xl border bg-slate-950/50 px-3 py-2.5 transition-all duration-200 ${
          focused
            ? "border-indigo-500/70 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
            : "border-white/10 hover:border-white/20"
        }`}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
        />
      </div>
      {hint && <span className="mt-1 block text-[11px] text-slate-500">{hint}</span>}
    </label>
  );
}
