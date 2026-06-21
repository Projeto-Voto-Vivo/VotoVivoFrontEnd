'use client';

import { useMemo, useState } from 'react';
import { FileText, Landmark, Receipt, Vote, Wallet } from 'lucide-react';
import { ParlamentarPerfil } from '@/types';
import { PanelButton } from './shared/PanelButton';
import { DespesasPanel } from './panels/DespesasPanel'
import { EmendasPanel } from './panels/EmendasPanel';
import { ProposicoesPanel } from './panels/ProposicoesPanel';
import { VisaoGeralPanel } from './panels/VisaoGeralPanel';
import { VotacoesPanel } from './panels/VotacoesPanel';

type PanelKey =
  | 'visao-geral'
  | 'proposicoes'
  | 'emendas'
  | 'votacoes'
  | 'despesas';

interface ParlamentarPanelsProps {
  profile: ParlamentarPerfil;
}

export function ParlamentarPanels({ profile }: ParlamentarPanelsProps) {
  const [activePanel, setActivePanel] = useState<PanelKey>('visao-geral');

  const panelOptions = useMemo(
    () => [
      {
        key: 'visao-geral' as const,
        label: 'Visão geral',
        icon: <Landmark className="h-5 w-5" />,
      },
      {
        key: 'proposicoes' as const,
        label: 'Proposições',
        icon: <FileText className="h-5 w-5" />,
      },
      {
        key: 'emendas' as const,
        label: 'Emendas',
        icon: <Receipt className="h-5 w-5" />,
      },
      {
        key: 'votacoes' as const,
        label: 'Votações',
        icon: <Vote className="h-5 w-5" />,
      },
      {
        key: 'despesas' as const,
        label: 'Despesas',
        icon: <Wallet className="h-5 w-5" />,
      },
    ],
    [],
  );

  const currentPanelLabel =
    panelOptions.find((panel) => panel.key === activePanel)?.label ?? 'Visão geral';

  return (
    <>
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-brasil-blue/5 via-white to-brasil-green/5 p-5 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                Painéis do perfil
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Dados do mandato
              </h2>
            </div>

            <div className="w-fit rounded-full border border-brasil-blue/10 bg-white px-4 py-2 text-sm font-bold text-brasil-blue shadow-sm">
              {currentPanelLabel}
            </div>
          </div>
        </div>

        <div className="grid gap-3 p-5 md:grid-cols-2 md:p-6 xl:grid-cols-5">
          {panelOptions.map((panel) => (
            <PanelButton
              key={panel.key}
              active={activePanel === panel.key}
              icon={panel.icon}
              label={panel.label}
              onClick={() => setActivePanel(panel.key)}
            />
          ))}
        </div>
      </section>

      {activePanel === 'visao-geral' && <VisaoGeralPanel profile={profile} />}
      {activePanel === 'proposicoes' && <ProposicoesPanel profile={profile} />}
      {activePanel === 'emendas' && (<EmendasPanel profile={profile} parlamentarId={profile.parlamentar.id} />)}
      {activePanel === 'votacoes' && <VotacoesPanel profile={profile} />}
      {activePanel === 'despesas' && <DespesasPanel profile={profile} />}
    </>
  );
}
