import api from './api';
import { formatCasa, formatVotingType } from './parlamentares';
import {
  AutorProposicao,
  DocumentoProposicao,
  EtapaTramitacao,
  FiltrosProposicao,
  JornadaProposicao,
  OpcoesFiltroProposicoes,
  OrgaoTramitacao,
  OrientacaoBancada,
  PassagemPorOrgao,
  PlacarVotacao,
  ProposicaoDetalhe,
  ProposicaoRef,
  ProposicaoResultado,
  ResultadoBuscaProposicoes,
  VotacaoProposicao,
} from '@/types';

const PROPOSICOES_POR_PAGINA = 20;

/**
 * A API já devolve o placar agregado junto da proposição. A orientação das
 * bancadas ainda mora em `GET /votacoes/:id`, então buscamos esse complemento
 * só para as primeiras votações — o placar, que é o essencial, vem para todas.
 */
const MAX_ORIENTACOES_DETALHADAS = 8;

/** Etapas por página em `GET /proposicoes/:id/tramitacoes`. */
const TRAMITACOES_POR_PAGINA = 100;

/** Teto de páginas de tramitação — protege contra processos gigantes. */
const MAX_PAGINAS_TRAMITACAO = 10;

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
  orgao?: BackendOrgao | null;
  /** Placar agregado no banco: evita baixar até 513 votos por votação. */
  placar?: Record<string, string | number | null> | null;
  totalVotos?: number | null;
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
  autoria?: { somenteParlamentares?: boolean; observacao?: string | null } | null;
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

/**
 * Do mais antigo para o mais recente: é assim que se lê um caminho.
 *
 * `sequencia` é a ordem oficial do processo e vem primeiro. A data só entra
 * como desempate: várias etapas acontecem no mesmo dia — despacho, recebimento
 * e distribuição costumam sair juntos —, e ordenar por data antes da sequência
 * embaralharia a ordem real dentro de cada dia.
 */
