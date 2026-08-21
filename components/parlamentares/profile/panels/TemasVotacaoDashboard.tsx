'use client';

import { useEffect, useState } from 'react';
import { Info, Loader2, Tags } from 'lucide-react';
import { PerfilTematico, TemaVotado } from '@/types';
import { getPerfilTematicoParlamentar } from '@/services/parlamentares';
import { SectionShell } from '../shared/SectionShell';

interface TemasVotacaoDashboardProps {
  parlamentarId: number;
}

/**
 * Azul = SIM, vermelho = NÃO (tokens `--color-voto-*`).
 *
 * Não é verde/vermelho porque esse par fica a ΔE 5,1 na visão deuteranômala:
 * para ~1 em cada 12 homens as duas barras seriam a mesma barra. Além da cor,
 * o lado do segmento e o percentual ao lado carregam a informação.
 */
const COR_SIM = 'var(--color-voto-sim)';
const COR_NAO = 'var(--color-voto-nao)';

/**
 * Abaixo disto a proporção é ruído: 2 de 3 votos viram "67% SIM" e ficariam
 * lado a lado com um tema de 200 votações. Estes temas continuam na lista —
 * escondê-los seria pior —, mas saem dos destaques e vêm marcados.
 */
const MINIMO_PARA_PROPORCAO = 10;

type TemaComProporcao = TemaVotado & {
  /** Votos com posição de mérito: só SIM e NÃO entram no denominador. */
  posicionados: number;
  percentualSim: number;
  percentualNao: number;
  poucosVotos: boolean;
};

function comProporcao(tema: TemaVotado): TemaComProporcao {
  const posicionados = tema.votosSim + tema.votosNao;
  const percentualSim = posicionados > 0 ? (tema.votosSim / posicionados) * 100 : 0;

  return {
    ...tema,
    posicionados,
    percentualSim,
    percentualNao: 100 - percentualSim,
    poucosVotos: posicionados < MINIMO_PARA_PROPORCAO,
  };
}

function LinhaTema({ tema }: { tema: TemaComProporcao }) {
  return (
    <li className="group relative py-3">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="truncate text-sm font-medium text-slate-700">
          {tema.tema}
        </span>
        <span className="shrink-0 text-xs text-slate-400">
          {tema.posicionados} {tema.posicionados === 1 ? 'voto' : 'votos'}
          {tema.poucosVotos ? ' · poucos votos' : ''}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Percentuais fora da barra: dentro, o segmento pequeno cortaria o rótulo. */}
        <span className="w-10 shrink-0 text-right text-xs font-semibold tabular-nums text-slate-600">
          {Math.round(tema.percentualNao)}%
        </span>

        <div
          className={`flex h-3 flex-1 gap-[2px] ${tema.poucosVotos ? 'opacity-45' : ''}`}
          aria-hidden="true"
        >
          <div
            className="h-full rounded-l-[4px]"
            style={{ width: `${tema.percentualNao}%`, background: COR_NAO }}
          />
          <div
            className="h-full rounded-r-[4px]"
            style={{ width: `${tema.percentualSim}%`, background: COR_SIM }}
          />
        </div>

        <span className="w-10 shrink-0 text-xs font-semibold tabular-nums text-slate-600">
          {Math.round(tema.percentualSim)}%
        </span>
      </div>

      {/* Detalhe no hover: os números absolutos, que a barra normalizada esconde. */}
      <div className="pointer-events-none absolute left-1/2 top-full z-20 hidden w-64 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-3 text-xs leading-5 shadow-lg group-hover:block">
        <p className="font-bold text-slate-900">{tema.tema}</p>
        <dl className="mt-2 space-y-1 text-slate-600">
          <div className="flex justify-between gap-4">
            <dt>Votou SIM</dt>
            <dd className="font-semibold tabular-nums">{tema.votosSim}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Votou NÃO</dt>
            <dd className="font-semibold tabular-nums">{tema.votosNao}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Abstenções</dt>
            <dd className="tabular-nums">{tema.abstencoes}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Obstruções</dt>
            <dd className="tabular-nums">{tema.obstrucoes}</dd>
          </div>
        </dl>
        {tema.poucosVotos ? (
          <p className="mt-2 border-t border-slate-100 pt-2 text-slate-500">
            Poucos votos com posição: o percentual oscila muito e não sustenta
            comparação com os outros temas.
          </p>
        ) : null}
      </div>

      <span className="sr-only">
        {tema.tema}: {Math.round(tema.percentualSim)}% de votos SIM e{' '}
        {Math.round(tema.percentualNao)}% de votos NÃO, em {tema.posicionados}{' '}
        votos com posição.
      </span>
    </li>
  );
}

function DestaqueTema({
  rotulo,
  tema,
  percentual,
  posicionados,
  cor,
}: {
  rotulo: string;
  tema: string;
  percentual: number;
  posicionados: number;
  cor: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: cor }}
          aria-hidden="true"
        />
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {rotulo}
        </p>
      </div>
      <p className="mt-2 text-base font-bold leading-6 text-slate-900">{tema}</p>
      <p className="mt-1 text-xs text-slate-500">
        {Math.round(percentual)}% dos {posicionados} votos com posição
      </p>
    </div>
  );
}

