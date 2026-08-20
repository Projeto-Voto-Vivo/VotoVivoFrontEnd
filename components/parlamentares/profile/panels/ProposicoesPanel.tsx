'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, FileText, Loader2 } from 'lucide-react';

import { ParlamentarPerfil, ProposicaoPerfil } from '@/types';
import { getTodasProposicoesParlamentar } from '@/services/parlamentares';
import { MicroInfoCard } from '../shared/MicroInfoCard';
import { SectionShell } from '../shared/SectionShell';
import { formatDate } from '../shared/formatters';

interface ProposicoesPanelProps {
  profile: ParlamentarPerfil;
}

const TIPOS = ['PL', 'PLP', 'PEC', 'REQ', 'RCP', 'PDC', 'MPV'];
const ITENS_POR_PAGINA = 10;

export function ProposicoesPanel({ profile }: ProposicoesPanelProps) {
  const [todasProposicoes, setTodasProposicoes] = useState<
    ProposicaoPerfil[]
  >([]);
  const [totalNoBackend, setTotalNoBackend] = useState(0);
  const [truncado, setTruncado] = useState(false);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [siglaSelecionada, setSiglaSelecionada] = useState('');
  const [anoSelecionado, setAnoSelecionado] = useState('');
  const [situacaoSelecionada, setSituacaoSelecionada] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let cancelado = false;

    async function buscarProposicoes() {
      setCarregando(true);

      try {
        const resultado = await getTodasProposicoesParlamentar(
          profile.parlamentar.id,
        );

        if (cancelado) return;

        setTodasProposicoes(resultado.data);
        setTotalNoBackend(resultado.total);
        setTruncado(resultado.truncado);
        setPaginaAtual(1);
      } catch (error) {
        console.error('Erro ao carregar proposições:', error);

        if (!cancelado) {
          setTodasProposicoes([]);
          setTotalNoBackend(0);
          setTruncado(false);
        }
      } finally {
        if (!cancelado) {
          setCarregando(false);
        }
      }
    }

    buscarProposicoes();

    return () => {
      cancelado = true;
    };
  }, [profile.parlamentar.id]);

  const situacoesDisponiveis = useMemo(() => {
    const unicas = new Set(
      todasProposicoes
        .map((proposicao) => proposicao.situacao)
        .filter((situacao) => Boolean(situacao)),
    );

    return Array.from(unicas).sort((a, b) => a.localeCompare(b));
  }, [todasProposicoes]);

  const proposicoesFiltradas = useMemo(() => {
    return todasProposicoes.filter((proposicao) => {
      if (siglaSelecionada && proposicao.sigla !== siglaSelecionada) {
        return false;
      }

      if (anoSelecionado && proposicao.ano !== anoSelecionado) {
        return false;
      }

      if (
        situacaoSelecionada &&
        proposicao.situacao !== situacaoSelecionada
      ) {
        return false;
      }

      return true;
    });
  }, [todasProposicoes, siglaSelecionada, anoSelecionado, situacaoSelecionada]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(proposicoesFiltradas.length / ITENS_POR_PAGINA),
  );
  const paginaSegura = Math.min(paginaAtual, totalPaginas);

  const proposicoes = proposicoesFiltradas.slice(
    (paginaSegura - 1) * ITENS_POR_PAGINA,
    paginaSegura * ITENS_POR_PAGINA,
  );

  function mudarTipo(sigla: string) {
    setSiglaSelecionada(sigla);
    setPaginaAtual(1);
  }

  function mudarAno(ano: string) {
    setAnoSelecionado(ano);
    setPaginaAtual(1);
  }

  function mudarSituacao(situacao: string) {
    setSituacaoSelecionada(situacao);
    setPaginaAtual(1);
  }

  function limparFiltros() {
    setSiglaSelecionada('');
    setAnoSelecionado('');
    setSituacaoSelecionada('');
    setPaginaAtual(1);
  }

  const filtroAtivo = Boolean(
    siglaSelecionada || anoSelecionado || situacaoSelecionada,
  );

  return (
    <div className="space-y-6">
      <SectionShell
        icon={<FileText className="h-6 w-6" />}
        title="Proposições"
        description="Proposições legislativas vinculadas ao parlamentar."
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm font-semibold text-slate-600">
              Tipo
              <select
                value={siglaSelecionada}
                onChange={(event) => mudarTipo(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
              >
                <option value="">Todos os tipos</option>

                {TIPOS.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm font-semibold text-slate-600">
              Ano
              <input
                type="number"
                value={anoSelecionado}
                onChange={(event) => mudarAno(event.target.value)}
                placeholder="Ex.: 2025"
                min="1900"
                max="2100"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-semibold text-slate-600">
              Situação
              <select
                value={situacaoSelecionada}
                onChange={(event) => mudarSituacao(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
              >
                <option value="">Todas as situações</option>

                {situacoesDisponiveis.map((situacao) => (
                  <option key={situacao} value={situacao}>
                    {situacao}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-center gap-3">
            {filtroAtivo && (
              <button
                type="button"
                onClick={limparFiltros}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600"
              >
                Limpar filtros
              </button>
            )}

            {carregando && (
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-brasil-blue">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando todas as proposições
              </span>
            )}
          </div>
        </div>

        {truncado && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            Este parlamentar tem {totalNoBackend} proposições. Mostramos as{' '}
            {todasProposicoes.length} mais recentes aqui, e os filtros acima se
            aplicam só a elas. Para procurar em todas,{' '}
            <Link href="/proposicoes" className="font-semibold underline">
              use a busca de proposições
            </Link>
            .
          </div>
        )}

        <div className="mt-5">
          {carregando && todasProposicoes.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              Carregando proposições...
            </div>
          ) : proposicoes.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {proposicoes.map((proposicao) => (
                <article
                  key={proposicao.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-brasil-blue/10 px-3 py-1 text-xs font-semibold uppercase text-brasil-blue">
                      {proposicao.sigla}
                    </span>

                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                      {proposicao.situacao}
                    </span>

                    {proposicao.casa ? (
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                        {proposicao.casa}
                      </span>
                    ) : null}

                    {proposicao.papel ? (
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                        {proposicao.papel}
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    {proposicao.titulo}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {proposicao.resumo}
                  </p>

                  {proposicao.temas.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {proposicao.temas.map((tema) => (
                        <span
                          key={tema}
                          className="rounded-full bg-brasil-green/10 px-3 py-1 text-xs font-semibold text-brasil-green"
                        >
                          {tema}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <MicroInfoCard label="Tipo" value={proposicao.sigla} />
                    <MicroInfoCard
                      label="Apresentada em"
                      value={
                        proposicao.dataApresentacao
                          ? formatDate(proposicao.dataApresentacao)
                          : String(proposicao.ano)
                      }
                    />
                  </div>

                  <div className="mt-5 flex justify-end">
                    <Link
                      href={`/proposicoes/${proposicao.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-brasil-blue px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      Ver tramitação
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
              {filtroAtivo
                ? 'Nenhuma proposição corresponde aos filtros selecionados.'
                : 'Nenhuma proposição encontrada.'}
            </div>
          )}
        </div>

        {proposicoesFiltradas.length > 0 && (
          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              {`${(paginaSegura - 1) * ITENS_POR_PAGINA + 1}–${
                (paginaSegura - 1) * ITENS_POR_PAGINA + proposicoes.length
              } de ${proposicoesFiltradas.length} proposições`}
              {filtroAtivo &&
                ` (de ${todasProposicoes.length} carregadas${
                  totalNoBackend > todasProposicoes.length
                    ? ` · ${totalNoBackend} no total`
                    : ''
                })`}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPaginaAtual((pagina) => pagina - 1)}
                disabled={paginaSegura <= 1 || carregando}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft size={16} />
                Anterior
              </button>

              <button
                type="button"
                onClick={() => setPaginaAtual((pagina) => pagina + 1)}
                disabled={paginaSegura >= totalPaginas || carregando}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Próxima
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </SectionShell>
    </div>
  );
}
