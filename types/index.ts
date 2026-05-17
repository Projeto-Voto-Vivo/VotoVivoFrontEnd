export interface Parlamentar {
  id: number;
  nomeParlamentar: string;
  siglaPartido: string;
  uf: string;
  urlFoto: string;
  cargo?: string;
  casaLegislativa?: string;
  legislatura?: string;
  situacaoMandato?: string;
  situacao?: string;
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
  situacao: string;
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
  papel: string;
  situacao: string;
  tema: string;
  impactoCidadao: string;
  data: string;
}

export interface VotacaoPerfil {
  id: string;
  titulo: string;
  data: string;
  tema: string;
  resumo: string;
  voto: string;
  resultado: string;
  orientacaoCasa: string;
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
}

export interface DespesasPerfil {
  totalAno: number;
  mediaMensal: number;
  maiorReembolso: number;
  categorias: CategoriaDespesaPerfil[];
  itensRecentes: ItemDespesaPerfil[];
}

export interface EmendaResumoPerfil {
  codigoEmenda: string;
  ano: number;
  tipoEmenda: string;
  nomeAutor: string;
  numeroEmenda: string;
  localidadeDoGasto: string;
  funcao: string;
  subfuncao: string;
  valorEmpenhado: number;
  valorLiquidado: number;
  valorPago: number;
}

export interface DocumentoEmendaPerfil {
  id: number;
  data: string;
  fase: string;
  codigoDocumento: string;
  codigoDocumentoResumido: string;
  especieTipo: string;
  tipoEmenda: string;
}

export interface EmendasPerfil {
  quantidade: number;
  totalEmpenhado: number;
  totalLiquidado: number;
  totalPago: number;
  totalRestoInscrito: number;
  principalTipo: string;
  principalLocalidade: string;
  destaques: EmendaResumoPerfil[];
  documentosRecentes: DocumentoEmendaPerfil[];
  leituraRapida: string;
}

export interface ParlamentarPerfil {
  parlamentar: ParlamentarDetalhe;
  subtitulo: string;
  resumo: string;
  biografia: string;
  temasPrioritarios: string[];
  comissoes: string[];
  indicadores: PerfilIndicador[];
  proposicoes: ProposicaoPerfil[];
  votacoes: {
    presenca: number;
    alinhamento: number;
    destaques: VotacaoPerfil[];
    leituraRapida: string;
  };
  despesas: DespesasPerfil;
  emendas: EmendasPerfil;
}

export const UFs = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const;

export type UF = (typeof UFs)[number];