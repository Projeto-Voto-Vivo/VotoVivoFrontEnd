import Link from 'next/link';
import { getParlamentaresLista } from '@/services/parlamentares';
import { ParlamentarCard } from '@/components/home/ParlamentarCard';

type ParlamentaresPageProps = {
  searchParams?: Promise<{
    nome?: string;
    uf?: string;
    partido?: string;
    page?: string;
  }>;
};

export default async function ParlamentaresPage({
  searchParams,
}: ParlamentaresPageProps) {
  const params = (await searchParams) ?? {};

  const nome = params.nome?.trim() || undefined;
  const uf = params.uf?.trim() || undefined;
  const partido = params.partido?.trim() || undefined;
  const page = Number(params.page || '1');

  const { data, meta } = await getParlamentaresLista(page, nome, uf, partido);

  const buildPageHref = (nextPage: number) => {
    const query = new URLSearchParams();

    if (nome) query.set('nome', nome);
    if (uf) query.set('uf', uf);
    if (partido) query.set('partido', partido);
    query.set('page', String(nextPage));

    return `/parlamentares?${query.toString()}`;
  };

  return (
    <>
    <main className="scroll-mt-32 min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Parlamentares</h1>
          <p className="mt-2 text-slate-600">
            Consulte perfis, filtros e detalhes de atuação parlamentar.
          </p>
        </header>

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <form className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <input
              type="text"
              name="nome"
              placeholder="Buscar por nome"
              defaultValue={nome}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-0 focus:border-brasil-blue"
            />

            <input
              type="text"
              name="uf"
              placeholder="UF"
              defaultValue={uf}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm uppercase outline-none ring-0 focus:border-brasil-blue"
            />

            <input
              type="text"
              name="partido"
              placeholder="Partido"
              defaultValue={partido}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm uppercase outline-none ring-0 focus:border-brasil-blue"
            />

            <button
              type="submit"
              className="rounded-xl bg-brasil-blue px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Filtrar
            </button>
          </form>
        </section>

        {meta.aviso && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            {meta.aviso}
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {meta.total} resultado(s) encontrado(s).
          </p>
          <p className="text-sm text-slate-500">
            Página {meta.pagina} de {meta.totalPaginas}
          </p>
        </div>

        {data.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            Nenhum parlamentar encontrado para os filtros informados.
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.map((parlamentar) => (
              <ParlamentarCard key={parlamentar.id} parlamentar={parlamentar} />
            ))}
          </section>
        )}

        <nav className="mt-10 flex items-center justify-center gap-3">
          <Link
            href={buildPageHref(Math.max(1, meta.pagina - 1))}
            aria-disabled={meta.pagina <= 1}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${
              meta.pagina <= 1
                ? 'pointer-events-none border border-slate-200 text-slate-300'
                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Anterior
          </Link>

          <span className="text-sm text-slate-500">
            {meta.pagina} / {meta.totalPaginas}
          </span>

          <Link
            href={buildPageHref(Math.min(meta.totalPaginas, meta.pagina + 1))}
            aria-disabled={meta.pagina >= meta.totalPaginas}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${
              meta.pagina >= meta.totalPaginas
                ? 'pointer-events-none border border-slate-200 text-slate-300'
                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Próxima
          </Link>
        </nav>
      </div>
    </main>
    </>
  );
}