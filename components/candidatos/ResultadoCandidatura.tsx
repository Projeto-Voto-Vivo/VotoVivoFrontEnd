import { CircleCheck, Repeat2 } from 'lucide-react';
import { ResultadoCandidatura as Resultado } from '@/services/candidatos';
import {
  desfechoCandidato,
  formatNumero,
  formatPercentual,
  rotuloTurno,
} from '@/components/eleicoes/formatacao';

interface ResultadoCandidaturaProps {
  resultados?: Resultado[];
}

// Votação da candidatura, um bloco por turno disputado.
export function ResultadoCandidatura({ resultados }: ResultadoCandidaturaProps) {
  if (!resultados || resultados.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Resultado nas urnas
      </p>

      <ul className="mt-2 space-y-3">
        {resultados.map((resultado) => {
          const desfecho = desfechoCandidato(resultado);
          const largura = Math.min(100, Math.max(0, resultado.percentualVotos ?? 0));

          return (
            <li
              key={resultado.idEleicaoResultado}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {rotuloTurno(resultado.turno)}
                </span>

                <span
                  className={`inline-flex max-w-full items-center gap-1 break-words rounded-full border px-2 py-1 text-xs font-semibold ${desfecho.badge}`}
                >
                  {desfecho.tipo === 'eleito' && (
                    <CircleCheck size={14} aria-hidden="true" />
                  )}
                  {desfecho.tipo === 'segundoTurno' && (
                    <Repeat2 size={14} aria-hidden="true" />
                  )}
                  {desfecho.rotulo}
                </span>
              </div>

              <p className="mt-3 text-2xl font-bold text-slate-900">
                {formatNumero(resultado.votos)}
                <span className="ml-1.5 text-sm font-medium text-slate-500">
                  votos
                </span>
              </p>

              {resultado.percentualVotos !== null && (
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-2 flex-1 rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-voto-sim"
                      style={{ width: `${largura}%` }}
                      aria-hidden="true"
                    />
                  </div>

                  <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-600">
                    {formatPercentual(resultado.percentualVotos)}
                  </span>
                </div>
              )}

              <p className="mt-2 text-xs leading-5 text-slate-500">
                {resultado.percentualVotos !== null && 'dos votos válidos'}
                {resultado.percentualVotos !== null && resultado.posicao !== null && ' · '}
                {resultado.posicao !== null && `${resultado.posicao}º lugar na disputa`}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
