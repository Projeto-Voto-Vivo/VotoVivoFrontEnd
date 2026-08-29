"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

import {
  educacaoItems,
  parlamentaresItems,
} from "./headerData";

interface HeaderMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HeaderMobileDrawer({
  isOpen,
  onClose,
}: HeaderMobileDrawerProps) {
  const [isParlamentaresOpen, setIsParlamentaresOpen] = useState(false);
  const [isEducacaoOpen, setIsEducacaoOpen] = useState(false);

  function closeDrawer() {
    setIsParlamentaresOpen(false);
    setIsEducacaoOpen(false);
    onClose();
  }

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[90] cursor-default bg-slate-950/50 md:hidden"
        aria-label="Fechar menu"
        onClick={closeDrawer}
      />

      <aside
        id="mobile-navigation"
        className="fixed bottom-0 right-0 top-0 z-[100] flex w-[min(86vw,21rem)] flex-col overflow-y-auto overscroll-contain bg-white p-6 shadow-[-12px_0_32px_rgba(15,23,42,0.2)] md:hidden"
        aria-label="Navegação principal"
      >
        <div className="flex items-center justify-between border-b border-gray-200 pb-5">
          <Link
            href="/"
            onClick={closeDrawer}
            className="text-2xl font-extrabold tracking-tighter text-brasil-blue"
          >
            VotoVivo
          </Link>

          <button
            type="button"
            onClick={closeDrawer}
            className="grid min-h-11 min-w-11 place-items-center rounded-full text-brasil-blue transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brasil-blue"
            aria-label="Fechar menu"
          >
            <X
              size={27}
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </button>
        </div>

        <nav
          className="py-6"
          aria-label="Menu mobile"
        >
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                onClick={closeDrawer}
                className="flex min-h-12 items-center rounded-md px-3 text-lg font-semibold text-slate-800 transition-colors hover:bg-blue-50 hover:text-brasil-blue"
              >
                Início
              </Link>
            </li>

            <li>
              <button
                type="button"
                onClick={() =>
                  setIsParlamentaresOpen((isOpen) => !isOpen)
                }
                className="flex min-h-12 w-full items-center justify-between rounded-md px-3 text-left text-lg font-semibold text-slate-800 transition-colors hover:bg-blue-50 hover:text-brasil-blue"
                aria-expanded={isParlamentaresOpen}
                aria-controls="mobile-parlamentares-submenu"
              >
                <span>Parlamentares</span>

                <ChevronDown
                  size={22}
                  className={`transition-transform duration-200 ${
                    isParlamentaresOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {isParlamentaresOpen && (
                <ul
                  id="mobile-parlamentares-submenu"
                  className="mt-1 space-y-1 border-l-2 border-brasil-green pl-3"
                >
                  {parlamentaresItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={closeDrawer}
                        className="flex min-h-11 items-center rounded-md px-3 text-base text-gray-600 transition-colors hover:bg-blue-50 hover:text-brasil-blue"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li>
              <Link
                href="/proposicoes"
                onClick={closeDrawer}
                className="flex min-h-12 items-center rounded-md px-3 text-lg font-semibold text-slate-800 transition-colors hover:bg-blue-50 hover:text-brasil-blue"
              >
                Proposições
              </Link>
            </li>

            <li>
              <button
                type="button"
                onClick={() =>
                  setIsEducacaoOpen((isOpen) => !isOpen)
                }
                className="flex min-h-12 w-full items-center justify-between rounded-md px-3 text-left text-lg font-semibold text-slate-800 transition-colors hover:bg-blue-50 hover:text-brasil-blue"
                aria-expanded={isEducacaoOpen}
                aria-controls="mobile-educacao-submenu"
              >
                <span>Educação</span>

                <ChevronDown
                  size={22}
                  className={`transition-transform duration-200 ${
                    isEducacaoOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {isEducacaoOpen && (
                <ul
                  id="mobile-educacao-submenu"
                  className="mt-1 space-y-1 border-l-2 border-brasil-green pl-3"
                >
                  {educacaoItems.map((item, index) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={closeDrawer}
                        className={`flex min-h-11 items-center rounded-md px-3 text-base transition-colors hover:bg-blue-50 hover:text-brasil-blue ${
                          index === 0
                            ? "font-medium text-brasil-blue"
                            : "text-gray-600"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </nav>

        <div className="mt-auto border-t border-gray-200 pt-5">
          <p className="px-3 text-sm leading-5 text-gray-500">
            Dados abertos do Poder Legislativo
          </p>

          <Link
            href="/projeto"
            onClick={closeDrawer}
            className="flex min-h-12 items-center rounded-md px-3 text-lg font-semibold text-slate-800 transition-colors hover:bg-blue-50 hover:text-brasil-blue"
          >
            Sobre o projeto
          </Link>
        </div>
      </aside>
    </>
  );
}