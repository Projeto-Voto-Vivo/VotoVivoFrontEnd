import api from './api';

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
  uf?: string
): Promise<CandidatoListaResponse> {
  const params = new URLSearchParams();

  params.set('pagina', String(pagina));
  params.set('limite', '20');

  if (busca) params.set('nome', busca);
  if (cargo) params.set('cargo', cargo);
  if (partido) params.set('partido', partido);
  if (uf) params.set('uf', uf);

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