import Link from 'next/link';
import { getCandidatosLista } from '@/services/candidatos';
import { CandidatoCard } from '@/components/candidatos/CandidatoCard';

type CandidatosPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function texto(valor?: string | string[]) {
  const bruto = Array.isArray(valor) ? valor[0] : valor;
  return bruto?.trim() || undefined;
}

const cargos = [
  'DEPUTADO ESTADUAL',
  'DEPUTADO FEDERAL',
  'DEPUTADO DISTRITAL',
  '1º SUPLENTE',
  '2º SUPLENTE',
  'SENADOR',
  'VICE-GOVERNADOR',
  'GOVERNADOR',
  'VICE-PRESIDENTE',
  'PRESIDENTE',
];

const estados = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

export default async function CandidatosPage({
  searchParams,
}: CandidatosPageProps) {
  const params = (await searchParams) ?? {};

  const busca = texto(params.busca);
  const cargo = texto(params.cargo);
  const partido = texto(params.partido);
  const uf = texto(params.uf);

  const pageParam = Number(texto(params.page) || '1');
  const page =
    Number.isFinite(pageParam) && pageParam > 0
      ? Math.trunc(pageParam)
      : 1;

  const lista = await getCandidatosLista(
    page,
    busca,
    cargo,
    partido,
    uf
  );

  const buildPageHref = (nextPage: number) => {
    const query = new URLSearchParams();

    if (busca) query.set('busca', busca);
    if (cargo) query.set('cargo', cargo);
    if (partido) query.set('partido', partido);
    if (uf) query.set('uf', uf);

    query.set('page', String(nextPage));

    return `/candidatos?${query.toString()}`;
  };

  return (
    <main className="scroll-mt-32 min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brasil-blue">
            Eleições 2026
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Candidatos
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600">
            Acompanhe todos os candidatos registrados. Clique no card para
            ver detalhes ou acesse o perfil completo se for parlamentar
            em exercício.
          </p>
        </header>

        {/* Barra de filtros */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <form className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {/* Busca */}
            <input
              type="text"
              name="busca"
              placeholder="Buscar por nome"
              defaultValue={busca}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-brasil-blue sm:col-span-2 lg:col-span-1"
            />

            {/* Cargo */}
            <select
              name="cargo"
              defaultValue={cargo ?? ''}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-brasil-blue"
            >
              <option value="">Todos os cargos</option>

              {cargos.map((opcao) => (
                <option key={opcao} value={opcao}>
                  {opcao}
                </option>
              ))}
            </select>

            {/* Partido */}
            <input
              type="text"
              name="partido"
              placeholder="Partido"
              defaultValue={partido}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm uppercase outline-none focus:border-brasil-blue"
            />

            {/* UF */}
            <select
              name="uf"
              defaultValue={uf ?? ''}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-brasil-blue"
            >
              <option value="">Todos os estados</option>

              {estados.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>

            {/* Botão */}
            <button
              type="submit"
              className="w-full rounded-xl bg-brasil-blue px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Filtrar
            </button>
          </form>
        </section>

        {/* Resultados */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-slate-500">
            {lista.meta.total} resultado(s) encontrado(s).
          </p>

          <p className="text-sm text-slate-500">
            Página {page}
          </p>
        </div>

        {/* Lista */}
        {lista.data.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            Nenhum candidato encontrado para os filtros informados.
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {lista.data.map((candidato) => (
              <CandidatoCard
                key={candidato.sqCandidato}
                candidato={candidato}
              />
            ))}
          </section>
        )}

        {/* Paginação */}
        <nav className="mt-10 flex items-center justify-center gap-3">
          <Link
            href={buildPageHref(Math.max(1, page - 1))}
            aria-disabled={page <= 1}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${
              page <= 1
                ? 'pointer-events-none border border-slate-200 text-slate-300'
                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Anterior
          </Link>

          <span className="text-sm text-slate-500">
            Página {page}
          </span>

          <Link
            href={buildPageHref(page + 1)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Próxima
          </Link>
        </nav>
      </div>
    </main>
  );
}