import { ReactNode } from 'react';

interface MicroInfoCardProps {
  label: string;
  value: ReactNode;
}

export function MicroInfoCard({ label, value }: MicroInfoCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <div className="mt-2 text-sm font-medium leading-6 text-slate-700">{value}</div>
    </div>
  );
}