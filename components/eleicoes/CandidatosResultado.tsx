'use client';

import { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CircleCheck, Loader2, Repeat2 } from 'lucide-react';
import {
  CandidatoResultado,
  getCandidatosResultado,
  MetaPaginacao,
} from '@/services/eleicoes';
import {
  desfechoCandidato,
  formatNumero,
  formatPercentual,
  percentual,
} from './formatacao';

interface CandidatosResultadoProps {
  idEleicaoResultado: number;
  votosValidos: number | null;
}

const POR_PAGINA = 10;

type Lista = {
  chave: string;
  itens: CandidatoResultado[];
  meta: MetaPaginacao | null;
  erro: boolean;
};

function linkDoCandidato(candidato: CandidatoResultado) {
  if (candidato.idParlamentar) return `/parlamentares/${candidato.idParlamentar}`;
  if (candidato.idCandidaturaTse) return `/candidatos/${candidato.idCandidaturaTse}`;
  return null;
}

function LinhaCandidato({
  candidato,
  percentualVotos,
  escala,
}: {
  candidato: CandidatoResultado;
  percentualVotos: number | null;
  escala: number;
}) {
  const desfecho = desfechoCandidato(candidato);
  const nome = candidato.nomeUrna ?? candidato.nomeCivil ?? 'Nome não informado';
  const largura =
    percentualVotos !== null && escala > 0
      ? Math.min(100, (percentualVotos / escala) * 100)
      : 0;
  const href = linkDoCandidato(candidato);

  const conteudo = (
    <div className="flex items-start gap-3 py-3">
      <span className="w-7 shrink-0 pt-2.5 text-right text-sm font-bold tabular-nums text-slate-400">
        {candidato.posicao !== null ? `${candidato.posicao}º` : '—'}
      </span>

      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
        {candidato.fotoUrl ? (
          <Image
            src={candidato.fotoUrl}
            alt=""
            fill
            sizes="44px"
            className="object-cover object-top"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-base font-bold text-slate-400">
            {nome.charAt(0)}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="break-words text-sm font-semibold text-slate-900 group-hover:text-brasil-blue">
            {nome}
          </span>

          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${desfecho.badge}`}
          >
            {desfecho.tipo === 'eleito' && <CircleCheck size={12} aria-hidden="true" />}
            {desfecho.tipo === 'segundoTurno' && <Repeat2 size={12} aria-hidden="true" />}
            {desfecho.rotulo}
          </span>
        </div>

        <p className="mt-0.5 break-words text-xs text-slate-500">
          {candidato.siglaPartido ?? 'Partido não informado'}
          {candidato.numeroCandidato && ` · Nº ${candidato.numeroCandidato}`}
          {candidato.nomeVice && ` · Vice: ${candidato.nomeVice}`}
        </p>

        <div className="mt-2 flex items-center gap-3">
          <div className="h-2.5 flex-1">
            <div
              className="h-full rounded-r-[4px] bg-voto-sim"
              style={{ width: `${largura}%` }}
              aria-hidden="true"
            />
          </div>

          <span className="shrink-0 text-right text-xs tabular-nums text-slate-600">
            <span className="font-bold text-slate-900">
              {formatNumero(candidato.votos)}
            </span>{' '}
            · {formatPercentual(percentualVotos)}
          </span>
        </div>

        {candidato.situacaoVotos && (
          <p className="mt-1 text-[11px] text-slate-400">
            Votos: {candidato.situacaoVotos}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <li>
      {href ? (
        <Link href={href} className="group block">
          {conteudo}
        </Link>
      ) : (
        conteudo
      )}
    </li>
  );
}

export function CandidatosResultado({
  idEleicaoResultado,
  votosValidos,
}: CandidatosResultadoProps) {
  const [soEleitos, setSoEleitos] = useState(false);
  const [nome, setNome] = useState('');
  const [rascunhoNome, setRascunhoNome] = useState('');
  const [pagina, setPagina] = useState(1);
  const [lista, setLista] = useState<Lista>({
    chave: '',
    itens: [],
    meta: null,
    erro: false,
  });

  // Tudo que redefine a lista; a página só acrescenta.
  const chave = `${idEleicaoResultado}|${soEleitos}|${nome}`;

  useEffect(() => {
    let cancelado = false;

    getCandidatosResultado(idEleicaoResultado, {
      pagina,
      limite: POR_PAGINA,
      nome: nome || undefined,
      eleito: soEleitos ? true : undefined,
    })
      .then((resposta) => {
        if (cancelado) return;

        setLista((atual) => ({
          chave,
          itens:
            atual.chave === chave && pagina > 1
              ? [...atual.itens, ...resposta.data]
              : resposta.data,
          meta: resposta.meta,
          erro: false,
        }));
      })
      .catch(() => {
        if (!cancelado) setLista({ chave, itens: [], meta: null, erro: true });
      });

    return () => {
      cancelado = true;
    };
  }, [idEleicaoResultado, soEleitos, nome, pagina, chave]);

  const trocando = lista.chave !== chave;
  const carregandoMais = !trocando && lista.meta !== null && lista.meta.page < pagina;

  const pctDe = (candidato: CandidatoResultado) =>
    candidato.percentualVotos ?? percentual(candidato.votos, votosValidos);

  const escala = Math.max(...lista.itens.map((c) => pctDe(c) ?? 0), 0);

  const filtrar = (evento: FormEvent) => {
    evento.preventDefault();
    setPagina(1);
    setNome(rascunhoNome.trim());
  };

  const alternarEleitos = (valor: boolean) => {
    setPagina(1);
    setSoEleitos(valor);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div
          className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-sm"
          role="group"
          aria-label="Filtrar candidatos"
        >
          {[
            { rotulo: 'Todos', valor: false },
            { rotulo: 'Eleitos', valor: true },
          ].map((opcao) => (
            <button
              key={opcao.rotulo}
              type="button"
              aria-pressed={soEleitos === opcao.valor}
              onClick={() => alternarEleitos(opcao.valor)}
              className={`rounded-lg px-3 py-1.5 font-semibold transition ${
                soEleitos === opcao.valor
                  ? 'bg-white text-brasil-blue shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {opcao.rotulo}
            </button>
          ))}
        </div>

        <form onSubmit={filtrar} className="flex min-w-0 basis-full gap-2 sm:max-w-sm sm:flex-1 sm:basis-auto">
          <input
            type="search"
            value={rascunhoNome}
            onChange={(evento) => setRascunhoNome(evento.target.value)}
            placeholder="Buscar candidato"
            aria-label="Buscar candidato pelo nome"
            className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brasil-blue"
          />
          <button
            type="submit"
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Buscar
          </button>
        </form>

        {lista.meta && !trocando && (
          <p className="text-xs text-slate-500">
            {formatNumero(lista.meta.total)} candidato(s)
          </p>
        )}
      </div>

      {trocando ? (
        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brasil-blue">
          <Loader2 className="h-4 w-4 animate-spin" />
          Carregando candidatos
        </div>
      ) : lista.erro ? (
        <p className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
          Não conseguimos carregar os candidatos agora. Tente novamente em alguns
          instantes.
        </p>
      ) : lista.itens.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
          {soEleitos && !nome
            ? 'Ninguém conquistou a vaga neste turno ainda.'
            : 'Nenhum candidato encontrado.'}
        </p>
      ) : (
        <>
          <ol className="mt-3 divide-y divide-slate-100">
            {lista.itens.map((candidato) => (
              <LinhaCandidato
                key={candidato.sqCandidato}
                candidato={candidato}
                percentualVotos={pctDe(candidato)}
                escala={escala}
              />
            ))}
          </ol>

          <p className="mt-2 text-xs text-slate-400">
            Percentuais sobre os votos válidos. As barras comparam os candidatos
            listados entre si.
          </p>

          {lista.meta?.temProximaPagina && (
            <button
              type="button"
              disabled={carregandoMais}
              onClick={() => setPagina((atual) => atual + 1)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
            >
              {carregandoMais && <Loader2 className="h-4 w-4 animate-spin" />}
              Mostrar mais candidatos
            </button>
          )}
        </>
      )}
    </div>
  );
}
