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
      // `busca` procura o termo em nome, partido e UF. Antes ia só para
      // `nome`, então "PT" e "SP" nunca encontravam ninguém.
      router.push(
        query
          ? `/parlamentares?busca=${encodeURIComponent(query)}`
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
                A casa dos dados abertos do
                <br className="hidden md:block" />{" "}
                <span className="text-brasil-blue">Poder Legislativo.</span>
              </h1>

              <p className="max-w-lg text-lg leading-relaxed text-gray-600">
                Fiscalize mandatos, acompanhe gastos e analise votações.
              </p>
            </header>


            <form
              onSubmit={handleSearch}
              className="mt-2 flex w-full max-w-xl flex-col gap-3 rounded-lg transition-shadow duration-300 sm:flex-row sm:gap-0 sm:overflow-hidden sm:bg-white sm:shadow-xl sm:shadow-blue-900/5 sm:hover:shadow-2xl sm:focus-within:ring-2 sm:focus-within:ring-brasil-blue sm:focus-within:ring-offset-2 sm:focus-within:shadow-2xl"
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
                className="h-14 min-w-0 w-full rounded-lg bg-white px-5 text-base text-gray-900 shadow-xl shadow-blue-900/5 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-brasil-blue focus:ring-offset-2 sm:h-16 sm:grow sm:rounded-none sm:pl-6 sm:text-lg sm:shadow-none sm:focus:ring-0 sm:focus:ring-offset-0"
              />

              <button
                type="submit"
                className="flex h-14 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-brasil-blue px-6 text-base font-bold text-white transition-all duration-300 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-brasil-blue focus:ring-offset-2 active:scale-[0.98] sm:h-16 sm:w-auto sm:justify-start sm:rounded-none sm:px-10 sm:text-lg sm:hover:gap-3 sm:focus:ring-white sm:focus:ring-offset-2 sm:focus:ring-offset-brasil-blue sm:active:scale-95"
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