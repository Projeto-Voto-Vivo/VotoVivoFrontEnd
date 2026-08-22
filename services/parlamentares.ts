import api from './api';
import {
  AlinhamentoPartidario,
  AlinhamentoPorTema,
  CasaLegislativaFiltro,
  CategoriaDespesaPerfil,
  ComissaoPerfil,
  Despesa,
  DespesasPerfil,
  DocumentoEmendaPerfil,
  EmendaDetalhe,
  EmendaParlamentarVinculado,
  EmendaResumoPerfil,
  EmendasPerfil,
  FiliacaoPartidariaPerfil,
  ItemDespesaPerfil,
  ListaParlamentaresResponse,
  FiltrosVotacao,
  MandatoExercicioPerfil,
  MotivoSemAlinhamento,
  ObjetoVotacao,
  Parlamentar,
  ParlamentarDetalhe,
  ParlamentarPerfil,
  PerfilIndicador,
  PerfilTematico,
  PresencaDetalhe,
  PresencaPerfil,
  PresencaPorEscopo,
  ProposicaoDaVotacao,
  ProposicaoPerfil,
  UFs,
  VotacaoPerfil,
  VotacoesPerfil,
} from '@/types';

const PAGE_SIZE = 20;
const DESPESAS_PAGE_SIZE = 5;
const VOTACOES_PAGE_SIZE = 5;
const EMENDAS_PAGE_SIZE = 5;
const PROPOSICOES_PAGE_SIZE = 20;

/** Páginas por dimensão (nome/partido/UF) na busca livre da home. */
const MAX_PAGINAS_BUSCA = 5;

type TipoParlamentarFiltro = 'deputados' | 'senadores';

const CASA_POR_TIPO: Record<TipoParlamentarFiltro, CasaLegislativaFiltro> = {
  deputados: 'camara',
  senadores: 'senado',
};

type BackendParlamentarResumo = {
  id: number;
  nomeParlamentar?: string | null;
  siglaPartido?: string | null;
  uf?: string | null;
  urlFoto?: string | null;
  cargo?: string | null;
  casa?: string | null;
  legislatura?: string | number | null;
  condicaoMandato?: string | null;
  condicao_mandato?: string | null;
  situacaoMandato?: string | null;
};

type BackendParlamentarDetalhe = BackendParlamentarResumo & {
  nomeCivil?: string | null;
  dataNascimento?: string | null;
  email?: string | null;
  gabinete?: {
    telefone?: string | null;
    endereco?: string | null;
  } | null;
  redesSociais?: { rede?: string | null; url?: string | null }[] | null;
};

type BackendPaginated<T> = {
  data?: T[];
  meta?: {
    total?: number;
    page?: number;
    pagina?: number;
    lastPage?: number;
    totalPaginas?: number;
    limit?: number;
    limite?: number;
  };
};

type PaginacaoNormalizada = {
  total: number;
  page: number;
  lastPage: number;
  limit: number;
};

type ListaDespesasResponse = {
  data: Despesa[];
  meta: PaginacaoNormalizada;
};

type BackendDespesaCategoria = {
  tipoDespesa?: string | null;
  total?: string | number | null;
};

type BackendDespesaResumo = {
  totalAno?: string | number | null;
  mediaMensal?: string | number | null;
  maiorReembolso?: string | number | null;
  anoReferencia?: string | number | null;
  /** Meses com dados dentro do exercício — base correta da média mensal. */
  mesesComDados?: string | number | null;
  mesesConsiderados?: string | number | null;
  categorias?: BackendDespesaCategoria[] | null;
};

type BackendVotacaoResumo = {
  id?: string | number | null;
  data?: string | null;
  resumo?: string | null;
  descricao?: string | null;
  voto?: string | null;
  resultado?: string | null;
  tipo?: string | null;
  tipoVotacao?: string | null;
  casa?: string | null;
  orientacaoPartido?: string | null;
  orientacao?: string | null;
  siglaPartido?: string | null;
  siglaPartidoNaData?: string | null;
  seguiuOrientacao?: boolean | null;
  objeto?: string | null;
  merito?: boolean | null;
  proposicao?: {
    id?: number | null;
    tipo?: string | null;
    sigla?: string | null;
    numero?: string | number | null;
    ano?: number | null;
    ementa?: string | null;
    situacao?: string | null;
  } | null;
};

export type ListaVotacoesResponse = {
  data: VotacaoPerfil[];
  meta: PaginacaoNormalizada;
  /**
   * Votações sem proposição vinculada que os filtros deixaram de fora. Zero
   * quando nenhum filtro está ativo — aí elas estão no resultado.
   */
  votacoesSemProposicaoExcluidas: number;
};

type BackendPresencaBloco = {
  /** Presenças + justificadas ÷ total. */
  taxa?: string | number | null;
  /** Só presenças efetivas. */
  taxaEstrita?: string | number | null;
  total?: string | number | null;
  presentes?: string | number | null;
  justificadas?: string | number | null;
  faltas?: string | number | null;
  /** Nome do denominador na versão anterior da API. */
  totalEventos?: string | number | null;
  percentual?: string | number | null;
};

/** Cada escopo vem separado por natureza do evento. */
type BackendPresencaEscopo = {
  deliberativas?: BackendPresencaBloco | null;
  naoDeliberativas?: BackendPresencaBloco | null;
};

type BackendPresencaResponse = {
  presenca?: {
    plenario?: BackendPresencaEscopo | BackendPresencaBloco | null;
    comissoes?: BackendPresencaEscopo | BackendPresencaBloco | null;
    excluidos?: {
      eventosSemClassificacao?: number | null;
      eventosSemOrgao?: number | null;
    } | null;
    janela?: {
      restritaAoExercicio?: boolean | null;
      periodos?: { inicio?: string | null; fim?: string | null }[] | null;
    } | null;
    metodologia?: {
      casa?: string | null;
      fonte?: string | null;
      observacao?: string | null;
    }[] | null;
  } | null;
};

type BackendEmendaResumo = {
  id?: number | null;
  idEmenda?: number | null;
  codigoEmenda?: string | null;
  ano?: number | null;
  tipoEmenda?: string | null;
  autor?: string | null;
  nomeAutor?: string | null;
  numeroEmenda?: string | null;
  localidadeDoGasto?: string | null;
  funcao?: string | null;
  subfuncao?: string | null;
  valorEmpenhado?: string | number | null;
  valorLiquidado?: string | number | null;
  valorPago?: string | number | null;
  valorRestoInscrito?: string | number | null;
  valorRestoCancelado?: string | number | null;
  valorRestoPago?: string | number | null;
  metodoVinculo?: string | null;
  confiancaVinculo?: string | number | null;
};

type BackendDocumentoEmenda = {
  id?: number | null;
  idEmenda?: number | null;
  codigoEmenda?: string | null;
  data?: string | null;
  fase?: string | null;
  codigoDocumento?: string | null;
  codigoDocumentoResumido?: string | null;
  especieTipo?: string | null;
  tipoEmenda?: string | null;
  urlPortal?: string | null;
};

type BackendEmendaParlamentar = {
  id?: number | null;
  nomeCivil?: string | null;
  nomeUrna?: string | null;
  partidoAtual?: string | null;
  uf?: string | null;
  fotoUrl?: string | null;
  metodoVinculo?: string | null;
  confiancaVinculo?: string | number | null;
};

type BackendEmendaDetalhe = BackendEmendaResumo & {
  documentos?: BackendDocumentoEmenda[] | null;
  parlamentares?: BackendEmendaParlamentar[] | null;
};

type BackendComissao = {
  id?: number | null;
  idOrgao?: number | null;
  nome?: string | null;
  nomeOrgao?: string | null;
  sigla?: string | null;
  siglaOrgao?: string | null;
  tipoOrgao?: string | null;
  papel?: string | null;
  titulo?: string | null;
  cargo?: string | null;
  dataInicio?: string | null;
  dataFim?: string | null;
};

type BackendFiliacao = {
  id?: number | null;
  siglaPartido?: string | null;
  sigla?: string | null;
  nomePartido?: string | null;
  nome?: string | null;
  dataInicio?: string | null;
  dataFim?: string | null;
};

type BackendMandato = {
  id?: number | null;
  casa?: string | null;
  legislatura?: string | number | null;
  dataInicio?: string | null;
  dataFim?: string | null;
  condicao?: string | null;
  condicaoMandato?: string | null;
};

const DESPESA_DESCRICOES: Record<string, string> = {
  'Passagens e deslocamentos':
    'Custeia viagens e deslocamentos ligados à atividade parlamentar.',
  'Divulgação da atividade parlamentar':
    'Comunicação do mandato e ações de prestação de contas.',
  'Consultorias e pesquisas':
    'Apoio técnico para estudos, notas e preparação de proposições.',
  'Escritório de apoio':
    'Operação administrativa e manutenção do escritório político.',
  'Emissão de Bilhete Aéreo':
    'Despesas com viagens ligadas ao exercício do mandato.',
  Hospedagem: 'Custos de estadia vinculados a agendas parlamentares.',
  'Divulgação da Atividade Parlamentar':
    'Gastos com comunicação institucional e divulgação do mandato.',
  'Combustíveis e Lubrificantes':
    'Despesas de deslocamento terrestre e apoio logístico.',
};

