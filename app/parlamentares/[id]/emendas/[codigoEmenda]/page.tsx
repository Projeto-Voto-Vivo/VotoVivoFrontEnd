import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/HeaderLayout';
import { EmendaDetailPage } from '@/components/parlamentares/emendas/EmendaDetailPage';
import { getEmendaDetalhe } from '@/services/parlamentares';

type EmendaPageProps = {
  params: Promise<{
    id: string;
    codigoEmenda: string;
  }>;
};

export default async function EmendaPage({ params }: EmendaPageProps) {
  const { id, codigoEmenda } = await params;
  console.log('DEBUG page.tsx params', { id, codigoEmenda });

  const parlamentarId = Number(id);

  if (Number.isNaN(parlamentarId)) {
    notFound();
  }

  const emenda = await getEmendaDetalhe(parlamentarId, codigoEmenda);

  if (!emenda) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
        <Header />
        <EmendaDetailPage emenda={emenda} />;
    </main>);
      
}