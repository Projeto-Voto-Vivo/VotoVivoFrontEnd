import Image from "next/image";

import { SectionHeading } from "../shared/SectionHeading";
import { ElectoralCard } from "../shared/ElectoralCard";

export function SistemaEleitoralSection() {
  return (
    <section
      id="eleitoral"
      className="scroll-mt-24 rounded-3xl bg-slate-50/50 px-3 py-6 sm:rounded-[3rem] sm:px-4 sm:py-10"
    >
      <SectionHeading title="Sistema Eleitoral Brasileiro">
        <p>
          O sistema eleitoral define como os votos são transformados em
          representantes eleitos.
        </p>

        <p className="mt-2 text-sm italic">
          No Brasil, existem dois modelos principais:{" "}
          <span className="text-blue-600">majoritário</span> e{" "}
          <span className="text-green-600">proporcional</span>.
        </p>
      </SectionHeading>

      <div className="mb-8 grid items-stretch gap-5 sm:mb-10 sm:gap-8 md:grid-cols-2">
        <ElectoralCard
          type="majoritario"
          title="Quem tem mais votos vence"
          text="Os votos vão diretamente para o candidato. Quem recebe mais votos é eleito. Em algumas eleições, se ninguém conseguir mais da metade dos votos, há um segundo turno."
          cargos={[
            "Presidente",
            "Governador",
            "Prefeito",
            "Senador",
          ]}
        />

        <ElectoralCard
          type="proporcional"
          title="Vagas distribuídas por partido"
          text="Os votos vão para o partido. Quanto mais votos o partido recebe, mais vagas pode ganhar. Depois, os candidatos mais votados daquele partido ocupam as vagas conquistadas."
          cargos={[
            "Deputado Federal",
            "Deputado Estadual",
            "Vereador",
          ]}
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm sm:rounded-[2.5rem] sm:p-6 md:p-8">
        <div className="mb-4 text-center sm:mb-6">
          <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
             Sistemas Eleitorais
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Comparação visual entre os sistemas majoritário e proporcional.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-slate-50 p-2 sm:p-4">
          <div className="relative mx-auto aspect-[16/9] min-w-[760px] w-full max-w-[1600px]">
            <Image
              src="/imagens/info-eleitoral-majoritario-proporcional.png"
              alt="Infográfico comparando os sistemas eleitorais majoritário e proporcional no Brasil"
              fill
              sizes="(max-width: 768px) 760px, 100vw"
              className="object-contain object-center"
              priority
            />
          </div>
        </div>

        <p className="mt-4 text-center text-xs italic text-slate-400">
          Infográfico ilustrativo dos sistemas majoritário e proporcional.
        </p>
      </div>
    </section>
  );
}