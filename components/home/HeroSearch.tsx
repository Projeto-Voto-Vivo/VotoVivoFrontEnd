'use client';

import { useState, useCallback, memo } from 'react';
import { 
  Search, Database, FileText, Landmark, TrendingUp, Users, Scale, BarChart 
} from 'lucide-react';

const SatelliteIcon = memo(({ 
  Icon, 
  position, 
  bgColor = 'bg-white', 
  iconColor,
  size = 'w-7 h-7',
  padding = 'p-5'
}: { 
  Icon: any;
  position: string;
  bgColor?: string;
  iconColor: string;
  size?: string;
  padding?: string;
}) => (
  <div 
    className={`absolute ${position} ${bgColor} ${padding} rounded-full shadow-xl border border-gray-200 z-10 
    transition-transform duration-300 hover:scale-110 hover:shadow-2xl`}
    role="presentation"
    aria-hidden="true"
  >
    <Icon className={`${iconColor} ${size}`} />
  </div>
));

SatelliteIcon.displayName = 'SatelliteIcon';

const OrbitRing = memo(({ size, opacity = 'opacity-100' }: { size: string; opacity?: string }) => (
  <div 
    className={`absolute ${size} border border-gray-300 rounded-full ${opacity}`}
    role="presentation"
    aria-hidden="true"
    style={{ willChange: 'transform' }}
  />
));

OrbitRing.displayName = 'OrbitRing';

export function HeroSearch() {
  const [termo, setTermo] = useState('');

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (termo.trim()) {
      console.log('Buscando:', termo);
    }
  }, [termo]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTermo(e.target.value);
  }, []);

  return (
    <section 
      className="bg-slate-50 py-20 md:py-28 relative overflow-hidden border-b border-gray-200"
      aria-label="Seção de busca principal"
    >
      <div className="container mx-auto px-4 relative z-10">
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          <div className="text-left space-y-8 max-w-2xl">
            
            <header className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                A casa dos dados abertos do <br />
                <span className="text-brasil-blue">Poder Legislativo.</span>
              </h1>
              
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                Fiscalize mandatos, acompanhe gastos e analise votações. 
              </p>
            </header>

            <div 
              className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-gray-200 shadow-sm 
              transition-all duration-300 hover:shadow-md hover:scale-105"
              role="status"
              aria-label="Estatística de parlamentares monitorados"
            >
              <span className="text-2xl font-bold text-brasil-green" aria-label="513 parlamentares">513</span>
              <div className="h-5 w-px bg-gray-300" aria-hidden="true"></div>
              <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">
                Parlamentares Monitorados
              </span>
            </div>

            <form 
              onSubmit={handleSearch}
              className="flex shadow-xl shadow-blue-900/5 max-w-xl rounded-lg overflow-hidden bg-white mt-4
              transition-shadow duration-300 hover:shadow-2xl focus-within:shadow-2xl focus-within:ring-2 
              focus-within:ring-brasil-blue focus-within:ring-offset-2"
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
                className="grow h-16 pl-6 text-gray-900 bg-transparent outline-none 
                placeholder:text-gray-400 text-lg"
              />
              <button 
                type="submit"
                className="bg-brasil-blue hover:bg-blue-900 text-white px-10 font-bold text-lg 
                transition-all duration-300 h-16 flex items-center gap-2 hover:gap-3 
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 
                focus:ring-offset-brasil-blue active:scale-95"
                aria-label="Buscar parlamentar"
              >
                <Search size={22} strokeWidth={3} aria-hidden="true" />
                <span>Buscar</span>
              </button>
            </form>
          </div>

          <div 
            className="relative h-[600px] hidden md:flex items-center justify-center pointer-events-none 
            select-none scale-90 lg:scale-100"
            role="img"
            aria-label="Visualização gráfica representando dados interconectados do poder legislativo"
          >
            
            <div className="absolute inset-0 flex items-center justify-center opacity-30" aria-hidden="true">
              <div className="absolute w-[140%] h-px bg-gray-400 rotate-45" style={{ willChange: 'transform' }}></div>
              <div className="absolute w-[140%] h-px bg-gray-400 -rotate-45" style={{ willChange: 'transform' }}></div>
            </div>

            <OrbitRing size="w-[280px] h-[280px]" />
            <OrbitRing size="w-[450px] h-[450px]" opacity="opacity-60" />
            <OrbitRing size="w-[650px] h-[650px]" opacity="opacity-40" />

            <div 
              className="absolute w-36 h-36 bg-brasil-green rounded-full flex items-center justify-center 
              shadow-2xl shadow-green-900/20 z-20 border-4 border-white 
              animate-pulse"
              style={{ willChange: 'transform', animationDuration: '3s' }}
              role="presentation"
              aria-hidden="true"
            >
              <Database className="text-white w-16 h-16" strokeWidth={1.5} aria-hidden="true" />
            </div>

            <SatelliteIcon Icon={Landmark} position="top-24 right-20" iconColor="text-brasil-blue" />
            <SatelliteIcon Icon={TrendingUp} position="bottom-32 left-16" iconColor="text-brasil-yellow" />
            <SatelliteIcon Icon={FileText} position="top-32 left-24" iconColor="text-gray-500" />
            
            <SatelliteIcon 
              Icon={Users} 
              position="top-1/2 -right-8 transform -translate-y-1/2" 
              bgColor="bg-brasil-blue" 
              iconColor="text-white" 
              size="w-6 h-6"
              padding="p-4"
            />
            
            <SatelliteIcon 
              Icon={Scale} 
              position="bottom-20 right-40" 
              iconColor="text-brasil-green" 
              size="w-6 h-6"
              padding="p-4"
            />
            
            <SatelliteIcon 
              Icon={BarChart} 
              position="top-1/2 left-0 transform -translate-y-1/2" 
              iconColor="text-orange-400" 
              size="w-6 h-6"
              padding="p-4"
            />

          </div>

        </div>
      </div>
    </section>
  );
}