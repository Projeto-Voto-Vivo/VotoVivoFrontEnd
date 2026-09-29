import Link from 'next/link';
import Image from 'next/image';
import { Candidato } from '@/services/candidatos';
import { estiloSituacao, rotuloSituacao } from './situacaoCandidatura';

interface CandidatoCardProps {
  candidato: Candidato;
}

export function CandidatoCard({ candidato }: CandidatoCardProps) {
  const situacao = estiloSituacao(candidato.situacaoCandidatura);

  return (
    <Link
      href={`/candidatos/${candidato.idCandidaturaTse}`}
      className={`group flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-lg ${situacao.borda}`}
    >
      <div className={`h-1.5 ${situacao.faixa}`} />

      <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:flex-row sm:items-start">
        {/* Foto */}
        <div className="relative mx-auto h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:mx-0 sm:h-20 sm:w-20">
          {candidato.fotoUrl ? (
            <Image
              src={candidato.fotoUrl}
              alt={candidato.nomeUrna}
              fill
              sizes="96px"
              className="object-cover object-top"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-200 text-2xl font-bold text-slate-500">
              {candidato.nomeUrna.charAt(0)}
            </div>
          )}
        </div>

        {/* Informações */}
        <div className="min-w-0 flex-1 space-y-2">
          <h3 className="break-words text-base font-semibold leading-tight text-slate-900">
            {candidato.nomeUrna}
          </h3>

          <p className="break-words text-xs leading-relaxed text-slate-500">
            {candidato.nomeCivil}
          </p>

          <span
            className={`inline-block max-w-full break-words rounded-full border px-2 py-1 text-xs font-semibold ${situacao.badge}`}
          >
            {rotuloSituacao(candidato.situacaoCandidatura)}
          </span>

          <div className="flex min-w-0 flex-wrap gap-2 text-xs">
            {candidato.cargo && (
              <span className="max-w-full break-words rounded-full border border-slate-200 bg-slate-50 px-2 py-1 font-medium text-slate-700">
                {candidato.cargo}
              </span>
            )}

            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 font-medium text-slate-700">
              {candidato.siglaPartido || 'Partido não informado'}
              {candidato.uf && ` · ${candidato.uf}`}
            </span>

            {candidato.numeroCandidato && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 font-medium text-slate-700">
                Nº {candidato.numeroCandidato}
              </span>
            )}
          </div>

          {candidato.idParlamentar && (
            <span className="inline-block text-xs font-semibold text-brasil-blue">
              Parlamentar em exercício
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}