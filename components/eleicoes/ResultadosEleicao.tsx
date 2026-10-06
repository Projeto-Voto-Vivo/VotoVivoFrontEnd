'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ChartPie, Info, Landmark, Loader2, MapPinned, Users, Vote } from 'lucide-react';
import {
  ANO_ELEICAO,
  getBancada,
  getResultadoEleicao,
  getResultadosEleicao,
  PartidoResultado,
  ResultadoEleicao,
  UF_EXTERIOR,
  UF_NACIONAL,
} from '@/services/eleicoes';
import { CandidatosResultado } from './CandidatosResultado';
import { GrupoCadeiras, Hemiciclo } from './Hemiciclo';
import {
  formatCompacto,
  formatDataHora,
  formatNumero,
  formatPercentual,
  percentual,
  rotuloTurno,
} from './formatacao';

type CargoChave = 'presidente' | 'governador' | 'senador' | 'federal' | 'estadual';

const cargos: { chave: CargoChave; rotulo: string }[] = [
  { chave: 'presidente', rotulo: 'Presidente' },
  { chave: 'governador', rotulo: 'Governador' },
  { chave: 'senador', rotulo: 'Senador' },
  { chave: 'federal', rotulo: 'Deputado federal' },
  { chave: 'estadual', rotulo: 'Deputado estadual' },
];

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

// Nome do cargo como o TSE grava. O DF elege deputado distrital, não estadual.
function cargoNaApi(cargo: CargoChave, uf: string) {
  switch (cargo) {
    case 'presidente':
      return 'PRESIDENTE';
    case 'governador':
      return 'GOVERNADOR';
    case 'senador':
      return 'SENADOR';
    case 'federal':
      return 'DEPUTADO FEDERAL';
    case 'estadual':
      return uf === 'DF' ? 'DEPUTADO DISTRITAL' : 'DEPUTADO ESTADUAL';
  }
}

const CORES_PARTIDOS = [
  'var(--color-partido-1)',
  'var(--color-partido-2)',
  'var(--color-partido-3)',
  'var(--color-partido-4)',
  'var(--color-partido-5)',
  'var(--color-partido-6)',
  'var(--color-partido-7)',
];
const COR_OUTROS = 'var(--color-partido-outros)';

const COR_PRINCIPAL = 'var(--color-voto-sim)';

type Totais = {
  eleitorado: number | null;
  comparecimento: number | null;
  abstencoes: number | null;
  votosTotais: number | null;
  votosValidos: number | null;
  votosNominais: number | null;
  votosLegenda: number | null;
  votosBrancos: number | null;
  votosNulos: number | null;
  votosAnuladosSubJudice: number | null;
  vagas: number | null;
  secoes: number | null;
  secoesTotalizadas: number | null;
};

const camposTotais: (keyof Totais)[] = [
  'eleitorado',
  'comparecimento',
  'abstencoes',
  'votosTotais',
  'votosValidos',
  'votosNominais',
  'votosLegenda',
  'votosBrancos',
  'votosNulos',
  'votosAnuladosSubJudice',
  'vagas',
  'secoes',
  'secoesTotalizadas',
];

// Soma as disputas; um campo que ninguém preencheu continua `null`, não vira 0.
function somarTotais(resultados: ResultadoEleicao[]): Totais {
  const totais = {} as Totais;

  for (const campo of camposTotais) {
    const valores = resultados
      .map((resultado) => resultado[campo])
      .filter((valor): valor is number => valor !== null);

    totais[campo] = valores.length
      ? valores.reduce((soma, valor) => soma + valor, 0)
      : null;
  }

  return totais;
}

type Dados =
  | { tipo: 'vazio' }
  | { tipo: 'erro' }
  | {
      // Um cargo somado entre as UFs
      tipo: 'agregado';
      partidos: PartidoResultado[];
      totalCadeiras: number;
      // 1º turno de cada UF
      porUf: ResultadoEleicao[];
    }
  | {
      tipo: 'disputa';
      turnos: number[];
      resultado: ResultadoEleicao;
      partidos: PartidoResultado[];
    };

