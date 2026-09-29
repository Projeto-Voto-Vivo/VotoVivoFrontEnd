'use client';

import { ReactNode, useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SectionShellProps {
  icon: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  /**
   * No celular a seção nasce fechada e abre no toque, como o card de contato.
   * Do `md` para cima fica sempre aberta.
   */
  recolhivelNoMobile?: boolean;
}

export function SectionShell({
  icon,
  title,
  description,
  children,
  recolhivelNoMobile = false,
}: SectionShellProps) {
  const [aberto, setAberto] = useState(false);
  const conteudoId = useId();

  const cabecalho = (
    <div className="flex items-center gap-4">
      <div className="rounded-2xl bg-white p-3 text-brasil-blue shadow-sm ring-1 ring-brasil-blue/10">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        ) : null}
      </div>
      {recolhivelNoMobile ? (
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 md:hidden ${aberto ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );

  const classeCabecalho =
    'border-b border-slate-100 bg-gradient-to-r from-brasil-blue/5 via-white to-brasil-green/5 p-6 md:p-8';

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {recolhivelNoMobile ? (
        // O estado só vale no celular: do `md` para cima o CSS mantém aberto.
        <button
          type="button"
          onClick={() => setAberto((atual) => !atual)}
          aria-expanded={aberto}
          aria-controls={conteudoId}
          className={`block w-full text-left md:pointer-events-none md:cursor-default ${classeCabecalho}`}
        >
          {cabecalho}
        </button>
      ) : (
        <div className={classeCabecalho}>{cabecalho}</div>
      )}

      <div
        id={conteudoId}
        className={`p-6 md:p-8 ${recolhivelNoMobile && !aberto ? 'hidden md:block' : ''}`}
      >
        {children}
      </div>
    </section>
  );
}
