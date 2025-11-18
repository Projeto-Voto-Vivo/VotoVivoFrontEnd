import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full bg-white border-b-4 border-brasil-green sticky top-0 z-50">
      <div className="bg-neutral-50 py-1 px-4 text-xs text-gray-500 flex justify-between container mx-auto">
        <span>Dados abertos da Câmara dos Deputados</span>
        <span className="text-brasil-blue font-bold">BRASIL 2026</span>
      </div>

      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-2 text-3xl font-extrabold text-brasil-blue tracking-tighter">
           VotoVivo<span className="text-brasil-yellow">.</span>leg
        </div>

        <nav className="hidden md:flex gap-8">
          <Link href="/" className="font-medium text-gray-700 hover:text-brasil-blue py-2 transition-colors">
            Início
          </Link>
          
          <div className="group relative cursor-pointer py-2">
            <div className="flex items-center gap-1 font-medium text-gray-700 group-hover:text-brasil-blue transition-colors">
              Parlamentares <ChevronDown size={16} />
            </div>
            <div className="absolute top-full left-0 mt-1 w-48 bg-white shadow-xl border border-gray-100 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <Link href="/deputados" className="block px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-brasil-blue">
                Lista Completa
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}