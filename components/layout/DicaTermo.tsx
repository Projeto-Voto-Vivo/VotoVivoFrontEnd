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
 */
export function DicaTermo({ termo, children }: DicaTermoProps) {
  const [aberta, setAberta] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const id = useId();

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
          id={id}
          role="tooltip"
          className="absolute left-1/2 top-full z-30 mt-1 w-60 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-3 text-left text-xs font-normal leading-5 text-slate-600 shadow-lg"
        >
          <span className="block font-bold text-slate-900">{termo}</span>
          <span className="mt-1 block">{children}</span>
        </span>
      ) : null}
    </span>
  );
}
