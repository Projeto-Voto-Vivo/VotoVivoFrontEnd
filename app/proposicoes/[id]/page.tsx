export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { getProposicaoDetalhe } from '@/services/proposicoes';
import { BackButton } from '@/components/layout/BackButton';
import { NavLink } from '@/components/layout/NavLink';
import { AutoresProposicao } from '@/components/proposicoes/AutoresProposicao';
import { DocumentosProposicao } from '@/components/proposicoes/DocumentosProposicao';
import { JornadaBicameral } from '@/components/proposicoes/JornadaBicameral';
import { OrgaosPercorridos } from '@/components/proposicoes/OrgaosPercorridos';
import { ProposicaoHero } from '@/components/proposicoes/ProposicaoHero';
import { TramitacaoTimeline } from '@/components/proposicoes/TramitacaoTimeline';
import { VotacoesProposicao } from '@/components/proposicoes/VotacoesProposicao';

type PaginaProps = {
  params: Promise<{ id: string }>;
};

function parseId(valor: string) {
  const id = Number(valor);
  return Number.isFinite(id) && id > 0 ? Math.trunc(id) : null;
}

export async function generateMetadata({ params }: PaginaProps): Promise<Metadata> {
  const { id } = await params;
  const proposicaoId = parseId(id);

  if (!proposicaoId) return { title: 'Proposição não encontrada' };

  const proposicao = await getProposicaoDetalhe(proposicaoId);

  if (!proposicao) return { title: 'Proposição não encontrada' };

  return {
    title: `${proposicao.titulo} — tramitação`,
    description: proposicao.ementa.slice(0, 160),
  };
}

export default async function TramitacaoProposicaoPage({ params }: PaginaProps) {
  const { id } = await params;
  const proposicaoId = parseId(id);

  if (!proposicaoId) {
    notFound();
  }

  const proposicao = await getProposicaoDetalhe(proposicaoId);

  if (!proposicao) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <div className="container mx-auto space-y-6 px-4 py-8">
        <NavLink
          href="/parlamentares"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-brasil-blue"
        >
          <ArrowLeft size={16} />
          Voltar para parlamentares
        </NavLink>

        <ProposicaoHero proposicao={proposicao} />

        <OrgaosPercorridos passagens={proposicao.orgaosPercorridos} />

        <TramitacaoTimeline
          etapas={proposicao.tramitacao}
          disponivel={proposicao.tramitacaoDisponivel}
        />

        <VotacoesProposicao votacoes={proposicao.votacoes} />

        <AutoresProposicao autores={proposicao.autores} />

        <DocumentosProposicao
          documentos={proposicao.documentos}
          disponivel={proposicao.documentosDisponiveis}
          urlFonteOficial={proposicao.urlFonteOficial}
        />

        <JornadaBicameral jornada={proposicao.jornada} />

        <BackButton href="/parlamentares" label="Voltar para parlamentares" />
      </div>
    </main>
  );
}
