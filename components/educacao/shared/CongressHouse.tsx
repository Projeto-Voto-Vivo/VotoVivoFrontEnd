import type { ReactNode } from "react";

interface CongressHouseItem {
  title: string;
  text: string;
  icon: ReactNode;
}

interface CongressHouseProps {
  title: string;
  subtitle: string;
  color: "orange" | "teal";
  icon: ReactNode;
  items: CongressHouseItem[];
  mandate: string;
}

export function CongressHouse({
  title,
  subtitle,
  color,
  icon,
  items,
  mandate,
}: CongressHouseProps) {
  const colors = {
    orange: {
      border: "border-orange-200",
      iconBg: "bg-orange-100",
      iconText: "text-orange-600",
      badge: "bg-orange-100 text-orange-700",
      accent: "bg-orange-500",
      mandateCard: "bg-orange-600 shadow-orange-200",
    },
    teal: {
      border: "border-teal-200",
      iconBg: "bg-teal-100",
      iconText: "text-teal-600",
      badge: "bg-teal-100 text-teal-700",
      accent: "bg-teal-500",
      mandateCard: "bg-teal-600 shadow-teal-200",
    },
  };

  const theme = colors[color];

  return (
    <div
      className={`rounded-3xl border ${theme.border} bg-white p-5 shadow-sm sm:rounded-[2.5rem] sm:p-8 lg:col-span-4`}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${theme.iconBg} ${theme.iconText}`}
          >
            {icon}
          </div>

          <h3 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            {title}
          </h3>

          <p className="mt-1 text-sm font-medium text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className={theme.iconText}>{item.icon}</span>

              <h4 className="text-sm font-bold text-slate-800">
                {item.title}
              </h4>
            </div>

            <p className="whitespace-pre-line text-xs leading-relaxed text-slate-500">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <div
        className={`mt-6 rounded-2xl p-4 text-center text-white shadow-lg ${theme.mandateCard}`}
      >
        <p className="text-[10px] font-bold uppercase opacity-80">
          Mandato
        </p>

        <p className="text-2xl font-black italic">
          {mandate}
        </p>
      </div>

      <div
        className={`mt-6 h-1 w-full rounded-full ${theme.accent}`}
      />
    </div>
  );
}