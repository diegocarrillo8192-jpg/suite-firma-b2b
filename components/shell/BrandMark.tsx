import { useId } from "react";

/** Isotipo: trazo de firma sobre línea base, en degradado Canal. */
export default function BrandMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const g = `bm-g-${uid}`;
  const gold = `bm-gold-${uid}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden
      className={`shrink-0 drop-shadow-[0_6px_18px_rgba(37,99,235,0.45)] ${className}`}
    >
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="0.6" stopColor="#1d4ed8" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f6e7c4" />
          <stop offset="1" stopColor="#c9a45c" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill={`url(#${g})`} />
      <rect x="0.5" y="0.5" width="63" height="63" rx="17.5" fill="none" stroke="#fff" strokeOpacity="0.22" />
      <path
        d="M15 42 C 20 33, 28 30, 26 22 C 24.5 16.5, 34 12.5, 36 18.5 C 37.5 22.5, 40.5 20.5, 42.5 22.5 C 44.5 30, 39 39, 33 43 C 38 41, 44 40, 50 41"
        fill="none"
        stroke="#fff"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13 50 L 51 50" stroke={`url(#${gold})`} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
