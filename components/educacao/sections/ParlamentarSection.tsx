"use client";

import { useState } from "react";

import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Gavel,
  Home,
  Scale,
  User,
  Users,
  Wallet,
} from "lucide-react";

import { SmallRoleCard } from "../shared/SmallRoleCard";

export function ParlamentarSection() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      name: "Poderes & Competências",
      icon: <Gavel size={18} aria-hidden="true" />,
    },
    {
      name: "Ação e Dia a Dia",
      icon: <Clock3 size={18} aria-hidden="true" />,
    },
  ];

  const rotinaParlamentar = [
    {
      title: "No Gabinete",
      text: "Reuniões com assessoria e recepção de demandas de prefeitos e eleitores.",
      icon: <User size={18} aria-hidden="true" />,
    },
    {
      title: "Nas Comissões",
      text: "Debate técnico e detalhado de projetos de lei e audiências públicas.",
      icon: <BookOpen size={18} aria-hidden="true" />,
    },
    {
      title: "No Plenário",
      text: "Votação formal e decisiva de projetos e grandes temas nacionais.",
      icon: <Users size={18} aria-hidden="true" />,
    },
    {
      title: "Nas Bases Eleitorais",
      text: "Contato direto com a população para ouvir problemas e fiscalizar obras locais.",
      icon: <Home size={18} aria-hidden="true" />,
    },
  ];

  return (
    <section id="parlamentar" className="scroll-mt-24 rounded-3xl bg-slate-50/50 px-3 py-6 sm:rounded-[3rem] sm:px-4 sm:py-10">
      <div className="mx-auto mb-8 max-w-3xl border-b border-slate-200 pb-8 text-center sm:mb-10 sm:pb-10">
        <h2 className="mb-4 text-3xl font-black tracking-tighter text-slate-900 sm:text-4xl">
          O Papel do Parlamentar
        </h2>

        <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
          Os deputados e senadores são representantes eleitos pelo povo. Sua
          missão é{" "}
          <strong>
            traduzir demandas da sociedade em leis, fiscalizar o uso do dinheiro
            público
          </strong>{" "}
          e participar das decisões fundamentais do país.
        </p>
      </div>

      <div className="mb-5 w-full pb-2 sm:mb-8">
        <div className="mx-auto grid w-full max-w-xl grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:flex sm:w-fit sm:rounded-full">
          {tabs.map((tab, index) => (
            <button
              key={tab.name}
              type="button"
              onClick={() => setActiveTab(index)}
              aria-pressed={activeTab === index}
              className={`flex min-h-11 items-center justify-center gap-2 rounded-full px-2 py-2.5 text-center text-xs font-bold leading-tight transition-colors sm:px-6 sm:text-sm ${
                activeTab === index
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              <span className="shrink-0">{tab.icon}</span>

              <span className="min-w-0">
                {tab.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 0 ? (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2.5rem] sm:p-8">
            <div className="relative z-10 flex h-full flex-col">
              <div className="mb-5 w-fit rounded-2xl bg-blue-50 p-3 text-blue-600 sm:mb-6">
                <FileText size={28} aria-hidden="true" />
              </div>

              <h3 className="mb-2 text-xl font-bold text-slate-900 sm:text-2xl">
                Função Legislativa
              </h3>

              <p className="mb-6 max-w-md text-sm text-slate-500">
                Propõe, debate e vota as leis federais, emendas à Constituição e
                medidas provisórias.
              </p>

              <ul className="mt-auto space-y-2.5 border-t border-slate-100 pt-5 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-green-500"
                    aria-hidden="true"
                  />
                  <span>Propor novas leis e códigos</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-green-500"
                    aria-hidden="true"
                  />
                  <span>Alterar a Constituição Federal</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-green-500"
                    aria-hidden="true"
                  />
                  <span>Votar tratados internacionais</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <SmallRoleCard
              icon={<Eye className="text-green-600" size={24} aria-hidden="true" />}
              title="Fiscalizadora"
              text="Controla os gastos do Governo e convoca ministros para dar explicações."
            />

            <SmallRoleCard
              icon={
                <Wallet
                  className="text-yellow-600"
                  size={24}
                  aria-hidden="true"
                />
              }
              title="Orçamentária"
              text="Define onde e quanto o Governo deve investir o dinheiro público."
            />

            <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 sm:p-6">
              <div className="shrink-0 rounded-xl bg-red-50 p-3 text-red-600">
                <Scale size={30} aria-hidden="true" />
              </div>

              <div>
                <h4 className="mb-1 font-bold text-slate-900">
                  Função Julgadora e Autorizadora
                </h4>

                <p className="text-xs leading-relaxed text-slate-500">
                  Aprova indicações de autoridades e autoriza a abertura de
                  processos contra o Presidente da República.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-4xl">
          <p className="mx-auto mb-6 max-w-2xl text-center leading-relaxed text-slate-500 sm:mb-8">
            A rotina parlamentar deve ir além do plenário. Conheça os diferentes
            cenários em que parlamentares atuam para transformar propostas em
            realidade.
          </p>

          <div className="relative mx-auto ml-4 max-w-3xl space-y-6 border-l-2 border-dashed border-blue-200 pb-6 sm:ml-6 sm:space-y-8">
            {rotinaParlamentar.map((item) => (
              <div
                key={item.title}
                className="group relative flex items-start gap-3 pl-8 sm:gap-5 sm:pl-12"
              >
                <div className="absolute -left-[11px] top-1.5 h-5 w-5 rounded-full border-4 border-white bg-blue-600 shadow-sm" />

                <div className="shrink-0 rounded-xl border border-blue-100 bg-white p-3 text-blue-600 shadow-sm">
                  {item.icon}
                </div>

                <div>
                  <h4 className="mb-1 text-lg font-bold tracking-tight text-slate-950">
                    {item.title}
                  </h4>

                  <p className="max-w-xl text-sm leading-relaxed text-slate-600">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}