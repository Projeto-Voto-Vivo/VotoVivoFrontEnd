import Link from 'next/link';
import { Receipt } from 'lucide-react';
import { ParlamentarPerfil } from '@/types';
import { MicroInfoCard } from '../shared/MicroInfoCard';
import { SectionShell } from '../shared/SectionShell';
import { formatCurrency } from '../shared/formatters';

interface EmendasPanelProps {
  parlamentarId: number;
  profile: ParlamentarPerfil;
}

export function EmendasPanel({ parlamentarId, profile }: EmendasPanelProps) {
  const { emendas } = profile;

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
        {emendas.destaques.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-500">
              Nenhuma emenda vinculada encontrada para este parlamentar.
            </div>
          ) : (
            emendas.destaques.map((emenda) => (
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
    </SectionShell>
  );
}
