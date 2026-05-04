'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Deputado } from '@/types';

interface DeputadoCardProps {
  deputado: Deputado;
}

export function DeputadoCard({ deputado }: DeputadoCardProps) {
  return (
    <Link
      key={deputado.id}
      href={`/parlamentares/${deputado.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:border-brasil-blue/30 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-900/80 to-transparent" />

        <Image
          src={deputado.urlFoto}
          alt={deputado.nomeParlamentar}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />

        <div className="absolute bottom-0 left-0 z-20 w-full p-4">
          <p className="truncate text-lg font-bold leading-tight text-white">{deputado.nomeParlamentar}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-300">
            {deputado.cargo ?? 'Parlamentar'}
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between bg-white p-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Partido</span>
          <span className="mt-1 rounded border border-slate-100 bg-slate-50 px-2 py-1 text-sm font-bold text-slate-700">
            {deputado.siglaPartido}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Estado</span>
          <span className="mt-1 text-sm font-bold text-slate-700">{deputado.uf}</span>
        </div>
      </div>
    </Link>
  );
}
