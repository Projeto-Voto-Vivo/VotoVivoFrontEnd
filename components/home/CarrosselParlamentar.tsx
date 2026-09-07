'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { RankingParlamentarItem } from '@/services/parlamentares';

interface Slide {
  parlamentar: RankingParlamentarItem;
  tipo: 'despesas' | 'emendas';
  valor: number;
}

interface CarrosselParlamentarProps {
  rankingDespesas: RankingParlamentarItem[];
  rankingEmendas: RankingParlamentarItem[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(value);
}

function normalizePhoto(url: string, nome: string) {
  if (!url || url.includes('example.com')) {
    const label =
      nome.split(' ').filter(Boolean).slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? '').join('') || 'VV';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="260" viewBox="0 0 200 260"><rect width="200" height="260" fill="#e2e8f0"/><circle cx="100" cy="95" r="50" fill="#94a3b8"/><path d="M10 240c15-60 60-95 90-95s75 35 90 95" fill="#94a3b8"/><text x="100" y="258" text-anchor="middle" font-size="18" font-family="Arial" fill="#334155">${label}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }
  return url;
}

function display(value?: string | null) {
  return value?.trim() || '—';
}

const FOTO_BG: Record<'emendas' | 'despesas', string> = {
  emendas: 'bg-emerald-50',
  despesas: 'bg-blue-50',
};

const AUTOPLAY_INTERVAL = 4500;
const SLIDES_POR_CICLO = 4;

/**
 * Monta todos os pares intercalados (emenda, despesa) a partir dos rankings.
 * Exemplo com top 5 de cada:
 *   [e0,d0, e1,d1, e2,d2, e3,d3, e4,d4]
 * O carrossel exibe 4 slides por vez (um "ciclo"), avançando o offset a cada
 * volta completa para mostrar rostos diferentes.
 */
function buildAllSlides(
  rankingEmendas: RankingParlamentarItem[],
  rankingDespesas: RankingParlamentarItem[],
): Slide[] {
  const maxLen = Math.max(rankingEmendas.length, rankingDespesas.length);
  const all: Slide[] = [];

  for (let i = 0; i < maxLen; i++) {
    const e = rankingEmendas[i];
    const d = rankingDespesas[i];

    if (e && (e.totalEmendas ?? 0) > 0) {
      all.push({ parlamentar: e, tipo: 'emendas', valor: e.totalEmendas ?? 0 });
    }
    if (d && (d.totalDespesas ?? 0) > 0) {
      all.push({ parlamentar: d, tipo: 'despesas', valor: d.totalDespesas ?? 0 });
    }
  }

  return all;
}

