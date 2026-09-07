import Image from 'next/image';
import { BadgeCheck } from 'lucide-react';
import { ParlamentarPerfil } from '@/types';
import { ContatoDropdown } from './ContatoDropdown';

interface ParlamentarHeroProps {
  profile: ParlamentarPerfil;
}

export function ParlamentarHero({ profile }: ParlamentarHeroProps) {
  const { parlamentar } = profile;

  const situacao = parlamentar.situacaoMandato ?? parlamentar.situacao ?? null;
  const situacaoLabel = situacao ?? 'Situação do mandato não informada';
  const situacaoClasses = situacao
    ? 'border-brasil-green/10 bg-brasil-green/10 text-brasil-green'
    : 'border-slate-200 bg-slate-100 text-slate-500';

  return (
    <section className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="h-2 bg-gradient-to-r from-brasil-green via-brasil-yellow to-brasil-blue" />

        <div className="p-5 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row">

            {/* Foto */}
            <div className="shrink-0 lg:w-[260px]">
              {/* Mobile: foto compacta + badges */}
              <div className="flex items-center gap-4 lg:hidden">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  <Image
                    src={parlamentar.urlFoto}
                    alt={parlamentar.nomeParlamentar}
                    fill
                    sizes="80px"
                    className="object-cover object-top"
                    unoptimized
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brasil-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brasil-blue">
                    Perfil do parlamentar
                  </span>
                  <span className={`rounded-full border px-3 py-1 text-xs font-medium ${situacaoClasses}`}>
                    {situacaoLabel}
                  </span>
                </div>
              </div>

              {/* Desktop: foto grande */}
              <div className="relative hidden aspect-[4/5] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 lg:block">
                <Image
                  src={parlamentar.urlFoto}
                  alt={parlamentar.nomeParlamentar}
                  fill
                  sizes="260px"
                  className="object-cover object-top"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brasil-blue shadow-sm">
                    <BadgeCheck size={14} />
                    Perfil ampliado
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo textual */}
            <div className="flex-1 space-y-4 md:space-y-5">
              {/* Badges — só no desktop */}
              <div className="hidden flex-wrap items-center gap-2 lg:flex">
                <span className="rounded-full bg-brasil-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brasil-blue">
                  Perfil do parlamentar
                </span>
                <span className={`rounded-full border px-3 py-1 text-xs font-medium ${situacaoClasses}`}>
                  {situacaoLabel}
                </span>
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-5xl">
                  {parlamentar.nomeParlamentar}
                </h1>
                <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600 md:mt-3 md:text-lg md:leading-8">
                  {profile.subtitulo}
                </p>
              </div>

              {/* Chips — cargo e partido/UF apenas, sem casa legislativa */}
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-700 md:px-4 md:py-2">
                  {parlamentar.cargo ?? 'Parlamentar'}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-700 md:px-4 md:py-2">
                  {parlamentar.siglaPartido} · {parlamentar.uf}
                </span>
                {parlamentar.legislatura ? (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-700 md:px-4 md:py-2">
                    {parlamentar.legislatura}
                  </span>
                ) : null}
              </div>

              {profile.resumo ? (
                <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
                  {profile.resumo}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar — contato como dropdown em mobile, sempre aberto em desktop */}
      <aside className="space-y-4">
        <ContatoDropdown parlamentar={parlamentar} />
      </aside>
    </section>
  );
}
