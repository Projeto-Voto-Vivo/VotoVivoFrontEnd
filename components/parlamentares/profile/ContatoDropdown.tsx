'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { ParlamentarDetalhe } from '@/types';

interface ContatoDropdownProps {
  parlamentar: ParlamentarDetalhe;
}

export function ContatoDropdown({ parlamentar }: ContatoDropdownProps) {
  // No desktop (xl+) fica sempre aberto, no mobile começa fechado
  const [aberto, setAberto] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)');
    setIsDesktop(mq.matches);
    setAberto(mq.matches);

    function onChange(e: MediaQueryListEvent) {
      setIsDesktop(e.matches);
      setAberto(e.matches);
    }

    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  function toggle() {
    if (isDesktop) return; // no desktop não permite fechar
    setAberto((prev) => !prev);
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={aberto}
        className="flex w-full items-center justify-between p-5 text-left xl:cursor-default"
      >
        <h2 className="text-lg font-bold text-slate-900">Contato e identificação</h2>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 xl:hidden ${aberto ? 'rotate-180' : ''}`}
        />
      </button>

      {aberto && (
        <div className="border-t border-slate-100 p-5">
          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brasil-blue" />
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">E-mail institucional</p>
                {parlamentar.email ? (
                  <a
                    href={`mailto:${parlamentar.email}`}
                    className="break-all hover:text-brasil-blue"
                  >
                    {parlamentar.email}
                  </a>
                ) : (
                  <p>Não informado</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brasil-blue" />
              <div>
                <p className="font-semibold text-slate-900">Telefone do gabinete</p>
                <p>{parlamentar.gabinete.telefone || 'Não informado'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brasil-blue" />
              <div>
                <p className="font-semibold text-slate-900">Gabinete</p>
                <p>
                  {parlamentar.gabinete.endereco ||
                    `${parlamentar.gabinete.predio} · Sala ${parlamentar.gabinete.sala}`}
                </p>
              </div>
            </div>
          </div>

          {parlamentar.redesSociais.length > 0 && (
            <div className="mt-5 border-t border-slate-200 pt-4">
              <p className="text-sm font-semibold text-slate-900">Canais públicos</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {parlamentar.redesSociais.map((rede) => (
                  <Link
                    key={`${rede.rede}-${rede.url}`}
                    href={rede.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-brasil-blue hover:text-brasil-blue"
                  >
                    {rede.rede}
                    <ExternalLink size={14} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
