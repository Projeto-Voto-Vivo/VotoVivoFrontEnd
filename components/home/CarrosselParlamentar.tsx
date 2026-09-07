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

// Cores de fundo do quadrante da foto por tipo de slide
const FOTO_BG: Record<'emendas' | 'despesas', string> = {
  emendas: 'bg-emerald-50',
  despesas: 'bg-blue-50',
};

const AUTOPLAY_INTERVAL = 4500;

export function CarrosselParlamentar({
  rankingDespesas,
  rankingEmendas,
}: CarrosselParlamentarProps) {
  const router = useRouter();

  const slides: Slide[] = [
    // Intercalado: emenda 1, despesa 1, emenda 2, despesa 2
    rankingEmendas[0] && {
      parlamentar: rankingEmendas[0],
      tipo: 'emendas' as const,
      valor: rankingEmendas[0].totalEmendas ?? 0,
    },
    rankingDespesas[0] && {
      parlamentar: rankingDespesas[0],
      tipo: 'despesas' as const,
      valor: rankingDespesas[0].totalDespesas ?? 0,
    },
    rankingEmendas[1] && {
      parlamentar: rankingEmendas[1],
      tipo: 'emendas' as const,
      valor: rankingEmendas[1].totalEmendas ?? 0,
    },
    rankingDespesas[1] && {
      parlamentar: rankingDespesas[1],
      tipo: 'despesas' as const,
      valor: rankingDespesas[1].totalDespesas ?? 0,
    },
  ].filter((s): s is Slide => Boolean(s) && s.valor > 0);

  const total = slides.length;

  const [atual, setAtual] = useState(0);
  const [saindo, setSaindo] = useState(false);
  const pausadoRef = useRef(false);
  // Ref para o índice atual — evita dependência no intervalo
  const atualRef = useRef(0);

  // Mantém ref sincronizada com state
  useEffect(() => {
    atualRef.current = atual;
  }, [atual]);

  function irPara(index: number) {
    if (index === atualRef.current) return;
    setSaindo(true);
    setTimeout(() => {
      setAtual(index);
      setSaindo(false);
    }, 180);
  }

  // Autoplay — intervalo fixo, lê índice via ref para não reiniciar
  useEffect(() => {
    if (total === 0) return;
    const id = setInterval(() => {
      if (pausadoRef.current) return;
      const proximo = (atualRef.current + 1) % total;
      setSaindo(true);
      setTimeout(() => {
        setAtual(proximo);
        setSaindo(false);
      }, 180);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, [total]); // só monta uma vez

  if (slides.length === 0) return null;

  const slide = slides[atual];
  const { parlamentar, tipo, valor } = slide;
  const labelTipo =
    tipo === 'emendas' ? 'em emendas pagas' : 'em despesas parlamentares';
  const tagCor =
    tipo === 'emendas'
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
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Ir para slide ${i + 1}`}
                    onClick={() => irPara(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === atual ? 'w-6 bg-brasil-blue' : 'w-2 bg-slate-300'
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
          {/* Superior esquerdo — foto */}
          <div
            className={`relative overflow-hidden ${fotoBg}`}
            style={{ height: 220 }}
          >
            <Image
              src={normalizePhoto(parlamentar.urlFoto, parlamentar.nomeParlamentar)}
              alt={parlamentar.nomeParlamentar}
              fill
              sizes="(max-width: 1024px) 30vw, 20vw"
              className="object-contain object-top"
              unoptimized
            />
          </div>

          {/* Superior direito — big number */}
          <div
            className="flex flex-col justify-center gap-3 bg-slate-50 px-6 py-6"
            style={{ height: 220 }}
          >
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

          {/* Inferior esquerdo — nome */}
          <div className="flex flex-col justify-center border-t border-slate-100 bg-white px-5 py-4">
            <p className="line-clamp-1 text-base font-bold text-slate-900">
              {display(parlamentar.nomeParlamentar)}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {display(parlamentar.siglaPartido)} · {display(parlamentar.cargo)}
            </p>
          </div>

          {/* Inferior direito — dots */}
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir para slide ${i + 1}`}
                onClick={() => irPara(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === atual
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
