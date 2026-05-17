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

        <div className="p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="w-full shrink-0 lg:w-[260px]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <Image
                  src={parlamentar.urlFoto}
                  alt={parlamentar.nomeParlamentar}
                  fill
                  sizes="(max-width: 1024px) 100vw, 260px"
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

            <div className="flex-1 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brasil-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brasil-blue">
                  Perfil do parlamentar
                </span>

                <span className="rounded-full border border-brasil-green/10 bg-brasil-green/10 px-3 py-1 text-xs font-medium text-brasil-green">
                  {parlamentar.situacaoMandato ?? parlamentar.situacao}
                </span>

                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  Dados híbridos: backend + mock
                </span>
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                  {parlamentar.nomeParlamentar}
                </h1>
                <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
                  {profile.subtitulo}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 font-medium text-slate-700">
                  {parlamentar.cargo ?? 'Parlamentar'}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 font-medium text-slate-700">
                  {parlamentar.siglaPartido} · {parlamentar.uf}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 font-medium text-slate-700">
                  {parlamentar.casaLegislativa ?? 'Poder Legislativo'}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 font-medium text-slate-700">
                  {parlamentar.legislatura ?? 'Legislatura atual'}
                </span>
              </div>

              <p className="max-w-3xl text-base leading-7 text-slate-600">{profile.resumo}</p>
            </div>
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Contato e identificação</h2>

          <div className="mt-5 space-y-4 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-brasil-blue" />
              <div>
                <p className="font-semibold text-slate-900">E-mail institucional</p>
                <a href={`mailto:${parlamentar.email}`} className="hover:text-brasil-blue">
                  {parlamentar.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-brasil-blue" />
              <div>
                <p className="font-semibold text-slate-900">Telefone do gabinete</p>
                <p>{parlamentar.gabinete.telefone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-brasil-blue" />
              <div>
                <p className="font-semibold text-slate-900">Gabinete</p>
                <p>
                  {parlamentar.gabinete.predio} · Sala {parlamentar.gabinete.sala}
                </p>
              </div>
            </div>
          </div>

          {parlamentar.redesSociais.length > 0 && (
            <div className="mt-6 border-t border-slate-200 pt-5">
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