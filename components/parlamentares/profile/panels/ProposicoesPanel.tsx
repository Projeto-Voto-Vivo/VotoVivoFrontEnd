'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, Loader2 } from 'lucide-react';

import { ParlamentarPerfil, ProposicaoPerfil } from '@/types';
import {
  getProposicoesParlamentar,
  ListaProposicoesResponse,
} from '@/services/parlamentares';
import { MicroInfoCard } from '../shared/MicroInfoCard';
import { SectionShell } from '../shared/SectionShell';

interface ProposicoesPanelProps {
  profile: ParlamentarPerfil;
}

const META_INICIAL: ListaProposicoesResponse['meta'] = {
  total: 0,
  page: 1,
  lastPage: 1,
  limit: 0,
};

const TIPOS = ['PL', 'PLP', 'PEC', 'REQ', 'RCP', 'PDC', 'MPV'];

export function ProposicoesPanel({ profile }: ProposicoesPanelProps) {
  const [proposicoesPagina, setProposicoesPagina] = useState<
    ProposicaoPerfil[]
  >([]);
  const [meta, setMeta] =
    useState<ListaProposicoesResponse['meta']>(META_INICIAL);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [siglaSelecionada, setSiglaSelecionada] = useState('');
  const [anoSelecionado, setAnoSelecionado] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let cancelado = false;

    async function buscarProposicoes() {
      setCarregando(true);

      try {
        const response = await getProposicoesParlamentar(
          profile.parlamentar.id,
          paginaAtual,
        );

        if (cancelado) return;

        setProposicoesPagina(response.data);
        setMeta(response.meta);
      } catch (error) {
        console.error('Erro ao carregar proposições:', error);

        if (!cancelado) {
          setProposicoesPagina([]);
          setMeta(META_INICIAL);
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
  }, [profile.parlamentar.id, paginaAtual]);

  // O backend não suporta filtro por tipo/ano, então o filtro é aplicado
  // apenas sobre os itens já carregados na página atual.
  const proposicoes = proposicoesPagina.filter((proposicao) => {
    if (siglaSelecionada && proposicao.sigla !== siglaSelecionada) {
      return false;
    }

    if (anoSelecionado && proposicao.ano !== anoSelecionado) {
      return false;
    }

    return true;
  });

  function mudarTipo(sigla: string) {
    setSiglaSelecionada(sigla);
  }

  function mudarAno(ano: string) {
    setAnoSelecionado(ano);
  }

  function limparFiltros() {
    setSiglaSelecionada('');
    setAnoSelecionado('');
  }

  const filtroAtivo = Boolean(siglaSelecionada || anoSelecionado);

  return (
    <div className="space-y-6">
      <SectionShell
        icon={<FileText className="h-6 w-6" />}
        title="Proposições"
        description="Proposições legislativas vinculadas ao parlamentar."
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="grid gap-3 sm:grid-cols-2">
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
                Atualizando
              </span>
            )}
          </div>
        </div>

        {filtroAtivo && (
          <p className="mt-2 text-xs text-slate-400">
            O filtro se aplica apenas às proposições já carregadas nesta
            página.
          </p>
        )}

        <div className="mt-5">
          {carregando && proposicoes.length === 0 ? (
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
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    {proposicao.titulo}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {proposicao.resumo}
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <MicroInfoCard label="Tipo" value={proposicao.sigla} />
                    <MicroInfoCard
                      label="Ano"
                      value={String(proposicao.ano)}
                    />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
              {filtroAtivo
                ? 'Nenhuma proposição nesta página corresponde aos filtros selecionados.'
                : 'Nenhuma proposição encontrada.'}
            </div>
          )}
        </div>

        {meta.total > 0 && (
          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              {filtroAtivo
                ? `${proposicoes.length} de ${proposicoesPagina.length} nesta página correspondem ao filtro`
                : `${(meta.page - 1) * meta.limit + 1}–${
                    (meta.page - 1) * meta.limit + proposicoesPagina.length
                  } de ${meta.total} proposições`}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPaginaAtual((pagina) => pagina - 1)}
                disabled={paginaAtual <= 1 || carregando}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft size={16} />
                Anterior
              </button>

              <button
                type="button"
                onClick={() => setPaginaAtual((pagina) => pagina + 1)}
                disabled={paginaAtual >= meta.lastPage || carregando}
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
