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
          className={`absolute left-3 top-3 z-20 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] shadow-sm ${cargoBadge.className}`}
        >
          {cargoBadge.label}
        </span>

        <Image
          src={parlamentar.urlFoto}
          alt={parlamentar.nomeParlamentar}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />

        <div className="absolute bottom-0 left-0 z-20 w-full p-4">
          <p className="truncate text-lg font-bold leading-tight text-white">
            {parlamentar.nomeParlamentar}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-300">
            {parlamentar.casaLegislativa ?? parlamentar.cargo ?? 'Poder Legislativo'}
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between bg-white p-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Partido
          </span>
          <span className="mt-1 rounded border border-slate-100 bg-slate-50 px-2 py-1 text-sm font-bold text-slate-700">
            {parlamentar.siglaPartido}
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Estado
          </span>
          <span className="mt-1 text-sm font-bold text-slate-700">{parlamentar.uf}</span>
        </div>
      </div>
    </Link>
  );
}
