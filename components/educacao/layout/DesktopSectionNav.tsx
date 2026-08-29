import type { ReactNode } from "react";

interface SectionMenuItem {
  name: string;
  id: string;
  icon: ReactNode;
}

interface DesktopSectionNavProps {
  items: SectionMenuItem[];
}

export function DesktopSectionNav({
  items,
}: DesktopSectionNavProps) {
  return (
    <nav
      aria-label="Seções da página"
      className="space-y-0.5 border-l border-slate-200 pl-2"
    >
      <p className="mb-4 pl-4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
        Sumário
      </p>

      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="group -ml-px flex items-center gap-2.5 border-l-2 border-transparent px-4 py-2 text-[13px] font-medium text-slate-500 transition-all hover:border-blue-600 hover:text-blue-600"
        >
          <span className="text-slate-400 transition-colors group-hover:text-blue-500">
            {item.icon}
          </span>

          <span>{item.name}</span>
        </a>
      ))}
    </nav>
  );
}