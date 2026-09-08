import { ReactNode } from 'react';
import { DicaTermo } from '@/components/layout/DicaTermo';

interface MicroInfoCardProps {
  label: string;
  value: ReactNode;
  /** Explicação do rótulo, num "?" ao lado dele. */
  dica?: string;
}

export function MicroInfoCard({ label, value, dica }: MicroInfoCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="flex items-center gap-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
        {dica ? <DicaTermo termo={label}>{dica}</DicaTermo> : null}
      </p>
      <div className="mt-2 text-sm font-medium leading-6 text-slate-700">{value}</div>
    </div>
  );
}
