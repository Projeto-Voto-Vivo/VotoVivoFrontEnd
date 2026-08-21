import Link from 'next/link';
import { GitBranch } from 'lucide-react';
import { JornadaProposicao, ProposicaoRef } from '@/types';
import { SectionShell } from '@/components/parlamentares/profile/shared/SectionShell';

interface JornadaBicameralProps {
  jornada: JornadaProposicao;
}

function CartaoRelacionada({
  proposicao,
  rotulo,
}: {
  proposicao: ProposicaoRef;
  rotulo: string;
}) {
  return (
    <Link
      href={`/proposicoes/${proposicao.id}`}
      className="block rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:border-brasil-blue hover:bg-white"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {rotulo}
      </p>
      <p className="mt-1 text-base font-bold text-slate-900">{proposicao.titulo}</p>
      {proposicao.casa ? (
        <p className="mt-1 text-xs text-slate-500">{proposicao.casa}</p>
      ) : null}
    </Link>
  );
}

export function JornadaBicameral({ jornada }: JornadaBicameralProps) {
  const itens: { proposicao: ProposicaoRef; rotulo: string }[] = [
    ...(jornada.principal
      ? [{ proposicao: jornada.principal, rotulo: 'Proposição principal' }]
      : []),
    ...jornada.mesmaMateria.map((proposicao) => ({
      proposicao,
      rotulo: 'Mesma matéria na outra casa',
    })),
    ...jornada.anteriores.map((proposicao) => ({
      proposicao,
      rotulo: 'Anterior',
    })),
    ...jornada.posteriores.map((proposicao) => ({
      proposicao,
      rotulo: 'Posterior',
    })),
  ];

  if (itens.length === 0) return null;

  return (
    <SectionShell
      icon={<GitBranch className="h-6 w-6" />}
      title="Proposições ligadas"
      description="Uma matéria aprovada na Câmara vira outra proposição no Senado, com número e id diferentes. Estes são os elos conhecidos."
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {itens.map((item) => (
          <CartaoRelacionada
            key={`${item.rotulo}-${item.proposicao.id}`}
            proposicao={item.proposicao}
            rotulo={item.rotulo}
          />
        ))}
      </div>
    </SectionShell>
  );
}
