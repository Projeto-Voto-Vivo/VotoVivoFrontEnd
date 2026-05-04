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

type PanelKey = 'visao-geral' | 'proposicoes' | 'votacoes' | 'despesas';

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
  const { parlamentar, despesas, proposicoes, votacoes } = profile;
  const [activePanel, setActivePanel] = useState<PanelKey>('visao-geral');

  const panelOptions = useMemo(
    () => [
      {
        key: 'visao-geral' as const,
        label: 'Visão geral',
        supporting: 'Resumo institucional e foco do mandato.',
        icon: <Landmark className="h-5 w-5" />,
      },
      {
        key: 'proposicoes' as const,
        label: 'Proposições',
        supporting: 'Matérias destacadas com leitura didática.',
        icon: <FileText className="h-5 w-5" />,
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
      return (
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <SectionShell
            icon={<Landmark className="h-6 w-6" />}
            title="Visão geral do mandato"
            description="Contexto institucional e elementos essenciais para apresentar quem é o parlamentar e como o mandato está estruturado."
          >
            <p className="text-base leading-8 text-slate-600">{profile.biografia}</p>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <MicroInfoCard label="Casa legislativa" value={parlamentar.casaLegislativa ?? 'Poder Legislativo'} />
              <MicroInfoCard label="Situação" value={parlamentar.situacaoMandato ?? parlamentar.situacao} />
              <MicroInfoCard label="Data de nascimento" value={formatDate(parlamentar.dataNascimento)} />
              <MicroInfoCard label="Contato de gabinete" value={parlamentar.gabinete.email} />
            </div>
          </SectionShell>

          <SectionShell
            icon={<ShieldCheck className="h-6 w-6" />}
            title="Atuação em foco"
            description="Resumo dos temas e espaços institucionais que ajudam o usuário a contextualizar o mandato antes de mergulhar nos dados."
          >
            <div className="flex flex-wrap gap-2">
              {profile.temasPrioritarios.map((tema) => (
                <span
                  key={tema}
                  className="rounded-full border border-brasil-green/20 bg-brasil-green/10 px-3 py-1 text-sm font-medium text-brasil-green"
                >
                  {tema}
                </span>
              ))}
            </div>

            <div className="mt-6 grid gap-3">
              {profile.comissoes.map((comissao) => (
                <div key={comissao} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700">
                  {comissao}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-brasil-blue/5 p-4 text-sm leading-6 text-slate-600">
              O bloco de atuação funciona como um resumo editorial do mandato e ajuda o usuário a entender quais pautas aparecem com mais frequência no restante do perfil.
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

    return (
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionShell
          icon={<Wallet className="h-6 w-6" />}
          title="Despesas do mandato"
          description="Resumo com total anual, categorias de gasto e itens recentes apresentados em formato mais amigável para o cidadão."
        >
          <div className="grid gap-3 md:grid-cols-3">
            <MicroInfoCard label="Total no ano" value={formatCurrency(despesas.totalAno)} />
            <MicroInfoCard label="Média mensal" value={formatCurrency(despesas.mediaMensal)} />
            <MicroInfoCard label="Maior reembolso" value={formatCurrency(despesas.maiorReembolso)} />
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-500">Data</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-500">Tipo</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-500">Fornecedor</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-500">Valor</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-500">Documento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {despesas.itensRecentes.map((item) => (
                    <tr key={`${item.data}-${item.fornecedor}-${item.tipo}`} className="align-top">
                      <td className="px-4 py-4 text-slate-600">{formatDate(item.data)}</td>
                      <td className="px-4 py-4 font-medium text-slate-700">{item.tipo}</td>
                      <td className="px-4 py-4 text-slate-600">{item.fornecedor}</td>
                      <td className="px-4 py-4 font-semibold text-slate-900">{formatCurrency(item.valor)}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                          <Receipt size={14} />
                          {item.documentoLabel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SectionShell>

        <SectionShell
          icon={<Building2 className="h-6 w-6" />}
          title="Leitura por categoria"
          description="Visual simples para mostrar onde o recurso se concentra e o que cada categoria representa para o usuário final."
        >
          <div className="space-y-4">
            {despesas.categorias.map((categoria) => {
              const percentual = Math.round((categoria.valor / despesas.totalAno) * 100);
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

          <div className="mt-6 rounded-2xl border border-slate-200 bg-brasil-blue/5 p-4 text-sm leading-6 text-slate-600">
            Este bloco foi pensado para reduzir o esforço de leitura. Em vez de mostrar apenas uma tabela de recibos, a interface exibe primeiro a visão consolidada e depois o detalhe operacional.
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

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <CircleHelp size={16} className="text-brasil-blue" />
                    Como ler este perfil
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Em vez de te mandar para vários trechos da página, os painéis abaixo trocam o conteúdo principal no mesmo lugar. Assim fica mais fácil comparar visão geral, proposições, votações e despesas sem perder o contexto.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profile.temasPrioritarios.map((tema) => (
                    <span
                      key={tema}
                      className="rounded-full border border-brasil-blue/10 bg-brasil-blue/5 px-3 py-1 text-sm font-medium text-brasil-blue"
                    >
                      {tema}
                    </span>
                  ))}
                </div>
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

          <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Observações do protótipo</p>
            <div className="mt-4 space-y-3">
              {profile.observacoesMock.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-200">
                  {item}
                </div>
              ))}
            </div>
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

        <div className="mt-5 grid gap-3 lg:grid-cols-4">
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
