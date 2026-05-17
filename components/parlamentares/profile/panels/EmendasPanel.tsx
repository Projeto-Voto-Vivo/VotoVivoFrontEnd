import { CircleHelp, Receipt } from 'lucide-react';
import { ParlamentarPerfil } from '@/types';
import { MicroInfoCard } from '../shared/MicroInfoCard';
import { SectionShell } from '../shared/SectionShell';
import { formatCurrency, formatDate } from '../shared/formatters';

interface EmendasPanelProps {
  profile: ParlamentarPerfil;
}

export function EmendasPanel({ profile }: EmendasPanelProps) {
  const { emendas } = profile;

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
            <article
              key={emenda.codigoEmenda}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-brasil-blue">
                    Emenda {emenda.numeroEmenda}
                  </p>
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
          <MicroInfoCard
            label="Restos inscritos"
            value={formatCurrency(emendas.totalRestoInscrito)}
          />
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          {emendas.leituraRapida}
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-sm font-semibold text-slate-900">Documentos recentes</p>
          {emendas.documentosRecentes.map((documento) => (
            <div
              key={documento.codigoDocumento}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">
                    {documento.codigoDocumentoResumido}
                  </p>
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