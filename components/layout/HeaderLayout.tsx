import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-brasil-green bg-white">
      <div className="container mx-auto flex justify-between bg-neutral-50 px-4 py-1 text-xs text-gray-500">
        <span>Dados abertos do Poder Legislativo</span>
        <span className="font-bold text-brasil-blue">BRASIL 2026</span>
      </div>

      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-3xl font-extrabold tracking-tighter text-brasil-blue">
          VotoVivo<span className="text-brasil-yellow">.</span>leg
        </Link>

        <nav className="hidden gap-8 md:flex">
          <Link href="/" className="py-2 font-medium text-gray-700 transition-colors hover:text-brasil-blue">
            Início
          </Link>

          <div className="group relative cursor-pointer py-2">
            <div className="flex items-center gap-1 font-medium text-gray-700 transition-colors group-hover:text-brasil-blue">
              Parlamentares <ChevronDown size={16} />
            </div>
            <div className="invisible absolute left-0 top-full mt-1 w-48 rounded-md border border-gray-100 bg-white opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <Link href="/parlamentares" className="block px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-brasil-blue">
                Lista completa
              </Link>
            </div>
          </div>
          <Link href="/educacao" className="py-2 font-medium text-gray-700 transition-colors hover:text-brasil-blue">
            Educação Política
          </Link>
          <Link href="/projeto" className="py-2 font-medium text-gray-700 transition-colors hover:text-brasil-blue">
            O projeto
          </Link>
        </nav>
      </div>
    </header>
  );
}
