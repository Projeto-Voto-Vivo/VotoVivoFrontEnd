import { ReactNode } from 'react';

interface SectionShellProps {
  icon: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
}

export function SectionShell({
  icon,
  title,
  description,
  children,
}: SectionShellProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-gradient-to-r from-brasil-blue/5 via-white to-brasil-green/5 p-6 md:p-8">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-white p-3 text-brasil-blue shadow-sm ring-1 ring-brasil-blue/10">
            {icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
            ) : null}
          </div>
        </div>
      </div>
      <div className="p-6 md:p-8">{children}</div>
    </section>
  );
}
