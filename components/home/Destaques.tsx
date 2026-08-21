import Link from 'next/link';
import { ParlamentarCard } from './ParlamentarCard';
import { getParlamentaresLista } from '@/services/parlamentares';
import { Parlamentar } from '@/types';

export async function Destaques() {
  const { data, meta } = await getParlamentaresLista(1);
  const parlamentares = data ? data.slice(0, 8) : [];

  return (
    <section id="destaques" className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex items-center justify-between">
          <div>
            {/*
              Estes não são "destaques" por nenhum critério de relevância:
              são os primeiros da listagem, em ordem alfabética. O título diz
              exatamente isso enquanto não existe um ranking real no backend.
            */}
            <h2 className="text-2xl font-bold text-slate-900">
              Comece por aqui
            </h2>
            <p className="mt-1 text-slate-500">
              Uma amostra da lista em ordem alfabética
              {meta.total > 0 ? ` — ${meta.total} parlamentares no total` : ''}.
              Use a busca para ir direto a um perfil.
            </p>
          </div>

          <Link
            href="/parlamentares"
            className="flex items-center gap-1 text-sm font-semibold text-brasil-blue hover:underline"
          >
            Ver todos &rarr;
          </Link>
        </div>

        {meta.aviso && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            {meta.aviso}
          </div>
        )}

        {parlamentares.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            Não conseguimos carregar os parlamentares agora. Verifique sua conexão e tente novamente.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {parlamentares.map((parlamentar: Parlamentar) => (
              <ParlamentarCard key={parlamentar.id} parlamentar={parlamentar} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}