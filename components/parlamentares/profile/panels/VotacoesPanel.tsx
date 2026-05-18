import { BadgeCheck, Vote } from 'lucide-react';
import { ParlamentarPerfil } from '@/types';
import { MicroInfoCard } from '../shared/MicroInfoCard';
import { SectionShell } from '../shared/SectionShell';
import { formatDate } from '../shared/formatters';

interface VotacoesPanelProps {
  profile: ParlamentarPerfil;
}

export function VotacoesPanel({ profile }: VotacoesPanelProps) {
  const { votacoes } = profile;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <SectionShell
        icon={<Vote className="h-6 w-6" />}
        title="Votações e posicionamentos"
        description="A combinação de contexto, voto registrado e resultado final torna o histórico de votação mais compreensível para o público geral."
      >
        <div className="space-y-4">
          {votacoes.destaques.map((votacao) => (
            <article
              key={votacao.id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-brasil-blue">{votacao.titulo}</p>
                  <h3 className="mt-1 text-lg font-bold text-slate-900">{votacao.tema}</h3>
                </div>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                  {formatDate(votacao.data)}
                </span>
              </div>

              <p className="mt-3 text-sm leading-7 text-slate-600">{votacao.resumo}</p>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <MicroInfoCard label="Voto registrado" value={votacao.voto} />
                <MicroInfoCard label="Resultado" value={votacao.resultado} />
                <MicroInfoCard label="Contexto" value={votacao.orientacaoCasa} />
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        icon={<BadgeCheck className="h-6 w-6" />}
        title="Resumo de comportamento"
        description="Indicadores que ajudam o usuário a interpretar frequência, alinhamento e contexto do voto sem depender de leitura técnica."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <MicroInfoCard label="Presença" value={`${votacoes.presenca}%`} />
          <MicroInfoCard label="Alinhamento" value={`${votacoes.alinhamento}%`} />
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
              <span>Presença em sessões registradas</span>
              <span>{votacoes.presenca}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brasil-green"
                style={{ width: `${votacoes.presenca}%` }}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
              <span>Alinhamento com a orientação predominante do bloco</span>
              <span>{votacoes.alinhamento}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brasil-blue"
                style={{ width: `${votacoes.alinhamento}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          {votacoes.leituraRapida}
        </div>
      </SectionShell>
    </div>
  );
}