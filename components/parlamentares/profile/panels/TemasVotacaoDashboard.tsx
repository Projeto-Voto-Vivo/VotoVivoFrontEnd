'use client';

import { useEffect, useState } from 'react';
import { Info, Loader2, Tags } from 'lucide-react';
import { AlinhamentoDoTema, AlinhamentoPorTema } from '@/types';
import { getAlinhamentoPorTema } from '@/services/parlamentares';
import { SectionShell } from '../shared/SectionShell';

interface TemasVotacaoDashboardProps {
  parlamentarId: number;
}

const COR_FIDELIDADE = 'var(--color-fidelidade)';

/**
 * Fidelidade ao partido, tema a tema.
 *
 * A leitura toda é o contraste com a taxa geral: "61% em meio ambiente" não diz
 * nada sozinho; ao lado de "88% no mandato", diz que ali ele se descola. Por
 * isso a régua aparece como linha de referência em cada barra, e não só como
 * número solto no topo.
 */
function LinhaTema({
  tema,
  referencia,
}: {
  tema: AlinhamentoDoTema;
  referencia: number | null;
}) {
  const semTaxa = tema.taxa === null;
  const largura = semTaxa ? 0 : Math.min(100, Math.max(0, tema.taxa as number));

  // Quanto o tema se afasta da régua. Só faz sentido com as duas taxas.
  const desvio = !semTaxa && referencia !== null ? (tema.taxa as number) - referencia : null;

  return (
    <li className="group relative py-3">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="truncate text-sm font-medium text-slate-700">{tema.tema}</span>
        <span className="shrink-0 text-xs text-slate-400">
          {tema.consideradas} {tema.consideradas === 1 ? 'votação' : 'votações'}
        </span>
      </div>

      {semTaxa ? (
        <p className="text-xs leading-5 text-slate-500">
          {tema.consideradas} comparações — abaixo das {tema.minimoParaTaxa} que
          uma porcentagem precisa para significar algo aqui.
        </p>
      ) : (
        <div className="flex items-center gap-3">
          <div className="relative h-3 flex-1 rounded-full bg-slate-100">
            <div
              className="h-full rounded-full"
              style={{ width: `${largura}%`, background: COR_FIDELIDADE }}
              aria-hidden="true"
            />

            {/* A régua: taxa do mandato inteiro, sob o mesmo recorte. */}
            {referencia !== null ? (
              <span
                className="absolute -top-1 h-5 w-0.5 bg-slate-500"
                style={{ left: `${Math.min(100, Math.max(0, referencia))}%` }}
                aria-hidden="true"
              />
            ) : null}
          </div>

          <span className="w-10 shrink-0 text-right text-xs font-semibold tabular-nums text-slate-600">
            {tema.taxa}%
          </span>
        </div>
      )}

      <div className="pointer-events-none absolute left-1/2 top-full z-20 hidden w-64 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-3 text-xs leading-5 shadow-lg group-hover:block">
        <p className="font-bold text-slate-900">{tema.tema}</p>
        <dl className="mt-2 space-y-1 text-slate-600">
          <div className="flex justify-between gap-4">
            <dt>Seguiu o partido</dt>
            <dd className="font-semibold tabular-nums">{tema.seguiu}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Divergiu</dt>
            <dd className="font-semibold tabular-nums">{tema.divergiu}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Comparações</dt>
            <dd className="tabular-nums">{tema.consideradas}</dd>
          </div>
          {tema.liberadas > 0 ? (
            <div className="flex justify-between gap-4">
              <dt>Bancada liberada</dt>
              <dd className="tabular-nums">{tema.liberadas}</dd>
            </div>
          ) : null}
        </dl>

        {desvio !== null && Math.abs(desvio) >= 1 ? (
          <p className="mt-2 border-t border-slate-100 pt-2 text-slate-500">
            {Math.abs(Math.round(desvio))} pontos{' '}
            {desvio > 0 ? 'acima' : 'abaixo'} da taxa geral dele.
          </p>
        ) : null}
      </div>

      <span className="sr-only">
        {tema.tema}:{' '}
        {semTaxa
          ? `${tema.consideradas} comparações, poucas para uma taxa`
          : `seguiu o partido em ${tema.taxa}% de ${tema.consideradas} votações`}
        .
      </span>
    </li>
  );
}

