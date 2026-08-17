import { ArrowLeft } from 'lucide-react';
import { ParlamentarPerfil } from '@/types';
import { BackButton } from '@/components/layout/BackButton';
import { NavLink } from '@/components/layout/NavLink';
import { ParlamentarHero } from './ParlamentarHero';
import { ParlamentarPanels } from './ParlamentarPanels';

interface ParlamentarProfilePageProps {
  profile: ParlamentarPerfil;
}

export function ParlamentarProfilePage({ profile }: ParlamentarProfilePageProps) {
  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <NavLink
        href="/parlamentares"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-brasil-blue"
      >
        <ArrowLeft size={16} />
        Voltar para parlamentares
      </NavLink>

      <ParlamentarHero profile={profile} />

      <ParlamentarPanels profile={profile} />

      <BackButton href="/parlamentares" label="Voltar para parlamentares" />
    </div>
  );
}