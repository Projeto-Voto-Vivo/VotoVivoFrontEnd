'use client';

import { DicaTermo } from '@/components/layout/DicaTermo';

interface FaseEmendaProps {
  fase: string | null;
}

/**
 * As três fases da execução de uma emenda, na ordem em que acontecem.
 *
 * São as que a fonte usa — o backend normaliza exatamente estas três para
 * montar o link do Portal da Transparência. Fase fora da lista aparece sem
 * ponto de interrogação: melhor não explicar do que explicar errado.
 */
const EXPLICACOES: Record<string, string> = {
  empenho:
    'Primeira fase: o governo reserva o dinheiro no orçamento e se compromete a pagar. Nada saiu do caixa ainda — é uma promessa formal.',
  liquidacao:
    'Segunda fase: o governo confere que a obra foi feita ou o serviço entregue, e reconhece que a dívida é devida. O dinheiro continua no caixa.',
  pagamento:
    'Terceira e última fase: o dinheiro sai efetivamente dos cofres públicos e chega a quem recebeu. Só aqui o gasto de fato aconteceu.',
};

function normalizar(valor: string) {
  return valor
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

export function FaseEmenda({ fase }: FaseEmendaProps) {
  if (!fase) return <>—</>;

  const explicacao = EXPLICACOES[normalizar(fase)];

  return (
    <span className="inline-flex items-center gap-0.5">
      {fase}
      {explicacao ? <DicaTermo termo={fase}>{explicacao}</DicaTermo> : null}
    </span>
  );
}
