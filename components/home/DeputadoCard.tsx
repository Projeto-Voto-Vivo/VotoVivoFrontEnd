'use client';

import Link from 'next/link';
import { Deputado } from '@/types';

interface DeputadoCardProps {
    deputado: Deputado;
}

export function DeputadoCard({ deputado }: DeputadoCardProps) {
    return (
        <Link 
            key={deputado.id}
            href={`/deputados/${deputado.id}`}
            className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-brasil-blue/30 transition-all duration-300"
        >
            <div className="aspect-4/3 overflow-hidden bg-slate-100 relative">

                <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent z-10" />

                <img 
                    src={deputado.urlFoto} 
                    alt={deputado.nome}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/400x300/e2e8f0/808080?text=Sem+Foto';
                        e.currentTarget.onerror = null; 
                    }}
                />
                
                <div className="absolute bottom-0 left-0 p-4 z-20 w-full">
                    <p className="text-white font-bold text-lg leading-tight truncate">
                        {deputado.nome}
                    </p>
                    <p className="text-slate-300 text-xs font-medium uppercase tracking-wider mt-1">
                        Deputado Federal
                    </p>
                </div>
            </div>
            
            <div className="p-4 flex justify-between items-center bg-white">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Partido</span>
                    <span className="text-sm font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-100 mt-1">
                        {deputado.siglaPartido}
                    </span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Estado</span>
                    <span className="text-sm font-bold text-slate-700 mt-1">
                        {deputado.siglaUf}
                    </span>
                </div>
            </div>
        </Link>
    );
}