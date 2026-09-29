// Valores de DS_SITUACAO_JULGAMENTO do arquivo complementar do TSE
// (julgamento do registro de candidatura).
export const situacoesCandidatura = [
  'DEFERIDO',
  'DEFERIDO EM PRAZO RECURSAL OU COM RECURSO',
  'PENDENTE DE JULGAMENTO',
  'INDEFERIDO EM PRAZO RECURSAL OU COM RECURSO',
  'INDEFERIDO',
  'RENÚNCIA',
  'CANCELADO',
  'PEDIDO NÃO CONHECIDO',
  'PEDIDO NÃO CONHECIDO EM PRAZO RECURSAL OU COM RECURSO',
  'FALECIMENTO',
];

export type SituacaoEstilo = {
  // Chip com o texto da situação
  badge: string;
  // Faixa de destaque no topo do card
  faixa: string;
  // Borda do card
  borda: string;
};

const estilos = {
  deferido: {
    badge: 'border-brasil-green/20 bg-brasil-green/10 text-brasil-green',
    faixa: 'bg-brasil-green',
    borda: 'border-brasil-green/30',
  },
  deferidoComRecurso: {
    badge: 'border-teal-200 bg-teal-50 text-teal-700',
    faixa: 'bg-teal-500',
    borda: 'border-teal-200',
  },
  pendente: {
    badge: 'border-amber-200 bg-amber-50 text-amber-700',
    faixa: 'bg-amber-400',
    borda: 'border-amber-200',
  },
  indeferidoComRecurso: {
    badge: 'border-orange-200 bg-orange-50 text-orange-700',
    faixa: 'bg-orange-500',
    borda: 'border-orange-200',
  },
  indeferido: {
    badge: 'border-red-200 bg-red-50 text-red-700',
    faixa: 'bg-red-500',
    borda: 'border-red-200',
  },
  encerrado: {
    badge: 'border-slate-300 bg-slate-100 text-slate-600',
    faixa: 'bg-slate-400',
    borda: 'border-slate-300',
  },
  naoInformado: {
    badge: 'border-slate-200 bg-slate-50 text-slate-500',
    faixa: 'bg-slate-200',
    borda: 'border-slate-200',
  },
} satisfies Record<string, SituacaoEstilo>;

export function estiloSituacao(situacao?: string | null): SituacaoEstilo {
  const valor = situacao?.trim().toUpperCase() ?? '';

  if (!valor) return estilos.naoInformado;

  const comRecurso = valor.includes('RECURS');

  if (valor.startsWith('DEFERIDO')) {
    return comRecurso ? estilos.deferidoComRecurso : estilos.deferido;
  }

  if (valor.startsWith('INDEFERIDO')) {
    return comRecurso ? estilos.indeferidoComRecurso : estilos.indeferido;
  }

  if (valor.includes('PENDENTE') || valor.includes('AGUARDANDO')) {
    return estilos.pendente;
  }

  // Renúncia, cancelamento, pedido não conhecido, falecimento
  return estilos.encerrado;
}

export function rotuloSituacao(situacao?: string | null) {
  return situacao?.trim() || 'Situação não informada';
}

// Código utilizado pelo DivulgaCandContas do TSE
const regioesPorUf: Record<string, string> = {
  AC: 'NORTE',
  AP: 'NORTE',
  AM: 'NORTE',
  PA: 'NORTE',
  RO: 'NORTE',
  RR: 'NORTE',
  TO: 'NORTE',

  AL: 'NORDESTE',
  BA: 'NORDESTE',
  CE: 'NORDESTE',
  MA: 'NORDESTE',
  PB: 'NORDESTE',
  PE: 'NORDESTE',
  PI: 'NORDESTE',
  RN: 'NORDESTE',
  SE: 'NORDESTE',

  DF: 'CENTROOESTE',
  GO: 'CENTROOESTE',
  MT: 'CENTROOESTE',
  MS: 'CENTROOESTE',

  ES: 'SUDESTE',
  MG: 'SUDESTE',
  RJ: 'SUDESTE',
  SP: 'SUDESTE',

  PR: 'SUL',
  RS: 'SUL',
  SC: 'SUL',
};

const codigoEleicao = '20322002026';

export function linkTseCandidatura(candidato: {
  descricaoEleicao: string | null;
  sqCandidato: string;
  anoEleicao: number;
  uf: string | null;
}) {
  if (candidato.descricaoEleicao?.toLowerCase().includes('federal')) {
    return `https://divulgacandcontas.tse.jus.br/divulga/#/candidato/BR/BR/${codigoEleicao}/${candidato.sqCandidato}/${candidato.anoEleicao}/BR`;
  }

  return `https://divulgacandcontas.tse.jus.br/divulga/#/candidato/${regioesPorUf[candidato.uf ?? '']}/${candidato.uf}/${codigoEleicao}/${candidato.sqCandidato}/${candidato.anoEleicao}/${candidato.uf}`;
}
