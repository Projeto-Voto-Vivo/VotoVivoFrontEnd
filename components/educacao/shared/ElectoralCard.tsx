import {
  CheckCircle2,
  Trophy,
  Users,
} from "lucide-react";

interface ElectoralCardProps {
  type: "majoritario" | "proporcional";
  title: string;
  text: string;
  cargos: string[];
  image?: string;
}

export function ElectoralCard({
  type,
  title,
  text,
  cargos,
}: ElectoralCardProps) {
  const isMajoritario = type === "majoritario";

  const theme = isMajoritario
    ? {
        border: "border-blue-200",
        iconBg: "bg-blue-600",
        accent: "text-blue-600",
        badge: "bg-blue-100 text-blue-700",
      }
    : {
        border: "border-green-200",
        iconBg: "bg-green-600",
        accent: "text-green-600",
        badge: "bg-green-100 text-green-700",
      };

  const icon = isMajoritario ? (
    <Trophy size={26} aria-hidden="true" />
  ) : (
    <Users size={26} aria-hidden="true" />
  );

  return (
    <div
      className={`group flex flex-col rounded-3xl border ${theme.border} bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl sm:rounded-[2.5rem] sm:p-7`}
    >
      <div className="mb-5 flex items-center justify-between sm:mb-6">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${theme.iconBg} text-white shadow-lg`}
        >
          {icon}
        </div>

        <span
          className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${theme.badge}`}
        >
          Sistema {isMajoritario ? "Majoritário" : "Proporcional"}
        </span>
      </div>

      <h3 className="mb-3 text-xl font-black text-slate-900 sm:text-2xl">
        {title}
      </h3>

      <p className="mb-6 text-sm leading-relaxed text-slate-500">
        {text}
      </p>

      <div className="mt-auto">
        <p className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">
          Cargos eleitos
        </p>

        <div className="flex flex-wrap gap-2">
          {cargos.map((cargo) => (
            <span
              key={cargo}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600"
            >
              <CheckCircle2
                size={13}
                className={theme.accent}
                aria-hidden="true"
              />

              {cargo}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}