import { FileText, Landmark, Receipt, Vote } from 'lucide-react';
import { ParlamentarPerfil } from '@/types';
import { ParlamentarIndicators } from '../ParlamentarIndicators';
import { SectionShell } from '../shared/SectionShell';
import { formatCurrency, formatDate } from '../shared/formatters';

interface VisaoGeralPanelProps {
  profile: ParlamentarPerfil;
}

export function VisaoGeralPanel({ profile }: VisaoGeralPanelProps) {
  const { emendas, proposicoes, votacoes } = profile;

  const emendaDestaque = emendas.destaques[0];
  const proposicaoDestaque = proposicoes[0];
  const votacaoDestaque = votacoes.destaques[0];

  return (
    <div className="space-y-6">
      <ParlamentarIndicators indicadores={profile.indicadores} />

      <SectionShell
        icon={<Landmark className="h-6 w-6" />}
        title="Destaques recentes"
        description="Resumo de movimentos recentes e informações de maior interesse nas áreas do perfil."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-brasil-blue/10 p-2 text-brasil-blue">
                <Receipt className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Emenda em destaque
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  {emendaDestaque?.codigoEmenda ?? 'Nenhuma emenda vinculada'}
                </h3>
              </div>
            </div>

            {emendaDestaque ? (
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <p>
                  {emendaDestaque.funcao || 'Função não informada'}
                  {emendaDestaque.localidadeDoGasto
                    ? ` · ${emendaDestaque.localidadeDoGasto}`
                    : ''}
                </p>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Valor empenhado
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {formatCurrency(emendaDestaque.valorEmpenhado)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-slate-500">
                Nenhuma emenda vinculada foi encontrada para este parlamentar.
              </p>
            )}
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-brasil-green/10 p-2 text-brasil-green">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Proposição recente
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  {proposicaoDestaque?.titulo ?? 'Sem proposição destacada'}
                </h3>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              {proposicaoDestaque?.resumo ??
                'As proposições vinculadas ao parlamentar serão exibidas aqui conforme a integração avançar.'}
            </p>

            {proposicaoDestaque && (
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  {proposicaoDestaque.papel}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  {proposicaoDestaque.situacao}
                </span>
              </div>
            )}
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-amber-100 p-2 text-amber-700">
                <Vote className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Votação recente
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  {votacaoDestaque?.titulo ?? 'Sem votação destacada'}
                </h3>
              </div>
            </div>

            {votacaoDestaque ? (
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <p>{votacaoDestaque.resumo}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Voto
                    </p>
                    <p className="mt-1 font-bold text-slate-900">{votacaoDestaque.voto}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Data
                    </p>
                    <p className="mt-1 font-bold text-slate-900">
                      {formatDate(votacaoDestaque.data)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-slate-500">
                As votações serão exibidas aqui quando os dados estiverem disponíveis.
              </p>
            )}
          </article>
        </div>
      </SectionShell>
    </div>
  );
}
