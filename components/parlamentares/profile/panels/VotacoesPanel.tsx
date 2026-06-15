'use client';

import { useEffect, useState } from 'react';
import { BadgeCheck, ChevronLeft, ChevronRight, Loader2, Vote } from 'lucide-react';
import { ParlamentarPerfil, VotacaoPerfil } from '@/types';
import { getVotacoesParlamentar } from '@/services/parlamentares';
import { MicroInfoCard } from '../shared/MicroInfoCard';
import { SectionShell } from '../shared/SectionShell';
import { formatDate } from '../shared/formatters';

interface VotacoesPanelProps {
  profile: ParlamentarPerfil;
}

export function VotacoesPanel({ profile }: VotacoesPanelProps) {
  const { parlamentar } = profile;
  const [votacoes, setVotacoes] = useState<VotacaoPerfil[]>(profile.votacoes.destaques);
  const [paginaAtual, setPaginaAtual] = useState(profile.votacoes.paginaAtual || 1);
  const [totalPaginas, setTotalPaginas] = useState(profile.votacoes.totalPaginas || 1);
  const [totalRegistros, setTotalRegistros] = useState(profile.votacoes.totalRegistros || votacoes.length);
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
    } finally {
      setCarregando(false);
    }
  }

  const inicioPagina = votacoes.length ? (paginaAtual - 1) * 5 + 1 : 0;
  const fimPagina = votacoes.length
    ? Math.min(inicioPagina + votacoes.length - 1, totalRegistros)
    : 0;

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <SectionShell
        icon={<Vote className="h-6 w-6" />}
        title="Votações"
      >
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
                    <p className="text-sm font-semibold text-brasil-blue">{votacao.titulo}</p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">{votacao.tema}</h3>
                    {votacao.resumo && votacao.resumo !== votacao.tema ? (
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
                  <MicroInfoCard label="Tipo" value={votacao.orientacaoCasa} />
                </div>
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

      <SectionShell
        icon={<BadgeCheck className="h-6 w-6" />}
        title="Resumo de presença"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <MicroInfoCard label="Presença" value={`${profile.votacoes.presenca}%`} />
          <MicroInfoCard
            label="Votações registradas"
            value={String(totalRegistros)}
          />
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
              <span>Presença em votações registradas</span>
              <span>{profile.votacoes.presenca}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brasil-green"
                style={{ width: `${profile.votacoes.presenca}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          {profile.votacoes.leituraRapida}
        </div>
      </SectionShell>
    </div>
  );
}
