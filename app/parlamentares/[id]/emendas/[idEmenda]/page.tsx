import { notFound } from 'next/navigation';
import { EmendaDetailPage } from '@/components/parlamentares/emendas/EmendaDetailPage';
import { getEmendaDetalhe } from '@/services/parlamentares';

type EmendaPageProps = {
  params: Promise<{
    id: string;
    idEmenda: string;
  }>;
};

export default async function EmendaPage({ params }: EmendaPageProps) {
  const { id, idEmenda } = await params;

  const parlamentarId = Number(id);
  const emendaId = Number(idEmenda);

  if (Number.isNaN(parlamentarId) || Number.isNaN(emendaId)) {
    notFound();
  }

  const emenda = await getEmendaDetalhe(parlamentarId, emendaId);

  if (!emenda) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <EmendaDetailPage emenda={emenda} />
    </main>
  );
}
