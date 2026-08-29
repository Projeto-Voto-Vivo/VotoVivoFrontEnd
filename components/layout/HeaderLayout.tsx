"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Search } from "lucide-react";

import { HeaderDesktopNav } from "./HeaderDesktopNav";
import { HeaderMobileDrawer } from "./HeaderMobileDrawer";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function openMobileMenu() {
    setIsMobileMenuOpen(true);
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
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
      <header className="sticky top-0 z-50 w-full border-b-4 border-brasil-green bg-white">
        <div className="container mx-auto flex justify-between bg-neutral-50 px-4 py-1 text-xs text-gray-500">
          <span>Dados abertos do Poder Legislativo</span>

          <span className="font-bold text-brasil-blue">
            BRASIL 2026
          </span>
        </div>

        <div className="container mx-auto flex h-20 items-center justify-between px-4">
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

          <Link
            href="/"
            onClick={closeMobileMenu}
            className="text-3xl font-extrabold tracking-tighter text-brasil-blue"
          >
            VotoVivo
          </Link>

          <HeaderDesktopNav />

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

      <HeaderMobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
      />
    </>
  );
}