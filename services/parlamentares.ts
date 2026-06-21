import api from './api';
import {
  CategoriaDespesaPerfil,
  Despesa,
  DespesasPerfil,
  DocumentoEmendaPerfil,
  EmendaDetalhe,
  EmendaParlamentarVinculado,
  EmendaResumoPerfil,
  EmendasPerfil,
  ItemDespesaPerfil,
  ListaParlamentaresResponse,
  Parlamentar,
  ParlamentarDetalhe,
  ParlamentarPerfil,
  PerfilIndicador,
  ProposicaoPerfil,
  VotacaoPerfil,
  VotacoesPerfil,
} from '@/types';

const PAGE_SIZE = 20;
const DESPESAS_PAGE_SIZE = 5;
const VOTACOES_PAGE_SIZE = 5;

type TipoParlamentarFiltro = 'deputados' | 'senadores';

type BackendParlamentarResumo = {
  id: number;
  nomeParlamentar?: string | null;
  siglaPartido?: string | null;
  uf?: string | null;
  urlFoto?: string | null;
  cargo?: string | null;
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
    lastPage?: number;
    limit?: number;
  };
};

type ListaDespesasResponse = {
  data: Despesa[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
  };
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
  categorias?: BackendDespesaCategoria[] | null;
};

type BackendVotacaoResumo = {
  id?: string | number | null;
  data?: string | null;
  resumo?: string | null;
  voto?: string | null;
  resultado?: string | null;
  tipo?: string | null;
};

type ListaVotacoesResponse = {
  data: VotacaoPerfil[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
  };
};

