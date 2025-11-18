import api from './api';
import { Deputado, Despesa, Proposicao, Partido, UFs } from '@/types'; 

export async function getDeputadoById(id: number) {
  try {
    const res = await api.get(`/deputados/${id}`);
    return res.data.dados; 
  } catch (error) {
    console.error("Erro ao buscar deputado", error);
    return null;
  }
}

export async function getDeputadosLista(itens: number = 8): Promise<Deputado[]> {
    try {
        const res = await api.get(`/deputados?ordem=ASC&ordenarPor=nome&itens=${itens}`);
        return res.data.dados as Deputado[]; 
    } catch (error) {
        console.error("Erro ao buscar lista de deputados", error);
        return [];
    }
}

export async function getDespesasDeputado(id: number) {
  try {
    const res = await api.get(`/deputados/${id}/despesas?ordem=DESC&ordenarPor=dataDocumento&itens=15`);
    return res.data.dados as Despesa[]; 
  } catch (error) {
    return [];
  }
}
export async function getProposicoesDeputado(id: number) {
  try {
    const res = await api.get(`/proposicoes?idDeputadoAutor=${id}&ordem=DESC&ordenarPor=id&itens=5`);
    return res.data.dados as Proposicao[];
  } catch (error) {
    return [];
  }
}

export async function getVotacoesDeputado(id: number) {
  try {
    const res = await api.get(`/votacoes?dataInicio=2024-01-01&dataFim=2024-12-31&idDeputado=${id}&itens=5`);
    return res.data.dados; 
  } catch (error) {
    return [];
  }
}

export async function getPartidos(): Promise<Partido[]> {
    try {
        const res = await api.get(`/partidos?ordem=ASC&ordenarPor=sigla`);
        return res.data.dados as Partido[];
    } catch (error) {
        console.error("Erro ao buscar partidos", error);
        return [];
    }
}

export { UFs };