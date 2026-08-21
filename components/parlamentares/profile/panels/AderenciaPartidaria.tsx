'use client';

import { useEffect, useState } from 'react';
import { Info, Loader2 } from 'lucide-react';
import { AlinhamentoPartidario } from '@/types';
import { getAlinhamentoParlamentar } from '@/services/parlamentares';
import { MicroInfoCard } from '../shared/MicroInfoCard';

interface AderenciaPartidariaProps {
  parlamentarId: number;
}

const ROTULO = 'Aderência à orientação do partido';

export function AderenciaPartidaria({ parlamentarId }: AderenciaPartidariaProps) {
  const [alinhamento, setAlinhamento] = useState<AlinhamentoPartidario | null>(null);

  useEffect(() => {
    let cancelado = false;

    getAlinhamentoParlamentar(parlamentarId).then((resultado) => {
      if (!cancelado) setAlinhamento(resultado);
    });

    return () => {
      cancelado = true;
    };
  }, [parlamentarId]);

  if (!alinhamento) {
    return (
      <MicroInfoCard
        label={ROTULO}
        value={
          <span className="inline-flex items-center gap-2 text-slate-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Calculando
          </span>
        }
      />
    );
  }

  // Senador não tem taxa porque a orientação de bancada só existe na Câmara —
  // é uma lacuna da fonte, não um parlamentar que nunca segue o partido.
  if (!alinhamento.disponivel) {
    return (
      <MicroInfoCard
        label={ROTULO}
        value={
          <span className="text-slate-500">
            {alinhamento.motivo === 'SENADO'
              ? 'Não disponível para senadores — só a Câmara publica orientação de bancada.'
              : 'Não conseguimos calcular agora.'}
          </span>
        }
      />
    );
  }

  if (alinhamento.taxa === null || alinhamento.consideradas === 0) {
    return (
      <MicroInfoCard
        label={ROTULO}
        value={
          <span className="text-slate-500">
            Sem votações com orientação registrada.
          </span>
        }
      />
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {ROTULO}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">{alinhamento.taxa}%</p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        Seguiu em {alinhamento.seguiu} de {alinhamento.consideradas} votações;
        divergiu em {alinhamento.divergiu}.
      </p>

      {alinhamento.liberadas > 0 ? (
        <p className="mt-2 text-xs leading-5 text-slate-400">
          Outras {alinhamento.liberadas} votações ficaram de fora porque o
          partido liberou a bancada — sem orientação, não há o que seguir.
        </p>
      ) : null}

      {/*
        Sem histórico de filiação, a comparação usa o partido de hoje para todo
        o mandato. Quem trocou de partido aparece comparado à bancada errada.
      */}
      {alinhamento.fonteFiliacao === 'partidoAtual' ? (
        <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-amber-700">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Não temos o histórico de filiação deste parlamentar: a comparação usou
          o partido atual em todo o período. Se houve troca de partido, a taxa
          está distorcida.
        </p>
      ) : null}
    </div>
  );
}
