import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  PenTool,
  Scale,
  User,
  Users,
} from "lucide-react";

import { SectionHeading } from "../shared/SectionHeading";

export function EmendasSection() {
  return (
    <section
      id="emendas"
      className="scroll-mt-24 rounded-3xl bg-slate-50/50 px-3 py-6 sm:rounded-[3rem] sm:px-4 sm:py-10"
    >
      <SectionHeading title="Emendas Parlamentares">
        São recursos do orçamento público que os congressistas podem direcionar para
        obras e projetos em suas bases eleitorais.
      </SectionHeading>

      <div className="mx-auto grid max-w-6xl items-start gap-5 sm:gap-6 md:grid-cols-12">
        {/* =========================================================
            EMENDAS INDIVIDUAIS
        ========================================================= */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2.5rem] sm:p-8 md:col-span-8">
          <div className="mb-5 flex items-start justify-between gap-3 sm:mb-6">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
              <User size={28} aria-hidden="true" />
            </div>

            <span className="rounded-full bg-red-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-red-700 sm:px-3 sm:text-[10px]">
              <AlertTriangle
                size={12}
                className="mr-1 inline"
                aria-hidden="true"
              />
              Transparência
            </span>
          </div>

          <h3 className="mb-2 text-xl font-bold text-slate-900 sm:text-2xl">
            Emendas Individuais
          </h3>

          <p className="mb-6 max-w-xl text-sm leading-relaxed text-slate-500">
            Cada parlamentar tem uma cota individual para indicar. Metade desse
            recurso deve, obrigatoriamente, ir para a{" "}
            <strong className="text-slate-700">Saúde</strong>.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Projeto específico */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="mb-1 text-sm font-bold text-slate-800">
                Projeto Específico
              </p>

              <p className="text-xs leading-relaxed text-slate-500">
                Exige projeto, aprovação formal e convênio com o estado ou
                município beneficiado.
              </p>
            </div>

            {/* Transferência especial */}
            <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold text-orange-900">
                  Transferência Especial
                </p>

                <span className="rounded-full bg-red-400/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-red-500">
                  <AlertCircle
                    size={12}
                    className="mr-1 inline"
                    aria-hidden="true"
                  />
                  Emendas PIX
                </span>
              </div>

              <p className="text-xs leading-relaxed text-orange-800">
                O dinheiro é enviado diretamente ao ente beneficiado, sem
                definição detalhada inicial do gasto.
              </p>
            </div>
          </div>

          {/* Alerta de transparência */}
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-orange-100 bg-orange-50/60 p-3">
            <AlertCircle
              size={14}
              className="mt-0.5 shrink-0 text-orange-600"
              aria-hidden="true"
            />

            <p className="text-[11px] leading-relaxed text-orange-900/80">
              As transferências especiais são alvo de debates sobre
              <strong> transparência e rastreabilidade</strong> dos recursos.
            </p>
          </div>
        </div>

        {/* =========================================================
            EMENDAS DE BANCADA
        ========================================================= */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2.5rem] sm:p-8 md:col-span-4">
          <div className="mb-5 w-fit rounded-2xl bg-indigo-50 p-3 text-indigo-600">
            <Users size={28} aria-hidden="true" />
          </div>

          <h3 className="mb-2 text-xl font-bold text-slate-900">
            Emendas de Bancada
          </h3>

          <p className="mb-6 text-sm leading-relaxed text-slate-500">
            Decididas em conjunto pelos parlamentares de um mesmo estado para
            financiar <strong>projetos de interesse regional</strong>.
          </p>

          <div className="grid grid-cols-1 gap-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Quem decide
              </p>

              <p className="text-sm font-semibold text-slate-800">
                Parlamentares do estado
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Foco
              </p>

              <p className="text-sm font-semibold text-slate-800">
                Projetos de interesse regional
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================
            EMENDAS DE COMISSÃO
        ========================================================= */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2.5rem] sm:p-8 md:col-span-5">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
              <BookOpen size={28} aria-hidden="true" />
            </div>
          </div>

          <h3 className="mb-2 text-xl font-bold text-slate-900">
            Emendas de Comissão
          </h3>

          <p className="mb-6 text-sm leading-relaxed text-slate-500">
            Criadas por <strong>comissões temáticas</strong> do Congresso,
            relacionadas a áreas como Saúde e Educação.
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-1">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Área
              </p>

              <p className="text-sm font-semibold text-slate-800">
                Saúde, Educação e outras áreas temáticas
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Pagamento
              </p>

              <p className="text-sm font-semibold text-slate-800">
                Governo decide sobre a execução
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================
            EMENDAS DE RELATOR
        ========================================================= */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2.5rem] sm:p-8 md:col-span-7">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="rounded-2xl bg-amber-50 p-3 text-amber-700">
              <PenTool size={28} aria-hidden="true" />
            </div>

            <span className="rounded-full bg-red-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-red-700 sm:px-3 sm:text-[10px]">
              <AlertTriangle
                size={12}
                className="mr-1 inline"
                aria-hidden="true"
              />
              Transparência
            </span>
          </div>

          <h3 className="mb-2 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            Emendas de Relator (RP9)
          </h3>

          <p className="mb-6 text-sm leading-relaxed text-slate-600">
            Originalmente usadas para ajustes orçamentários, tornaram-se
            controversas e ganharam o apelido de{" "}
            <strong className="text-amber-800">“Orçamento Secreto”</strong>{" "}
            devido às dificuldades de rastrear a indicação dos recursos.
          </p>

          {/* Contexto jurídico */}
          <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <Scale
              size={18}
              className="mt-0.5 shrink-0 text-amber-600"
              aria-hidden="true"
            />

            <div>
              <p className="mb-1 text-xs font-bold text-amber-950">
                Decisões do STF
              </p>

              <p className="text-xs leading-relaxed text-amber-900/80">
                O mecanismo foi considerado inconstitucional em decisões
                relacionadas à falta de transparência.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

