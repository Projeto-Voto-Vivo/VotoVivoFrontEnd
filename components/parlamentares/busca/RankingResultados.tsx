import Image from 'next/image';
import Link from 'next/link';
import { Info } from 'lucide-react';
import { ItemRanking, RankingParlamentares, SinalCriterioRanking } from '@/types';
import { formatCurrency } from '@/components/parlamentares/profile/shared/formatters';

interface RankingResultadosProps {
  ranking: RankingParlamentares;
  /** Monta o link de outra página preservando os critérios da busca. */
  hrefPagina: (pagina: number) => string;
}

const NOME_CRITERIO: Record<string, string> = {
  tema: 'Assunto',
  funcaoEmenda: 'Área da emenda',
  destinoEmenda: 'Destino da emenda',
  comissao: 'Comissão',
};

function nomeCriterio(criterio: string) {
  return NOME_CRITERIO[criterio] ?? criterio;
}

/**
 * O valor bruto por trás da pontuação.
 *
 * A nota é relativa ao grupo comparado; o valor bruto não é. Mostrar os dois
 * lado a lado é o que permite ao leitor conferir de onde veio o primeiro
 * lugar — e comparar entre duas buscas diferentes, o que a nota não permite.
 */
function descreverSinal(sinal: SinalCriterioRanking) {
  if (sinal.unidade === 'reais_empenhados') {
    return `${formatCurrency(sinal.valor)} empenhados`;
  }

  if (sinal.unidade === 'proposicoes') {
    return `${sinal.valor} ${sinal.valor === 1 ? 'proposição' : 'proposições'}`;
  }

  if (sinal.unidade === 'participacao') {
    return sinal.detalhe || 'Membro';
  }

  return String(sinal.valor);
}

function CartaoRanking({ item, posicao }: { item: ItemRanking; posicao: number }) {
  const criterios = Object.entries(item.criterios);
  const parcial = item.criteriosAtendidos < item.criteriosPedidos;

  return (
    <Link
      href={`/parlamentares/${item.id}`}
      className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-brasil-blue/40 hover:shadow-md"
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-bold tabular-nums text-slate-400">
          {posicao}º
        </span>
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          {item.urlFoto ? (
            <Image
              src={item.urlFoto}
              alt={item.nomeParlamentar}
              fill
              sizes="64px"
              className="object-cover object-top"
              unoptimized
            />
          ) : null}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <p className="truncate text-base font-bold text-slate-900">
            {item.nomeParlamentar}
          </p>
          <p className="text-sm font-bold tabular-nums text-brasil-blue">
            {Math.round(item.pontuacao)}
            <span className="text-xs font-medium text-slate-400">/100</span>
          </p>
        </div>

        <p className="mt-0.5 text-xs text-slate-500">
          {item.siglaPartido} · {item.uf}
          {item.cargo ? ` · ${item.cargo}` : ''}
        </p>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brasil-blue"
            style={{ width: `${Math.max(2, Math.min(100, item.pontuacao))}%` }}
            aria-hidden="true"
          />
        </div>

        {/*
          A média sozinha esconde a diferença entre atender um critério com
          folga e atender todos com sobriedade. Quem atende parte do pedido
          precisa aparecer como tal, e não como só um número menor.
        */}
        {item.criteriosPedidos > 1 && (
          <p
            className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
              parcial
                ? 'bg-amber-50 text-amber-700'
                : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            Atende {item.criteriosAtendidos} de {item.criteriosPedidos} critérios
          </p>
        )}

        {criterios.length > 0 && (
          <dl className="mt-3 grid gap-x-4 gap-y-1 sm:grid-cols-2">
            {criterios.map(([chave, sinal]) => (
              <div key={chave} className="flex justify-between gap-3 text-xs">
                <dt className="truncate text-slate-500">
                  {nomeCriterio(chave)}
                </dt>
                <dd className="shrink-0 font-semibold text-slate-700">
                  {sinal ? descreverSinal(sinal) : '—'}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </Link>
  );
}

export function RankingResultados({ ranking, hrefPagina }: RankingResultadosProps) {
  if (ranking.erro) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-800">
        {ranking.erro}
      </div>
    );
  }

  const pesosEmUso = ranking.criterios.filter((criterio) => criterio.peso !== 1);
  const primeiroDaPagina = (ranking.pagina - 1) * 20;

  return (
    <section>
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
        <p>
          <strong className="font-semibold text-slate-900">
            {ranking.comAlgumSinal}
          </strong>{' '}
          de {ranking.candidatos} parlamentares comparados têm alguma atuação no
          que você pediu. Quem não tem nenhuma fica de fora da lista.
        </p>

        {ranking.criterios.length > 0 && (
          <p className="mt-2">
            Critérios:{' '}
            {ranking.criterios
              .map(
                (criterio) =>
                  `${nomeCriterio(criterio.criterio)} = ${criterio.valorPedido}`,
              )
              .join(' · ')}
            {pesosEmUso.length > 0 && (
              <>
                {' '}
                (pesos:{' '}
                {pesosEmUso
                  .map(
                    (criterio) =>
                      `${nomeCriterio(criterio.criterio)} ×${criterio.peso}`,
                  )
                  .join(', ')}
                )
              </>
            )}
          </p>
        )}

        {/*
          Sem este aviso o ranking parece ter considerado tudo que foi pedido, e
          a nota de quem está no topo passa a significar outra coisa.
        */}
        {ranking.criteriosSemResultado.length > 0 && (
          <p className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              Ninguém deste grupo pontuou em{' '}
              {ranking.criteriosSemResultado.map(nomeCriterio).join(', ')}. Ou o
              valor está escrito de um jeito que não existe na base, ou de fato
              não há atuação registrada — a ordem abaixo saiu dos outros
              critérios.
            </span>
          </p>
        )}

        <p className="mt-3 text-xs leading-5 text-slate-500">
          A nota vai de 0 a 100 dentro deste grupo: o primeiro colocado de cada
          critério marca 100 por construção. Mudar os campos de partido, casa ou
          UF muda todas as notas. Para comparar entre buscas diferentes, use os
          valores brutos ao lado de cada critério.
        </p>
      </div>

      {ranking.data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm leading-6 text-slate-500">
          Ninguém no grupo comparado tem atuação registrada no que você pediu.
          Tente um critério mais amplo, ou tire um dos filtros de partido, casa
          e UF.
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {ranking.data.map((item, indice) => (
            <CartaoRanking
              key={item.id}
              item={item}
              posicao={primeiroDaPagina + indice + 1}
            />
          ))}
        </div>
      )}

      {ranking.totalPaginas > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-3">
          <Link
            href={hrefPagina(Math.max(1, ranking.pagina - 1))}
            aria-disabled={ranking.pagina <= 1}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${
              ranking.pagina <= 1
                ? 'pointer-events-none border border-slate-200 text-slate-300'
                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Anterior
          </Link>

          <span className="text-sm text-slate-500">
            {ranking.pagina} / {ranking.totalPaginas}
          </span>

          <Link
            href={hrefPagina(Math.min(ranking.totalPaginas, ranking.pagina + 1))}
            aria-disabled={ranking.pagina >= ranking.totalPaginas}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${
              ranking.pagina >= ranking.totalPaginas
                ? 'pointer-events-none border border-slate-200 text-slate-300'
                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Próxima
          </Link>
        </nav>
      )}
    </section>
  );
}