function ordenarEtapas(etapas: EtapaTramitacao[]) {
  return [...etapas].sort((a, b) => {
    if (
      a.sequencia !== null &&
      b.sequencia !== null &&
      a.sequencia !== b.sequencia
    ) {
      return a.sequencia - b.sequencia;
    }

    const dataA = a.data ? new Date(a.data).getTime() : Number.NaN;
    const dataB = b.data ? new Date(b.data).getTime() : Number.NaN;

    if (Number.isFinite(dataA) && Number.isFinite(dataB)) return dataA - dataB;

    // Etapa sem data vai para o fim, e não para o começo do caminho.
    if (Number.isFinite(dataA)) return -1;
    if (Number.isFinite(dataB)) return 1;

    return 0;
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

    // Placar zerado nas sete chaves = votação sem voto individual (simbólica).
    // Devolver o objeto zerado renderizaria uma barra vazia e "0 votos", como
    // se ninguém tivesse votado numa votação que de fato aconteceu.
    if (encontrou) return placar.total > 0 ? placar : null;
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
 * Histórico de tramitação, paginado na origem. Um processo antigo passa de
 * cem etapas, e mostrar meio caminho seria pior do que não mostrar nenhum —
 * então seguimos as páginas até o teto e declaramos se algo ficou de fora.
 */
async function getTramitacao(id: number): Promise<{
  etapas: EtapaTramitacao[];
  disponivel: boolean;
}> {
  const buscarPagina = async (pagina: number) => {
    const params = new URLSearchParams({
      pagina: String(pagina),
      limite: String(TRAMITACOES_POR_PAGINA),
      limit: String(TRAMITACOES_POR_PAGINA),
    });

    const res = await api.get(`/proposicoes/${id}/tramitacoes?${params.toString()}`);
    const itens = unwrapArray<BackendTramitacao>(res.data);
    const meta = (res.data as { meta?: { lastPage?: number; totalPaginas?: number } })
      ?.meta;

    return {
      itens,
      ultimaPagina: Number(meta?.lastPage ?? meta?.totalPaginas ?? 1) || 1,
    };
  };

  try {
    const primeira = await buscarPagina(1);
    const etapas = [...primeira.itens];
    const ultima = Math.min(primeira.ultimaPagina, MAX_PAGINAS_TRAMITACAO);

    for (let pagina = 2; pagina <= ultima; pagina += 1) {
      const proxima = await buscarPagina(pagina);
      etapas.push(...proxima.itens);
    }

    return { etapas: etapas.map(mapEtapa), disponivel: true };
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

/**
 * O placar já vem agregado com a proposição. A ida a `/votacoes/:id` serve
 * apenas para a orientação das bancadas — e só nas primeiras votações, para
 * a página não abrir uma requisição por votação.
 */
async function detalharVotacao(
  votacao: BackendVotacaoDaProposicao,
  buscarOrientacoes: boolean,
): Promise<VotacaoProposicao> {
  const base: VotacaoProposicao = {
    id: Number(votacao.id ?? 0),
    casa: formatCasa(votacao.casa),
    data: votacao.data ?? null,
    resumo: textoOuNulo(votacao.resumo ?? null) ?? 'Resumo não informado.',
    resultado: textoOuNulo(votacao.resultado ?? null) ?? 'Resultado não informado',
    // NOMINAL/SIMBOLICA/SECRETA são valores de banco; o cidadão lê o rótulo.
    tipo: formatVotingType(votacao.tipo),
    orgao: mapOrgao(votacao.orgao),
    placar: montarPlacar({ placar: votacao.placar ?? null }),
    orientacoes: [],
  };

  if (!buscarOrientacoes || !base.id) return base;

  try {
    const res = await api.get(`/votacoes/${base.id}`);
    const detalhe = (res.data ?? {}) as BackendVotacaoDetalhe;

    return {
      ...base,
      // Se a proposição não trouxe placar, o detalhe da votação ainda resolve.
      placar: base.placar ?? montarPlacar(detalhe),
      orientacoes: mapOrientacoes(detalhe),
    };
  } catch {
    return base;
  }
}

/* ------------------------------------------------------------------ *
 * Busca de proposições
 * ------------------------------------------------------------------ */

type BackendProposicaoResultado = {
  id?: number | null;
  casa?: string | null;
  sigla?: string | null;
  numero?: string | number | null;
  ano?: number | null;
  ementa?: string | null;
  situacao?: string | null;
  dataApresentacao?: string | null;
  temas?: (string | { descricao?: string | null; nome?: string | null })[] | null;
};

type BackendOpcoesFiltro = {
  tipos?: { sigla?: string | null; nome?: string | null; casa?: string | null }[] | null;
  anos?: { ano?: number | null; total?: number | null }[] | null;
  situacoes?: { situacao?: string | null; total?: number | null }[] | null;
  casas?: { casa?: string | null; total?: number | null }[] | null;
  temas?: { tema?: string | null; total?: number | null }[] | null;
};

function mapResultado(item: BackendProposicaoResultado): ProposicaoResultado {
  return {
    id: Number(item.id ?? 0),
    casa: formatCasa(item.casa),
    sigla: textoOuNulo(item.sigla ?? null),
    numero:
      item.numero === null || item.numero === undefined ? null : String(item.numero),
    ano: item.ano ?? null,
    titulo: montarTitulo(item.sigla, item.numero, item.ano),
    ementa: textoOuNulo(item.ementa ?? null) ?? 'Ementa não informada.',
    situacao: textoOuNulo(item.situacao ?? null),
    dataApresentacao: item.dataApresentacao ?? null,
    temas: mapTemas(item.temas),
  };
}

export type OpcoesBusca = {
  /**
   * `false` pula o `COUNT(*)` no servidor — uma segunda varredura da tabela com
   * os mesmos filtros, que numa busca textual chega a dobrar o custo. Em troca,
   * `total` e `totalPaginas` voltam `null` e a navegação passa a depender só de
   * `temProximaPagina`. Vale onde o número de resultados não é a informação
   * principal.
   */
  contarTotal?: boolean;
};

function montarQueryBusca(
  filtros: FiltrosProposicao,
  pagina: number,
  opcoes: OpcoesBusca,
) {
  const params = new URLSearchParams();

  params.set('pagina', String(pagina));
  params.set('limite', String(PROPOSICOES_POR_PAGINA));
  if (opcoes.contarTotal === false) params.set('contarTotal', 'false');

  if (filtros.busca) params.set('busca', filtros.busca);
  if (filtros.tipo) params.set('tipo', filtros.tipo);
  if (filtros.ano) params.set('ano', String(filtros.ano));
  if (filtros.casa) params.set('casa', filtros.casa);
  if (filtros.situacao) params.set('situacao', filtros.situacao);
  if (filtros.tema) params.set('tema', filtros.tema);
  if (filtros.autor) params.set('autor', String(filtros.autor));

  return params.toString();
}

/**
 * Busca no servidor. A alternativa — baixar as proposições e filtrar no
 * navegador — só enxerga a página corrente, então o termo procurado quase
 * sempre está numa página que o navegador não tem.
 */
export async function buscarProposicoes(
  filtros: FiltrosProposicao = {},
  pagina: number = 1,
  opcoes: OpcoesBusca = {},
): Promise<ResultadoBuscaProposicoes> {
  try {
    const res = await api.get(
      `/proposicoes?${montarQueryBusca(filtros, pagina, opcoes)}`,
    );
    const payload = res.data as {
      data?: BackendProposicaoResultado[];
      meta?: {
        total?: number | null;
        page?: number;
        pagina?: number;
        lastPage?: number | null;
        totalPaginas?: number | null;
        limit?: number;
        limite?: number;
        temProximaPagina?: boolean;
      };
    };

    const itens = Array.isArray(payload?.data) ? payload.data : [];
    const meta = payload?.meta;
    const itensPorPagina =
      Number(meta?.limit ?? meta?.limite ?? PROPOSICOES_POR_PAGINA) ||
      PROPOSICOES_POR_PAGINA;
    const paginaAtual = Number(meta?.page ?? meta?.pagina ?? pagina) || pagina;

    // `null` explícito significa "não contei", e é diferente de "zero". Só o
    // ausente (backend antigo) cai para a contagem local.
    const totalBruto = meta?.total;
    const total =
      totalBruto === null
        ? null
        : Number(totalBruto ?? itens.length) || 0;

    const ultimaPaginaBruta = meta?.lastPage ?? meta?.totalPaginas;
    const totalPaginas =
      total === null
        ? null
        : ultimaPaginaBruta
          ? Number(ultimaPaginaBruta)
          : Math.max(1, Math.ceil(total / itensPorPagina));

    return {
      data: itens.map(mapResultado),
      total,
      pagina: paginaAtual,
      totalPaginas,
      temProximaPagina:
        meta?.temProximaPagina ??
        // Backend antigo, sem o campo: deduz do total quando ele existe.
        (totalPaginas !== null
          ? paginaAtual < totalPaginas
          : itens.length >= itensPorPagina),
      itensPorPagina,
    };
  } catch {
    console.warn('Não foi possível buscar proposições no backend.');

    return {
      data: [],
      total: 0,
      pagina,
      totalPaginas: 1,
      temProximaPagina: false,
      itensPorPagina: PROPOSICOES_POR_PAGINA,
      aviso:
        'Não conseguimos consultar as proposições agora. Tente novamente em alguns instantes.',
    };
  }
}

const OPCOES_VAZIAS: OpcoesFiltroProposicoes = {
  tipos: [],
  anos: [],
  situacoes: [],
  casas: [],
  temas: [],
  disponivel: false,
};

/**
 * Domínios dos filtros. `situacao` é texto livre vindo da Câmara e do Senado,
 * com dezenas de redações — sem esta lista qualquer valor fixo no código
 * geraria filtros que não encontram nada.
 */
export async function carregarOpcoesFiltroProposicoes(): Promise<OpcoesFiltroProposicoes> {
    try {
      const res = await api.get('/proposicoes/filtros');
      const payload = (res.data ?? {}) as BackendOpcoesFiltro;

      return {
        tipos: (payload.tipos ?? [])
          .map((item) => ({
            sigla: textoOuNulo(item.sigla ?? null) ?? '',
            nome: textoOuNulo(item.nome ?? null),
            casa: formatCasa(item.casa),
          }))
          .filter((item) => item.sigla),
        anos: (payload.anos ?? [])
          .map((item) => ({ ano: Number(item.ano ?? 0), total: Number(item.total ?? 0) }))
          .filter((item) => item.ano > 0),
        situacoes: (payload.situacoes ?? [])
          .map((item) => ({
            situacao: textoOuNulo(item.situacao ?? null) ?? '',
            total: Number(item.total ?? 0),
          }))
          .filter((item) => item.situacao),
        // O valor bruto (`Camara`) é o que o filtro aceita; o rótulo é só
        // para leitura — trocar um pelo outro faz a API responder 400.
        casas: (payload.casas ?? [])
          .map((item) => {
            const bruto = textoOuNulo(item.casa ?? null) ?? '';

            return {
              casa: bruto,
              rotulo: formatCasa(bruto) ?? bruto,
              total: Number(item.total ?? 0),
            };
          })
          .filter((item) => item.casa),
        temas: (payload.temas ?? [])
          .map((item) => ({
            tema: textoOuNulo(item.tema ?? null) ?? '',
            total: Number(item.total ?? 0),
          }))
          .filter((item) => item.tema),
        disponivel: true,
      };
    } catch {
      console.warn('Não foi possível carregar as opções de filtro de proposições.');
      return OPCOES_VAZIAS;
    }
}

export async function getProposicaoDetalhe(
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
        detalharVotacao(votacao, index < MAX_ORIENTACOES_DETALHADAS),
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
    autoriaObservacao: textoOuNulo(payload.autoria?.observacao ?? null),
    tramitacao: etapas,
    tramitacaoDisponivel,
    orgaosPercorridos: resumirOrgaos(etapas),
    votacoes,
    documentos,
    documentosDisponiveis,
    jornada,
    urlFonteOficial: montarUrlOficial(casa, apiId),
  };
}
