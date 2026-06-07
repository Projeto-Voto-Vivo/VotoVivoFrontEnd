import Link from 'next/link';
import { getParlamentaresLista } from '@/services/parlamentares';
import { ParlamentarCard } from '@/components/home/ParlamentarCard';

type ParlamentaresPageProps = {
  searchParams?: Promise<{
    nome?: string;
    uf?: string;
    partido?: string;
    page?: string;
    tipo?: string;
  }>;
};

const filtrosTipo = [
  {
    label: 'Lista completa',
    href: '/parlamentares',
    value: undefined,
    description: 'Deputados federais e senadores em exercício.',
  },
  {
    label: 'Deputados federais',
    href: '/parlamentares?tipo=deputados',
    value: 'deputados',
    description: 'Representantes da Câmara dos Deputados.',
  },
  {
    label: 'Senadores',
    href: '/parlamentares?tipo=senadores',
    value: 'senadores',
    description: 'Representantes do Senado Federal.',
  },
] as const;

function normalizeTipo(tipo?: string) {
  return tipo === 'deputados' || tipo === 'senadores' ? tipo : undefined;
}

export default async function ParlamentaresPage({
  searchParams,
}: ParlamentaresPageProps) {
  const params = (await searchParams) ?? {};

  const nome = params.nome?.trim() || undefined;
  const uf = params.uf?.trim() || undefined;
  const partido = params.partido?.trim() || undefined;
  const tipo = normalizeTipo(params.tipo);
  const page = Number(params.page || '1');

  const { data, meta } = await getParlamentaresLista(page, nome, uf, partido, tipo);

  const filtroAtivo = filtrosTipo.find((item) => item.value === tipo) ?? filtrosTipo[0];

  const buildPageHref = (nextPage: number) => {
    const query = new URLSearchParams();

    if (nome) query.set('nome', nome);
    if (uf) query.set('uf', uf);
    if (partido) query.set('partido', partido);
    if (tipo) query.set('tipo', tipo);
    query.set('page', String(nextPage));

    return `/parlamentares?${query.toString()}`;
  };

  const buildTipoHref = (nextTipo?: 'deputados' | 'senadores') => {
    const query = new URLSearchParams();

    if (nome) query.set('nome', nome);
    if (uf) query.set('uf', uf);
    if (partido) query.set('partido', partido);
    if (nextTipo) query.set('tipo', nextTipo);

    const queryString = query.toString();
    return queryString ? `/parlamentares?${queryString}` : '/parlamentares';
  };

  return (
    <>
    <main className="scroll-mt-32 min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brasil-blue">
            {filtroAtivo.label}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Parlamentares</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            {filtroAtivo.description} Use os filtros para localizar perfis e acompanhar dados do mandato.
          </p>
        </header>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <nav className="grid gap-2 md:grid-cols-3" aria-label="Tipo de parlamentar">
            {filtrosTipo.map((item) => {
              const active = item.value === tipo;

              return (
                <Link
                  key={item.label}
                  href={buildTipoHref(item.value)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? 'bg-brasil-blue text-white shadow-sm'
                      : 'text-slate-600 hover:bg-blue-50 hover:text-brasil-blue'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </section>

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <form className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {tipo && <input type="hidden" name="tipo" value={tipo} />}

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
