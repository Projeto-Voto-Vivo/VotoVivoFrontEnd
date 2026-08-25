'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Info, Loader2, Receipt } from 'lucide-react';
import { EmendaResumoPerfil, ParlamentarPerfil } from '@/types';
import { getEmendasParlamentar } from '@/services/parlamentares';
import { explicarExecucao } from '@/components/parlamentares/emendas/explicacoesExecucao';
import { MicroInfoCard } from '../shared/MicroInfoCard';
import { SectionShell } from '../shared/SectionShell';
import { formatCurrency } from '../shared/formatters';
import { PanoramaEmendasDashboard } from './PanoramaEmendasDashboard';

interface EmendasPanelProps {
  parlamentarId: number;
  profile: ParlamentarPerfil;
}

export function EmendasPanel({ parlamentarId, profile }: EmendasPanelProps) {
  const { emendas } = profile;
  // A primeira página e a paginação já vêm do servidor com o perfil: aqui só
  // trocamos de página, sem carregar a lista inteira em memória.
  const [itens, setItens] = useState<EmendaResumoPerfil[]>(emendas.destaques);
  const [paginaAtual, setPaginaAtual] = useState(emendas.paginaAtual || 1);
  const [totalRegistros, setTotalRegistros] = useState(
    emendas.quantidade || emendas.destaques.length,
  );
  const [totalPaginas, setTotalPaginas] = useState(emendas.totalPaginas || 1);
  const [itensPorPagina, setItensPorPagina] = useState(
    emendas.itensPorPagina || emendas.destaques.length || 1,
  );
  const [carregando, setCarregando] = useState(false);

  async function carregarPagina(novaPagina: number) {
    if (
      novaPagina < 1 ||
      novaPagina > totalPaginas ||
      novaPagina === paginaAtual ||
      carregando
    ) {
      return;
    }

    setCarregando(true);

    try {
      const response = await getEmendasParlamentar(parlamentarId, novaPagina);
      setItens(response.data);
      setPaginaAtual(response.meta.page);
      setTotalPaginas(response.meta.lastPage);
      setTotalRegistros(response.meta.total);
      setItensPorPagina(response.meta.limit);
    } finally {
      setCarregando(false);
    }
  }

  const inicioPagina = itens.length ? (paginaAtual - 1) * itensPorPagina + 1 : 0;
  const fimPagina = itens.length
    ? Math.min(inicioPagina + itens.length - 1, totalRegistros)
    : 0;

  return (
    <div className="space-y-6">
      {/*
        O panorama abre o quadro: primeiro onde o parlamentar atua e para onde
        o dinheiro foi, depois a lista emenda a emenda. O conjunto antes do
        caso a caso.
      */}
      <PanoramaEmendasDashboard parlamentarId={parlamentarId} />

    <SectionShell
      icon={<Receipt className="h-6 w-6" />}
      title="Emendas parlamentares"
    >
      {/*
        Cada rótulo explica a si mesmo no "?" ao lado. Antes havia um parágrafo
        abaixo dizendo o mesmo — com a explicação no card, ele virava repetição.
      */}
      <div className="grid gap-3 md:grid-cols-3">
        <MicroInfoCard
          label="Empenhado"
          value={formatCurrency(emendas.totalEmpenhado)}
          dica={explicarExecucao('Empenhado')}
        />
        <MicroInfoCard
          label="Liquidado"
          value={formatCurrency(emendas.totalLiquidado)}
          dica={explicarExecucao('Liquidado')}
        />
        <MicroInfoCard
          label="Pago"
          value={formatCurrency(emendas.totalPago)}
          dica={explicarExecucao('Pago')}
        />
      </div>

      {/*
        Um aviso só, no topo: vale para toda emenda da lista, e repetir a
        procedência linha a linha virava ruído. O detalhe de cada emenda diz
        como aquele vínculo específico foi feito.
      */}
      <p className="mt-3 flex items-start gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        O Portal da Transparência publica o nome do autor da emenda em texto
        livre; a ligação com o parlamentar é feita por correspondência de nome.
        Abra uma emenda para ver como o vínculo dela foi estabelecido.
      </p>

      {carregando && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-brasil-blue/10 bg-brasil-blue/5 px-4 py-2 text-sm font-semibold text-brasil-blue" aria-live="polite">
          <Loader2 className="h-4 w-4 animate-spin" />
          Atualizando emendas
        </div>
      )}

      <div className="mt-6 space-y-4">
        {itens.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-500">
            Nenhuma emenda vinculada encontrada para este parlamentar.
          </div>
        ) : (
          itens.map((emenda) => {
            return (
              <article
                key={emenda.id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-brasil-blue">
                      Emenda {emenda.numeroEmenda || emenda.codigoEmenda}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                      {emenda.funcao || 'Função não informada'}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {emenda.subfuncao || 'Subfunção não informada'}
                    </p>
                  </div>

                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                    {emenda.tipoEmenda || 'Tipo não informado'} ·{' '}
                    {emenda.localidadeDoGasto || 'Localidade não informada'}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <MicroInfoCard label="Empenhado" value={formatCurrency(emenda.valorEmpenhado)} />
                  <MicroInfoCard label="Liquidado" value={formatCurrency(emenda.valorLiquidado)} />
                  <MicroInfoCard label="Pago" value={formatCurrency(emenda.valorPago)} />
                </div>

                <div className="mt-5 flex justify-end">
                  <Link
                    href={`/parlamentares/${parlamentarId}/emendas/${emenda.id}`}
                    className="inline-flex items-center rounded-xl bg-brasil-blue px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Ver detalhes da emenda
                  </Link>
                </div>
              </article>
            );
          })
        )}
      </div>

      {totalRegistros > 0 && (
        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            {inicioPagina}–{fimPagina} de {totalRegistros} emendas
          </p>

          {totalPaginas > 1 && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => carregarPagina(paginaAtual - 1)}
                disabled={paginaAtual <= 1 || carregando}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brasil-blue hover:text-brasil-blue disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft size={16} />
                Anterior
              </button>
              <button
                type="button"
                onClick={() => carregarPagina(paginaAtual + 1)}
                disabled={paginaAtual >= totalPaginas || carregando}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brasil-blue hover:text-brasil-blue disabled:cursor-not-allowed disabled:opacity-50"
              >
                Próxima
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </SectionShell>
    </div>
  );
}
