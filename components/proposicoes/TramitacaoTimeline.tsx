'use client';

import { useMemo, useState } from 'react';
import { ArrowDownUp, Building2, Info, Route } from 'lucide-react';
import { EtapaTramitacao } from '@/types';
import { SectionShell } from '@/components/parlamentares/profile/shared/SectionShell';
import { formatDate } from '@/components/parlamentares/profile/shared/formatters';

interface TramitacaoTimelineProps {
  etapas: EtapaTramitacao[];
  disponivel: boolean;
}

export function TramitacaoTimeline({ etapas, disponivel }: TramitacaoTimelineProps) {
  const [maisRecentePrimeiro, setMaisRecentePrimeiro] = useState(false);

  const ordenadas = useMemo(
    () => (maisRecentePrimeiro ? [...etapas].reverse() : etapas),
    [etapas, maisRecentePrimeiro],
  );

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
      <div className="mb-5 flex justify-end">
        <button
          type="button"
          onClick={() => setMaisRecentePrimeiro((atual) => !atual)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brasil-blue hover:text-brasil-blue"
        >
          <ArrowDownUp size={16} />
          {maisRecentePrimeiro ? 'Mais antiga primeiro' : 'Mais recente primeiro'}
        </button>
      </div>

      <ol className="relative space-y-4 border-l-2 border-slate-200 pl-6 md:pl-8">
        {ordenadas.map((etapa, index) => {
          const ehUltima = maisRecentePrimeiro
            ? index === 0
            : index === ordenadas.length - 1;

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
    </SectionShell>
  );
}
