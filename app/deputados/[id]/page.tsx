export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/HeaderLayout';
import { ParlamentarProfile } from '@/components/profile/ParlamentarProfile';
import { getParlamentarProfile } from '@/services/parlamentares';

export default async function PerfilParlamentar({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parlamentarId = Number(id);

  if (!Number.isFinite(parlamentarId) || parlamentarId <= 0) {
    notFound();
  }

  const profile = await getParlamentarProfile(parlamentarId);

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Header />
      <ParlamentarProfile profile={profile} />
    </main>
  );
}
