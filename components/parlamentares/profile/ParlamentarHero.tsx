import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { ParlamentarPerfil } from '@/types';

interface ParlamentarHeroProps {
  profile: ParlamentarPerfil;
}

export function ParlamentarHero({ profile }: ParlamentarHeroProps) {
  const { parlamentar } = profile;

  return (
    <section className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="h-2 bg-gradient-to-r from-brasil-green via-brasil-yellow to-brasil-blue" />

        <div className="p-5 md:p-8">
          {/* Mobile: foto pequena ao lado do nome. Desktop: foto grande em coluna separada */}
          <div className="flex flex-col gap-6 lg:flex-row">

            {/* Foto — compacta em mobile, larga no desktop */}
            <div className="shrink-0 lg:w-[260px]">
              {/* Mobile: linha com foto circular + badges */}
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
                  <span className="rounded-full border border-brasil-green/10 bg-brasil-green/10 px-3 py-1 text-xs font-medium text-brasil-green">
                    {parlamentar.situacaoMandato ?? parlamentar.situacao}
                  </span>
                </div>
              </div>

              {/* Desktop: foto grande com overlay */}
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
              {/* Badges — visíveis só no desktop (no mobile já estão ao lado da foto) */}
              <div className="hidden flex-wrap items-center gap-2 lg:flex">
                <span className="rounded-full bg-brasil-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brasil-blue">
                  Perfil do parlamentar
                </span>
                <span className="rounded-full border border-brasil-green/10 bg-brasil-green/10 px-3 py-1 text-xs font-medium text-brasil-green">
                  {parlamentar.situacaoMandato ?? parlamentar.situacao}
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

              <div className="flex flex-wrap gap-2 text-sm">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-700 md:px-4 md:py-2">
                  {parlamentar.cargo ?? 'Parlamentar'}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-700 md:px-4 md:py-2">
                  {parlamentar.siglaPartido} · {parlamentar.uf}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-700 md:px-4 md:py-2">
                  {parlamentar.casaLegislativa ?? 'Poder Legislativo'}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-700 md:px-4 md:py-2">
                  {parlamentar.legislatura ?? 'Legislatura atual'}
                </span>
              </div>

              {profile.resumo ? (
                <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-base">{profile.resumo}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-lg font-bold text-slate-900">Contato e identificação</h2>

          <div className="mt-4 space-y-4 text-sm text-slate-600 md:mt-5">
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
                  {parlamentar.gabinete.endereco || `${parlamentar.gabinete.predio} · Sala ${parlamentar.gabinete.sala}`}
                </p>
              </div>
            </div>
          </div>

          {parlamentar.redesSociais.length > 0 && (
            <div className="mt-5 border-t border-slate-200 pt-4 md:mt-6 md:pt-5">
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
      </aside>
    </section>
  );
}