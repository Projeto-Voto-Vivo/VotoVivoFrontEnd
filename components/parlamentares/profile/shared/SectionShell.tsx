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
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex items-start gap-4">
        <div className="rounded-2xl bg-brasil-blue/10 p-3 text-brasil-blue">{icon}</div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}