import {
  FileText,
  Globe,
  Landmark,
  Search,
  User,
  Users,
  Gavel,
  Layers,
} from "lucide-react";

import { SectionHeading } from "../shared/SectionHeading";
import { CongressHouse } from "../shared/CongressHouse";

export function CongressoSection() {
  return (
    <section id="congresso" className="scroll-mt-24 rounded-3xl bg-slate-50/50 px-3 py-6 sm:rounded-[3rem] sm:px-4 sm:py-10">
      <SectionHeading title="O Congresso Nacional">
        O Congresso Nacional exerce o Poder Legislativo da União e funciona no
        sistema <strong>bicameral</strong>, composto pela Câmara dos Deputados e
        pelo Senado Federal.
      </SectionHeading>

      <div className="grid items-center gap-8 overflow-hidden rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:rounded-[3rem] sm:p-8 md:p-12 lg:grid-cols-12">
        <CongressHouse
          title="Câmara dos Deputados"
          subtitle="Representação do Povo"
          color="orange"
          icon={<Users size={24} />}
          items={[
            {
              title: "Composição",
              text: "513 Deputados Federais eleitos.",
              icon: <User size={16} />,
            },
            {
              title: "Sistema Eleitoral",
              text: "Sistema Proporcional (4 anos).",
              icon: <Layers size={16} />,
            },
            {
              title: "Competência",
              text: "• Verificar a aplicação dos recursos públicos\n• Autorizar investigações do Presidente e Ministros",
              icon: <Gavel size={16} />,
            },
          ]}
          mandate="4 ANOS"
        />

        <div className="flex flex-col items-center justify-center py-4 sm:py-8 lg:col-span-4">
          <div className="relative flex aspect-square w-full max-w-[170px] items-center justify-center sm:max-w-[210px]">
            <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-orange-400 via-blue-500 to-teal-500 opacity-10" />

            <div className="relative z-10 space-y-2 text-center sm:space-y-3">
              <div className="rounded-full border-4 border-white bg-slate-900 p-3 text-white shadow-2xl sm:p-4">
                <Landmark
                  size={34}
                  className="sm:h-11 sm:w-11"
                  aria-hidden="true"
                />
              </div>

              <p className="text-base font-black uppercase leading-tight tracking-tighter text-slate-900 sm:text-lg">
                Congresso
                <br />
                Nacional
              </p>
            </div>
          </div>
        </div>

        <CongressHouse
          title="Senado Federal"
          subtitle="Representação dos Estados"
          color="teal"
          icon={<Globe size={24} />}
          items={[
            {
              title: "Composição",
              text: "81 Senadores (3 por estado/DF).",
              icon: <User size={16} />,
            },
            {
              title: "Sistema Eleitoral",
              text: "Sistema Majoritário (8 anos).",
              icon: <Layers size={16} />,
            },
            {
              title: "Competência",
              text: "• Aprova cargos (STF, PGR)\n• Define limites da dívida\n• Julga o Presidente e autoridades",
              icon: <Gavel size={16} />,
            },
          ]}
          mandate="8 ANOS"
        />

        <div className="mt-0 border-t border-slate-100 pt-3 sm:mt-2 sm:pt-4 lg:col-span-12">
          <p className="mb-6 text-center text-sm font-black uppercase tracking-[0.16em] text-slate-600 sm:mb-8 sm:text-xl">
            Funções Compartilhadas
          </p>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {[
              [
                <FileText
                  className="text-blue-500"
                  size={20}
                  key="legislation"
                />,
                "Legislação",
                "Elaboram leis de competência federal em conjunto.",
              ],
              [
                <Search
                  className="text-blue-500"
                  size={20}
                  key="inspection"
                />,
                "Fiscalização",
                "Controlam as contas e atos do Poder Executivo.",
              ],
              [
                <Users
                  className="text-blue-500"
                  size={20}
                  key="joint"
                />,
                "Atuação Conjunta",
                "Votam o orçamento e empossam o Presidente.",
              ],
            ].map(([icon, title, text]) => (
              <div
                key={String(title)}
                className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4"
              >
                <span className="shrink-0">{icon}</span>

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {title}
                  </p>

                  <p className="text-sm leading-tight text-slate-500">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}