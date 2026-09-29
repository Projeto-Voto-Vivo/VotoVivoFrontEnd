import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginacaoProps {
  /** Texto de posição, ex.: "1–5 de 120 votações". */
  resumo: ReactNode;
  /** Quando há uma página só, fica só o resumo. */
  mostrarBotoes: boolean;
  podeVoltar: boolean;
  podeAvancar: boolean;
  onAnterior: () => void;
  onProxima: () => void;
  /**
   * Em cima da lista a navegação evita rolar até o fim só para trocar de
   * página; embaixo, ela está onde a leitura termina.
   */
  posicao: 'topo' | 'rodape';
  /** Margem de cima do topo, quando a lista não tem nada acima dela. */
  margemTopo?: string;
}

const classeBotao =
  'inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brasil-blue hover:text-brasil-blue disabled:cursor-not-allowed disabled:opacity-50';

export function Paginacao({
  resumo,
  mostrarBotoes,
  podeVoltar,
  podeAvancar,
  onAnterior,
  onProxima,
  posicao,
  margemTopo = 'mt-5',
}: PaginacaoProps) {
  const classePosicao =
    posicao === 'topo'
      ? `${margemTopo} border-b border-slate-100 pb-4`
      : 'mt-5 border-t border-slate-100 pt-4';

  return (
    <nav
      aria-label={posicao === 'topo' ? 'Paginação (topo)' : 'Paginação'}
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${classePosicao}`}
    >
      <p className="text-sm text-slate-500">{resumo}</p>

      {mostrarBotoes && (
        <div className="flex gap-2">
          <button type="button" onClick={onAnterior} disabled={!podeVoltar} className={classeBotao}>
            <ChevronLeft size={16} />
            Anterior
          </button>
          <button type="button" onClick={onProxima} disabled={!podeAvancar} className={classeBotao}>
            Próxima
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </nav>
  );
}
