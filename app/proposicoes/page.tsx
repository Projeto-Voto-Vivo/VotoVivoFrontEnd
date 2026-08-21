export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { ArrowRight, FileText, Search } from 'lucide-react';
import { cache } from 'react';
import {
  buscarProposicoes,
  carregarOpcoesFiltroProposicoes,
} from '@/services/proposicoes';
import { FiltrosProposicao } from '@/types';
import { formatDate } from '@/components/parlamentares/profile/shared/formatters';

/**
 * Memoizado por requisição. `cache` é API de componente de servidor, por isso
 * mora aqui e não no serviço — que agora também roda no navegador, no painel
 * de proposições do perfil.
 */
const getOpcoesFiltro = cache(carregarOpcoesFiltroProposicoes);

type PaginaProps = {
  searchParams?: Promise<{
    busca?: string;
    tipo?: string;
    ano?: string;
    casa?: string;
    situacao?: string;
    tema?: string;
    page?: string;
  }>;
};

function limparTexto(valor?: string) {
  const limpo = valor?.trim();
  return limpo ? limpo : undefined;
}

/** Situações são frases longas; no dropdown elas precisam caber. */
function encurtar(texto: string, limite = 70) {
  return texto.length > limite ? `${texto.slice(0, limite - 1).trim()}…` : texto;
}

