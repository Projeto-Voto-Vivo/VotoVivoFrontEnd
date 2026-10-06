const numero = new Intl.NumberFormat('pt-BR');

const compacto = new Intl.NumberFormat('pt-BR', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function formatNumero(valor?: number | null) {
  return valor === null || valor === undefined ? '—' : numero.format(valor);
}

export function formatCompacto(valor?: number | null) {
  return valor === null || valor === undefined ? '—' : compacto.format(valor);
}

// `valor` já em pontos percentuais (0–100)
export function formatPercentual(valor?: number | null, casas = 2) {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) {
    return '—';
  }

  return `${valor.toLocaleString('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  })}%`;
}

export function percentual(parte?: number | null, todo?: number | null) {
  if (parte === null || parte === undefined || !todo) return null;

  return (parte / todo) * 100;
}

export function rotuloTurno(turno: number) {
  return `${turno}º turno`;
}

export function formatDataHora(valor?: string | null) {
  if (!valor) return null;

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) return null;

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(data);
}

export type DesfechoEstilo = {
  rotulo: string;
  tipo: 'eleito' | 'segundoTurno' | 'outro';
  badge: string;
};

// Eleito e 2º turno vêm dos booleanos; o resto é o texto do TSE (suplente, não eleito...).
export function desfechoCandidato(resultado: {
  eleito: boolean;
  segundoTurno: boolean;
  situacao: string | null;
}): DesfechoEstilo {
  if (resultado.eleito) {
    return {
      rotulo: resultado.situacao?.trim() || 'Eleito',
      tipo: 'eleito',
      badge: 'border-brasil-green/20 bg-brasil-green/10 text-brasil-green',
    };
  }

  if (resultado.segundoTurno) {
    return {
      rotulo: resultado.situacao?.trim() || '2º turno',
      tipo: 'segundoTurno',
      badge: 'border-amber-200 bg-amber-50 text-amber-700',
    };
  }

  return {
    rotulo: resultado.situacao?.trim() || 'Sem resultado',
    tipo: 'outro',
    badge: 'border-slate-200 bg-slate-50 text-slate-600',
  };
}
