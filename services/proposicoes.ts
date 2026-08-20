import { cache } from 'react';
import api from './api';
import { formatCasa } from './parlamentares';
import {
  AutorProposicao,
  DocumentoProposicao,
  EtapaTramitacao,
  JornadaProposicao,
  OrgaoTramitacao,
  OrientacaoBancada,
  PassagemPorOrgao,
  PlacarVotacao,
  ProposicaoDetalhe,
  ProposicaoRef,
  VotacaoProposicao,
} from '@/types';

/**
 * Cada votação exige uma requisição extra para montar o placar
 * (`GET /votacoes/:id` devolve a lista completa de votos). Uma proposição
 * muito votada renderia dezenas de chamadas, então o detalhamento é limitado
 * e as votações não detalhadas são marcadas como tal na interface.
 */
const MAX_VOTACOES_DETALHADAS = 8;

type BackendProposicaoRef = {
  id?: number | null;
  casa?: string | null;
  sigla?: string | null;
  numero?: string | number | null;
  ano?: number | null;
};

type BackendOrgao = {
  id?: number | null;
  idOrgao?: number | null;
  sigla?: string | null;
  siglaOrgao?: string | null;
  nome?: string | null;
  nomeOrgao?: string | null;
  tipoOrgao?: string | null;
  casa?: string | null;
};

type BackendTramitacao = {
  id?: number | null;
  idTramitacao?: number | null;
  sequencia?: number | null;
  data?: string | null;
  dataHora?: string | null;
  descricao?: string | null;
  descricaoTramitacao?: string | null;
  situacao?: string | null;
  descricaoSituacao?: string | null;
  despacho?: string | null;
  regime?: string | null;
  tipoTramitacao?: { descricao?: string | null; regime?: string | null } | null;
  orgao?: BackendOrgao | null;
};

type BackendVotacaoDaProposicao = {
  id?: number | null;
  casa?: string | null;
  data?: string | null;
  resumo?: string | null;
  resultado?: string | null;
  tipo?: string | null;
};

type BackendVotacaoDetalhe = {
  id?: number | null;
  orientacoes?: { bancada?: string | null; orientacao?: string | null }[] | null;
  votos?: { parlamentar?: string | null; voto?: string | null }[] | null;
  /** Formato preferível (agregação em SQL) caso o backend passe a devolver. */
  placar?: Record<string, string | number | null> | null;
};

type BackendAutor = {
  id?: number | null;
  idParlamentar?: number | null;
  nome?: string | null;
  nomeParlamentar?: string | null;
  siglaPartido?: string | null;
  uf?: string | null;
  urlFoto?: string | null;
};

type BackendDocumento = {
  id?: number | string | null;
  titulo?: string | null;
  descricao?: string | null;
  tipo?: string | null;
  especie?: string | null;
  data?: string | null;
  url?: string | null;
  urlDocumento?: string | null;
  urlInteiroTeor?: string | null;
};

type BackendProposicaoDetalhe = {
  id?: number | null;
  apiId?: string | null;
  idApi?: string | null;
  casa?: string | null;
  sigla?: string | null;
  numero?: string | number | null;
  ano?: number | null;
  ementa?: string | null;
  situacao?: string | null;
  dataApresentacao?: string | null;
  temas?: (string | { descricao?: string | null; nome?: string | null })[] | null;
  autores?: BackendAutor[] | null;
  /** O backend pode embutir a tramitação no detalhe ou expor um endpoint próprio. */
  tramitacao?: BackendTramitacao[] | null;
  tramitacoes?: BackendTramitacao[] | null;
  documentos?: BackendDocumento[] | null;
  votacoes?: BackendVotacaoDaProposicao[] | null;
  jornada?: {
    mesmaMateria?: BackendProposicaoRef[] | null;
    principal?: BackendProposicaoRef | null;
    anteriores?: BackendProposicaoRef[] | null;
    posteriores?: BackendProposicaoRef[] | null;
  } | null;
};

function unwrapArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];

  const data = (payload as { data?: unknown } | null | undefined)?.data;
  return Array.isArray(data) ? (data as T[]) : [];
}

function textoOuNulo(valor?: string | null) {
  const limpo = valor?.trim();
  return limpo ? limpo : null;
}

