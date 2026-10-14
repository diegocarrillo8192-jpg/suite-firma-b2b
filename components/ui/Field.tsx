import { useId, type HTMLInputTypeAttribute } from "react";
import type { LucideIcon } from "lucide-react";

const labelClass =
  "mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400";

export function Field({
  label,
  icon: Icon,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  hint,
  error,
  autoComplete,
  inputMode,
  maxLength = 200,
  optional = false,
}: {
  label: string;
  icon?: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  hint?: string;
  error?: string | null;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "url" | "numeric";
  maxLength?: number;
  optional?: boolean;
}) {
  const id = useId();
  const describedBy = error || hint ? `${id}-desc` : undefined;
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {Icon && <Icon size={12} strokeWidth={2.4} className="text-blue-300/80" />}
        {label}
        {optional && <span className="font-normal normal-case tracking-normal text-slate-500">· opcional</span>}
      </label>
      <div className="input-shell" data-invalid={Boolean(error)}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none"
        />
      </div>
      {(error || hint) && (
        <p
          id={describedBy}
          className={`mt-1.5 text-[11px] leading-relaxed ${error ? "text-rose-300" : "text-slate-500"}`}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}

export function TextArea({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  rows = 3,
  maxLength = 600,
}: {
  label: string;
  icon?: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={`${labelClass} justify-between`}>
        <span className="flex items-center gap-1.5">
          {Icon && <Icon size={12} strokeWidth={2.4} className="text-blue-300/80" />}
          {label}
        </span>
        <span className="font-mono font-normal tracking-normal text-slate-500">
          {value.length}/{maxLength}
        </span>
      </label>
      <div className="input-shell">
        <textarea
          id={id}
          value={value}
          rows={rows}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full resize-y bg-transparent text-sm leading-relaxed text-slate-100 placeholder:text-slate-600 focus:outline-none"
        />
      </div>
    </div>
  );
}

export function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "px",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={`${labelClass} justify-between`}>
        {label}
        <span className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[11px] font-medium normal-case tracking-normal text-slate-300">
          {value}
          {unit}
        </span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
