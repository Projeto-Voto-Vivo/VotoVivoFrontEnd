'use client';

import { useState } from 'react';
import { Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { PassagemPorOrgao } from '@/types';
import { SectionShell } from '@/components/parlamentares/profile/shared/SectionShell';
import { formatDate } from '@/components/parlamentares/profile/shared/formatters';

interface OrgaosPercorridosProps {
  passagens: PassagemPorOrgao[];
}

/**
 * Um processo que vai e volta entre plenário e comissões acumula dezenas de
 * passagens. As primeiras já contam a história; o resto fica a um clique.
 */
const PASSAGENS_VISIVEIS = 10;

function periodo(primeira: string | null, ultima: string | null) {
  if (!primeira && !ultima) return 'Período não informado';
  if (primeira && ultima && primeira !== ultima) {
    return `${formatDate(primeira)} — ${formatDate(ultima)}`;
  }

  return formatDate(primeira ?? ultima);
}

export function OrgaosPercorridos({ passagens }: OrgaosPercorridosProps) {
  const [mostrarTodas, setMostrarTodas] = useState(false);

  if (passagens.length === 0) return null;

  const excedente = passagens.length - PASSAGENS_VISIVEIS;
  const visiveis = mostrarTodas ? passagens : passagens.slice(0, PASSAGENS_VISIVEIS);

  return (
    <SectionShell
      icon={<Building2 className="h-6 w-6" />}
      title="Por onde passou"
      description="Órgãos na ordem em que receberam a proposição. Passagens consecutivas pelo mesmo órgão aparecem agrupadas."
    >
      <ol className="flex flex-wrap items-stretch gap-3">
        {visiveis.map((passagem, index) => (
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

      {excedente > 0 && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setMostrarTodas((atual) => !atual)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brasil-blue hover:text-brasil-blue"
          >
            {mostrarTodas ? (
              <>
                <ChevronUp size={16} />
                Mostrar menos
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                Ver as outras {excedente} passagens
              </>
            )}
          </button>
        </div>
      )}
    </SectionShell>
  );
}
