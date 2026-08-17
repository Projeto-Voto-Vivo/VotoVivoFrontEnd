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
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {indicadores.map((indicador) => (
        <div
          key={indicador.titulo}
          className={`relative overflow-hidden rounded-3xl border p-4 shadow-sm md:p-5 ${indicatorStyles(indicador.destaque)}`}
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brasil-blue via-brasil-green to-brasil-yellow" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 md:text-[11px]">
            {indicador.titulo}
          </p>
          <p className="mt-3 text-2xl font-bold text-slate-900 md:mt-4 md:text-3xl">{indicador.valor}</p>
          {indicador.apoio && (
            <p className="mt-1 text-xs text-slate-500">{indicador.apoio}</p>
          )}
        </div>
      ))}
    </section>
  );
}
