export const dynamic = 'force-dynamic';

import { HeroSearch } from '@/components/home/HeroSearch';
import { StatsKPI } from '@/components/home/StatsKPI';
import { EstadoCard } from '@/components/home/EstadoCard';
import { CarrosselParlamentar } from '@/components/home/CarrosselParlamentar';
import { Destaques } from '@/components/home/Destaques';
import { getRankingDespesas, getRankingEmendas } from '@/services/parlamentares';

export default async function Home() {
  const [rankingDespesas, rankingEmendas] = await Promise.all([
    getRankingDespesas(2),
    getRankingEmendas(2),
  ]);

  const temDados = rankingDespesas.length > 0 || rankingEmendas.length > 0;

  return (
    <>
      {/* 1. Hero / busca principal */}
      <HeroSearch />

      {/* 2. KPI contextualizado */}
      <StatsKPI />

      {/* 3. EstadoCard + Carrossel lado a lado */}
      {temDados && (
        <section className="bg-slate-50 py-10 md:py-14">
          <div className="container mx-auto px-4">
            <div className="grid items-stretch gap-6 md:grid-cols-[1fr_1.6fr]">
              {/* Esquerda — Qual parlamentar te representa */}
              <EstadoCard />

              {/* Direita — Carrossel dinâmico */}
              <CarrosselParlamentar
                rankingDespesas={rankingDespesas}
                rankingEmendas={rankingEmendas}
              />
            </div>
          </div>
        </section>
      )}

      {/* 4. Preview de parlamentares */}
      <Destaques />
    </>
  );
}
