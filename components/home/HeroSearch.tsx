'use client';

import {useCallback, useState, type ChangeEvent, type FormEvent,} from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Search } from 'lucide-react';
import { BrasilHeroMap } from '@/components/home/BrasilHeroMap';

export function HeroSearch() {
  const [termo, setTermo] = useState('');
  const router = useRouter();

  const handleSearch = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const query = termo.trim();
      router.push(
        query
          ? `/parlamentares?nome=${encodeURIComponent(query)}`
          : '/parlamentares',
      );
    },
    [router, termo],
  );

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTermo(e.target.value);
  }, []);

  return (
    <section
      className="relative overflow-hidden border-b border-gray-200 bg-slate-50 py-12 md:py-16"
      aria-label="Seção de busca principal"
    >
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="max-w-2xl space-y-7 text-left">
            <header className="space-y-4">
              <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 md:text-6xl">
                A casa dos dados abertos do <br />
                <span className="text-brasil-blue">Poder Legislativo.</span>
              </h1>

              <p className="max-w-lg text-lg leading-relaxed text-gray-600">
                Fiscalize mandatos, acompanhe gastos e analise votações.
              </p>
            </header>


            <form
              onSubmit={handleSearch}
              className="mt-2 flex max-w-xl overflow-hidden rounded-lg bg-white shadow-xl shadow-blue-900/5 transition-shadow duration-300 hover:shadow-2xl focus-within:ring-2 focus-within:ring-brasil-blue focus-within:ring-offset-2 focus-within:shadow-2xl"
              role="search"
              aria-label="Busca de parlamentares"
            >
              <label htmlFor="search-input" className="sr-only">
                Busque por nome, partido ou estado
              </label>

              <input
                id="search-input"
                type="text"
                value={termo}
                onChange={handleInputChange}
                placeholder="Busque por nome, partido ou estado"
                className="h-16 grow bg-transparent pl-6 text-lg text-gray-900 outline-none placeholder:text-gray-400"
              />

              <button
                type="submit"
                className="flex h-16 items-center gap-2 bg-brasil-blue px-8 text-lg font-bold text-white transition-all duration-300 hover:gap-3 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brasil-blue active:scale-95 md:px-10"
                aria-label="Buscar parlamentar"
              >
                <Search size={22} strokeWidth={3} aria-hidden="true" />
                <span>Buscar</span>
              </button>
            </form>
          </div>

          <BrasilHeroMap />
        </div>
      </div>

      <a
        href="#destaques"
        className="group absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-brasil-blue focus:outline-none focus-visible:text-brasil-blue md:inline-flex"
        aria-label="Rolar para a seção de destaques"
      >
        <span className="text-[11px] uppercase tracking-[0.2em]">
          Explorar
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/90 shadow-sm transition-transform duration-300 group-hover:translate-y-1 motion-safe:animate-bounce">
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
        </span>
      </a>
    </section>
  );
}