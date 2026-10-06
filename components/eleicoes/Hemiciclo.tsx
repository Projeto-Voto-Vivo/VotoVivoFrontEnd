'use client';

import { useMemo, useState } from 'react';
import { formatPercentual, percentual } from './formatacao';

export interface GrupoCadeiras {
  chave: string;
  rotulo: string;
  cadeiras: number;
  cor: string;
}

interface HemicicloProps {
  grupos: GrupoCadeiras[];
  // Rótulo do todo: "cadeiras", "governos"...
  unidade: string;
}

const LARGURA = 200;
const CENTRO_X = LARGURA / 2;
const CENTRO_Y = 100;
const RAIO_EXTERNO = 96;
const RAIO_INTERNO = 0.42;

/**
 * Distribui `total` assentos em arcos concêntricos e devolve as posições já
 * ordenadas da esquerda para a direita — assim cada partido ocupa uma fatia
 * contínua, e não uma faixa por fileira.
 *
 * O número de fileiras sai de igualar o espaço entre fileiras ao espaço entre
 * vizinhos do mesmo arco; com outra conta os pontos se sobrepõem ou sobra
 * vazio.
 */
function distribuirAssentos(total: number) {
  const fileiras =
    total <= 3
      ? 1
      : Math.max(2, Math.round((1 + Math.sqrt(1 + (4 * total) / 3.67)) / 2));

  const raios = Array.from({ length: fileiras }, (_, i) =>
    fileiras === 1
      ? 0.75
      : RAIO_INTERNO + ((1 - RAIO_INTERNO) * i) / (fileiras - 1)
  );

  const somaRaios = raios.reduce((soma, raio) => soma + raio, 0);
  const porFileira = raios.map((raio) => Math.floor((total * raio) / somaRaios));

  // A sobra do arredondamento vai para os arcos de fora, que têm mais espaço.
  let sobra = total - porFileira.reduce((soma, n) => soma + n, 0);
  for (let i = fileiras - 1; sobra > 0; i = (i - 1 + fileiras) % fileiras) {
    porFileira[i] += 1;
    sobra -= 1;
  }

  const entreFileiras = fileiras === 1 ? 0.3 : (1 - RAIO_INTERNO) / (fileiras - 1);
  const entreVizinhos = Math.min(
    ...raios.map((raio, i) =>
      porFileira[i] > 0 ? (Math.PI * raio) / porFileira[i] : Infinity
    )
  );

  const assentos = raios.flatMap((raio, i) =>
    Array.from({ length: porFileira[i] }, (_, j) => {
      const angulo = Math.PI - (Math.PI * (j + 0.5)) / porFileira[i];

      return {
        angulo,
        raio,
        x: CENTRO_X + Math.cos(angulo) * raio * RAIO_EXTERNO,
        y: CENTRO_Y - Math.sin(angulo) * raio * RAIO_EXTERNO,
      };
    })
  );

  assentos.sort((a, b) => b.angulo - a.angulo || a.raio - b.raio);

  return {
    assentos,
    raioPonto: Math.min(entreFileiras, entreVizinhos) * RAIO_EXTERNO * 0.4,
  };
}

export function Hemiciclo({ grupos, unidade }: HemicicloProps) {
  const [ativo, setAtivo] = useState<string | null>(null);

  const total = grupos.reduce((soma, grupo) => soma + grupo.cadeiras, 0);

  const { assentos, raioPonto } = useMemo(
    () => distribuirAssentos(total),
    [total]
  );

  // Dono de cada assento, na ordem dos grupos
  const donos = useMemo(
    () => grupos.flatMap((grupo) => Array<GrupoCadeiras>(grupo.cadeiras).fill(grupo)),
    [grupos]
  );

  if (total === 0) return null;

  const grupoAtivo = grupos.find((grupo) => grupo.chave === ativo) ?? null;

  return (
    <div>
      <div className="relative mx-auto max-w-xl">
        <svg
          viewBox={`0 0 ${LARGURA} ${CENTRO_Y + raioPonto + 1}`}
          role="img"
          aria-label={`Divisão de ${total} ${unidade}: ${grupos
            .map((grupo) => `${grupo.rotulo} ${grupo.cadeiras}`)
            .join(', ')}.`}
          className="block w-full"
        >
          {assentos.map((assento, i) => {
            const dono = donos[i];

            return (
              <circle
                key={i}
                cx={assento.x}
                cy={assento.y}
                r={raioPonto}
                fill={dono.cor}
                opacity={ativo && ativo !== dono.chave ? 0.18 : 1}
                onMouseEnter={() => setAtivo(dono.chave)}
                onMouseLeave={() => setAtivo(null)}
              />
            );
          })}
        </svg>

        {/* O número que o gráfico lidera; troca para o partido sob o cursor. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 text-center"
          aria-hidden="true"
        >
          <p className="text-2xl font-bold leading-none text-slate-900 sm:text-4xl">
            {grupoAtivo ? grupoAtivo.cadeiras : total}
          </p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
            {grupoAtivo
              ? `${grupoAtivo.rotulo} · ${formatPercentual(percentual(grupoAtivo.cadeiras, total), 1)}`
              : unidade}
          </p>
        </div>
      </div>

      <ul className="mt-5 flex flex-wrap justify-center gap-x-1 gap-y-1">
        {grupos.map((grupo) => (
          <li key={grupo.chave}>
            <button
              type="button"
              onMouseEnter={() => setAtivo(grupo.chave)}
              onMouseLeave={() => setAtivo(null)}
              onFocus={() => setAtivo(grupo.chave)}
              onBlur={() => setAtivo(null)}
              className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-sm text-slate-700 transition focus-visible:outline-2 focus-visible:outline-brasil-blue ${
                ativo === grupo.chave ? 'bg-slate-100' : ''
              }`}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: grupo.cor }}
                aria-hidden="true"
              />
              <span className="font-medium">{grupo.rotulo}</span>
              <span className="font-bold tabular-nums text-slate-900">
                {grupo.cadeiras}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
