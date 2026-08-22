"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, Search, X } from "lucide-react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isParlamentaresOpen, setIsParlamentaresOpen] = useState(false);

  function openMobileMenu() {
    setIsMobileMenuOpen(true);
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
    setIsParlamentaresOpen(false);
  }

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);

      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* =====================================================
          HEADER
      ====================================================== */}
      <header className="sticky top-0 z-50 w-full border-b-4 border-brasil-green bg-white">
        {/* Barra superior */}
        <div className="container mx-auto flex justify-between bg-neutral-50 px-4 py-1 text-xs text-gray-500">
          <span>Dados abertos do Poder Legislativo</span>

          <span className="font-bold text-brasil-blue">
            BRASIL 2026
          </span>
        </div>

        {/* Área principal */}
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          {/* =================================================
              BUSCA MOBILE
          ================================================== */}
          <Link
            href="/parlamentares"
            className="grid min-h-11 min-w-11 place-items-center rounded-full text-brasil-blue transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brasil-blue md:hidden"
            aria-label="Buscar parlamentares"
          >
            <Search
              size={24}
              aria-hidden="true"
            />
          </Link>

          {/* =================================================
              LOGO
          ================================================== */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="text-3xl font-extrabold tracking-tighter text-brasil-blue"
          >
            VotoVivo
          </Link>

          {/* =================================================
              NAVEGAÇÃO DESKTOP
          ================================================== */}
          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Navegação principal"
          >
            <Link
              href="/"
              className="py-2 font-medium text-gray-700 transition-colors hover:text-brasil-blue"
            >
              Início
            </Link>

            {/* Parlamentares */}
            <div className="group relative cursor-pointer py-2">
              <button
                type="button"
                className="flex items-center gap-1 font-medium text-gray-700 transition-colors group-hover:text-brasil-blue"
              >
                Parlamentares

                <ChevronDown
                  size={16}
                  aria-hidden="true"
                />
              </button>

              <div className="invisible absolute left-0 top-full mt-1 w-56 rounded-md border border-gray-100 bg-white opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                <Link
                  href="/parlamentares"
                  className="block px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-brasil-blue"
                >
                  Lista completa
                </Link>

                <Link
                  href="/parlamentares?tipo=deputados"
                  className="block px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-brasil-blue"
                >
                  Deputados federais
                </Link>

                <Link
                  href="/parlamentares?tipo=senadores"
                  className="block px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-brasil-blue"
                >
                  Senadores
                </Link>
              </div>
            </div>

            <Link
              href="/proposicoes"
              className="py-2 font-medium text-gray-700 transition-colors hover:text-brasil-blue"
            >
              Proposições
            </Link>

            <Link
              href="/educacao"
              className="py-2 font-medium text-gray-700 transition-colors hover:text-brasil-blue"
            >
              Educação
            </Link>

            <Link
              href="/projeto"
              className="py-2 font-medium text-gray-700 transition-colors hover:text-brasil-blue"
            >
              Sobre
            </Link>
          </nav>

          {/* =================================================
              MENU MOBILE
          ================================================== */}
          <button
            type="button"
            onClick={openMobileMenu}
            className="grid min-h-11 min-w-11 place-items-center rounded-md text-brasil-blue transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brasil-blue md:hidden"
            aria-label="Abrir menu de navegação"
            aria-controls="mobile-navigation"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu
              size={27}
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </button>
        </div>
      </header>

      {/* =====================================================
          DRAWER MOBILE
      ====================================================== */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <button
            type="button"
            className="fixed inset-0 z-[90] cursor-default bg-slate-950/50 md:hidden"
            aria-label="Fechar menu"
            onClick={closeMobileMenu}
          />

          {/* Drawer */}
          <aside
            id="mobile-navigation"
            className="fixed bottom-0 right-0 top-0 z-[100] flex w-[min(86vw,21rem)] flex-col overflow-y-auto overscroll-contain bg-white p-6 shadow-[-12px_0_32px_rgba(15,23,42,0.2)] md:hidden"
            aria-label="Navegação principal"
          >
            {/* Cabeçalho do drawer */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-5">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="text-2xl font-extrabold tracking-tighter text-brasil-blue"
              >
                VotoVivo
              </Link>

              <button
                type="button"
                onClick={closeMobileMenu}
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

            {/* =================================================
                NAVEGAÇÃO MOBILE
            ================================================== */}
            <nav
              className="py-6"
              aria-label="Menu mobile"
            >
              <ul className="space-y-2">
                {/* Início */}
                <li>
                  <Link
                    href="/"
                    onClick={closeMobileMenu}
                    className="flex min-h-12 items-center rounded-md px-3 text-lg font-semibold text-slate-800 transition-colors hover:bg-blue-50 hover:text-brasil-blue"
                  >
                    Início
                  </Link>
                </li>

                {/* Parlamentares */}
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      setIsParlamentaresOpen(
                        (isOpen) => !isOpen
                      )
                    }
                    className="flex min-h-12 w-full items-center justify-between rounded-md px-3 text-left text-lg font-semibold text-slate-800 transition-colors hover:bg-blue-50 hover:text-brasil-blue"
                    aria-expanded={isParlamentaresOpen}
                    aria-controls="mobile-parlamentares-submenu"
                  >
                    <span>Parlamentares</span>

                    <ChevronDown
                      size={22}
                      className={`transition-transform duration-200 ${
                        isParlamentaresOpen
                          ? "rotate-180"
                          : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {/* Submenu */}
                  {isParlamentaresOpen && (
                    <ul
                      id="mobile-parlamentares-submenu"
                      className="mt-1 space-y-1 border-l-2 border-brasil-green pl-3"
                    >
                      <li>
                        <Link
                          href="/parlamentares"
                          onClick={closeMobileMenu}
                          className="flex min-h-11 items-center rounded-md px-3 text-base text-gray-600 hover:bg-blue-50 hover:text-brasil-blue"
                        >
                          Lista completa
                        </Link>
                      </li>

                      <li>
                        <Link
                          href="/parlamentares?tipo=deputados"
                          onClick={closeMobileMenu}
                          className="flex min-h-11 items-center rounded-md px-3 text-base text-gray-600 hover:bg-blue-50 hover:text-brasil-blue"
                        >
                          Deputados federais
                        </Link>
                      </li>

                      <li>
                        <Link
                          href="/parlamentares?tipo=senadores"
                          onClick={closeMobileMenu}
                          className="flex min-h-11 items-center rounded-md px-3 text-base text-gray-600 hover:bg-blue-50 hover:text-brasil-blue"
                        >
                          Senadores
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Proposições */}
                <li>
                  <Link
                    href="/proposicoes"
                    onClick={closeMobileMenu}
                    className="flex min-h-12 items-center rounded-md px-3 text-lg font-semibold text-slate-800 transition-colors hover:bg-blue-50 hover:text-brasil-blue"
                  >
                    Proposições
                  </Link>
                </li>

                {/* Educação */}
                <li>
                  <Link
                    href="/educacao"
                    onClick={closeMobileMenu}
                    className="flex min-h-12 items-center rounded-md px-3 text-lg font-semibold text-slate-800 transition-colors hover:bg-blue-50 hover:text-brasil-blue"
                  >
                    Educação
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Rodapé */}
            <div className="mt-auto border-t border-gray-200 pt-5">
              <p className="px-3 text-sm leading-5 text-gray-500">
                Dados abertos do Poder Legislativo
              </p>
              {/* Sobre */}
                  <Link
                    href="/projeto"
                    onClick={closeMobileMenu}
                    className="flex min-h-12 items-center rounded-md px-3 text-lg font-semibold text-slate-800 hover:bg-blue-50 hover:text-brasil-blue"
                  >
                    Sobre o projeto
                  </Link>
            </div>
          </aside>
        </>
      )}
    </>
  );
}