type BackendPresencaResponse = {
  presenca?: {
    sessoesDeliberativas?: {
      taxa?: string | number | null;
      totalEventos?: string | number | null;
      faltas?: string | number | null;
    } | null;
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

const TEMAS = [
  'Transparência pública',
  'Educação básica',
  'Saúde preventiva',
  'Mobilidade urbana',
  'Desenvolvimento regional',
  'Inovação no setor público',
  'Primeira infância',
  'Segurança alimentar',
  'Sustentabilidade fiscal',
  'Infraestrutura digital',
];

const COMISSOES = [
  'Comissão de Fiscalização Financeira e Controle',
  'Comissão de Educação',
  'Comissão de Constituição e Justiça',
  'Comissão de Transparência e Integridade',
  'Comissão de Desenvolvimento Regional',
  'Frente Parlamentar de Dados Abertos',
  'Comissão de Administração Pública',
  'Comissão de Ciência e Tecnologia',
];

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

function getCasaLegislativa(cargo?: string | null) {
  const normalizedCargo = cargo?.trim().toLowerCase() ?? '';

  if (normalizedCargo.includes('senador')) {
    return 'Senado Federal';
  }

  if (normalizedCargo.includes('deputad')) {
    return 'Câmara dos Deputados';
  }

  return 'Poder Legislativo';
}

function parseMoney(value?: string | number | null) {
  if (typeof value === 'number') return value;
  if (!value) return 0;

  const normalized = String(value)
    .replace(/\./g, '')
    .replace(',', '.')
    .trim();

  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function mapResumo(item: BackendParlamentarResumo): Parlamentar {
  const nomeParlamentar = item.nomeParlamentar?.trim() || 'Parlamentar';
  const cargo = item.cargo?.trim() || 'Parlamentar';

  return {
    id: item.id,
    nomeParlamentar,
    siglaPartido: item.siglaPartido?.trim() || 'Sem partido',
    uf: item.uf?.trim() || '--',
    urlFoto: normalizePhoto(item.urlFoto, nomeParlamentar),
    cargo,
    casaLegislativa: getCasaLegislativa(cargo),
    situacaoMandato: 'Em exercício',
    situacao: 'Em exercício',
  };
}

function matchesTipoParlamentar(
  parlamentar: Parlamentar,
  tipo?: TipoParlamentarFiltro,
) {
  if (!tipo) return true;

  const cargo = parlamentar.cargo?.toLowerCase() ?? '';

  if (tipo === 'senadores') {
    return cargo.includes('senador');
  }

  return cargo.includes('deputado');
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
    situacao: base.situacao ?? base.situacaoMandato ?? 'Em exercício',
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

function selectItems(seed: number, start: number, size: number) {
  return Array.from(
    { length: size },
    (_, index) => TEMAS[(seed + start + index) % TEMAS.length],
  );
}

function buildProposicoes(seed: number, temas: string[]): ProposicaoPerfil[] {
  const modelos = [
    {
      sigla: 'PL',
      papel: 'Autoria principal',
      situacao: 'Em tramitação',
      sufixo:
        'amplia padrões de transparência ativa e simplifica a leitura dos dados públicos.',
    },
    {
      sigla: 'PEC',
      papel: 'Coautoria',
      situacao: 'Aguardando parecer',
      sufixo:
        'reorganiza competências e reforça mecanismos de monitoramento cidadão.',
    },
    {
      sigla: 'REQ',
      papel: 'Requerimento apresentado',
      situacao: 'Aprovado em comissão',
      sufixo:
        'pede audiência pública com especialistas e representantes da sociedade civil.',
    },
  ];

  return modelos.map((modelo, index) => ({
    id: `${modelo.sigla}-${seed}-${index}`,
    sigla: modelo.sigla,
    numero: String(100 + ((seed + index * 17) % 700)),
    ano: '2026',
    titulo: `${modelo.sigla} ${100 + ((seed + index * 17) % 700)}/2026`,
    resumo: `Proposição que trata de ${temas[index].toLowerCase()} e ${modelo.sufixo}`,
    papel: modelo.papel,
    situacao: modelo.situacao,
    tema: temas[index],
    impactoCidadao:
      index === 0
        ? 'Facilita o acompanhamento do mandato e melhora a transparência para quem está fiscalizando.'
        : index === 1
          ? 'Pode alterar regras permanentes e costuma exigir debate mais amplo com impacto institucional.'
          : 'Ajuda a destravar discussões e dar visibilidade ao tema antes de avançar para votação final.',
    data: `2026-0${index + 2}-1${seed % 8}`,
  }));
}

function buildVotacoes(seed: number, temas: string[]): VotacaoPerfil[] {
  const votos = ['Favorável', 'Contrário', 'Abstenção', 'Favorável'];
  const resultados = ['Aprovada', 'Rejeitada', 'Aprovada', 'Aprovada'];

  return [
    {
      id: `vot-${seed}-1`,
      titulo: 'Marco de Transparência Orçamentária',
      data: '2026-03-18',
      tema: temas[0],
      resumo:
        'Votação nominal sobre regras de publicação e reaproveitamento de dados de execução orçamentária.',
      voto: votos[0],
      resultado: resultados[0],
      orientacaoCasa:
        'Houve convergência entre governo e oposição em parte do texto final.',
    },
    {
      id: `vot-${seed}-2`,
      titulo: 'Incentivo à conectividade em escolas públicas',
      data: '2026-03-04',
      tema: temas[1],
      resumo:
        'Define prioridade de investimento em infraestrutura digital e conectividade educacional.',
      voto: votos[3],
      resultado: resultados[3],
      orientacaoCasa:
        'A orientação partidária ficou dividida em blocos e houve destaque para ajustes no financiamento.',
    },
    {
      id: `vot-${seed}-3`,
      titulo: 'Crédito extraordinário para atendimento regional',
      data: '2026-02-21',
      tema: temas[2],
      resumo:
        'Reforço orçamentário com foco em ações emergenciais e atendimento local.',
      voto: votos[1],
      resultado: resultados[1],
      orientacaoCasa:
        'O debate girou em torno do impacto fiscal e da necessidade de critérios mais claros de execução.',
    },
    {
      id: `vot-${seed}-4`,
      titulo: 'Programa de compras públicas sustentáveis',
      data: '2026-02-05',
      tema: 'Sustentabilidade fiscal',
      resumo:
        'Estabelece parâmetros para contratação pública com critérios de eficiência e sustentabilidade.',
      voto: votos[0],
      resultado: resultados[0],
      orientacaoCasa:
        'A discussão combinou impacto orçamentário, metas ambientais e incentivo à inovação.',
    },
  ];
}


function formatVotingChoice(choice?: string | null) {
  const normalized = (choice ?? '').trim().toUpperCase();

  const labels: Record<string, string> = {
    YES: 'Sim',
    SIM: 'Sim',
    NO: 'Não',
    NAO: 'Não',
    NÃO: 'Não',
    ABSTENTION: 'Abstenção',
    ABSTENCAO: 'Abstenção',
    ABSTENÇÃO: 'Abstenção',
    ABSENT: 'Ausente',
    AUSENTE: 'Ausente',
  };

  return labels[normalized] || choice || 'Não informado';
}

function formatVotingType(type?: string | null) {
  const normalized = (type ?? '').trim().toUpperCase();

  const labels: Record<string, string> = {
    NOMINAL: 'Votação nominal',
    SIMBOLICA: 'Votação simbólica',
    SIMBÓLICA: 'Votação simbólica',
    SECRETA: 'Votação secreta',
  };

  return labels[normalized] || type || 'Votação';
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

function mapVotacaoResumo(item: BackendVotacaoResumo): VotacaoPerfil {
  const id = String(item.id ?? item.data ?? Math.random());
  const resumo = item.resumo?.trim() || 'Resumo não informado.';
  const tipo = formatVotingType(item.tipo);

  return {
    id,
    titulo: tipo,
    data: item.data || '',
    tema: buildVotingHeadline(resumo),
    resumo,
    voto: formatVotingChoice(item.voto),
    resultado: item.resultado || 'Resultado não informado',
    orientacaoCasa: tipo,
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
    valor: Number(item.valor ?? 0),
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
    confiancaVinculo:
      item.confiancaVinculo === null || item.confiancaVinculo === undefined
        ? undefined
        : Number(item.confiancaVinculo),
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
  return {
    id: Number(item.id ?? 0),
    nomeCivil: item.nomeCivil ?? null,
    nomeUrna: item.nomeUrna ?? null,
    partidoAtual: item.partidoAtual ?? null,
    uf: item.uf ?? null,
    fotoUrl: item.fotoUrl ?? null,
    metodoVinculo: item.metodoVinculo ?? null,
    confiancaVinculo: Number(item.confiancaVinculo ?? 0),
  };
}

export async function getParlamentarById(id: number): Promise<ParlamentarDetalhe | null> {
  try {
    const res = await api.get(`/parlamentares/${id}`);
    return mapDetalhe(res.data as BackendParlamentarDetalhe);
  } catch {
    console.warn('Não foi possível carregar parlamentar do backend.');
    return null;
  }
}

export async function getParlamentaresLista(
  page: number = 1,
  nome?: string,
  uf?: string,
  partido?: string,
  tipo?: TipoParlamentarFiltro,
): Promise<ListaParlamentaresResponse> {
  try {
    const buildParams = (pagina: number) => {
      const params = new URLSearchParams();

      params.append('pagina', String(pagina));
      if (nome) params.append('nome', nome);
      if (uf) params.append('uf', uf);
      if (partido) params.append('partido', partido);

      return params;
    };

    const res = await api.get(`/parlamentares?${buildParams(tipo ? 1 : page).toString()}`);
    const payload = res.data as BackendPaginated<BackendParlamentarResumo> | BackendParlamentarResumo[];

    const itens = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
    const meta = Array.isArray(payload) ? undefined : payload.meta;

    if (tipo) {
      const lastPage = Number(meta?.lastPage ?? 1);
      const remainingPages = Array.from(
        { length: Math.max(0, lastPage - 1) },
        (_, index) => index + 2,
      );

      const remainingResponses = await Promise.all(
        remainingPages.map((pagina) => api.get(`/parlamentares?${buildParams(pagina).toString()}`)),
      );

      const allItems = [
        ...itens,
        ...remainingResponses.flatMap((response) => {
          const pagePayload = response.data as BackendPaginated<BackendParlamentarResumo> | BackendParlamentarResumo[];
          return Array.isArray(pagePayload)
            ? pagePayload
            : Array.isArray(pagePayload?.data)
              ? pagePayload.data
              : [];
        }),
      ];

      const filtered = allItems.map(mapResumo).filter((item) => matchesTipoParlamentar(item, tipo));
      const paginated = paginateParlamentares(filtered, page);

      return {
        ...paginated,
        meta: {
          ...paginated.meta,
          aviso:
            filtered.length === 0
              ? 'Nenhum parlamentar foi retornado pelo backend para os filtros informados.'
              : undefined,
        },
      };
    }

    return {
      data: itens.map(mapResumo),
      meta: {
        total: Number(meta?.total ?? itens.length),
        totalPaginas: Number(meta?.lastPage ?? 1),
        pagina: Number(meta?.page ?? page),
        fonte: 'api',
        aviso:
          itens.length === 0
            ? 'Nenhum parlamentar foi retornado pelo backend para os filtros informados.'
            : undefined,
      },
    };
  } catch {
    console.warn('Não foi possível carregar a lista de parlamentares do backend.');
    return {
      data: [],
      meta: {
        total: 0,
        totalPaginas: 1,
        pagina: page,
        fonte: 'api',
        aviso:
          'Não foi possível carregar os parlamentares do backend. Verifique se a API está rodando.',
      },
    };
  }
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
    const payload = res.data as BackendPaginated<Despesa> | Despesa[];
    const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
    const meta = Array.isArray(payload) ? undefined : payload.meta;

    return {
      data: list,
      meta: {
        total: Number(meta?.total ?? list.length),
        page: Number(meta?.page ?? page),
        lastPage: Number(meta?.lastPage ?? 1),
        limit: Number(meta?.limit ?? DESPESAS_PAGE_SIZE),
      },
    };
  } catch {
    console.warn('Não foi possível carregar despesas do backend.');
    return {
      data: [],
      meta: {
        total: 0,
        page,
        lastPage: 1,
        limit: DESPESAS_PAGE_SIZE,
      },
    };
  }
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

    const categorias = buildCategoriasFromBackend(resumoDespesas.categorias);
    const totalCategorias = categorias.reduce((acc, item) => acc + item.valor, 0);
    const totalAno = parseMoney(resumoDespesas.totalAno) || totalCategorias;
    const mediaMensal = parseMoney(resumoDespesas.mediaMensal) || (totalAno > 0 ? totalAno / 12 : 0);
    const maiorReembolso = parseMoney(resumoDespesas.maiorReembolso);

    return {
      totalAno,
      mediaMensal,
      maiorReembolso,
      categorias,
      itensRecentes: buildItensFromBackend(despesasResponse.data),
      totalRegistros: despesasResponse.meta.total,
      paginaAtual: despesasResponse.meta.page,
      totalPaginas: despesasResponse.meta.lastPage,
      anoReferencia: anoSolicitado,
    };
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

  const categorias = buildCategoriasFromBackend(resumoDespesas.categorias);
  const totalCategorias = categorias.reduce((acc, item) => acc + item.valor, 0);
  const totalAno = parseMoney(resumoDespesas.totalAno) || totalCategorias;
  const mediaMensal = parseMoney(resumoDespesas.mediaMensal) || (totalAno > 0 ? totalAno / 12 : 0);
  const maiorReembolso = parseMoney(resumoDespesas.maiorReembolso);

  return {
    totalAno,
    mediaMensal,
    maiorReembolso,
    categorias,
    itensRecentes: buildItensFromBackend(despesasResponse.data),
    totalRegistros: despesasResponse.meta.total,
    paginaAtual: despesasResponse.meta.page,
    totalPaginas: despesasResponse.meta.lastPage,
    anoReferencia,
  };
}


function buildVotingsQuery(page: number) {
  const params = new URLSearchParams();
  params.append('pagina', String(page));
  params.append('limit', String(VOTACOES_PAGE_SIZE));
  params.append('limite', String(VOTACOES_PAGE_SIZE));

  return params.toString();
}

export async function getVotacoesParlamentar(
  id: number,
  page: number = 1,
): Promise<ListaVotacoesResponse> {
  try {
    const res = await api.get(
      `/parlamentares/${id}/votacoes?${buildVotingsQuery(page)}`,
    );
    const payload = res.data as BackendPaginated<BackendVotacaoResumo> | BackendVotacaoResumo[];
    const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
    const meta = Array.isArray(payload) ? undefined : payload.meta;

    return {
      data: list.map(mapVotacaoResumo),
      meta: {
        total: Number(meta?.total ?? list.length),
        page: Number(meta?.page ?? page),
        lastPage: Number(meta?.lastPage ?? 1),
        limit: Number(meta?.limit ?? VOTACOES_PAGE_SIZE),
      },
    };
  } catch {
    console.warn('Não foi possível carregar votações do parlamentar.');
    return {
      data: [],
      meta: {
        total: 0,
        page,
        lastPage: 1,
        limit: VOTACOES_PAGE_SIZE,
      },
    };
  }
}


export async function getPresencaParlamentar(id: number): Promise<{ taxa: number; totalEventos: number; faltas: number }> {
  try {
    const res = await api.get(`/parlamentares/${id}/presenca`);
    const payload = res.data as BackendPresencaResponse;
    const sessoes = payload.presenca?.sessoesDeliberativas;
    
    return {
      taxa: Number.isFinite(Number(sessoes?.taxa)) ? Math.round(Number(sessoes?.taxa)) : 0,
      totalEventos: Number(sessoes?.totalEventos ?? 0),
      faltas: Number(sessoes?.faltas ?? 0),
    };
  } catch {
    return { taxa: 0, totalEventos: 0, faltas: 0 };
  }
}

export async function getVotacoesPerfil(id: number): Promise<VotacoesPerfil> {
  const [votacoesResponse, presenca] = await Promise.all([
    getVotacoesParlamentar(id, 1),
    getPresencaParlamentar(id),
  ]);

  return {
    presenca,
    alinhamento: null,
    destaques: votacoesResponse.data,
    leituraRapida:
      votacoesResponse.meta.total > 0
        ? `${votacoesResponse.meta.total} votações registradas para este parlamentar.`
        : 'Nenhuma votação registrada foi encontrada para este parlamentar.',
    totalRegistros: votacoesResponse.meta.total,
    paginaAtual: votacoesResponse.meta.page,
    totalPaginas: votacoesResponse.meta.lastPage,
  };
}

export async function getEmendasParlamentar(
  parlamentarId: number,
): Promise<EmendaResumoPerfil[]> {
  try {
    const res = await api.get(`/parlamentares/${parlamentarId}/emendas`);
    const payload = res.data as BackendPaginated<BackendEmendaResumo> | BackendEmendaResumo[];
    const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];

    return list.map(mapEmendaResumo).filter((emenda) => emenda.id > 0);
  } catch {
    console.warn('Não foi possível carregar emendas do parlamentar.');
    return [];
  }
}

type BackendProposicaoPerfil = {
  id?: number;
  apiId?: number;
  idTipoProposicao?: number;
  numero?: string | null;
  ano?: number | null;
  summary?: string | null;
  currentStatus?: string | null;
};

export async function getProposicoesParlamentar(
  id: number,
): Promise<ProposicaoPerfil[]> {
  try {
    const res = await api.get(`/parlamentares/${id}/proposicoes`);

    console.log('PROPOSIÇÕES RECEBIDAS DA API:', res.data);

    const list = Array.isArray(res.data)
      ? (res.data as BackendProposicaoPerfil[])
      : [];

    return list.map((item, index) => {
      const propositionId = item.id ?? item.apiId ?? index;
      const numero = item.numero ?? 'S/N';
      const ano = item.ano ? String(item.ano) : 'Ano não informado';
      const resumo = item.summary ?? 'Resumo não informado';
      const situacao = item.currentStatus ?? 'Situação não informada';
      const tipo = `Tipo ${item.idTipoProposicao ?? 'não informado'}`;

      return {
        id: String(propositionId),
        sigla: tipo,
        numero,
        ano,
        titulo: `Proposição ${numero}/${ano}`,
        resumo,
        papel: 'Autor',
        situacao,
        tema: tipo,
        impactoCidadao:
          'Esta proposição está vinculada à atuação parlamentar registrada no banco de dados.',
        data: '',
      };
    });
  } catch (error) {
    console.error('Erro ao buscar proposições do parlamentar', error);
    return [];
  }
}
export async function getResumoEmendasParlamentar(parlamentarId: number) {
  try {
    const res = await api.get(`/parlamentares/${parlamentarId}/emendas/resumo`);

    return {
      totalEmendas: Number(res.data?.totalEmendas ?? 0),
      totalEmpenhado: parseMoney(res.data?.totalEmpenhado),
      totalLiquidado: parseMoney(res.data?.totalLiquidado),
      totalPago: parseMoney(res.data?.totalPago),
    };
  } catch {
    console.warn('Não foi possível carregar resumo de emendas do parlamentar.');

    return {
      totalEmendas: 0,
      totalEmpenhado: 0,
      totalLiquidado: 0,
      totalPago: 0,
    };
  }
}

export async function getParlamentarProfile(
  id: number,
): Promise<ParlamentarPerfil | null> {
  const detalheApi = await getParlamentarById(id);

  if (!detalheApi) {
    return null;
  }

  const [despesas, emendasLista, resumoEmendas, votacoesPerfil] = await Promise.all([
    getDespesasPerfil(id),
    getEmendasParlamentar(id),
    getResumoEmendasParlamentar(id),
    getVotacoesPerfil(id),
  ]);

  const parlamentar = detalheApi;
  const seed = Math.abs(id);
  const temasPrioritarios = selectItems(seed, 0, 3);
  const comissoes = Array.from(
    { length: 4 },
    (_, index) => COMISSOES[(seed + index) % COMISSOES.length],
  );
  const presenca = 92 + (seed % 6);
  const alinhamento = 71 + (seed % 12);
  const proposicoes = proposicoesApi;
  const votacoes = buildVotacoes(seed, temasPrioritarios);
  const emendas = buildEmendasMock(seed, temasPrioritarios);

  const categorias =
    resumoGastos.length > 0
      ? buildCategoriasFromBackend(resumoGastos)
      : buildCategoriasMock(168000 + (seed % 9) * 8700);

  const emendas: EmendasPerfil = {
    quantidade: resumoEmendas.totalEmendas,
    totalEmpenhado: resumoEmendas.totalEmpenhado,
    totalLiquidado: resumoEmendas.totalLiquidado,
    totalPago: resumoEmendas.totalPago,
    totalRestoInscrito: emendasLista.reduce(
      (acc, item) => acc + Number(item.valorRestoInscrito ?? 0),
      0,
    ),
    principalTipo: emendasLista[0]?.tipoEmenda || '—',
    principalLocalidade: emendasLista[0]?.localidadeDoGasto || '—',
    destaques: emendasLista,
    documentosRecentes: [],
    leituraRapida:
      resumoEmendas.totalEmendas > 0
        ? 'Emendas vinculadas ao parlamentar.'
        : 'Nenhuma emenda vinculada foi encontrada para este parlamentar.',
  };

  const totalDespesas = despesas.totalAno;

	const indicadores: PerfilIndicador[] = [
		{
			titulo: 'Presença em Sessões Deliberativas',
			valor: `${votacoesPerfil.presenca.taxa}%`,
			apoio: `${votacoesPerfil.presenca.totalEventos} eventos · ${votacoesPerfil.presenca.faltas} faltas`,
			destaque: votacoesPerfil.presenca.taxa > 85 ? 'positivo' : 'atencao',
		},
    {
      titulo: 'Proposições acompanhadas',
      valor: `${18 + (seed % 11)}`,
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
      valor: shortCurrency(totalDespesas),
      apoio:
        despesas.totalRegistros > 0
          ? despesas.anoReferencia
            ? `${despesas.totalRegistros} registros · ano mais recente disponível`
            : `${despesas.totalRegistros} registros consolidados`
          : 'sem despesas registradas',
      destaque: 'atencao',
    },
  ];

  return {
    parlamentar,
    subtitulo:
      'Acompanhe a atuação legislativa, as votações e o uso de recursos do mandato.',
    resumo: '',
    biografia: `${parlamentar.nomeParlamentar} atua na ${
      parlamentar.casaLegislativa ?? 'casa legislativa'
    } representando ${parlamentar.uf}. Os dados consolidados destacam atuação em ${temasPrioritarios[0].toLowerCase()}, ${temasPrioritarios[1].toLowerCase()} e ${temasPrioritarios[2].toLowerCase()}.`,
    temasPrioritarios,
    comissoes,
    indicadores,
    proposicoes,
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