async function carregarAgregado(cargo: CargoChave): Promise<Dados> {
  // Deputado estadual no Brasil inteiro inclui os distritais do DF.
  const nomes =
    cargo === 'estadual'
      ? ['DEPUTADO ESTADUAL', 'DEPUTADO DISTRITAL']
      : [cargoNaApi(cargo, '')];

  const [bancadas, listas] = await Promise.all([
    Promise.all(nomes.map((nome) => getBancada({ cargo: nome }))),
    Promise.all(nomes.map((nome) => getResultadosEleicao({ cargo: nome, turno: 1 }))),
  ]);

  const porUf = listas.flat().sort((a, b) => a.uf.localeCompare(b.uf));

  if (porUf.length === 0) return { tipo: 'vazio' };

  const partidos = new Map<string, PartidoResultado>();

  for (const linha of bancadas.flatMap((bancada) => bancada.data)) {
    const atual = partidos.get(linha.siglaPartido);

    partidos.set(linha.siglaPartido, {
      ...linha,
      cadeiras: (atual?.cadeiras ?? 0) + linha.cadeiras,
      votos: (atual?.votos ?? 0) + (linha.votos ?? 0),
    });
  }

  return {
    tipo: 'agregado',
    partidos: [...partidos.values()],
    totalCadeiras: bancadas.reduce((soma, b) => soma + b.totalCadeiras, 0),
    porUf,
  };
}

async function carregarDisputa(
  cargo: CargoChave,
  uf: string,
  turno: number | null
): Promise<Dados> {
  const lista = await getResultadosEleicao({
    cargo: cargoNaApi(cargo, uf),
    uf: uf || UF_NACIONAL,
  });

  if (lista.length === 0) return { tipo: 'vazio' };

  const turnos = lista.map((item) => item.turno).sort((a, b) => a - b);
  // Sem escolha do usuário, abre no turno que decide: o mais recente.
  const escolhido =
    lista.find((item) => item.turno === turno) ??
    lista.find((item) => item.turno === turnos[turnos.length - 1])!;

  const { partidos, ...resultado } = await getResultadoEleicao(
    escolhido.idEleicaoResultado
  );

  return { tipo: 'disputa', turnos, resultado, partidos };
}

function ordenarPartidos(partidos: PartidoResultado[]) {
  return [...partidos].sort(
    (a, b) =>
      b.cadeiras - a.cadeiras ||
      (b.votos ?? 0) - (a.votos ?? 0) ||
      a.siglaPartido.localeCompare(b.siglaPartido)
  );
}

