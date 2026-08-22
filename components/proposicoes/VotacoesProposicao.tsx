import { Info, Vote } from 'lucide-react';
import { PlacarVotacao, VotacaoProposicao } from '@/types';
import { SectionShell } from '@/components/parlamentares/profile/shared/SectionShell';
import { formatDate } from '@/components/parlamentares/profile/shared/formatters';

interface VotacoesProposicaoProps {
  votacoes: VotacaoProposicao[];
}

/**
 * Só "Sim" e "Não" decidem a votação. Obstrução e ausências entram na barra
 * porque explicam o quórum, mas em cinza — não são posição sobre o mérito.
 *
 * Sim é azul, e não verde: verde↔vermelho fica a ΔE 5,1 na visão
 * deuteranômala, indistinguível para ~1 em cada 12 homens. Os tokens
 * `--color-voto-*` são a fonte única dessas cores, já validada.
 */
const FAIXAS: {
  chave: keyof Omit<PlacarVotacao, 'total'>;
  rotulo: string;
  cor: string;
}[] = [
  { chave: 'sim', rotulo: 'Sim', cor: 'var(--color-voto-sim)' },
  { chave: 'nao', rotulo: 'Não', cor: 'var(--color-voto-nao)' },
  { chave: 'abstencao', rotulo: 'Abstenção', cor: 'var(--color-voto-abstencao)' },
  { chave: 'obstrucao', rotulo: 'Obstrução', cor: 'var(--color-voto-obstrucao)' },
  {
    chave: 'ausenciaJustificada',
    rotulo: 'Ausência justificada',
    cor: 'var(--color-voto-ausencia-justificada)',
  },
  { chave: 'ausente', rotulo: 'Ausente', cor: 'var(--color-voto-ausente)' },
  {
    chave: 'naoRegistrado',
    rotulo: 'Não registrado',
    cor: 'var(--color-voto-nao-registrado)',
  },
];

function Placar({ placar }: { placar: PlacarVotacao }) {
  const faixasComVoto = FAIXAS.filter((faixa) => placar[faixa.chave] > 0);

  return (
    <div className="mt-4">
      {/* Folga de 2px entre os segmentos: sem ela, duas faixas viram uma. */}
      <div className="flex h-3 gap-[2px] overflow-hidden rounded-full bg-slate-100">
        {faixasComVoto.map((faixa) => (
          <div
            key={faixa.chave}
            style={{
              width: `${(placar[faixa.chave] / placar.total) * 100}%`,
              background: faixa.cor,
            }}
            title={`${faixa.rotulo}: ${placar[faixa.chave]}`}
          />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {faixasComVoto.map((faixa) => (
          <span
            key={faixa.chave}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: faixa.cor }}
              aria-hidden="true"
            />
            {faixa.rotulo}: <strong className="text-slate-900">{placar[faixa.chave]}</strong>
          </span>
        ))}
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
          {placar.total} votos registrados
        </span>
      </div>
    </div>
  );
}

export function VotacoesProposicao({ votacoes }: VotacoesProposicaoProps) {
  return (
    <SectionShell
      icon={<Vote className="h-6 w-6" />}
      title="Votações"
      description="Deliberações nominais e simbólicas registradas para esta proposição."
    >
      {votacoes.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-500">
          Nenhuma votação registrada para esta proposição. Boa parte das
          proposições é arquivada ou fica em análise sem chegar a voto.
        </div>
      ) : (
        <div className="space-y-4">
          {votacoes.map((votacao) => (
            <article
              key={votacao.id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-brasil-blue">
                    {votacao.tipo}
                    {votacao.orgao
                      ? ` · ${votacao.orgao.sigla ?? votacao.orgao.nome}`
                      : votacao.casa
                        ? ` · ${votacao.casa}`
                        : ''}
                  </p>
                  {votacao.orgao?.nome && votacao.orgao.nome !== votacao.orgao.sigla ? (
                    <p className="text-xs text-slate-500">{votacao.orgao.nome}</p>
                  ) : null}
                  <h3 className="mt-1 text-base font-bold leading-6 text-slate-900">
                    {votacao.resumo}
                  </h3>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  {votacao.data ? (
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                      {formatDate(votacao.data)}
                    </span>
                  ) : null}
                  <span className="rounded-full bg-brasil-blue/10 px-3 py-1 text-xs font-bold text-brasil-blue">
                    {votacao.resultado}
                  </span>
                </div>
              </div>

              {votacao.placar ? (
                <Placar placar={votacao.placar} />
              ) : (
                <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-slate-500">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  Sem votos individuais registrados — típico de votação
                  simbólica, em que a casa aprova sem registrar voto a voto.
                </p>
              )}

              {votacao.orientacoes.length > 0 && (
                <details className="group mt-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-brasil-blue">
                    Orientação das bancadas ({votacao.orientacoes.length})
                  </summary>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {votacao.orientacoes.map((orientacao) => (
                      <span
                        key={`${votacao.id}-${orientacao.bancada}`}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
                      >
                        <strong className="text-slate-900">{orientacao.bancada}</strong>:{' '}
                        {orientacao.orientacao}
                      </span>
                    ))}
                  </div>
                </details>
              )}
            </article>
          ))}
        </div>
      )}
    </SectionShell>
  );
}
