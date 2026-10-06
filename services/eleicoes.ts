import api from './api';

export const ANO_ELEICAO = 2026;

// Presidente é o único cargo com total nacional ('BR') e exterior ('ZZ').
export const UF_NACIONAL = 'BR';
export const UF_EXTERIOR = 'ZZ';

export interface ResultadoEleicao {
  idEleicaoResultado: number;
  anoEleicao: number;
  turno: number;
  cargo: string;
  uf: string;
  vagas: number | null;
  // Só para cargos proporcionais
  quocienteEleitoral: number | null;
  eleitorado: number | null;
  comparecimento: number | null;
  abstencoes: number | null;
  percentualComparecimento: number | null;
  percentualAbstencao: number | null;
  // Senador com duas vagas: cada eleitor dá dois votos, então é o dobro do comparecimento
  votosTotais: number | null;
  votosValidos: number | null;
  votosNominais: number | null;
  votosLegenda: number | null;
  votosBrancos: number | null;
  votosNulos: number | null;
  votosAnuladosSubJudice: number | null;
  percentualValidos: number | null;
  percentualBrancos: number | null;
  percentualNulos: number | null;
  secoes: number | null;
  secoesTotalizadas: number | null;
  percentualSecoesTotalizadas: number | null;
  // false enquanto a apuração está em andamento
  totalizacaoFinal: boolean;
  haSegundoTurno: boolean;
  dataTotalizacao: string | null;
  dataGeracao: string | null;
}

export interface PartidoResultado {
  siglaPartido: string;
  numeroPartido: string | null;
  nomePartido: string | null;
  federacao: string | null;
  coligacao?: string | null;
  cadeiras: number;
  votosNominais?: number | null;
  votosLegenda?: number | null;
  // Nominais + legenda
  votos: number | null;
  // Sobre os votos válidos
  percentualVotos?: number | null;
}

export interface ResultadoEleicaoDetalhe extends ResultadoEleicao {
  partidos: PartidoResultado[];
}

export interface CandidatoResultado {
  idCandidaturaTse: number | null;
  sqCandidato: string;
  numeroCandidato: string | null;
  nomeUrna: string | null;
  nomeCivil: string | null;
  siglaPartido: string | null;
  coligacao: string | null;
  // Só para cargos com vice (presidente, governador)
  nomeVice: string | null;
  posicao: number | null;
  votos: number | null;
  // Sobre os votos válidos
  percentualVotos: number | null;
  situacao: string | null;
  // Conquistou a vaga. Quem só passou ao 2º turno fica false
  eleito: boolean;
  segundoTurno: boolean;
  situacaoVotos: string | null;
  idParlamentar: number | null;
  fotoUrl: string | null;
}

export interface MetaPaginacao {
  total: number;
  page: number;
  lastPage: number;
  limit: number;
  temProximaPagina: boolean;
}

export interface Bancada {
  // null quando nenhum resultado foi carregado ainda
  anoEleicao: number | null;
  cargo: string;
  uf: string | null;
  totalCadeiras: number;
  // Votos só do 1º turno; cadeiras somam todos os turnos
  data: PartidoResultado[];
}

export async function getResultadosEleicao(filtros: {
  cargo: string;
  uf?: string;
  turno?: number;
  ano?: number;
}): Promise<ResultadoEleicao[]> {
  const params = new URLSearchParams();

  params.set('ano', String(filtros.ano ?? ANO_ELEICAO));
  params.set('cargo', filtros.cargo);
  // 27 UFs × 2 turnos cabem numa página
  params.set('limite', '100');

  if (filtros.uf) params.set('uf', filtros.uf);
  if (filtros.turno) params.set('turno', String(filtros.turno));

  const res = await api.get<{ data: ResultadoEleicao[] }>(
    `/eleicoes/resultados?${params.toString()}`
  );

  return res.data.data;
}

export async function getResultadoEleicao(
  idEleicaoResultado: number
): Promise<ResultadoEleicaoDetalhe> {
  const res = await api.get<ResultadoEleicaoDetalhe>(
    `/eleicoes/resultados/${idEleicaoResultado}`
  );

  return res.data;
}

export async function getCandidatosResultado(
  idEleicaoResultado: number,
  filtros: {
    pagina?: number;
    limite?: number;
    nome?: string;
    eleito?: boolean;
  } = {}
): Promise<{ data: CandidatoResultado[]; meta: MetaPaginacao }> {
  const params = new URLSearchParams();

  params.set('pagina', String(filtros.pagina ?? 1));
  params.set('limite', String(filtros.limite ?? 10));

  if (filtros.nome) params.set('nome', filtros.nome);
  if (filtros.eleito !== undefined) params.set('eleito', String(filtros.eleito));

  const res = await api.get<{ data: CandidatoResultado[]; meta: MetaPaginacao }>(
    `/eleicoes/resultados/${idEleicaoResultado}/candidatos?${params.toString()}`
  );

  return res.data;
}

export async function getBancada(filtros: {
  cargo: string;
  uf?: string;
  ano?: number;
}): Promise<Bancada> {
  const params = new URLSearchParams();

  params.set('cargo', filtros.cargo);
  params.set('ano', String(filtros.ano ?? ANO_ELEICAO));

  if (filtros.uf) params.set('uf', filtros.uf);

  const res = await api.get<Bancada>(`/eleicoes/bancadas?${params.toString()}`);

  return res.data;
}
