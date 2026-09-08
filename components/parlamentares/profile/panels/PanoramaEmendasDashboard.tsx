'use client';

import { useEffect, useState } from 'react';
import { Info, Loader2, MapPin, Target } from 'lucide-react';
import { PanoramaEmendas, RecorteEmendas } from '@/types';
import { getPanoramaEmendas } from '@/services/parlamentares';
import { SectionShell } from '../shared/SectionShell';
import { formatCurrency } from '../shared/formatters';

interface PanoramaEmendasDashboardProps {
  parlamentarId: number;
}

const COR_EMENDA = 'var(--color-emenda)';

/** Quantas linhas antes de esconder a cauda atrás do botão. */
const LINHAS_VISIVEIS = 8;

/**
 * A barra mede **valor empenhado**, não quantidade de emendas.
 *
 * Uma emenda de R$ 5 milhões e uma de R$ 50 mil contam igual numa contagem, e
 * é o dinheiro que diz onde o parlamentar de fato atua. A quantidade fica ao
 * lado, porque as duas leituras juntas mostram se são muitas emendas pequenas
 * ou poucas grandes.
 */
function LinhaRecorte({
  item,
  escala,
}: {
  item: RecorteEmendas;
  escala: number;
}) {
  const largura = escala > 0 ? (item.empenhado / escala) * 100 : 0;

  return (
    <li className="group relative py-2.5">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <span className="truncate text-sm font-medium text-slate-700">
          {item.rotulo}
        </span>
        <span className="shrink-0 text-xs text-slate-400">
          {item.quantidade} {item.quantidade === 1 ? 'emenda' : 'emendas'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-3 flex-1">
          <div
            className="h-full rounded-r-[4px]"
            style={{ width: `${largura}%`, background: COR_EMENDA }}
            aria-hidden="true"
          />
        </div>

        <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-600">
          {formatCurrency(item.empenhado)}
        </span>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-full z-20 hidden w-60 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-3 text-xs leading-5 shadow-lg group-hover:block">
        <p className="font-bold text-slate-900">{item.rotulo}</p>
        <dl className="mt-2 space-y-1 text-slate-600">
          <div className="flex justify-between gap-4">
            <dt>Empenhado</dt>
            <dd className="font-semibold tabular-nums">
              {formatCurrency(item.empenhado)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Pago</dt>
            <dd className="tabular-nums">{formatCurrency(item.pago)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Emendas</dt>
            <dd className="tabular-nums">{item.quantidade}</dd>
          </div>
        </dl>
      </div>

      <span className="sr-only">
        {item.rotulo}: {formatCurrency(item.empenhado)} empenhados em{' '}
        {item.quantidade} {item.quantidade === 1 ? 'emenda' : 'emendas'}.
      </span>
    </li>
  );
}

function Recorte({
  titulo,
  descricao,
  icone,
  itens,
  semDado,
  empenhadoSemDado,
  rotuloSemDado,
}: {
  titulo: string;
  descricao: string;
  icone: React.ReactNode;
  itens: RecorteEmendas[];
  semDado: number;
  empenhadoSemDado: number;
  rotuloSemDado: string;
}) {
  const [mostrarTodos, setMostrarTodos] = useState(false);

  if (itens.length === 0) return null;

  const ordenados = [...itens].sort((a, b) => b.empenhado - a.empenhado);
  const escala = Math.max(...ordenados.map((item) => item.empenhado), 1);
  const visiveis = mostrarTodos ? ordenados : ordenados.slice(0, LINHAS_VISIVEIS);
  const excedente = ordenados.length - LINHAS_VISIVEIS;

  return (
    <SectionShell icon={icone} title={titulo} description={descricao}>
      <ul className="divide-y divide-slate-100">
        {visiveis.map((item) => (
          <LinhaRecorte key={item.rotulo} item={item} escala={escala} />
        ))}
      </ul>

      {excedente > 0 && (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => setMostrarTodos((atual) => !atual)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brasil-blue hover:text-brasil-blue"
          >
            {mostrarTodos ? 'Mostrar menos' : `Ver os outros ${excedente}`}
          </button>
        </div>
      )}

      <p className="mt-4 flex items-start gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-500">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          A barra mede o valor <strong className="font-semibold">empenhado</strong>{' '}
          — o quanto foi reservado, que nem sempre é o quanto saiu do caixa. O
          valor pago aparece ao passar o mouse.
          {semDado > 0 ? (
            <>
              {' '}
              Fora das barras: {semDado}{' '}
              {semDado === 1 ? 'emenda não traz' : 'emendas não trazem'}{' '}
              {rotuloSemDado} na fonte
              {empenhadoSemDado > 0
                ? `, somando ${formatCurrency(empenhadoSemDado)} empenhados — é o que falta para as barras fecharem o total do parlamentar`
                : ''}
              .
            </>
          ) : null}
        </span>
      </p>
    </SectionShell>
  );
}

export function PanoramaEmendasDashboard({
  parlamentarId,
}: PanoramaEmendasDashboardProps) {
  const [panorama, setPanorama] = useState<PanoramaEmendas | null>(null);

  useEffect(() => {
    let cancelado = false;

    getPanoramaEmendas(parlamentarId).then((resultado) => {
      if (!cancelado) setPanorama(resultado);
    });

    return () => {
      cancelado = true;
    };
  }, [parlamentarId]);

  if (!panorama) {
    return (
      <SectionShell icon={<Target className="h-6 w-6" />} title="Panorama das emendas">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-brasil-blue">
          <Loader2 className="h-4 w-4 animate-spin" />
          Carregando
        </div>
      </SectionShell>
    );
  }

  const temAlgo =
    panorama.porArea.length > 0 || panorama.porLocalidade.length > 0;

  if (!panorama.disponivel || !temAlgo) {
    return (
      <SectionShell icon={<Target className="h-6 w-6" />} title="Panorama das emendas">
        <div className="flex items-start gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-600">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
          <div>
            <p className="font-semibold text-slate-800">
              O panorama por área e por destino ainda não está disponível.
            </p>
            <p className="mt-1">
              Cada emenda já traz a finalidade e a localidade do gasto — a lista
              abaixo mostra as duas. O que falta é o resumo somado de todas
              elas, que precisa vir pronto do servidor: somar só as emendas
              carregadas nesta página daria um total que parece certo e não é.
            </p>
          </div>
        </div>
      </SectionShell>
    );
  }

  return (
    <>
      <Recorte
        titulo="Em que áreas as emendas atuam"
        descricao="Função orçamentária declarada de cada emenda — a finalidade do gasto."
        icone={<Target className="h-6 w-6" />}
        itens={panorama.porArea}
        semDado={panorama.semArea}
        empenhadoSemDado={panorama.empenhadoSemArea}
        rotuloSemDado="a finalidade"
      />

      <Recorte
        titulo="Para onde o dinheiro foi"
        descricao="Localidade de destino informada em cada emenda."
        icone={<MapPin className="h-6 w-6" />}
        itens={panorama.porLocalidade}
        semDado={panorama.semLocalidade}
        empenhadoSemDado={panorama.empenhadoSemLocalidade}
        rotuloSemDado="a localidade"
      />
    </>
  );
}
