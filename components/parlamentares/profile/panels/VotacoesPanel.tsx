'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  FileText,
  Search,
  Info,
  Loader2,
  Vote,
} from 'lucide-react';
import {
  FiltrosVotacao,
  OpcoesFiltroProposicoes,
  ParlamentarPerfil,
  PresencaDetalhe,
  VotacaoPerfil,
} from '@/types';
import {
  getVotacoesParlamentar,
  OBJETO_VOTACAO_LABELS,
  VOTO_EXPLICACOES,
} from '@/services/parlamentares';
import { carregarOpcoesFiltroProposicoes } from '@/services/proposicoes';
import { DicaTermo } from '@/components/layout/DicaTermo';
import { MicroInfoCard } from '../shared/MicroInfoCard';
import { PainelComDashboards } from '../shared/PainelComDashboards';
import { SectionShell } from '../shared/SectionShell';
import { formatDate } from '../shared/formatters';
import { TemasVotacaoDashboard } from './TemasVotacaoDashboard';

interface VotacoesPanelProps {
  profile: ParlamentarPerfil;
}

function BarraPresenca({ detalhe, titulo }: { detalhe: PresencaDetalhe; titulo: string }) {
  const semDados = detalhe.taxa === null;
  // A barra nunca passa de 100% nem fica negativa, mesmo com dado estranho.
  const largura = semDados ? 0 : Math.min(100, Math.max(0, detalhe.taxa as number));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-slate-600">
        <span className="flex items-center gap-0.5">
          {titulo}
          {/*
            Os números por trás da taxa ficam no "?", como nas fases da
            execução financeira das emendas: quem quer o detalhe abre, e a
            barra continua limpa para quem só quer a leitura rápida.
          */}
          <DicaTermo termo={titulo}>
            {semDados ? (
              <>
                Ainda não temos os registros de presença desta medida. Falta de
                dado não quer dizer que o parlamentar faltou.
              </>
            ) : (
              <>
                <span className="block">Eventos considerados: {detalhe.totalEventos}</span>
                <span className="block">Presenças: {detalhe.presentes}</span>
                {detalhe.justificadas > 0 ? (
                  <span className="block text-amber-700">
                    Faltas justificadas: {detalhe.justificadas}
                  </span>
                ) : null}
                <span className="block text-red-600">Faltas: {detalhe.faltas}</span>
                {/*
                  A taxa abona a falta justificada — licença médica e missão
                  oficial não são o mesmo que sumir. Quem quiser a régua dura
                  tem a estrita.
                */}
                {detalhe.justificadas > 0 && detalhe.taxaEstrita !== null ? (
                  <span className="mt-1 block text-slate-500">
                    As faltas justificadas contam como presença. Sem elas, a
                    taxa é de {detalhe.taxaEstrita}%.
                  </span>
                ) : null}
              </>
            )}
          </DicaTermo>
        </span>
        <span className={`shrink-0 ${semDados ? 'text-slate-400' : ''}`}>
          {semDados ? 'Sem dados' : `${detalhe.taxa}%`}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        {semDados ? (
          <div className="h-full w-full rounded-full bg-[repeating-linear-gradient(45deg,#e2e8f0,#e2e8f0_4px,#f8fafc_4px,#f8fafc_8px)]" />
        ) : (
          <div
            className="h-full rounded-full bg-brasil-green"
            style={{ width: `${largura}%` }}
          />
        )}
      </div>
    </div>
  );
}

