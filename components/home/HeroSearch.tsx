'use client';

import { memo, useCallback, useState, type ChangeEvent, type ComponentType, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Database, FileText, Landmark, Scale, Search, TrendingUp, Users } from 'lucide-react';

const SatelliteIcon = memo(
  ({
    Icon,
    position,
    bgColor = 'bg-white',
    iconColor,
    size = 'w-7 h-7',
    padding = 'p-5',
  }: {
    Icon: ComponentType<{ className?: string }>;
    position: string;
    bgColor?: string;
    iconColor: string;
    size?: string;
    padding?: string;
  }) => (
    <div
      className={`absolute ${position} ${bgColor} ${padding} z-10 rounded-full border border-gray-200 shadow-xl transition-transform duration-300 hover:scale-110 hover:shadow-2xl`}
      role="presentation"
      aria-hidden="true"
    >
      <Icon className={`${iconColor} ${size}`} />
    </div>
  ),
);
SatelliteIcon.displayName = 'SatelliteIcon';

const OrbitRing = memo(({ size, opacity = 'opacity-100' }: { size: string; opacity?: string }) => (
  <div
    className={`absolute ${size} rounded-full border border-gray-300 ${opacity}`}
    role="presentation"
    aria-hidden="true"
    style={{ willChange: 'transform' }}
  />
));
OrbitRing.displayName = 'OrbitRing';

export function HeroSearch() {
  const [termo, setTermo] = useState('');
  const router = useRouter();

  const handleSearch = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const query = termo.trim();
      router.push(query ? `/parlamentares?nome=${encodeURIComponent(query)}` : '/parlamentares');
    },
    [router, termo],
  );

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTermo(e.target.value);
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-gray-200 bg-slate-50 py-20 md:py-28" aria-label="Seção de busca principal">
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="max-w-2xl space-y-8 text-left">
            <header className="space-y-4">
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-6xl">
                A casa dos dados abertos do <br />
                <span className="text-brasil-blue">Poder Legislativo.</span>
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-gray-600">Fiscalize mandatos, acompanhe gastos e analise votações.</p>
            </header>

            <div className="inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white px-5 py-2.5 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md" role="status" aria-label="Estatística de parlamentares monitorados">
              <span className="text-2xl font-bold text-brasil-green" aria-label="513 parlamentares">513</span>
              <div className="h-5 w-px bg-gray-300" aria-hidden="true"></div>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Parlamentares monitorados</span>
            </div>

            <form
              onSubmit={handleSearch}
              className="mt-4 flex max-w-xl overflow-hidden rounded-lg bg-white shadow-xl shadow-blue-900/5 transition-shadow duration-300 hover:shadow-2xl focus-within:ring-2 focus-within:ring-brasil-blue focus-within:ring-offset-2 focus-within:shadow-2xl"
              role="search"
              aria-label="Busca de parlamentares"
            >
              <label htmlFor="search-input" className="sr-only">Busque por nome, partido ou estado</label>
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
                className="flex h-16 items-center gap-2 bg-brasil-blue px-10 text-lg font-bold text-white transition-all duration-300 hover:gap-3 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brasil-blue active:scale-95"
                aria-label="Buscar parlamentar"
              >
                <Search size={22} strokeWidth={3} aria-hidden="true" />
                <span>Buscar</span>
              </button>
            </form>
          </div>

          <div className="relative hidden h-[600px] select-none items-center justify-center scale-90 pointer-events-none md:flex lg:scale-100" role="img" aria-label="Visualização gráfica representando dados interconectados do poder legislativo">
            <div className="absolute inset-0 flex items-center justify-center opacity-30" aria-hidden="true">
              <div className="absolute h-px w-[140%] rotate-45 bg-gray-400" style={{ willChange: 'transform' }}></div>
              <div className="absolute h-px w-[140%] -rotate-45 bg-gray-400" style={{ willChange: 'transform' }}></div>
            </div>
            <OrbitRing size="h-[280px] w-[280px]" />
            <OrbitRing size="h-[450px] w-[450px]" opacity="opacity-60" />
            <OrbitRing size="h-[650px] w-[650px]" opacity="opacity-40" />
            <div className="absolute z-20 flex h-36 w-36 animate-pulse items-center justify-center rounded-full border-4 border-white bg-brasil-green shadow-2xl shadow-green-900/20" style={{ willChange: 'transform', animationDuration: '3s' }} role="presentation" aria-hidden="true">
              <Database className="h-16 w-16 text-white" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <SatelliteIcon Icon={Landmark} position="top-24 right-20" iconColor="text-brasil-blue" />
            <SatelliteIcon Icon={TrendingUp} position="bottom-32 left-16" iconColor="text-brasil-yellow" />
            <SatelliteIcon Icon={FileText} position="top-32 left-24" iconColor="text-gray-500" />
            <SatelliteIcon Icon={Users} position="top-1/2 -right-8 -translate-y-1/2 transform" bgColor="bg-brasil-blue" iconColor="text-white" size="h-6 w-6" padding="p-4" />
            <SatelliteIcon Icon={Scale} position="bottom-20 right-40" iconColor="text-brasil-green" size="h-6 w-6" padding="p-4" />
            <SatelliteIcon Icon={BarChart} position="top-1/2 left-0 -translate-y-1/2 transform" iconColor="text-orange-400" size="h-6 w-6" padding="p-4" />
          </div>
        </div>
      </div>
    </section>
  );
}
