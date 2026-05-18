import { ReactNode } from 'react';

interface PanelButtonProps {
  active: boolean;
  icon: ReactNode;
  label: string;
  supporting: string;
  onClick: () => void;
}

export function PanelButton({
  active,
  icon,
  label,
  supporting,
  onClick,
}: PanelButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group rounded-2xl border p-4 text-left transition-all ${
        active
          ? 'border-brasil-blue bg-brasil-blue text-white shadow-sm'
          : 'border-slate-200 bg-white text-slate-700 hover:border-brasil-blue/40 hover:bg-brasil-blue/5'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`rounded-2xl p-3 ${
            active
              ? 'bg-white/15 text-white'
              : 'bg-slate-100 text-brasil-blue group-hover:bg-brasil-blue/10'
          }`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className={`font-semibold ${active ? 'text-white' : 'text-slate-900'}`}>
            {label}
          </p>
          <p
            className={`mt-1 text-sm leading-6 ${
              active ? 'text-white/85' : 'text-slate-500'
            }`}
          >
            {supporting}
          </p>
        </div>
      </div>
    </button>
  );
}