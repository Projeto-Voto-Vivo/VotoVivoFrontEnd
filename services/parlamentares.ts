import api from './api';
import {
  CategoriaDespesaPerfil,
  Despesa,
  DocumentoEmendaPerfil,
  EmendaDetalhe,
  EmendaParlamentarVinculado,
  EmendaResumoPerfil,
  EmendasPerfil,
  GastoResumo,
  ItemDespesaPerfil,
  ListaParlamentaresResponse,
  Parlamentar,
  ParlamentarDetalhe,
  ParlamentarPerfil,
  PerfilIndicador,
  ProposicaoPerfil,
  VotacaoPerfil,
} from '@/types';

const PAGE_SIZE = 20;

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

const MOCK_RESUMO_GASTOS: Record<number, GastoResumo[]> = {
  1001: [
    { tipoDespesa: 'Emissão de Bilhete Aéreo', total: 1200.5 },
    { tipoDespesa: 'Hospedagem', total: 850 },
    { tipoDespesa: 'Divulgação da Atividade Parlamentar', total: 430.75 },
  ],
  1002: [
    { tipoDespesa: 'Combustíveis e Lubrificantes', total: 300 },
    { tipoDespesa: 'Divulgação da Atividade Parlamentar', total: 980.9 },
  ],
};

const MOCK_DESPESAS: Record<number, Despesa[]> = {
  1001: [
    {
      data: '2024-02-20',
      tipo: 'Divulgação da Atividade Parlamentar',
      fornecedor: 'Gráfica Nacional',
      valor: 430.75,
      urlDocumento: 'https://example.com/invoices/expense-3.pdf',
    },
    {
      data: '2024-02-10',
      tipo: 'Hospedagem',
      fornecedor: 'Hotel Brasília',
      valor: 850,
      urlDocumento: 'https://example.com/invoices/expense-2.pdf',
    },
    {
      data: '2024-01-15',
      tipo: 'Emissão de Bilhete Aéreo',
      fornecedor: 'Companhia Aérea Brasil',
      valor: 1200.5,
      urlDocumento: 'https://example.com/invoices/expense-1.pdf',
    },
  ],
  1002: [
    {
      data: '2024-03-01',
      tipo: 'Divulgação da Atividade Parlamentar',
      fornecedor: 'Agência de Comunicação BR',
      valor: 980.9,
      urlDocumento: 'https://example.com/invoices/expense-5.pdf',
    },
    {
      data: '2024-01-05',
      tipo: 'Combustíveis e Lubrificantes',
      fornecedor: 'Posto Central',
      valor: 300,
      urlDocumento: 'https://example.com/invoices/expense-4.pdf',
    },
  ],
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

function buildCategoriasMock(totalAno: number): CategoriaDespesaPerfil[] {
  const primeira = Math.round(totalAno * 0.34);
  const segunda = Math.round(totalAno * 0.27);
  const terceira = Math.round(totalAno * 0.22);
  const quarta = Math.round(totalAno * 0.17);

  return [
    {
      categoria: 'Serviços de TI',
      valor: primeira,
      descricao: 'Investimentos em infraestrutura digital e software.',
    },
    {
      categoria: 'Educação',
      valor: segunda,
      descricao: 'Recursos para melhoria da qualidade educacional.',
    },
    {
      categoria: 'Saúde',
      valor: terceira,
      descricao: 'Financiamento para programas de saúde pública.',
    },
    {
      categoria: 'Infraestrutura',
      valor: quarta,
      descricao: 'Projetos de melhoria da infraestrutura urbana.',
    },
  ];
}

function buildItensDespesaMock(seed: number): ItemDespesaPerfil[] {
  const itens: Array<Omit<ItemDespesaPerfil, 'documentoLabel'>> = [
    {
      data: '2026-03-14',
      tipo: 'Passagem aérea',
      fornecedor: 'Viagens Brasil Turismo',
      valor: 2840 + (seed % 5) * 120,
    },
    {
      data: '2026-03-07',
      tipo: 'Divulgação da atividade parlamentar',
      fornecedor: 'Agência Cidadania Digital',
      valor: 4150 + (seed % 4) * 160,
    },
    {
      data: '2026-02-26',
      tipo: 'Locação de veículo',
      fornecedor: 'Mobilidade Executiva LTDA',
      valor: 1980 + (seed % 6) * 80,
    },
    {
      data: '2026-02-11',
      tipo: 'Consultoria técnica',
      fornecedor: 'Instituto de Estudos Legislativos',
      valor: 5620 + (seed % 3) * 240,
    },
  ];

  return itens.map((item, index) => ({
    ...item,
    documentoLabel: `Recibo ${String(seed).padStart(4, '0')}-${index + 1}`,
  }));
}

function buildCategoriasFromBackend(
  summary: { tipoDespesa: string; total: number }[],
): CategoriaDespesaPerfil[] {
  return summary.map((item) => ({
    categoria: item.tipoDespesa,
    valor: item.total,
    descricao:
      DESPESA_DESCRICOES[item.tipoDespesa] ||
      `Categoria de despesa registrada na API do backend: ${toCapitalizedCategory(
        item.tipoDespesa,
      )}.`,
  }));
}

function buildItensFromBackend(items: Despesa[]): ItemDespesaPerfil[] {
  return items.map((item, index) => ({
    data: item.data || '2024-01-01',
    tipo: item.tipo,
    fornecedor: item.fornecedor,
    valor: item.valor,
    documentoLabel: item.urlDocumento ? `Documento ${index + 1}` : `Registro ${index + 1}`,
  }));
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

export async function getResumoGastos(id: number): Promise<GastoResumo[]> {
  try {
    const res = await api.get(`/parlamentares/${id}/despesas/resumo`);
    const list = Array.isArray(res.data) ? (res.data as GastoResumo[]) : [];
    return list.length > 0 ? list : MOCK_RESUMO_GASTOS[id] || [];
  } catch {
    console.warn('Não foi possível carregar resumo de despesas; mantendo fallback temporário.');
    return MOCK_RESUMO_GASTOS[id] || [];
  }
}

export async function getDespesasParlamentar(
  id: number,
  page: number = 1,
): Promise<Despesa[]> {
  try {
    const res = await api.get(`/parlamentares/${id}/despesas?pagina=${page}`);
    const payload = res.data as BackendPaginated<Despesa> | Despesa[];
    const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
    return list.length > 0 ? list : MOCK_DESPESAS[id] || [];
  } catch {
    console.warn('Não foi possível carregar despesas; mantendo fallback temporário.');
    return MOCK_DESPESAS[id] || [];
  }
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

  const [resumoGastos, despesasApi, emendasLista, resumoEmendas] = await Promise.all([
    getResumoGastos(id),
    getDespesasParlamentar(id),
    getEmendasParlamentar(id),
    getResumoEmendasParlamentar(id),
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
  const proposicoes = buildProposicoes(seed, temasPrioritarios);
  const votacoes = buildVotacoes(seed, temasPrioritarios);

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
        ? 'Resumo carregado a partir das emendas vinculadas ao parlamentar no backend.'
        : 'Nenhuma emenda vinculada foi encontrada para este parlamentar no backend.',
  };

  const categorias =
    resumoGastos.length > 0
      ? buildCategoriasFromBackend(resumoGastos)
      : buildCategoriasMock(168000 + (seed % 9) * 8700);

  const itensRecentes =
    despesasApi.length > 0 ? buildItensFromBackend(despesasApi) : buildItensDespesaMock(seed);

  const totalAno =
    categorias.reduce((acc, item) => acc + item.valor, 0) ||
    168000 + (seed % 9) * 8700;

  const maiorReembolso =
    itensRecentes.length > 0 ? Math.max(...itensRecentes.map((item) => item.valor)) : 0;

  const indicadores: PerfilIndicador[] = [
    {
      titulo: 'Presença em votações',
      valor: `${presenca}%`,
      apoio: 'considerando sessões registradas no período',
      destaque: 'positivo',
    },
    {
      titulo: 'Proposições acompanhadas',
      valor: `${18 + (seed % 11)}`,
      apoio: 'entre autoria, coautoria e requerimentos',
      destaque: 'neutro',
    },
    {
      titulo: 'Emendas empenhadas',
      valor: shortCurrency(emendas.totalEmpenhado),
      apoio:
        emendas.quantidade > 0
          ? `${emendas.quantidade} emendas vinculadas ao parlamentar`
          : 'nenhuma emenda vinculada encontrada',
      destaque: 'neutro',
    },
    {
      titulo: 'Despesas no ano',
      valor: shortCurrency(totalAno),
      apoio:
        resumoGastos.length > 0
          ? 'valor consolidado a partir da API do backend'
          : 'valor demonstrativo com detalhamento por categoria',
      destaque: 'atencao',
    },
  ];

  return {
    parlamentar,
    subtitulo:
      'Acompanhe a atuação legislativa, as votações e o uso de recursos do mandato.',
    resumo: `${parlamentar.cargo ?? 'Parlamentar'} em exercício pela bancada de ${
      parlamentar.uf
    }. Use as abas abaixo para consultar emendas, proposições, votações e despesas vinculadas ao mandato.`,
    biografia: `${parlamentar.nomeParlamentar} atua na ${
      parlamentar.casaLegislativa ?? 'casa legislativa'
    } representando ${parlamentar.uf}. Neste protótipo, a narrativa do perfil foi desenhada para traduzir atividade parlamentar em blocos simples de entender, com foco em ${temasPrioritarios[0].toLowerCase()}, ${temasPrioritarios[1].toLowerCase()} e ${temasPrioritarios[2].toLowerCase()}.`,
    temasPrioritarios,
    comissoes,
    indicadores,
    proposicoes,
    votacoes: {
      presenca,
      alinhamento,
      destaques: votacoes,
      leituraRapida:
        'As votações aparecem com contexto, resultado final e o voto registrado, para reduzir a distância entre o dado bruto e o entendimento do cidadão.',
    },
    despesas: {
      totalAno,
      mediaMensal: Math.round(totalAno / 12),
      maiorReembolso,
      categorias,
      itensRecentes,
    },
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
