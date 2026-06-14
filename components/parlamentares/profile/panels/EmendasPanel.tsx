'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Receipt } from 'lucide-react';
import { ParlamentarPerfil } from '@/types';
import { MicroInfoCard } from '../shared/MicroInfoCard';
import { SectionShell } from '../shared/SectionShell';
import { formatCurrency } from '../shared/formatters';

interface EmendasPanelProps {
  parlamentarId: number;
  profile: ParlamentarPerfil;
}

const EMENDAS_PAGE_SIZE = 5;

export function EmendasPanel({ parlamentarId, profile }: EmendasPanelProps) {
  const { emendas } = profile;
  const [paginaAtual, setPaginaAtual] = useState(1);
  const totalPaginas = Math.max(1, Math.ceil(emendas.destaques.length / EMENDAS_PAGE_SIZE));

  const emendasPagina = useMemo(() => {
    const inicio = (paginaAtual - 1) * EMENDAS_PAGE_SIZE;
    return emendas.destaques.slice(inicio, inicio + EMENDAS_PAGE_SIZE);
  }, [emendas.destaques, paginaAtual]);

  const inicioPagina = emendasPagina.length
    ? (paginaAtual - 1) * EMENDAS_PAGE_SIZE + 1
    : 0;
  const fimPagina = emendasPagina.length
    ? Math.min(inicioPagina + emendasPagina.length - 1, emendas.destaques.length)
    : 0;

  return (
    <SectionShell
      icon={<Receipt className="h-6 w-6" />}
      title="Emendas parlamentares"
      description={`${emendas.quantidade} emenda${emendas.quantidade === 1 ? '' : 's'} vinculada${emendas.quantidade === 1 ? '' : 's'} ao parlamentar.`}
    >
      <div className="grid gap-3 md:grid-cols-3">
        <MicroInfoCard label="Empenhado" value={formatCurrency(emendas.totalEmpenhado)} />
        <MicroInfoCard label="Liquidado" value={formatCurrency(emendas.totalLiquidado)} />
        <MicroInfoCard label="Pago" value={formatCurrency(emendas.totalPago)} />
      </div>

      <div className="mt-6 space-y-4">
        {emendasPagina.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-500">
            Nenhuma emenda vinculada encontrada para este parlamentar.
          </div>
        ) : (
          emendasPagina.map((emenda) => (
            <article
              key={emenda.id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-brasil-blue">
                    Emenda {emenda.numeroEmenda || emenda.codigoEmenda}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    {emenda.funcao || 'Função não informada'}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {emenda.subfuncao || 'Subfunção não informada'}
                  </p>
                </div>

                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                  {emenda.tipoEmenda || 'Tipo não informado'} ·{' '}
                  {emenda.localidadeDoGasto || 'Localidade não informada'}
                </span>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <MicroInfoCard label="Empenhado" value={formatCurrency(emenda.valorEmpenhado)} />
                <MicroInfoCard label="Liquidado" value={formatCurrency(emenda.valorLiquidado)} />
                <MicroInfoCard label="Pago" value={formatCurrency(emenda.valorPago)} />
              </div>

              <div className="mt-5 flex justify-end">
                <Link
                  href={`/parlamentares/${parlamentarId}/emendas/${emenda.id}`}
                  className="inline-flex items-center rounded-xl bg-brasil-blue px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Ver detalhes da emenda
                </Link>
              </div>
            </article>
          ))
        )}
      </div>

      {emendas.destaques.length > 0 && (
        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            {inicioPagina}–{fimPagina} de {emendas.destaques.length} emendas
          </p>

          {totalPaginas > 1 && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPaginaAtual((pagina) => Math.max(1, pagina - 1))}
                disabled={paginaAtual <= 1}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brasil-blue hover:text-brasil-blue disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft size={16} />
                Anterior
              </button>
              <button
                type="button"
                onClick={() => setPaginaAtual((pagina) => Math.min(totalPaginas, pagina + 1))}
                disabled={paginaAtual >= totalPaginas}
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
  );
}