export function TemasVotacaoDashboard({ parlamentarId }: TemasVotacaoDashboardProps) {
  const [perfil, setPerfil] = useState<PerfilTematico | null>(null);

  useEffect(() => {
    let cancelado = false;

    getPerfilTematicoParlamentar(parlamentarId).then((resultado) => {
      if (!cancelado) setPerfil(resultado);
    });

    return () => {
      cancelado = true;
    };
  }, [parlamentarId]);

  if (!perfil) {
    return (
      <SectionShell icon={<Tags className="h-6 w-6" />} title="Temas dos votos">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-brasil-blue">
          <Loader2 className="h-4 w-4 animate-spin" />
          Carregando temas
        </div>
      </SectionShell>
    );
  }

  if (!perfil.disponivel || perfil.temasVotados.length === 0) {
    return (
      <SectionShell icon={<Tags className="h-6 w-6" />} title="Temas dos votos">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-500">
          {perfil.disponivel
            ? 'Não há votos suficientes com tema identificado para montar este panorama.'
            : 'Não conseguimos carregar os temas agora. Tente novamente em alguns instantes.'}
        </div>
      </SectionShell>
    );
  }

  /*
   * Proporção, não contagem.
   *
   * Em números absolutos o gráfico compara volume de pauta, não posição: um
   * tema com 300 votações domina a tela mesmo dividido 51/49, e um tema
   * unânime com 20 votações some. Como cada barra vale 100% dos votos com
   * posição do tema, o que se compara entre linhas é onde fica a divisória.
   */
  const temas = perfil.temasVotados.map(comProporcao).filter((t) => t.posicionados > 0);
  const ordenados = [...temas].sort((a, b) => b.percentualSim - a.percentualSim);

  // Destaques só entre temas com volume suficiente: 100% de 3 votos não é
  // "o tema em que mais apoia".
  const comVolume = temas.filter((tema) => !tema.poucosVotos);
  const maisSim = [...comVolume].sort((a, b) => b.percentualSim - a.percentualSim)[0];
  const maisNao = [...comVolume].sort((a, b) => b.percentualNao - a.percentualNao)[0];

  const totalExcluidos =
    perfil.excluidos.semProposicao + perfil.excluidos.emProposicaoSemTema;
  const temPoucosVotos = temas.some((tema) => tema.poucosVotos);

  return (
    <SectionShell
      icon={<Tags className="h-6 w-6" />}
      title="Temas dos votos"
      description="Proporção de votos SIM e NÃO dentro de cada tema, entre os temas em que o parlamentar mais se posicionou."
    >
      {maisSim && maisNao && maisSim.tema !== maisNao.tema ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <DestaqueTema
            rotulo="Mais votos SIM, proporcionalmente"
            tema={maisSim.tema}
            percentual={maisSim.percentualSim}
            posicionados={maisSim.posicionados}
            cor={COR_SIM}
          />
          <DestaqueTema
            rotulo="Mais votos NÃO, proporcionalmente"
            tema={maisNao.tema}
            percentual={maisNao.percentualNao}
            posicionados={maisNao.posicionados}
            cor={COR_NAO}
          />
        </div>
      ) : null}

      <div className="mt-6 flex items-center justify-center gap-6 text-xs font-medium text-slate-600">
        <span className="inline-flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: COR_NAO }}
            aria-hidden="true"
          />
          Votou NÃO
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: COR_SIM }}
            aria-hidden="true"
          />
          Votou SIM
        </span>
      </div>

      <ul className="mt-4 divide-y divide-slate-100">
        {ordenados.map((tema) => (
          <LinhaTema key={tema.tema} tema={tema} />
        ))}
      </ul>

      <div className="mt-6 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-500">
        <p className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            <strong className="font-semibold text-slate-700">
              Votar SIM não é ser a favor do tema.
            </strong>{' '}
            A votação pode ser sobre o texto principal, sobre um destaque que
            suprime um trecho ou sobre um requerimento de urgência — e o dado não
            distingue qual. Votar NÃO num destaque supressivo, por exemplo, é
            votar a favor do texto. Os percentuais são do voto registrado, não
            uma posição sobre o assunto.
          </span>
        </p>

        <p>
          Cada barra vale 100% dos votos com posição daquele tema — só SIM e NÃO
          entram na conta. Abstenção e obstrução aparecem no detalhe de cada
          linha. Sem essa normalização, o tema mais pautado ocuparia a tela toda
          e o gráfico compararia volume de pauta em vez de posição.
          {temPoucosVotos ? (
            <>
              {' '}
              Temas com menos de {MINIMO_PARA_PROPORCAO} votos com posição estão
              marcados e ficam fora dos destaques: nesse volume o percentual
              oscila demais para comparar.
            </>
          ) : null}
        </p>

        {totalExcluidos > 0 ? (
          <p>
            Uma proposição pode ter mais de um tema e conta em cada um. Outros{' '}
            {totalExcluidos} votos ficaram de fora por serem em requerimentos e
            questões de ordem, sem proposição, ou em proposições sem tema
            registrado.
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
                <th scope="col" className="px-3 py-2 text-right font-semibold">% SIM</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">SIM</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">NÃO</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">Abst.</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">Obstr.</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">Com posição</th>
              </tr>
            </thead>
            <tbody>
              {ordenados.map((tema) => (
                <tr key={tema.tema} className="border-b border-slate-100">
                  <td className="px-3 py-2 text-slate-700">{tema.tema}</td>
                  <td className="px-3 py-2 text-right font-semibold tabular-nums">
                    {Math.round(tema.percentualSim)}%
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">{tema.votosSim}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{tema.votosNao}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{tema.abstencoes}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{tema.obstrucoes}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{tema.posicionados}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </SectionShell>
  );
}
