import Link from 'next/link';
import { ChevronDown, FileText } from 'lucide-react';
import { EmendaDetalhe } from '@/types';

interface EmendaDetailPageProps {
  emenda: EmendaDetalhe;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function formatDate(value: string) {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('pt-BR').format(date);
}

export function EmendaDetailPage({ emenda }: EmendaDetailPageProps) {
  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mb-6">
          <Link
            href={`/parlamentares/${emenda.parlamentarId}`}
            className="text-sm font-medium text-brasil-blue hover:underline"
          >
            ← Voltar para o perfil do parlamentar
          </Link>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-brasil-blue">
                Autor / Emenda
              </p>

              <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-4xl">
                {emenda.nomeAutor} / Emenda {emenda.numeroEmenda}
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                Resumo da emenda parlamentar com identificação, execução financeira
                e documentos relacionados.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <InfoItem
                label="Tipo de Emenda"
                value={emenda.tipoEmenda}
              />
              <InfoItem
                label="Localidade da Emenda"
                value={emenda.localidadeDoGasto}
              />
              <InfoItem
                label="Ano da Emenda"
                value={String(emenda.ano)}
              />
              <InfoItem
                label="Código da Emenda"
                value={emenda.codigoEmenda}
              />
              <InfoItem
                label="Função"
                value={emenda.funcao}
              />
              <InfoItem
                label="Subfunção"
                value={emenda.subfuncao}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <MetricCard
                label="Valor da Emenda (Empenhado)"
                value={formatCurrency(emenda.valorEmpenhado)}
              />
              <MetricCard
                label="Valor da Emenda (Liquidado)"
                value={formatCurrency(emenda.valorLiquidado)}
              />
              <MetricCard
                label="Valor da Emenda (Pago)"
                value={formatCurrency(emenda.valorPago)}
              />
              <MetricCard
                label="Valor Restos a Pagar Inscritos"
                value={formatCurrency(emenda.valorRestoInscrito)}
              />
              <MetricCard
                label="Valor Restos a Pagar Cancelados"
                value={formatCurrency(emenda.valorRestoCancelado)}
              />
              <MetricCard
                label="Valor Restos a Pagar Pagos"
                value={formatCurrency(emenda.valorRestoPago)}
              />
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
          <details open className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-slate-500" />
                <span className="text-base font-bold uppercase tracking-wide text-slate-900">
                  Documentos relacionados ({emenda.documentos.length})
                </span>
              </div>

              <ChevronDown className="h-5 w-5 text-slate-500 transition group-open:rotate-180" />
            </summary>

            <div className="border-t border-slate-200 px-4 py-4 md:px-6">
              {emenda.documentos.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500">
                  Nenhum documento relacionado encontrado para esta emenda.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-100 text-left text-slate-700">
                        <th className="px-4 py-4 font-semibold">Data</th>
                        <th className="px-4 py-4 font-semibold">Fase</th>
                        <th className="px-4 py-4 font-semibold">Documento</th>
                        <th className="px-4 py-4 font-semibold">Código completo</th>
                        <th className="px-4 py-4 font-semibold">Espécie / Tipo</th>
                      </tr>
                    </thead>

                    <tbody>
                      {emenda.documentos.map((documento) => (
                        <tr
                          key={documento.id}
                          className="border-b border-slate-200 text-slate-700"
                        >
                          <td className="px-4 py-4 whitespace-nowrap">
                            {formatDate(documento.data)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {documento.fase}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap font-medium text-brasil-blue">
                            {documento.codigoDocumentoResumido}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {documento.codigoDocumento}
                          </td>
                          <td className="px-4 py-4">
                            {documento.especieTipo}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </details>
        </section>
      </div>
    </main>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-900">
        {value || '—'}
      </p>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
}

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm font-medium leading-6 text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}