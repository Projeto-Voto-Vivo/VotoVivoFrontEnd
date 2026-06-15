import { PerfilIndicador } from '@/types';

function indicatorStyles(destaque?: PerfilIndicador['destaque']) {
  if (destaque === 'positivo') return 'border-brasil-green/20 bg-brasil-green/5';
  if (destaque === 'atencao') return 'border-amber-200 bg-amber-50';
  return 'border-slate-200 bg-white';
}

interface ParlamentarIndicatorsProps {
  indicadores: PerfilIndicador[];
}

export function ParlamentarIndicators({
  indicadores,
}: ParlamentarIndicatorsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {indicadores.map((indicador) => (
        <div
          key={indicador.titulo}
          className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm ${indicatorStyles(indicador.destaque)}`}
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brasil-blue via-brasil-green to-brasil-yellow" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {indicador.titulo}
          </p>
          <p className="mt-4 text-3xl font-bold text-slate-900">{indicador.valor}</p>
        </div>
      ))}
    </section>
  );
}
