import type { LucideIcon } from "lucide-react";

export default function CardHeader({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center gap-2 px-5 pt-4">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
        <Icon size={15} strokeWidth={2.2} />
      </span>
      <h2 className="text-sm font-bold text-white">{title}</h2>
    </div>
  );
}
