import api from './api';

// Desempenho da candidatura em um turno. Só vem em `/candidatos/:id`.
export interface ResultadoCandidatura {
  idEleicaoResultado: number;
  turno: number;
  uf: string;
  posicao: number | null;
  votos: number | null;
  // Sobre os votos válidos
  percentualVotos: number | null;
  situacao: string | null;
  // Conquistou a vaga. Quem só passou ao 2º turno fica false
  eleito: boolean;
  segundoTurno: boolean;
}

export interface Candidato {
  idCandidaturaTse: number;
  sqCandidato: string;
  anoEleicao: number;
  descricaoEleicao: string | null;
  nomeUrna: string;
  nomeCivil: string;
  cargo: string | null;
  siglaPartido: string | null;
  uf: string | null;
  numeroCandidato: string | null;
  situacaoCandidatura: string | null;
  resultadoEleicao: string | null;
  idParlamentar: number | null;
  fotoUrl: string | null;
  nomeParlamentar: string | null;
  resultados?: ResultadoCandidatura[];
}

export interface CandidatoListaResponse {
  data: Candidato[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
    temProximaPagina: boolean;
  };
}

export async function getCandidatosLista(
  pagina = 1,
  busca?: string,
  cargo?: string,
  partido?: string,
  uf?: string,
  situacao?: string
): Promise<CandidatoListaResponse> {
  const params = new URLSearchParams();

  params.set('pagina', String(pagina));
  params.set('limite', '20');

  if (busca) params.set('nome', busca);
  if (cargo) params.set('cargo', cargo);
  if (partido) params.set('partido', partido);
  if (uf) params.set('uf', uf);
  if (situacao) params.set('situacao', situacao);

  const res = await api.get<CandidatoListaResponse>(
    `/candidatos?${params.toString()}`
  );

  return res.data;
}

export async function getCandidato(
  idCandidaturaTse: number
): Promise<Candidato> {
  const res = await api.get<Candidato>(
    `/candidatos/${idCandidaturaTse}`
  );

  return res.data;
}

// Candidatura (mais recente) vinculada a um parlamentar em exercício
export async function getCandidaturaDoParlamentar(
  idParlamentar: number
): Promise<Candidato | null> {
  try {
    const res = await api.get<CandidatoListaResponse>(
      `/candidatos?parlamentar=${idParlamentar}&limite=10`
    );

    const [maisRecente] = [...res.data.data].sort(
      (a, b) => b.anoEleicao - a.anoEleicao
    );

    if (!maisRecente) return null;

    // A listagem não traz a votação; o detalhe traz.
    try {
      return await getCandidato(maisRecente.idCandidaturaTse);
    } catch {
      return maisRecente;
    }
  } catch {
    return null;
  }
}
