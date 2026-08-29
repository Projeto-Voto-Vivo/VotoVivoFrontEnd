import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  PenTool,
  RotateCcw,
  Scale,
  Search,
  Users,
} from "lucide-react";

import { SectionHeading } from "../shared/SectionHeading";
import { InfoNote } from "../shared/InfoNote";

export function ProcessoLegislativoSection() {
  return (
    <section
      id="lei"
      className="scroll-mt-24 overflow-hidden py-6 sm:py-10"
    >
      <SectionHeading title="Como nasce uma lei?">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
          <Scale size={14} />
          Processo Legislativo
        </span>

        <br />

        Uma lei percorre um caminho de debates e votações para garantir que
        atenda aos interesses da sociedade.
      </SectionHeading>

      <div className="relative">
        <div className="absolute left-0 top-1/2 hidden h-0.5 w-full -translate-y-1/2 border-t-2 border-dashed border-slate-200 lg:block" />

        <div className="relative z-10 grid gap-5 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
          {[
            [
              "1",
              "Proposta",
              "Parlamentares, Governo ou cidadãos sugerem uma ideia.",
              <PenTool size={20} key="proposal" />,
              "bg-blue-600",
            ],
            [
              "2",
              "Análise",
              "Comissões técnicas estudam e dão parecer sobre o projeto.",
              <Search size={20} key="analysis" />,
              "bg-emerald-600",
            ],
            [
              "3",
              "Votação",
              "Os parlamentares votam a favor ou contra no plenário.",
              <Users size={20} key="voting" />,
              "bg-amber-500",
            ],
            [
              "4",
              "Revisão",
              "A outra casa analisa e pode alterar o texto.",
              <RotateCcw size={20} key="review" />,
              "bg-indigo-600",
            ],
            [
              "5",
              "Sanção",
              "O Presidente aprova ou veta o projeto.",
              <CheckCircle2 size={20} key="sanction" />,
              "bg-rose-600",
            ],
          ].map(([step, title, desc, icon, color], index) => (
            <div
              key={String(step)}
              className="group rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl sm:rounded-[2rem] sm:p-6"
            >
              <div
                className={`mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${color} text-white shadow-lg transition-transform group-hover:scale-110`}
              >
                {icon}
              </div>

              <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Etapa {step}
              </span>

              <h4 className="mb-3 text-lg font-bold text-slate-900">
                {title}
              </h4>

              <p className="text-xs leading-relaxed text-slate-500">
                {desc}
              </p>

              {index < 4 && (
                <ChevronRight
                  size={22}
                  className="mx-auto mt-5 rotate-90 text-slate-300 lg:hidden"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-6 grid max-w-4xl gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:mt-8 sm:grid-cols-2 sm:gap-8 sm:rounded-[2rem] sm:p-8">
        <InfoNote
          icon={<CheckCircle2 size={20} />}
          title="Sancionar"
          text="O Presidente aprova o texto e a lei passa a valer oficialmente."
          tone="green"
        />

        <InfoNote
          icon={<AlertCircle size={20} />}
          title="Vetar"
          text="O Presidente rejeita partes ou o todo. O Congresso ainda pode derrubar o veto."
          tone="red"
        />
      </div>
    </section>
  );
}