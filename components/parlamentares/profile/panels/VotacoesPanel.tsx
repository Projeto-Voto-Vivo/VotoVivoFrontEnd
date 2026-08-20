'use client';

import { useEffect, useState } from 'react';
import { BadgeCheck, ChevronLeft, ChevronRight, Info, Loader2, Vote } from 'lucide-react';
import { ParlamentarPerfil, PresencaDetalhe, VotacaoPerfil } from '@/types';
import { getVotacoesParlamentar, VOTO_EXPLICACOES } from '@/services/parlamentares';
import { MicroInfoCard } from '../shared/MicroInfoCard';
import { SectionShell } from '../shared/SectionShell';
import { formatDate } from '../shared/formatters';

interface VotacoesPanelProps {
  profile: ParlamentarPerfil;
}

function BarraPresenca({ detalhe, titulo }: { detalhe: PresencaDetalhe; titulo: string }) {
  const semDados = detalhe.taxa === null;
  // A barra nunca passa de 100% nem fica negativa, mesmo com dado estranho.
  const largura = semDados ? 0 : Math.min(100, Math.max(0, detalhe.taxa as number));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
        <span>{titulo}</span>
        <span className={semDados ? 'text-slate-400' : undefined}>
          {semDados ? 'Sem dados' : `${detalhe.taxa}%`}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        {semDados ? (
          <div className="h-full w-full rounded-full bg-[repeating-linear-gradient(45deg,#e2e8f0,#e2e8f0_4px,#f8fafc_4px,#f8fafc_8px)]" />
        ) : (
          <div
            className="h-full rounded-full bg-brasil-green"
            style={{ width: `${largura}%` }}
          />
        )}
      </div>

      {semDados ? (
        <p className="mt-2 text-xs leading-5 text-slate-500">
          O backend não informou presença para esta medida. Ausência de dado não
          significa ausência do parlamentar.
        </p>
      ) : (
        <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">
            Eventos considerados: {detalhe.totalEventos}
          </span>
          <span className="rounded-full bg-red-50 px-3 py-1 text-red-600">
            Ausências: {detalhe.faltas}
          </span>
        </div>
      )}

      {detalhe.metodologia ? (
        <p className="mt-2 text-xs leading-5 text-slate-400">{detalhe.metodologia}</p>
      ) : null}
    </div>
  );
}

