import { ReactNode } from 'react';

interface PainelComDashboardsProps {
  /** Lista item a item da aba (votações, proposições, emendas, despesas). */
  principal: ReactNode;
  /** Dashboards que resumem a aba. */
  dashboards: ReactNode;
}

/**
 * O padrão das abas do perfil: lista à esquerda, dashboards à direita.
 *
 * No celular os dashboards vêm primeiro — o resumo antes do caso a caso. Por
 * isso eles também vêm primeiro no DOM (a ordem de leitura acompanha a tela
 * pequena), e no `xl` o grid os empurra para a coluna da direita.
 */
export function PainelComDashboards({ principal, dashboards }: PainelComDashboardsProps) {
  return (
    <div className="grid items-start gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="min-w-0 space-y-6 xl:col-start-2 xl:row-start-1">
        {dashboards}
      </div>

      <div className="min-w-0 space-y-6 xl:col-start-1 xl:row-start-1">
        {principal}
      </div>
    </div>
  );
}
