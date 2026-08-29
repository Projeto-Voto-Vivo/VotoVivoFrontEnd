import {
  FileText,
  Home,
  Users,
  Wallet,
} from "lucide-react";

import {
  FONTES_CUSTOS,
  REVISAO_CUSTOS,
} from "../data/custos";

import { CostCard } from "../shared/CostCard";

export function CustosSection() {
  return (
    <section
      id="custos"
      className="scroll-mt-24 py-4 sm:py-6"
    >
      <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
        <div className="mb-4 rounded-2xl bg-green-600 p-3 text-white shadow-lg shadow-green-200">
          <Wallet size={28} />
        </div>

        <h2 className="text-3xl font-black tracking-tighter text-slate-900 sm:text-4xl">
          Quanto custa um parlamentar
        </h2>

        <div className="mt-4 h-1.5 w-12 rounded-full bg-green-500" />
      </div>

      <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
        <div className="relative flex flex-col items-center justify-between overflow-hidden rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-white shadow-xl sm:col-span-2 sm:flex-row sm:items-center sm:rounded-[2.5rem] sm:p-8">
          <div className="relative z-10 text-center sm:text-left">
            <span className="rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-300">
              Estimativa Mensal Total
            </span>

            <h3 className="mt-3 text-xl font-bold sm:text-2xl">
              Custo Total de Manutenção
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-400">
              Valor aproximado para manter toda a estrutura de um parlamentar
              ativa.
            </p>
          </div>

          <div className="relative z-10 mt-6 text-center sm:mt-0 sm:text-right">
            <p className="mb-1 text-sm font-bold uppercase text-blue-400">
              Investimento Médio
            </p>

            <h2 className="break-words bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-3xl font-black leading-none text-transparent sm:text-5xl">
              R$ 200 mil a R$ 500 mil+
            </h2>

            <p className="mt-3 max-w-xs text-[11px] leading-4 text-slate-400 sm:ml-auto">
              Soma dos itens detalhados abaixo. É uma estimativa, não um valor
              publicado como total por nenhuma das casas.
            </p>
          </div>
        </div>

        <CostCard
          icon={<Wallet size={20} />}
          tone="blue"
          title="Salário"
          value="R$ 46 mil"
          text="Remuneração base mensal igual para deputados e senadores."
          source={FONTES_CUSTOS.salario}
        />

        <CostCard
          icon={<Users size={20} />}
          tone="green"
          title="Gabinete"
          value="Até R$ 118 mil"
          extra="~ R$ 497 mil"
          text="Pagamento de funcionários e assessores do gabinete."
          source={FONTES_CUSTOS.gabinete}
        />

        <CostCard
          icon={<FileText size={20} />}
          tone="yellow"
          title="Cota (CEAP)"
          value="R$ 21 mil a R$ 58 mil"
          text="Transporte, escritório, serviços e atividades do mandato. O valor varia conforme a distância do estado até Brasília."
          source={FONTES_CUSTOS.cota}
        />

        <CostCard
          icon={<Home size={20} />}
          tone="red"
          title="Benefícios"
          value="Até R$ 5,5 mil"
          text="Inclui auxílio-moradia, saúde e ajuda de custo."
          source={FONTES_CUSTOS.beneficios}
        />
      </div>

      <p className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-xs leading-5 text-slate-500 sm:px-5">
        Os valores acima são de referência e foram revisados em{" "}
        {REVISAO_CUSTOS}. Reajustes, atos das Mesas e decisões judiciais podem
        alterar os montantes. Confira sempre os portais de transparência da
        Câmara e do Senado.
      </p>
    </section>
  );
}