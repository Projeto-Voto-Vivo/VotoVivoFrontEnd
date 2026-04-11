export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { Header } from '@/components/layout/HeaderLayout';
import { DeputadoCard } from '@/components/home/DeputadoCard';
import { getDeputadosLista } from '@/services/deputados';

export default async function ListaDeputados({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params.pagina) || 1;
  const nome = typeof params.nome === 'string' ? params.nome : undefined;
  const partido = typeof params.partido === 'string' ? params.partido : undefined;
  const uf = typeof params.uf === 'string' ? params.uf : undefined;
  const { data: deputados, meta } = await getDeputadosLista(page, nome, uf, partido);

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
          <div>
            <h1 className="mb-1 text-3xl font-bold text-brasil-blue">Parlamentares</h1>
            <p className="text-sm text-slate-500">
              Mostrando <strong>{deputados.length}</strong> de <strong>{meta?.total || 0}</strong> parlamentares em exercício.
            </p>
          </div>

          <form className="flex w-full gap-2 md:w-auto" action="/parlamentares" method="get">
            <div className="relative grow md:grow-0">
              <input
                type="text"
                name="nome"
                defaultValue={nome}
                placeholder="Buscar por nome..."
                className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-slate-700 outline-none focus:border-transparent focus:ring-2 focus:ring-brasil-blue md:w-64"
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            </div>
            <button type="submit" className="rounded-lg bg-brasil-blue px-5 py-2 font-bold text-white shadow-sm transition-colors hover:bg-blue-800">
              Filtrar
            </button>
            {(nome || partido || uf) && (
              <Link href="/parlamentares" className="flex items-center rounded-lg px-4 py-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600">
                Limpar
              </Link>
            )}
          </form>
        </div>

        {meta.aviso && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            {meta.aviso}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {deputados.map((dep) => (
            <DeputadoCard key={dep.id} deputado={dep} />
          ))}
        </div>

        {deputados.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-20 text-center text-slate-500">
            Nenhum parlamentar encontrado com os filtros atuais.
          </div>
        )}

        {meta && (meta.totalPaginas ?? 0) > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            {page > 1 ? (
              <Link href={{ pathname: '/parlamentares', query: { ...params, pagina: page - 1 } }} className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm transition-colors hover:border-brasil-blue hover:bg-slate-50">
                &larr; Anterior
              </Link>
            ) : (
              <button disabled className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-slate-400">
                &larr; Anterior
              </button>
            )}

            <span className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
              Página {meta.pagina} de {meta.totalPaginas}
            </span>

            {page < (meta.totalPaginas ?? 0) ? (
              <Link href={{ pathname: '/parlamentares', query: { ...params, pagina: page + 1 } }} className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm transition-colors hover:border-brasil-blue hover:bg-slate-50">
                Próxima &rarr;
              </Link>
            ) : (
              <button disabled className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-slate-400">
                Próxima &rarr;
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
