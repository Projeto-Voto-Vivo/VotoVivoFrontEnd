import Link from 'next/link';
import { BadgeCheck, Vote } from 'lucide-react';
import { Candidato } from '@/services/candidatos';
import {
  estiloSituacao,
  linkTseCandidatura,
  rotuloSituacao,
} from './situacaoCandidatura';

interface CandidaturaParlamentarCardProps {
  candidatura: Candidato;
}

export function CandidaturaParlamentarCard({
  candidatura,
}: CandidaturaParlamentarCardProps) {
  const situacao = estiloSituacao(candidatura.situacaoCandidatura);

  return (
    <div
      className={`overflow-hidden rounded-3xl border bg-white shadow-sm ${situacao.borda}`}
    >
      <div className={`h-1.5 ${situacao.faixa}`} />

      <div className="p-5 md:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brasil-blue/10 text-brasil-blue">
            <Vote size={22} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brasil-blue">
              Eleições {candidatura.anoEleicao}
            </p>
            <h2 className="text-lg font-bold text-slate-900">
              Candidatura
            </h2>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {candidatura.cargo && (
            <span className="max-w-full break-words rounded-full border border-slate-200 bg-slate-50 px-2 py-1 font-medium text-slate-700">
              {candidatura.cargo}
            </span>
          )}

          {candidatura.numeroCandidato && (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 font-medium text-slate-700">
              Nº {candidatura.numeroCandidato}
            </span>
          )}

          {candidatura.siglaPartido && (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 font-medium text-slate-700">
              {candidatura.siglaPartido}
              {candidatura.uf && ` · ${candidatura.uf}`}
            </span>
          )}
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Situação da candidatura
          </p>

          <span
            className={`mt-2 inline-flex max-w-full break-words rounded-full border px-3 py-1.5 text-sm font-medium ${situacao.badge}`}
          >
            {rotuloSituacao(candidatura.situacaoCandidatura)}
          </span>
        </div>

        <a
          href={linkTseCandidatura(candidatura)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brasil-blue px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <BadgeCheck size={18} />
          Ver ficha completa no TSE
        </a>

        <Link
          href="/candidatos"
          className="mt-3 inline-block text-sm font-semibold text-brasil-blue hover:underline"
        >
          Ver todos os candidatos →
        </Link>
      </div>
    </div>
  );
}
