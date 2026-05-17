import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ParlamentarPerfil } from '@/types';
import { ParlamentarHero } from './ParlamentarHero';
import { ParlamentarIndicators } from './ParlamentarIndicators';
import { ParlamentarPanels } from './ParlamentarPanels';

interface ParlamentarProfilePageProps {
  profile: ParlamentarPerfil;
}

export function ParlamentarProfilePage({ profile }: ParlamentarProfilePageProps) {
  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <Link
        href="/parlamentares"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-brasil-blue"
      >
        <ArrowLeft size={16} />
        Voltar para parlamentares
      </Link>

      <ParlamentarHero profile={profile} />

      <ParlamentarIndicators indicadores={profile.indicadores} />

      <ParlamentarPanels profile={profile} />
    </div>
  );
}