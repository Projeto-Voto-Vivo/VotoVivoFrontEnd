import api from './api';
import { Deputado, DeputadoDetalhe, Despesa, GastoResumo, ListaDeputadosResponse } from '@/types';

const PAGE_SIZE = 12;

type BackendParlamentarResumo = {
  id: number;
  nomeParlamentar?: string | null;
  siglaPartido?: string | null;
  uf?: string | null;
  urlFoto?: string | null;
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

const MOCK_PARLAMENTARES: Deputado[] = [
  { id: 1001, nomeParlamentar: 'João da Silva', siglaPartido: 'PT', uf: 'SP', urlFoto: '', cargo: 'Deputado Federal', casaLegislativa: 'Câmara dos Deputados', legislatura: '57ª Legislatura', situacaoMandato: 'Em exercício' },
  { id: 1002, nomeParlamentar: 'Maria Oliveira', siglaPartido: 'PSB', uf: 'RJ', urlFoto: '', cargo: 'Deputada Federal', casaLegislativa: 'Câmara dos Deputados', legislatura: '57ª Legislatura', situacaoMandato: 'Em exercício' },
  { id: 1003, nomeParlamentar: 'Carlos Henrique Lima', siglaPartido: 'MDB', uf: 'MG', urlFoto: '', cargo: 'Senador', casaLegislativa: 'Senado Federal', legislatura: '57ª Legislatura', situacaoMandato: 'Em exercício' },
  { id: 1004, nomeParlamentar: 'Ana Beatriz Costa', siglaPartido: 'PSD', uf: 'PE', urlFoto: '', cargo: 'Deputada Estadual', casaLegislativa: 'Assembleia Legislativa', legislatura: '20ª Legislatura', situacaoMandato: 'Em exercício' },
  { id: 1005, nomeParlamentar: 'Fernanda Rocha', siglaPartido: 'UNIÃO', uf: 'GO', urlFoto: '', cargo: 'Vereadora', casaLegislativa: 'Câmara Municipal', legislatura: '18ª Legislatura', situacaoMandato: 'Em exercício' },
  { id: 1006, nomeParlamentar: 'Marcos Vinícius Souza', siglaPartido: 'PL', uf: 'PR', urlFoto: '', cargo: 'Deputado Federal', casaLegislativa: 'Câmara dos Deputados', legislatura: '57ª Legislatura', situacaoMandato: 'Em exercício' },
  { id: 1007, nomeParlamentar: 'Patrícia Gomes', siglaPartido: 'REDE', uf: 'CE', urlFoto: '', cargo: 'Deputada Estadual', casaLegislativa: 'Assembleia Legislativa', legislatura: '20ª Legislatura', situacaoMandato: 'Em exercício' },
  { id: 1008, nomeParlamentar: 'Eduardo Nascimento', siglaPartido: 'PSDB', uf: 'RS', urlFoto: '', cargo: 'Vereador', casaLegislativa: 'Câmara Municipal', legislatura: '18ª Legislatura', situacaoMandato: 'Em exercício' },
];

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
    { data: '2024-02-20', tipo: 'Divulgação da Atividade Parlamentar', fornecedor: 'Gráfica Nacional', valor: 430.75, urlDocumento: 'https://example.com/invoices/expense-3.pdf' },
    { data: '2024-02-10', tipo: 'Hospedagem', fornecedor: 'Hotel Brasília', valor: 850, urlDocumento: 'https://example.com/invoices/expense-2.pdf' },
    { data: '2024-01-15', tipo: 'Emissão de Bilhete Aéreo', fornecedor: 'Companhia Aérea Brasil', valor: 1200.5, urlDocumento: 'https://example.com/invoices/expense-1.pdf' },
  ],
  1002: [
    { data: '2024-03-01', tipo: 'Divulgação da Atividade Parlamentar', fornecedor: 'Agência de Comunicação BR', valor: 980.9, urlDocumento: 'https://example.com/invoices/expense-5.pdf' },
    { data: '2024-01-05', tipo: 'Combustíveis e Lubrificantes', fornecedor: 'Posto Central', valor: 300, urlDocumento: 'https://example.com/invoices/expense-4.pdf' },
  ],
};

const encodeSvg = (svg: string) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

