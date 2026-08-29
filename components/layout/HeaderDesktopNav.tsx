import Link from "next/link";
import { ChevronDown } from "lucide-react";

import {
  educacaoItems,
  parlamentaresItems,
} from "./headerData";

export function HeaderDesktopNav() {
  return (
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

      <div className="group relative cursor-pointer py-2">
        <button
          type="button"
          className="flex items-center gap-1 font-medium text-gray-700 transition-colors group-hover:text-brasil-blue"
          aria-haspopup="true"
        >
          Parlamentares

          <ChevronDown
            size={16}
            aria-hidden="true"
          />
        </button>

        <div className="invisible absolute left-0 top-full mt-1 w-56 rounded-md border border-gray-100 bg-white opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
          {parlamentaresItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-3 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-brasil-blue"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <Link
        href="/proposicoes"
        className="py-2 font-medium text-gray-700 transition-colors hover:text-brasil-blue"
      >
        Proposições
      </Link>

      <div className="group relative cursor-pointer py-2">
        <Link
          href="/educacao"
          className="flex items-center gap-1 font-medium text-gray-700 transition-colors group-hover:text-brasil-blue"
        >
          Educação

          <ChevronDown
            size={16}
            aria-hidden="true"
          />
        </Link>

        <div className="invisible absolute right-0 top-full mt-1 w-64 rounded-md border border-gray-100 bg-white opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
          {educacaoItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 text-sm transition-colors hover:bg-blue-50 hover:text-brasil-blue ${
                index === 0
                  ? "border-b border-gray-100 font-semibold text-brasil-blue"
                  : "text-gray-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <Link
        href="/projeto"
        className="py-2 font-medium text-gray-700 transition-colors hover:text-brasil-blue"
      >
        Sobre
      </Link>
    </nav>
  );
}