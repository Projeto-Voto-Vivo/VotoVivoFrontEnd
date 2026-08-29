import { ReactNode } from "react";

interface SmallRoleCardProps {
  icon: ReactNode;
  title: string;
  text: string;
}

export function SmallRoleCard({
  icon,
  title,
  text,
}: SmallRoleCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md sm:p-6">
      <div className="mb-4 w-fit rounded-xl bg-slate-50 p-3">
        {icon}
      </div>

      <h4 className="mb-2 text-base font-bold text-slate-900">
        {title}
      </h4>

      <p className="text-sm leading-relaxed text-slate-500">
        {text}
      </p>
    </div>
  );
}