export interface Parlamentar {
  id: number;
  nomeParlamentar: string;
  siglaPartido: string;
  uf: string;
  urlFoto: string;
  cargo?: string;
  casaLegislativa?: string;
  legislatura?: string;
  /**
   * Vem de `parlamentar.condicao_mandato` no banco. `null` quando o backend
   * ainda não expõe o campo — nunca assumir "Em exercício".
   */
  situacaoMandato?: string | null;
  situacao?: string | null;
}

export type Deputado = Parlamentar;

export interface Gabinete {
  sala: string;
  predio: string;
  telefone: string;
  email: string;
  endereco?: string;
}

export interface RedeSocial {
  rede: string;
  url: string;
}

export interface Partido {
  sigla: string;
  nome: string;
}

export interface ParlamentarDetalhe extends Parlamentar {
  nomeCivil: string;
  dataNascimento: string;
  email: string;
  situacao: string | null;
  gabinete: Gabinete;
  redesSociais: RedeSocial[];
}

export type DeputadoDetalhe = ParlamentarDetalhe;

export interface Despesa {
  data: string;
  tipo: string;
  fornecedor: string;
  valor: number;
  urlDocumento: string;
}

export interface GastoResumo {
  tipoDespesa: string;
  total: number;
}

export type CasaLegislativaFiltro = 'camara' | 'senado';

export interface ListaParlamentaresMeta {
  total: number;
  totalPaginas: number;
  pagina: number;
  fonte?: 'api' | 'mock';
  aviso?: string;
}

export interface ListaParlamentaresResponse {
  data: Parlamentar[];
  meta: ListaParlamentaresMeta;
}

export type ListaDeputadosMeta = ListaParlamentaresMeta;
export type ListaDeputadosResponse = ListaParlamentaresResponse;

export interface PerfilIndicador {
  titulo: string;
  valor: string;
  apoio?: string;
  destaque?: 'positivo' | 'neutro' | 'atencao';
}

export interface ProposicaoPerfil {
  id: string;
  sigla: string;
  numero: string;
  ano: string;
  titulo: string;
  resumo: string;
  /** Só é preenchido quando o backend informa o papel real do parlamentar. */
  papel: string | null;
  situacao: string;
  /** Temas oficiais (`temaProposicao`). Vazio quando o backend não informa. */
  temas: string[];
  casa: string | null;
  dataApresentacao: string | null;
}

/**
 * Sobre o que a votação decidia. Sem isto, SIM e NÃO não têm significado
 * estável: num destaque supressivo, é o NÃO que preserva o texto.
 */
export type ObjetoVotacao =
  | 'TEXTO_BASE'
  | 'PARECER'
  | 'EMENDA'
  | 'DESTAQUE'
  | 'REQUERIMENTO'
  | 'REDACAO_FINAL'
  | 'ENCAMINHAMENTO'
  | 'INDEFINIDO';

/** A proposição que estava em jogo na votação. */
export interface ProposicaoDaVotacao {
  id: number;
  titulo: string;
  ementa: string | null;
  situacao: string | null;
}

export interface VotacaoPerfil {
  id: string;
  titulo: string;
  data: string;
  descricao: string;
  resumo: string;
  /**
   * `null` em requerimento e questão de ordem, que não têm proposição
   * vinculada — ausência de vínculo, não falha de dado.
   */
  proposicao: ProposicaoDaVotacao | null;
  /** Sobre o que se votou. `null` quando a API não classificou. */
  objeto: ObjetoVotacao | null;
  /** Votação de mérito: decide o conteúdo, não o rito. */
  merito: boolean;
  voto: string;
  /** Valor bruto do enum de voto, para lógica (não exibir ao cidadão). */
  votoOriginal: string | null;
  resultado: string;
  tipoVotacao: string;
  casa: string | null;
  /** Orientação do partido do parlamentar na data da votação. */
  orientacaoPartido: string | null;
  siglaPartidoNaData: string | null;
  /** `null` quando não há orientação registrada ou o voto não é comparável. */
  seguiuOrientacao: boolean | null;
}

export interface CategoriaDespesaPerfil {
  categoria: string;
  valor: number;
  descricao: string;
}

