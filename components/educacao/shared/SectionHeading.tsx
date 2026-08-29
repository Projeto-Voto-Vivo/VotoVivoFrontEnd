import type { ReactNode } from "react";

interface SectionHeadingProps {
  title: string;
  children?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function SectionHeading({
  title,
  children,
  icon,
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`mx-auto mb-10 max-w-3xl text-center sm:mb-16 ${className}`}
    >
      {icon && (
        <div className="mb-4 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            {icon}
          </div>
        </div>
      )}

      <h2 className="mb-4 text-3xl font-black tracking-tighter text-slate-900 sm:text-4xl">
        {title}
      </h2>

      {children && (
        <div className="text-base leading-relaxed text-slate-500 sm:text-lg">
          {children}
        </div>
      )}
    </div>
  );
}