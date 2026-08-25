'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface DicaTermoProps {
  /** Título curto da dica — normalmente o próprio termo. */
  termo: string;
  children: React.ReactNode;
}

/** Respiro entre o balão e o "?", e entre o balão e a borda da tela. */
const MARGEM = 8;

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
 * O balão é `fixed`, não `absolute`: os cards e as seções do perfil usam
 * `overflow-hidden` para arredondar os cantos, e um balão posicionado dentro
 * deles saía recortado pela metade. `fixed` escapa do recorte, ao custo de
 * precisar de coordenadas calculadas — daí a medição abaixo.
 *
 * Abre para cima e para a direita do "?". Vira para baixo se não couber acima,
 * e é empurrado para dentro quando encostaria na borda da tela.
 */
export function DicaTermo({ termo, children }: DicaTermoProps) {
  const [aberta, setAberta] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const balaoRef = useRef<HTMLSpanElement>(null);
  const id = useId();

  const posicionar = useCallback(() => {
    const botao = botaoRef.current;
    const balao = balaoRef.current;
    if (!botao || !balao) return;

    const alvo = botao.getBoundingClientRect();
    const caixa = balao.getBoundingClientRect();

    // Para a direita: o balão começa na borda esquerda do "?" e cresce dali.
    let esquerda = alvo.left;
    const limiteDireito = window.innerWidth - MARGEM - caixa.width;
    if (esquerda > limiteDireito) esquerda = limiteDireito;
    if (esquerda < MARGEM) esquerda = MARGEM;

    // Para cima: encostado acima do "?". Se não couber, vira para baixo — e se
    // não couber dos dois lados (tela baixa), fica preso dentro da janela.
    const acima = alvo.top - MARGEM - caixa.height;
    let topo = acima >= MARGEM ? acima : alvo.bottom + MARGEM;
    topo = Math.min(topo, window.innerHeight - MARGEM - caixa.height);
    topo = Math.max(topo, MARGEM);

    balao.style.left = `${Math.round(esquerda)}px`;
    balao.style.top = `${Math.round(topo)}px`;
    balao.style.visibility = 'visible';
  }, []);

  useEffect(() => {
    if (!aberta) return;

    // A primeira medição precisa do balão já renderizado — por isso ele nasce
    // invisível, e só aparece depois de saber para onde ir.
    posicionar();

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
    // Rolar com o balão aberto o deixaria para trás: ele é `fixed`.
    window.addEventListener('scroll', posicionar, true);
    window.addEventListener('resize', posicionar);

    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.removeEventListener('mousedown', aoClicarFora);
      window.removeEventListener('scroll', posicionar, true);
      window.removeEventListener('resize', posicionar);
    };
  }, [aberta, posicionar]);

  return (
    <span ref={containerRef} className="relative inline-flex align-middle">
      <button
        ref={botaoRef}
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
          style={{ visibility: 'hidden' }}
          className="fixed left-0 top-0 z-50 w-60 max-w-[calc(100vw-1rem)] whitespace-normal break-words rounded-2xl border border-slate-200 bg-white p-3 text-left text-xs font-normal normal-case leading-5 tracking-normal text-slate-600 shadow-lg"
        >
          <span className="block font-bold text-slate-900">{termo}</span>
          <span className="mt-1 block">{children}</span>
        </span>
      ) : null}
    </span>
  );
}
