'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  Receipt,
  Wallet,
} from 'lucide-react';
import { DespesasPerfil, ItemDespesaPerfil, ParlamentarPerfil } from '@/types';
import { getDespesasParlamentar, getDespesasPerfil } from '@/services/parlamentares';
import { MicroInfoCard } from '../shared/MicroInfoCard';
import { SectionShell } from '../shared/SectionShell';
import { formatCurrency, formatDate } from '../shared/formatters';

interface DespesasPanelProps {
  profile: ParlamentarPerfil;
}

const ANOS_FILTRO = Array.from(
  new Set([new Date().getFullYear(), 2026, 2025, 2024, 2023, 2022]),
).sort((a, b) => b - a);

function valueOrDash(value: number) {
  return value > 0 ? formatCurrency(value) : '—';
}

function mapDespesaToItem(
  item: { data: string; tipo: string; fornecedor: string; valor: number; urlDocumento?: string | null },
  index: number,
  offset: number,
): ItemDespesaPerfil {
  return {
    data: item.data || '',
    tipo: item.tipo || 'Tipo não informado',
    fornecedor: item.fornecedor || 'Fornecedor não informado',
    valor: Number(item.valor ?? 0),
    documentoLabel: item.urlDocumento
      ? `Documento ${offset + index + 1}`
      : `Registro ${offset + index + 1}`,
    urlDocumento: item.urlDocumento || null,
  };
}

export function DespesasPanel({ profile }: DespesasPanelProps) {
  const { parlamentar } = profile;
  const [despesas, setDespesas] = useState<DespesasPerfil>(profile.despesas);
  const [itens, setItens] = useState<ItemDespesaPerfil[]>(profile.despesas.itensRecentes);
  const [paginaAtual, setPaginaAtual] = useState(profile.despesas.paginaAtual || 1);
  const [anoSelecionado, setAnoSelecionado] = useState<string>(
    profile.despesas.anoReferencia ? String(profile.despesas.anoReferencia) : '',
  );
  const [carregando, setCarregando] = useState(false);

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

  const totalCategorias = useMemo(
    () => despesas.categorias.reduce((acc, categoria) => acc + categoria.valor, 0),
    [despesas.categorias],
  );

  const anoParametro = anoSelecionado ? Number(anoSelecionado) : undefined;
  const rotuloPeriodo = anoSelecionado
    ? `Despesas de ${anoSelecionado}`
    : despesas.anoReferencia
      ? `Despesas de ${despesas.anoReferencia}`
      : 'Despesas no período';

  async function carregarPerfilDespesas(ano?: number) {
    setCarregando(true);

    try {
      const response = await getDespesasPerfil(parlamentar.id, ano);
      setDespesas(response);
      setItens(response.itensRecentes);
      setPaginaAtual(response.paginaAtual || 1);
    } finally {
      setCarregando(false);
    }
  }

  async function handleAnoChange(value: string) {
    setAnoSelecionado(value);
    await carregarPerfilDespesas(value ? Number(value) : undefined);
  }

  async function carregarPagina(novaPagina: number) {
    if (
      novaPagina < 1 ||
      novaPagina > despesas.totalPaginas ||
      novaPagina === paginaAtual ||
      carregando
    ) {
      return;
    }

    setCarregando(true);

    try {
      const response = await getDespesasParlamentar(parlamentar.id, novaPagina, anoParametro);
      const offset = (response.meta.page - 1) * response.meta.limit;

      setItens(response.data.map((item, index) => mapDespesaToItem(item, index, offset)));
      setPaginaAtual(response.meta.page);
      setDespesas((current) => ({
        ...current,
        totalRegistros: response.meta.total,
        paginaAtual: response.meta.page,
        totalPaginas: response.meta.lastPage,
      }));
    } finally {
      setCarregando(false);
    }
  }

  const hasResumo = despesas.totalAno > 0 || despesas.categorias.length > 0;
  const hasItens = itens.length > 0;
  const inicioPagina = hasItens ? (paginaAtual - 1) * 5 + 1 : 0;
  const fimPagina = hasItens ? Math.min(inicioPagina + itens.length - 1, despesas.totalRegistros) : 0;

  return (
    <div className="space-y-6">
      <SectionShell icon={<Wallet className="h-6 w-6" />} title={rotuloPeriodo}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="flex flex-col gap-1 text-sm font-semibold text-slate-600 sm:min-w-48">
            Ano
            <select
              value={anoSelecionado}
              onChange={(event) => handleAnoChange(event.target.value)}
              disabled={carregando}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-brasil-blue focus:ring-2 focus:ring-brasil-blue/10 disabled:cursor-wait disabled:opacity-70"
            >
              <option value="">Mais recente</option>
              {ANOS_FILTRO.map((ano) => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ))}
            </select>
          </label>

          {carregando && (
            <div className="inline-flex items-center gap-2 rounded-full border border-brasil-blue/10 bg-brasil-blue/5 px-4 py-2 text-sm font-semibold text-brasil-blue" aria-live="polite">
              <Loader2 className="h-4 w-4 animate-spin" />
              Atualizando dados
            </div>
          )}
        </div>

        {!hasResumo && !hasItens ? (
          <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-500">
            Nenhuma despesa foi encontrada para este parlamentar no período selecionado.
          </div>
        ) : (
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <MicroInfoCard label="Total no período" value={valueOrDash(despesas.totalAno)} />
            <MicroInfoCard label="Média mensal" value={valueOrDash(despesas.mediaMensal)} />
            <MicroInfoCard
              label="Maior reembolso"
              value={valueOrDash(despesas.maiorReembolso)}
            />
          </div>
        )}
      </SectionShell>

      {despesas.categorias.length > 0 && (
        <SectionShell icon={<Building2 className="h-6 w-6" />} title="Despesas por categoria">
          <div className="space-y-4">
            {despesas.categorias.map((categoria) => {
              const percentual = totalCategorias
                ? Math.round((categoria.valor / totalCategorias) * 100)
                : 0;

              return (
                <div
                  key={categoria.categoria}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{categoria.categoria}</p>
                      {categoria.descricao ? (
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {categoria.descricao}
                        </p>
                      ) : null}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        {formatCurrency(categoria.valor)}
                      </p>
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                        {percentual}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-brasil-blue"
                      style={{ width: `${percentual}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionShell>
      )}

      <SectionShell icon={<Receipt className="h-6 w-6" />} title="Registros de despesas">
        {hasItens ? (
          <div className="grid gap-3">
            {itens.map((item) => (
              <div
                key={`${item.data}-${item.fornecedor}-${item.tipo}-${item.valor}-${item.urlDocumento ?? ''}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{item.tipo}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.fornecedor}</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                      {formatDate(item.data)}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-lg font-bold text-slate-900">
                      {formatCurrency(item.valor)}
                    </p>
                    {item.urlDocumento ? (
                      <a
                        href={item.urlDocumento}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-2 rounded-full border border-brasil-blue/20 bg-white px-3 py-1 text-xs font-semibold text-brasil-blue transition hover:border-brasil-blue hover:bg-brasil-blue hover:text-white"
                      >
                        <ExternalLink size={14} />
                        Abrir documento
                      </a>
                    ) : (
                      <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
                        <Receipt size={14} />
                        {item.documentoLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-500">
            Nenhum registro individual de despesa foi encontrado para este período.
          </div>
        )}

        {despesas.totalRegistros > 0 && (
          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              {inicioPagina}–{fimPagina} de {despesas.totalRegistros} registros
            </p>
            {despesas.totalPaginas > 1 && (
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
                  disabled={paginaAtual >= despesas.totalPaginas || carregando}
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
    </div>
  );
}