const encodeSvg = (svg: string) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

function shortCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(value);
}

function toCapitalizedCategory(category: string) {
  return category
    .split(' ')
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1).toLowerCase() : part))
    .join(' ');
}

function normalizeToken(value?: string | null) {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

function getFallbackPhoto(nome: string) {
  const label =
    nome
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'VV';

  return encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="#e2e8f0" />
      <circle cx="200" cy="120" r="54" fill="#94a3b8" />
      <path d="M105 255c12-43 51-73 95-73s83 30 95 73" fill="#94a3b8" />
      <text x="200" y="286" text-anchor="middle" font-size="24" font-family="Arial, sans-serif" fill="#334155">${label}</text>
    </svg>
  `);
}

function normalizePhoto(url: string | null | undefined, nome: string) {
  if (!url || url.includes('example.com')) {
    return getFallbackPhoto(nome);
  }

  return url;
}

function parseOfficeAddress(address?: string | null) {
  if (!address) {
    return { predio: 'Gabinete parlamentar', sala: '—' };
  }

  const [predioRaw, salaRaw] = address.split(',').map((part) => part.trim());
  const sala = salaRaw?.replace(/gabinete/i, '').trim() || '—';

  return {
    predio: predioRaw || 'Gabinete parlamentar',
    sala,
  };
}

function getCasaLegislativa(cargo?: string | null, casa?: string | null) {
  const normalizedCasa = normalizeToken(casa);

  if (normalizedCasa.includes('SENADO')) return 'Senado Federal';
  if (normalizedCasa.includes('CAMARA')) return 'Câmara dos Deputados';
  if (normalizedCasa.includes('CONGRESSO')) return 'Congresso Nacional';

  const normalizedCargo = normalizeToken(cargo);

  if (normalizedCargo.includes('SENADOR')) return 'Senado Federal';
  if (normalizedCargo.includes('DEPUTAD')) return 'Câmara dos Deputados';

  return 'Poder Legislativo';
}

/**
 * Aceita tanto o formato ISO devolvido pelo Prisma/`Decimal` ("1234.56")
 * quanto o formato pt-BR ("R$ 1.234,56"). A versão anterior removia todos os
 * pontos, o que transformava "1234.56" em 123456 silenciosamente.
 */
export function parseMoney(value?: string | number | null): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (value === null || value === undefined) return 0;

  const raw = String(value).trim();
  if (!raw) return 0;

  // Tem vírgula → decimal pt-BR: ponto é separador de milhar.
  if (raw.includes(',')) {
    const ptBr = raw.replace(/[^\d,-]/g, '').replace(',', '.');
    const parsed = Number(ptBr);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const semRuido = raw.replace(/[^\d.eE+-]/g, '');

  // Agrupamento de milhar sem decimais ("1.234", "12.345.678").
  if (/^-?\d{1,3}(\.\d{3})+$/.test(semRuido)) {
    const parsed = Number(semRuido.replace(/\./g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const parsed = Number(semRuido);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parsePercent(value?: string | number | null): number | null {
  if (value === null || value === undefined || value === '') return null;

  const parsed = typeof value === 'number' ? value : Number(String(value).replace(',', '.'));
  if (!Number.isFinite(parsed)) return null;

  // Taxa pode chegar como fração (0–1) ou percentual (0–100).
  const percentual = parsed > 0 && parsed <= 1 ? parsed * 100 : parsed;

  return Math.min(100, Math.max(0, Math.round(percentual)));
}

function normalizeMeta(
  meta: BackendPaginated<unknown>['meta'],
  fallbackPage: number,
  fallbackLimit: number,
  fallbackTotal: number,
): PaginacaoNormalizada {
  const limit = Number(meta?.limit ?? meta?.limite ?? fallbackLimit) || fallbackLimit;
  const total = Number(meta?.total ?? fallbackTotal) || 0;
  const lastPageBruta = Number(meta?.lastPage ?? meta?.totalPaginas ?? 0);

  return {
    total,
    page: Number(meta?.page ?? meta?.pagina ?? fallbackPage) || fallbackPage,
    lastPage: lastPageBruta > 0 ? lastPageBruta : Math.max(1, Math.ceil(total / limit)),
    limit,
  };
}

function unwrapList<T>(payload: BackendPaginated<T> | T[] | null | undefined): {
  itens: T[];
  meta: BackendPaginated<T>['meta'];
} {
  if (Array.isArray(payload)) {
    return { itens: payload, meta: undefined };
  }

  return {
    itens: Array.isArray(payload?.data) ? (payload?.data as T[]) : [],
    meta: payload?.meta,
  };
}

function mapResumo(item: BackendParlamentarResumo): Parlamentar {
  const nomeParlamentar = item.nomeParlamentar?.trim() || 'Parlamentar';
  const cargo = item.cargo?.trim() || 'Parlamentar';
  const condicao =
    item.condicaoMandato?.trim() ||
    item.condicao_mandato?.trim() ||
    item.situacaoMandato?.trim() ||
    null;

  return {
    id: item.id,
    nomeParlamentar,
    siglaPartido: item.siglaPartido?.trim() || 'Sem partido',
    uf: item.uf?.trim() || '--',
    urlFoto: normalizePhoto(item.urlFoto, nomeParlamentar),
    cargo,
    casaLegislativa: getCasaLegislativa(cargo, item.casa),
    legislatura: item.legislatura ? String(item.legislatura) : undefined,
    situacaoMandato: condicao,
    situacao: condicao,
  };
}

function matchesTipoParlamentar(
  parlamentar: Parlamentar,
  tipo?: TipoParlamentarFiltro,
) {
  if (!tipo) return true;

  const cargo = normalizeToken(parlamentar.cargo);

  if (tipo === 'senadores') {
    return cargo.includes('SENADOR');
  }

  return cargo.includes('DEPUTAD');
}

function paginateParlamentares(
  list: Parlamentar[],
  page: number,
): ListaParlamentaresResponse {
  const total = list.length;
  const totalPaginas = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pagina = Math.min(Math.max(page, 1), totalPaginas);
  const inicio = (pagina - 1) * PAGE_SIZE;

  return {
    data: list.slice(inicio, inicio + PAGE_SIZE),
    meta: {
      total,
      totalPaginas,
      pagina,
      fonte: 'api',
    },
  };
}

function mapDetalhe(item: BackendParlamentarDetalhe): ParlamentarDetalhe {
  const base = mapResumo(item);
  const gabinete = parseOfficeAddress(item.gabinete?.endereco || null);
  const emailBase = item.email?.trim() || '';

  return {
    ...base,
    situacao: base.situacaoMandato ?? null,
    nomeCivil: item.nomeCivil?.trim() || base.nomeParlamentar,
    dataNascimento: item.dataNascimento || '',
    email: emailBase,
    gabinete: {
      telefone: item.gabinete?.telefone || '',
      email: emailBase,
      endereco: item.gabinete?.endereco || '',
      sala: gabinete.sala,
      predio: gabinete.predio,
    },
    redesSociais: (item.redesSociais || [])
      .filter((rede) => rede?.rede && rede?.url)
      .map((rede) => ({
        rede: String(rede.rede),
        url: String(rede.url),
      })),
  };
}

/**
 * Enum canônico de voto do banco (7 valores). O Prisma passou a devolver
 * `OBSTRUCAO` e `NAO REGISTRADO`, que antes vazavam crus para a interface.
 */
const VOTO_LABELS: Record<string, string> = {
  SIM: 'Sim',
  NAO: 'Não',
  ABSTENCAO: 'Abstenção',
  OBSTRUCAO: 'Obstrução',
  'AUSENCIA JUSTIFICADA': 'Ausência justificada',
  AUSENTE: 'Ausente',
  'NAO REGISTRADO': 'Voto não registrado',
};

export const VOTO_EXPLICACOES: Record<string, string> = {
  Sim: 'Votou a favor da matéria.',
  Não: 'Votou contra a matéria.',
  Abstenção: 'Estava presente e optou por não votar a favor nem contra.',
  Obstrução:
    'Manobra regimental: o parlamentar está presente, mas não vota, para dificultar o quórum e atrasar a votação. Não é falta.',
  'Ausência justificada':
    'Falta abonada pela Mesa (licença, missão oficial ou motivo de saúde).',
  Ausente: 'Não registrou presença na votação.',
  'Voto não registrado':
    'A votação ocorreu, mas o painel não registrou o voto deste parlamentar.',
};

/** Votos que representam posicionamento comparável com a orientação do partido. */
const VOTOS_POSICIONADOS = new Set(['SIM', 'NAO', 'ABSTENCAO', 'OBSTRUCAO']);

export function formatVotingChoice(choice?: string | null) {
  const normalized = normalizeToken(choice);
  if (!normalized) return 'Não informado';

  return VOTO_LABELS[normalized] || 'Não informado';
}

export function formatVotingType(type?: string | null) {
  const normalized = normalizeToken(type);

  const labels: Record<string, string> = {
    NOMINAL: 'Votação nominal',
    SIMBOLICA: 'Votação simbólica',
    SECRETA: 'Votação secreta',
  };

  return labels[normalized] || type || 'Votação';
}

export function formatCasa(casa?: string | null) {
  const normalized = normalizeToken(casa);
  if (!normalized) return null;
  if (normalized.includes('SENADO')) return 'Senado Federal';
  if (normalized.includes('CAMARA')) return 'Câmara dos Deputados';
  if (normalized.includes('CONGRESSO')) return 'Congresso Nacional';
  return casa ?? null;
}

function buildVotingHeadline(summary: string) {
  const normalized = summary.trim();

  if (!normalized || normalized === 'Resumo não informado.') {
    return 'Registro de votação';
  }

  if (/requerimento/i.test(normalized)) {
    return 'Votação sobre requerimento';
  }

  if (/emenda/i.test(normalized)) {
    return 'Votação sobre emenda';
  }

  if (/projeto|proposi[cç][aã]o|mat[eé]ria/i.test(normalized)) {
    return 'Votação sobre proposição';
  }

  if (/^(aprovad[ao]|rejeitad[ao]|retirad[ao]|prejudicad[ao]|mantid[ao])\b/i.test(normalized)) {
    return 'Deliberação registrada';
  }

  return normalized.length > 90 ? `${normalized.slice(0, 87).trim()}...` : normalized;
}

function resolveSeguiuOrientacao(
  voto: string | null,
  orientacao: string | null,
  informado?: boolean | null,
): boolean | null {
  if (typeof informado === 'boolean') return informado;

  const votoNormalizado = normalizeToken(voto);
  const orientacaoNormalizada = normalizeToken(orientacao);

  if (!votoNormalizado || !orientacaoNormalizada) return null;
  if (orientacaoNormalizada.includes('LIBERAD')) return null;
  if (!VOTOS_POSICIONADOS.has(votoNormalizado)) return null;
  if (!VOTOS_POSICIONADOS.has(orientacaoNormalizada)) return null;

  return votoNormalizado === orientacaoNormalizada;
}

/**
 * Toda votação nasce de alguma coisa, mas nem toda votação tem proposição:
 * requerimento e questão de ordem não têm. `null` aqui é ausência de vínculo,
 * não dado faltando — e a interface diz isso em vez de deixar o card mudo.
 */
function mapProposicaoDaVotacao(
  proposicao: BackendVotacaoResumo['proposicao'],
): ProposicaoDaVotacao | null {
  const id = Number(proposicao?.id ?? 0);
  if (!proposicao || !id) return null;

  const sigla = (proposicao.tipo ?? proposicao.sigla ?? '').trim() || 'Proposição';
  const numero =
    proposicao.numero === null || proposicao.numero === undefined
      ? 'S/N'
      : String(proposicao.numero);
  const ano = proposicao.ano ? String(proposicao.ano) : 's/ano';

  return {
    id,
    titulo: `${sigla} ${numero}/${ano}`,
    ementa: proposicao.ementa?.trim() || null,
    situacao: proposicao.situacao?.trim() || null,
  };
}

const OBJETOS_VOTACAO: ObjetoVotacao[] = [
  'TEXTO_BASE',
  'PARECER',
  'EMENDA',
  'DESTAQUE',
  'REQUERIMENTO',
  'REDACAO_FINAL',
  'ENCAMINHAMENTO',
  'INDEFINIDO',
];

/** Rótulos de leitura para o objeto da votação. */
export const OBJETO_VOTACAO_LABELS: Record<ObjetoVotacao, string> = {
  TEXTO_BASE: 'Texto-base',
  PARECER: 'Parecer',
  EMENDA: 'Emenda',
  DESTAQUE: 'Destaque',
  REQUERIMENTO: 'Requerimento',
  REDACAO_FINAL: 'Redação final',
  ENCAMINHAMENTO: 'Encaminhamento',
  INDEFINIDO: 'Objeto não identificado',
};

function mapObjetoVotacao(valor?: string | null): ObjetoVotacao | null {
  const chave = normalizeToken(valor).replace(/ /g, '_') as ObjetoVotacao;
  return OBJETOS_VOTACAO.includes(chave) ? chave : null;
}

function mapVotacaoResumo(item: BackendVotacaoResumo, index: number): VotacaoPerfil {
  const id = String(item.id ?? `${item.data ?? 'votacao'}-${index}`);
  const resumo = item.resumo?.trim() || item.descricao?.trim() || 'Resumo não informado.';
  const tipoVotacao = formatVotingType(item.tipoVotacao ?? item.tipo);
  const votoOriginal = item.voto ? normalizeToken(item.voto) : null;
  const orientacaoBruta = item.orientacaoPartido ?? item.orientacao ?? null;

  return {
    id,
    titulo: tipoVotacao,
    data: item.data || '',
    descricao: buildVotingHeadline(resumo),
    resumo,
    proposicao: mapProposicaoDaVotacao(item.proposicao),
    objeto: mapObjetoVotacao(item.objeto),
    merito: item.merito === true,
    voto: formatVotingChoice(item.voto),
    votoOriginal,
    resultado: item.resultado || 'Resultado não informado',
    tipoVotacao,
    casa: formatCasa(item.casa),
    orientacaoPartido: orientacaoBruta ? formatVotingChoice(orientacaoBruta) : null,
    siglaPartidoNaData: item.siglaPartidoNaData ?? item.siglaPartido ?? null,
    seguiuOrientacao: resolveSeguiuOrientacao(
      item.voto ?? null,
      orientacaoBruta,
      item.seguiuOrientacao,
    ),
  };
}

function buildCategoriasFromBackend(
  summary: BackendDespesaCategoria[] | undefined | null,
): CategoriaDespesaPerfil[] {
  return (summary ?? [])
    .map((item) => {
      const categoria = item.tipoDespesa || 'Não informado';

      return {
        categoria,
        valor: parseMoney(item.total),
        descricao:
          DESPESA_DESCRICOES[categoria] || toCapitalizedCategory(categoria),
      };
    })
    .filter((item) => item.valor > 0)
    .sort((a, b) => b.valor - a.valor);
}

function buildItensFromBackend(
  items: Despesa[],
  offset: number = 0,
): ItemDespesaPerfil[] {
  return items.map((item, index) => ({
    data: item.data || '',
    tipo: item.tipo || 'Tipo não informado',
    fornecedor: item.fornecedor || 'Fornecedor não informado',
    valor: parseMoney(item.valor),
    documentoLabel: item.urlDocumento
      ? `Documento ${offset + index + 1}`
      : `Registro ${offset + index + 1}`,
    urlDocumento: item.urlDocumento || null,
  }));
}

function inferExpenseYear(items: Despesa[]): number | null {
  const years = items
    .map((item) => {
      const year = item.data ? new Date(item.data).getFullYear() : Number.NaN;
      return Number.isFinite(year) ? year : null;
    })
    .filter((year): year is number => Boolean(year));

  return years.length > 0 ? Math.max(...years) : null;
}

function mapEmendaResumo(item: BackendEmendaResumo): EmendaResumoPerfil {
  const id = Number(item.id ?? item.idEmenda ?? 0);
  const confianca =
    item.confiancaVinculo === null || item.confiancaVinculo === undefined
      ? null
      : Number(item.confiancaVinculo);

  return {
    id,
    codigoEmenda: item.codigoEmenda ?? '',
    ano: item.ano ?? null,
    tipoEmenda: item.tipoEmenda ?? null,
    autor: item.autor ?? null,
    nomeAutor: item.nomeAutor ?? null,
    numeroEmenda: item.numeroEmenda ?? null,
    localidadeDoGasto: item.localidadeDoGasto ?? null,
    funcao: item.funcao ?? null,
    subfuncao: item.subfuncao ?? null,
    valorEmpenhado: parseMoney(item.valorEmpenhado),
    valorLiquidado: parseMoney(item.valorLiquidado),
    valorPago: parseMoney(item.valorPago),
    valorRestoInscrito: parseMoney(item.valorRestoInscrito),
    valorRestoCancelado: parseMoney(item.valorRestoCancelado),
    valorRestoPago: parseMoney(item.valorRestoPago),
    metodoVinculo: item.metodoVinculo ?? null,
    confiancaVinculo: confianca !== null && Number.isFinite(confianca) ? confianca : null,
  };
}

function mapDocumentoEmenda(item: BackendDocumentoEmenda): DocumentoEmendaPerfil {
  return {
    id: Number(item.id ?? 0),
    idEmenda: item.idEmenda ?? undefined,
    codigoEmenda: item.codigoEmenda ?? undefined,
    data: item.data ?? null,
    fase: item.fase ?? null,
    codigoDocumento: item.codigoDocumento ?? null,
    codigoDocumentoResumido: item.codigoDocumentoResumido ?? null,
    especieTipo: item.especieTipo ?? null,
    tipoEmenda: item.tipoEmenda ?? null,
    urlPortal: item.urlPortal ?? null,
  };
}

function mapEmendaParlamentar(
  item: BackendEmendaParlamentar,
): EmendaParlamentarVinculado {
  const confianca =
    item.confiancaVinculo === null || item.confiancaVinculo === undefined
      ? null
      : Number(item.confiancaVinculo);

  return {
    id: Number(item.id ?? 0),
    nomeCivil: item.nomeCivil ?? null,
    nomeUrna: item.nomeUrna ?? null,
    partidoAtual: item.partidoAtual ?? null,
    uf: item.uf ?? null,
    fotoUrl: item.fotoUrl ?? null,
    metodoVinculo: item.metodoVinculo ?? null,
    confiancaVinculo: confianca !== null && Number.isFinite(confianca) ? confianca : null,
  };
}

/**
 * O `metodoVinculo` do banco é uma etiqueta técnica
 * (`match_exato_nomeUrna_normalizado`) que não diz nada a quem lê — e mostrá-la
 * crua tira a credibilidade da informação em vez de sustentá-la. Aqui ela vira
 * frase, e o único pedaço realmente informativo dela, qual nome casou, é o que
 * sobrevive.
 *
 * Nenhum destes vínculos é "declarado na fonte oficial": o Portal da
 * Transparência publica o nome do autor em texto livre, e a ligação com o
 * parlamentar é sempre feita por correspondência de nome. Confiança alta
 * significa que só um parlamentar casou com aquele nome, não que a fonte
 * afirmou a autoria.
 */
export function descreveVinculoEmenda(
  metodo?: string | null,
  confianca?: number | null,
): string | null {
  const chave = (metodo ?? '').toLowerCase().replace(/[^a-z]/g, '');
  const campo = chave.includes('nomeurna')
    ? 'nome de urna'
    : chave.includes('nomecivil')
      ? 'nome civil'
      : null;

  const porNome = campo
    ? `pela correspondência do ${campo} publicado pelo Portal da Transparência`
    : 'pela correspondência do nome publicado pelo Portal da Transparência';

  if (confianca === null || confianca === undefined) {
    return metodo ? `Vínculo feito ${porNome}.` : null;
  }

  // A confiança chega como 0–1 ou 0–100 conforme a origem.
  const percentual = Math.round((confianca > 1 ? confianca / 100 : confianca) * 100);

  return percentual >= 100
    ? `Vínculo feito ${porNome}, sem outro parlamentar de nome igual.`
    : `Vínculo feito ${porNome}, com nome semelhante ao de outros parlamentares — pode conter erro.`;
}

export async function getParlamentarById(id: number): Promise<ParlamentarDetalhe | null> {
  try {
    const res = await api.get(`/parlamentares/${id}`);

    if (!res.data) return null;

    return mapDetalhe(res.data as BackendParlamentarDetalhe);
  } catch {
    console.warn('Não foi possível carregar parlamentar do backend.');
    return null;
  }
}

type FiltrosParlamentares = {
  nome?: string;
  uf?: string;
  partido?: string;
  tipo?: TipoParlamentarFiltro;
  /** Termo único da busca da home: procurado em nome, partido e UF. */
  busca?: string;
};

function buildParlamentaresParams(
  pagina: number,
  filtros: Omit<FiltrosParlamentares, 'busca'>,
) {
  const params = new URLSearchParams();

  params.append('pagina', String(pagina));
  if (filtros.nome) params.append('nome', filtros.nome);
  if (filtros.uf) params.append('uf', filtros.uf);
  if (filtros.partido) params.append('partido', filtros.partido);
  if (filtros.tipo) params.append('casa', CASA_POR_TIPO[filtros.tipo]);

  return params.toString();
}

async function fetchParlamentaresPagina(
  pagina: number,
  filtros: Omit<FiltrosParlamentares, 'busca'>,
) {
  const res = await api.get(
    `/parlamentares?${buildParlamentaresParams(pagina, filtros)}`,
  );

  const { itens, meta } = unwrapList<BackendParlamentarResumo>(res.data);

  return { itens: itens.map(mapResumo), meta };
}

/**
 * A busca da home manda um termo só. Antes ele ia sempre para `nome`, então
 * "PT" e "SP" nunca achavam nada. Aqui o termo é procurado nas três dimensões
 * e os resultados são unificados por id.
 */
async function buscarPorTermoLivre(
  termo: string,
  page: number,
  tipo?: TipoParlamentarFiltro,
): Promise<ListaParlamentaresResponse> {
  const termoNormalizado = termo.trim();
  const ehUf = (UFs as readonly string[]).includes(termoNormalizado.toUpperCase());

  const dimensoes: Omit<FiltrosParlamentares, 'busca'>[] = [
    { nome: termoNormalizado, tipo },
    { partido: termoNormalizado, tipo },
  ];

  if (ehUf) {
    dimensoes.push({ uf: termoNormalizado.toUpperCase(), tipo });
  }

  const resultados = await Promise.all(
    dimensoes.map(async (filtros) => {
      try {
        const primeira = await fetchParlamentaresPagina(1, filtros);
        const meta = normalizeMeta(primeira.meta, 1, PAGE_SIZE, primeira.itens.length);
        const paginasExtras = Math.min(meta.lastPage, MAX_PAGINAS_BUSCA) - 1;

        if (paginasExtras <= 0) {
          return { itens: primeira.itens, truncado: meta.lastPage > MAX_PAGINAS_BUSCA };
        }

        const extras = await Promise.all(
          Array.from({ length: paginasExtras }, (_, index) =>
            fetchParlamentaresPagina(index + 2, filtros).then((r) => r.itens),
          ),
        );

        return {
          itens: [...primeira.itens, ...extras.flat()],
          truncado: meta.lastPage > MAX_PAGINAS_BUSCA,
        };
      } catch {
        return { itens: [] as Parlamentar[], truncado: false };
      }
    }),
  );

  const porId = new Map<number, Parlamentar>();
  resultados
    .flatMap((resultado) => resultado.itens)
    .filter((item) => matchesTipoParlamentar(item, tipo))
    .forEach((item) => {
      if (!porId.has(item.id)) porId.set(item.id, item);
    });

  const unificados = Array.from(porId.values()).sort((a, b) =>
    a.nomeParlamentar.localeCompare(b.nomeParlamentar, 'pt-BR'),
  );

  const paginado = paginateParlamentares(unificados, page);
  const truncado = resultados.some((resultado) => resultado.truncado);

  return {
    ...paginado,
    meta: {
      ...paginado.meta,
      aviso: unificados.length === 0
        ? `Nenhum parlamentar encontrado para "${termoNormalizado}" em nome, partido ou UF.`
        : truncado
          ? 'Encontramos muitos resultados e estamos mostrando os primeiros. Use os filtros para chegar a quem você procura.'
          : undefined,
    },
  };
}

export async function getParlamentaresLista(
  page: number = 1,
  nome?: string,
  uf?: string,
  partido?: string,
  tipo?: TipoParlamentarFiltro,
  busca?: string,
): Promise<ListaParlamentaresResponse> {
  try {
    if (busca?.trim()) {
      return await buscarPorTermoLivre(busca, page, tipo);
    }

    const filtros = { nome, uf, partido, tipo };
    const primeira = await fetchParlamentaresPagina(page, filtros);
    const meta = normalizeMeta(primeira.meta, page, PAGE_SIZE, primeira.itens.length);

    if (tipo && !(await backendFiltraPorCasa(primeira.itens, filtros))) {
      return await listarComFiltroEmMemoria(page, { nome, uf, partido }, tipo);
    }

    return {
      data: primeira.itens,
      meta: {
        total: meta.total,
        totalPaginas: meta.lastPage,
        pagina: meta.page,
        fonte: 'api',
        aviso:
          primeira.itens.length === 0
            ? 'Nenhum parlamentar encontrado para os filtros informados.'
            : undefined,
      },
    };
  } catch (error){
    console.warn('Não foi possível carregar a lista de parlamentares do backend.');
    console.error("Network or Parse Error:", error);
		return {
      data: [],
      meta: {
        total: 0,
        totalPaginas: 1,
        pagina: page,
        fonte: 'api',
        aviso:
          'Não conseguimos carregar os parlamentares agora. Tente novamente em alguns instantes.',
      },
    };
  }
}

/**
 * O backend passou a aceitar `casa` em `GET /parlamentares` (Fase 3). Se a
 * versão publicada ainda ignorar o parâmetro, a listagem volta misturada e é
 * preciso cair no filtro em memória.
 *
 * A sonda usa o Senado de propósito: senadores são minoria, então uma página
 * só de senadores é evidência forte de que o filtro foi aplicado. Fazer a
 * verificação pela Câmara daria falso positivo, já que a primeira página do
 * universo inteiro tende a ser toda de deputados.
 */
async function backendFiltraPorCasa(
  itensDaPrimeiraPagina: Parlamentar[],
  filtros: Omit<FiltrosParlamentares, 'busca'>,
): Promise<boolean> {
  if (filtros.tipo === 'senadores') {
    return (
      itensDaPrimeiraPagina.length > 0 &&
      itensDaPrimeiraPagina.every((item) => matchesTipoParlamentar(item, 'senadores'))
    );
  }

  // Filtro de deputados: um senador na lista já denuncia o parâmetro ignorado.
  if (itensDaPrimeiraPagina.some((item) => !matchesTipoParlamentar(item, 'deputados'))) {
    return false;
  }

  try {
    const sonda = await fetchParlamentaresPagina(1, { ...filtros, tipo: 'senadores' });

    return (
      sonda.itens.length > 0 &&
      sonda.itens.every((item) => matchesTipoParlamentar(item, 'senadores'))
    );
  } catch {
    return false;
  }
}

/** Compatibilidade com backends que ainda não filtram por casa no servidor. */
async function listarComFiltroEmMemoria(
  page: number,
  filtros: Omit<FiltrosParlamentares, 'tipo' | 'busca'>,
  tipo: TipoParlamentarFiltro,
): Promise<ListaParlamentaresResponse> {
  const primeira = await fetchParlamentaresPagina(1, filtros);
  const meta = normalizeMeta(primeira.meta, 1, PAGE_SIZE, primeira.itens.length);

  const paginasRestantes = Array.from(
    { length: Math.max(0, meta.lastPage - 1) },
    (_, index) => index + 2,
  );

  const restantes = await Promise.all(
    paginasRestantes.map((pagina) =>
      fetchParlamentaresPagina(pagina, filtros).then((r) => r.itens),
    ),
  );

  const filtrados = [...primeira.itens, ...restantes.flat()].filter((item) =>
    matchesTipoParlamentar(item, tipo),
  );

  const paginado = paginateParlamentares(filtrados, page);

  return {
    ...paginado,
    meta: {
      ...paginado.meta,
      aviso:
        filtrados.length === 0
          ? 'Nenhum parlamentar encontrado para os filtros informados.'
          : undefined,
    },
  };
}

function buildExpenseQuery(page: number, ano?: number | null) {
  const params = new URLSearchParams();
  params.append('pagina', String(page));
  params.append('limit', String(DESPESAS_PAGE_SIZE));
  params.append('limite', String(DESPESAS_PAGE_SIZE));

  if (ano) {
    params.append('ano', String(ano));
  }

  return params.toString();
}

function buildExpenseSummaryQuery(ano?: number | null) {
  const params = new URLSearchParams();

  if (ano) {
    params.append('ano', String(ano));
  }

  const query = params.toString();
  return query ? `?${query}` : '';
}

export async function getResumoDespesas(
  id: number,
  ano?: number | null,
): Promise<BackendDespesaResumo> {
  try {
    const res = await api.get(
      `/parlamentares/${id}/despesas/resumo${buildExpenseSummaryQuery(ano)}`,
    );
    return (res.data ?? {}) as BackendDespesaResumo;
  } catch {
    console.warn('Não foi possível carregar resumo de despesas do backend.');
    return {};
  }
}

export async function getDespesasParlamentar(
  id: number,
  page: number = 1,
  ano?: number | null,
): Promise<ListaDespesasResponse> {
  try {
    const res = await api.get(
      `/parlamentares/${id}/despesas?${buildExpenseQuery(page, ano)}`,
    );
    const { itens, meta } = unwrapList<Despesa>(res.data);

    return {
      data: itens,
      meta: normalizeMeta(meta, page, DESPESAS_PAGE_SIZE, itens.length),
    };
  } catch {
    console.warn('Não foi possível carregar despesas do backend.');
    return {
      data: [],
      meta: { total: 0, page, lastPage: 1, limit: DESPESAS_PAGE_SIZE },
    };
  }
}

/**
 * A média mensal só é calculada sobre os meses com dados dentro do exercício.
 * Dividir por 12 fixo subestima quem assumiu no meio do mandato.
 */
function resolveMediaMensal(
  resumo: BackendDespesaResumo,
  totalAno: number,
): { mediaMensal: number | null; mesesConsiderados: number | null } {
  const mesesInformados = Number(
    resumo.mesesComDados ?? resumo.mesesConsiderados ?? Number.NaN,
  );
  const meses = Number.isFinite(mesesInformados) && mesesInformados > 0
    ? Math.round(mesesInformados)
    : null;

  const mediaBackend = parseMoney(resumo.mediaMensal);
  if (mediaBackend > 0) {
    return { mediaMensal: mediaBackend, mesesConsiderados: meses };
  }

  if (meses && totalAno > 0) {
    return { mediaMensal: totalAno / meses, mesesConsiderados: meses };
  }

  return { mediaMensal: null, mesesConsiderados: null };
}

function montarDespesasPerfil(
  resumo: BackendDespesaResumo,
  lista: ListaDespesasResponse,
  anoReferencia: number | null,
): DespesasPerfil {
  const categorias = buildCategoriasFromBackend(resumo.categorias);
  const totalCategorias = categorias.reduce((acc, item) => acc + item.valor, 0);
  const totalAno = parseMoney(resumo.totalAno) || totalCategorias;
  const { mediaMensal, mesesConsiderados } = resolveMediaMensal(resumo, totalAno);

  return {
    totalAno,
    mediaMensal,
    mesesConsiderados,
    maiorReembolso: parseMoney(resumo.maiorReembolso),
    categorias,
    itensRecentes: buildItensFromBackend(
      lista.data,
      (lista.meta.page - 1) * lista.meta.limit,
    ),
    totalRegistros: lista.meta.total,
    paginaAtual: lista.meta.page,
    totalPaginas: lista.meta.lastPage,
    itensPorPagina: lista.meta.limit,
    anoReferencia,
  };
}

export async function getDespesasPerfil(
  id: number,
  ano?: number | null,
): Promise<DespesasPerfil> {
  const anoSolicitado = ano ?? null;

  if (anoSolicitado) {
    const [resumoDespesas, despesasResponse] = await Promise.all([
      getResumoDespesas(id, anoSolicitado),
      getDespesasParlamentar(id, 1, anoSolicitado),
    ]);

    return montarDespesasPerfil(resumoDespesas, despesasResponse, anoSolicitado);
  }

  const despesasMaisRecentes = await getDespesasParlamentar(id, 1);
  const anoInferido = inferExpenseYear(despesasMaisRecentes.data);
  const resumoDespesas = await getResumoDespesas(id, anoInferido ?? undefined);
  const anoReferencia =
    resumoDespesas.anoReferencia === null || resumoDespesas.anoReferencia === undefined
      ? anoInferido
      : Number(resumoDespesas.anoReferencia);

  const despesasResponse = anoReferencia
    ? await getDespesasParlamentar(id, 1, anoReferencia)
    : despesasMaisRecentes;

  return montarDespesasPerfil(resumoDespesas, despesasResponse, anoReferencia);
}

function buildVotingsQuery(page: number, filtros: FiltrosVotacao) {
  const params = new URLSearchParams();
  params.append('pagina', String(page));
  params.append('limit', String(VOTACOES_PAGE_SIZE));
  params.append('limite', String(VOTACOES_PAGE_SIZE));

  // Todos recortam pela proposição votada, no banco — não sobre a página lida.
  if (filtros.proposicao) params.append('proposicao', String(filtros.proposicao));
  if (filtros.tipo) params.append('tipo', filtros.tipo);
  if (filtros.ano) params.append('ano', String(filtros.ano));
  if (filtros.tema) params.append('tema', filtros.tema);
  if (filtros.busca) params.append('busca', filtros.busca);
  if (filtros.objeto) params.append('objeto', filtros.objeto);
  if (filtros.apenasMerito) params.append('apenasMerito', 'true');

  return params.toString();
}

export async function getVotacoesParlamentar(
  id: number,
  page: number = 1,
  filtros: FiltrosVotacao = {},
): Promise<ListaVotacoesResponse> {
  try {
    const res = await api.get(
      `/parlamentares/${id}/votacoes?${buildVotingsQuery(page, filtros)}`,
    );
    const { itens, meta } = unwrapList<BackendVotacaoResumo>(res.data);

    const excluidos = (res.data as { meta?: { excluidos?: { votacoesSemProposicao?: number } } })
      ?.meta?.excluidos;

    return {
      data: itens.map(mapVotacaoResumo),
      meta: normalizeMeta(meta, page, VOTACOES_PAGE_SIZE, itens.length),
      votacoesSemProposicaoExcluidas: Number(excluidos?.votacoesSemProposicao ?? 0) || 0,
    };
  } catch {
    console.warn('Não foi possível carregar votações do parlamentar.');
    return {
      data: [],
      meta: { total: 0, page, lastPage: 1, limit: VOTACOES_PAGE_SIZE },
      votacoesSemProposicaoExcluidas: 0,
    };
  }
}

const PRESENCA_VAZIA: PresencaDetalhe = {
  taxa: null,
  taxaEstrita: null,
  totalEventos: 0,
  presentes: 0,
  justificadas: 0,
  faltas: 0,
};

const ESCOPO_VAZIO: PresencaPorEscopo = {
  deliberativas: { ...PRESENCA_VAZIA },
  naoDeliberativas: { ...PRESENCA_VAZIA },
};

function mapPresencaBloco(
  bloco: BackendPresencaBloco | null | undefined,
): PresencaDetalhe {
  if (!bloco) return { ...PRESENCA_VAZIA };

  // A API chama de `total`; a versão anterior chamava de `totalEventos`.
  const totalEventos = Number(bloco.total ?? bloco.totalEventos ?? 0) || 0;

  return {
    // Sem eventos no denominador não existe taxa — e "0%" mentiria.
    taxa: totalEventos > 0 ? parsePercent(bloco.taxa ?? bloco.percentual) : null,
    taxaEstrita: totalEventos > 0 ? parsePercent(bloco.taxaEstrita) : null,
    totalEventos,
    presentes: Number(bloco.presentes ?? 0) || 0,
    justificadas: Number(bloco.justificadas ?? 0) || 0,
    faltas: Number(bloco.faltas ?? 0) || 0,
  };
}

/**
 * Aceita as duas formas do payload: a atual, com o escopo dividido em
 * deliberativas e não deliberativas, e a anterior, em que `plenario` já era o
 * próprio balde. Sem isso a divisão nova cai toda em "sem dados".
 */
function mapPresencaEscopo(
  escopo: BackendPresencaEscopo | BackendPresencaBloco | null | undefined,
): PresencaPorEscopo {
  if (!escopo) return { ...ESCOPO_VAZIO };

  const comEscopo = escopo as BackendPresencaEscopo;

  if (comEscopo.deliberativas || comEscopo.naoDeliberativas) {
    return {
      deliberativas: mapPresencaBloco(comEscopo.deliberativas),
      naoDeliberativas: mapPresencaBloco(comEscopo.naoDeliberativas),
    };
  }

  return {
    deliberativas: mapPresencaBloco(escopo as BackendPresencaBloco),
    naoDeliberativas: { ...PRESENCA_VAZIA },
  };
}

const PRESENCA_PERFIL_VAZIO: PresencaPerfil = {
  plenario: { ...ESCOPO_VAZIO },
  comissoes: { ...ESCOPO_VAZIO },
  excluidos: { semClassificacao: 0, semOrgao: 0 },
  restritaAoExercicio: false,
  metodologias: [],
};

export async function getPresencaParlamentar(id: number): Promise<PresencaPerfil> {
  try {
    const res = await api.get(`/parlamentares/${id}/presenca`);
    const payload = (res.data ?? {}) as BackendPresencaResponse;
    const presenca = payload.presenca ?? {};

    return {
      plenario: mapPresencaEscopo(presenca.plenario),
      comissoes: mapPresencaEscopo(presenca.comissoes),
      excluidos: {
        semClassificacao: Number(presenca.excluidos?.eventosSemClassificacao ?? 0) || 0,
        semOrgao: Number(presenca.excluidos?.eventosSemOrgao ?? 0) || 0,
      },
      restritaAoExercicio: presenca.janela?.restritaAoExercicio !== false,
      metodologias: (presenca.metodologia ?? [])
        .map((item) => ({
          casa: formatCasa(item.casa) ?? item.casa ?? '',
          fonte: item.fonte?.trim() ?? '',
          observacao: item.observacao?.trim() || null,
        }))
        .filter((item) => item.casa || item.fonte),
    };
  } catch {
    return { ...PRESENCA_PERFIL_VAZIO };
  }
}

type BackendAlinhamento = {
  disponivel?: boolean;
  taxa?: number | null;
  motivo?: string | null;
  seguiu?: number | null;
  divergiu?: number | null;
  consideradas?: number | null;
  liberadas?: number | null;
  bancadaNaoResolvida?: number | null;
  minimoParaTaxa?: number | null;
  fonteFiliacao?: 'historico' | 'partidoAtual' | null;
};

const MOTIVOS_CONHECIDOS: MotivoSemAlinhamento[] = [
  'ORIENTACAO_INDISPONIVEL_SENADO',
  'SEM_VOTOS_COMPARAVEIS',
  'BANCADA_NAO_RESOLVIDA',
  'AMOSTRA_INSUFICIENTE',
];

const ALINHAMENTO_INDISPONIVEL: AlinhamentoPartidario = {
  disponivel: false,
  taxa: null,
  motivo: 'FALHA',
  seguiu: 0,
  divergiu: 0,
  consideradas: 0,
  liberadas: 0,
  bancadaNaoResolvida: 0,
  minimoParaTaxa: 0,
  fonteFiliacao: null,
};

/**
 * Aderência à orientação do partido, da rota dedicada.
 *
 * Antes vinha de `GET /parlamentares/:id/perfil`, que roda todas as consultas
 * do parlamentar para preencher um card. Agora há rota própria.
 *
 * O cálculo mora no backend de propósito: compara o voto com a orientação da
 * bancada do partido **na data da votação**, descarta as votações liberadas e
 * só publica taxa acima de um mínimo de comparações. Refazer isso no navegador,
 * a partir da página corrente de votações, daria um número errado com cara de
 * certo.
 */
/** O mesmo formato serve ao agregado e a cada tema. */
function mapAlinhamento(bruto: BackendAlinhamento): AlinhamentoPartidario {
  const motivoBruto = (bruto.motivo ?? '') as MotivoSemAlinhamento;
  const motivo = MOTIVOS_CONHECIDOS.includes(motivoBruto) ? motivoBruto : null;
  const taxa =
    bruto.taxa === null || bruto.taxa === undefined ? null : parsePercent(bruto.taxa);

  return {
    disponivel: bruto.disponivel !== false,
    taxa,
    // Sem taxa e sem motivo reconhecido, a interface ainda precisa dizer algo.
    motivo: taxa === null ? motivo ?? 'FALHA' : null,
    seguiu: Number(bruto.seguiu ?? 0) || 0,
    divergiu: Number(bruto.divergiu ?? 0) || 0,
    consideradas: Number(bruto.consideradas ?? 0) || 0,
    liberadas: Number(bruto.liberadas ?? 0) || 0,
    bancadaNaoResolvida: Number(bruto.bancadaNaoResolvida ?? 0) || 0,
    minimoParaTaxa: Number(bruto.minimoParaTaxa ?? 0) || 0,
    fonteFiliacao: bruto.fonteFiliacao ?? null,
  };
}

export async function getAlinhamentoParlamentar(
  id: number,
): Promise<AlinhamentoPartidario> {
  try {
    const res = await api.get(`/parlamentares/${id}/alinhamento`);

    return mapAlinhamento((res.data ?? {}) as BackendAlinhamento);
  } catch {
    console.warn('Não foi possível carregar o alinhamento partidário.');
    return { ...ALINHAMENTO_INDISPONIVEL };
  }
}

type BackendAlinhamentoPorTema = {
  disponivel?: boolean;
  geral?: BackendAlinhamento | null;
  temas?: (BackendAlinhamento & { tema?: string | null })[] | null;
  excluidos?: {
    votosSemProposicao?: number | null;
    votosEmProposicaoSemTema?: number | null;
  } | null;
  metadata?: {
    temasComparados?: number | null;
    minimoParaTaxa?: number | null;
    filtro?: { apenasMerito?: boolean } | null;
  } | null;
};

const ALINHAMENTO_POR_TEMA_VAZIO: AlinhamentoPorTema = {
  disponivel: false,
  geral: { ...ALINHAMENTO_INDISPONIVEL },
  temas: [],
  excluidos: { semProposicao: 0, emProposicaoSemTema: 0 },
  temasComparados: 0,
  minimoParaTaxa: 0,
  apenasMerito: false,
  carregado: false,
};

/**
 * Fidelidade à orientação do partido, por tema.
 *
 * O `geral` vem no mesmo payload e sob o mesmo recorte: é a régua que dá
 * sentido ao número de cada tema. "61% em meio ambiente" só quer dizer alguma
 * coisa ao lado de "88% no mandato inteiro".
 *
 * A API ordena por número de comparações, não por taxa — o topo dela é onde há
 * mais evidência. Quem reordenar por taxa precisa manter `consideradas` à
 * vista, porque abaixo do mínimo a taxa vem nula de propósito.
 */
export async function getAlinhamentoPorTema(
  id: number,
  limite = 8,
  apenasMerito = true,
): Promise<AlinhamentoPorTema> {
  try {
    const params = new URLSearchParams({ limite: String(limite) });
    if (apenasMerito) params.set('apenasMerito', 'true');

    const res = await api.get(
      `/parlamentares/${id}/alinhamento/temas?${params.toString()}`,
    );
    const payload = (res.data ?? {}) as BackendAlinhamentoPorTema;

    return {
      disponivel: payload.disponivel !== false,
      geral: mapAlinhamento(payload.geral ?? {}),
      temas: (payload.temas ?? [])
        .map((item) => ({
          ...mapAlinhamento(item),
          tema: item.tema?.trim() ?? '',
        }))
        .filter((item) => item.tema),
      excluidos: {
        semProposicao: Number(payload.excluidos?.votosSemProposicao ?? 0) || 0,
        emProposicaoSemTema:
          Number(payload.excluidos?.votosEmProposicaoSemTema ?? 0) || 0,
      },
      temasComparados: Number(payload.metadata?.temasComparados ?? 0) || 0,
      minimoParaTaxa: Number(payload.metadata?.minimoParaTaxa ?? 0) || 0,
      apenasMerito: payload.metadata?.filtro?.apenasMerito === true,
      carregado: true,
    };
  } catch {
    console.warn('Não foi possível carregar o alinhamento por tema.');
    return { ...ALINHAMENTO_POR_TEMA_VAZIO };
  }
}

export async function getVotacoesPerfil(id: number): Promise<VotacoesPerfil> {
  const [votacoesResponse, presenca] = await Promise.all([
    getVotacoesParlamentar(id, 1),
    getPresencaParlamentar(id),
  ]);

  return {
    presenca,
    destaques: votacoesResponse.data,
    leituraRapida:
      votacoesResponse.meta.total > 0
        ? `${votacoesResponse.meta.total} votações registradas para este parlamentar.`
        : 'Nenhuma votação registrada foi encontrada para este parlamentar.',
    totalRegistros: votacoesResponse.meta.total,
    paginaAtual: votacoesResponse.meta.page,
    totalPaginas: votacoesResponse.meta.lastPage,
    itensPorPagina: votacoesResponse.meta.limit,
  };
}

export type ListaEmendasResponse = {
  data: EmendaResumoPerfil[];
  meta: PaginacaoNormalizada;
};

export async function getEmendasParlamentar(
  parlamentarId: number,
  page: number = 1,
): Promise<ListaEmendasResponse> {
  try {
    const params = new URLSearchParams();
    params.append('pagina', String(page));
    params.append('limit', String(EMENDAS_PAGE_SIZE));
    params.append('limite', String(EMENDAS_PAGE_SIZE));

    const res = await api.get(
      `/parlamentares/${parlamentarId}/emendas?${params.toString()}`,
    );
    const { itens, meta } = unwrapList<BackendEmendaResumo>(res.data);
    const emendas = itens.map(mapEmendaResumo).filter((emenda) => emenda.id > 0);

    return {
      data: emendas,
      meta: normalizeMeta(meta, page, EMENDAS_PAGE_SIZE, emendas.length),
    };
  } catch {
    console.warn('Não foi possível carregar emendas do parlamentar.');
    return {
      data: [],
      meta: { total: 0, page, lastPage: 1, limit: EMENDAS_PAGE_SIZE },
    };
  }
}

type BackendProposicaoPerfil = {
  id?: number;
  sigla?: string | null;
  numero?: string | number | null;
  ano?: number | null;
  ementa?: string | null;
  situacao?: string | null;
  casa?: string | null;
  papel?: string | null;
  dataApresentacao?: string | null;
  temas?: (string | { nome?: string | null; tema?: string | null })[] | null;
};

export type ListaProposicoesResponse = {
  data: ProposicaoPerfil[];
  meta: PaginacaoNormalizada;
};

function mapTemas(temas: BackendProposicaoPerfil['temas']): string[] {
  if (!Array.isArray(temas)) return [];

  return temas
    .map((tema) =>
      typeof tema === 'string' ? tema : tema?.nome ?? tema?.tema ?? '',
    )
    .map((tema) => tema.trim())
    .filter(Boolean);
}

function mapProposicao(item: BackendProposicaoPerfil, index: number): ProposicaoPerfil {
  const propositionId = item.id ?? index + 1;
  const sigla = item.sigla?.trim() || 'Proposição';
  const numero = String(item.numero ?? 'S/N');
  const ano = String(item.ano ?? 'Não informado');

  return {
    id: String(propositionId),
    sigla,
    numero,
    ano,
    titulo: `${sigla} ${numero}/${ano}`,
    resumo: item.ementa?.trim() || 'Ementa não informada',
    papel: item.papel?.trim() || null,
    situacao: item.situacao?.trim() || 'Situação não informada',
    temas: mapTemas(item.temas),
    casa: formatCasa(item.casa),
    dataApresentacao: item.dataApresentacao || null,
  };
}

export async function getProposicoesParlamentar(
  id: number,
  page = 1,
): Promise<ListaProposicoesResponse> {
  try {
    const params = new URLSearchParams();
    params.append('pagina', String(page));
    params.append('limit', String(PROPOSICOES_PAGE_SIZE));
    params.append('limite', String(PROPOSICOES_PAGE_SIZE));

    const res = await api.get(
      `/parlamentares/${id}/proposicoes?${params.toString()}`,
    );

    const { itens, meta } = unwrapList<BackendProposicaoPerfil>(res.data);

    return {
      data: itens.map(mapProposicao),
      meta: normalizeMeta(meta, page, PROPOSICOES_PAGE_SIZE, itens.length),
    };
  } catch (error) {
    console.error('Erro ao buscar proposições do parlamentar:', error);

    return {
      data: [],
      meta: { total: 0, page, lastPage: 1, limit: PROPOSICOES_PAGE_SIZE },
    };
  }
}

export async function getResumoEmendasParlamentar(parlamentarId: number) {
  try {
    const res = await api.get(`/parlamentares/${parlamentarId}/emendas/resumo`);

    return {
      totalEmendas: Number(res.data?.totalEmendas ?? 0) || 0,
      totalEmpenhado: parseMoney(res.data?.totalEmpenhado),
      totalLiquidado: parseMoney(res.data?.totalLiquidado),
      totalPago: parseMoney(res.data?.totalPago),
      totalRestoInscrito: parseMoney(res.data?.totalRestoInscrito),
    };
  } catch {
    console.warn('Não foi possível carregar resumo de emendas do parlamentar.');

    return {
      totalEmendas: 0,
      totalEmpenhado: 0,
      totalLiquidado: 0,
      totalPago: 0,
      totalRestoInscrito: 0,
    };
  }
}

/**
 * Endpoints da Fase 3 do plano de integração. Enquanto o backend não os
 * publica, o perfil simplesmente não mostra a seção — nunca dado inventado.
 */
async function getListaOpcional<TBackend, TFront>(
  url: string,
  mapper: (item: TBackend, index: number) => TFront,
): Promise<TFront[]> {
  try {
    const res = await api.get(url);
    const { itens } = unwrapList<TBackend>(res.data);
    return itens.map(mapper);
  } catch {
    return [];
  }
}

type BackendPerfilTematico = {
  proposicoes?: {
    temas?: { tema?: string | null; total?: number | null }[] | null;
    totalProposicoes?: number | null;
    semTema?: number | null;
  } | null;
  votacoes?: {
    temas?: {
      tema?: string | null;
      votosSim?: number | null;
      votosNao?: number | null;
      saldo?: number | null;
      abstencoes?: number | null;
      obstrucoes?: number | null;
      totalVotos?: number | null;
    }[] | null;
    totalVotos?: number | null;
    excluidos?: {
      votosSemProposicao?: number | null;
      votosEmProposicaoSemTema?: number | null;
    } | null;
  } | null;
  metadata?: {
    observacao?: string | null;
    filtro?: {
      apenasMerito?: boolean;
      objetosDeMerito?: string[] | null;
    } | null;
  } | null;
};

const PERFIL_TEMATICO_VAZIO: PerfilTematico = {
  temasVotados: [],
  temasAutoria: [],
  totalProposicoes: 0,
  proposicoesSemTema: 0,
  totalVotos: 0,
  excluidos: { semProposicao: 0, emProposicaoSemTema: 0 },
  observacao: null,
  apenasMerito: false,
  objetosDeMerito: [],
  disponivel: false,
};

/**
 * Como o parlamentar votou, agrupado por tema da proposição.
 *
 * A contagem é de votos SIM e NÃO em votações de proposições do tema — não é
 * posição sobre o tema. A mesma votação pode ser sobre o texto principal, um
 * destaque supressivo ou um requerimento de urgência, e o dado não distingue:
 * votar NÃO num destaque que suprimia o artigo é votar A FAVOR do texto. A
 * `observacao` da API carrega essa ressalva e a interface a exibe.
 */
export async function getPerfilTematicoParlamentar(
  id: number,
  limite = 8,
  /**
   * Recorta a contagem às votações de mérito. Ligado por padrão: sem ele, a
   * conta mistura texto principal com requerimento de urgência e redação
   * final, onde o voto é sobre o rito e não sobre o assunto.
   */
  apenasMerito = true,
): Promise<PerfilTematico> {
  try {
    const params = new URLSearchParams({ limite: String(limite) });
    if (apenasMerito) params.set('apenasMerito', 'true');

    const res = await api.get(`/parlamentares/${id}/temas?${params.toString()}`);
    const payload = (res.data ?? {}) as BackendPerfilTematico;
    const votacoes = payload.votacoes ?? {};
    const proposicoes = payload.proposicoes ?? {};
    const filtro = payload.metadata?.filtro ?? {};

    return {
      temasAutoria: (proposicoes.temas ?? [])
        .map((item) => ({
          tema: item.tema?.trim() ?? '',
          total: Number(item.total ?? 0) || 0,
        }))
        .filter((item) => item.tema && item.total > 0),
      totalProposicoes: Number(proposicoes.totalProposicoes ?? 0) || 0,
      proposicoesSemTema: Number(proposicoes.semTema ?? 0) || 0,
      temasVotados: (votacoes.temas ?? [])
        .map((item) => {
          const votosSim = Number(item.votosSim ?? 0) || 0;
          const votosNao = Number(item.votosNao ?? 0) || 0;

          return {
            tema: item.tema?.trim() ?? '',
            votosSim,
            votosNao,
            saldo: Number(item.saldo ?? votosSim - votosNao) || 0,
            abstencoes: Number(item.abstencoes ?? 0) || 0,
            obstrucoes: Number(item.obstrucoes ?? 0) || 0,
            totalVotos: Number(item.totalVotos ?? 0) || 0,
          };
        })
        .filter((item) => item.tema && item.votosSim + item.votosNao > 0),
      totalVotos: Number(votacoes.totalVotos ?? 0) || 0,
      excluidos: {
        semProposicao: Number(votacoes.excluidos?.votosSemProposicao ?? 0) || 0,
        emProposicaoSemTema:
          Number(votacoes.excluidos?.votosEmProposicaoSemTema ?? 0) || 0,
      },
      observacao: payload.metadata?.observacao?.trim() || null,
      apenasMerito: filtro.apenasMerito === true,
      objetosDeMerito: (filtro.objetosDeMerito ?? [])
        .map((item) => mapObjetoVotacao(item))
        .filter((item): item is ObjetoVotacao => item !== null),
      disponivel: true,
    };
  } catch {
    console.warn('Não foi possível carregar o perfil temático do parlamentar.');
    return { ...PERFIL_TEMATICO_VAZIO };
  }
}

export function getComissoesParlamentar(id: number): Promise<ComissaoPerfil[]> {
  return getListaOpcional<BackendComissao, ComissaoPerfil>(
    `/parlamentares/${id}/comissoes`,
    (item, index) => ({
      id: Number(item.id ?? item.idOrgao ?? index),
      nome: item.nome?.trim() || item.nomeOrgao?.trim() || 'Órgão não informado',
      sigla: item.sigla?.trim() || item.siglaOrgao?.trim() || null,
      tipoOrgao: item.tipoOrgao?.trim() || null,
      papel: item.papel?.trim() || item.titulo?.trim() || item.cargo?.trim() || null,
      dataInicio: item.dataInicio || null,
      dataFim: item.dataFim || null,
    }),
  );
}

export function getFiliacoesParlamentar(
  id: number,
): Promise<FiliacaoPartidariaPerfil[]> {
  return getListaOpcional<BackendFiliacao, FiliacaoPartidariaPerfil>(
    `/parlamentares/${id}/filiacoes`,
    (item, index) => ({
      id: Number(item.id ?? index),
      siglaPartido: item.siglaPartido?.trim() || item.sigla?.trim() || 'Sem partido',
      nomePartido: item.nomePartido?.trim() || item.nome?.trim() || null,
      dataInicio: item.dataInicio || null,
      dataFim: item.dataFim || null,
    }),
  );
}

export function getMandatosParlamentar(
  id: number,
): Promise<MandatoExercicioPerfil[]> {
  return getListaOpcional<BackendMandato, MandatoExercicioPerfil>(
    `/parlamentares/${id}/mandatos`,
    (item, index) => ({
      id: Number(item.id ?? index),
      casa: formatCasa(item.casa),
      legislatura: item.legislatura ? String(item.legislatura) : null,
      dataInicio: item.dataInicio || null,
      dataFim: item.dataFim || null,
      condicao: item.condicao?.trim() || item.condicaoMandato?.trim() || null,
    }),
  );
}

function montarIndicadores(
  votacoes: VotacoesPerfil,
  totalProposicoes: number,
  emendas: EmendasPerfil,
  despesas: DespesasPerfil,
): PerfilIndicador[] {
  // O número-vitrine é o plenário deliberativo: é onde a casa decide.
  const presencaPlenario = votacoes.presenca.plenario.deliberativas;
  const temPresenca = presencaPlenario.taxa !== null;

  return [
    {
      titulo: 'Presença em plenário',
      valor: temPresenca ? `${presencaPlenario.taxa}%` : 'Sem dados',
      apoio: temPresenca
        ? `${presencaPlenario.totalEventos} sessões deliberativas · ${presencaPlenario.faltas} ausências`
        : 'Ainda não temos registro de presença para este parlamentar.',
      destaque: !temPresenca
        ? 'neutro'
        : (presencaPlenario.taxa as number) > 85
          ? 'positivo'
          : 'atencao',
    },
    {
      titulo: 'Proposições acompanhadas',
      valor: `${totalProposicoes}`,
      apoio: 'registros legislativos vinculados',
      destaque: 'neutro',
    },
    {
      titulo: 'Emendas empenhadas',
      valor: shortCurrency(emendas.totalEmpenhado),
      apoio:
        emendas.quantidade > 0
          ? `${emendas.quantidade} registro${emendas.quantidade === 1 ? '' : 's'} vinculado${emendas.quantidade === 1 ? '' : 's'}`
          : 'sem emendas vinculadas',
      destaque: 'neutro',
    },
    {
      titulo: despesas.anoReferencia
        ? `Despesas de ${despesas.anoReferencia}`
        : 'Despesas no período',
      valor: despesas.totalRegistros > 0 ? shortCurrency(despesas.totalAno) : 'Sem dados',
      apoio:
        despesas.totalRegistros > 0
          ? despesas.anoReferencia
            ? `${despesas.totalRegistros} registros · ano mais recente disponível`
            : `${despesas.totalRegistros} registros consolidados`
          : 'nenhuma despesa registrada para este parlamentar',
      destaque: despesas.totalRegistros > 0 ? 'atencao' : 'neutro',
    },
  ];
}

export async function getParlamentarProfile(
  id: number,
): Promise<ParlamentarPerfil | null> {
  const detalheApi = await getParlamentarById(id);

  if (!detalheApi) {
    return null;
  }

  const [
    despesas,
    emendasResponse,
    resumoEmendas,
    votacoesPerfil,
    proposicoesResponse,
    comissoes,
    filiacoes,
    mandatos,
  ] = await Promise.all([
    getDespesasPerfil(id),
    getEmendasParlamentar(id, 1),
    getResumoEmendasParlamentar(id),
    getVotacoesPerfil(id),
    getProposicoesParlamentar(id, 1),
    getComissoesParlamentar(id),
    getFiliacoesParlamentar(id),
    getMandatosParlamentar(id),
  ]);

  const emendasPagina = emendasResponse.data;
  const quantidade = resumoEmendas.totalEmendas || emendasResponse.meta.total;

  const emendas: EmendasPerfil = {
    quantidade,
    totalEmpenhado: resumoEmendas.totalEmpenhado,
    totalLiquidado: resumoEmendas.totalLiquidado,
    totalPago: resumoEmendas.totalPago,
    totalRestoInscrito: resumoEmendas.totalRestoInscrito,
    principalTipo: emendasPagina[0]?.tipoEmenda || '—',
    principalLocalidade: emendasPagina[0]?.localidadeDoGasto || '—',
    destaques: emendasPagina,
    documentosRecentes: [],
    paginaAtual: emendasResponse.meta.page,
    totalPaginas: emendasResponse.meta.lastPage,
    itensPorPagina: emendasResponse.meta.limit,
    vinculosInferidos: emendasPagina.filter(
      (emenda) =>
        emenda.confiancaVinculo !== null &&
        emenda.confiancaVinculo !== undefined &&
        emenda.confiancaVinculo < 1,
    ).length,
    leituraRapida:
      quantidade > 0
        ? `${quantidade} emenda${quantidade === 1 ? '' : 's'} vinculada${quantidade === 1 ? '' : 's'} a este parlamentar.`
        : 'Nenhuma emenda vinculada foi encontrada para este parlamentar.',
  };

  return {
    parlamentar: detalheApi,
    subtitulo:
      'Acompanhe a atuação legislativa, as votações e o uso de recursos do mandato.',
    resumo: '',
    comissoes,
    filiacoes,
    mandatos,
    indicadores: montarIndicadores(
      votacoesPerfil,
      proposicoesResponse.meta.total,
      emendas,
      despesas,
    ),
    proposicoes: proposicoesResponse.data,
    votacoes: votacoesPerfil,
    despesas,
    emendas,
  };
}

export async function getEmendaDetalhe(
  parlamentarId: number,
  idEmenda: number,
): Promise<EmendaDetalhe | null> {
  try {
    const res = await api.get(`/emendas/${idEmenda}/detalhes`);

    if (!res.data) return null;

    const data = res.data as BackendEmendaDetalhe;
    const resumo = mapEmendaResumo(data);
    const documentos = Array.isArray(data.documentos)
      ? data.documentos.map(mapDocumentoEmenda)
      : [];
    const parlamentares = Array.isArray(data.parlamentares)
      ? data.parlamentares.map(mapEmendaParlamentar)
      : [];

    return {
      ...resumo,
      id: resumo.id || idEmenda,
      valorRestoInscrito: parseMoney(data.valorRestoInscrito),
      valorRestoCancelado: parseMoney(data.valorRestoCancelado),
      valorRestoPago: parseMoney(data.valorRestoPago),
      documentos,
      parlamentares,
      parlamentarId,
      nomeParlamentar:
        parlamentares[0]?.nomeCivil || parlamentares[0]?.nomeUrna || resumo.nomeAutor || '',
    };
  } catch {
    console.warn('Não foi possível carregar detalhe da emenda.');
    return null;
  }
}
