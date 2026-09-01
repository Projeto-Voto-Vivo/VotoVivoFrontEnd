import Link from 'next/link';
import {
  getParlamentaresLista,
  getRankingFiltros,
  getRankingParlamentares,
} from '@/services/parlamentares';
import { ParlamentarCard } from '@/components/home/ParlamentarCard';
import {
  BuscaAvancada,
  CriteriosBusca,
} from '@/components/parlamentares/busca/BuscaAvancada';
import { RankingResultados } from '@/components/parlamentares/busca/RankingResultados';

type ParlamentaresPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
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

/** Os quatro campos que pontuam. Partido, casa e UF só recortam o grupo. */
const CRITERIOS = ['tema', 'funcaoEmenda', 'destinoEmenda', 'comissao'] as const;

function normalizeTipo(tipo?: string) {
  return tipo === 'deputados' || tipo === 'senadores' ? tipo : undefined;
}

function texto(valor?: string | string[]) {
  const bruto = Array.isArray(valor) ? valor[0] : valor;
  return bruto?.trim() || undefined;
}

export default async function ParlamentaresPage({
  searchParams,
}: ParlamentaresPageProps) {
  const params = (await searchParams) ?? {};

  const nome = texto(params.nome);
  const uf = texto(params.uf);
  const partido = texto(params.partido);
  const busca = texto(params.busca);
  const tipo = normalizeTipo(texto(params.tipo));
  const pageParam = Number(texto(params.page) || '1');
  const page = Number.isFinite(pageParam) && pageParam > 0 ? Math.trunc(pageParam) : 1;

  const criterios: CriteriosBusca = {
    tema: texto(params.tema),
    funcaoEmenda: texto(params.funcaoEmenda),
    destinoEmenda: texto(params.destinoEmenda),
    comissao: texto(params.comissao),
    partido,
    casa: texto(params.casa),
    uf,
    pesos: {},
  };

  const criteriosPreenchidos = CRITERIOS.filter((chave) => Boolean(criterios[chave]));

  for (const chave of CRITERIOS) {
    const bruto = Number(texto(params[`peso-${chave}`]) || '1');
    // Peso só viaja quando muda alguma coisa: mandar "1" em tudo só engorda a
    // URL. O backend recusa zero e negativo, então eles nem saem daqui.
    if (Number.isFinite(bruto) && bruto > 1 && criterios[chave]) {
      criterios.pesos[chave] = Math.trunc(bruto);
    }
  }

  // A busca avançada fica aberta quando foi usada, ou quando o usuário pediu
  // para abri-la e ainda não escolheu critério nenhum.
  const pediuAvancada = Boolean(texto(params.avancada));
  const modoRanking = criteriosPreenchidos.length > 0;
  const painelAberto = pediuAvancada || modoRanking;

  const pesos = Object.entries(criterios.pesos)
    .map(([chave, valor]) => `${chave}:${valor}`)
    .join(',');

  // Os domínios alimentam o formulário; a lista ou o ranking, os resultados.
  // Nunca os dois: em modo ranking a lista simples não é exibida.
  const [filtrosRanking, ranking, lista] = await Promise.all([
    getRankingFiltros(),
    modoRanking
      ? getRankingParlamentares({
          ...criterios,
          pesos: pesos || undefined,
          pagina: page,
        })
      : null,
    modoRanking
      ? null
      : getParlamentaresLista(page, nome, uf, partido, tipo, busca),
  ]);

  const filtroAtivo = filtrosTipo.find((item) => item.value === tipo) ?? filtrosTipo[0];

  const buildRankingHref = (nextPage: number) => {
    const query = new URLSearchParams();

    query.set('avancada', '1');
    for (const chave of CRITERIOS) {
      const valor = criterios[chave];
      if (valor) query.set(chave, valor);
    }
    if (criterios.partido) query.set('partido', criterios.partido);
    if (criterios.casa) query.set('casa', criterios.casa);
    if (criterios.uf) query.set('uf', criterios.uf);
    for (const [chave, valor] of Object.entries(criterios.pesos)) {
      query.set(`peso-${chave}`, String(valor));
    }
    if (nextPage > 1) query.set('page', String(nextPage));

    return `/parlamentares?${query.toString()}`;
  };

  const buildPageHref = (nextPage: number) => {
    const query = new URLSearchParams();

    if (busca) query.set('busca', busca);
    if (nome) query.set('nome', nome);
    if (uf) query.set('uf', uf);
    if (partido) query.set('partido', partido);
    if (tipo) query.set('tipo', tipo);
    query.set('page', String(nextPage));

    return `/parlamentares?${query.toString()}`;
  };

  const buildTipoHref = (nextTipo?: 'deputados' | 'senadores') => {
    const query = new URLSearchParams();

    if (busca) query.set('busca', busca);
    if (nome) query.set('nome', nome);
    if (uf) query.set('uf', uf);
    if (partido) query.set('partido', partido);
    if (nextTipo) query.set('tipo', nextTipo);

    const queryString = query.toString();
    return queryString ? `/parlamentares?${queryString}` : '/parlamentares';
  };

  return (
    <main className="scroll-mt-32 min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brasil-blue">
            {modoRanking ? 'Pesquisa avançada' : filtroAtivo.label}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Parlamentares</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            {modoRanking
              ? 'Parlamentares ordenados por quanto atuam no que você pediu.'
              : `${filtroAtivo.description} Use os filtros para localizar perfis e acompanhar dados do mandato.`}
          </p>
        </header>

        {!modoRanking && (
          <>
            <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              <nav className="grid grid-cols-3 gap-2" aria-label="Tipo de parlamentar">
                {filtrosTipo.map((item) => {
                  const active = item.value === tipo;

                  return (
                    <Link
                      key={item.label}
                      href={buildTipoHref(item.value)}
                      className={`rounded-xl px-2 py-2.5 text-center text-xs font-semibold transition sm:px-4 sm:py-3 sm:text-sm ${
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

            {busca && (
              <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-brasil-blue/15 bg-brasil-blue/5 px-4 py-3 text-sm text-slate-700">
                <span>
                  Buscando <strong>&ldquo;{busca}&rdquo;</strong> em nome, partido e UF.
                </span>
                <Link
                  href={tipo ? `/parlamentares?tipo=${tipo}` : '/parlamentares'}
                  className="font-semibold text-brasil-blue hover:underline"
                >
                  Limpar busca
                </Link>
              </div>
            )}

            <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <form className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {tipo && <input type="hidden" name="tipo" value={tipo} />}

                <input
                  type="text"
                  name="nome"
                  placeholder="Buscar por nome"
                  defaultValue={nome}
                  className="col-span-2 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-0 focus:border-brasil-blue md:col-span-1"
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
                  className="col-span-2 rounded-xl bg-brasil-blue px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 md:col-span-1"
                >
                  Filtrar
                </button>
              </form>
            </section>
          </>
        )}

        {/*
          A busca por nome resolve "quero este parlamentar"; esta resolve "quero
          quem trabalha com isto". São perguntas diferentes, então ela fica
          disponível o tempo todo — recolhida, para não competir com a busca
          simples, que é o que a maioria procura.
        */}
        <BuscaAvancada
          filtros={filtrosRanking}
          criterios={criterios}
          aberta={painelAberto}
        />

        {pediuAvancada && !modoRanking && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            Escolha ao menos um critério — assunto, área ou destino de emenda,
            ou comissão. Partido, casa e UF sozinhos apenas reduzem o grupo, e
            não definem uma ordem.
          </div>
        )}

        {modoRanking && ranking ? (
          <RankingResultados ranking={ranking} hrefPagina={buildRankingHref} />
        ) : (
          lista && (
            <>
              {lista.meta.aviso && (
                <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                  {lista.meta.aviso}
                </div>
              )}

              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  {lista.meta.total} resultado(s) encontrado(s).
                </p>
                <p className="text-sm text-slate-500">
                  Página {lista.meta.pagina} de {lista.meta.totalPaginas}
                </p>
              </div>

              {lista.data.length === 0 ? (
                // O aviso acima já explica o que houve; repetir aqui só confunde.
                lista.meta.aviso ? null : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                    Nenhum parlamentar encontrado para os filtros informados.
                  </div>
                )
              ) : (
                <section className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                  {lista.data.map((parlamentar) => (
                    <ParlamentarCard key={parlamentar.id} parlamentar={parlamentar} />
                  ))}
                </section>
              )}

              <nav className="mt-10 flex items-center justify-center gap-3">
                <Link
                  href={buildPageHref(Math.max(1, lista.meta.pagina - 1))}
                  aria-disabled={lista.meta.pagina <= 1}
                  className={`rounded-xl px-4 py-2 text-sm font-medium ${
                    lista.meta.pagina <= 1
                      ? 'pointer-events-none border border-slate-200 text-slate-300'
                      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Anterior
                </Link>

                <span className="text-sm text-slate-500">
                  {lista.meta.pagina} / {lista.meta.totalPaginas}
                </span>

                <Link
                  href={buildPageHref(
                    Math.min(lista.meta.totalPaginas, lista.meta.pagina + 1),
                  )}
                  aria-disabled={lista.meta.pagina >= lista.meta.totalPaginas}
                  className={`rounded-xl px-4 py-2 text-sm font-medium ${
                    lista.meta.pagina >= lista.meta.totalPaginas
                      ? 'pointer-events-none border border-slate-200 text-slate-300'
                      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Próxima
                </Link>
              </nav>
            </>
          )
        )}
      </div>
    </main>
  );
}
