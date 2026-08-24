"use client";

import { useState } from "react";
import Image from "next/image";
import {Globe, Landmark, Building2, Users, Gavel, Scale, Briefcase, FileText, Eye, Wallet, HelpCircle, ChevronRight, User, CheckCircle2, AlertCircle, 
  AlertTriangle, BookOpen,PenTool, Layers, Search, Settings, Home, Clock3,RotateCcw, ChevronDown, Menu, X } from "lucide-react";

const REVISAO_CUSTOS = "agosto de 2026";

const FONTES_CUSTOS = {
  salario: {
    rotulo: "Subsídio fixado por decreto legislativo",
    url: "https://www.camara.leg.br/transparencia/remuneracao-e-verbas",
  },
  gabinete: {
    rotulo: "Verba de gabinete — atos das Mesas da Câmara e do Senado",
    url: "https://www12.senado.leg.br/transparencia",
  },
  cota: {
    rotulo: "Cota para o Exercício da Atividade Parlamentar (CEAP/CEAPS)",
    url: "https://www.camara.leg.br/transparencia/gastos-parlamentares",
  },
  beneficios: {
    rotulo: "Auxílio-moradia e demais benefícios — portais de transparência",
    url: "https://www.camara.leg.br/transparencia/remuneracao-e-verbas",
  },
} as const;

type Fonte = (typeof FONTES_CUSTOS)[keyof typeof FONTES_CUSTOS];

function FonteValor({ fonte }: { fonte: Fonte }) {
  return (
    <p className="mt-3 text-[11px] leading-4 text-slate-400">
      Fonte: {" "}
      <a
        href={fonte.url}
        target="_blank"
        rel="noreferrer"
        className="underline decoration-slate-300 underline-offset-2 hover:text-slate-600"
      >
        {fonte.rotulo}
      </a>{" "}
      . Revisado em {REVISAO_CUSTOS}.
    </p>
  );
}