export default async function BuscaProposicoesPage({ searchParams }: PaginaProps) {
  const params = (await searchParams) ?? {};

  const anoNumero = Number(params.ano);
  const filtros: FiltrosProposicao = {
    busca: limparTexto(params.busca),
    tipo: limparTexto(params.tipo),
    ano: Number.isFinite(anoNumero) && anoNumero > 0 ? Math.trunc(anoNumero) : undefined,
    casa: limparTexto(params.casa),
    situacao: limparTexto(params.situacao),
    tema: limparTexto(params.tema),
  };

  const paginaSolicitada = Number(params.page);
  const pagina =
    Number.isFinite(paginaSolicitada) && paginaSolicitada > 0
      ? Math.trunc(paginaSolicitada)
      : 1;

  const [resultado, opcoes] = await Promise.all([
    // Sem `COUNT(*)`: numa busca textual ele é uma segunda varredura da tabela
    // e domina o tempo de resposta. Aqui o que importa é ver os resultados e
    // conseguir avançar, não saber que existem 12.482 deles.
    buscarProposicoes(filtros, pagina, { contarTotal: false }),
    getOpcoesFiltro(),
  ]);

  const primeiroResultado =
    resultado.data.length > 0
      ? (resultado.pagina - 1) * resultado.itensPorPagina + 1
      : 0;

  const temFiltro = Object.values(filtros).some(Boolean);

  const montarHref = (novaPagina: number) => {
    const query = new URLSearchParams();

    if (filtros.busca) query.set('busca', filtros.busca);
    if (filtros.tipo) query.set('tipo', filtros.tipo);
    if (filtros.ano) query.set('ano', String(filtros.ano));
    if (filtros.casa) query.set('casa', filtros.casa);
    if (filtros.situacao) query.set('situacao', filtros.situacao);
    if (filtros.tema) query.set('tema', filtros.tema);
    query.set('page', String(novaPagina));

    return `/proposicoes?${query.toString()}`;
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brasil-blue">
            Projetos e propostas
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Proposições</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Projetos de lei, emendas à Constituição, medidas provisórias e demais
            propostas em análise no Congresso. Busque pelo assunto, pelo número ou
            filtre por tipo, ano e situação.
          </p>
        </header>

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <form className="grid grid-cols-1 gap-3 md:grid-cols-6">
            <label className="md:col-span-3">
              <span className="sr-only">Buscar por assunto ou número</span>
              <div className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 focus-within:border-brasil-blue">
                <Search size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
                <input
                  type="text"
                  name="busca"
                  placeholder="Busque por assunto ou número (ex.: saúde, 4321)"
                  defaultValue={filtros.busca}
                  className="w-full py-3 text-sm outline-none"
                />
              </div>
            </label>

            {opcoes.tipos.length > 0 && (
              <label className="md:col-span-1">
                <span className="sr-only">Tipo</span>
                <select
                  name="tipo"
                  defaultValue={filtros.tipo ?? ''}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-brasil-blue"
                >
                  <option value="">Todos os tipos</option>
                  {Array.from(new Set(opcoes.tipos.map((tipo) => tipo.sigla))).map(
                    (sigla) => (
                      <option key={sigla} value={sigla}>
                        {sigla}
                      </option>
                    ),
                  )}
                </select>
              </label>
            )}

            {opcoes.anos.length > 0 ? (
              <label className="md:col-span-1">
                <span className="sr-only">Ano</span>
                <select
                  name="ano"
                  defaultValue={filtros.ano ? String(filtros.ano) : ''}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-brasil-blue"
                >
                  <option value="">Todos os anos</option>
                  {opcoes.anos.map((item) => (
                    <option key={item.ano} value={item.ano}>
                      {item.ano} ({item.total})
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <label className="md:col-span-1">
                <span className="sr-only">Ano</span>
                <input
                  type="number"
                  name="ano"
                  placeholder="Ano"
                  min="1900"
                  max="2100"
                  defaultValue={filtros.ano}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-brasil-blue"
                />
              </label>
            )}

            {opcoes.casas.length > 0 && (
              <label className="md:col-span-1">
                <span className="sr-only">Casa</span>
                <select
                  name="casa"
                  defaultValue={filtros.casa ?? ''}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-brasil-blue"
                >
                  <option value="">Câmara e Senado</option>
                  {opcoes.casas.map((item) => (
                    <option key={item.casa} value={item.casa}>
                      {item.rotulo}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {opcoes.temas.length > 0 && (
              <label className="md:col-span-3">
                <span className="sr-only">Tema</span>
                <select
                  name="tema"
                  defaultValue={filtros.tema ?? ''}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-brasil-blue"
                >
                  <option value="">Todos os temas</option>
                  {opcoes.temas.map((item) => (
                    <option key={item.tema} value={item.tema}>
                      {encurtar(item.tema)} ({item.total})
                    </option>
                  ))}
                </select>
              </label>
            )}

            {opcoes.situacoes.length > 0 && (
              <label className="md:col-span-2">
                <span className="sr-only">Situação</span>
                <select
                  name="situacao"
                  defaultValue={filtros.situacao ?? ''}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-brasil-blue"
                >
                  <option value="">Qualquer situação</option>
                  {opcoes.situacoes.map((item) => (
                    <option key={item.situacao} value={item.situacao}>
                      {encurtar(item.situacao)} ({item.total})
                    </option>
                  ))}
                </select>
              </label>
            )}

            <div className="flex gap-2 md:col-span-1">
              <button
                type="submit"
                className="w-full rounded-xl bg-brasil-blue px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Filtrar
              </button>
            </div>
          </form>

          {temFiltro && (
            <div className="mt-3 flex justify-end">
              <Link
                href="/proposicoes"
                className="text-sm font-semibold text-brasil-blue hover:underline"
              >
                Limpar filtros
              </Link>
            </div>
          )}
        </section>

        {resultado.aviso && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            {resultado.aviso}
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-slate-500">
            {resultado.data.length > 0
              ? `Resultados ${primeiroResultado.toLocaleString('pt-BR')}–${(
                  primeiroResultado +
                  resultado.data.length -
                  1
                ).toLocaleString('pt-BR')}`
              : ''}
          </p>
          <p className="text-sm text-slate-500">
            Página {resultado.pagina}
            {resultado.totalPaginas ? ` de ${resultado.totalPaginas}` : ''}
          </p>
        </div>

        {resultado.data.length === 0 ? (
          // Com o aviso de falha na tela, dizer "nenhuma proposição" soaria
          // como se realmente não houvesse nenhuma.
          resultado.aviso ? null : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              {temFiltro
                ? 'Nenhuma proposição corresponde a estes filtros. Tente termos mais gerais ou limpe algum filtro.'
                : 'Nenhuma proposição para mostrar no momento.'}
            </div>
          )
        ) : (
          <section className="grid gap-4 lg:grid-cols-2">
            {resultado.data.map((proposicao) => (
              <article
                key={proposicao.id}
                className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brasil-blue"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brasil-blue/10 px-3 py-1 text-xs font-semibold uppercase text-brasil-blue">
                    <FileText size={12} aria-hidden="true" />
                    {proposicao.sigla ?? 'Proposição'}
                  </span>

                  {proposicao.casa ? (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                      {proposicao.casa}
                    </span>
                  ) : null}

                  {proposicao.dataApresentacao ? (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                      {formatDate(proposicao.dataApresentacao)}
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-3 text-lg font-bold text-slate-900">
                  {proposicao.titulo}
                </h2>

                <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600">
                  {proposicao.ementa}
                </p>

                {proposicao.temas.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {proposicao.temas.slice(0, 3).map((tema) => (
                      <span
                        key={tema}
                        className="rounded-full bg-brasil-green/10 px-3 py-1 text-xs font-semibold text-brasil-green"
                      >
                        {tema}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto flex flex-col gap-3 pt-4 sm:flex-row sm:items-end sm:justify-between">
                  <p className="text-xs leading-5 text-slate-500">
                    {proposicao.situacao ?? 'Situação não informada'}
                  </p>

                  <Link
                    href={`/proposicoes/${proposicao.id}`}
                    className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-brasil-blue px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Ver tramitação
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}

        {/*
          Sem contagem não existe "última página": a navegação anda para frente
          enquanto o servidor disser que há mais, que é o que `temProximaPagina`
          responde — ele sai de buscar uma linha a mais, não de um COUNT.
        */}
        {(resultado.pagina > 1 || resultado.temProximaPagina) && (
          <nav className="mt-10 flex items-center justify-center gap-3">
            <Link
              href={montarHref(Math.max(1, resultado.pagina - 1))}
              aria-disabled={resultado.pagina <= 1}
              className={`rounded-xl px-4 py-2 text-sm font-medium ${
                resultado.pagina <= 1
                  ? 'pointer-events-none border border-slate-200 text-slate-300'
                  : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              Anterior
            </Link>

            <span className="text-sm text-slate-500">
              {resultado.pagina}
              {resultado.totalPaginas ? ` / ${resultado.totalPaginas}` : ''}
            </span>

            <Link
              href={montarHref(resultado.pagina + 1)}
              aria-disabled={!resultado.temProximaPagina}
              className={`rounded-xl px-4 py-2 text-sm font-medium ${
                !resultado.temProximaPagina
                  ? 'pointer-events-none border border-slate-200 text-slate-300'
                  : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              Próxima
            </Link>
          </nav>
        )}
      </div>
    </main>
  );
}