export function VotacoesPanel({ profile }: VotacoesPanelProps) {
  const { parlamentar, votacoes: votacoesPerfil } = profile;
  const [votacoes, setVotacoes] = useState<VotacaoPerfil[]>(votacoesPerfil.destaques);
  const [paginaAtual, setPaginaAtual] = useState(votacoesPerfil.paginaAtual || 1);
  const [totalPaginas, setTotalPaginas] = useState(votacoesPerfil.totalPaginas || 1);
  const [totalRegistros, setTotalRegistros] = useState(
    votacoesPerfil.totalRegistros || votacoesPerfil.destaques.length,
  );
  // Tamanho de página informado pelo backend (`meta.limit`), não um literal.
  const [itensPorPagina, setItensPorPagina] = useState(
    votacoesPerfil.itensPorPagina || votacoesPerfil.destaques.length || 1,
  );
  const [carregando, setCarregando] = useState(false);
  const [semProposicaoExcluidas, setSemProposicaoExcluidas] = useState(0);
  /** Contador que força a consulta a repetir quando só a página muda. */
  const [recarregar, setRecarregar] = useState(0);

  // Rascunho do formulário × filtros aplicados: digitar não dispara consulta.
  const [rascunho, setRascunho] = useState<FiltrosVotacao>({});
  const [filtros, setFiltros] = useState<FiltrosVotacao>({});
  const [opcoes, setOpcoes] = useState<OpcoesFiltroProposicoes | null>(null);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('votovivo:loading', {
        detail: { active: carregando, timeoutMs: 15000 },
      }),
    );

    return () => {
      window.dispatchEvent(
        new CustomEvent('votovivo:loading', { detail: { active: false } }),
      );
    };
  }, [carregando]);

  useEffect(() => {
    let cancelado = false;

    carregarOpcoesFiltroProposicoes().then((resultado) => {
      if (!cancelado) setOpcoes(resultado);
    });

    return () => {
      cancelado = true;
    };
  }, []);

  const temFiltro = Object.values(filtros).some(Boolean);

  // Filtro e página descrevem a consulta; o efeito só a resolve.
  useEffect(() => {
    // Sem filtro na primeira página, o perfil já trouxe os dados do servidor.
    if (!temFiltro && paginaAtual === 1 && !recarregar) return;

    let cancelado = false;

    getVotacoesParlamentar(parlamentar.id, paginaAtual, filtros).then((response) => {
      if (cancelado) return;

      setVotacoes(response.data);
      setTotalPaginas(response.meta.lastPage);
      setTotalRegistros(response.meta.total);
      setItensPorPagina(response.meta.limit);
      setSemProposicaoExcluidas(response.votacoesSemProposicaoExcluidas);
      setCarregando(false);
    });

    return () => {
      cancelado = true;
    };
  }, [parlamentar.id, filtros, paginaAtual, temFiltro, recarregar]);

  function aplicarFiltros(evento: React.FormEvent) {
    evento.preventDefault();
    setCarregando(true);
    setPaginaAtual(1);
    setFiltros(rascunho);
    setRecarregar((n) => n + 1);
  }

  function limparFiltros() {
    setCarregando(true);
    setRascunho({});
    setPaginaAtual(1);
    setFiltros({});
    setRecarregar((n) => n + 1);
  }

  function carregarPagina(novaPagina: number) {
    if (novaPagina < 1 || novaPagina > totalPaginas || carregando) return;

    setCarregando(true);
    setPaginaAtual(novaPagina);
    setRecarregar((n) => n + 1);
  }

  const atualizarRascunho = (campo: keyof FiltrosVotacao, valor: string) =>
    setRascunho((atual) => ({
      ...atual,
      [campo]: valor === '' ? undefined : campo === 'ano' ? Number(valor) : valor,
    }));

  const inicioPagina = votacoes.length ? (paginaAtual - 1) * itensPorPagina + 1 : 0;
  const fimPagina = votacoes.length
    ? Math.min(inicioPagina + votacoes.length - 1, totalRegistros)
    : 0;

  const presenca = votacoesPerfil.presenca;

  return (
    <PainelComDashboards
      /*
        Presença e temas resumem o mandato; a lista é o caso a caso. No
        celular o resumo vem antes.
      */
      dashboards={
        <>
          <SectionShell
            recolhivelNoMobile
            icon={<BadgeCheck className="h-6 w-6" />}
            title="Presença"
          >
            <MicroInfoCard
              label="Votações registradas"
              value={String(totalRegistros)}
            />

            {/*
              Quatro medidas distintas, nunca somadas: onde o evento aconteceu
              (plenário × comissão) cruzado com o que ele decidia (deliberativo ×
              solene, audiência, debate).
            */}
            <div className="mt-6 space-y-6">
              <BarraPresenca
                detalhe={presenca.plenario.deliberativas}
                titulo="Plenário — sessões deliberativas"
              />
              <BarraPresenca
                detalhe={presenca.comissoes.deliberativas}
                titulo="Comissões — reuniões deliberativas"
              />

              {presenca.plenario.naoDeliberativas.taxa !== null ? (
                <BarraPresenca
                  detalhe={presenca.plenario.naoDeliberativas}
                  titulo="Plenário — sessões não deliberativas"
                />
              ) : null}

              {presenca.comissoes.naoDeliberativas.taxa !== null ? (
                <BarraPresenca
                  detalhe={presenca.comissoes.naoDeliberativas}
                  titulo="Comissões — reuniões não deliberativas"
                />
              ) : null}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              <p>{votacoesPerfil.leituraRapida}</p>

              <p className="mt-2 flex items-center gap-0.5 text-xs font-semibold text-slate-500">
                Como a presença é calculada
                <DicaTermo termo="Como a presença é calculada">
                  <span className="block">
                    Sessão deliberativa é onde se vota; solene e audiência pública não
                    decidem nada. Por isso as taxas aparecem separadas — e por isso
                    plenário e comissão não se somam.
                  </span>

                  {presenca.metodologias.length > 0 ? (
                    <span className="mt-2 block">
                      <span className="block font-semibold text-slate-700">
                        De onde vem cada taxa
                        {presenca.metodologias.length > 1
                          ? ' — não compare entre casas'
                          : ''}
                        :
                      </span>
                      <span className="mt-1 block space-y-1">
                        {presenca.metodologias.map((metodologia) => (
                          <span key={metodologia.casa} className="block">
                            <strong className="font-semibold">{metodologia.casa}</strong>:{' '}
                            {metodologia.fonte}
                            {metodologia.observacao ? ` ${metodologia.observacao}` : ''}
                          </span>
                        ))}
                      </span>
                    </span>
                  ) : null}

                  {!presenca.restritaAoExercicio ? (
                    <span className="mt-2 block">
                      Não temos os períodos de mandato deste parlamentar, então a conta
                      considera todo o intervalo disponível. Quem assumiu no meio do
                      mandato pode aparecer com taxa menor do que a real.
                    </span>
                  ) : null}

                  {presenca.excluidos.semClassificacao + presenca.excluidos.semOrgao > 0 ? (
                    <span className="mt-2 block">
                      {presenca.excluidos.semClassificacao + presenca.excluidos.semOrgao}{' '}
                      eventos ficaram fora das taxas por não ter tipo ou órgão
                      identificado — preferimos deixá-los de fora a chutar a categoria.
                    </span>
                  ) : null}
                </DicaTermo>
              </p>
            </div>
          </SectionShell>
          <TemasVotacaoDashboard parlamentarId={parlamentar.id} />
        </>
      }
      principal={
        <SectionShell icon={<Vote className="h-6 w-6" />} title="Votações">
          {/*
            Os filtros recortam pela proposição votada, no banco. Sem eles, achar
            uma votação específica num mandato de centenas era folhear página a
            página até topar com ela.
          */}
          <form onSubmit={aplicarFiltros} className="grid gap-3 md:grid-cols-4">
            <label className="md:col-span-2">
              <span className="sr-only">Buscar por assunto ou número</span>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 focus-within:border-brasil-blue">
                <Search size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
                <input
                  type="text"
                  value={rascunho.busca ?? ''}
                  onChange={(evento) => atualizarRascunho('busca', evento.target.value)}
                  placeholder="Buscar proposição por assunto ou número"
                  className="w-full bg-transparent py-2.5 text-sm text-slate-700 outline-none"
                />
              </div>
            </label>

            <label>
              <span className="sr-only">Tipo</span>
              <select
                value={rascunho.tipo ?? ''}
                onChange={(evento) => atualizarRascunho('tipo', evento.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700"
              >
                <option value="">Todos os tipos</option>
                {Array.from(new Set((opcoes?.tipos ?? []).map((t) => t.sigla))).map(
                  (sigla) => (
                    <option key={sigla} value={sigla}>
                      {sigla}
                    </option>
                  ),
                )}
              </select>
            </label>

            <label>
              <span className="sr-only">Ano</span>
              <select
                value={rascunho.ano ? String(rascunho.ano) : ''}
                onChange={(evento) => atualizarRascunho('ano', evento.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700"
              >
                <option value="">Todos os anos</option>
                {(opcoes?.anos ?? []).map((item) => (
                  <option key={item.ano} value={item.ano}>
                    {item.ano}
                  </option>
                ))}
              </select>
            </label>

            <label className="md:col-span-2">
              <span className="sr-only">Tema</span>
              <select
                value={rascunho.tema ?? ''}
                onChange={(evento) => atualizarRascunho('tema', evento.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700"
              >
                <option value="">Todos os temas</option>
                {(opcoes?.temas ?? []).map((item) => (
                  <option key={item.tema} value={item.tema}>
                    {item.tema}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="sr-only">Objeto da votação</span>
              <select
                value={rascunho.objeto ?? ''}
                onChange={(evento) => atualizarRascunho('objeto', evento.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700"
              >
                <option value="">Qualquer votação</option>
                {(
                  [
                    'TEXTO_BASE',
                    'PARECER',
                    'EMENDA',
                    'DESTAQUE',
                    'REQUERIMENTO',
                    'REDACAO_FINAL',
                  ] as const
                ).map((objeto) => (
                  <option key={objeto} value={objeto}>
                    {OBJETO_VOTACAO_LABELS[objeto]}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              disabled={carregando}
              className="rounded-2xl bg-brasil-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              Filtrar
            </button>
          </form>

          {temFiltro && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500">
                {totalRegistros}{' '}
                {totalRegistros === 1 ? 'votação encontrada' : 'votações encontradas'}
              </p>
              <button
                type="button"
                onClick={limparFiltros}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brasil-blue hover:text-brasil-blue"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {/*
            Requerimento e questão de ordem não têm proposição, então nenhum
            filtro de proposição casa com eles. Dizer quantas saíram evita ler a
            ausência como inexistência.
          */}
          {semProposicaoExcluidas > 0 && (
            <p className="mt-3 flex items-start gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {semProposicaoExcluidas} votações sem proposição vinculada —
              requerimentos e questões de ordem — ficaram fora deste recorte.
            </p>
          )}

          {carregando && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brasil-blue/10 bg-brasil-blue/5 px-4 py-2 text-sm font-semibold text-brasil-blue" aria-live="polite">
              <Loader2 className="h-4 w-4 animate-spin" />
              Atualizando votações
            </div>
          )}

          {votacoes.length > 0 ? (
            <div className="space-y-4">
              {votacoes.map((votacao) => (
                <article
                  key={votacao.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-brasil-blue">
                        {votacao.titulo}
                        {votacao.casa ? ` · ${votacao.casa}` : ''}
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-slate-900">
                        {votacao.descricao}
                      </h3>
                      {votacao.resumo && votacao.resumo !== votacao.descricao ? (
                        <p className="mt-2 text-sm leading-6 text-slate-600">{votacao.resumo}</p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      {/*
                        O objeto muda o sentido do voto: num destaque supressivo,
                        é o NÃO que preserva o texto. Sem essa etiqueta, o "Sim"
                        abaixo fica sem referência.
                      */}
                      {votacao.objeto && votacao.objeto !== 'INDEFINIDO' ? (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            votacao.merito
                              ? 'bg-brasil-blue/10 text-brasil-blue'
                              : 'bg-slate-200/70 text-slate-600'
                          }`}
                        >
                          {OBJETO_VOTACAO_LABELS[votacao.objeto]}
                        </span>
                      ) : null}

                      {votacao.data ? (
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                          {formatDate(votacao.data)}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/*
                    O que estava em jogo. Requerimento e questão de ordem não têm
                    proposição — dizer isso é melhor que deixar o card mudo.
                  */}
                  {votacao.proposicao ? (
                    <Link
                      href={`/proposicoes/${votacao.proposicao.id}`}
                      className="mt-3 flex items-start gap-2 rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-brasil-blue"
                    >
                      <FileText
                        className="mt-0.5 h-4 w-4 shrink-0 text-brasil-blue"
                        aria-hidden="true"
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-brasil-blue">
                          {votacao.proposicao.titulo}
                        </span>
                        {votacao.proposicao.ementa ? (
                          <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-slate-600">
                            {votacao.proposicao.ementa}
                          </span>
                        ) : null}
                        {votacao.proposicao.situacao ? (
                          <span className="mt-1 block text-xs text-slate-400">
                            {votacao.proposicao.situacao}
                          </span>
                        ) : null}
                      </span>
                      <ArrowRight
                        className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                        aria-hidden="true"
                      />
                    </Link>
                  ) : (
                    <p className="mt-3 text-xs leading-5 text-slate-400">
                      Sem proposição vinculada — típico de requerimento e questão
                      de ordem, que decidem o rito e não uma matéria.
                    </p>
                  )}

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <MicroInfoCard label="Voto do parlamentar" value={votacao.voto} />
                    <MicroInfoCard label="Resultado" value={votacao.resultado} />
                    <MicroInfoCard
                      label={
                        votacao.siglaPartidoNaData
                          ? `Orientação do ${votacao.siglaPartidoNaData}`
                          : 'Orientação do partido'
                      }
                      value={votacao.orientacaoPartido ?? 'Sem orientação registrada'}
                    />
                  </div>

                  {VOTO_EXPLICACOES[votacao.voto] ? (
                    <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-500">
                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {VOTO_EXPLICACOES[votacao.voto]}
                    </p>
                  ) : null}

                  {votacao.seguiuOrientacao !== null ? (
                    <p
                      className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        votacao.seguiuOrientacao
                          ? 'bg-brasil-green/10 text-brasil-green'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {votacao.seguiuOrientacao
                        ? 'Seguiu a orientação do partido'
                        : 'Votou contra a orientação do partido'}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-500">
              Nenhuma votação registrada foi encontrada para este parlamentar.
            </div>
          )}

          {totalRegistros > 0 && (
            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                {inicioPagina}–{fimPagina} de {totalRegistros} votações
              </p>

              {totalPaginas > 1 && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => carregarPagina(paginaAtual - 1)}
                    disabled={paginaAtual <= 1 || carregando}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brasil-blue hover:text-brasil-blue disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => carregarPagina(paginaAtual + 1)}
                    disabled={paginaAtual >= totalPaginas || carregando}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brasil-blue hover:text-brasil-blue disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Próxima
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </SectionShell>
      }
    />
  );
}
