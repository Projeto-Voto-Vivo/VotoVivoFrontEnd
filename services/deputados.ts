import api from './api';
import { Deputado, DeputadoDetalhe, Despesa, GastoResumo, Partido } from '@/types'; 

export async function getDeputadoById(id: number): Promise<DeputadoDetalhe | null> {
  try {
    const res = await api.get(`/deputados/${id}`);
    return res.data as DeputadoDetalhe; 
  } catch (error) {
    console.error("Erro ao buscar deputado", error);
    return null;
  }
}

export async function getDeputadosLista(
  page: number = 1, 
  nome?: string, 
  uf?: string, 
  partido?: string
): Promise<{ data: Deputado[], meta: any }> {
    try {
        const params = new URLSearchParams();
        params.append('pagina', page.toString());
        if (nome) params.append('nome', nome);
        if (uf) params.append('uf', uf);
        if (partido) params.append('partido', partido);

        const res = await api.get(`/deputados?${params.toString()}`);
        return res.data; 
    } catch (error) {
        console.error("Erro ao buscar lista de deputados", error);
        return { data: [], meta: { total: 0 } };
    }
}

export async function getResumoGastos(id: number): Promise<GastoResumo[]> {
  try {
    const res = await api.get(`/deputados/${id}/gastos/resumo`);
    return res.data as GastoResumo[];
  } catch (error) {
    console.error("Erro ao buscar resumo de gastos", error);
    return [];
  }
}

export async function getDespesasDeputado(id: number, page: number = 1): Promise<Despesa[]> {
  try {
    const res = await api.get(`/deputados/${id}/gastos?pagina=${page}`);
    return res.data as Despesa[]; 
  } catch (error) {
    return [];
  }
}

// Mocks para funcionalidades ainda não implementadas no Backend MVP
export async function getProposicoesMock(id: number) {
  return [];
}

export async function getVotacoesMock(id: number) {
  return { presenca: 95, ausencias: 5 };
}
