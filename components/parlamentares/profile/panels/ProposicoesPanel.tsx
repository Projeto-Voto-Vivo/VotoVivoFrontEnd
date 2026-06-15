import { FileText } from 'lucide-react';
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
    <SectionShell
      icon={<FileText className="h-6 w-6" />}
      title="Proposições"
    >
      {proposicoes.length > 0 ? (
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
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-500">
          Sem proposições vinculadas nesta base.
        </div>
      )}
    </SectionShell>
  );
}
