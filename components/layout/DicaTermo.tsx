'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface DicaTermoProps {
  /** Título curto da dica — normalmente o próprio termo. */
  termo: string;
  children: React.ReactNode;
}

/**
 * Um "?" que explica um termo.
 *
 * Abre no hover e no foco (teclado), e alterna no clique — que é o único gesto
 * disponível em tela de toque, onde hover não existe. Sem o clique, a
 * explicação seria invisível no celular.
 *
 * Fecha com Escape e ao clicar fora, porque um balão preso na tela depois de
 * aberto é pior que não ter balão.
 *
 * O balão reimprime `whitespace`, `text-transform` e `tracking` porque herda o
 * contexto de onde é usado: dentro de uma célula `whitespace-nowrap` o texto
 * saía numa linha só, atravessando a tela, e sob um rótulo em versalete ele
 * saía todo em maiúsculas.
 */
export function DicaTermo({ termo, children }: DicaTermoProps) {
  const [aberta, setAberta] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const balaoRef = useRef<HTMLSpanElement>(null);
  const id = useId();

  // O balão nasce centrado no "?". Num card da última coluna, ou num rótulo
  // longo que empurra o ícone para a direita, isso o joga para fora da tela.
  // Aqui ele é medido depois de aberto e empurrado de volta para dentro —
  // escrevendo direto no style, sem estado, para não repintar a árvore.
  useEffect(() => {
    const balao = balaoRef.current;
    if (!aberta || !balao) return;

    balao.style.transform = 'translateX(-50%)';

    const margem = 8;
    const caixa = balao.getBoundingClientRect();
    const excedeDireita = caixa.right - (window.innerWidth - margem);
    const excedeEsquerda = margem - caixa.left;
    const desloca =
      excedeDireita > 0 ? -excedeDireita : excedeEsquerda > 0 ? excedeEsquerda : 0;

    if (desloca) {
      balao.style.transform = `translateX(calc(-50% + ${desloca}px))`;
    }
  }, [aberta]);

  useEffect(() => {
    if (!aberta) return;

    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === 'Escape') setAberta(false);
    }

    function aoClicarFora(evento: MouseEvent) {
      if (!containerRef.current?.contains(evento.target as Node)) {
        setAberta(false);
      }
    }

    document.addEventListener('keydown', aoTeclar);
    document.addEventListener('mousedown', aoClicarFora);

    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.removeEventListener('mousedown', aoClicarFora);
    };
  }, [aberta]);

  return (
    <span ref={containerRef} className="relative inline-flex align-middle">
      <button
        type="button"
        onClick={() => setAberta((atual) => !atual)}
        onMouseEnter={() => setAberta(true)}
        onMouseLeave={() => setAberta(false)}
        onFocus={() => setAberta(true)}
        onBlur={() => setAberta(false)}
        aria-expanded={aberta}
        aria-describedby={aberta ? id : undefined}
        aria-label={`O que significa ${termo}`}
        className="grid h-6 w-6 place-items-center rounded-full text-slate-400 transition-colors hover:text-brasil-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brasil-blue"
      >
        <HelpCircle size={14} aria-hidden="true" />
      </button>

      {aberta ? (
        <span
          ref={balaoRef}
          id={id}
          role="tooltip"
          className="absolute left-1/2 top-full z-30 mt-1 w-60 max-w-[calc(100vw-2rem)] -translate-x-1/2 whitespace-normal break-words rounded-2xl border border-slate-200 bg-white p-3 text-left text-xs font-normal normal-case leading-5 tracking-normal text-slate-600 shadow-lg"
        >
          <span className="block font-bold text-slate-900">{termo}</span>
          <span className="mt-1 block">{children}</span>
        </span>
      ) : null}
    </span>
  );
}
