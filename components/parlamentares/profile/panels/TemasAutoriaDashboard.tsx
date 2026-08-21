'use client';

import { useEffect, useState } from 'react';
import { Info, Loader2, PenLine } from 'lucide-react';
import { PerfilTematico, TemaAutoria } from '@/types';
import { getPerfilTematicoParlamentar } from '@/services/parlamentares';
import { SectionShell } from '../shared/SectionShell';

interface TemasAutoriaDashboardProps {
  parlamentarId: number;
}

/**
 * Cor própria, fora da família de voto: se a barra de autoria fosse azul de
 * SIM, "assinou 40 proposições de Saúde" leria como "votou SIM 40 vezes".
 */
const COR_AUTORIA = 'var(--color-tema-autoria)';

/**
 * Aqui a pergunta é de magnitude — "em quais temas ele mais legisla" —, e não
 * de proporção como no painel de votos. Contagem é a resposta certa: não existe
 * um "todo" de que a autoria seja parte, porque uma proposição com três temas
 * conta em cada um deles.
 */
function LinhaAutoria({ tema, escala }: { tema: TemaAutoria; escala: number }) {
  const largura = escala > 0 ? (tema.total / escala) * 100 : 0;

  return (
    <li className="group relative py-2">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <span className="truncate text-sm font-medium text-slate-700">{tema.tema}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-3 flex-1">
          <div
            className="h-full rounded-r-[4px]"
            style={{ width: `${largura}%`, background: COR_AUTORIA }}
            aria-hidden="true"
          />
        </div>

        <span className="w-12 shrink-0 text-right text-xs font-semibold tabular-nums text-slate-600">
          {tema.total}
        </span>
      </div>

      <span className="sr-only">
        {tema.tema}: {tema.total}{' '}
        {tema.total === 1 ? 'proposição' : 'proposições'}.
      </span>
    </li>
  );
}

export function TemasAutoriaDashboard({ parlamentarId }: TemasAutoriaDashboardProps) {
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
      <SectionShell icon={<PenLine className="h-6 w-6" />} title="Temas das proposições">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-brasil-blue">
          <Loader2 className="h-4 w-4 animate-spin" />
          Carregando temas
        </div>
      </SectionShell>
    );
  }

  if (!perfil.disponivel || perfil.temasAutoria.length === 0) {
    return (
      <SectionShell icon={<PenLine className="h-6 w-6" />} title="Temas das proposições">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-500">
          {!perfil.disponivel
            ? 'Não conseguimos carregar os temas agora. Tente novamente em alguns instantes.'
            : perfil.totalProposicoes > 0
              ? 'As proposições deste parlamentar ainda não têm tema registrado na fonte oficial.'
              : 'Nenhuma proposição de autoria deste parlamentar foi encontrada.'}
        </div>
      </SectionShell>
    );
  }

  const ordenados = [...perfil.temasAutoria].sort((a, b) => b.total - a.total);
  const escala = Math.max(...ordenados.map((tema) => tema.total), 1);
  const principal = ordenados[0];

  return (
    <SectionShell
      icon={<PenLine className="h-6 w-6" />}
      title="Temas das proposições"
      description="Em quais assuntos o parlamentar mais assina proposições."
    >
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: COR_AUTORIA }}
            aria-hidden="true"
          />
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Tema com mais proposições
          </p>
        </div>
        <p className="mt-2 text-base font-bold leading-6 text-slate-900">
          {principal.tema}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {principal.total} de {perfil.totalProposicoes}{' '}
          {perfil.totalProposicoes === 1 ? 'proposição' : 'proposições'} de autoria
        </p>
      </div>

      <ul className="mt-5 divide-y divide-slate-100">
        {ordenados.map((tema) => (
          <LinhaAutoria key={tema.tema} tema={tema} escala={escala} />
        ))}
      </ul>

      <div className="mt-6 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-500">
        <p className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            Uma proposição pode ter mais de um tema e conta em cada um deles —
            por isso a soma das linhas passa das {perfil.totalProposicoes}{' '}
            proposições de autoria. Não são fatias de um bolo.
          </span>
        </p>

        {perfil.proposicoesSemTema > 0 ? (
          <p>
            Outras {perfil.proposicoesSemTema}{' '}
            {perfil.proposicoesSemTema === 1 ? 'proposição' : 'proposições'} não
            aparecem aqui por não ter tema registrado na fonte oficial.
          </p>
        ) : null}

        <p>
          Autoria não distingue quem propôs de quem apenas assinou junto: a base
          registra os dois do mesmo jeito.
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
                <th scope="col" className="px-3 py-2 text-right font-semibold">
                  Proposições
                </th>
              </tr>
            </thead>
            <tbody>
              {ordenados.map((tema) => (
                <tr key={tema.tema} className="border-b border-slate-100">
                  <td className="px-3 py-2 text-slate-700">{tema.tema}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{tema.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </SectionShell>
  );
}
