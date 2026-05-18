import { Building2, Receipt, Wallet } from 'lucide-react';
import { ParlamentarPerfil } from '@/types';
import { MicroInfoCard } from '../shared/MicroInfoCard';
import { SectionShell } from '../shared/SectionShell';
import { formatCurrency, formatDate } from '../shared/formatters';

interface DespesasPanelProps {
  profile: ParlamentarPerfil;
}

export function DespesasPanel({ profile }: DespesasPanelProps) {
  const { despesas } = profile;

  const maiorCategoria = despesas.categorias[0];
  const totalCategorias =
    despesas.categorias.reduce((acc, categoria) => acc + categoria.valor, 0) ||
    despesas.totalAno;

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
          <MicroInfoCard
            label="Maior reembolso"
            value={formatCurrency(despesas.maiorReembolso)}
          />
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">Leitura rápida</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            A maior parte das despesas registradas está concentrada em{' '}
            <strong>{maiorCategoria?.categoria ?? 'categoria não informada'}</strong>, com
            valor aproximado de <strong>{formatCurrency(maiorCategoria?.valor ?? 0)}</strong>.
            A listagem detalhada aparece mais abaixo, para deixar a primeira leitura do
            painel menos poluída.
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
                  <div
                    key={categoria.categoria}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
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
                <div
                  key={categoria.categoria}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{categoria.categoria}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {categoria.descricao}
                      </p>
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
      </div>

      <SectionShell
        icon={<Receipt className="h-6 w-6" />}
        title="Despesas recentes"
        description="Listagem simplificada dos registros mais recentes."
      >
        <div className="grid gap-3">
          {despesas.itensRecentes.map((item) => (
            <div
              key={`${item.data}-${item.fornecedor}-${item.tipo}`}
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