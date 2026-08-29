import { ReactNode } from "react";

interface InfoNoteProps {
  icon: ReactNode;
  title: string;
  text: string;
  tone: "green" | "red" | "blue" | "yellow";
}

export function InfoNote({
  icon,
  title,
  text,
  tone,
}: InfoNoteProps) {
  const tones = {
    green: {
      bg: "bg-green-50",
      border: "border-green-100",
      icon: "text-green-600",
      title: "text-green-900",
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-100",
      icon: "text-red-600",
      title: "text-red-900",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      icon: "text-blue-600",
      title: "text-blue-900",
    },
    yellow: {
      bg: "bg-yellow-50",
      border: "border-yellow-100",
      icon: "text-yellow-600",
      title: "text-yellow-900",
    },
  };

  const theme = tones[tone];

  return (
    <div
      className={`flex items-start gap-4 rounded-2xl border ${theme.border} ${theme.bg} p-5`}
    >
      <div className={`shrink-0 ${theme.icon}`}>
        {icon}
      </div>

      <div>
        <h4 className={`mb-1 font-bold ${theme.title}`}>
          {title}
        </h4>

        <p className="text-sm leading-relaxed text-slate-600">
          {text}
        </p>
      </div>
    </div>
  );
}