import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { VoltarLink } from '@/components/layout/VoltarLink';
import { CandidatoHero } from '@/components/candidatos/CandidatoHero';
import { getCandidato } from '@/services/candidatos';

export default async function CandidatoProfilePage({
  params,
}: {
  params: Promise<{ idCandidaturaTse: string }>;
}) {
  const { idCandidaturaTse: idParam } = await params;
  const idCandidaturaTse = Number(idParam);

  if (!Number.isInteger(idCandidaturaTse) || idCandidaturaTse <= 0) {
    notFound();
  }

  let candidato;

  try {
    candidato = await getCandidato(idCandidaturaTse);
  } catch {
    notFound();
  }

  if (candidato.idParlamentar) {
    redirect(`/parlamentares/${candidato.idParlamentar}`);
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <div className="container mx-auto space-y-8 px-4 py-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <VoltarLink fallbackHref="/candidatos" />

          <Link
            href="/candidatos"
            className="text-sm font-medium text-slate-400 transition-colors hover:text-brasil-blue"
          >
            Ver todos os candidatos
          </Link>
        </div>

        <CandidatoHero candidato={candidato} />
      </div>
    </main>
  );
}