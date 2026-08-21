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
 * o lado da barra e o número ao lado carregam a informação.
 */
const COR_SIM = 'var(--color-voto-sim)';
const COR_NAO = 'var(--color-voto-nao)';

function BarraDivergente({
  tema,
  escala,
}: {
  tema: TemaVotado;
  escala: number;
}) {
  // Percentual dentro da metade correspondente: no maior valor da escala, o
  // braço preenche a metade inteira. A escala é uma só para os dois lados.
  const larguraNao = escala > 0 ? (tema.votosNao / escala) * 100 : 0;
  const larguraSim = escala > 0 ? (tema.votosSim / escala) * 100 : 0;

  return (
    <li className="group relative py-2">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <span className="truncate text-sm font-medium text-slate-700">
          {tema.tema}
        </span>
        <span className="shrink-0 text-xs text-slate-400">
          {tema.totalVotos} {tema.totalVotos === 1 ? 'voto' : 'votos'}
        </span>
      </div>

      <div className="flex h-5 items-center" aria-hidden="true">
        {/* Braço NÃO: cresce da linha central para a esquerda. */}
        <div className="flex w-1/2 items-center justify-end gap-2">
          {tema.votosNao > 0 ? (
            <span className="text-xs font-semibold tabular-nums text-slate-600">
              {tema.votosNao}
            </span>
          ) : null}
          <div className="h-3 w-full">
            <div
              className="ml-auto h-full rounded-l-[4px]"
              style={{
                width: `${larguraNao}%`,
                background: COR_NAO,
              }}
            />
          </div>
        </div>

        {/* Folga de 2px em cada lado da linha central separa os dois preenchimentos. */}
        <div className="mx-[2px] h-5 w-px shrink-0 bg-slate-300" />

        <div className="flex w-1/2 items-center gap-2">
          <div className="h-3 w-full">
            <div
              className="h-full rounded-r-[4px]"
              style={{
                width: `${larguraSim}%`,
                background: COR_SIM,
              }}
            />
          </div>
          {tema.votosSim > 0 ? (
            <span className="text-xs font-semibold tabular-nums text-slate-600">
              {tema.votosSim}
            </span>
          ) : null}
        </div>
      </div>

      {/* Detalhe no hover: o que não cabe direto na linha. */}
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
      </div>

      {/* Leitura para quem usa leitor de tela — a barra é decorativa. */}
      <span className="sr-only">
        {tema.tema}: {tema.votosSim} votos SIM e {tema.votosNao} votos NÃO, em{' '}
        {tema.totalVotos} votos registrados.
      </span>
    </li>
  );
}

function DestaqueTema({
  rotulo,
  tema,
  quantidade,
  cor,
}: {
  rotulo: string;
  tema: string;
  quantidade: number;
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
        {quantidade} {quantidade === 1 ? 'voto' : 'votos'}
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

  // Ordena por saldo: mais SIM no topo, mais NÃO embaixo. O conjunto já vem
  // filtrado pelos temas de maior volume, então nenhum tema irrelevante sobe
  // ao topo por ter 2 votos.
  const ordenados = [...perfil.temasVotados].sort((a, b) => b.saldo - a.saldo);

  // Uma escala só para os dois lados — dois eixos fariam as barras mentirem.
  const escala = Math.max(
    ...perfil.temasVotados.map((tema) => Math.max(tema.votosSim, tema.votosNao)),
    1,
  );

  const maisSim = [...perfil.temasVotados].sort((a, b) => b.votosSim - a.votosSim)[0];
  const maisNao = [...perfil.temasVotados].sort((a, b) => b.votosNao - a.votosNao)[0];
  const totalExcluidos =
    perfil.excluidos.semProposicao + perfil.excluidos.emProposicaoSemTema;

  return (
    <SectionShell
      icon={<Tags className="h-6 w-6" />}
      title="Temas dos votos"
      description="Como o parlamentar votou nas proposições de cada tema, entre os temas em que mais se posicionou."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {maisSim && maisSim.votosSim > 0 ? (
          <DestaqueTema
            rotulo="Mais votos SIM"
            tema={maisSim.tema}
            quantidade={maisSim.votosSim}
            cor={COR_SIM}
          />
        ) : null}
        {maisNao && maisNao.votosNao > 0 ? (
          <DestaqueTema
            rotulo="Mais votos NÃO"
            tema={maisNao.tema}
            quantidade={maisNao.votosNao}
            cor={COR_NAO}
          />
        ) : null}
      </div>

      {/* Legenda: com duas séries ela é obrigatória — a cor sozinha não identifica. */}
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
          <BarraDivergente key={tema.tema} tema={tema} escala={escala} />
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
            votar a favor do texto. Os números abaixo são o voto registrado, não
            uma posição sobre o assunto.
          </span>
        </p>

        <p>
          Uma proposição pode ter mais de um tema e conta em cada um, então a
          soma das linhas é maior que o total de votos.
          {totalExcluidos > 0 ? (
            <>
              {' '}
              Outros {totalExcluidos} votos ficaram de fora por serem em
              requerimentos e questões de ordem, sem proposição, ou em
              proposições sem tema registrado.
            </>
          ) : null}
        </p>
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
                <th scope="col" className="px-3 py-2 text-right font-semibold">SIM</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">NÃO</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">Abst.</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">Obstr.</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {ordenados.map((tema) => (
                <tr key={tema.tema} className="border-b border-slate-100">
                  <td className="px-3 py-2 text-slate-700">{tema.tema}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{tema.votosSim}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{tema.votosNao}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{tema.abstencoes}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{tema.obstrucoes}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{tema.totalVotos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </SectionShell>
  );
}
