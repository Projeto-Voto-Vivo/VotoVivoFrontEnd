import { ChevronDown, ExternalLink, FileText } from 'lucide-react';
import { EmendaDetalhe } from '@/types';
import { BackButton } from '@/components/layout/BackButton';
import { NavLink } from '@/components/layout/NavLink';

interface EmendaDetailPageProps {
  emenda: EmendaDetalhe;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

function display(value?: string | number | null) {
  if (value === null || value === undefined || value === '') return '—';
  return String(value);
}

export function EmendaDetailPage({ emenda }: EmendaDetailPageProps) {
  const backHref = `/parlamentares/${emenda.parlamentarId}`;

  return (
    <section className="min-h-screen bg-slate-50 py-8 md:py-10">
      <div className="mx-auto w-full max-w-7xl px-4">

        {/* Voltar — link estático no topo */}
        <div className="mb-6">
          <NavLink
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brasil-blue hover:underline"
          >
            ← Voltar para o perfil do parlamentar
          </NavLink>
        </div>

        {/* Cabeçalho */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-2 bg-gradient-to-r from-brasil-green via-brasil-yellow to-brasil-blue" />

          <div className="p-5 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-brasil-blue">
              Autor / Emenda
            </p>

            <h1 className="mt-2 break-words text-xl font-bold text-slate-900 sm:text-2xl md:text-4xl">
              {display(emenda.nomeAutor)} / Emenda {display(emenda.numeroEmenda)}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
              Resumo da emenda parlamentar com identificação, execução financeira
              e documentos relacionados.
            </p>
          </div>
        </section>

        {/* Metadados */}
        <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:mt-6 md:p-8">
          <h2 className="mb-4 text-base font-bold text-slate-900">Identificação</h2>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
            <InfoItem label="Tipo de Emenda" value={display(emenda.tipoEmenda)} />
            <InfoItem label="Localidade" value={display(emenda.localidadeDoGasto)} />
            <InfoItem label="Ano" value={display(emenda.ano)} />
            <InfoItem label="Código" value={display(emenda.codigoEmenda)} />
            <InfoItem label="Função" value={display(emenda.funcao)} />
            <InfoItem label="Subfunção" value={display(emenda.subfuncao)} />
          </div>
        </section>

        {/* Parlamentares vinculados */}
        {emenda.parlamentares.length > 0 && (
          <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:mt-4 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Parlamentar(es) vinculado(s)
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {emenda.parlamentares.map((parlamentar) => (
                <span
                  key={`${parlamentar.id}-${parlamentar.nomeCivil ?? parlamentar.nomeUrna}`}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
                >
                  {parlamentar.nomeCivil || parlamentar.nomeUrna || 'Parlamentar'}
                  {parlamentar.partidoAtual && parlamentar.uf
                    ? ` · ${parlamentar.partidoAtual}/${parlamentar.uf}`
                    : ''}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Métricas financeiras */}
        <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
          <h2 className="mb-4 text-base font-bold text-slate-900">Execução financeira</h2>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
            <MetricCard
              label="Empenhado"
              value={formatCurrency(emenda.valorEmpenhado)}
            />
            <MetricCard
              label="Liquidado"
              value={formatCurrency(emenda.valorLiquidado)}
            />
            <MetricCard
              label="Pago"
              value={formatCurrency(emenda.valorPago)}
            />
            <MetricCard
              label="Restos inscritos"
              value={formatCurrency(emenda.valorRestoInscrito)}
            />
            <MetricCard
              label="Restos cancelados"
              value={formatCurrency(emenda.valorRestoCancelado)}
            />
            <MetricCard
              label="Restos pagos"
              value={formatCurrency(emenda.valorRestoPago)}
            />
          </div>
        </section>

        {/* Documentos */}
        <section className="mt-4 rounded-3xl border border-slate-200 bg-white shadow-sm md:mt-6">
          <details open className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 md:px-6 md:py-5">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 shrink-0 text-slate-500" />
                <span className="text-sm font-bold uppercase tracking-wide text-slate-900 md:text-base">
                  Documentos relacionados ({emenda.documentos.length})
                </span>
              </div>
              <ChevronDown className="h-5 w-5 shrink-0 text-slate-500 transition group-open:rotate-180" />
            </summary>

            <div className="border-t border-slate-200 p-4 md:p-6">
              {emenda.documentos.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500">
                  Nenhum documento relacionado encontrado para esta emenda.
                </div>
              ) : (
                <>
                  {/* Mobile: cards empilhados */}
                  <div className="grid gap-3 md:hidden">
                    {emenda.documentos.map((documento) => (
                      <div
                        key={documento.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                              {formatDate(documento.data)}
                            </p>
                            <p className="mt-1 font-semibold text-brasil-blue">
                              {display(documento.codigoDocumentoResumido)}
                            </p>
                            <p className="mt-0.5 text-sm text-slate-600">
                              {display(documento.fase)}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {display(documento.especieTipo)}
                            </p>
                          </div>
                          {documento.urlPortal ? (
                            <Link
                              href={documento.urlPortal}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-brasil-blue px-3 py-2 text-xs font-semibold text-brasil-blue transition hover:bg-brasil-blue hover:text-white"
                            >
                              <ExternalLink size={12} />
                              Portal
                            </Link>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop: tabela */}
                  <div className="hidden overflow-x-auto md:block">
                    <table className="min-w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-100 text-left text-slate-700">
                          <th className="px-4 py-4 font-semibold">Data</th>
                          <th className="px-4 py-4 font-semibold">Fase</th>
                          <th className="px-4 py-4 font-semibold">Documento</th>
                          <th className="px-4 py-4 font-semibold">Código completo</th>
                          <th className="px-4 py-4 font-semibold">Espécie / Tipo</th>
                          <th className="px-4 py-4 font-semibold">Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emenda.documentos.map((documento) => (
                          <tr
                            key={documento.id}
                            className="border-b border-slate-200 text-slate-700"
                          >
                            <td className="whitespace-nowrap px-4 py-4">
                              {formatDate(documento.data)}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4">
                              {display(documento.fase)}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-brasil-blue">
                              {display(documento.codigoDocumentoResumido)}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4">
                              {display(documento.codigoDocumento)}
                            </td>
                            <td className="px-4 py-4">
                              {display(documento.especieTipo)}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4">
                              {documento.urlPortal ? (
                                <Link
                                  href={documento.urlPortal}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-xl border border-brasil-blue px-3 py-2 text-xs font-semibold text-brasil-blue transition hover:bg-brasil-blue hover:text-white"
                                >
                                  <ExternalLink size={12} />
                                  Abrir no Portal
                                </Link>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </details>
        </section>
      </div>

      {/* Botão flutuante de voltar */}
      <BackButton href={backHref} label="Voltar ao perfil" />
    </section>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 md:p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 md:text-xs">
        {label}
      </p>
      <p className="mt-1.5 text-sm font-medium leading-6 text-slate-900">
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
    <div className="rounded-2xl border border-slate-200 bg-white p-3 md:p-5">
      <p className="text-[10px] font-semibold uppercase leading-5 tracking-wide text-slate-500 md:text-sm md:font-medium">
        {label}
      </p>
      <p className="mt-2 text-lg font-bold text-slate-900 md:mt-3 md:text-xl">
        {value}
      </p>
    </div>
  );
}
