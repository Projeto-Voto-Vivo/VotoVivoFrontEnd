'use client';

import { useMemo, useRef, useState } from 'react';
import {
  ArrowDownUp,
  Building2,
  ChevronLeft,
  ChevronRight,
  Info,
  Route,
} from 'lucide-react';
import { EtapaTramitacao } from '@/types';
import { SectionShell } from '@/components/parlamentares/profile/shared/SectionShell';
import { formatDate } from '@/components/parlamentares/profile/shared/formatters';

interface TramitacaoTimelineProps {
  etapas: EtapaTramitacao[];
  disponivel: boolean;
}

/** Um processo antigo passa de cem etapas; a página inteira vira um paredão. */
const ETAPAS_POR_PAGINA = 15;

export function TramitacaoTimeline({ etapas, disponivel }: TramitacaoTimelineProps) {
  const [maisRecentePrimeiro, setMaisRecentePrimeiro] = useState(false);
  const [pagina, setPagina] = useState(1);
  const inicioDaLista = useRef<HTMLDivElement>(null);

  const ordenadas = useMemo(
    () => (maisRecentePrimeiro ? [...etapas].reverse() : etapas),
    [etapas, maisRecentePrimeiro],
  );

  const totalPaginas = Math.max(1, Math.ceil(ordenadas.length / ETAPAS_POR_PAGINA));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const primeiroIndice = (paginaSegura - 1) * ETAPAS_POR_PAGINA;

  const visiveis = ordenadas.slice(
    primeiroIndice,
    primeiroIndice + ETAPAS_POR_PAGINA,
  );

  // A etapa mais recente é uma só no processo inteiro — não a primeira ou a
  // última da página que por acaso está aberta.
  const idMaisRecente = etapas[etapas.length - 1]?.id;

  function irParaPagina(nova: number) {
    if (nova < 1 || nova > totalPaginas) return;

    setPagina(nova);
    // Sem isto, trocar de página deixa o leitor no fim da lista anterior.
    inicioDaLista.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function inverterOrdem() {
    setMaisRecentePrimeiro((atual) => !atual);
    setPagina(1);
  }

  if (!disponivel) {
    return (
      <SectionShell
        icon={<Route className="h-6 w-6" />}
        title="Caminho da proposição"
      >
        <div className="flex items-start gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-600">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
          <div>
            <p className="font-semibold text-slate-800">
              O histórico de tramitação ainda não está disponível aqui.
            </p>
            <p className="mt-1">
              Estamos trabalhando para trazer o caminho completo da proposição.
              Isso não quer dizer que ela não tramitou — só que ainda não
              conseguimos mostrar por onde ela passou.
            </p>
          </div>
        </div>
      </SectionShell>
    );
  }

  if (etapas.length === 0) {
    return (
      <SectionShell
        icon={<Route className="h-6 w-6" />}
        title="Caminho da proposição"
      >
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-500">
          Nenhuma etapa de tramitação registrada para esta proposição.
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell
      icon={<Route className="h-6 w-6" />}
      title="Caminho da proposição"
      description={`${etapas.length} etapa${etapas.length === 1 ? '' : 's'} registrada${etapas.length === 1 ? '' : 's'}, da apresentação até a movimentação mais recente.`}
    >
      <div
        ref={inicioDaLista}
        className="mb-5 flex scroll-mt-24 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        {/* Com uma página só, o contador repete o que o título já disse. */}
        {totalPaginas > 1 ? (
          <p className="text-sm text-slate-500">
            Mostrando {primeiroIndice + 1}–{primeiroIndice + visiveis.length} de{' '}
            {etapas.length} etapas
          </p>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={inverterOrdem}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brasil-blue hover:text-brasil-blue"
        >
          <ArrowDownUp size={16} />
          {maisRecentePrimeiro ? 'Mais antiga primeiro' : 'Mais recente primeiro'}
        </button>
      </div>

      <ol className="relative space-y-4 border-l-2 border-slate-200 pl-6 md:pl-8">
        {visiveis.map((etapa) => {
          const ehUltima = etapa.id === idMaisRecente;

          return (
            <li key={etapa.id} className="relative">
              <span
                className={`absolute -left-[calc(1.5rem+5px)] top-4 h-2.5 w-2.5 rounded-full ring-4 ring-white md:-left-[calc(2rem+5px)] ${
                  ehUltima ? 'bg-brasil-green' : 'bg-slate-300'
                }`}
                aria-hidden="true"
              />

              <article
                className={`rounded-3xl border p-5 ${
                  ehUltima
                    ? 'border-brasil-green/30 bg-brasil-green/5'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                      {etapa.data ? formatDate(etapa.data) : 'Data não informada'}
                    </span>

                    {etapa.orgao ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brasil-blue/10 px-3 py-1 text-xs font-semibold text-brasil-blue">
                        <Building2 size={12} aria-hidden="true" />
                        {etapa.orgao.sigla ?? etapa.orgao.nome}
                      </span>
                    ) : null}

                    {etapa.regime ? (
                      <span className="rounded-full bg-slate-200/70 px-3 py-1 text-xs font-medium text-slate-600">
                        {etapa.regime}
                      </span>
                    ) : null}
                  </div>

                  {ehUltima ? (
                    <span className="w-fit rounded-full bg-brasil-green px-3 py-1 text-xs font-bold text-white">
                      Etapa mais recente
                    </span>
                  ) : null}
                </div>

                {etapa.descricao ? (
                  <h3 className="mt-3 text-base font-bold text-slate-900">
                    {etapa.descricao}
                  </h3>
                ) : null}

                {etapa.orgao?.nome && etapa.orgao.nome !== etapa.orgao.sigla ? (
                  <p className="mt-1 text-sm text-slate-500">{etapa.orgao.nome}</p>
                ) : null}

                {etapa.situacao ? (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    <span className="font-semibold text-slate-700">Situação: </span>
                    {etapa.situacao}
                  </p>
                ) : null}

                {etapa.despacho ? (
                  <details className="group mt-3">
                    <summary className="cursor-pointer list-none text-sm font-semibold text-brasil-blue">
                      Ver despacho
                    </summary>
                    <p className="mt-2 whitespace-pre-line rounded-2xl bg-white p-4 text-sm leading-6 text-slate-600">
                      {etapa.despacho}
                    </p>
                  </details>
                ) : null}
              </article>
            </li>
          );
        })}
      </ol>

      {totalPaginas > 1 && (
        <nav
          className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between"
          aria-label="Paginação da tramitação"
        >
          <p className="text-sm text-slate-500">
            Página {paginaSegura} de {totalPaginas}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => irParaPagina(paginaSegura - 1)}
              disabled={paginaSegura <= 1}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brasil-blue hover:text-brasil-blue disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              Etapas anteriores
            </button>

            <button
              type="button"
              onClick={() => irParaPagina(paginaSegura + 1)}
              disabled={paginaSegura >= totalPaginas}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brasil-blue hover:text-brasil-blue disabled:cursor-not-allowed disabled:opacity-50"
            >
              Próximas etapas
              <ChevronRight size={16} />
            </button>
          </div>
        </nav>
      )}
    </SectionShell>
  );
}
