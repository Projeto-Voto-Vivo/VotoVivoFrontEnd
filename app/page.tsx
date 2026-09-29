export const dynamic = 'force-dynamic';

import { HeroSearch } from '@/components/home/HeroSearch';
import { StatsKPI } from '@/components/home/StatsKPI';
import { EstadoCard } from '@/components/home/EstadoCard';
import { CarrosselParlamentar } from '@/components/home/CarrosselParlamentar';
import { Destaques } from '@/components/home/Destaques';
import { getRankingDespesas, getRankingEmendas } from '@/services/parlamentares';

export default async function Home() {
  const [rankingDespesas, rankingEmendas] = await Promise.all([
    getRankingDespesas(10),
    getRankingEmendas(10),
  ]);

  const temDados = rankingDespesas.length > 0 || rankingEmendas.length > 0;

  return (
    <>
      {/* 1. Hero / busca principal */}
      <HeroSearch />

      {/* 2. KPI contextualizado */}
      <StatsKPI />

      {/* 3. EstadoCard (só no celular) + Carrossel */}
      {temDados && (
        <section className="bg-slate-50 py-10 md:py-14">
          <div className="container mx-auto grid gap-6 px-4">
            {/*
              A partir do md o mapa do hero já faz a escolha do estado, então
              o seletor só aparece no celular, onde o mapa fica escondido.
            */}
            <div className="md:hidden">
              <EstadoCard />
            </div>

            <CarrosselParlamentar
              rankingDespesas={rankingDespesas}
              rankingEmendas={rankingEmendas}
            />
          </div>
        </section>
      )}

      {/* 4. Preview de parlamentares */}
      <Destaques />
    </>
  );
}
