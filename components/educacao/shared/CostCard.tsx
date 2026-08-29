import { ReactNode } from "react";
import { ExternalLink } from "lucide-react";

interface CostSource {
  label: string;
  url: string;
}

interface CostCardProps {
  icon: ReactNode;
  tone: "blue" | "green" | "yellow" | "red";
  title: string;
  value: string;
  extra?: string;
  text: string;
  source?: CostSource;
}

export function CostCard({
  icon,
  tone,
  title,
  value,
  extra,
  text,
  source,
}: CostCardProps) {
  const tones = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      badge: "bg-blue-100 text-blue-700",
      border: "border-blue-100",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-600",
      badge: "bg-green-100 text-green-700",
      border: "border-green-100",
    },
    yellow: {
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      badge: "bg-yellow-100 text-yellow-700",
      border: "border-yellow-100",
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-600",
      badge: "bg-red-100 text-red-700",
      border: "border-red-100",
    },
  };

  const theme = tones[tone];

  return (
    <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${theme.bg} ${theme.text}`}
        >
          {icon}
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${theme.badge}`}
        >
          Mensal
        </span>
      </div>

      <h3 className="mb-1 text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p
        className={`mb-2 text-2xl font-black tracking-tight ${theme.text}`}
      >
        {value}
      </p>

      {extra && (
        <p className="mb-3 text-xs font-semibold text-slate-400">
          {extra}
        </p>
      )}

      <p className="flex-1 text-sm leading-relaxed text-slate-500">
        {text}
      </p>

      {source && (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-5 flex items-center gap-2 border-t ${theme.border} pt-4 text-xs font-bold ${theme.text} hover:underline`}
        >
          {source.label}

          <ExternalLink size={13} />
        </a>
      )}
    </div>
  );
}