function getFallbackPhoto(nome: string) {
  const label = nome
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

function enrichMock(deputado: Deputado): Deputado {
  return {
    ...deputado,
    urlFoto: normalizePhoto(deputado.urlFoto, deputado.nomeParlamentar),
  };
}

function mapResumo(item: BackendParlamentarResumo): Deputado {
  const nomeParlamentar = item.nomeParlamentar?.trim() || 'Parlamentar';
  const fallback = MOCK_PARLAMENTARES.find((mock) => mock.id === item.id);

  return {
    id: item.id,
    nomeParlamentar,
    siglaPartido: item.siglaPartido?.trim() || fallback?.siglaPartido || 'Sem partido',
    uf: item.uf?.trim() || fallback?.uf || '--',
    urlFoto: normalizePhoto(item.urlFoto, nomeParlamentar),
    cargo: fallback?.cargo,
    casaLegislativa: fallback?.casaLegislativa,
    legislatura: fallback?.legislatura,
    situacaoMandato: fallback?.situacaoMandato || 'Em exercício',
  };
}

function mapDetalhe(item: BackendParlamentarDetalhe): DeputadoDetalhe {
  const base = mapResumo(item);
  const fallback = MOCK_PARLAMENTARES.find((mock) => mock.id === item.id);
  const gabinete = parseOfficeAddress(item.gabinete?.endereco || null);

  return {
    ...base,
    cargo: base.cargo || fallback?.cargo || 'Parlamentar',
    casaLegislativa: base.casaLegislativa || fallback?.casaLegislativa || 'Poder Legislativo',
    legislatura: base.legislatura || fallback?.legislatura || 'Legislatura atual',
    situacaoMandato: base.situacaoMandato || 'Em exercício',
    nomeCivil: item.nomeCivil?.trim() || base.nomeParlamentar,
    dataNascimento: item.dataNascimento || '1980-01-01',
    email: item.email?.trim() || `${base.nomeParlamentar.toLowerCase().replace(/\s+/g, '.')}@leg.br`,
    situacao: 'Em exercício',
    gabinete: {
      telefone: item.gabinete?.telefone || '(61) 0000-0000',
      email: item.email?.trim() || `${base.nomeParlamentar.toLowerCase().replace(/\s+/g, '.')}@leg.br`,
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

function filterMockList(nome?: string, uf?: string, partido?: string) {
  return MOCK_PARLAMENTARES.map(enrichMock).filter((item) => {
    const byNome = nome ? item.nomeParlamentar.toLowerCase().includes(nome.toLowerCase()) : true;
    const byUf = uf ? item.uf === uf.toUpperCase() : true;
    const byPartido = partido ? item.siglaPartido === partido.toUpperCase() : true;
    return byNome && byUf && byPartido;
  });
}

function paginate(list: Deputado[], page: number) {
  const total = list.length;
  const totalPaginas = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pagina = Math.min(Math.max(page, 1), totalPaginas);
  const inicio = (pagina - 1) * PAGE_SIZE;
  const data = list.slice(inicio, inicio + PAGE_SIZE);

  return {
    data,
    meta: {
      total,
      totalPaginas,
      pagina,
    },
  };
}

function buildMockListResponse(page: number, nome?: string, uf?: string, partido?: string, motivo?: string): ListaDeputadosResponse {
  const base = paginate(filterMockList(nome, uf, partido), page);
  return {
    ...base,
    meta: {
      ...base.meta,
      fonte: 'mock',
      aviso:
        motivo ||
        'A API não devolveu registros nesta instância. A lista abaixo usa dados de demonstração para o front continuar navegável.',
    },
  };
}

export async function getDeputadoById(id: number): Promise<DeputadoDetalhe | null> {
  try {
    const res = await api.get(`/parlamentares/${id}`);
    return mapDetalhe(res.data as BackendParlamentarDetalhe);
  } catch (error) {
    console.error('Erro ao buscar parlamentar', error);
    const fallback = MOCK_PARLAMENTARES.find((item) => item.id === id);
    if (!fallback) return null;

    return {
      ...enrichMock(fallback),
      nomeCivil: fallback.nomeParlamentar,
      dataNascimento: '1980-01-01',
      email: `${fallback.nomeParlamentar.toLowerCase().replace(/\s+/g, '.')}@leg.br`,
      situacao: 'Em exercício',
      gabinete: {
        sala: '101',
        predio: 'Gabinete parlamentar',
        telefone: '(61) 0000-0000',
        email: `${fallback.nomeParlamentar.toLowerCase().replace(/\s+/g, '.')}@leg.br`,
        endereco: 'Gabinete parlamentar',
      },
      redesSociais: [],
    };
  }
}

export async function getDeputadosLista(
  page: number = 1,
  nome?: string,
  uf?: string,
  partido?: string,
): Promise<ListaDeputadosResponse> {
  try {
    const params = new URLSearchParams();
    if (nome) params.append('nome', nome);
    if (uf) params.append('uf', uf);
    if (partido) params.append('partido', partido);

    const query = params.toString();
    const endpoint = query ? `/parlamentar?${query}` : '/parlamentar';
    const res = await api.get(endpoint);

    const lista = Array.isArray(res.data)
      ? (res.data as BackendParlamentarResumo[]).map(mapResumo)
      : [];

    if (lista.length === 0) {
      return buildMockListResponse(
        page,
        nome,
        uf,
        partido,
        'A API respondeu, mas retornou a lista vazia. Exibindo dados de demonstração enquanto o seed do backend é ajustado.',
      );
    }

    const paginated = paginate(lista, page);
    return {
      ...paginated,
      meta: {
        ...paginated.meta,
        fonte: 'api',
      },
    };
  } catch (error) {
    console.error('Erro ao buscar lista de parlamentares', error);
    return buildMockListResponse(page, nome, uf, partido);
  }
}

export async function getResumoGastos(id: number): Promise<GastoResumo[]> {
  try {
    const res = await api.get(`/parlamentares/${id}/gastos/resumo`);
    const list = Array.isArray(res.data) ? (res.data as GastoResumo[]) : [];
    return list.length > 0 ? list : (MOCK_RESUMO_GASTOS[id] || []);
  } catch (error) {
    console.error('Erro ao buscar resumo de gastos', error);
    return MOCK_RESUMO_GASTOS[id] || [];
  }
}

export async function getDespesasDeputado(id: number, page: number = 1): Promise<Despesa[]> {
  try {
    const res = await api.get(`/parlamentares/${id}/gastos?pagina=${page}`);
    const list = Array.isArray(res.data) ? (res.data as Despesa[]) : [];
    return list.length > 0 ? list : (MOCK_DESPESAS[id] || []);
  } catch (error) {
    console.error('Erro ao buscar despesas do parlamentar', error);
    return MOCK_DESPESAS[id] || [];
  }
}
