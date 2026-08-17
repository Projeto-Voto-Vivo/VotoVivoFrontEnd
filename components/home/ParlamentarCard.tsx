import Image from 'next/image';
import Link from 'next/link';
import { Parlamentar } from '@/types';

interface ParlamentarCardProps {
  parlamentar: Parlamentar;
}

function getCargoBadge(cargo?: string | null) {
  const normalizedCargo = cargo?.toLowerCase() ?? '';

  if (normalizedCargo.includes('senador')) {
    return {
      label: 'Senador',
      className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    };
  }

  if (normalizedCargo.includes('deputado')) {
    return {
      label: 'Deputado federal',
      className: 'border-brasil-blue/20 bg-blue-50 text-brasil-blue',
    };
  }

  return {
    label: 'Parlamentar',
    className: 'border-slate-200 bg-slate-50 text-slate-600',
  };
}

export function ParlamentarCard({ parlamentar }: ParlamentarCardProps) {
  const cargoBadge = getCargoBadge(parlamentar.cargo);

  return (
    <Link
      href={`/parlamentares/${parlamentar.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:border-brasil-blue/30 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-900/80 to-transparent" />

        <span
          className={`absolute left-2 top-2 z-20 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] shadow-sm sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-[10px] sm:tracking-[0.16em] ${cargoBadge.className}`}
        >
          {cargoBadge.label}
        </span>

        <Image
          src={parlamentar.urlFoto}
          alt={parlamentar.nomeParlamentar}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />

        <div className="absolute bottom-0 left-0 z-20 w-full p-2 sm:p-4">
          <p className="line-clamp-2 text-sm font-bold leading-tight text-white sm:truncate sm:text-lg">
            {parlamentar.nomeParlamentar}
          </p>
          <p className="mt-0.5 hidden text-xs font-medium uppercase tracking-wider text-slate-300 sm:block">
            {parlamentar.casaLegislativa ?? parlamentar.cargo ?? 'Poder Legislativo'}
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between bg-white px-3 py-2 sm:p-4">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:text-[10px]">
            Partido
          </span>
          <span className="mt-0.5 rounded border border-slate-100 bg-slate-50 px-1.5 py-0.5 text-xs font-bold text-slate-700 sm:mt-1 sm:px-2 sm:py-1 sm:text-sm">
            {parlamentar.siglaPartido}
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:text-[10px]">
            Estado
          </span>
          <span className="mt-0.5 text-xs font-bold text-slate-700 sm:mt-1 sm:text-sm">
            {parlamentar.uf}
          </span>
        </div>
      </div>
    </Link>
  );
}
