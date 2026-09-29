'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RankingParlamentarItem } from '@/services/parlamentares';

interface Slide {
  parlamentar: RankingParlamentarItem;
  tipo: 'despesas' | 'emendas';
  valor: number;
  /** Posição no ranking do próprio tipo (1 = quem mais gastou/recebeu). */
  posicaoRanking: number;
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

const AUTOPLAY_INTERVAL = 6000;

/** Largura de um cartão e quantos cabem na trilha visível. */
function medir(trilha: HTMLDivElement) {
  const largura = (trilha.firstElementChild as HTMLElement | null)?.offsetWidth || trilha.clientWidth || 1;
  return { largura, porTela: Math.max(1, Math.round(trilha.clientWidth / largura)) };
}

/**
 * Intercala os rankings (emenda, despesa, emenda, despesa...) para o
 * carrossel alternar entre os dois assuntos.
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
      all.push({ parlamentar: e, tipo: 'emendas', valor: e.totalEmendas ?? 0, posicaoRanking: i + 1 });
    }
    if (d && (d.totalDespesas ?? 0) > 0) {
      all.push({ parlamentar: d, tipo: 'despesas', valor: d.totalDespesas ?? 0, posicaoRanking: i + 1 });
    }
  }

  return all;
}

function SlideParlamentar({ slide, posicao, total }: { slide: Slide; posicao: number; total: number }) {
  const { parlamentar, tipo, valor, posicaoRanking } = slide;
  const labelTipo = tipo === 'emendas' ? 'em emendas pagas' : 'em despesas parlamentares';
  const tagCor = tipo === 'emendas'
    ? 'bg-brasil-green/10 text-brasil-green'
    : 'bg-brasil-blue/10 text-brasil-blue';
  const fotoBg = FOTO_BG[tipo];
  const foto = normalizePhoto(parlamentar.urlFoto, parlamentar.nomeParlamentar);
  const href = `/parlamentares/${parlamentar.id}`;

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${posicao} de ${total}: ${display(parlamentar.nomeParlamentar)}, ${posicaoRanking}º no ranking de ${tipo}`}
      className="flex w-full shrink-0 snap-start flex-col border-r border-slate-100 last:border-r-0 sm:w-1/2 lg:w-1/3 xl:w-1/4"
    >
      <div className={`relative h-52 w-full overflow-hidden ${fotoBg}`}>
        <Image
          src={foto}
          alt={parlamentar.nomeParlamentar}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain object-top"
          unoptimized
          draggable={false}
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/90 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <span className="grid h-7 min-w-7 place-items-center rounded-full bg-brasil-yellow px-2 text-xs font-extrabold text-brasil-blue">
            {posicaoRanking}º
          </span>
          <span className={`w-fit rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${tagCor}`}>
            {tipo === 'emendas' ? 'Ranking de emendas' : 'Ranking de despesas'}
          </span>
        </div>
        <p className="mt-3 text-3xl font-bold leading-none text-slate-900">
          {formatCurrency(valor)}
        </p>
        <p className="mt-1.5 mb-4 text-sm font-medium text-slate-600">{labelTipo}</p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-slate-900">
              {display(parlamentar.nomeParlamentar)}
            </p>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {display(parlamentar.siglaPartido)} · {display(parlamentar.cargo)}
            </p>
          </div>
          <Link
            href={href}
            className="shrink-0 rounded-xl bg-brasil-blue px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
          >
            Ver mais
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Carrossel dos maiores valores em emendas e despesas.
 *
 * A trilha é uma rolagem horizontal com scroll-snap: no celular dá para
 * arrastar com o dedo e no desktop há setas (e as setas do teclado). O
 * autoplay para de vez assim que a pessoa mexe no carrossel — quem está lendo
 * um slide não quer vê-lo fugir — e também pausa com o mouse em cima ou o
 * foco dentro.
 */
export function CarrosselParlamentar({
  rankingDespesas,
  rankingEmendas,
}: CarrosselParlamentarProps) {
  const slides = buildAllSlides(rankingEmendas, rankingDespesas);
  const total = slides.length;

  const trilhaRef = useRef<HTMLDivElement>(null);
  const [atual, setAtual] = useState(0);
  // Quantos cartões cabem na tela: 1 no celular, até 4 no desktop.
  const [porTela, setPorTela] = useState(1);
  const [interagiu, setInteragiu] = useState(false);
  const pausadoRef = useRef(false);

  const irPara = useCallback(
    (indice: number) => {
      const trilha = trilhaRef.current;
      if (!trilha || total === 0) return;

      const { largura, porTela } = medir(trilha);
      const ultimo = Math.max(total - porTela, 0);

      // Dá a volta nas pontas: depois do último vem o primeiro, e vice-versa.
      const destino = indice > ultimo ? 0 : indice < 0 ? ultimo : indice;
      trilha.scrollTo({ left: destino * largura, behavior: 'smooth' });
    },
    [total],
  );

  function navegar(indice: number) {
    setInteragiu(true);
    irPara(indice);
  }

  // O slide atual sai da posição da rolagem, então arrastar, clicar na seta e
  // o autoplay mantêm o contador sempre certo.
  function aoRolar() {
    const trilha = trilhaRef.current;
    if (!trilha) return;
    const { largura, porTela } = medir(trilha);
    setAtual(Math.round(trilha.scrollLeft / largura));
    setPorTela(porTela);
  }

  // Recalcula quantos cartões cabem quando a largura muda (e na montagem).
  useEffect(() => {
    const trilha = trilhaRef.current;
    if (!trilha) return;

    const observador = new ResizeObserver(() => {
      const { largura, porTela } = medir(trilha);
      setPorTela(porTela);
      setAtual(Math.round(trilha.scrollLeft / largura));
    });

    observador.observe(trilha);
    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    if (total <= 1 || interagiu) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = setInterval(() => {
      if (pausadoRef.current || document.hidden) return;
      const trilha = trilhaRef.current;
      if (!trilha) return;
      irPara(Math.round(trilha.scrollLeft / medir(trilha).largura) + 1);
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(id);
  }, [total, interagiu, irPara]);

  function aoTeclar(evento: React.KeyboardEvent) {
    if (evento.key === 'ArrowRight') {
      evento.preventDefault();
      navegar(atual + 1);
    } else if (evento.key === 'ArrowLeft') {
      evento.preventDefault();
      navegar(atual - 1);
    }
  }

  if (total === 0) return null;

  const botaoSeta =
    'grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-brasil-blue hover:text-brasil-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brasil-blue';

  return (
    <section
      aria-roledescription="carrossel"
      aria-label="Ranking dos parlamentares com mais despesas e emendas pagas"
      className="relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      onMouseEnter={() => { pausadoRef.current = true; }}
      onMouseLeave={() => { pausadoRef.current = false; }}
      onFocusCapture={() => { pausadoRef.current = true; }}
      onBlurCapture={() => { pausadoRef.current = false; }}
      onKeyDown={aoTeclar}
    >
      {/* O que o carrossel mostra — sem isso os valores ficam soltos */}
      <header className="flex flex-col gap-1 border-b border-slate-100 px-5 py-4 md:flex-row md:items-end md:justify-between md:gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brasil-blue">
            Ranking
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Quem mais usa a cota e recebe emendas
          </h2>
        </div>
        <p className="max-w-xl text-xs leading-5 text-slate-500 md:text-right">
          Os 10 parlamentares com mais{' '}
          <strong className="font-semibold text-brasil-blue">despesas da cota parlamentar</strong>{' '}
          e os 10 com mais{' '}
          <strong className="font-semibold text-brasil-green">emendas pagas</strong>,
          somando todo o período com dados disponíveis. Os dois rankings se
          alternam.
        </p>
      </header>

      <div
        ref={trilhaRef}
        onScroll={aoRolar}
        onTouchStart={() => setInteragiu(true)}
        onWheel={(evento) => { if (evento.deltaX !== 0) setInteragiu(true); }}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-live={interagiu ? 'polite' : 'off'}
      >
        {slides.map((slide, i) => (
          <SlideParlamentar
            key={`${slide.tipo}-${slide.parlamentar.id}`}
            slide={slide}
            posicao={i + 1}
            total={total}
          />
        ))}
      </div>

      {/* Controles */}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-5 py-3">
        <button
          type="button"
          onClick={() => navegar(atual - 1)}
          className={botaoSeta}
          aria-label="Slide anterior"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>

        <div className="flex min-w-0 flex-col items-center gap-1.5">
          <span className="text-xs font-semibold tabular-nums text-slate-500">
            {porTela > 1
              ? `${atual + 1}–${Math.min(atual + porTela, total)} de ${total}`
              : `${atual + 1} de ${total}`}
          </span>
          <div className="h-1 w-28 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
            <div
              className="h-full rounded-full bg-brasil-blue transition-all duration-300"
              style={{ width: `${(Math.min(atual + porTela, total) / total) * 100}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => navegar(atual + 1)}
          className={botaoSeta}
          aria-label="Próximo slide"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