function Bloco({
  icone,
  titulo,
  descricao,
  children,
}: {
  icone: ReactNode;
  titulo: string;
  descricao?: string;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brasil-blue/10 text-brasil-blue">
          {icone}
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-slate-900">{titulo}</h3>
          {descricao && (
            <p className="mt-0.5 text-sm leading-6 text-slate-500">{descricao}</p>
          )}
        </div>
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function Indicador({
  rotulo,
  valor,
  apoio,
}: {
  rotulo: string;
  valor: string;
  apoio?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {rotulo}
      </p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{valor}</p>
      {apoio && <p className="mt-0.5 text-xs text-slate-500">{apoio}</p>}
    </div>
  );
}

type Parte = { rotulo: string; valor: number | null; cor: string };

/**
 * Parte de um todo em uma barra só. A legenda repete cada valor em número —
 * as fatias pequenas (brancos, nulos) não comportam rótulo dentro da barra.
 */
function BarraDePartes({ titulo, partes }: { titulo: string; partes: Parte[] }) {
  const visiveis = partes.filter(
    (parte): parte is Parte & { valor: number } => (parte.valor ?? 0) > 0
  );
  const todo = visiveis.reduce((soma, parte) => soma + parte.valor, 0);

  if (todo === 0) return null;

  return (
    <div>
      <p className="text-sm font-semibold text-slate-700">{titulo}</p>

      <div className="mt-2 flex h-4 gap-0.5" aria-hidden="true">
        {visiveis.map((parte, i) => (
          <div
            key={parte.rotulo}
            title={`${parte.rotulo}: ${formatNumero(parte.valor)} (${formatPercentual(percentual(parte.valor, todo))})`}
            className={`h-full min-w-[3px] ${i === 0 ? 'rounded-l-[4px]' : ''} ${
              i === visiveis.length - 1 ? 'rounded-r-[4px]' : ''
            }`}
            style={{ width: `${(parte.valor / todo) * 100}%`, background: parte.cor }}
          />
        ))}
      </div>

      <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {visiveis.map((parte) => (
          <div key={parte.rotulo} className="flex items-baseline gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 translate-y-px rounded-full"
              style={{ background: parte.cor }}
              aria-hidden="true"
            />
            <dt className="text-slate-600">{parte.rotulo}</dt>
            <dd className="ml-auto text-right tabular-nums text-slate-500">
              <span className="font-bold text-slate-900">
                {formatPercentual(percentual(parte.valor, todo))}
              </span>{' '}
              · {formatNumero(parte.valor)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function PainelVotos({ totais }: { totais: Totais }) {
  // Senador com duas vagas: dois votos por eleitor.
  const votosPorEleitor =
    totais.votosTotais && totais.comparecimento
      ? Math.round(totais.votosTotais / totais.comparecimento)
      : 1;

  return (
    <Bloco
      icone={<Vote size={20} />}
      titulo="Comparecimento e votos"
      descricao="Quem foi votar e para onde os votos foram."
    >
      <div className="space-y-6">
        <BarraDePartes
          titulo="Eleitorado"
          partes={[
            { rotulo: 'Compareceram', valor: totais.comparecimento, cor: COR_PRINCIPAL },
            { rotulo: 'Abstenções', valor: totais.abstencoes, cor: '#cbd5e1' },
          ]}
        />

        <BarraDePartes
          titulo="Votos apurados"
          partes={[
            { rotulo: 'Válidos', valor: totais.votosValidos, cor: COR_PRINCIPAL },
            { rotulo: 'Brancos', valor: totais.votosBrancos, cor: '#cbd5e1' },
            { rotulo: 'Nulos', valor: totais.votosNulos, cor: '#64748b' },
            {
              rotulo: 'Anulados sub judice',
              valor: totais.votosAnuladosSubJudice,
              cor: 'var(--color-voto-abstencao)',
            },
          ]}
        />

        {(totais.votosLegenda ?? 0) > 0 && (
          <BarraDePartes
            titulo="Votos válidos"
            partes={[
              {
                rotulo: 'Nominais (em candidato)',
                valor: totais.votosNominais,
                cor: COR_PRINCIPAL,
              },
              {
                rotulo: 'De legenda (só no partido)',
                valor: totais.votosLegenda,
                cor: 'var(--color-tema-autoria)',
              },
            ]}
          />
        )}
      </div>

      {votosPorEleitor > 1 && (
        <p className="mt-5 flex items-start gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-500">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            Com {votosPorEleitor} vagas em disputa, cada eleitor deu{' '}
            {votosPorEleitor} votos — por isso os votos apurados passam do
            número de pessoas que compareceram.
          </span>
        </p>
      )}
    </Bloco>
  );
}

function PainelPartidos({
  partidos,
  cores,
  unidade,
  temCadeiras,
  soPrimeiroTurno,
}: {
  partidos: PartidoResultado[];
  cores: Map<string, string>;
  unidade: string;
  temCadeiras: boolean;
  // Na soma entre UFs os votos são só do 1º turno
  soPrimeiroTurno: boolean;
}) {
  const [todos, setTodos] = useState(false);

  const totalCadeiras = partidos.reduce((soma, p) => soma + p.cadeiras, 0);
  const totalVotos = partidos.reduce((soma, p) => soma + (p.votos ?? 0), 0);
  const escala = Math.max(
    ...partidos.map((p) => (temCadeiras ? p.cadeiras : (p.votos ?? 0))),
    1
  );

  const LIMITE = 10;
  const visiveis = todos ? partidos : partidos.slice(0, LIMITE);

  return (
    <Bloco
      icone={<Users size={20} />}
      titulo="Desempenho dos partidos"
      descricao={
        temCadeiras
          ? `Compare a fatia de ${unidade} com a fatia de votos de cada partido.`
          : 'Votos de cada partido na disputa.'
      }
    >
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-wide text-slate-400">
              <th scope="col" className="py-2 pr-3 font-semibold">Partido</th>
              <th scope="col" className="w-2/5 py-2 pr-3 font-semibold">
                {temCadeiras ? unidade : 'Votos'}
              </th>
              {temCadeiras && (
                <th scope="col" className="py-2 pr-3 text-right font-semibold">
                  % {unidade}
                </th>
              )}
              {temCadeiras && (
                <th scope="col" className="py-2 pr-3 text-right font-semibold">Votos</th>
              )}
              <th scope="col" className="py-2 text-right font-semibold">% votos</th>
            </tr>
          </thead>
          <tbody>
            {visiveis.map((partido) => {
              const valor = temCadeiras ? partido.cadeiras : (partido.votos ?? 0);

              return (
                <tr key={partido.siglaPartido} className="border-b border-slate-100">
                  <th scope="row" className="py-2.5 pr-3 text-left font-normal">
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          background: cores.get(partido.siglaPartido) ?? COR_OUTROS,
                        }}
                        aria-hidden="true"
                      />
                      <span
                        className="font-semibold text-slate-800"
                        title={partido.nomePartido ?? undefined}
                      >
                        {partido.siglaPartido}
                      </span>
                    </span>
                    {partido.federacao && (
                      <span className="mt-0.5 block pl-[18px] text-[11px] leading-4 text-slate-400">
                        {partido.federacao}
                      </span>
                    )}
                  </th>
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3 min-w-16 flex-1">
                        <div
                          className="h-full rounded-r-[4px]"
                          style={{
                            width: `${(valor / escala) * 100}%`,
                            background: COR_PRINCIPAL,
                          }}
                          aria-hidden="true"
                        />
                      </div>
                      <span className="w-14 shrink-0 text-right font-bold tabular-nums text-slate-900">
                        {temCadeiras ? formatNumero(valor) : formatCompacto(valor)}
                      </span>
                    </div>
                  </td>
                  {temCadeiras && (
                    <td className="py-2.5 pr-3 text-right tabular-nums text-slate-600">
                      {formatPercentual(percentual(partido.cadeiras, totalCadeiras), 1)}
                    </td>
                  )}
                  {temCadeiras && (
                    <td className="py-2.5 pr-3 text-right tabular-nums text-slate-600">
                      {formatNumero(partido.votos)}
                    </td>
                  )}
                  <td className="py-2.5 text-right tabular-nums text-slate-600">
                    {formatPercentual(percentual(partido.votos, totalVotos), 1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {partidos.length > LIMITE && (
        <button
          type="button"
          onClick={() => setTodos((atual) => !atual)}
          className="mt-4 text-sm font-semibold text-brasil-blue hover:underline"
        >
          {todos ? 'Mostrar só os maiores' : `Ver os ${partidos.length} partidos`}
        </button>
      )}

      <p className="mt-4 text-xs leading-5 text-slate-400">
        % de votos calculada sobre os votos dados a partidos e candidatos
        {soPrimeiroTurno && ' no 1º turno'}.
      </p>
    </Bloco>
  );
}

function PainelEstados({
  porUf,
  aoEscolher,
}: {
  porUf: ResultadoEleicao[];
  aoEscolher: (uf: string) => void;
}) {
  const linhas = porUf
    .map((resultado) => ({
      resultado,
      taxa:
        percentual(resultado.comparecimento, resultado.eleitorado) ??
        resultado.percentualComparecimento,
    }))
    .sort((a, b) => (b.taxa ?? -1) - (a.taxa ?? -1));

  return (
    <Bloco
      icone={<MapPinned size={20} />}
      titulo="Comparecimento por estado"
      descricao="Parcela do eleitorado que foi votar no 1º turno. Toque em um estado para abrir a disputa."
    >
      <ol className="gap-x-8 sm:columns-2 lg:columns-3">
        {linhas.map(({ resultado, taxa }) => (
          <li key={`${resultado.cargo}-${resultado.uf}`} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => aoEscolher(resultado.uf)}
              title={`${resultado.uf}: ${formatNumero(resultado.comparecimento)} de ${formatNumero(resultado.eleitorado)} eleitores`}
              className="group flex w-full items-center gap-2 rounded-lg py-1.5 text-left focus-visible:outline-2 focus-visible:outline-brasil-blue"
            >
              <span className="w-7 shrink-0 text-sm font-semibold text-slate-700 group-hover:text-brasil-blue">
                {resultado.uf}
              </span>
              <span className="h-2.5 flex-1">
                <span
                  className="block h-full rounded-r-[4px]"
                  style={{
                    width: `${Math.min(100, taxa ?? 0)}%`,
                    background: COR_PRINCIPAL,
                  }}
                  aria-hidden="true"
                />
              </span>
              <span className="w-14 shrink-0 text-right text-xs font-semibold tabular-nums text-slate-600">
                {formatPercentual(taxa, 1)}
              </span>
              {resultado.haSegundoTurno && (
                <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                  2º turno
                </span>
              )}
            </button>
          </li>
        ))}
      </ol>
    </Bloco>
  );
}

export function ResultadosEleicao() {
  const [cargo, setCargo] = useState<CargoChave>('federal');
  // '' = Brasil inteiro
  const [uf, setUf] = useState('');
  const [turno, setTurno] = useState<number | null>(null);
  const [carga, setCarga] = useState<{ chave: string; dados: Dados } | null>(null);

  // Presidente tem um total nacional pronto; os outros cargos são somados entre as UFs.
  const agregado = uf === '' && cargo !== 'presidente';
  const chave = `${cargo}|${uf}|${turno}`;

  useEffect(() => {
    let cancelado = false;

    (agregado ? carregarAgregado(cargo) : carregarDisputa(cargo, uf, turno))
      .catch((): Dados => ({ tipo: 'erro' }))
      .then((dados) => {
        if (!cancelado) setCarga({ chave, dados });
      });

    return () => {
      cancelado = true;
    };
  }, [agregado, cargo, uf, turno, chave]);

  const carregando = carga?.chave !== chave;
  const dados = carga?.dados ?? null;

  const escolherCargo = (novo: CargoChave) => {
    setCargo(novo);
    setTurno(null);
    // Voto no exterior só existe para presidente.
    if (novo !== 'presidente' && uf === UF_EXTERIOR) setUf('');
  };

  const escolherUf = (nova: string) => {
    setUf(nova);
    setTurno(null);
  };

  const legislativo = cargo === 'senador' || cargo === 'federal' || cargo === 'estadual';
  const proporcional = cargo === 'federal' || cargo === 'estadual';
  const unidade = cargo === 'governador' ? 'governos' : 'cadeiras';

  const rotuloCargo = cargos.find((item) => item.chave === cargo)!.rotulo;
  const rotuloLocal =
    uf === '' ? 'Brasil' : uf === UF_EXTERIOR ? 'Exterior' : uf;

  let conteudo: ReactNode = null;

  if (dados?.tipo === 'erro') {
    conteudo = (
      <p className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Não conseguimos carregar os resultados agora. Tente novamente em alguns
        instantes.
      </p>
    );
  } else if (dados?.tipo === 'vazio') {
    conteudo = (
      <p className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Ainda não há resultado divulgado para {rotuloCargo.toLowerCase()} em{' '}
        {rotuloLocal}.
      </p>
    );
  } else if (dados) {
    const resultados = dados.tipo === 'agregado' ? dados.porUf : [dados.resultado];
    const totais = somarTotais(resultados);
    const partidos = ordenarPartidos(dados.partidos);

    const totalCadeiras =
      dados.tipo === 'agregado'
        ? dados.totalCadeiras
        : partidos.reduce((soma, p) => soma + p.cadeiras, 0);

    // A cor acompanha o partido em todo o painel: os sete maiores, o resto é "Outros".
    const comCadeiras = partidos.filter((p) => p.cadeiras > 0);
    const base = comCadeiras.length > 0 ? comCadeiras : partidos;
    const cores = new Map(
      base.slice(0, CORES_PARTIDOS.length).map((p, i) => [p.siglaPartido, CORES_PARTIDOS[i]])
    );

    const destacados = comCadeiras.slice(0, CORES_PARTIDOS.length);
    const cadeirasOutros = comCadeiras
      .slice(CORES_PARTIDOS.length)
      .reduce((soma, p) => soma + p.cadeiras, 0);

    const grupos: GrupoCadeiras[] = [
      ...destacados.map((p, i) => ({
        chave: p.siglaPartido,
        rotulo: p.siglaPartido,
        cadeiras: p.cadeiras,
        cor: CORES_PARTIDOS[i],
      })),
      ...(cadeirasOutros > 0
        ? [{ chave: '__outros', rotulo: 'Outros', cadeiras: cadeirasOutros, cor: COR_OUTROS }]
        : []),
    ];

    const emApuracao = resultados.filter((r) => !r.totalizacaoFinal);
    const pctSecoes = percentual(totais.secoesTotalizadas, totais.secoes);
    const atualizadoEm = formatDataHora(
      resultados
        .map((r) => r.dataTotalizacao ?? r.dataGeracao)
        .filter((data): data is string => data !== null)
        .sort()
        .pop()
    );
    const comSegundoTurno = resultados.filter((r) => r.haSegundoTurno);

    const mostrarCadeiras = legislativo && totalCadeiras >= 8;
    const mostrarPartidos =
      partidos.length > 0 && (dados.tipo === 'agregado' || proporcional);
    const vagasEmAberto =
      totais.vagas !== null && totais.vagas > totalCadeiras
        ? totais.vagas - totalCadeiras
        : 0;

    const maior = comCadeiras[0];
    const maioria = Math.floor(totalCadeiras / 2) + 1;

    conteudo = (
      <div className={`space-y-5 transition-opacity ${carregando ? 'opacity-50' : ''}`}>
        {(emApuracao.length > 0 || comSegundoTurno.length > 0) && (
          <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
            <Info className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>
              {emApuracao.length > 0 && (
                <>
                  <strong>Apuração em andamento</strong>
                  {pctSecoes !== null &&
                    ` — ${formatPercentual(pctSecoes)} das seções totalizadas`}
                  {dados.tipo === 'agregado' &&
                    ` (${emApuracao.length} de ${resultados.length} estados ainda sem resultado final)`}
                  . Os números ainda podem mudar.{' '}
                </>
              )}
              {comSegundoTurno.length > 0 &&
                (dados.tipo === 'agregado'
                  ? `${comSegundoTurno.length} ${comSegundoTurno.length === 1 ? 'estado decide' : 'estados decidem'} no 2º turno: ${comSegundoTurno.map((r) => r.uf).join(', ')}.`
                  : dados.resultado.turno === 1
                    ? 'Esta disputa vai ao 2º turno.'
                    : '')}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Indicador
            rotulo="Eleitorado"
            valor={formatCompacto(totais.eleitorado)}
            apoio={`${formatNumero(totais.eleitorado)} aptos a votar`}
          />
          <Indicador
            rotulo="Comparecimento"
            valor={formatPercentual(percentual(totais.comparecimento, totais.eleitorado), 1)}
            apoio={`${formatNumero(totais.comparecimento)} eleitores`}
          />
          <Indicador
            rotulo="Abstenção"
            valor={formatPercentual(percentual(totais.abstencoes, totais.eleitorado), 1)}
            apoio={`${formatNumero(totais.abstencoes)} eleitores`}
          />
          {dados.tipo === 'disputa' && dados.resultado.quocienteEleitoral ? (
            <Indicador
              rotulo="Quociente eleitoral"
              valor={formatNumero(dados.resultado.quocienteEleitoral)}
              apoio={`votos por vaga · ${formatNumero(totais.vagas)} vagas`}
            />
          ) : (
            <Indicador
              rotulo="Vagas em disputa"
              valor={formatNumero(totais.vagas)}
              apoio={
                pctSecoes !== null
                  ? `${formatPercentual(pctSecoes)} das seções totalizadas`
                  : null
              }
            />
          )}
        </div>

        {mostrarCadeiras && (
          <Bloco
            icone={<Landmark size={20} />}
            titulo="Divisão das cadeiras"
            descricao={`Como as cadeiras em disputa para ${rotuloCargo.toLowerCase()} ficaram entre os partidos — ${rotuloLocal}.`}
          >
            <Hemiciclo grupos={grupos} unidade="cadeiras" />

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {maior && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Maior bancada
                  </p>
                  <p className="mt-1 text-base font-bold text-slate-900">
                    {maior.siglaPartido}
                  </p>
                  <p className="text-xs text-slate-500">
                    {maior.cadeiras} cadeiras ·{' '}
                    {formatPercentual(percentual(maior.cadeiras, totalCadeiras), 1)}
                  </p>
                </div>
              )}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Partidos com cadeira
                </p>
                <p className="mt-1 text-base font-bold text-slate-900">
                  {comCadeiras.length}
                </p>
                <p className="text-xs text-slate-500">
                  de {partidos.length} que disputaram
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Metade mais um
                </p>
                <p className="mt-1 text-base font-bold text-slate-900">{maioria}</p>
                <p className="text-xs text-slate-500">
                  das {totalCadeiras} cadeiras em disputa
                </p>
              </div>
            </div>

            {vagasEmAberto > 0 && (
              <p className="mt-4 text-xs leading-5 text-slate-500">
                {vagasEmAberto} das {formatNumero(totais.vagas)} vagas ainda não
                têm dono definido.
              </p>
            )}
          </Bloco>
        )}

        <div className="grid gap-5 xl:grid-cols-2">
          <PainelVotos totais={totais} />

          {mostrarPartidos && (
            <PainelPartidos
              key={chave}
              partidos={partidos}
              cores={cores}
              unidade={unidade}
              temCadeiras={totalCadeiras > 0}
              soPrimeiroTurno={dados.tipo === 'agregado'}
            />
          )}

          {dados.tipo === 'disputa' && (
            <Bloco
              icone={<ChartPie size={20} />}
              titulo="Candidatos"
              descricao={`Votação de cada candidato a ${rotuloCargo.toLowerCase()} — ${rotuloLocal}, ${rotuloTurno(dados.resultado.turno)}.`}
            >
              <CandidatosResultado
                key={dados.resultado.idEleicaoResultado}
                idEleicaoResultado={dados.resultado.idEleicaoResultado}
                votosValidos={dados.resultado.votosValidos}
              />
            </Bloco>
          )}
        </div>

        {dados.tipo === 'agregado' && (
          <PainelEstados porUf={dados.porUf} aoEscolher={escolherUf} />
        )}

        <p className="text-xs leading-5 text-slate-400">
          Fonte: totalização oficial do TSE
          {atualizadoEm && ` · atualizado em ${atualizadoEm}`}.
        </p>
      </div>
    );
  }

  const turnos = dados?.tipo === 'disputa' ? dados.turnos : [];
  const turnoAtual = dados?.tipo === 'disputa' ? dados.resultado.turno : null;

  return (
    <div>
      {/* Filtros: uma linha acima de todos os gráficos */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label="Cargo"
          >
            {cargos.map((item) => (
              <button
                key={item.chave}
                type="button"
                aria-pressed={cargo === item.chave}
                onClick={() => escolherCargo(item.chave)}
                className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
                  cargo === item.chave
                    ? 'border-brasil-blue bg-brasil-blue text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.rotulo}
              </button>
            ))}
          </div>

          <select
            value={uf}
            onChange={(evento) => escolherUf(evento.target.value)}
            aria-label="Abrangência"
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-brasil-blue"
          >
            <option value="">Brasil</option>
            {estados.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
            {cargo === 'presidente' && <option value={UF_EXTERIOR}>Exterior</option>}
          </select>

          {turnos.length > 1 && (
            <div
              className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-sm"
              role="group"
              aria-label="Turno"
            >
              {turnos.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={turnoAtual === item}
                  onClick={() => setTurno(item)}
                  className={`rounded-lg px-3 py-1.5 font-semibold transition ${
                    turnoAtual === item
                      ? 'bg-white text-brasil-blue shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {rotuloTurno(item)}
                </button>
              ))}
            </div>
          )}

          {carregando && (
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-brasil-blue">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando
            </span>
          )}
        </div>
      </div>

      {conteudo}

      <p className="sr-only" aria-live="polite">
        {carregando
          ? 'Carregando resultados'
          : `Resultados de ${rotuloCargo}, ${rotuloLocal}, eleições ${ANO_ELEICAO}`}
      </p>
    </div>
  );
}