export function TemasVotacaoDashboard({ parlamentarId }: TemasVotacaoDashboardProps) {
  const [dados, setDados] = useState<AlinhamentoPorTema | null>(null);

  useEffect(() => {
    let cancelado = false;

    getAlinhamentoPorTema(parlamentarId).then((resultado) => {
      if (!cancelado) setDados(resultado);
    });

    return () => {
      cancelado = true;
    };
  }, [parlamentarId]);

  if (!dados) {
    return (
      <SectionShell icon={<Tags className="h-6 w-6" />} title="Fidelidade por tema">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-brasil-blue">
          <Loader2 className="h-4 w-4 animate-spin" />
          Calculando
        </div>
      </SectionShell>
    );
  }

  if (!dados.carregado || !dados.disponivel || dados.temas.length === 0) {
    return (
      <SectionShell icon={<Tags className="h-6 w-6" />} title="Fidelidade por tema">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-500">
          {!dados.carregado
            ? 'Não conseguimos calcular agora. Tente novamente em alguns instantes.'
            : !dados.disponivel
              ? 'Não disponível para senadores — só a Câmara publica orientação de bancada.'
              : 'Não há votações com orientação de bancada suficientes para separar por tema.'}
        </div>
      </SectionShell>
    );
  }

  /*
   * A API ordena por número de comparações — o topo dela é onde há mais
   * evidência. Aqui reordenamos por taxa, que é a leitura pedida ("onde ele
   * mais e menos segue o partido"), mantendo o número de comparações visível em
   * cada linha. Temas sem taxa vão para o fim: não competem com quem tem.
   */
  const comTaxa = dados.temas.filter((tema) => tema.taxa !== null);
  const semTaxa = dados.temas.filter((tema) => tema.taxa === null);
  const ordenados = [
    ...[...comTaxa].sort((a, b) => (b.taxa as number) - (a.taxa as number)),
    ...semTaxa,
  ];

  const referencia = dados.geral.taxa;
  const maisFiel = comTaxa.length > 0 ? ordenados[0] : null;
  const menosFiel =
    comTaxa.length > 1 ? ordenados[comTaxa.length - 1] : null;
  const totalExcluidos =
    dados.excluidos.semProposicao + dados.excluidos.emProposicaoSemTema;

  return (
    <SectionShell
      icon={<Tags className="h-6 w-6" />}
      title="Fidelidade por tema"
      description="Com que frequência o parlamentar seguiu a orientação do partido em cada assunto."
    >
      {referencia !== null ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Taxa geral do mandato
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{referencia}%</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            É a régua: a marca escura em cada barra abaixo mostra onde este
            número cai, para dar para ver de relance em que assuntos ele se
            descola do próprio padrão.
          </p>
        </div>
      ) : null}

      {maisFiel && menosFiel && maisFiel.tema !== menosFiel.tema ? (
        <div className="mt-3 grid gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Mais alinhado
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900">
              {maisFiel.tema} · {maisFiel.taxa}%
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Onde mais diverge
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900">
              {menosFiel.tema} · {menosFiel.taxa}%
            </p>
          </div>
        </div>
      ) : null}

      <ul className="mt-4 divide-y divide-slate-100">
        {ordenados.map((tema) => (
          <LinhaTema key={tema.tema} tema={tema} referencia={referencia} />
        ))}
      </ul>

      <div className="mt-6 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-500">
        <p className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            A taxa compara o voto com a orientação da bancada do partido{' '}
            <strong className="font-semibold text-slate-700">
              na data da votação
            </strong>
            . Votação em que o partido liberou a bancada fica de fora: sem
            orientação, não há o que seguir.
          </span>
        </p>

        <p>
          Uma proposição pode ter mais de um tema e o voto conta em cada um, então
          a soma dos temas passa do total do mandato.
          {dados.apenasMerito
            ? ' Só entram votações que decidem conteúdo — requerimento de urgência e redação final ficam fora.'
            : ''}
          {totalExcluidos > 0
            ? ` Outros ${totalExcluidos} votos ficaram de fora por serem em requerimentos, sem proposição, ou em proposições sem tema.`
            : ''}
        </p>

        {dados.temasComparados > dados.temas.length ? (
          <p>
            Mostrando {dados.temas.length} dos {dados.temasComparados} temas com
            comparação, os de maior volume.
          </p>
        ) : null}
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer list-none text-sm font-semibold text-brasil-blue">
          Ver os números em tabela
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-left text-slate-700">
                <th scope="col" className="px-3 py-2 font-semibold">Tema</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">Taxa</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">Seguiu</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">Divergiu</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">Comparações</th>
              </tr>
            </thead>
            <tbody>
              {ordenados.map((tema) => (
                <tr key={tema.tema} className="border-b border-slate-100">
                  <td className="px-3 py-2 text-slate-700">{tema.tema}</td>
                  <td className="px-3 py-2 text-right font-semibold tabular-nums">
                    {tema.taxa === null ? '—' : `${tema.taxa}%`}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">{tema.seguiu}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{tema.divergiu}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{tema.consideradas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </SectionShell>
  );
}