function montarTitulo(
  sigla?: string | null,
  numero?: string | number | null,
  ano?: number | null,
) {
  const siglaLimpa = textoOuNulo(sigla ?? null) ?? 'Proposição';
  const numeroLimpo = numero === null || numero === undefined || numero === ''
    ? 'S/N'
    : String(numero);
  const anoLimpo = ano ? String(ano) : 's/ano';

  return `${siglaLimpa} ${numeroLimpo}/${anoLimpo}`;
}

function mapRef(item: BackendProposicaoRef): ProposicaoRef {
  return {
    id: Number(item.id ?? 0),
    casa: formatCasa(item.casa),
    sigla: textoOuNulo(item.sigla ?? null),
    numero: item.numero === null || item.numero === undefined ? null : String(item.numero),
    ano: item.ano ?? null,
    titulo: montarTitulo(item.sigla, item.numero, item.ano),
  };
}

function mapOrgao(item?: BackendOrgao | null): OrgaoTramitacao | null {
  if (!item) return null;

  const sigla = textoOuNulo(item.sigla ?? item.siglaOrgao ?? null);
  const nome = textoOuNulo(item.nome ?? item.nomeOrgao ?? null);

  if (!sigla && !nome) return null;

  return {
    id: item.id ?? item.idOrgao ?? null,
    sigla,
    nome,
    tipoOrgao: textoOuNulo(item.tipoOrgao ?? null),
    casa: formatCasa(item.casa),
  };
}

function mapEtapa(item: BackendTramitacao, index: number): EtapaTramitacao {
  return {
    id: String(item.id ?? item.idTramitacao ?? `etapa-${index}`),
    sequencia: item.sequencia ?? null,
    data: item.dataHora ?? item.data ?? null,
    orgao: mapOrgao(item.orgao),
    descricao: textoOuNulo(item.descricaoTramitacao ?? item.descricao ?? null),
    situacao: textoOuNulo(item.descricaoSituacao ?? item.situacao ?? null),
    despacho: textoOuNulo(item.despacho ?? null),
    regime: textoOuNulo(item.regime ?? item.tipoTramitacao?.regime ?? null),
  };
}

/** Do mais antigo para o mais recente: é assim que se lê um caminho. */
function ordenarEtapas(etapas: EtapaTramitacao[]) {
  return [...etapas].sort((a, b) => {
    const dataA = a.data ? new Date(a.data).getTime() : Number.NaN;
    const dataB = b.data ? new Date(b.data).getTime() : Number.NaN;

    if (Number.isFinite(dataA) && Number.isFinite(dataB) && dataA !== dataB) {
      return dataA - dataB;
    }

    return (a.sequencia ?? 0) - (b.sequencia ?? 0);
  });
}

/**
 * Colapsa as etapas consecutivas do mesmo órgão. O que interessa ao cidadão
 * não é "23 despachos", é "passou pela CCJ entre março e julho".
 */
function resumirOrgaos(etapas: EtapaTramitacao[]): PassagemPorOrgao[] {
  const passagens: PassagemPorOrgao[] = [];

  etapas.forEach((etapa) => {
    if (!etapa.orgao) return;

    const chave = etapa.orgao.sigla ?? etapa.orgao.nome ?? 'orgao';
    const ultima = passagens[passagens.length - 1];

    if (ultima && ultima.chave === chave) {
      ultima.etapas += 1;
      if (etapa.data) ultima.ultimaData = etapa.data;
      if (etapa.data && !ultima.primeiraData) ultima.primeiraData = etapa.data;
      return;
    }

    passagens.push({
      chave,
      orgao: etapa.orgao,
      etapas: 1,
      primeiraData: etapa.data,
      ultimaData: etapa.data,
    });
  });

  return passagens;
}

const CHAVES_PLACAR: Record<string, keyof PlacarVotacao> = {
  SIM: 'sim',
  NAO: 'nao',
  ABSTENCAO: 'abstencao',
  OBSTRUCAO: 'obstrucao',
  'AUSENCIA JUSTIFICADA': 'ausenciaJustificada',
  AUSENTE: 'ausente',
  'NAO REGISTRADO': 'naoRegistrado',
};

