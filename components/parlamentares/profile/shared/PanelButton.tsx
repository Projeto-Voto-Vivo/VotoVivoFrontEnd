import { ReactNode } from 'react';

interface PanelButtonProps {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
  /** Modo compacto: ícone + label empilhados, usado na tab bar mobile */
  compact?: boolean;
}

export function PanelButton({
  active,
  icon,
  label,
  onClick,
  compact = false,
}: PanelButtonProps) {
  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex shrink-0 flex-col items-center gap-1.5 px-3 py-2 transition-all ${
          active ? 'text-brasil-blue' : 'text-slate-500'
        }`}
      >
        <div
          className={`rounded-xl p-2 transition-colors ${
            active ? 'bg-brasil-blue/10' : 'bg-transparent'
          }`}
        >
          {icon}
        </div>
        <span
          className={`whitespace-nowrap text-[11px] font-semibold leading-none ${
            active ? 'text-brasil-blue' : 'text-slate-500'
          }`}
        >
          {label}
        </span>
        {active && (
          <span className="h-0.5 w-full rounded-full bg-brasil-blue" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group h-full rounded-3xl border p-4 text-left transition-all ${
        active
          ? 'border-brasil-blue bg-brasil-blue text-white shadow-sm shadow-brasil-blue/10'
          : 'border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-brasil-blue/40 hover:bg-brasil-blue/5 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`rounded-2xl p-3 transition-colors ${
            active
              ? 'bg-white/15 text-white'
              : 'bg-slate-100 text-brasil-blue group-hover:bg-brasil-blue/10'
          }`}
        >
          {icon}
        </div>
        <p className={`text-base font-bold ${active ? 'text-white' : 'text-slate-900'}`}>
          {label}
        </p>
      </div>
    </button>
  );
}
