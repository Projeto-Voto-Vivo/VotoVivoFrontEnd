import Link from 'next/link';
import { SlidersHorizontal } from 'lucide-react';
import { FiltrosRanking } from '@/types';

export interface CriteriosBusca {
  tema?: string;
  funcaoEmenda?: string;
  destinoEmenda?: string;
  comissao?: string;
  partido?: string;
  casa?: string;
  uf?: string;
  pesos: Record<string, number>;
}

interface BuscaAvancadaProps {
  filtros: FiltrosRanking;
  criterios: CriteriosBusca;
  /** Abre o painel já expandido quando a busca avançada está em uso. */
  aberta: boolean;
}

const CLASSE_CAMPO =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-brasil-blue';

function Campo({
  id,
  titulo,
  ajuda,
  children,
}: {
  id: string;
  titulo: string;
  ajuda: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-bold uppercase tracking-[0.14em] text-slate-500"
      >
        {titulo}
      </label>
      <p className="mt-1 text-xs leading-5 text-slate-500">{ajuda}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

/**
 * Peso de um critério na média.
 *
 * Só aparece quando há dois ou mais critérios preenchidos: com um critério só,
 * o peso não muda nada — a média de um número é ele mesmo —, e um controle que
 * não faz efeito é pior que controle nenhum.
 */
function Peso({ criterio, valor }: { criterio: string; valor: number }) {
  const id = `peso-${criterio}`;

  return (
    <div className="mt-2 flex items-center gap-2">
      <label htmlFor={id} className="text-xs text-slate-500">
        Importância
      </label>
      <select
        id={id}
        name={id}
        defaultValue={String(valor)}
        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 outline-none focus:border-brasil-blue"
      >
        <option value="1">Normal</option>
        <option value="2">Conta o dobro</option>
        <option value="3">Conta o triplo</option>
      </select>
    </div>
  );
}

const CRITERIOS = ['tema', 'funcaoEmenda', 'destinoEmenda', 'comissao'] as const;

export function BuscaAvancada({ filtros, criterios, aberta }: BuscaAvancadaProps) {
  const preenchidos = CRITERIOS.filter((chave) => Boolean(criterios[chave]));
  const mostrarPesos = preenchidos.length >= 2;

  const peso = (criterio: string) => criterios.pesos[criterio] ?? 1;
  const temPeso = (criterio: (typeof CRITERIOS)[number]) =>
    mostrarPesos && preenchidos.includes(criterio);

  return (
    <details
      open={aberta}
      className="group mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4">
        <span className="flex items-center gap-3">
          <SlidersHorizontal className="h-5 w-5 shrink-0 text-brasil-blue" />
          <span>
            <span className="block text-sm font-bold text-slate-900">
              Pesquisa avançada
            </span>
            <span className="block text-xs leading-5 text-slate-500">
              Encontre quem mais atua num assunto, numa área de emenda, num
              município ou numa comissão.
            </span>
          </span>
        </span>
        <span className="shrink-0 text-xs font-semibold text-brasil-blue group-open:hidden">
          Abrir
        </span>
        <span className="hidden shrink-0 text-xs font-semibold text-slate-500 group-open:inline">
          Fechar
        </span>
      </summary>

      <div className="border-t border-slate-100 p-4 md:p-6">
        {!filtros.disponivel ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
            As opções da pesquisa avançada não carregaram agora. Recarregue a
            página em alguns instantes — sem elas os campos ficariam vazios, e
            qualquer valor digitado voltaria sem resultado.
          </p>
        ) : (
          <>
            {/*
              O recurso se chama afinidade, mas o que ele mede é atuação: quem
              propõe sobre o assunto, quem manda emenda para lá, quem senta na
              comissão. Dizer isso antes do formulário evita que o resultado
              seja lido como "quem concorda comigo" — o dado não sustenta essa
              leitura, e quem pesquisa não tem como adivinhar sozinho.
            */}
            <p className="mb-5 rounded-2xl border border-brasil-blue/15 bg-brasil-blue/5 px-4 py-3 text-xs leading-5 text-slate-600">
              Esta busca mede <strong className="font-semibold">atuação</strong>,
              não concordância. Quem aparece no topo de &ldquo;Meio
              ambiente&rdquo; é quem mais trabalha o assunto — a favor ou
              contra. Para saber a posição de cada um, abra o perfil e veja os
              votos.
            </p>

            <form method="get" action="/parlamentares" className="space-y-5">
              <input type="hidden" name="avancada" value="1" />

              <div className="grid gap-5 md:grid-cols-2">
                <Campo
                  id="criterio-tema"
                  titulo="Assunto das proposições"
                  ajuda="Proposições que o parlamentar assina sobre este tema."
                >
                  <select
                    id="criterio-tema"
                    name="tema"
                    defaultValue={criterios.tema ?? ''}
                    className={CLASSE_CAMPO}
                  >
                    <option value="">Qualquer assunto</option>
                    {filtros.temas.map((opcao) => (
                      <option key={opcao.valor} value={opcao.valor}>
                        {opcao.valor} ({opcao.total})
                      </option>
                    ))}
                  </select>
                  {temPeso('tema') && <Peso criterio="tema" valor={peso('tema')} />}
                </Campo>

                <Campo
                  id="criterio-funcao"
                  titulo="Área das emendas"
                  ajuda="Quanto ele empenhou em emendas com esta finalidade."
                >
                  <select
                    id="criterio-funcao"
                    name="funcaoEmenda"
                    defaultValue={criterios.funcaoEmenda ?? ''}
                    className={CLASSE_CAMPO}
                  >
                    <option value="">Qualquer área</option>
                    {filtros.funcoesEmenda.map((opcao) => (
                      <option key={opcao.valor} value={opcao.valor}>
                        {opcao.valor} ({opcao.total})
                      </option>
                    ))}
                  </select>
                  {temPeso('funcaoEmenda') && (
                    <Peso criterio="funcaoEmenda" valor={peso('funcaoEmenda')} />
                  )}
                </Campo>

                <Campo
                  id="criterio-destino"
                  titulo="Destino das emendas"
                  ajuda="Para onde o dinheiro das emendas dele foi. Não é a UF em que ele se elegeu."
                >
                  <input
                    id="criterio-destino"
                    name="destinoEmenda"
                    list="destinos-emenda"
                    defaultValue={criterios.destinoEmenda ?? ''}
                    placeholder="Comece a digitar o município"
                    autoComplete="off"
                    className={CLASSE_CAMPO}
                  />
                  <datalist id="destinos-emenda">
                    {filtros.destinosEmenda.map((opcao) => (
                      <option key={opcao.valor} value={opcao.valor}>
                        {opcao.total} emendas
                      </option>
                    ))}
                  </datalist>
                  {filtros.destinosTruncadosEm > 0 && (
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      A lista sugere os {filtros.destinosTruncadosEm} destinos
                      mais frequentes. Outros municípios também funcionam, mas
                      precisam ser escritos como aparecem na fonte — por
                      exemplo, <em>SÃO PAULO - SP</em>.
                    </p>
                  )}
                  {temPeso('destinoEmenda') && (
                    <Peso criterio="destinoEmenda" valor={peso('destinoEmenda')} />
                  )}
                </Campo>

                <Campo
                  id="criterio-comissao"
                  titulo="Comissão"
                  ajuda="Quem é membro marca pontuação cheia; o cargo aparece no resultado."
                >
                  <select
                    id="criterio-comissao"
                    name="comissao"
                    defaultValue={criterios.comissao ?? ''}
                    className={CLASSE_CAMPO}
                  >
                    <option value="">Qualquer comissão</option>
                    {filtros.comissoes.map((comissao) => {
                      const valor = comissao.sigla || comissao.nome || '';
                      if (!valor) return null;

                      return (
                        <option key={`${comissao.casa}-${valor}`} value={valor}>
                          {comissao.sigla ? `${comissao.sigla} — ` : ''}
                          {comissao.nome ?? comissao.sigla} ({comissao.membros})
                        </option>
                      );
                    })}
                  </select>
                  {temPeso('comissao') && (
                    <Peso criterio="comissao" valor={peso('comissao')} />
                  )}
                </Campo>
              </div>

              <fieldset className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <legend className="px-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Restringir a quem
                </legend>
                <p className="mb-3 text-xs leading-5 text-slate-500">
                  Estes campos não pontuam: apenas reduzem quem entra na
                  comparação. E reduzir o grupo muda todas as notas, porque a
                  nota é sempre relativa a quem está sendo comparado.
                </p>

                <div className="grid gap-3 sm:grid-cols-3">
                  <select
                    name="partido"
                    aria-label="Partido"
                    defaultValue={criterios.partido ?? ''}
                    className={CLASSE_CAMPO}
                  >
                    <option value="">Todos os partidos</option>
                    {filtros.partidos.map((opcao) => (
                      <option key={opcao.valor} value={opcao.valor}>
                        {opcao.valor} ({opcao.total})
                      </option>
                    ))}
                  </select>

                  <select
                    name="casa"
                    aria-label="Casa legislativa"
                    defaultValue={criterios.casa ?? ''}
                    className={CLASSE_CAMPO}
                  >
                    <option value="">Câmara e Senado</option>
                    <option value="camara">Só Câmara</option>
                    <option value="senado">Só Senado</option>
                  </select>

                  <input
                    name="uf"
                    aria-label="UF de eleição"
                    placeholder="UF de eleição"
                    defaultValue={criterios.uf ?? ''}
                    maxLength={2}
                    className={`${CLASSE_CAMPO} uppercase`}
                  />
                </div>
              </fieldset>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="rounded-xl bg-brasil-blue px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Buscar por afinidade
                </button>

                <Link
                  href="/parlamentares"
                  className="text-sm font-semibold text-slate-500 hover:text-brasil-blue"
                >
                  Limpar e voltar à lista
                </Link>

                {!mostrarPesos && (
                  <span className="text-xs leading-5 text-slate-500">
                    Com dois ou mais critérios, dá para dizer qual deles pesa
                    mais.
                  </span>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </details>
  );
}
