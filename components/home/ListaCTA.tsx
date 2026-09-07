import Link from 'next/link';
import { Users } from 'lucide-react';

export function ListaCTA() {
  return (
    <section className="bg-slate-50 py-10 md:py-12">
      <div className="container mx-auto px-4">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-brasil-green via-brasil-yellow to-brasil-blue" />

          <div className="flex flex-col items-center gap-6 p-6 text-center md:flex-row md:justify-between md:p-8 md:text-left">
            <div className="flex items-center gap-4">
              <div className="hidden rounded-2xl bg-brasil-blue/10 p-3 md:block">
                <Users className="h-6 w-6 text-brasil-blue" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 md:text-xl">
                  Explore todos os parlamentares em exercício
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Acesse perfis completos com votações, despesas e emendas.
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
              <Link
                href="/parlamentares"
                className="rounded-xl bg-brasil-blue px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-90"
              >
                Ver lista completa
              </Link>
              <Link
                href="/parlamentares?tipo=deputados"
                className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:border-brasil-blue hover:text-brasil-blue"
              >
                Deputados
              </Link>
              <Link
                href="/parlamentares?tipo=senadores"
                className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:border-brasil-blue hover:text-brasil-blue"
              >
                Senadores
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