export interface ItemDespesaPerfil {
  data: string;
  tipo: string;
  fornecedor: string;
  valor: number;
  documentoLabel: string;
  urlDocumento?: string | null;
}

export interface DespesasPerfil {
  totalAno: number;
  /** `null` quando não há base para calcular (nunca dividir por 12 fixo). */
  mediaMensal: number | null;
  mesesConsiderados: number | null;
  maiorReembolso: number;
  categorias: CategoriaDespesaPerfil[];
  itensRecentes: ItemDespesaPerfil[];
  totalRegistros: number;
  paginaAtual: number;
  totalPaginas: number;
  itensPorPagina: number;
  anoReferencia?: number | null;
}

/**
 * Uma taxa de presença sempre carrega a metodologia que a produziu:
 * plenário e comissão não são a mesma medida, e Câmara e Senado não são
 * comparáveis entre si sem rótulo.
 */
export interface PresencaDetalhe {
  /** Presenças + ausências justificadas ÷ total. `null` = sem eventos. */
  taxa: number | null;
  /** Só presenças efetivas: não abona a falta justificada. */
  taxaEstrita: number | null;
  totalEventos: number;
  presentes: number;
  justificadas: number;
  faltas: number;
}

/** Plenário e comissão medem coisas diferentes; deliberativa e solene também. */
export interface PresencaPorEscopo {
  deliberativas: PresencaDetalhe;
  naoDeliberativas: PresencaDetalhe;
}

export interface MetodologiaPresenca {
  casa: string;
  fonte: string;
  observacao: string | null;
}

export interface PresencaPerfil {
  plenario: PresencaPorEscopo;
  comissoes: PresencaPorEscopo;
  /** Eventos que ficaram fora de toda taxa, por falta de classificação. */
  excluidos: { semClassificacao: number; semOrgao: number };
  /**
   * `false` quando não há períodos de mandato registrados: o denominador não
   * pôde ser restrito ao exercício, e a taxa precisa ser lida com essa ressalva.
   */
  restritaAoExercicio: boolean;
  metodologias: MetodologiaPresenca[];
}

/**
 * "Seguiu a orientação do partido?" — comparando o voto com a orientação da
 * bancada do partido **na data da votação**, não do partido atual.
 */
/** Motivos pelos quais não há taxa, cada um com uma leitura diferente. */
export type MotivoSemAlinhamento =
  /** Só a Câmara publica orientação de bancada. */
  | 'ORIENTACAO_INDISPONIVEL_SENADO'
  /** Nenhum voto tem orientação correspondente para comparar. */
  | 'SEM_VOTOS_COMPARAVEIS'
  /** A orientação existe, mas não se identificou a bancada — limitação nossa. */
  | 'BANCADA_NAO_RESOLVIDA'
  /** Há comparações, mas poucas para uma percentagem significar algo. */
  | 'AMOSTRA_INSUFICIENTE'
  /** A consulta falhou. */
  | 'FALHA';

export interface AlinhamentoPartidario {
  /** Há orientação de bancada para a casa deste parlamentar. */
  disponivel: boolean;
  taxa: number | null;
  /** Sempre preenchido quando `taxa` é `null`. */
  motivo: MotivoSemAlinhamento | null;
  seguiu: number;
  divergiu: number;
  consideradas: number;
  /** Votações em que o partido liberou a bancada — fora do denominador. */
  liberadas: number;
  /** Votações com orientação publicada cuja bancada não foi identificada. */
  bancadaNaoResolvida: number;
  /** Mínimo de comparações que a API exige para publicar uma taxa. */
  minimoParaTaxa: number;
  /**
   * `partidoAtual` significa que não havia histórico de filiação: quem trocou
   * de partido foi comparado contra a bancada errada no período anterior.
   */
  fonteFiliacao: 'historico' | 'partidoAtual' | null;
}

/** Filtros da listagem de votações — todos sobre a proposição votada. */
export interface FiltrosVotacao {
  /** Id de uma proposição específica. */
  proposicao?: number;
  tipo?: string;
  ano?: number;
  tema?: string;
  busca?: string;
  objeto?: ObjetoVotacao;
  apenasMerito?: boolean;
}

