import { Building2 } from 'lucide-react';
import { PassagemPorOrgao } from '@/types';
import { SectionShell } from '@/components/parlamentares/profile/shared/SectionShell';
import { formatDate } from '@/components/parlamentares/profile/shared/formatters';

interface OrgaosPercorridosProps {
  passagens: PassagemPorOrgao[];
}

function periodo(primeira: string | null, ultima: string | null) {
  if (!primeira && !ultima) return 'Período não informado';
  if (primeira && ultima && primeira !== ultima) {
    return `${formatDate(primeira)} — ${formatDate(ultima)}`;
  }

  return formatDate(primeira ?? ultima);
}

export function OrgaosPercorridos({ passagens }: OrgaosPercorridosProps) {
  if (passagens.length === 0) return null;

  return (
    <SectionShell
      icon={<Building2 className="h-6 w-6" />}
      title="Por onde passou"
      description="Órgãos na ordem em que receberam a proposição. Passagens consecutivas pelo mesmo órgão aparecem agrupadas."
    >
      <ol className="flex flex-wrap items-stretch gap-3">
        {passagens.map((passagem, index) => (
          <li
            key={`${passagem.chave}-${index}`}
            className="flex min-w-[15rem] flex-1 items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brasil-blue/10 text-sm font-bold text-brasil-blue">
              {index + 1}
            </span>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                {passagem.orgao.sigla ?? passagem.orgao.nome}
              </p>
              {passagem.orgao.sigla && passagem.orgao.nome ? (
                <p className="truncate text-xs text-slate-500">{passagem.orgao.nome}</p>
              ) : null}
              <p className="mt-1 text-xs text-slate-500">
                {periodo(passagem.primeiraData, passagem.ultimaData)} ·{' '}
                {passagem.etapas} etapa{passagem.etapas === 1 ? '' : 's'}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
