// app/parlamentares/[id]/page.tsx
export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { ParlamentarProfilePage } from '@/components/parlamentares/profile/ParlamentarProfilePage';
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

  if (!profile) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <ParlamentarProfilePage profile={profile} />
    </main>
  );
}
