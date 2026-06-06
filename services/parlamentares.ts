import api from './api';
import {
  CategoriaDespesaPerfil,
  Despesa,
  DocumentoEmendaPerfil,
  EmendaDetalhe,
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
  UFs,
  VotacaoPerfil,
} from '@/types';

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

const MOCK_PARLAMENTARES: Parlamentar[] = [
  {
    id: 1001,
    nomeParlamentar: 'João da Silva',
    siglaPartido: 'PT',
    uf: 'SP',
    urlFoto: '',
    cargo: 'Deputado Federal',
    casaLegislativa: 'Câmara dos Deputados',
    legislatura: '57ª Legislatura',
    situacaoMandato: 'Em exercício',
  },
  {
    id: 1002,
    nomeParlamentar: 'Maria Oliveira',
    siglaPartido: 'PSB',
    uf: 'RJ',
    urlFoto: '',
    cargo: 'Deputada Federal',
    casaLegislativa: 'Câmara dos Deputados',
    legislatura: '57ª Legislatura',
    situacaoMandato: 'Em exercício',
  },
  {
    id: 1003,
    nomeParlamentar: 'Carlos Henrique Lima',
    siglaPartido: 'MDB',
    uf: 'MG',
    urlFoto: '',
    cargo: 'Senador',
    casaLegislativa: 'Senado Federal',
    legislatura: '57ª Legislatura',
    situacaoMandato: 'Em exercício',
  },
  {
    id: 1004,
    nomeParlamentar: 'Ana Beatriz Costa',
    siglaPartido: 'PSD',
    uf: 'PE',
    urlFoto: '',
    cargo: 'Deputada Estadual',
    casaLegislativa: 'Assembleia Legislativa',
    legislatura: '20ª Legislatura',
    situacaoMandato: 'Em exercício',
  },
  {
    id: 1005,
    nomeParlamentar: 'Fernanda Rocha',
    siglaPartido: 'UNIÃO',
    uf: 'GO',
    urlFoto: '',
    cargo: 'Vereadora',
    casaLegislativa: 'Câmara Municipal',
    legislatura: '18ª Legislatura',
    situacaoMandato: 'Em exercício',
  },
  {
    id: 1006,
    nomeParlamentar: 'Marcos Vinícius Souza',
    siglaPartido: 'PL',
    uf: 'PR',
    urlFoto: '',
    cargo: 'Deputado Federal',
    casaLegislativa: 'Câmara dos Deputados',
    legislatura: '57ª Legislatura',
    situacaoMandato: 'Em exercício',
  },
  {
    id: 1007,
    nomeParlamentar: 'Patrícia Gomes',
    siglaPartido: 'REDE',
    uf: 'CE',
    urlFoto: '',
    cargo: 'Deputada Estadual',
    casaLegislativa: 'Assembleia Legislativa',
    legislatura: '20ª Legislatura',
    situacaoMandato: 'Em exercício',
  },
  {
    id: 1008,
    nomeParlamentar: 'Eduardo Nascimento',
    siglaPartido: 'PSDB',
    uf: 'RS',
    urlFoto: '',
    cargo: 'Vereador',
    casaLegislativa: 'Câmara Municipal',
    legislatura: '18ª Legislatura',
    situacaoMandato: 'Em exercício',
  },
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

const PARTIDOS_FALLBACK = ['PT', 'PL', 'UNIÃO', 'MDB', 'PSD', 'PSB', 'PP', 'PDT'];

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

function enrichMock(parlamentar: Parlamentar): Parlamentar {
  return {
    ...parlamentar,
    urlFoto: normalizePhoto(parlamentar.urlFoto, parlamentar.nomeParlamentar),
  };
}

function mapResumo(item: BackendParlamentarResumo): Parlamentar {
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
    situacao: fallback?.situacaoMandato || 'Em exercício',
  };
}