export function CarrosselParlamentar({
  rankingDespesas,
  rankingEmendas,
}: CarrosselParlamentarProps) {
  const router = useRouter();

  // Todos os pares disponíveis (até 20 com top 10 de cada)
  const allSlides = buildAllSlides(rankingEmendas, rankingDespesas);

  // offset: início do grupo de 4 atual
  const [offset, setOffset] = useState(0);
  // índice dentro do grupo de 4 (0–3)
  const [posicao, setPosicao] = useState(0);

  // Slide exibido — separado do "atual" para evitar piscada durante fade
  const [slideExibido, setSlideExibido] = useState<Slide | null>(
    allSlides[0] ?? null,
  );
  const [saindo, setSaindo] = useState(false);

  const pausadoRef = useRef(false);
  const posicaoRef = useRef(0);
  const offsetRef = useRef(0);

  useEffect(() => { posicaoRef.current = posicao; }, [posicao]);
  useEffect(() => { offsetRef.current = offset; }, [offset]);

  // Slides do ciclo atual (grupo de 4)
  const totalAll = allSlides.length;
  const cicloSlides: Slide[] = Array.from({ length: SLIDES_POR_CICLO }, (_, i) => {
    if (totalAll === 0) return null;
    return allSlides[(offset + i) % totalAll];
  }).filter((s): s is Slide => s !== null);

  function avancar() {
    const novaPosicao = posicaoRef.current + 1;

    // Completou o ciclo de 4 — avança o offset para o próximo grupo
    if (novaPosicao >= SLIDES_POR_CICLO) {
      const novoOffset = (offsetRef.current + SLIDES_POR_CICLO) % totalAll;
      setSaindo(true);
      setTimeout(() => {
        setOffset(novoOffset);
        setPosicao(0);
        setSlideExibido(allSlides[novoOffset % totalAll]);
        setSaindo(false);
      }, 220);
    } else {
      const proxSlide = allSlides[(offsetRef.current + novaPosicao) % totalAll];
      setSaindo(true);
      setTimeout(() => {
        setPosicao(novaPosicao);
        setSlideExibido(proxSlide);
        setSaindo(false);
      }, 220);
    }
  }

  function irPara(i: number) {
    if (i === posicaoRef.current) return;
    const proxSlide = allSlides[(offsetRef.current + i) % totalAll];
    setSaindo(true);
    setTimeout(() => {
      setPosicao(i);
      setSlideExibido(proxSlide);
      setSaindo(false);
    }, 220);
  }

  // Autoplay — intervalo fixo, sem dependências que reiniciem o timer
  useEffect(() => {
    if (totalAll === 0) return;
    const id = setInterval(() => {
      if (pausadoRef.current) return;
      avancar();
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalAll]);

  if (!slideExibido || cicloSlides.length === 0) return null;

  const { parlamentar, tipo, valor } = slideExibido;
  const labelTipo = tipo === 'emendas' ? 'em emendas pagas' : 'em despesas parlamentares';
  const tagCor = tipo === 'emendas'
    ? 'bg-brasil-green/10 text-brasil-green'
    : 'bg-brasil-blue/10 text-brasil-blue';
  const tagLabel = tipo === 'emendas' ? 'Emendas' : 'Despesas';
  const fotoBg = FOTO_BG[tipo];

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      onMouseEnter={() => { pausadoRef.current = true; }}
      onMouseLeave={() => { pausadoRef.current = false; }}
    >
      {/* O conteúdo não troca até DEPOIS do fade — sem piscada */}
      <div className={`transition-opacity duration-200 ${saindo ? 'opacity-0' : 'opacity-100'}`}>

        {/* ── Mobile ── */}
        <div className="flex flex-col sm:hidden">
          <div className={`relative h-52 w-full overflow-hidden ${fotoBg}`}>
            <Image
              src={normalizePhoto(parlamentar.urlFoto, parlamentar.nomeParlamentar)}
              alt={parlamentar.nomeParlamentar}
              fill
              sizes="100vw"
              className="object-contain object-top"
              unoptimized
            />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/90 to-transparent" />
          </div>

          <div className="p-5">
            <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${tagCor}`}>
              {tagLabel}
            </span>
            <p className="mt-3 text-3xl font-bold leading-none text-slate-900">
              {formatCurrency(valor)}
            </p>
            <p className="mt-1.5 text-sm font-medium text-slate-600">{labelTipo}</p>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-base font-bold text-slate-900">
                {display(parlamentar.nomeParlamentar)}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {display(parlamentar.siglaPartido)} · {display(parlamentar.cargo)}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                {cicloSlides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Ir para slide ${i + 1}`}
                    onClick={() => irPara(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === posicao ? 'w-6 bg-brasil-blue' : 'w-2 bg-slate-300'
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => router.push(`/parlamentares/${parlamentar.id}`)}
                className="rounded-xl bg-brasil-blue px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
              >
                Ver mais
              </button>
            </div>
          </div>
        </div>

        {/* ── Desktop 2×2 ── */}
        <div className="hidden grid-cols-2 sm:grid">
          <div className={`relative overflow-hidden ${fotoBg}`} style={{ height: 220 }}>
            <Image
              src={normalizePhoto(parlamentar.urlFoto, parlamentar.nomeParlamentar)}
              alt={parlamentar.nomeParlamentar}
              fill
              sizes="(max-width: 1024px) 30vw, 20vw"
              className="object-contain object-top"
              unoptimized
            />
          </div>

          <div className="flex flex-col justify-center gap-3 bg-slate-50 px-6 py-6" style={{ height: 220 }}>
            <span className={`w-fit rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${tagCor}`}>
              {tagLabel}
            </span>
            <p className="text-4xl font-bold leading-none text-slate-900 xl:text-5xl">
              {formatCurrency(valor)}
            </p>
            <p className="text-sm font-medium text-slate-600">{labelTipo}</p>
            <button
              type="button"
              onClick={() => router.push(`/parlamentares/${parlamentar.id}`)}
              className="mt-1 w-fit rounded-xl bg-brasil-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Ver mais
            </button>
          </div>

          <div className="flex flex-col justify-center border-t border-slate-100 bg-white px-5 py-4">
            <p className="line-clamp-1 text-base font-bold text-slate-900">
              {display(parlamentar.nomeParlamentar)}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {display(parlamentar.siglaPartido)} · {display(parlamentar.cargo)}
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">
            {cicloSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir para slide ${i + 1}`}
                onClick={() => irPara(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === posicao
                    ? 'w-6 bg-brasil-blue'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
