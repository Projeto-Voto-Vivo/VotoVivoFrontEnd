import { ParlamentarPerfil } from '@/types';
import { BackButton } from '@/components/layout/BackButton';
import { NavLink } from '@/components/layout/NavLink';
import { VoltarLink } from '@/components/layout/VoltarLink';
import { ParlamentarHero } from './ParlamentarHero';
import { ParlamentarPanels } from './ParlamentarPanels';

interface ParlamentarProfilePageProps {
  profile: ParlamentarPerfil;
}

export function ParlamentarProfilePage({ profile }: ParlamentarProfilePageProps) {
  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/*
        Voltar para onde se estava, e um caminho explícito para a lista ao
        lado — quem chegou aqui pela busca de proposições não quer ser jogado
        numa lista de parlamentares sem ter pedido.
      */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <VoltarLink fallbackHref="/parlamentares" />

        <NavLink
          href="/parlamentares"
          className="text-sm font-medium text-slate-400 transition-colors hover:text-brasil-blue"
        >
          Ver todos os parlamentares
        </NavLink>
      </div>

      <ParlamentarHero profile={profile} />

      <ParlamentarPanels profile={profile} />

      {/* Sem `href`: o botão flutuante usa o histórico do navegador. */}
      <BackButton label="Voltar" />
    </div>
  );
}
