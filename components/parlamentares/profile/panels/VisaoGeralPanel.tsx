import { Landmark, ShieldCheck } from 'lucide-react';
import { ParlamentarPerfil } from '@/types';
import { SectionShell } from '../shared/SectionShell';
import { formatCurrency } from '../shared/formatters';

interface VisaoGeralPanelProps {
  profile: ParlamentarPerfil;
}

export function VisaoGeralPanel({ profile }: VisaoGeralPanelProps) {
  const { despesas, proposicoes, votacoes } = profile;

  const principalProposicao = proposicoes[0];
  const principalVotacao = votacoes.destaques[0];
  const principalCategoriaDespesa = despesas.categorias[0];

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <SectionShell
        icon={<Landmark className="h-6 w-6" />}
        title="Resumo da atuação parlamentar"
        description="Uma leitura rápida sobre produção legislativa, votações, despesas e participação institucional."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-brasil-blue">Produção legislativa</p>
            <h3 className="mt-2 text-lg font-bold text-slate-900">
              {principalProposicao?.tema ?? 'Tema em acompanhamento'}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {principalProposicao?.resumo ?? 'Resumo das proposições acompanhadas pelo mandato.'}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-brasil-blue">Votação recente</p>
            <h3 className="mt-2 text-lg font-bold text-slate-900">
              {principalVotacao?.titulo ?? 'Votação em destaque'}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Voto registrado: <strong>{principalVotacao?.voto ?? 'Não informado'}</strong>.
              {' '}Resultado: <strong>{principalVotacao?.resultado ?? 'Não informado'}</strong>.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-brasil-blue">Uso de recursos</p>
            <h3 className="mt-2 text-lg font-bold text-slate-900">
              {formatCurrency(despesas.totalAno)}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Total registrado no ano. A maior concentração está em{' '}
              <strong>{principalCategoriaDespesa?.categoria ?? 'categoria não informada'}</strong>.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-brasil-blue">Participação institucional</p>
            <h3 className="mt-2 text-lg font-bold text-slate-900">
              {profile.comissoes.length} espaços mapeados
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Comissões, frentes ou áreas institucionais associadas ao mandato.
            </p>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        icon={<ShieldCheck className="h-6 w-6" />}
        title="Principais sinais do perfil"
        description="Indicadores resumidos para entender rapidamente como o mandato aparece nos dados disponíveis."
      >
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
              <span>Presença em votações</span>
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
              <span>Alinhamento em votações</span>
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
          Este painel resume os principais blocos do perfil sem repetir todos os detalhes das abas específicas.
          Para aprofundar, use os painéis de proposições, votações, despesas e emendas.
        </div>

        <div className="mt-5 grid gap-3">
          {profile.comissoes.slice(0, 3).map((comissao) => (
            <div
              key={comissao}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700"
            >
              {comissao}
            </div>
          ))}
        </div>
      </SectionShell>
    </div>
  );
}