export function VotacoesPanel({ profile }: VotacoesPanelProps) {
  const { parlamentar, votacoes: votacoesPerfil } = profile;
  const [votacoes, setVotacoes] = useState<VotacaoPerfil[]>(votacoesPerfil.destaques);
  const [paginaAtual, setPaginaAtual] = useState(votacoesPerfil.paginaAtual || 1);
  const [totalPaginas, setTotalPaginas] = useState(votacoesPerfil.totalPaginas || 1);
  const [totalRegistros, setTotalRegistros] = useState(
    votacoesPerfil.totalRegistros || votacoesPerfil.destaques.length,
  );
  // Tamanho de página informado pelo backend (`meta.limit`), não um literal.
  const [itensPorPagina, setItensPorPagina] = useState(
    votacoesPerfil.itensPorPagina || votacoesPerfil.destaques.length || 1,
  );
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('votovivo:loading', {
        detail: { active: carregando, timeoutMs: 15000 },
      }),
    );

    return () => {
      window.dispatchEvent(
        new CustomEvent('votovivo:loading', { detail: { active: false } }),
      );
    };
  }, [carregando]);

  async function carregarPagina(novaPagina: number) {
    if (
      novaPagina < 1 ||
      novaPagina > totalPaginas ||
      novaPagina === paginaAtual ||
      carregando
    ) {
      return;
    }

    setCarregando(true);

    try {
      const response = await getVotacoesParlamentar(parlamentar.id, novaPagina);
      setVotacoes(response.data);
      setPaginaAtual(response.meta.page);
      setTotalPaginas(response.meta.lastPage);
      setTotalRegistros(response.meta.total);
      setItensPorPagina(response.meta.limit);
    } finally {
      setCarregando(false);
    }
  }

  const inicioPagina = votacoes.length ? (paginaAtual - 1) * itensPorPagina + 1 : 0;
  const fimPagina = votacoes.length
    ? Math.min(inicioPagina + votacoes.length - 1, totalRegistros)
    : 0;

  const presenca = votacoesPerfil.presenca;
  const alinhamento = votacoesPerfil.alinhamento;

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <SectionShell icon={<Vote className="h-6 w-6" />} title="Votações">
        {carregando && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brasil-blue/10 bg-brasil-blue/5 px-4 py-2 text-sm font-semibold text-brasil-blue" aria-live="polite">
            <Loader2 className="h-4 w-4 animate-spin" />
            Atualizando votações
          </div>
        )}

        {votacoes.length > 0 ? (
          <div className="space-y-4">
            {votacoes.map((votacao) => (
              <article
                key={votacao.id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-brasil-blue">
                      {votacao.titulo}
                      {votacao.casa ? ` · ${votacao.casa}` : ''}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                      {votacao.descricao}
                    </h3>
                    {votacao.resumo && votacao.resumo !== votacao.descricao ? (
                      <p className="mt-2 text-sm leading-6 text-slate-600">{votacao.resumo}</p>
                    ) : null}
                  </div>
                  {votacao.data ? (
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                      {formatDate(votacao.data)}
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <MicroInfoCard label="Voto do parlamentar" value={votacao.voto} />
                  <MicroInfoCard label="Resultado" value={votacao.resultado} />
                  <MicroInfoCard
                    label={
                      votacao.siglaPartidoNaData
                        ? `Orientação do ${votacao.siglaPartidoNaData}`
                        : 'Orientação do partido'
                    }
                    value={votacao.orientacaoPartido ?? 'Sem orientação registrada'}
                  />
                </div>

                {VOTO_EXPLICACOES[votacao.voto] ? (
                  <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-500">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {VOTO_EXPLICACOES[votacao.voto]}
                  </p>
                ) : null}

                {votacao.seguiuOrientacao !== null ? (
                  <p
                    className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      votacao.seguiuOrientacao
                        ? 'bg-brasil-green/10 text-brasil-green'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {votacao.seguiuOrientacao
                      ? 'Seguiu a orientação do partido'
                      : 'Votou contra a orientação do partido'}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-500">
            Nenhuma votação registrada foi encontrada para este parlamentar.
          </div>
        )}

        {totalRegistros > 0 && (
          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              {inicioPagina}–{fimPagina} de {totalRegistros} votações
            </p>

            {totalPaginas > 1 && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => carregarPagina(paginaAtual - 1)}
                  disabled={paginaAtual <= 1 || carregando}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brasil-blue hover:text-brasil-blue disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() => carregarPagina(paginaAtual + 1)}
                  disabled={paginaAtual >= totalPaginas || carregando}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brasil-blue hover:text-brasil-blue disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Próxima
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </SectionShell>

      <SectionShell icon={<BadgeCheck className="h-6 w-6" />} title="Presença e alinhamento">
        <div className="grid gap-3 md:grid-cols-2">
          <MicroInfoCard
            label="Votações registradas"
            value={String(totalRegistros)}
          />
          <MicroInfoCard
            label="Aderência à orientação do partido"
            value={
              alinhamento === null
                ? 'Sem dados'
                : `${alinhamento}% (${votacoesPerfil.alinhamentoBase} votações comparáveis)`
            }
          />
        </div>

        <div className="mt-6 space-y-6">
          <BarraPresenca detalhe={presenca.plenario} titulo="Presença em plenário" />
          <BarraPresenca detalhe={presenca.comissoes} titulo="Presença em comissões" />
        </div>

        <div className="mt-6 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          <p>{votacoesPerfil.leituraRapida}</p>

          <p className="text-xs leading-5 text-slate-500">
            Plenário e comissão são medidas distintas e não se somam. Câmara e
            Senado apuram presença por metodologias diferentes: as taxas
            {presenca.casa ? ` (aqui, ${presenca.casa})` : ''} não devem ser
            comparadas entre casas.
          </p>

          {presenca.observacao ? (
            <p className="text-xs leading-5 text-slate-500">{presenca.observacao}</p>
          ) : null}
        </div>
      </SectionShell>
    </div>
  );
}
