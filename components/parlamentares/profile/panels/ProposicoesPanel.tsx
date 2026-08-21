'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Search,
} from 'lucide-react';

import {
  FiltrosProposicao,
  OpcoesFiltroProposicoes,
  ParlamentarPerfil,
  ProposicaoResultado,
} from '@/types';
import {
  buscarProposicoes,
  carregarOpcoesFiltroProposicoes,
} from '@/services/proposicoes';
import { MicroInfoCard } from '../shared/MicroInfoCard';
import { SectionShell } from '../shared/SectionShell';
import { formatDate } from '../shared/formatters';
import { TemasAutoriaDashboard } from './TemasAutoriaDashboard';

interface ProposicoesPanelProps {
  profile: ParlamentarPerfil;
}

const FILTROS_VAZIOS: FiltrosProposicao = {};

/** Situações e temas são frases longas; no dropdown elas precisam caber. */
function encurtar(texto: string, limite = 60) {
  return texto.length > limite ? `${texto.slice(0, limite - 1).trim()}…` : texto;
}

export function ProposicoesPanel({ profile }: ProposicoesPanelProps) {
  const parlamentarId = profile.parlamentar.id;

  const [proposicoes, setProposicoes] = useState<ProposicaoResultado[]>([]);
  // Aqui a contagem vale a pena: filtrada por autor, ela é barata e o número
  // de proposições do parlamentar é informação, não enfeite. Ainda assim os
  // tipos aceitam `null`, porque a mesma busca pode rodar sem contar.
  const [total, setTotal] = useState<number | null>(0);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState<number | null>(1);
  const [temProximaPagina, setTemProximaPagina] = useState(false);
  const [itensPorPagina, setItensPorPagina] = useState(20);
  const [aviso, setAviso] = useState<string | undefined>();
  const [carregando, setCarregando] = useState(true);

  // Rascunho do formulário × filtros aplicados: digitar no campo de busca não
  // deve disparar uma consulta a cada tecla.
  const [rascunho, setRascunho] = useState<FiltrosProposicao>(FILTROS_VAZIOS);
  const [filtros, setFiltros] = useState<FiltrosProposicao>(FILTROS_VAZIOS);

  const [opcoes, setOpcoes] = useState<OpcoesFiltroProposicoes | null>(null);

  useEffect(() => {
    let cancelado = false;

    carregarOpcoesFiltroProposicoes().then((resultado) => {
      if (!cancelado) setOpcoes(resultado);
    });

    return () => {
      cancelado = true;
    };
  }, []);

  // Filtro e página vivem no estado; o efeito só resolve a consulta que eles
  // descrevem. Quem liga o "carregando" é o handler que originou a mudança.
  useEffect(() => {
    let cancelado = false;

    // O `autor` cruza a autoria com os demais filtros no banco: a lista vem
    // inteira e filtrada de lá, sem recorte no navegador.
    buscarProposicoes({ ...filtros, autor: parlamentarId }, pagina).then(
      (resultado) => {
        if (cancelado) return;

        setProposicoes(resultado.data);
        setTotal(resultado.total);
        setTotalPaginas(resultado.totalPaginas);
        setTemProximaPagina(resultado.temProximaPagina);
        setItensPorPagina(resultado.itensPorPagina);
        setAviso(resultado.aviso);
        setCarregando(false);
      },
    );

    return () => {
      cancelado = true;
    };
  }, [filtros, pagina, parlamentarId]);

  function aplicarFiltros(evento: React.FormEvent) {
    evento.preventDefault();
    setCarregando(true);
    setPagina(1);
    setFiltros(rascunho);
  }

  function limparFiltros() {
    setCarregando(true);
    setRascunho(FILTROS_VAZIOS);
    setPagina(1);
    setFiltros(FILTROS_VAZIOS);
  }

  function irParaPagina(novaPagina: number) {
    if (novaPagina < 1 || carregando) return;
    if (totalPaginas !== null && novaPagina > totalPaginas) return;
    if (novaPagina > pagina && !temProximaPagina) return;
    setCarregando(true);
    setPagina(novaPagina);
  }

  const filtroAtivo = useMemo(
    () => Object.values(filtros).some(Boolean),
    [filtros],
  );

  const inicio = proposicoes.length ? (pagina - 1) * itensPorPagina + 1 : 0;
  const fim = proposicoes.length ? inicio + proposicoes.length - 1 : 0;

  const atualizarRascunho = (campo: keyof FiltrosProposicao, valor: string) =>
    setRascunho((atual) => ({
      ...atual,
      [campo]:
        valor === ''
          ? undefined
          : campo === 'ano'
            ? Number(valor)
            : valor,
    }));

  return (
    <div className="space-y-6">
      <SectionShell
        icon={<FileText className="h-6 w-6" />}
        title="Proposições"
        description="Todos os projetos e propostas de autoria deste parlamentar."
      >
        <form onSubmit={aplicarFiltros} className="grid gap-3 md:grid-cols-6">
          <label className="md:col-span-3">
            <span className="sr-only">Buscar por assunto ou número</span>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 focus-within:border-brasil-blue">
              <Search size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
              <input
                type="text"
                value={rascunho.busca ?? ''}
                onChange={(evento) => atualizarRascunho('busca', evento.target.value)}
                placeholder="Buscar por assunto ou número"
                className="w-full bg-transparent py-2.5 text-sm text-slate-700 outline-none"
              />
            </div>
          </label>

          <label className="md:col-span-1">
            <span className="sr-only">Tipo</span>
            <select
              value={rascunho.tipo ?? ''}
              onChange={(evento) => atualizarRascunho('tipo', evento.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700"
            >
              <option value="">Todos os tipos</option>
              {Array.from(new Set((opcoes?.tipos ?? []).map((tipo) => tipo.sigla))).map(
                (sigla) => (
                  <option key={sigla} value={sigla}>
                    {sigla}
                  </option>
                ),
              )}
            </select>
          </label>

          <label className="md:col-span-1">
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

          <label className="md:col-span-1">
            <span className="sr-only">Casa</span>
            <select
              value={rascunho.casa ?? ''}
              onChange={(evento) => atualizarRascunho('casa', evento.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700"
            >
              <option value="">Câmara e Senado</option>
              {(opcoes?.casas ?? []).map((item) => (
                <option key={item.casa} value={item.casa}>
                  {item.rotulo}
                </option>
              ))}
            </select>
          </label>

          <label className="md:col-span-3">
            <span className="sr-only">Tema</span>
            <select
              value={rascunho.tema ?? ''}
              onChange={(evento) => atualizarRascunho('tema', evento.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700"
            >
              <option value="">Todos os temas</option>
              {(opcoes?.temas ?? []).map((item) => (
                <option key={item.tema} value={item.tema}>
                  {encurtar(item.tema)}
                </option>
              ))}
            </select>
          </label>

          <label className="md:col-span-2">
            <span className="sr-only">Situação</span>
            <select
              value={rascunho.situacao ?? ''}
              onChange={(evento) => atualizarRascunho('situacao', evento.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700"
            >
              <option value="">Qualquer situação</option>
              {(opcoes?.situacoes ?? []).map((item) => (
                <option key={item.situacao} value={item.situacao}>
                  {encurtar(item.situacao)}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={carregando}
            className="rounded-2xl bg-brasil-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 md:col-span-1"
          >
            Filtrar
          </button>
        </form>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            {carregando
              ? 'Carregando proposições…'
              : total === null
                ? `Proposições${filtroAtivo ? ' com estes filtros' : ' de autoria deste parlamentar'}`
                : `${total.toLocaleString('pt-BR')} proposição${total === 1 ? '' : 'ões'}${
                    filtroAtivo ? ' com estes filtros' : ' de autoria deste parlamentar'
                  }`}
          </p>

          <div className="flex items-center gap-3">
            {carregando && (
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-brasil-blue">
                <Loader2 className="h-4 w-4 animate-spin" />
                Atualizando
              </span>
            )}

            {filtroAtivo && (
              <button
                type="button"
                onClick={limparFiltros}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brasil-blue hover:text-brasil-blue"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>

        {aviso && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            {aviso}
          </div>
        )}

        <div className="mt-5">
          {carregando && proposicoes.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              Carregando proposições…
            </div>
          ) : proposicoes.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {proposicoes.map((proposicao) => (
                <article
                  key={proposicao.id}
                  className="flex flex-col rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-brasil-blue/10 px-3 py-1 text-xs font-semibold uppercase text-brasil-blue">
                      {proposicao.sigla ?? 'Proposição'}
                    </span>

                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                      {proposicao.situacao ?? 'Situação não informada'}
                    </span>

                    {proposicao.casa ? (
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                        {proposicao.casa}
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    {proposicao.titulo}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {proposicao.ementa}
                  </p>

                  {proposicao.temas.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {proposicao.temas.map((tema) => (
                        <span
                          key={tema}
                          className="rounded-full bg-brasil-green/10 px-3 py-1 text-xs font-semibold text-brasil-green"
                        >
                          {tema}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <MicroInfoCard label="Tipo" value={proposicao.sigla ?? '—'} />
                    <MicroInfoCard
                      label="Apresentada em"
                      value={
                        proposicao.dataApresentacao
                          ? formatDate(proposicao.dataApresentacao)
                          : String(proposicao.ano ?? '—')
                      }
                    />
                  </div>

                  <div className="mt-5 flex justify-end">
                    <Link
                      href={`/proposicoes/${proposicao.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-brasil-blue px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      Ver tramitação
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
              {filtroAtivo
                ? 'Nenhuma proposição deste parlamentar corresponde aos filtros selecionados.'
                : 'Nenhuma proposição encontrada para este parlamentar.'}
            </div>
          )}
        </div>

        {proposicoes.length > 0 && (
          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              {inicio}–{fim}
              {total === null ? '' : ` de ${total.toLocaleString('pt-BR')}`} proposições
            </p>

            {(pagina > 1 || temProximaPagina) && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => irParaPagina(pagina - 1)}
                  disabled={pagina <= 1 || carregando}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brasil-blue hover:text-brasil-blue disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                  Anterior
                </button>

                <button
                  type="button"
                  onClick={() => irParaPagina(pagina + 1)}
                  disabled={!temProximaPagina || carregando}
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

      <TemasAutoriaDashboard parlamentarId={parlamentarId} />
    </div>
  );
}
