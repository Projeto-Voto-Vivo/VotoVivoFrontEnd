import { getDeputadoById, getDespesasDeputado, getResumoGastos } from './deputados';
import {
  CategoriaDespesaPerfil,
  ItemDespesaPerfil,
  ParlamentarDetalhe,
  ParlamentarPerfil,
  PerfilIndicador,
  ProposicaoPerfil,
  UFs,
  VotacaoPerfil,
} from '@/types';

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
  'Passagens e deslocamentos': 'Custeia viagens e deslocamentos ligados à atividade parlamentar.',
  'Divulgação da atividade parlamentar': 'Comunicação do mandato e ações de prestação de contas.',
  'Consultorias e pesquisas': 'Apoio técnico para estudos, notas e preparação de proposições.',
  'Escritório de apoio': 'Operação administrativa e manutenção do escritório político.',
  'Emissão de Bilhete Aéreo': 'Despesas com viagens ligadas ao exercício do mandato.',
  Hospedagem: 'Custos de estadia vinculados a agendas parlamentares.',
  'Divulgação da Atividade Parlamentar': 'Gastos com comunicação institucional e divulgação do mandato.',
  'Combustíveis e Lubrificantes': 'Despesas de deslocamento terrestre e apoio logístico.',
};

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

function createFallbackParlamentar(id: number, base?: ParlamentarDetalhe | null): ParlamentarDetalhe {
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
      `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=002776&color=ffffff&size=512`,
    cargo: base?.cargo ?? (base ? 'Deputado Federal' : escolhaCasa.cargo),
    casaLegislativa: base?.casaLegislativa ?? (base ? 'Câmara dos Deputados' : escolhaCasa.casa),
    legislatura: base?.legislatura ?? `${57 + (seed % 2)}ª Legislatura`,
    situacaoMandato: base?.situacaoMandato ?? base?.situacao ?? 'Em exercício',
    nomeCivil: base?.nomeCivil ?? `${nome} de Souza`,
    dataNascimento: base?.dataNascimento ?? `198${seed % 10}-0${(seed % 8) + 1}-1${seed % 9}`,
    email: base?.email ?? `${primeiroNome}.${seed}@votovivo.leg.br`,
    situacao: base?.situacao ?? 'Em exercício',
    gabinete:
      base?.gabinete ??
      {
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
  return Array.from({ length: size }, (_, index) => TEMAS[(seed + start + index) % TEMAS.length]);
}

function buildProposicoes(seed: number, temas: string[]): ProposicaoPerfil[] {
  const modelos = [
    {
      sigla: 'PL',
      papel: 'Autoria principal',
      situacao: 'Em tramitação',
      sufixo: 'amplia padrões de transparência ativa e simplifica a leitura dos dados públicos.',
    },
    {
      sigla: 'PEC',
      papel: 'Coautoria',
      situacao: 'Aguardando parecer',
      sufixo: 'reorganiza competências e reforça mecanismos de monitoramento cidadão.',
    },
    {
      sigla: 'REQ',
      papel: 'Requerimento apresentado',
      situacao: 'Aprovado em comissão',
      sufixo: 'pede audiência pública com especialistas e representantes da sociedade civil.',
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
      resumo: 'Votação nominal sobre regras de publicação e reaproveitamento de dados de execução orçamentária.',
      voto: votos[0],
      resultado: resultados[0],
      orientacaoCasa: 'Houve convergência entre governo e oposição em parte do texto final.',
    },
    {
      id: `vot-${seed}-2`,
      titulo: 'Incentivo à conectividade em escolas públicas',
      data: '2026-03-04',
      tema: temas[1],
      resumo: 'Define prioridade de investimento em infraestrutura digital e conectividade educacional.',
      voto: votos[3],
      resultado: resultados[3],
      orientacaoCasa: 'A orientação partidária ficou dividida em blocos e houve destaque para ajustes no financiamento.',
    },
    {
      id: `vot-${seed}-3`,
      titulo: 'Crédito extraordinário para atendimento regional',
      data: '2026-02-21',
      tema: temas[2],
      resumo: 'Reforço orçamentário com foco em ações emergenciais e atendimento local.',
      voto: votos[1],
      resultado: resultados[1],
      orientacaoCasa: 'O debate girou em torno do impacto fiscal e da necessidade de critérios mais claros de execução.',
    },
    {
      id: `vot-${seed}-4`,
      titulo: 'Programa de compras públicas sustentáveis',
      data: '2026-02-05',
      tema: 'Sustentabilidade fiscal',
      resumo: 'Estabelece parâmetros para contratação pública com critérios de eficiência e sustentabilidade.',
      voto: votos[0],
      resultado: resultados[0],
      orientacaoCasa: 'A discussão combinou impacto orçamentário, metas ambientais e incentivo à inovação.',
    },
  ];
}

function buildCategoriasMock(totalAno: number): CategoriaDespesaPerfil[] {
  const primeira = Math.round(totalAno * 0.34);
  const segunda = Math.round(totalAno * 0.27);
  const terceira = Math.round(totalAno * 0.19);
  const quarta = totalAno - primeira - segunda - terceira;
  const valores = [
    ['Passagens e deslocamentos', primeira],
    ['Divulgação da atividade parlamentar', segunda],
    ['Consultorias e pesquisas', terceira],
    ['Escritório de apoio', quarta],
  ] as const;

  return valores.map(([categoria, valor]) => ({
    categoria,
    valor,
    descricao: DESPESA_DESCRICOES[categoria],
  }));
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

function buildCategoriasFromBackend(summary: { tipoDespesa: string; total: number }[]): CategoriaDespesaPerfil[] {
  return summary.map((item) => ({
    categoria: item.tipoDespesa,
    valor: item.total,
    descricao:
      DESPESA_DESCRICOES[item.tipoDespesa] ||
      `Categoria de despesa registrada na API do backend: ${toCapitalizedCategory(item.tipoDespesa)}.`,
  }));
}

function buildItensFromBackend(items: Awaited<ReturnType<typeof getDespesasDeputado>>): ItemDespesaPerfil[] {
  return items.map((item, index) => ({
    data: item.data || '2024-01-01',
    tipo: item.tipo,
    fornecedor: item.fornecedor,
    valor: item.valor,
    documentoLabel: item.urlDocumento ? `Documento ${index + 1}` : `Registro ${index + 1}`,
  }));
}

export async function getParlamentarProfile(id: number): Promise<ParlamentarPerfil> {
  const detalheApi = await getDeputadoById(id);
  const resumoGastos = await getResumoGastos(id);
  const despesasApi = await getDespesasDeputado(id);

  const parlamentar = createFallbackParlamentar(id, detalheApi);
  const seed = Math.abs(id);
  const temasPrioritarios = selectItems(seed, 0, 3);
  const comissoes = Array.from({ length: 4 }, (_, index) => COMISSOES[(seed + index) % COMISSOES.length]);
  const presenca = 92 + (seed % 6);
  const alinhamento = 71 + (seed % 12);
  const proposicoes = buildProposicoes(seed, temasPrioritarios);
  const votacoes = buildVotacoes(seed, temasPrioritarios);

  const categorias = resumoGastos.length > 0 ? buildCategoriasFromBackend(resumoGastos) : buildCategoriasMock(168000 + (seed % 9) * 8700);
  const itensRecentes = despesasApi.length > 0 ? buildItensFromBackend(despesasApi) : buildItensDespesaMock(seed);
  const totalAno = categorias.reduce((acc, item) => acc + item.valor, 0) || 168000 + (seed % 9) * 8700;
  const maiorReembolso = Math.max(...itensRecentes.map((item) => item.valor));
  const fontesReais = [
    detalheApi ? 'detalhe do parlamentar' : null,
    resumoGastos.length > 0 ? 'resumo de gastos' : null,
    despesasApi.length > 0 ? 'despesas detalhadas' : null,
  ].filter(Boolean) as string[];

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
      titulo: 'Votações nominais',
      valor: `${146 + (seed % 54)}`,
      apoio: 'com leitura resumida para o usuário',
      destaque: 'neutro',
    },
    {
      titulo: 'Despesas no ano',
      valor: shortCurrency(totalAno),
      apoio: resumoGastos.length > 0 ? 'valor consolidado a partir da API do backend' : 'valor demonstrativo com detalhamento por categoria',
      destaque: 'atencao',
    },
  ];

  return {
    parlamentar,
    subtitulo: 'Perfil didático para acompanhar atuação legislativa, votações e uso de recursos do mandato.',
    resumo:
      'Painel pensado para leitura rápida: o usuário entende quem é o parlamentar, quais temas prioriza e como se posiciona nas votações mais relevantes.',
    biografia: `${parlamentar.nomeParlamentar} atua na ${parlamentar.casaLegislativa ?? 'casa legislativa'} representando ${parlamentar.uf}. Neste protótipo, a narrativa do perfil foi desenhada para traduzir atividade parlamentar em blocos simples de entender, com foco em ${temasPrioritarios[0].toLowerCase()}, ${temasPrioritarios[1].toLowerCase()} e ${temasPrioritarios[2].toLowerCase()}.`,
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
    observacoesMock: [
      fontesReais.length > 0
        ? `Dados reais consumidos do backend: ${fontesReais.join(', ')}.`
        : 'A instância atual da API não trouxe registros úteis, então o perfil foi preenchido com dados de demonstração para não travar a navegação.',
      'Os blocos de proposições e votações continuam mockados porque o backend enviado ainda não expõe essas rotas por HTTP.',
      'O layout já está preparado para trocar os mocks por dados reais assim que novos endpoints forem disponibilizados.',
    ],
  };
}
