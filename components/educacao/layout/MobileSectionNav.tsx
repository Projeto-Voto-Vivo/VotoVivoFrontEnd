"use client";

import { useState, ReactNode } from "react";
import {
  ChevronDown,
  ChevronRight,
  Layers,
} from "lucide-react";

interface MenuItem {
  name: string;
  id: string;
  icon: ReactNode;
}

interface Props {
  items: MenuItem[];
}

export function MobileSectionNav({ items }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const navigateToSection = (id: string) => {
    setIsOpen(false);

    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <div
        id="mobile-section-menu"
        className={`fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-slate-200 bg-white shadow-[0_-12px_40px_rgba(15,23,42,0.16)] transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          paddingBottom:
            "max(1rem, env(safe-area-inset-bottom))",
        }}
        aria-hidden={!isOpen}
      >
        <div className="mx-auto max-h-[75dvh] w-full max-w-lg overflow-y-auto p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                Navegação
              </p>

              <h2 className="mt-1 text-lg font-black text-slate-900">
                Ir para uma seção
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Fechar navegação"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-600 transition-colors hover:bg-slate-200"
            >
              ×
            </button>
          </div>

          <nav
            aria-label="Seções da página"
            className="grid gap-2"
          >
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateToSection(item.id)}
                className="flex min-h-12 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  {item.icon}
                </span>

                <span>{item.name}</span>

                <ChevronRight
                  size={17}
                  className="ml-auto shrink-0 text-slate-400"
                />
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-30 lg:hidden"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="mx-auto w-full max-w-lg px-3 pb-3">
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            aria-expanded={isOpen}
            aria-controls="mobile-section-menu"
            className="flex min-h-14 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white/95 px-4 text-left shadow-[0_8px_30px_rgba(15,23,42,0.16)] backdrop-blur-md transition-transform active:scale-[0.99]"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Layers size={18} />
              </span>

              <span>
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Página longa
                </span>

                <span className="block text-sm font-bold text-slate-800">
                  Navegar pelas seções
                </span>
              </span>
            </span>

            <ChevronDown
              size={20}
              className={`text-slate-500 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </>
  );
}