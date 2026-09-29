import { Info, Store } from 'lucide-react';
import { FornecedorDespesaPerfil } from '@/types';
import { SectionShell } from '../shared/SectionShell';
import { formatCurrency } from '../shared/formatters';

interface FornecedoresDespesasDashboardProps {
  fornecedores: FornecedorDespesaPerfil[];
  totalPeriodo: number;
  rotuloPeriodo: string;
}

/**
 * CNPJ aparece formatado. CPF não: é de pessoa física, e o nome já diz a quem
 * o dinheiro foi — mostrar o número não acrescenta nada para quem lê.
 */
function descreverDocumento(documento: string | null) {
  const digitos = documento?.replace(/\D/g, '') ?? '';

  if (digitos.length === 14) {
    return `CNPJ ${digitos.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')}`;
  }

  if (digitos.length === 11) return 'Pessoa física';

  return null;
}

function formatPercent(parte: number, total: number) {
  if (total <= 0) return null;

  const valor = (parte / total) * 100;
  return `${valor < 1 ? valor.toFixed(1) : Math.round(valor)}%`;
}

export function FornecedoresDespesasDashboard({
  fornecedores,
  totalPeriodo,
  rotuloPeriodo,
}: FornecedoresDespesasDashboardProps) {
  if (fornecedores.length === 0) return null;

  const maior = fornecedores[0]?.valor ?? 0;
  const somaListados = fornecedores.reduce((acc, item) => acc + item.valor, 0);
  const participacaoListados = formatPercent(somaListados, totalPeriodo);

  return (
    <SectionShell
      recolhivelNoMobile
      icon={<Store className="h-6 w-6" />}
      title="Para onde vai o dinheiro"
      description={`Fornecedores que mais receberam da cota parlamentar — ${rotuloPeriodo.toLowerCase()}.`}
    >
      <ol className="space-y-4">
        {fornecedores.map((fornecedor, index) => {
          const largura = maior ? Math.max((fornecedor.valor / maior) * 100, 4) : 0;
          const documento = descreverDocumento(fornecedor.documento);
          const participacao = formatPercent(fornecedor.valor, totalPeriodo);

          return (
            <li
              key={`${fornecedor.documento ?? fornecedor.nome}-${index}`}
              className="grid gap-2"
            >
              <div className="flex items-start justify-between gap-4 text-sm">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brasil-green/10 text-xs font-bold text-brasil-green">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="break-words font-semibold leading-5 text-slate-700">
                      {fornecedor.nome}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {documento ? `${documento} · ` : ''}
                      {fornecedor.quantidade}{' '}
                      {fornecedor.quantidade === 1 ? 'registro' : 'registros'}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="font-bold text-slate-900">
                    {formatCurrency(fornecedor.valor)}
                  </p>
                  {participacao ? (
                    <p className="text-xs text-slate-400">{participacao} do total</p>
                  ) : null}
                </div>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brasil-green to-brasil-blue shadow-sm"
                  style={{ width: `${largura}%` }}
                />
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-5 flex items-start gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-500">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          {participacaoListados
            ? `Estes ${fornecedores.length} fornecedores somam ${participacaoListados} do gasto no período. `
            : ''}
          O mesmo fornecedor aparece com o nome escrito de jeitos diferentes na
          fonte; aqui eles são somados pelo CNPJ/CPF.
        </span>
      </p>
    </SectionShell>
  );
}
