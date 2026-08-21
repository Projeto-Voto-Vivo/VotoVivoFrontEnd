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

export interface VotacaoPerfil {
  id: string;
  titulo: string;
  data: string;
  descricao: string;
  resumo: string;
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
  /** `null` = sem dados. Nunca 0% para ausência de informação. */
  taxa: number | null;
  totalEventos: number;
  faltas: number;
  metodologia: string | null;
}

export interface PresencaPerfil {
  plenario: PresencaDetalhe;
  comissoes: PresencaDetalhe;
  casa: string | null;
  observacao: string | null;
}

export interface VotacoesPerfil {
  presenca: PresencaPerfil;
  /** Percentual de aderência à orientação do partido. `null` = sem dados. */
  alinhamento: number | null;
  alinhamentoBase: number;
  destaques: VotacaoPerfil[];
  leituraRapida: string;
  totalRegistros: number;
  paginaAtual: number;
  totalPaginas: number;
  itensPorPagina: number;
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
  total: number;
  pagina: number;
  totalPaginas: number;
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
