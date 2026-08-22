import { ArrowRight, FileText, Landmark, Receipt, Users, Vote } from 'lucide-react';
import Link from 'next/link';
import { ParlamentarPerfil } from '@/types';
import { ParlamentarIndicators } from '../ParlamentarIndicators';
import { SectionShell } from '../shared/SectionShell';
import { formatCurrency, formatDate } from '../shared/formatters';

interface VisaoGeralPanelProps {
  profile: ParlamentarPerfil;
}

function formatPeriodo(inicio: string | null, fim: string | null) {
  if (!inicio && !fim) return null;

  const de = inicio ? formatDate(inicio) : 'início não informado';
  const ate = fim ? formatDate(fim) : 'atual';

  return `${de} — ${ate}`;
}

export function VisaoGeralPanel({ profile }: VisaoGeralPanelProps) {
  const { comissoes, emendas, filiacoes, mandatos, proposicoes, votacoes } = profile;

  // Só a página carregada de emendas está em memória: o rótulo diz isso.
  const emendaDestaque = emendas.destaques.length
    ? [...emendas.destaques].sort((a, b) => b.valorEmpenhado - a.valorEmpenhado)[0]
    : undefined;
  const emendaDestaqueSobreAmostra =
    emendas.destaques.length > 0 && emendas.quantidade > emendas.destaques.length;

  const proposicaoDestaque = proposicoes[0];
  const votacaoDestaque = votacoes.destaques[0];

  return (
    <div className="space-y-6">
      <ParlamentarIndicators indicadores={profile.indicadores} />

      <SectionShell
        icon={<Landmark className="h-6 w-6" />}
        title="Destaques do perfil"
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-brasil-blue/10 p-2 text-brasil-blue">
                <Receipt className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {emendaDestaqueSobreAmostra
                    ? `Maior emenda entre as ${emendas.destaques.length} carregadas`
                    : 'Maior emenda empenhada'}
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  {emendaDestaque?.codigoEmenda ?? 'Sem emenda vinculada'}
                </h3>
              </div>
            </div>

            {emendaDestaque ? (
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-brasil-blue/10 px-3 py-1 text-xs font-bold text-brasil-blue">
                    Maior valor empenhado
                  </span>
                  {emendaDestaque.localidadeDoGasto ? (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                      {emendaDestaque.localidadeDoGasto}
                    </span>
                  ) : null}
                </div>
                <p>{emendaDestaque.funcao || 'Função não informada'}</p>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Valor empenhado
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {formatCurrency(emendaDestaque.valorEmpenhado)}
                  </p>
                </div>
                <Link
                  href={`/parlamentares/${profile.parlamentar.id}/emendas/${emendaDestaque.id}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brasil-blue hover:underline"
                >
                  Ver detalhes da emenda
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-slate-500">
                Nenhuma emenda vinculada a este parlamentar.
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
                  Proposição em destaque
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  {proposicaoDestaque?.titulo ?? 'Sem proposição vinculada'}
                </h3>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              {proposicaoDestaque?.resumo ?? 'Nenhuma proposição vinculada a este parlamentar.'}
            </p>

            {proposicaoDestaque && (
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                {proposicaoDestaque.papel ? (
                  <span className="rounded-full bg-slate-100 px-3 py-1">
                    {proposicaoDestaque.papel}
                  </span>
                ) : null}
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  {proposicaoDestaque.situacao}
                </span>
                {proposicaoDestaque.dataApresentacao ? (
                  <span className="rounded-full bg-slate-100 px-3 py-1">
                    Apresentada em {formatDate(proposicaoDestaque.dataApresentacao)}
                  </span>
                ) : null}
              </div>
            )}

            {proposicaoDestaque && (
              <Link
                href={`/proposicoes/${proposicaoDestaque.id}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brasil-blue hover:underline"
              >
                Ver tramitação
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            )}
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-amber-100 p-2 text-amber-700">
                <Vote className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Votação mais recente
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  {votacaoDestaque?.titulo ?? 'Sem votação registrada'}
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

                {/*
                  Não há página de votação avulsa: o destino natural é a
                  tramitação da proposição votada, onde a votação aparece com
                  placar e orientação. Requerimento não tem proposição, e aí
                  não há para onde mandar.
                */}
                {votacaoDestaque.proposicao ? (
                  <Link
                    href={`/proposicoes/${votacaoDestaque.proposicao.id}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brasil-blue hover:underline"
                  >
                    Ver {votacaoDestaque.proposicao.titulo}
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                ) : null}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-slate-500">
                Nenhuma votação nominal registrada para este parlamentar.
              </p>
            )}
          </article>
        </div>
      </SectionShell>

      {comissoes.length > 0 && (
        <SectionShell
          icon={<Users className="h-6 w-6" />}
          title="Órgãos e comissões"
          description="Participação oficial em comissões e outros órgãos do Congresso."
        >
          <ul className="grid gap-3 md:grid-cols-2">
            {comissoes.map((comissao) => {
              const periodo = formatPeriodo(comissao.dataInicio, comissao.dataFim);

              return (
                <li
                  key={comissao.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-sm font-bold text-slate-900">
                    {comissao.nome}
                    {comissao.sigla ? ` (${comissao.sigla})` : ''}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                    {comissao.papel ? (
                      <span className="rounded-full bg-white px-3 py-1">{comissao.papel}</span>
                    ) : null}
                    {comissao.tipoOrgao ? (
                      <span className="rounded-full bg-white px-3 py-1">
                        {comissao.tipoOrgao}
                      </span>
                    ) : null}
                    {periodo ? (
                      <span className="rounded-full bg-white px-3 py-1">{periodo}</span>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionShell>
      )}

      {(mandatos.length > 0 || filiacoes.length > 0) && (
        <SectionShell
          icon={<Landmark className="h-6 w-6" />}
          title="Trajetória do mandato"
          description="Períodos de exercício e histórico partidário registrados na fonte oficial."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            {mandatos.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Períodos de exercício
                </p>
                <ul className="mt-3 space-y-2">
                  {mandatos.map((mandato) => (
                    <li
                      key={mandato.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600"
                    >
                      <span className="font-semibold text-slate-900">
                        {formatPeriodo(mandato.dataInicio, mandato.dataFim) ??
                          'Período não informado'}
                      </span>
                      {mandato.casa ? ` · ${mandato.casa}` : ''}
                      {mandato.legislatura ? ` · ${mandato.legislatura}` : ''}
                      {mandato.condicao ? ` · ${mandato.condicao}` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {filiacoes.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Histórico partidário
                </p>
                <ul className="mt-3 space-y-2">
                  {filiacoes.map((filiacao) => (
                    <li
                      key={filiacao.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600"
                    >
                      <span className="font-semibold text-slate-900">
                        {filiacao.siglaPartido}
                      </span>
                      {filiacao.nomePartido ? ` · ${filiacao.nomePartido}` : ''}
                      {formatPeriodo(filiacao.dataInicio, filiacao.dataFim)
                        ? ` · ${formatPeriodo(filiacao.dataInicio, filiacao.dataFim)}`
                        : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </SectionShell>
      )}
    </div>
  );
}
