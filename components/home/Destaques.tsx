import Link from 'next/link';
import { DeputadoCard } from './DeputadoCard';
import { getDeputadosLista } from '@/services/deputados';
import { Deputado } from '@/types';

export async function Destaques() {
  const { data, meta } = await getDeputadosLista(1);
  const deputados = data ? data.slice(0, 8) : [];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Parlamentares em exercício</h2>
            <p className="mt-1 text-slate-500">Acesse o perfil completo e fiscalize o mandato.</p>
          </div>
          <Link href="/parlamentares" className="flex items-center gap-1 text-sm font-semibold text-brasil-blue hover:underline">
            Ver todos &rarr;
          </Link>
        </div>

        {meta.aviso && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            {meta.aviso}
          </div>
        )}

        {deputados.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            Não foi possível carregar a lista de parlamentares. Verifique sua conexão ou a API.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {deputados.map((deputado: Deputado) => (
              <DeputadoCard key={deputado.id} deputado={deputado} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
