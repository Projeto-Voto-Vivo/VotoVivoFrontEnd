import { Header } from "@/components/layout/HeaderLayout";
import { DeputadoCard } from "@/components/home/DeputadoCard";
import { getDeputadosLista } from "@/services/deputados";
import Link from "next/link";
import { Search } from "lucide-react";

export default async function ListaDeputados({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  
  // Extrai parâmetros da URL (ex: /deputados?pagina=2&nome=Silva)
  const page = Number(params.pagina) || 1;
  const nome = typeof params.nome === 'string' ? params.nome : undefined;
  const partido = typeof params.partido === 'string' ? params.partido : undefined;
  const uf = typeof params.uf === 'string' ? params.uf : undefined;

  // Busca dados na API (usando o serviço que já blindamos)
  const { data: deputados, meta } = await getDeputadosLista(page, nome, uf, partido);

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Header />

      <div className="container mx-auto px-4 py-8">
        
        {/* Cabeçalho da Página e Busca */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div>
                <h1 className="text-3xl font-bold text-brasil-blue mb-1">Parlamentares</h1>
                <p className="text-slate-500 text-sm">
                    Mostrando <strong>{deputados.length}</strong> de <strong>{meta?.total || 0}</strong> deputados em exercício.
                </p>
            </div>

            {/* Formulário de Busca (Server-Side: recarrega a página com parâmetros GET) */}
            <form className="flex gap-2 w-full md:w-auto" action="/deputados" method="get">
                <div className="relative grow md:grow-0">
                    <input 
                        type="text" 
                        name="nome"
                        defaultValue={nome}
                        placeholder="Buscar por nome..." 
                        className="pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brasil-blue focus:border-transparent outline-none w-full md:w-64 text-slate-700"
                    />
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                </div>
                <button type="submit" className="bg-brasil-blue text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-800 transition-colors shadow-sm">
                    Filtrar
                </button>
                {/* Se houver filtro, mostrar botão de limpar */}
                {(nome || partido || uf) && (
                    <Link href="/deputados" className="px-4 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center">
                        Limpar
                    </Link>
                )}
            </form>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {deputados.map((dep) => (
            <DeputadoCard key={dep.id} deputado={dep} />
          ))}
        </div>
        
        {/* Estado Vazio */}
        {deputados.length === 0 && (
            <div className="text-center py-20 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                Nenhum parlamentar encontrado com os filtros atuais.
            </div>
        )}

        {/* Paginação */}
        {meta && meta.totalPaginas > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
                {page > 1 ? (
                    <Link 
                        href={{ pathname: '/deputados', query: { ...params, pagina: page - 1 } }}
                        className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 hover:border-brasil-blue transition-colors shadow-sm"
                    >
                        &larr; Anterior
                    </Link>
                ) : (
                    <button disabled className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed">
                        &larr; Anterior
                    </button>
                )}

                <span className="text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200">
                    Página {meta.pagina} de {meta.totalPaginas}
                </span>

                {page < meta.totalPaginas ? (
                    <Link 
                        href={{ pathname: '/deputados', query: { ...params, pagina: page + 1 } }}
                        className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 hover:border-brasil-blue transition-colors shadow-sm"
                    >
                        Próxima &rarr;
                    </Link>
                ) : (
                    <button disabled className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed">
                        Próxima &rarr;
                    </button>
                )}
            </div>
        )}
      </div>
    </main>
  );
}
