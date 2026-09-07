import { getStatsTotalEmendas } from '@/services/parlamentares';

function formatBillions(value: number) {
  if (value === 0) return null;
  const bi = value / 1_000_000_000;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(bi * 1_000_000_000);
}

export async function StatsKPI() {
  const { totalPago } = await getStatsTotalEmendas();
  const valor = formatBillions(totalPago);

  if (!valor) return null;

  return (
    <section className="border-y border-slate-200 bg-brasil-blue">
      <div className="container mx-auto px-4 py-5 md:py-6">
        <p className="text-center text-sm leading-7 text-white/80 md:text-base">
          <span className="font-bold text-brasil-yellow text-lg md:text-2xl">
            {valor}
          </span>{' '}
          em emendas parlamentares foram destinados ao longo dos mandatos —{' '}
          <span className="font-semibold text-white">
            explore os perfis e veja quem está por trás dos números.
          </span>
        </p>
      </div>
    </section>
  );
}
