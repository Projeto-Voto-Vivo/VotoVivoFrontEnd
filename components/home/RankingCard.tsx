import Image from 'next/image';
import Link from 'next/link';
import { RankingParlamentarItem } from '@/services/parlamentares';

interface RankingCardProps {
  titulo: string;
  descricao: string;
  campo: 'totalDespesas' | 'totalEmendas';
  items: RankingParlamentarItem[];
  /** Cor do tema do card — define fundo do hero e cor do arco */
  variante: 'despesas' | 'emendas';
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
      nome
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? '')
        .join('') || 'VV';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" fill="#334155"/><text x="48" y="62" text-anchor="middle" font-size="28" font-family="Arial" fill="#e2e8f0">${label}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }
  return url;
}

function display(value?: string | null) {
  return value?.trim() || '—';
}

/**
 * Arco SVG proporcional ao valor do parlamentar em relação ao total dos 3.
 * A foto fica centralizada dentro do arco.
 */
function ArcoPerfil({
  fotoUrl,
  nome,
  proporcao,
  cor,
}: {
  fotoUrl: string;
  nome: string;
  proporcao: number; // 0–1
  cor: string; // stroke color hex
}) {
  const size = 120;
  const center = size / 2;
  const raio = 50;
  const espessura = 7;
  const circunferencia = 2 * Math.PI * raio;
  // arco começa no topo (−90°), vai no sentido horário
  const dashArray = circunferencia;
  const dashOffset = circunferencia * (1 - proporcao);

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      {/* Trilho cinza */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
        aria-hidden="true"
      >
        <circle
          cx={center}
          cy={center}
          r={raio}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={espessura}
        />
        {/* Arco colorido */}
        <circle
          cx={center}
          cy={center}
          r={raio}
          fill="none"
          stroke={cor}
          strokeWidth={espessura}
          strokeLinecap="round"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>

      {/* Foto centralizada dentro do arco */}
      <div
        className="absolute overflow-hidden rounded-full border-2 border-white/30"
        style={{
          width: size - espessura * 4,
          height: size - espessura * 4,
          top: espessura * 2,
          left: espessura * 2,
        }}
      >
        <Image
          src={normalizePhoto(fotoUrl, nome)}
          alt={nome}
          fill
          sizes="88px"
          className="object-cover object-top"
          unoptimized
        />
      </div>
    </div>
  );
}

const TEMAS = {
  despesas: {
    bg: 'bg-[#002776]',
    arco: '#ffdf00',
    badge: 'bg-white/10 text-white/80',
    valorCor: 'text-brasil-yellow',
    subtextoCor: 'text-white/60',
    nomeCor: 'text-white',
    divideCor: 'divide-white/10',
    borderCor: 'border-white/10',
    hoverBg: 'hover:bg-white/5',
  },
  emendas: {
    bg: 'bg-[#005c20]',
    arco: '#ffdf00',
    badge: 'bg-white/10 text-white/80',
    valorCor: 'text-brasil-yellow',
    subtextoCor: 'text-white/60',
    nomeCor: 'text-white',
    divideCor: 'divide-white/10',
    borderCor: 'border-white/10',
    hoverBg: 'hover:bg-white/5',
  },
} as const;

export function RankingCard({
  titulo,
  descricao,
  campo,
  items,
  variante,
}: RankingCardProps) {
  if (items.length === 0) return null;

  const tema = TEMAS[variante];
  const [primeiro, ...restantes] = items;
  const valorPrimeiro = primeiro[campo] ?? 0;
  const totalTres = items.reduce((acc, i) => acc + (i[campo] ?? 0), 0);
  const proporcao = totalTres > 0 ? valorPrimeiro / totalTres : 1;
  const campoLabel = campo === 'totalDespesas' ? 'em despesas' : 'em emendas pagas';

  return (
    <div className={`flex flex-col overflow-hidden rounded-3xl shadow-lg ${tema.bg}`}>

      {/* Cabeçalho */}
      <div className={`border-b px-5 pb-4 pt-5 md:px-6 md:pt-6 ${tema.borderCor}`}>
        <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${tema.subtextoCor}`}>
          Em destaque
        </p>
        <h3 className={`mt-1 text-base font-bold ${tema.nomeCor}`}>{titulo}</h3>
        <p className={`mt-1 text-xs leading-5 ${tema.subtextoCor}`}>{descricao}</p>
      </div>

      {/* Primeiro parlamentar — hero com arco */}
      <Link
        href={`/parlamentares/${primeiro.id}`}
        className={`group flex flex-col items-center gap-4 px-6 py-6 text-center transition-colors ${tema.hoverBg}`}
      >
        <ArcoPerfil
          fotoUrl={primeiro.urlFoto}
          nome={primeiro.nomeParlamentar}
          proporcao={proporcao}
          cor={tema.arco}
        />

        <div>
          <p className={`text-lg font-bold leading-tight ${tema.nomeCor}`}>
            {display(primeiro.nomeParlamentar)}
          </p>
          <p className={`mt-0.5 text-xs ${tema.subtextoCor}`}>
            {display(primeiro.siglaPartido)} · {display(primeiro.uf)} · {display(primeiro.cargo)}
          </p>
          <p className={`mt-3 text-sm font-bold ${tema.valorCor}`}>
            {formatCurrency(valorPrimeiro)}
          </p>
          <p className={`text-xs ${tema.subtextoCor}`}>{campoLabel}</p>
          <span className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold ${tema.valorCor} group-hover:underline`}>
            Ver perfil →
          </span>
        </div>
      </Link>

      {/* Segundo e terceiro — compactos */}
      {restantes.length > 0 && (
        <div className={`divide-y border-t ${tema.borderCor} ${tema.divideCor}`}>
          {restantes.map((item) => {
            const valor = item[campo] ?? 0;
            return (
              <Link
                key={item.id}
                href={`/parlamentares/${item.id}`}
                className={`group flex items-center gap-3 px-5 py-3.5 transition-colors ${tema.hoverBg}`}
              >
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-white/20 bg-white/10">
                  <Image
                    src={normalizePhoto(item.urlFoto, item.nomeParlamentar)}
                    alt={item.nomeParlamentar}
                    fill
                    sizes="36px"
                    className="object-cover object-top"
                    unoptimized
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-semibold group-hover:underline ${tema.nomeCor}`}>
                    {display(item.nomeParlamentar)}
                  </p>
                  <p className={`text-xs ${tema.subtextoCor}`}>
                    {display(item.siglaPartido)} · {display(item.uf)}
                  </p>
                </div>
                <span className={`shrink-0 text-xs font-semibold ${tema.valorCor}`}>
                  {formatCurrency(valor)}
                </span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Rodapé */}
      <div className={`mt-auto border-t px-5 py-4 ${tema.borderCor}`}>
        <Link
          href="/parlamentares"
          className={`text-xs font-semibold ${tema.valorCor} hover:underline`}
        >
          Explorar todos os parlamentares →
        </Link>
      </div>
    </div>
  );
}