function mapDetalhe(item: BackendParlamentarDetalhe): ParlamentarDetalhe {
  const base = mapResumo(item);
  const fallback = MOCK_PARLAMENTARES.find((mock) => mock.id === item.id);
  const gabinete = parseOfficeAddress(item.gabinete?.endereco || null);
  const emailBase =
    item.email?.trim() ||
    `${base.nomeParlamentar.toLowerCase().replace(/\s+/g, '.')}@leg.br`;

  return {
    ...base,
    cargo: base.cargo || fallback?.cargo || 'Parlamentar',
    casaLegislativa:
      base.casaLegislativa || fallback?.casaLegislativa || 'Poder Legislativo',
    legislatura: base.legislatura || fallback?.legislatura || 'Legislatura atual',
    situacaoMandato: base.situacaoMandato || 'Em exercício',
    situacao: base.situacao || 'Em exercício',
    nomeCivil: item.nomeCivil?.trim() || base.nomeParlamentar,
    dataNascimento: item.dataNascimento || '1980-01-01',
    email: emailBase,
    gabinete: {
      telefone: item.gabinete?.telefone || '(61) 0000-0000',
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

function filterMockList(nome?: string, uf?: string, partido?: string) {
  return MOCK_PARLAMENTARES.map(enrichMock).filter((item) => {
    const byNome = nome
      ? item.nomeParlamentar.toLowerCase().includes(nome.toLowerCase())
      : true;
    const byUf = uf ? item.uf === uf.toUpperCase() : true;
    const byPartido = partido ? item.siglaPartido === partido.toUpperCase() : true;
    return byNome && byUf && byPartido;
  });
}

function paginate(list: Parlamentar[], page: number) {
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

function buildMockListResponse(
  page: number,
  nome?: string,
  uf?: string,
  partido?: string,
  motivo?: string,
): ListaParlamentaresResponse {
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

function createFallbackParlamentar(
  id: number,
  base?: ParlamentarDetalhe | null,
): ParlamentarDetalhe {
  const seed = Math.abs(id);
  const casas = [
    { cargo: 'Senador(a)', casa: 'Senado Federal' },
    { cargo: 'Deputado(a) Estadual', casa: 'Assembleia Legislativa' },
    { cargo: 'Vereador(a)', casa: 'Câmara Municipal' },
  ];
  const escolhaCasa = casas[seed % casas.length];
  const nome = base?.nomeParlamentar ?? `Parlamentar ${seed}`;
  const primeiroNome = nome.split(' ')[0]?.toLowerCase() ?? 'parlamentar';

  return {
    id: seed,
    nomeParlamentar: nome,
    siglaPartido: base?.siglaPartido ?? PARTIDOS_FALLBACK[seed % PARTIDOS_FALLBACK.length],
    uf: base?.uf ?? UFs[seed % UFs.length],
    urlFoto:
      base?.urlFoto ??
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        nome,
      )}&background=002776&color=ffffff&size=512`,
    cargo: base?.cargo ?? (base ? 'Deputado Federal' : escolhaCasa.cargo),
    casaLegislativa: base?.casaLegislativa ?? (base ? 'Câmara dos Deputados' : escolhaCasa.casa),
    legislatura: base?.legislatura ?? `${57 + (seed % 2)}ª Legislatura`,
    situacaoMandato: base?.situacaoMandato ?? base?.situacao ?? 'Em exercício',
    situacao: base?.situacao ?? base?.situacaoMandato ?? 'Em exercício',
    nomeCivil: base?.nomeCivil ?? `${nome} de Souza`,
    dataNascimento: base?.dataNascimento ?? `198${seed % 10}-0${(seed % 8) + 1}-1${seed % 9}`,
    email: base?.email ?? `${primeiroNome}.${seed}@votovivo.leg.br`,
    gabinete:
      base?.gabinete ?? {
        sala: `${400 + (seed % 180)}`,
        predio: ['Anexo III', 'Anexo IV', 'Ala Nilo Coelho', 'Edifício Principal'][seed % 4],
        telefone: `(61) 3215-${String(1000 + (seed % 900)).padStart(4, '0')}`,
        email: `${primeiroNome}.${seed}@votovivo.leg.br`,
      },
    redesSociais:
      base?.redesSociais?.length
        ? base.redesSociais
        : [
            { rede: 'Instagram', url: `https://instagram.com/${primeiroNome}${seed}` },
            { rede: 'X', url: `https://x.com/${primeiroNome}${seed}` },
            { rede: 'Site', url: `https://www.votovivo.leg.br/parlamentares/${seed}` },
          ],
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

function buildEmendasMock(seed: number, temas: string[]): EmendasPerfil {
  const tipos = ['Individual', 'Bancada', 'Comissão'];
  const localidades = ['RJ', 'SP', 'MG', 'BA', 'PE', 'CE'];

  const destaques: EmendaResumoPerfil[] = Array.from({ length: 3 }, (_, index) => {
    const valorEmpenhado = 950000 + (seed % 7) * 120000 + index * 430000;
    const valorLiquidado = Math.round(valorEmpenhado * (0.48 + index * 0.08));
    const valorPago = Math.round(valorLiquidado * 0.72);

    return {
      codigoEmenda: `2025${String(seed).padStart(4, '0')}${index + 1}`,
      ano: 2025,
      tipoEmenda: tipos[(seed + index) % tipos.length],
      nomeAutor: `Parlamentar ${seed}`,
      numeroEmenda: String(1000 + seed + index),
      localidadeDoGasto: localidades[(seed + index) % localidades.length],
      funcao: temas[index] || 'Desenvolvimento regional',
      subfuncao:
        index === 0
          ? 'Atenção básica'
          : index === 1
            ? 'Infraestrutura urbana'
            : 'Apoio administrativo',
      valorEmpenhado,
      valorLiquidado,
      valorPago,
    };
  });

  const documentosRecentes: DocumentoEmendaPerfil[] = destaques.map((emenda, index) => ({
    id: seed * 10 + index,
    data: `2025-0${index + 3}-1${index + 2}`,
    fase: index === 0 ? 'Empenho' : index === 1 ? 'Liquidação' : 'Pagamento',
    codigoDocumento: `2025${
      index === 0 ? 'NE' : index === 1 ? 'NL' : 'OB'
    }${String(seed + index).padStart(6, '0')}`,
    codigoDocumentoResumido: `${
      index === 0 ? 'NE' : index === 1 ? 'NL' : 'OB'
    }-${String(seed + index).padStart(4, '0')}`,
    especieTipo:
      index === 0
        ? 'Nota de Empenho'
        : index === 1
          ? 'Nota de Liquidação'
          : 'Ordem Bancária',
    tipoEmenda: emenda.tipoEmenda,
  }));

  const totalEmpenhado = destaques.reduce((acc, item) => acc + item.valorEmpenhado, 0);
  const totalLiquidado = destaques.reduce((acc, item) => acc + item.valorLiquidado, 0);
  const totalPago = destaques.reduce((acc, item) => acc + item.valorPago, 0);

  return {
    quantidade: destaques.length,
    totalEmpenhado,
    totalLiquidado,
    totalPago,
    totalRestoInscrito: totalEmpenhado - totalLiquidado,
    principalTipo: destaques[0].tipoEmenda,
    principalLocalidade: destaques[0].localidadeDoGasto,
    destaques,
    documentosRecentes,
    leituraRapida:
      'Este resumo usa campos do endpoint de emendas para mostrar volume financeiro, tipo da emenda, localidade do gasto e estágio geral da execução. Os documentos ficam como apoio para uma tela detalhada futura.',
  };
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

export async function getParlamentarById(id: number): Promise<ParlamentarDetalhe | null> {
  try {
    const res = await api.get(`/parlamentares/${id}`);
    return mapDetalhe(res.data as BackendParlamentarDetalhe);
  } catch (error) {
    console.error('Erro ao buscar parlamentar', error);
    const fallback = MOCK_PARLAMENTARES.find((item) => item.id === id);

    if (!fallback) return null;

    const email = `${fallback.nomeParlamentar.toLowerCase().replace(/\s+/g, '.')}@leg.br`;

    return {
      ...enrichMock(fallback),
      nomeCivil: fallback.nomeParlamentar,
      dataNascimento: '1980-01-01',
      email,
      situacao: 'Em exercício',
      gabinete: {
        sala: '101',
        predio: 'Gabinete parlamentar',
        telefone: '(61) 0000-0000',
        email,
        endereco: 'Gabinete parlamentar',
      },
      redesSociais: [],
    };
  }
}

export async function getParlamentaresLista(
  page: number = 1,
  nome?: string,
  uf?: string,
  partido?: string,
): Promise<ListaParlamentaresResponse> {
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
    return list.length > 0 ? list : MOCK_RESUMO_GASTOS[id] || [];
  } catch (error) {
    console.error('Erro ao buscar resumo de gastos', error);
    return MOCK_RESUMO_GASTOS[id] || [];
  }
}

export async function getDespesasParlamentar(
  id: number,
  page: number = 1,
): Promise<Despesa[]> {
  try {
    const res = await api.get(`/parlamentares/${id}/gastos?pagina=${page}`);
    const list = Array.isArray(res.data) ? (res.data as Despesa[]) : [];
    return list.length > 0 ? list : MOCK_DESPESAS[id] || [];
  } catch (error) {
    console.error('Erro ao buscar despesas do parlamentar', error);
    return MOCK_DESPESAS[id] || [];
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
export async function getParlamentarProfile(id: number): Promise<ParlamentarPerfil> {
  const [detalheApi, resumoGastos, despesasApi, proposicoesApi] = await Promise.all([
    getParlamentarById(id),
    getResumoGastos(id),
    getDespesasParlamentar(id),
    getProposicoesParlamentar(id),
  ]);

  const parlamentar = createFallbackParlamentar(id, detalheApi);
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
      apoio: `${emendas.quantidade} emendas mockadas até integração do backend`,
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
      'Perfil didático para acompanhar atuação legislativa, votações e uso de recursos do mandato.',
    resumo:
      'Painel pensado para leitura rápida: o usuário entende quem é o parlamentar, quais temas prioriza e como se posiciona nas votações mais relevantes.',
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
type BackendEmendaDetalhe = {
  codigoEmenda: string;
  ano: number;
  tipoEmenda: string;
  autor: string;
  nomeAutor: string;
  numeroEmenda: string;
  localidadeDoGasto: string;
  funcao: string;
  subfuncao: string;
  valorEmpenhado: string;
  valorLiquidado: string;
  valorPago: string;
  valorRestoInscrito: string;
  valorRestoCancelado: string;
  valorRestoPago: string;
};

export async function getEmendaDetalhe(
  parlamentarId: number,
  codigoEmenda: string,
): Promise<EmendaDetalhe | null> {
  try {
    const [emendasRes, documentosRes] = await Promise.all([
      api.get(`/api-de-dados/emendas?codigoEmenda=${codigoEmenda}`),
      api.get(`/api-de-dados/emendas/documentos/${codigoEmenda}`),
    ]);

    const emendas = Array.isArray(emendasRes.data)
      ? (emendasRes.data as BackendEmendaDetalhe[])
      : [];

    const documentos = Array.isArray(documentosRes.data)
      ? (documentosRes.data as DocumentoEmendaPerfil[])
      : [];

    const emenda = emendas.find((item) => item.codigoEmenda === codigoEmenda);

    if (emenda) {
      return {
        codigoEmenda: emenda.codigoEmenda,
        ano: emenda.ano,
        tipoEmenda: emenda.tipoEmenda,
        autor: emenda.autor,
        nomeAutor: emenda.nomeAutor,
        numeroEmenda: emenda.numeroEmenda,
        localidadeDoGasto: emenda.localidadeDoGasto,
        funcao: emenda.funcao,
        subfuncao: emenda.subfuncao,
        valorEmpenhado: parseMoney(emenda.valorEmpenhado),
        valorLiquidado: parseMoney(emenda.valorLiquidado),
        valorPago: parseMoney(emenda.valorPago),
        valorRestoInscrito: parseMoney(emenda.valorRestoInscrito),
        valorRestoCancelado: parseMoney(emenda.valorRestoCancelado),
        valorRestoPago: parseMoney(emenda.valorRestoPago),
        documentos,
        parlamentarId,
        nomeParlamentar: emenda.nomeAutor,
      };
    }
  } catch (error) {
    console.error('Erro ao buscar detalhe da emenda na API, usando mock', error);
  }

  const profile = await getParlamentarProfile(parlamentarId);

  console.log('DEBUG getEmendaDetalhe', {
    parlamentarId,
    codigoEmendaRecebido: codigoEmenda,
    codigosMockDisponiveis: profile.emendas.destaques.map((item) => item.codigoEmenda),
  });

  const emenda = profile.emendas.destaques.find(
    (item) => item.codigoEmenda === codigoEmenda,
  );
  console.log('DEBUG resultado find', {
    encontrou: Boolean(emenda),
    emendaEncontrada: emenda,
  });

  if (!emenda) {
    return null;
  }

  const documentos = profile.emendas.documentosRecentes.filter(
    (documento) => documento.tipoEmenda === emenda.tipoEmenda,
  );

  return {
    codigoEmenda: emenda.codigoEmenda,
    ano: emenda.ano,
    tipoEmenda: emenda.tipoEmenda,
    autor: String(parlamentarId),
    nomeAutor: emenda.nomeAutor || profile.parlamentar.nomeParlamentar,
    numeroEmenda: emenda.numeroEmenda,
    localidadeDoGasto: emenda.localidadeDoGasto,
    funcao: emenda.funcao,
    subfuncao: emenda.subfuncao,
    valorEmpenhado: emenda.valorEmpenhado,
    valorLiquidado: emenda.valorLiquidado,
    valorPago: emenda.valorPago,
    valorRestoInscrito: profile.emendas.totalRestoInscrito ?? 0,
    valorRestoCancelado: 0,
    valorRestoPago: 0,
    documentos,
    parlamentarId,
    nomeParlamentar: profile.parlamentar.nomeParlamentar,
  };
}