import { ExternalLink } from 'lucide-react';
import { ProposicaoDetalhe } from '@/types';
import { formatDate } from '@/components/parlamentares/profile/shared/formatters';

interface ProposicaoHeroProps {
  proposicao: ProposicaoDetalhe;
}

export function ProposicaoHero({ proposicao }: ProposicaoHeroProps) {
  const etapaAtual = proposicao.tramitacao[proposicao.tramitacao.length - 1];

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="h-2 bg-gradient-to-r from-brasil-green via-brasil-yellow to-brasil-blue" />

      <div className="p-5 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brasil-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brasil-blue">
            Tramitação
          </span>
          {proposicao.casa ? (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              {proposicao.casa}
            </span>
          ) : null}
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
          {proposicao.titulo}
        </h1>

        <p className="mt-3 max-w-4xl text-base leading-7 text-slate-600 md:text-lg md:leading-8">
          {proposicao.ementa}
        </p>

        {proposicao.temas.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
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

        <dl className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Situação atual
            </dt>
            <dd className="mt-2 text-sm font-medium leading-6 text-slate-700">
              {proposicao.situacao ?? 'Não informada'}
            </dd>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Apresentada em
            </dt>
            <dd className="mt-2 text-sm font-medium leading-6 text-slate-700">
              {proposicao.dataApresentacao
                ? formatDate(proposicao.dataApresentacao)
                : 'Data não informada'}
            </dd>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Etapas registradas
            </dt>
            <dd className="mt-2 text-sm font-medium leading-6 text-slate-700">
              {proposicao.tramitacaoDisponivel
                ? `${proposicao.tramitacao.length} etapa${proposicao.tramitacao.length === 1 ? '' : 's'}`
                : 'Sem dados'}
            </dd>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Última movimentação
            </dt>
            <dd className="mt-2 text-sm font-medium leading-6 text-slate-700">
              {etapaAtual?.data ? formatDate(etapaAtual.data) : 'Sem dados'}
            </dd>
          </div>
        </dl>

        {proposicao.urlFonteOficial ? (
          <a
            href={proposicao.urlFonteOficial}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-brasil-blue transition hover:border-brasil-blue"
          >
            Ver ficha na fonte oficial
            <ExternalLink size={14} />
          </a>
        ) : null}
      </div>
    </section>
  );
}