function normalizarVoto(valor?: string | null) {
  return (valor ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

function placarVazio(): PlacarVotacao {
  return {
    sim: 0,
    nao: 0,
    abstencao: 0,
    obstrucao: 0,
    ausenciaJustificada: 0,
    ausente: 0,
    naoRegistrado: 0,
    total: 0,
  };
}

function montarPlacar(detalhe: BackendVotacaoDetalhe): PlacarVotacao | null {
  // Caminho preferido: o backend já agrega em SQL.
  if (detalhe.placar) {
    const placar = placarVazio();
    let encontrou = false;

    Object.entries(detalhe.placar).forEach(([chave, valor]) => {
      const destino = CHAVES_PLACAR[normalizarVoto(chave)];
      if (!destino || destino === 'total') return;

      const numero = Number(valor ?? 0);
      if (!Number.isFinite(numero)) return;

      placar[destino] = numero;
      placar.total += numero;
      encontrou = true;
    });

    if (encontrou) return placar;
  }

  const votos = detalhe.votos ?? [];
  if (votos.length === 0) return null;

  const placar = placarVazio();

  votos.forEach((voto) => {
    const destino = CHAVES_PLACAR[normalizarVoto(voto.voto)];
    if (!destino || destino === 'total') return;

    placar[destino] += 1;
    placar.total += 1;
  });

  return placar.total > 0 ? placar : null;
}

function mapOrientacoes(detalhe: BackendVotacaoDetalhe): OrientacaoBancada[] {
  return (detalhe.orientacoes ?? [])
    .map((item) => ({
      bancada: textoOuNulo(item.bancada ?? null) ?? '',
      orientacao: textoOuNulo(item.orientacao ?? null) ?? '',
    }))
    .filter((item) => item.bancada && item.orientacao);
}

function mapAutor(item: BackendAutor, index: number): AutorProposicao {
  return {
    id: item.id ?? item.idParlamentar ?? null,
    nome:
      textoOuNulo(item.nomeParlamentar ?? item.nome ?? null) ??
      `Autor ${index + 1}`,
    siglaPartido: textoOuNulo(item.siglaPartido ?? null),
    uf: textoOuNulo(item.uf ?? null),
    urlFoto: textoOuNulo(item.urlFoto ?? null),
  };
}

function mapDocumento(item: BackendDocumento, index: number): DocumentoProposicao {
  return {
    id: String(item.id ?? `documento-${index}`),
    titulo:
      textoOuNulo(item.titulo ?? item.descricao ?? null) ??
      `Documento ${index + 1}`,
    tipo: textoOuNulo(item.tipo ?? item.especie ?? null),
    data: item.data ?? null,
    url: textoOuNulo(item.url ?? item.urlDocumento ?? item.urlInteiroTeor ?? null),
  };
}

function mapTemas(temas: BackendProposicaoDetalhe['temas']): string[] {
  if (!Array.isArray(temas)) return [];

  return temas
    .map((tema) =>
      typeof tema === 'string' ? tema : tema?.descricao ?? tema?.nome ?? '',
    )
    .map((tema) => tema.trim())
    .filter(Boolean);
}

/**
 * Link para a ficha oficial. Depende de a API devolver o `idApi` da fonte —
 * hoje ela não devolve, então o link simplesmente não aparece.
 */
function montarUrlOficial(casa: string | null, apiId: string | null) {
  if (!apiId) return null;

  if (casa === 'Câmara dos Deputados') {
    return `https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=${encodeURIComponent(apiId)}`;
  }

  if (casa === 'Senado Federal') {
    return `https://www25.senado.leg.br/web/atividade/materias/-/materia/${encodeURIComponent(apiId)}`;
  }

  return null;
}

/**
 * Histórico de tramitação. A API ainda não publica esta rota; enquanto isso a
 * página mostra o estado "sem dados" em vez de fingir que não houve tramitação.
 */
async function getTramitacao(id: number): Promise<{
  etapas: EtapaTramitacao[];
  disponivel: boolean;
}> {
  try {
    const res = await api.get(`/proposicoes/${id}/tramitacoes`);
    const itens = unwrapArray<BackendTramitacao>(res.data);

    return { etapas: itens.map(mapEtapa), disponivel: true };
  } catch {
    return { etapas: [], disponivel: false };
  }
}

async function getDocumentos(id: number): Promise<{
  documentos: DocumentoProposicao[];
  disponivel: boolean;
}> {
  try {
    const res = await api.get(`/proposicoes/${id}/documentos`);
    const itens = unwrapArray<BackendDocumento>(res.data);

    return { documentos: itens.map(mapDocumento), disponivel: true };
  } catch {
    return { documentos: [], disponivel: false };
  }
}

async function detalharVotacao(
  votacao: BackendVotacaoDaProposicao,
  detalhar: boolean,
): Promise<VotacaoProposicao> {
  const base: VotacaoProposicao = {
    id: Number(votacao.id ?? 0),
    casa: formatCasa(votacao.casa),
    data: votacao.data ?? null,
    resumo: textoOuNulo(votacao.resumo ?? null) ?? 'Resumo não informado.',
    resultado: textoOuNulo(votacao.resultado ?? null) ?? 'Resultado não informado',
    tipo: textoOuNulo(votacao.tipo ?? null) ?? 'Votação',
    placar: null,
    orientacoes: [],
    detalheCarregado: false,
  };

  if (!detalhar || !base.id) return base;

  try {
    const res = await api.get(`/votacoes/${base.id}`);
    const detalhe = (res.data ?? {}) as BackendVotacaoDetalhe;

    return {
      ...base,
      placar: montarPlacar(detalhe),
      orientacoes: mapOrientacoes(detalhe),
      detalheCarregado: true,
    };
  } catch {
    return base;
  }
}

/**
 * Memoizado por requisição: `generateMetadata` e a página chamam a mesma
 * função, e cada chamada dispara várias requisições ao backend.
 */
export const getProposicaoDetalhe = cache(async function getProposicaoDetalhe(
  id: number,
): Promise<ProposicaoDetalhe | null> {
  let payload: BackendProposicaoDetalhe;

  try {
    const res = await api.get(`/proposicoes/${id}`);

    // O backend antigo respondia 200 com `null` para id inexistente.
    if (!res.data || typeof res.data !== 'object') return null;

    payload = res.data as BackendProposicaoDetalhe;
  } catch {
    return null;
  }

  const casa = formatCasa(payload.casa);
  const apiId = textoOuNulo(payload.apiId ?? payload.idApi ?? null);

  const tramitacaoEmbutida = payload.tramitacao ?? payload.tramitacoes ?? null;
  const votacoesBrutas = Array.isArray(payload.votacoes) ? payload.votacoes : [];

  const [tramitacaoRemota, documentosRemotos, votacoes] = await Promise.all([
    tramitacaoEmbutida ? null : getTramitacao(id),
    Array.isArray(payload.documentos) ? null : getDocumentos(id),
    Promise.all(
      votacoesBrutas.map((votacao, index) =>
        detalharVotacao(votacao, index < MAX_VOTACOES_DETALHADAS),
      ),
    ),
  ]);

  const etapas = ordenarEtapas(
    tramitacaoEmbutida
      ? tramitacaoEmbutida.map(mapEtapa)
      : tramitacaoRemota?.etapas ?? [],
  );

  const tramitacaoDisponivel = tramitacaoEmbutida
    ? true
    : tramitacaoRemota?.disponivel ?? false;

  const documentos = Array.isArray(payload.documentos)
    ? payload.documentos.map(mapDocumento)
    : documentosRemotos?.documentos ?? [];

  const documentosDisponiveis = Array.isArray(payload.documentos)
    ? true
    : documentosRemotos?.disponivel ?? false;

  const jornadaBruta = payload.jornada ?? {};
  const jornada: JornadaProposicao = {
    mesmaMateria: (jornadaBruta.mesmaMateria ?? []).map(mapRef),
    principal: jornadaBruta.principal ? mapRef(jornadaBruta.principal) : null,
    anteriores: (jornadaBruta.anteriores ?? []).map(mapRef),
    posteriores: (jornadaBruta.posteriores ?? []).map(mapRef),
  };

  return {
    id: Number(payload.id ?? id),
    apiId,
    casa,
    sigla: textoOuNulo(payload.sigla ?? null),
    numero:
      payload.numero === null || payload.numero === undefined
        ? null
        : String(payload.numero),
    ano: payload.ano ?? null,
    titulo: montarTitulo(payload.sigla, payload.numero, payload.ano),
    ementa: textoOuNulo(payload.ementa ?? null) ?? 'Ementa não informada.',
    situacao: textoOuNulo(payload.situacao ?? null),
    dataApresentacao: payload.dataApresentacao ?? null,
    temas: mapTemas(payload.temas),
    autores: (payload.autores ?? []).map(mapAutor),
    tramitacao: etapas,
    tramitacaoDisponivel,
    orgaosPercorridos: resumirOrgaos(etapas),
    votacoes,
    documentos,
    documentosDisponiveis,
    jornada,
    urlFonteOficial: montarUrlOficial(casa, apiId),
  };
});