export interface VotacoesPerfil {
  presenca: PresencaPerfil;
  destaques: VotacaoPerfil[];
  leituraRapida: string;
  totalRegistros: number;
  paginaAtual: number;
  totalPaginas: number;
  itensPorPagina: number;
}

/* ------------------------------------------------------------------ *
 * Perfil temático
 * ------------------------------------------------------------------ */

/** Fidelidade à orientação do partido dentro de um tema. */
export interface AlinhamentoDoTema {
  tema: string;
  /** `null` abaixo do mínimo de comparações — o motivo diz por quê. */
  taxa: number | null;
  motivo: MotivoSemAlinhamento | null;
  seguiu: number;
  divergiu: number;
  consideradas: number;
  liberadas: number;
  bancadaNaoResolvida: number;
  minimoParaTaxa: number;
}

export interface AlinhamentoPorTema {
  disponivel: boolean;
  /**
   * Taxa do mandato inteiro, sob o mesmo recorte dos temas. É a régua: sem ela,
   * "61% em meio ambiente" não diz se é muito ou pouco para este parlamentar.
   */
  geral: AlinhamentoPartidario;
  temas: AlinhamentoDoTema[];
  excluidos: { semProposicao: number; emProposicaoSemTema: number };
  /** Quantos temas tinham comparação, antes do corte por `limite`. */
  temasComparados: number;
  minimoParaTaxa: number;
  apenasMerito: boolean;
  carregado: boolean;
}

export interface TemaVotado {
  tema: string;
  votosSim: number;
  votosNao: number;
  /** `votosSim - votosNao`. Positivo = mais SIM que NÃO no tema. */
  saldo: number;
  abstencoes: number;
  obstrucoes: number;
  totalVotos: number;
}

export interface TemaAutoria {
  tema: string;
  /** Proposições do parlamentar classificadas nesse tema. */
  total: number;
}

export interface PerfilTematico {
  /** Ordenados por quantidade de votos com posição, como a API devolve. */
  temasVotados: TemaVotado[];
  /**
   * Temas em que ele mais assina proposições. Uma proposição conta em cada
   * tema que tem, então a soma destes totais é maior que `totalProposicoes`.
   */
  temasAutoria: TemaAutoria[];
  totalProposicoes: number;
  /** Proposições sem tema registrado — fora de qualquer linha do gráfico. */
  proposicoesSemTema: number;
  totalVotos: number;
  /** Votos que não entram em tema nenhum, contados à parte pela API. */
  excluidos: { semProposicao: number; emProposicaoSemTema: number };
  /** Ressalva metodológica da própria API sobre o que os números significam. */
  observacao: string | null;
  /** Recorte aplicado na origem: quais objetos de votação entraram na conta. */
  apenasMerito: boolean;
  objetosDeMerito: ObjetoVotacao[];
  disponivel: boolean;
}

export interface ComissaoPerfil {
  id: number;
  nome: string;
  sigla: string | null;
  tipoOrgao: string | null;
  papel: string | null;
  dataInicio: string | null;
  dataFim: string | null;
}

export interface FiliacaoPartidariaPerfil {
  id: number;
  siglaPartido: string;
  nomePartido: string | null;
  dataInicio: string | null;
  dataFim: string | null;
}

export interface MandatoExercicioPerfil {
  id: number;
  casa: string | null;
  legislatura: string | null;
  dataInicio: string | null;
  dataFim: string | null;
  condicao: string | null;
}

export interface EmendaResumoPerfil {
  id: number;
  codigoEmenda: string;
  ano: number | null;
  tipoEmenda: string | null;
  autor?: string | null;
  nomeAutor: string | null;
  numeroEmenda: string | null;
  localidadeDoGasto: string | null;
  funcao: string | null;
  subfuncao: string | null;
  valorEmpenhado: number;
  valorLiquidado: number;
  valorPago: number;
  valorRestoInscrito?: number;
  valorRestoCancelado?: number;
  valorRestoPago?: number;
  /** Como o vínculo emenda↔parlamentar foi estabelecido (heurístico). */
  metodoVinculo?: string | null;
  /** 0–1. Vínculos abaixo de 1 são inferidos, não declarados na fonte. */
  confiancaVinculo?: number | null;
}