function SectionHeading({
  title,
  children,
  className = "",
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto mb-10 max-w-3xl text-center sm:mb-16 ${className}`}>
      <h2 className="mb-4 text-3xl font-black tracking-tighter text-slate-900 sm:text-4xl">
        {title}
      </h2>
      {children && <div className="text-base leading-relaxed text-slate-500 sm:text-lg">{children}</div>}
    </div>
  );
}

const menuItems = [
  { name: "O Estado", id: "estado", icon: <Globe size={16} /> },
  { name: "Congresso Nacional", id: "congresso", icon: <Landmark size={16} /> },
  { name: "Parlamentares", id: "parlamentar", icon: <Briefcase size={16} /> },
  { name: "Custos", id: "custos", icon: <Wallet size={16} /> },
  { name: "Emendas", id: "emendas", icon: <FileText size={16} /> },
  { name: "Como nasce a Lei", id: "lei", icon: <PenTool size={16} /> },
  { name: "Sistema Eleitoral", id: "eleitoral", icon: <Layers size={16} /> },
  { name: "FAQ", id: "faq", icon: <HelpCircle size={16} /> },
];

const poderes = [
  {
    title: "Poder Executivo",
    desc: "Responsável por implementar políticas públicas e executar as leis de forma concreta.",
    bg: "bg-gradient-to-r from-blue-700 to-blue-500",
    icon: <Settings size={28} />,
  },
  {
    title: "Poder Legislativo",
    desc: "Atua na criação de normas jurídicas e na fiscalização constante do Executivo.",
    bg: "bg-gradient-to-r from-green-700 to-green-500",
    icon: <FileText size={28} />,
  },
  {
    title: "Poder Judiciário",
    desc: "Garante o cumprimento das leis e a proteção dos direitos fundamentais dos cidadãos.",
    bg: "bg-gradient-to-r from-yellow-500 to-yellow-400",
    icon: <Scale size={28} />,
  },
];

const faqs = [
  {
    q: "Qual a diferença entre voto majoritário e proporcional?",
    a: "No sistema majoritário, vence quem tem mais votos, como Presidente e Senadores. No proporcional, as vagas são distribuídas entre os partidos conforme o total de votos recebidos pelo grupo político.",
  },
  {
    q: "Por que nem sempre o mais votado é eleito?",
    a: "Isso ocorre no sistema proporcional, usado para Deputados e Vereadores. Como os votos contam primeiro para o partido, um candidato muito votado pode contribuir para eleger outros candidatos da mesma legenda.",
  },
  {
    q: "Quanto custa um parlamentar por mês?",
    a: "O custo total, incluindo salário, equipe de assessores e cota para despesas, pode ultrapassar R$ 200 mil para deputados e chegar a mais de R$ 500 mil para senadores, conforme a estimativa apresentada nesta página.",
  },
  {
    q: "O que são emendas parlamentares?",
    a: "São recursos do orçamento público que deputados e senadores podem direcionar para obras, hospitais ou projetos específicos em suas regiões ou estados de origem.",
  },
  {
    q: "O que são as emendas PIX?",
    a: "É uma modalidade de transferência especial em que o recurso é enviado diretamente à prefeitura ou ao estado, sem um projeto detalhado previamente, o que gera debates sobre transparência e fiscalização.",
  },
  {
    q: "Quem cria as leis no Brasil?",
    a: "Principalmente o Poder Legislativo. No entanto, o Presidente e cidadãos, por meio de projetos de iniciativa popular, também podem propor novas leis.",
  },
  {
    q: "Qual a diferença entre deputado e senador?",
    a: "O deputado representa o povo e atua em temas sociais, legislativos e de fiscalização. O senador representa o estado ou o Distrito Federal e possui competências específicas, como aprovar autoridades.",
  },
  {
    q: "O que deve fazer um parlamentar na prática?",
    a: "Além de votar leis, deve trabalhar em comissões técnicas, fiscalizar o uso do dinheiro público e atender demandas da sociedade e de suas bases eleitorais.",
  },
];

function MobileSectionNav({
  items,
}: {
  items: {
    name: string;
    id: string;
    icon: React.ReactNode;
  }[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  const navigateToSection = (id: string) => {
    setIsOpen(false);

    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Painel de navegação */}
      <div
        id="mobile-section-menu"
        className={`fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-slate-200 bg-white shadow-[0_-12px_40px_rgba(15,23,42,0.16)] transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        }}
        aria-hidden={!isOpen}
      >
        <div className="mx-auto max-h-[75dvh] w-full max-w-lg overflow-y-auto p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                Navegação
              </p>
              <h2 className="mt-1 text-lg font-black text-slate-900">
                Ir para uma seção
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Fechar navegação"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-600 transition-colors hover:bg-slate-200"
            >
              ×
            </button>
          </div>

          <nav aria-label="Seções da página" className="grid gap-2">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateToSection(item.id)}
                className="flex min-h-12 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  {item.icon}
                </span>

                <span>{item.name}</span>

                <ChevronRight
                  size={17}
                  className="ml-auto shrink-0 text-slate-400"
                  aria-hidden="true"
                />
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Barra fixa inferior */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 lg:hidden"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="mx-auto w-full max-w-lg px-3 pb-3">
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            aria-expanded={isOpen}
            aria-controls="mobile-section-menu"
            className="flex min-h-14 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white/95 px-4 text-left shadow-[0_8px_30px_rgba(15,23,42,0.16)] backdrop-blur-md transition-transform active:scale-[0.99]"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Layers size={18} aria-hidden="true" />
              </span>

              <span>
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Página longa
                </span>
                <span className="block text-sm font-bold text-slate-800">
                  Navegar pelas seções
                </span>
              </span>
            </span>

            <ChevronDown
              size={20}
              className={`text-slate-500 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </>
  );
}

export default function EducativoPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#F8FAFC] pb-28 selection:bg-blue-100 sm:pb-20">
      <MobileSectionNav items={menuItems} />
      <section className="relative overflow-hidden border-b border-slate-200 bg-white py-8 sm:py-12">
        <div className="absolute right-0 top-0 h-48 w-48 translate-x-16 -translate-y-16 rounded-full bg-blue-50 opacity-60 blur-3xl sm:h-64 sm:w-64" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
          <span className="mb-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-600 sm:px-4 sm:py-1.5 sm:text-xs">
            Educação Cidadã
          </span>
          <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-tighter text-slate-900 sm:text-5xl md:text-6xl">
            Aprenda como funciona a <br />
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              política no Brasil.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-500 sm:mt-6 sm:text-lg md:text-xl">
            Entenda o papel dos poderes, o que fazem os parlamentares e como o dinheiro público é utilizado.
          </p>
        </div>
        <a
          href="#estado"
          aria-label="Rolar para a seção de destaques"
          className="group absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600 focus:outline-none focus-visible:text-blue-600 md:inline-flex"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/90 shadow-sm transition-transform duration-300 group-hover:translate-y-1 motion-safe:animate-bounce">
            <ChevronDown className="h-5 w-5" aria-hidden="true" />
          </span>
        </a>
      </section>

      <div className="mx-auto mt-10 w-full max-w-7xl px-4 sm:mt-16 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-8">
        <aside className="hidden lg:col-span-2 lg:block">
          <nav className="sticky top-24 space-y-0.5 border-l border-slate-200 pl-2">
            <p className="mb-4 pl-4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Sumário</p>
            {menuItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="group -ml-[1px] flex items-center gap-2.5 border-l-2 border-transparent px-4 py-2 text-[13px] font-medium text-slate-500 transition-all hover:border-blue-600 hover:text-blue-600"
              >
                <span className="text-slate-400 transition-colors group-hover:text-blue-500">{item.icon}</span>
                {item.name}
              </a>
            ))}
          </nav>
        </aside>

        <div className="w-full min-w-0 space-y-16 scroll-smooth sm:space-y-24 lg:col-span-10">
          <section id="estado" className="scroll-mt-24">
            <SectionHeading title="O Estado Brasileiro">
              O Brasil é formado por diferentes níveis de governo, que atuam de forma autônoma e organizada pela Constituição.
            </SectionHeading>

            <div className="space-y-10 sm:space-y-12">
              <div className="grid gap-4">
                {poderes.map((item) => (
                  <div key={item.title} className={`${item.bg} rounded-3xl p-1 text-white shadow-md transition-transform hover:scale-[1.01] sm:rounded-[2rem]`}>
                    <div className="flex flex-col items-center gap-4 rounded-[1.4rem] bg-white/10 px-4 py-5 text-center backdrop-blur-sm sm:flex-row sm:gap-6 sm:rounded-[1.9rem] sm:px-8 sm:py-4 sm:text-left">
                      <div className="shrink-0 rounded-full border border-white/30 bg-white/20 p-3">{item.icon}</div>
                      <div>
                        <h3 className="mb-1 text-lg font-bold sm:text-xl">{item.title}</h3>
                        <p className="text-xs font-medium leading-relaxed opacity-90 sm:text-sm">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full overflow-x-auto pb-4">
                <h3 className="mb-6 flex items-center justify-center gap-2 text-center text-lg font-bold text-slate-700 sm:mb-8 sm:justify-start sm:text-xl">
                  <Search size={20} className="shrink-0 text-blue-500" />
                  Presença dos Poderes por Esfera Administrativa
                </h3>
                <div className="min-w-[760px] rounded-3xl border border-slate-100 bg-white p-3 shadow-sm sm:rounded-[2.5rem] sm:p-4">
                  <table className="w-full border-separate border-spacing-1 text-sm sm:border-spacing-2">
                    <thead>
                      <tr className="font-bold text-white">
                        {[
                          ["Poder", "bg-slate-800"],
                          ["Federal", "bg-blue-700"],
                          ["Estadual", "bg-green-700"],
                          ["Municipal", "bg-yellow-500"],
                        ].map(([label, color]) => (
                          <th key={label} className={`rounded-xl p-3 text-[10px] uppercase tracking-widest ${color} sm:rounded-2xl sm:p-4`}>
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="font-bold text-white">
                      <tr>
                        <td className="rounded-xl border border-slate-100 bg-slate-50 p-3 sm:rounded-2xl sm:p-4">
                          <div className="flex flex-col items-center gap-1"><Settings className="text-blue-600" size={22} /><span className="text-[10px] uppercase text-blue-900">Executivo</span></div>
                        </td>
                        <td className="rounded-xl bg-blue-600 p-4 shadow-md sm:rounded-2xl sm:p-5"><div className="flex items-center gap-3"><Globe size={28} className="shrink-0 opacity-80" /><span>Presidência</span></div></td>
                        <td className="rounded-xl bg-green-600 p-4 shadow-md sm:rounded-2xl sm:p-5"><div className="flex items-center gap-3"><Building2 size={28} className="shrink-0 opacity-80" /><span>Governador</span></div></td>
                        <td className="rounded-xl bg-yellow-500 p-4 shadow-md sm:rounded-2xl sm:p-5"><div className="flex items-center gap-3"><Home size={28} className="shrink-0 opacity-80" /><span>Prefeito</span></div></td>
                      </tr>
                      <tr>
                        <td className="rounded-xl border border-slate-100 bg-slate-50 p-3 sm:rounded-2xl sm:p-4"><div className="flex flex-col items-center gap-1"><FileText className="text-green-600" size={22} /><span className="text-[10px] uppercase text-green-900">Legislativo</span></div></td>
                        <td className="rounded-xl bg-blue-600 p-4 shadow-md sm:rounded-2xl sm:p-5"><div className="flex items-center gap-3"><Landmark size={28} className="shrink-0 opacity-80" /><span>Congresso<br />Nacional</span></div></td>
                        <td className="rounded-xl bg-green-600 p-4 shadow-md sm:rounded-2xl sm:p-5"><div className="flex items-center gap-3"><Building2 size={28} className="shrink-0 opacity-80" /><span>Assembleia<br />Legislativa</span></div></td>
                        <td className="rounded-xl bg-yellow-500 p-4 shadow-md sm:rounded-2xl sm:p-5"><div className="flex items-center gap-3"><Users size={28} className="shrink-0 opacity-80" /><span>Câmara<br />Municipal</span></div></td>
                      </tr>
                      <tr>
                        <td className="rounded-xl border border-slate-100 bg-slate-50 p-3 sm:rounded-2xl sm:p-4"><div className="flex flex-col items-center gap-1"><Scale className="text-yellow-600" size={22} /><span className="text-[10px] uppercase text-yellow-900">Judiciário</span></div></td>
                        <td className="rounded-xl bg-blue-600 p-4 shadow-md sm:rounded-2xl sm:p-5"><div className="flex items-center gap-3"><Gavel size={28} className="shrink-0 opacity-80" /><span>Tribunais<br />Federais</span></div></td>
                        <td className="rounded-xl bg-green-600 p-4 shadow-md sm:rounded-2xl sm:p-5"><div className="flex items-center gap-3"><Scale size={28} className="shrink-0 opacity-80" /><span>Tribunais<br />Estaduais</span></div></td>
                        <td className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-200 p-4 text-slate-600 shadow-inner sm:rounded-2xl sm:p-5"><div className="flex flex-col items-center justify-center opacity-50"><AlertCircle size={24} /><span className="mt-1 text-[10px] font-black">NÃO EXISTE</span></div></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <section id="congresso" className="scroll-mt-24">
            <SectionHeading title="O Congresso Nacional">
              O Congresso Nacional exerce o Poder Legislativo da União e funciona no sistema <strong>bicameral</strong>, composto pela Câmara dos Deputados e pelo Senado Federal.
            </SectionHeading>

            <div className="grid items-center gap-8 overflow-hidden rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:rounded-[3rem] sm:p-8 md:p-12 lg:grid-cols-12">
              <CongressHouse
                title="Câmara dos Deputados"
                subtitle="Representação do Povo"
                color="orange"
                icon={<Users size={24} />}
                items={[
                  ["Composição", "513 Deputados Federais eleitos.", <User size={16} key="user" />],
                  ["Sistema Eleitoral", "Sistema Proporcional (4 anos).", <Layers size={16} key="layers" />],
                  ["Competência", "• Verificar a aplicação dos recursos públicos\n• Autorizar investigações do Presidente e Ministros", <Gavel size={16} key="gavel" />],
                ]}
                mandate="4 ANOS"
              />

              <div className="flex flex-col items-center justify-center py-4 sm:py-10 lg:col-span-4">
                <div className="relative flex aspect-square w-full max-w-[220px] items-center justify-center sm:max-w-[280px]">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-orange-400 via-blue-500 to-teal-500 opacity-10" />
                  <div className="relative z-10 space-y-3 text-center sm:space-y-4">
                    <div className="rounded-full border-4 border-white bg-slate-900 p-4 text-white shadow-2xl sm:p-6"><Landmark size={44} className="sm:h-[60px] sm:w-[60px]" /></div>
                    <p className="text-lg font-black uppercase tracking-tighter text-slate-900 sm:text-xl">Congresso<br />Nacional</p>
                  </div>
                </div>
              </div>

              <CongressHouse
                title="Senado Federal"
                subtitle="Representação dos Estados"
                color="teal"
                icon={<Globe size={24} />}
                items={[
                  ["Composição", "81 Senadores (3 por estado/DF).", <Users size={16} key="users" />],
                  ["Sistema Eleitoral", "Sistema Majoritário (8 anos).", <CheckCircle2 size={16} key="check" />],
                  ["Competência", "• Aprova cargos (STF, PGR)\n• Define limites da dívida\n• Julga o Presidente e autoridades", <Scale size={16} key="scale" />],
                ]}
                mandate="8 ANOS"
              />

              <div className="mt-2 border-t border-slate-100 pt-8 lg:col-span-12 sm:mt-12">
                <p className="mb-6 text-center text-sm font-black uppercase tracking-[0.16em] text-slate-600 sm:mb-8 sm:text-xl">Funções Compartilhadas</p>
                <div className="grid gap-4 md:grid-cols-3 sm:gap-6">
                  {[
                    [<FileText className="text-blue-500" size={20} key="f" />, "Legislação", "Elaboram leis de competência federal em conjunto."],
                    [<Search className="text-blue-500" size={20} key="s" />, "Fiscalização", "Controlam as contas e atos do Poder Executivo."],
                    [<Users className="text-blue-500" size={20} key="u" />, "Atuação Conjunta", "Votam o orçamento e empossam o Presidente."],
                  ].map(([icon, title, text]) => (
                    <div key={String(title)} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4"><span className="shrink-0">{icon}</span><div><p className="text-sm font-bold text-slate-800">{title}</p><p className="text-sm leading-tight text-slate-500">{text}</p></div></div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="parlamentar" className="scroll-mt-24">
            <div className="mx-auto mb-10 max-w-3xl border-b border-slate-200 pb-10 text-center sm:mb-12 sm:pb-12">
              <h2 className="mb-4 text-3xl font-black tracking-tighter text-slate-900 sm:text-4xl">O Papel do Parlamentar</h2>
              <p className="text-base leading-relaxed text-slate-600 sm:text-lg">Os deputados e senadores são representantes eleitos pelo povo. Sua missão é traduzir demandas da sociedade em leis, fiscalizar o uso do dinheiro público e participar das decisões fundamentais do país.</p>
            </div>

            <div className="mb-10 w-full overflow-x-auto pb-2 sm:mb-16">
              <div className="mx-auto flex min-w-max gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:w-fit sm:rounded-full">
                {[{ name: "Poderes & Competências", icon: <Gavel size={18} /> }, { name: "Ação e Dia a Dia", icon: <Clock3 size={18} /> }].map((tab, index) => (
                  <button key={tab.name} onClick={() => setActiveTab(index)} className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition-colors sm:px-6 sm:text-sm ${activeTab === index ? "bg-blue-600 text-white shadow-lg" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}>
                    {tab.icon}{tab.name}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 0 ? (
              <div className="grid gap-6 md:grid-cols-2 sm:gap-8">
                <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2.5rem] sm:p-8">
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="mb-5 w-fit rounded-2xl bg-blue-50 p-3 text-blue-600 sm:mb-6"><FileText size={28} /></div>
                    <h3 className="mb-2 text-xl font-bold text-slate-900 sm:text-2xl">Função Legislativa</h3>
                    <p className="mb-6 max-w-md text-sm text-slate-500">Propõe, debate e vota as leis federais, emendas à Constituição e medidas provisórias.</p>
                    <ul className="mt-auto space-y-2.5 border-t border-slate-100 pt-5 text-sm text-slate-600">
                      <li className="flex items-start gap-2.5"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-500" />Propor novas leis e códigos</li>
                      <li className="flex items-start gap-2.5"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-500" />Alterar a Constituição Federal</li>
                      <li className="flex items-start gap-2.5"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-500" />Votar tratados internacionais</li>
                    </ul>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  <SmallRoleCard icon={<Eye className="text-green-600" size={24} />} title="Fiscalizadora" text="Controla os gastos do Governo e convoca ministros para dar explicações." />
                  <SmallRoleCard icon={<Wallet className="text-yellow-600" size={24} />} title="Orçamentária" text="Define onde e quanto o Governo deve investir o dinheiro público." />
                  <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 sm:p-6"><div className="shrink-0 rounded-xl bg-red-50 p-3 text-red-600"><Scale size={30} /></div><div><h4 className="mb-1 font-bold text-slate-900">Função Julgadora e Autorizadora</h4><p className="text-xs leading-relaxed text-slate-500">Aprova indicações de autoridades e autoriza a abertura de processos contra o Presidente da República.</p></div></div>
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-4xl">
                <p className="mx-auto mb-10 max-w-lg text-center leading-relaxed text-slate-500 sm:mb-12">A rotina parlamentar deve ir além do plenário. Conheça os diferentes cenários em que parlamentares atuam para transformar propostas em realidade.</p>
                <div className="relative ml-4 space-y-8 border-l-2 border-dashed border-blue-200 pb-8 sm:ml-6 sm:space-y-12">
                  {[
                    ["No Gabinete", "Reuniões com assessoria e recepção de demandas de prefeitos e eleitores.", <User size={18} key="u" />],
                    ["Nas Comissões", "Debate técnico e detalhado de projetos de lei e audiências públicas.", <BookOpen size={18} key="b" />],
                    ["No Plenário", "Votação formal e decisiva de projetos e grandes temas nacionais.", <Users size={18} key="us" />],
                    ["Nas Bases Eleitorais", "Contato direto com a população para ouvir problemas e fiscalizar obras locais.", <Home size={18} key="h" />],
                  ].map(([title, text, icon]) => (
                    <div key={String(title)} className="group relative flex items-start gap-3 pl-8 sm:gap-5 sm:pl-12"><div className="absolute -left-[11px] top-1.5 h-5 w-5 rounded-full border-4 border-white bg-blue-600 shadow-sm" /><div className="shrink-0 rounded-xl border border-blue-100 bg-white p-3 text-blue-600 shadow-sm">{icon}</div><div><h4 className="mb-1 text-lg font-bold tracking-tight text-slate-950">{title}</h4><p className="max-w-xl text-sm leading-relaxed text-slate-600">{text}</p></div></div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section id="custos" className="scroll-mt-24 py-10 sm:py-16">
            <div className="mb-10 flex flex-col items-center text-center sm:mb-12"><div className="mb-4 rounded-2xl bg-green-600 p-3 text-white shadow-lg shadow-green-200"><Wallet size={28} /></div><h2 className="text-3xl font-black tracking-tighter text-slate-900 sm:text-4xl">Quanto custa um parlamentar</h2><div className="mt-4 h-1.5 w-12 rounded-full bg-green-500" /></div>
            <div className="grid gap-5 md:grid-cols-2 sm:gap-6">
              <div className="relative flex flex-col items-center justify-between overflow-hidden rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-white shadow-xl sm:col-span-2 sm:flex-row sm:items-center sm:rounded-[2.5rem] sm:p-8"><div className="relative z-10 text-center sm:text-left"><span className="rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-300">Estimativa Mensal</span><h3 className="mt-3 text-xl font-bold sm:text-2xl">Custo Total de Manutenção</h3><p className="mt-1 max-w-sm text-sm text-slate-400">Valor aproximado para manter toda a estrutura de um parlamentar ativa.</p></div><div className="relative z-10 mt-6 text-center sm:mt-0 sm:text-right"><p className="mb-1 text-sm font-bold uppercase text-blue-400">Investimento Médio</p><h2 className="break-words text-3xl font-black leading-none text-transparent bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text sm:text-5xl">R$ 200 mil a R$ 500 mil+</h2><p className="mt-3 max-w-xs text-[11px] leading-4 text-slate-400 sm:ml-auto">Soma dos itens detalhados abaixo. É uma estimativa, não um valor publicado como total por nenhuma das casas.</p></div></div>
              <CostCard icon={<Wallet size={20} />} tone="blue" title="Salário" value="R$ 46 mil" text="Remuneração base mensal igual para deputados e senadores." source={FONTES_CUSTOS.salario} />
              <CostCard icon={<Users size={20} />} tone="green" title="Gabinete" value="Até R$ 118 mil" extra="~ R$ 497 mil" text="Pagamento de funcionários e assessores do gabinete." source={FONTES_CUSTOS.gabinete} />
              <CostCard icon={<FileText size={20} />} tone="yellow" title="Cota (CEAP)" value="R$ 21 mil a R$ 58 mil" text="Transporte, escritório, serviços e atividades do mandato. O valor varia conforme a distância do estado até Brasília." source={FONTES_CUSTOS.cota} />
              <CostCard icon={<Home size={20} />} tone="red" title="Benefícios" value="Até R$ 5,5 mil" text="Inclui auxílio-moradia, saúde e ajuda de custo." source={FONTES_CUSTOS.beneficios} />
            </div>
            <p className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-xs leading-5 text-slate-500 sm:px-5">Os valores acima são de referência e foram revisados em {REVISAO_CUSTOS}. Reajustes, atos das Mesas e decisões judiciais podem alterar os montantes. Confira sempre os portais de transparência da Câmara e do Senado.</p>
          </section>

          <section id="emendas" className="scroll-mt-24 rounded-3xl bg-slate-50/50 px-3 py-12 sm:rounded-[3rem] sm:px-4 sm:py-20">
            <SectionHeading title="Emendas Parlamentares">Recursos do orçamento público que os congressistas podem direcionar para obras e projetos em suas bases eleitorais.</SectionHeading>
            <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-12 sm:gap-6">
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-8 sm:rounded-[2.5rem] sm:p-8"><div className="mb-5 flex items-start justify-between gap-3 sm:mb-6"><div className="rounded-2xl bg-blue-50 p-3 text-blue-600"><User size={28} /></div><span className="rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-700 sm:text-xs"><CheckCircle2 size={12} className="mr-1 inline" />Obrigatória</span></div><h3 className="mb-2 text-xl font-bold text-slate-900 sm:text-2xl">Emendas Individuais</h3><p className="mb-6 max-w-md text-sm text-slate-500">Cada parlamentar tem uma cota individual para indicar. Metade desse recurso deve, obrigatoriamente, ir para a <strong>Saúde</strong>.</p><div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:col-span-1"><p className="mb-1 text-sm font-bold text-slate-800">Projeto Específico</p><p className="text-xs text-slate-500">Exige projeto, aprovação formal e convênio com o estado ou município beneficiado.</p></div><div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-4 sm:col-span-2"><div className="mb-2 flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-bold text-orange-900">Transferência Especial</p><span className="rounded-full bg-red-400/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-red-500"><AlertCircle size={12} className="mr-1 inline" />Críticas à transparência</span></div><p className="text-xs text-orange-800"><strong>Emendas PIX:</strong> O dinheiro é enviado diretamente, sem definição detalhada inicial.</p><div className="mt-3 flex items-start gap-2 rounded-xl border border-orange-100 bg-white/60 p-3"><AlertCircle size={14} className="mt-0.5 shrink-0 text-orange-600" /><p className="text-[11px] leading-tight text-orange-900/80">Alvo de debates por dificuldades de transparência e rastreio.</p></div></div></div></div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-4 sm:rounded-[2.5rem] sm:p-8"><div className="mb-5 w-fit rounded-2xl bg-indigo-50 p-3 text-indigo-600"><Users size={28} /></div><h3 className="mb-2 text-xl font-bold text-slate-900">Emendas de Bancada</h3><p className="mb-6 text-sm leading-relaxed text-slate-500">Decididas em conjunto pelos parlamentares de um mesmo estado para <strong>grandes obras regionais</strong>.</p><span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase text-slate-600">Impacto regional</span></div>
              <div className="flex flex-col items-start gap-5 rounded-3xl border border-slate-200 bg-white p-5 md:col-span-6 sm:flex-row sm:rounded-[2.5rem] sm:p-8"><div className="shrink-0 rounded-2xl bg-amber-50 p-3 text-amber-600"><BookOpen size={28} /></div><div><div className="mb-2 flex flex-wrap items-center gap-3"><h3 className="text-xl font-bold text-slate-900">Emendas de Comissão</h3><span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700">Não obrigatória</span></div><p className="text-sm text-slate-500">Criadas por grupos temáticos, como Saúde e Educação. O governo tem poder de decisão sobre o pagamento.</p></div></div>
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-6 sm:rounded-[2.5rem] sm:p-8"><div className="mb-5 flex items-start justify-between gap-3"><div className="rounded-2xl bg-amber-50 p-3 text-amber-700"><PenTool size={28} /></div><span className="rounded-full bg-red-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-red-700 sm:px-3 sm:text-[10px]"><AlertTriangle size={12} className="mr-1 inline" />Críticas à transparência</span></div><h3 className="mb-2 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">Emendas de Relator (RP9)</h3><p className="mb-6 text-sm leading-relaxed text-slate-600">Originalmente usadas para ajustes orçamentários, tornaram-se controversas e ganharam o apelido de <strong className="text-amber-800">“Orçamento Secreto”</strong> pela baixa rastreabilidade.</p><div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4"><Scale size={18} className="mt-0.5 shrink-0 text-amber-600" /><p className="text-xs leading-relaxed text-amber-900/80"><strong className="text-amber-950">Ação do STF:</strong> O mecanismo foi considerado inconstitucional em decisões relacionadas à falta de transparência.</p></div></div>
            </div>
          </section>

          <section id="lei" className="scroll-mt-24 overflow-hidden py-12 sm:py-20">
            <SectionHeading title="Como nasce uma lei?"><span className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600"><Scale size={14} />Processo Legislativo</span><br />Uma lei percorre um caminho de debates e votações para garantir que atenda aos interesses da sociedade.</SectionHeading>
            <div className="relative"><div className="absolute left-0 top-1/2 hidden h-0.5 w-full -translate-y-1/2 border-t-2 border-dashed border-slate-200 lg:block" /><div className="relative z-10 grid gap-5 md:grid-cols-3 lg:grid-cols-5 sm:gap-6">{[
              ["1", "Proposta", "Parlamentares, Governo ou cidadãos sugerem uma ideia.", <PenTool size={20} key="p" />, "bg-blue-600"],
              ["2", "Análise", "Comissões técnicas estudam e dão parecer sobre o projeto.", <Search size={20} key="a" />, "bg-emerald-600"],
              ["3", "Votação", "Os parlamentares votam a favor ou contra no plenário.", <Users size={20} key="v" />, "bg-amber-500"],
              ["4", "Revisão", "A outra casa analisa e pode alterar o texto.", <RotateCcw size={20} key="r" />, "bg-indigo-600"],
              ["5", "Sanção", "O Presidente aprova ou veta o projeto.", <CheckCircle2 size={20} key="s" />, "bg-rose-600"],
            ].map(([step, title, desc, icon, color], index) => <div key={String(step)} className="group rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl sm:rounded-[2rem] sm:p-6"><div className={`mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${color} text-white shadow-lg transition-transform group-hover:scale-110`}>{icon}</div><span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Etapa {step}</span><h4 className="mb-3 text-lg font-bold text-slate-900">{title}</h4><p className="text-xs leading-relaxed text-slate-500">{desc}</p>{index < 4 && <ChevronRight size={22} className="mx-auto mt-5 rotate-90 text-slate-300 lg:hidden" />}</div>)}</div></div>
            <div className="mx-auto mt-10 grid max-w-4xl gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:mt-12 sm:grid-cols-2 sm:gap-8 sm:rounded-[2rem] sm:p-8"><InfoNote icon={<CheckCircle2 size={20} />} title="Sancionar" text="O Presidente aprova o texto e a lei passa a valer oficialmente." tone="green" /><InfoNote icon={<AlertCircle size={20} />} title="Vetar" text="O Presidente rejeita partes ou o todo. O Congresso ainda pode derrubar o veto." tone="red" /></div>
          </section>

          <section id="eleitoral" className="mb-12 scroll-mt-24 sm:mb-24">
            <SectionHeading title="Sistema Eleitoral Brasileiro"><p>O sistema eleitoral define como os votos são transformados em representantes eleitos.</p><p className="mt-2 text-sm italic">No Brasil, existem dois modelos principais: <span className="text-blue-600">majoritário</span> e <span className="text-green-600">proporcional</span>.</p></SectionHeading>
            <div className="mb-10 grid items-stretch gap-5 md:grid-cols-2 sm:mb-12 sm:gap-8"><ElectoralCard type="majoritario" title="O Mais Votado Vence" text="Sistema direto: quem recebe mais votos, ganha. Se ninguém atingir maioria absoluta, ocorre segundo turno." cargos={["Presidente", "Governador", "Prefeito", "Senador"]} image="/imagens/icone-eleitoral-majoritatio.png" /><ElectoralCard type="proporcional" title="Vagas distribuídas por partido" text="Os votos vão para o partido ou federação. As vagas são distribuídas conforme o total de votos recebidos." cargos={["Deputado Federal", "Deputado Estadual", "Vereador"]} image="/imagens/icone-eleitoral-proporcional.png" /></div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-3 shadow-inner sm:rounded-[2rem] sm:p-6 md:p-8"><div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border-4 border-white shadow-2xl"><Image src="/imagens/info-sistema-eleitoral.png" alt="Infográfico comparando os sistemas eleitorais majoritário e proporcional no Brasil" fill sizes="(max-width: 640px) 100vw, 1200px" className="object-contain sm:object-cover object-center" priority /></div><p className="mt-4 text-center text-xs italic text-slate-400 sm:mt-5">Infográfico ilustrativo dos sistemas majoritário e proporcional.</p></div>
          </section>

          <section id="faq" className="mx-auto w-full max-w-3xl scroll-mt-24 px-0 py-12 sm:px-4 sm:py-20">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-800 sm:mb-8"><HelpCircle className="shrink-0 text-blue-500" />Perguntas Comuns</h2>
            <div className="space-y-3 sm:space-y-4">{faqs.map((faq) => <details key={faq.q} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-blue-100"><summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-bold text-slate-700 hover:text-blue-600 sm:p-6 sm:text-base"><span>{faq.q}</span><ChevronRight size={18} className="shrink-0 text-slate-400 transition-transform group-open:rotate-90" /></summary><div className="border-t border-slate-50 px-4 pb-5 pt-4 text-sm leading-relaxed text-slate-500 sm:px-6 sm:pb-6">{faq.a}</div></details>)}</div>
          </section>
        </div>
      </div>
    </main>
  );
}

function CongressHouse({ title, subtitle, color, icon, items, mandate }: { title: string; subtitle: string; color: "orange" | "teal"; icon: React.ReactNode; items: [string, string, React.ReactNode][]; mandate: string }) {
  const styles = color === "orange" ? { icon: "bg-orange-100 text-orange-600", box: "bg-orange-50/50 border-orange-100", text: "text-orange-600", mandate: "bg-orange-600 shadow-orange-200" } : { icon: "bg-teal-100 text-teal-600", box: "bg-teal-50/50 border-teal-100", text: "text-teal-600", mandate: "bg-teal-600 shadow-teal-200" };
  return <div className="space-y-5 lg:col-span-4 sm:space-y-6"><div className="flex items-start gap-3"><div className={`shrink-0 rounded-2xl p-3 ${styles.icon}`}>{icon}</div><div><h3 className="text-lg font-bold leading-tight text-slate-900 sm:text-xl">{title}</h3><span className={`text-[10px] font-bold uppercase tracking-wider sm:text-xs ${styles.text}`}>{subtitle}</span></div></div><div className="space-y-3 sm:space-y-4">{items.map(([itemTitle, text, itemIcon]) => <div key={itemTitle} className={`rounded-2xl border p-4 ${styles.box}`}><div className="mb-1 flex items-center gap-3"><span className={styles.text}>{itemIcon}</span><p className="text-sm font-bold text-slate-800">{itemTitle}</p></div><p className="whitespace-pre-line pl-7 text-sm leading-relaxed text-slate-500">{text}</p></div>)}</div><div className={`rounded-2xl p-4 text-center text-white shadow-lg ${styles.mandate}`}><p className="text-[10px] font-bold uppercase opacity-80">Mandato</p><p className="text-2xl font-black italic">{mandate}</p></div></div>;
}

function SmallRoleCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4">{icon}</div><h4 className="mb-1 font-bold text-slate-900">{title}</h4><p className="text-sm leading-tight text-slate-500">{text}</p></div>;
}

function CostCard({ icon, tone, title, value, extra, text, source }: { icon: React.ReactNode; tone: "blue" | "green" | "yellow" | "red"; title: string; value: string; extra?: string; text: string; source: Fonte }) {
  const tones = { blue: "bg-blue-50 text-blue-600", green: "bg-green-50 text-green-600", yellow: "bg-yellow-50 text-yellow-600", red: "bg-red-50 text-red-600" };
  return <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-200 sm:rounded-[2.5rem] sm:p-8"><div className="mb-5 flex items-center gap-3 sm:mb-6"><div className={`rounded-2xl p-3 ${tones[tone]}`}>{icon}</div><span className="text-xs font-bold uppercase tracking-widest text-slate-600 sm:text-sm">{title}</span></div><div className="flex flex-wrap gap-x-6 gap-y-2"><div><h4 className="text-2xl font-black leading-none tracking-tight text-slate-900 sm:text-3xl">{value}</h4>{extra && <span className="text-xs font-medium uppercase text-slate-400">Deputados</span>}</div>{extra && <div><h4 className="text-2xl font-black leading-none tracking-tight text-slate-900 sm:text-3xl">{extra}</h4><span className="text-xs font-medium uppercase text-slate-400">Senadores</span></div>}</div><p className="mt-4 text-xs font-medium leading-relaxed text-slate-500">{text}</p><FonteValor fonte={source} /></div>;
}

function InfoNote({ icon, title, text, tone }: { icon: React.ReactNode; title: string; text: string; tone: "green" | "red" }) {
  return <div className="flex gap-3 sm:gap-4"><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tone === "green" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>{icon}</div><div><h5 className="text-sm font-bold text-slate-900">{title}</h5><p className="text-xs text-slate-500">{text}</p></div></div>;
}

function ElectoralCard({ type, title, text, cargos, image }: { type: "majoritario" | "proporcional"; title: string; text: string; cargos: string[]; image: string }) {
  const proportional = type === "proporcional";
  return <div className="flex flex-col rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-lg sm:rounded-[2.5rem] sm:p-8"><div className={`mb-5 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-bold sm:px-6 sm:py-3 sm:text-sm ${proportional ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}><span className={`h-2 w-2 rounded-full ${proportional ? "bg-green-500" : "bg-blue-500"}`} />{proportional ? "Voto Proporcional" : "Voto Majoritário"}</div><h3 className="mb-3 text-xl font-bold text-slate-950 sm:text-2xl">{title}</h3><p className="mb-6 text-sm leading-relaxed text-slate-600">{text}</p><div className="mt-auto space-y-5"><div className="space-y-2 border-t border-slate-100 pt-5"><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Aplica-se para:</p><div className="flex flex-wrap gap-2">{cargos.map((cargo) => <span key={cargo} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{cargo}</span>)}</div></div><div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50"><Image src={image} alt={proportional ? "Infográfico Voto Proporcional" : "Infográfico Voto Majoritário"} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-contain p-2 sm:p-4" /></div></div></div>;
}