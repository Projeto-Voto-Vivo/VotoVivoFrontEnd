import Image from 'next/image';
import { BadgeCheck } from 'lucide-react';
import {
  estiloSituacao,
  linkTseCandidatura,
  rotuloSituacao,
} from './situacaoCandidatura';

interface CandidatoHeroProps {
  candidato: {
    idCandidaturaTse: number;
    sqCandidato: string;
    anoEleicao: number;
    descricaoEleicao: string | null;
    nomeUrna: string;
    nomeCivil: string;
    cargo: string | null;
    siglaPartido: string | null;
    uf: string | null;
    numeroCandidato: string | null;
    situacaoCandidatura: string | null;
    resultadoEleicao: string | null;
    fotoUrl?: string | null;
    idParlamentar?: number | null;
  };
}

export function CandidatoHero({ candidato }: CandidatoHeroProps) {
  const situacao = rotuloSituacao(candidato.situacaoCandidatura);
  const situacaoClasses = estiloSituacao(candidato.situacaoCandidatura).badge;
  const linkTse = linkTseCandidatura(candidato);

  return (
    <section className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
      {/* CARD PRINCIPAL */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="h-2 bg-gradient-to-r from-brasil-green via-brasil-yellow to-brasil-blue" />

        <div className="p-5 md:p-8">
          <div className="flex flex-col gap-7 lg:flex-row">
            {/* FOTO */}
            <div className="shrink-0 lg:w-[260px]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                {candidato.fotoUrl ? (
                  <Image
                    src={candidato.fotoUrl}
                    alt={candidato.nomeUrna}
                    fill
                    sizes="260px"
                    className="object-cover object-top"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-200 text-6xl font-bold text-slate-400">
                    {candidato.nomeUrna.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* INFORMAÇÕES */}
            <div className="flex-1">
              <div className="mb-5">
                <span className="inline-flex rounded-full bg-brasil-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brasil-blue">
                  Candidato {candidato.anoEleicao}
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                {candidato.nomeUrna}
              </h1>

              <p className="mt-2 text-base leading-7 text-slate-600">
                {candidato.nomeCivil}
              </p>

              <div className="mt-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Cargo
                </p>

                <p className="mt-1 text-xl font-semibold text-slate-900">
                  {candidato.cargo ?? 'Não informado'}
                </p>
              </div>

              {/* DADOS DA CANDIDATURA */}
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Número
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-800">
                    {candidato.numeroCandidato ?? 'Não informado'}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Estado
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-800">
                    {candidato.uf ?? 'Não informado'}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Partido
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-800">
                    {candidato.siglaPartido ?? 'Não informado'}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Ano da eleição
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-800">
                    {candidato.anoEleicao}
                  </p>
                </div>
              </div>

              {/* SITUAÇÃO */}
              <div className="mt-7 border-t border-slate-200 pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Situação da candidatura
                </p>

                <div className="mt-2">
                  <span
                    className={`inline-flex rounded-full border px-4 py-2 text-sm font-medium ${situacaoClasses}`}
                  >
                    {situacao}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CARD LATERAL */}
      <aside className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brasil-blue/10 text-brasil-blue">
            <BadgeCheck size={22} />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Informações oficiais
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Consulte a ficha completa desta candidatura diretamente no
            Tribunal Superior Eleitoral.
          </p>

          <a
            href={linkTse}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brasil-blue px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <BadgeCheck size={18} />
            Ver ficha completa no TSE
          </a>

          <p className="mt-4 text-xs leading-5 text-slate-500">
            Para mais informações sobre a candidatura, dados eleitorais e
            prestação de contas, consulte a ficha oficial no TSE.
          </p>

          <div className="mt-5 border-t border-slate-200 pt-4">
            <p className="text-xs leading-5 text-slate-400">
              Dados oficiais da Justiça Eleitoral.
            </p>
          </div>
        </div>

        {/* VÍNCULO COM PARLAMENTAR */}
        {candidato.idParlamentar && (
          <div className="rounded-3xl border border-brasil-blue/20 bg-brasil-blue/5 p-5 shadow-sm md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brasil-blue">
              Parlamentar em exercício
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-700">
              Esta candidatura está vinculada a um parlamentar cadastrado no
              Voto Vivo.
            </p>

            <a
              href={`/parlamentares/${candidato.idParlamentar}`}
              className="mt-4 inline-block text-sm font-semibold text-brasil-blue hover:underline"
            >
              Ver perfil do parlamentar →
            </a>
          </div>
        )}
      </aside>
    </section>
  );
}