export interface DocumentoEmendaPerfil {
  id: number;
  idEmenda?: number;
  codigoEmenda?: string;
  data: string | null;
  fase: string | null;
  codigoDocumento: string | null;
  codigoDocumentoResumido: string | null;
  especieTipo: string | null;
  tipoEmenda: string | null;
  urlPortal?: string | null;
}

export interface EmendaParlamentarVinculado {
  id: number;
  nomeCivil: string | null;
  nomeUrna: string | null;
  partidoAtual: string | null;
  uf: string | null;
  fotoUrl: string | null;
  metodoVinculo: string | null;
  confiancaVinculo: number | null;
}

/* ------------------------------------------------------------------ *
 * Panorama das emendas
 * ------------------------------------------------------------------ */

/** Uma fatia do panorama: por área de gasto ou por destino. */
export interface RecorteEmendas {
  /** Nome da função orçamentária ou da localidade, como vem da fonte. */
  rotulo: string;
  quantidade: number;
  empenhado: number;
  pago: number;
}

export interface PanoramaEmendas {
  /** Função orçamentária: a finalidade declarada do gasto. */
  porArea: RecorteEmendas[];
  /** Localidade do gasto: para onde o dinheiro foi destinado. */
  porLocalidade: RecorteEmendas[];
  /** Emendas fora de cada recorte, por falta do campo na fonte. */
  semArea: number;
  semLocalidade: number;
  /** `false` enquanto a API não publica os agregados. */
  disponivel: boolean;
}

export interface EmendasPerfil {
  quantidade: number;
  totalEmpenhado: number;
  totalLiquidado: number;
  totalPago: number;
  totalRestoInscrito: number;
  principalTipo: string;
  principalLocalidade: string;
  /** Primeira página vinda do servidor — não a lista inteira. */
  destaques: EmendaResumoPerfil[];
  documentosRecentes: DocumentoEmendaPerfil[];
  leituraRapida: string;
  /** Quantas emendas do conjunto têm vínculo inferido (confiança < 1). */
  vinculosInferidos: number;
  paginaAtual: number;
  totalPaginas: number;
  itensPorPagina: number;
}

export interface ParlamentarPerfil {
  parlamentar: ParlamentarDetalhe;
  subtitulo: string;
  resumo: string;
  comissoes: ComissaoPerfil[];
  filiacoes: FiliacaoPartidariaPerfil[];
  mandatos: MandatoExercicioPerfil[];
  indicadores: PerfilIndicador[];
  proposicoes: ProposicaoPerfil[];
  votacoes: VotacoesPerfil;
  despesas: DespesasPerfil;
  emendas: EmendasPerfil;
}

export interface EmendaDetalhe extends EmendaResumoPerfil {
  valorRestoInscrito: number;
  valorRestoCancelado: number;
  valorRestoPago: number;
  documentos: DocumentoEmendaPerfil[];
  parlamentares: EmendaParlamentarVinculado[];
  parlamentarId: number;
  nomeParlamentar: string;
}

/* ------------------------------------------------------------------ *
 * Busca de proposições
 * ------------------------------------------------------------------ */

export interface FiltrosProposicao {
  /** Texto livre: casa com a ementa e com o número da proposição. */
  busca?: string;
  /** Sigla do tipo: PL, PEC, MPV... */
  tipo?: string;
  ano?: number;
  casa?: string;
  situacao?: string;
  tema?: string;
  /** Id do parlamentar autor. Cruza autoria com os demais filtros no banco. */
  autor?: number;
}

export interface ProposicaoResultado {
  id: number;
  casa: string | null;
  sigla: string | null;
  numero: string | null;
  ano: number | null;
  titulo: string;
  ementa: string;
  situacao: string | null;
  dataApresentacao: string | null;
  temas: string[];
}

export interface ResultadoBuscaProposicoes {
  data: ProposicaoResultado[];
  /**
   * `null` quando a busca pediu para pular a contagem (`contarTotal=false`):
   * o `COUNT(*)` com os mesmos filtros é uma segunda varredura da tabela.
   */
  total: number | null;
  pagina: number;
  /** `null` junto com `total` — sem contagem não há última página conhecida. */
  totalPaginas: number | null;
  /** Sempre disponível: é o que permite avançar sem saber o total. */
  temProximaPagina: boolean;
  itensPorPagina: number;
  /** Mensagem para o usuário quando algo impediu a busca. */
  aviso?: string;
}

