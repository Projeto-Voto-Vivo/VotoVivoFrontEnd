'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CircleHelp,
  ExternalLink,
  FileText,
  Landmark,
  Mail,
  MapPin,
  Phone,
  Receipt,
  ShieldCheck,
  Vote,
  Wallet,
} from 'lucide-react';
import { ReactNode, useMemo, useState } from 'react';
import { ParlamentarPerfil, PerfilIndicador } from '@/types';

interface ParlamentarProfileProps {
  profile: ParlamentarPerfil;
}

type PanelKey = 'visao-geral' | 'proposicoes' | 'emendas' | 'votacoes' | 'despesas';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T12:00:00`));
}

function indicatorStyles(destaque?: PerfilIndicador['destaque']) {
  if (destaque === 'positivo') return 'border-brasil-green/20 bg-brasil-green/5';
  if (destaque === 'atencao') return 'border-amber-200 bg-amber-50';
  return 'border-slate-200 bg-white';
}

function SectionShell({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex items-start gap-4">
        <div className="rounded-2xl bg-brasil-blue/10 p-3 text-brasil-blue">{icon}</div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function PanelButton({
  active,
  icon,
  label,
  supporting,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  supporting: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group rounded-2xl border p-4 text-left transition-all ${
        active
          ? 'border-brasil-blue bg-brasil-blue text-white shadow-sm'
          : 'border-slate-200 bg-white text-slate-700 hover:border-brasil-blue/40 hover:bg-brasil-blue/5'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`rounded-2xl p-3 ${
            active ? 'bg-white/15 text-white' : 'bg-slate-100 text-brasil-blue group-hover:bg-brasil-blue/10'
          }`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className={`font-semibold ${active ? 'text-white' : 'text-slate-900'}`}>{label}</p>
          <p className={`mt-1 text-sm leading-6 ${active ? 'text-white/85' : 'text-slate-500'}`}>{supporting}</p>
        </div>
      </div>
    </button>
  );
}

function MicroInfoCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <div className="mt-2 text-sm font-medium leading-6 text-slate-700">{value}</div>
    </div>
  );
}

export function ParlamentarProfile({ profile }: ParlamentarProfileProps) {
  const { parlamentar, despesas, proposicoes, votacoes, emendas } = profile;
  const [activePanel, setActivePanel] = useState<PanelKey>('visao-geral');

  const panelOptions = useMemo(
    () => [
      {
        key: 'visao-geral' as const,
        label: 'Visão geral',
        supporting: 'Síntese da atuação e dos dados principais.',
        icon: <Landmark className="h-5 w-5" />,
      },
      {
        key: 'proposicoes' as const,
        label: 'Proposições',
        supporting: 'Matérias destacadas com leitura didática.',
        icon: <FileText className="h-5 w-5" />,
      },
      {
        key: 'emendas' as const,
        label: 'Emendas',
        supporting: 'Resumo de recursos destinados e executados.',
        icon: <Receipt className="h-5 w-5" />,
      },
      {
        key: 'votacoes' as const,
        label: 'Votações',
        supporting: 'Contexto, voto e resultado no mesmo lugar.',
        icon: <Vote className="h-5 w-5" />,
      },
      {
        key: 'despesas' as const,
        label: 'Despesas',
        supporting: 'Resumo consolidado e itens recentes.',
        icon: <Wallet className="h-5 w-5" />,
      },
    ],
    [],
  );

  function renderActivePanel() {
    if (activePanel === 'visao-geral') {
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
                  Voto registrado: <strong>{principalVotacao?.voto ?? 'Não informado'}</strong>. Resultado:{' '}
                  <strong>{principalVotacao?.resultado ?? 'Não informado'}</strong>.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-brasil-blue">Uso de recursos</p>
                <h3 className="mt-2 text-lg font-bold text-slate-900">{formatCurrency(despesas.totalAno)}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Total registrado no ano. A maior concentração está em{' '}
                  <strong>{principalCategoriaDespesa?.categoria ?? 'categoria não informada'}</strong>.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-brasil-blue">Participação institucional</p>
                <h3 className="mt-2 text-lg font-bold text-slate-900">{profile.comissoes.length} espaços mapeados</h3>
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
                  <div className="h-full rounded-full bg-brasil-green" style={{ width: `${votacoes.presenca}%` }} />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
                  <span>Alinhamento em votações</span>
                  <span>{votacoes.alinhamento}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-brasil-blue" style={{ width: `${votacoes.alinhamento}%` }} />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              Este painel resume os principais blocos do perfil sem repetir todos os detalhes das abas específicas.
              Para aprofundar, use os painéis de proposições, votações, despesas e emendas.
            </div>

            <div className="mt-5 grid gap-3">
              {profile.comissoes.slice(0, 3).map((comissao) => (
                <div key={comissao} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700">
                  {comissao}
                </div>
              ))}
            </div>
          </SectionShell>
        </div>
      );
    }

    if (activePanel === 'proposicoes') {
      return (
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <SectionShell
            icon={<FileText className="h-6 w-6" />}
            title="Proposições em destaque"
            description="Cartões com linguagem clara para mostrar papel do parlamentar, estágio da matéria e impacto esperado para o cidadão."
          >
            <div className="grid gap-4 lg:grid-cols-2">
              {proposicoes.map((proposicao) => (
                <article key={proposicao.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition-colors hover:border-brasil-blue/30">
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
                  É toda matéria legislativa apresentada para análise. Neste layout, o usuário vê o tipo, o momento da tramitação, o papel do parlamentar e uma explicação do impacto em linguagem simples.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                <p className="font-semibold text-slate-900">Por que mostrar o papel?</p>
                <p className="mt-2">
                  Autoria, coautoria, relatoria e requerimentos têm pesos diferentes. Exibir esse detalhe ajuda o usuário a entender o nível de envolvimento do parlamentar em cada pauta.
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

    if (activePanel === 'emendas') {
      return (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <SectionShell
            icon={<Receipt className="h-6 w-6" />}
            title="Emendas parlamentares"
            description="Visão resumida dos recursos vinculados ao parlamentar, usando os campos já previstos na API de emendas."
          >
            <div className="grid gap-3 md:grid-cols-3">
              <MicroInfoCard label="Empenhado" value={formatCurrency(emendas.totalEmpenhado)} />
              <MicroInfoCard label="Liquidado" value={formatCurrency(emendas.totalLiquidado)} />
              <MicroInfoCard label="Pago" value={formatCurrency(emendas.totalPago)} />
            </div>

            <div className="mt-6 space-y-4">
              {emendas.destaques.map((emenda) => (
                <article key={emenda.codigoEmenda} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-brasil-blue">Emenda {emenda.numeroEmenda}</p>
                      <h3 className="mt-1 text-lg font-bold text-slate-900">{emenda.funcao}</h3>
                      <p className="mt-1 text-sm text-slate-500">{emenda.subfuncao}</p>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                      {emenda.tipoEmenda} · {emenda.localidadeDoGasto}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <MicroInfoCard label="Empenhado" value={formatCurrency(emenda.valorEmpenhado)} />
                    <MicroInfoCard label="Liquidado" value={formatCurrency(emenda.valorLiquidado)} />
                    <MicroInfoCard label="Pago" value={formatCurrency(emenda.valorPago)} />
                  </div>
                </article>
              ))}
            </div>
          </SectionShell>

          <SectionShell
            icon={<CircleHelp className="h-6 w-6" />}
            title="Leitura do resumo"
            description="Apoio para entender a diferença entre o dado resumido da emenda e os documentos que serão usados na tela detalhada."
          >
            <div className="grid gap-3 md:grid-cols-2">
              <MicroInfoCard label="Quantidade" value={`${emendas.quantidade} emendas`} />
              <MicroInfoCard label="Tipo principal" value={emendas.principalTipo} />
              <MicroInfoCard label="Localidade" value={emendas.principalLocalidade} />
              <MicroInfoCard label="Restos inscritos" value={formatCurrency(emendas.totalRestoInscrito)} />
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              {emendas.leituraRapida}
            </div>

            <div className="mt-6 space-y-3">
              <p className="text-sm font-semibold text-slate-900">Documentos recentes</p>
              {emendas.documentosRecentes.map((documento) => (
                <div key={documento.codigoDocumento} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{documento.codigoDocumentoResumido}</p>
                      <p>{documento.especieTipo}</p>
                    </div>
                    <span className="rounded-full bg-brasil-green/10 px-3 py-1 text-xs font-semibold text-brasil-green">
                      {documento.fase}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{formatDate(documento.data)}</p>
                </div>
              ))}
            </div>
          </SectionShell>
        </div>
      );
    }

    if (activePanel === 'votacoes') {
      return (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <SectionShell
            icon={<Vote className="h-6 w-6" />}
            title="Votações e posicionamentos"
            description="A combinação de contexto, voto registrado e resultado final torna o histórico de votação mais compreensível para o público geral."
          >
            <div className="space-y-4">
              {votacoes.destaques.map((votacao) => (
                <article key={votacao.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
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
                  <div className="h-full rounded-full bg-brasil-green" style={{ width: `${votacoes.presenca}%` }} />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
                  <span>Alinhamento com a orientação predominante do bloco</span>
                  <span>{votacoes.alinhamento}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-brasil-blue" style={{ width: `${votacoes.alinhamento}%` }} />
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

    const maiorCategoria = despesas.categorias[0];
    const totalCategorias = despesas.categorias.reduce((acc, categoria) => acc + categoria.valor, 0) || despesas.totalAno;

    return (
      <div className="space-y-6">
        <SectionShell
          icon={<Wallet className="h-6 w-6" />}
          title="Resumo das despesas"
          description="Antes da listagem detalhada, esta área resume o total gasto, as maiores categorias e a distribuição dos recursos."
        >
          <div className="grid gap-3 md:grid-cols-3">
            <MicroInfoCard label="Total no ano" value={formatCurrency(despesas.totalAno)} />
            <MicroInfoCard label="Média mensal" value={formatCurrency(despesas.mediaMensal)} />
            <MicroInfoCard label="Maior reembolso" value={formatCurrency(despesas.maiorReembolso)} />
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">Leitura rápida</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              A maior parte das despesas registradas está concentrada em{' '}
              <strong>{maiorCategoria?.categoria ?? 'categoria não informada'}</strong>, com valor aproximado de{' '}
              <strong>{formatCurrency(maiorCategoria?.valor ?? 0)}</strong>. A listagem detalhada aparece mais abaixo,
              para deixar a primeira leitura do painel menos poluída.
            </p>
          </div>
        </SectionShell>

        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <SectionShell
            icon={<Building2 className="h-6 w-6" />}
            title="Distribuição por categoria"
            description="Gráfico de pizza simplificado com base nas categorias de despesa."
          >
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <div
                className="h-44 w-44 shrink-0 rounded-full border border-slate-200 shadow-inner"
                style={{
                  background: `conic-gradient(
                    #002776 0deg 122deg,
                    #009c3b 122deg 219deg,
                    #ffdf00 219deg 287deg,
                    #94a3b8 287deg 360deg
                  )`,
                }}
              />

              <div className="w-full space-y-3">
                {despesas.categorias.map((categoria, index) => {
                  const percentual = Math.round((categoria.valor / totalCategorias) * 100);

                  return (
                    <div key={categoria.categoria} className="flex items-center justify-between gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-3 w-3 rounded-full ${
                            index === 0
                              ? 'bg-brasil-blue'
                              : index === 1
                                ? 'bg-brasil-green'
                                : index === 2
                                  ? 'bg-brasil-yellow'
                                  : 'bg-slate-400'
                          }`}
                        />
                        <span className="font-medium text-slate-700">{categoria.categoria}</span>
                      </div>
                      <span className="font-semibold text-slate-900">{percentual}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionShell>

          <SectionShell
            icon={<Receipt className="h-6 w-6" />}
            title="Maiores categorias"
            description="Barras horizontais para comparar rapidamente onde os recursos se concentram."
          >
            <div className="space-y-4">
              {despesas.categorias.map((categoria) => {
                const percentual = Math.round((categoria.valor / totalCategorias) * 100);

                return (
                  <div key={categoria.categoria} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">{categoria.categoria}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{categoria.descricao}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">{formatCurrency(categoria.valor)}</p>
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{percentual}%</p>
                      </div>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-brasil-blue" style={{ width: `${percentual}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionShell>
        </div>

        <SectionShell
          icon={<Receipt className="h-6 w-6" />}
          title="Despesas recentes"
          description="Listagem simplificada dos registros mais recentes."
        >
          <div className="grid gap-3">
            {despesas.itensRecentes.map((item) => (
              <div key={`${item.data}-${item.fornecedor}-${item.tipo}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{item.tipo}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.fornecedor}</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                      {formatDate(item.data)}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-lg font-bold text-slate-900">{formatCurrency(item.valor)}</p>
                    <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                      <Receipt size={14} />
                      {item.documentoLabel}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
      </div>
    );
  }

  const currentPanelLabel = panelOptions.find((panel) => panel.key === activePanel)?.label ?? 'Visão geral';

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <Link
        href="/parlamentares"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-brasil-blue"
      >
        <ArrowLeft size={16} />
        Voltar para parlamentares
      </Link>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-2 bg-gradient-to-r from-brasil-green via-brasil-yellow to-brasil-blue" />
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="w-full shrink-0 lg:w-[260px]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  <Image
                    src={parlamentar.urlFoto}
                    alt={parlamentar.nomeParlamentar}
                    fill
                    sizes="(max-width: 1024px) 100vw, 260px"
                    className="object-cover object-top"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brasil-blue shadow-sm">
                      <BadgeCheck size={14} />
                      Perfil ampliado
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brasil-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brasil-blue">
                    Perfil do parlamentar
                  </span>
                  <span className="rounded-full border border-brasil-green/10 bg-brasil-green/10 px-3 py-1 text-xs font-medium text-brasil-green">
                    {parlamentar.situacaoMandato ?? parlamentar.situacao}
                  </span>
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                    Dados híbridos: backend + mock
                  </span>
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">{parlamentar.nomeParlamentar}</h1>
                  <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">{profile.subtitulo}</p>
                </div>

                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 font-medium text-slate-700">
                    {parlamentar.cargo ?? 'Parlamentar'}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 font-medium text-slate-700">
                    {parlamentar.siglaPartido} · {parlamentar.uf}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 font-medium text-slate-700">
                    {parlamentar.casaLegislativa ?? 'Poder Legislativo'}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 font-medium text-slate-700">
                    {parlamentar.legislatura ?? 'Legislatura atual'}
                  </span>
                </div>

                <p className="max-w-3xl text-base leading-7 text-slate-600">{profile.resumo}</p>

              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Contato e identificação</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-brasil-blue" />
                <div>
                  <p className="font-semibold text-slate-900">E-mail institucional</p>
                  <a href={`mailto:${parlamentar.email}`} className="hover:text-brasil-blue">
                    {parlamentar.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-brasil-blue" />
                <div>
                  <p className="font-semibold text-slate-900">Telefone do gabinete</p>
                  <p>{parlamentar.gabinete.telefone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-brasil-blue" />
                <div>
                  <p className="font-semibold text-slate-900">Gabinete</p>
                  <p>
                    {parlamentar.gabinete.predio} · Sala {parlamentar.gabinete.sala}
                  </p>
                </div>
              </div>
            </div>

            {parlamentar.redesSociais.length > 0 && (
              <div className="mt-6 border-t border-slate-200 pt-5">
                <p className="text-sm font-semibold text-slate-900">Canais públicos</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {parlamentar.redesSociais.map((rede) => (
                    <Link
                      key={`${rede.rede}-${rede.url}`}
                      href={rede.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-brasil-blue hover:text-brasil-blue"
                    >
                      {rede.rede}
                      <ExternalLink size={14} />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {profile.indicadores.map((indicador) => (
          <div key={indicador.titulo} className={`rounded-3xl border p-5 shadow-sm ${indicatorStyles(indicador.destaque)}`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{indicador.titulo}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{indicador.valor}</p>
            {indicador.apoio && <p className="mt-2 text-sm leading-6 text-slate-500">{indicador.apoio}</p>}
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Painéis do perfil</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Tudo no mesmo lugar, só trocando a camada principal</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Clique em um painel para atualizar a área principal do perfil sem sair da página. A lógica de dados continua a mesma; mudamos apenas a navegação visual.
            </p>
          </div>
          <div className="rounded-full border border-brasil-blue/10 bg-brasil-blue/5 px-4 py-2 text-sm font-medium text-brasil-blue">
            Painel ativo: {currentPanelLabel}
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {panelOptions.map((panel) => (
            <PanelButton
              key={panel.key}
              active={activePanel === panel.key}
              icon={panel.icon}
              label={panel.label}
              supporting={panel.supporting}
              onClick={() => setActivePanel(panel.key)}
            />
          ))}
        </div>
      </section>

      {renderActivePanel()}
    </div>
  );
}
