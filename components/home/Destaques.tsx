import { getDeputadosLista } from '@/services/deputados';
import { Deputado } from '@/types'; 
import Link from 'next/link';
import { DeputadoCard } from './DeputadoCard'; 

export async function Destaques() {
  // A API retorna 10 itens por página por padrão. 
  // Pegamos a página 1 e cortamos (slice) para 8 itens para manter o layout 4x2 simétrico.
  const { data } = await getDeputadosLista(1);
  const deputados = data ? data.slice(0, 8) : [];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Parlamentares em Exercício</h2>
            <p className="text-slate-500 mt-1">Acesse o perfil completo e fiscalize o mandato.</p>
          </div>
          <Link 
            href="/deputados" 
            className="text-brasil-blue font-semibold hover:underline flex items-center gap-1 text-sm"
          >
            Ver todos &rarr;
          </Link>
        </div>

        {deputados.length === 0 ? (
             <div className="p-10 text-center text-slate-500 border border-dashed border-slate-300 rounded-xl">
                 Não foi possível carregar a lista de deputados. Verifique sua conexão ou a API.
             </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {deputados.map((deputado: Deputado) => (
                    <DeputadoCard key={deputado.id} deputado={deputado} />
                ))}
            </div>
        )}
      </div>
    </section>
  );
}
