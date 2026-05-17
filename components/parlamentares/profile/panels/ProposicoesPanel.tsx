import { CircleHelp, FileText } from 'lucide-react';
import { ParlamentarPerfil } from '@/types';
import { MicroInfoCard } from '../shared/MicroInfoCard';
import { SectionShell } from '../shared/SectionShell';
import { formatDate } from '../shared/formatters';

interface ProposicoesPanelProps {
  profile: ParlamentarPerfil;
}

export function ProposicoesPanel({ profile }: ProposicoesPanelProps) {
  const { proposicoes } = profile;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <SectionShell
        icon={<FileText className="h-6 w-6" />}
        title="Proposições em destaque"
        description="Cartões com linguagem clara para mostrar papel do parlamentar, estágio da matéria e impacto esperado para o cidadão."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {proposicoes.map((proposicao) => (
            <article
              key={proposicao.id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition-colors hover:border-brasil-blue/30"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brasil-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brasil-blue">
                  {proposicao.titulo}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                  {proposicao.situacao}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">{proposicao.tema}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{proposicao.resumo}</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <MicroInfoCard label="Papel" value={proposicao.papel} />
                <MicroInfoCard label="Apresentação" value={formatDate(proposicao.data)} />
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
                <p className="font-semibold text-slate-900">Por que isso importa</p>
                <p className="mt-2">{proposicao.impactoCidadao}</p>
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        icon={<CircleHelp className="h-6 w-6" />}
        title="Leitura didática"
        description="Apoio textual para não deixar o usuário perdido em termos legislativos ou em estágios de tramitação."
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            <p className="font-semibold text-slate-900">O que é uma proposição?</p>
            <p className="mt-2">
              É toda matéria legislativa apresentada para análise. Neste layout, o usuário vê o tipo,
              o momento da tramitação, o papel do parlamentar e uma explicação do impacto em linguagem simples.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            <p className="font-semibold text-slate-900">Por que mostrar o papel?</p>
            <p className="mt-2">
              Autoria, coautoria, relatoria e requerimentos têm pesos diferentes. Exibir esse detalhe ajuda
              o usuário a entender o nível de envolvimento do parlamentar em cada pauta.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <MicroInfoCard label="Itens na vitrine" value={`${proposicoes.length} proposições`} />
            <MicroInfoCard label="Tema mais forte" value={profile.temasPrioritarios[0]} />
          </div>
        </div>
      </SectionShell>
    </div>
  );
}