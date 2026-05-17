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
          className={`rounded-3xl border p-5 shadow-sm ${indicatorStyles(indicador.destaque)}`}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {indicador.titulo}
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{indicador.valor}</p>
          {indicador.apoio && (
            <p className="mt-2 text-sm leading-6 text-slate-500">{indicador.apoio}</p>
          )}
        </div>
      ))}
    </section>
  );
}