export interface OpcoesFiltroProposicoes {
  tipos: { sigla: string; nome: string | null; casa: string | null }[];
  anos: { ano: number; total: number }[];
  situacoes: { situacao: string; total: number }[];
  /** `casa` é o valor aceito pelo filtro; `rotulo` é o nome exibido. */
  casas: { casa: string; rotulo: string; total: number }[];
  temas: { tema: string; total: number }[];
  /** `false` quando não foi possível carregar os domínios de filtro. */
  disponivel: boolean;
}

/* ------------------------------------------------------------------ *
 * Tramitação de proposições
 * ------------------------------------------------------------------ */

/** Referência curta a outra proposição (jornada bicameral, apensados). */
export interface ProposicaoRef {
  id: number;
  casa: string | null;
  sigla: string | null;
  numero: string | null;
  ano: number | null;
  titulo: string;
}

export interface OrgaoTramitacao {
  id: number | null;
  sigla: string | null;
  nome: string | null;
  tipoOrgao: string | null;
  casa: string | null;
}

/** Um passo do caminho da proposição (tabela `tramitacao`). */
export interface EtapaTramitacao {
  id: string;
  sequencia: number | null;
  data: string | null;
  orgao: OrgaoTramitacao | null;
  descricao: string | null;
  situacao: string | null;
  despacho: string | null;
  regime: string | null;
}

/** Agregado derivado das etapas: por onde a proposição passou e quando. */
export interface PassagemPorOrgao {
  chave: string;
  orgao: OrgaoTramitacao;
  etapas: number;
  primeiraData: string | null;
  ultimaData: string | null;
}

export interface PlacarVotacao {
  sim: number;
  nao: number;
  abstencao: number;
  obstrucao: number;
  ausenciaJustificada: number;
  ausente: number;
  naoRegistrado: number;
  total: number;
}

export interface OrientacaoBancada {
  bancada: string;
  orientacao: string;
}

export interface VotacaoProposicao {
  id: number;
  casa: string | null;
  data: string | null;
  resumo: string;
  resultado: string;
  tipo: string;
  /** Onde a votação aconteceu — muda a leitura do placar. */
  orgao: OrgaoTramitacao | null;
  /** `null` quando a votação não registrou votos individuais (simbólica). */
  placar: PlacarVotacao | null;
  orientacoes: OrientacaoBancada[];
}

export interface AutorProposicao {
  id: number | null;
  nome: string;
  siglaPartido: string | null;
  uf: string | null;
  urlFoto: string | null;
}

export interface DocumentoProposicao {
  id: string;
  titulo: string;
  tipo: string | null;
  data: string | null;
  url: string | null;
}

export interface JornadaProposicao {
  mesmaMateria: ProposicaoRef[];
  principal: ProposicaoRef | null;
  anteriores: ProposicaoRef[];
  posteriores: ProposicaoRef[];
}

export interface ProposicaoDetalhe {
  id: number;
  apiId: string | null;
  casa: string | null;
  sigla: string | null;
  numero: string | null;
  ano: number | null;
  titulo: string;
  ementa: string;
  situacao: string | null;
  dataApresentacao: string | null;
  temas: string[];
  autores: AutorProposicao[];
  /**
   * Lista vazia de autores não quer dizer "sem autor": a base só registra
   * autoria parlamentar. Esta observação vem da própria API.
   */
  autoriaObservacao: string | null;
  /** Ordenadas da mais antiga para a mais recente. */
  tramitacao: EtapaTramitacao[];
  /** `false` = a API ainda não publica o histórico (≠ "não tramitou"). */
  tramitacaoDisponivel: boolean;
  orgaosPercorridos: PassagemPorOrgao[];
  votacoes: VotacaoProposicao[];
  documentos: DocumentoProposicao[];
  documentosDisponiveis: boolean;
  jornada: JornadaProposicao;
  urlFonteOficial: string | null;
}

export const UFs = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const;

export type UF = (typeof UFs)[number];
