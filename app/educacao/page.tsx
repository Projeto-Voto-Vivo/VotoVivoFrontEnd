"use client";
import { useState } from 'react';
import Image from "next/image";
import { 
  Globe, Landmark, Building2, Users, 
  Gavel, Scale, Briefcase, FileText, 
  Eye, Wallet, HelpCircle, ChevronRight,
  User, CheckCircle2, AlertCircle, AlertTriangle, Info, 
  BookOpen, PenTool, Layers, Search, Settings, Home, Clock3, RotateCcw, ChevronDown
} from 'lucide-react';


export default function EducativoPage() {
  const [activeTab, setActiveTab] = useState(0);
  const menuItems = [
    { name: 'O Estado', id: 'estado', icon: <Globe size={16} /> },
    { name: 'Congresso Nacional', id: 'congresso', icon: <Landmark size={16} /> },
    { name: 'Parlamentares', id: 'parlamentar', icon: <Briefcase size={16} /> },
    { name: 'Custos', id: 'custos', icon: <Wallet size={16} /> },
    { name: 'Emendas', id: 'emendas', icon: <FileText size={16} /> },
    { name: 'Como nasce a Lei', id: 'lei', icon: <PenTool size={16} /> },
    { name: 'Sistema Eleitoral', id: 'eleitoral', icon: <Layers size={16} /> },
    { name: 'FAQ', id: 'faq', icon: <HelpCircle size={16} /> },
  ];

  return (
    <>
      <main className="scroll-mt-32 bg-[#F8FAFC] min-h-screen pb-20 selection:bg-blue-100">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-white border-b border-slate-200 py-10 md:py-12">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50" />
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full">
              Educação Cidadã
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight tracking-tighter">
              Aprenda como funciona a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
                política no Brasil.
              </span>
            </h1>
            <p className="mt-6 text-slate-500 text-lg md:text-xl max-w-2xl leading-relaxed">
              Entenda o papel dos poderes, o que fazem os parlamentares e como o dinheiro público é utilizado.
            </p>
          </div>
          <a
            href="#estado"
            className="group absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-brasil-blue focus:outline-none focus-visible:text-brasil-blue md:inline-flex"
            aria-label="Rolar para a seção de destaques"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/90 shadow-sm transition-transform duration-300 group-hover:translate-y-1 motion-safe:animate-bounce">
              <ChevronDown className="h-5 w-5" aria-hidden="true" />
            </span>
          </a>
        </section>

        {/* ESTRUTURA COM SIDEBAR */}
        <div className="max-w-7xl mx-auto px-6 mt-16 lg:grid lg:grid-cols-12 lg:gap-8">
          
          {/* STICKY SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-2">
            <nav className="sticky top-24 space-y-0.5 border-l border-slate-200 ml-2">
              <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-400 mb-4 pl-4">
                Sumário
              </p>
              {menuItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex items-center gap-2.5 px-4 py-1.5 text-[13px] font-medium text-slate-500 hover:text-blue-600 hover:border-l-2 hover:border-blue-600 transition-all -ml-[1px] group"
                >
                  <span className="text-slate-400 group-hover:text-blue-500 transition-colors">
                    {item.icon}
                  </span>
                  {item.name}
                </a>
              ))}
            </nav>
          </aside>

          {/* CONTEÚDO PRINCIPAL */}
          <div className="lg:col-span-10 space-y-24 scroll-smooth">
            
            {/*O ESTADO BRASILEIRO */}
            <section id="estado" className="scroll-mt-24">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">
                  O Estado Brasileiro
                </h2>
                <p className="text-slate-500 max-w-2xl mx-auto">
                 O Brasil é formado por diferentes níveis de governo, que atuam de forma autônoma e organizada pela Constituição.
                </p>
              </div>

              <div className="space-y-12">
                
                {/* 1. Blocos de Funções */}
                <div className="grid gap-4">
                  {[
                    { 
                      title: 'Poder Executivo', 
                      desc: 'Responsável por implementar políticas públicas e executar as leis de forma concreta.', 
                      bg: 'bg-gradient-to-r from-blue-700 to-blue-500', 
                      icon: <Settings size={28} /> 
                    },
                    { 
                      title: 'Poder Legislativo', 
                      desc: 'Atua na criação de normas jurídicas e na fiscalização constante do Executivo.', 
                      bg: 'bg-gradient-to-r from-green-700 to-green-500', 
                      icon: <FileText size={28} /> 
                    },
                    { 
                      title: 'Poder Judiciário', 
                      desc: 'Garante o cumprimento das leis e a proteção dos direitos fundamentais dos cidadãos.', 
                      bg: 'bg-gradient-to-r from-yellow-500 to-yellow-400', 
                      icon: <Scale size={28} /> 
                    }
                  ].map((item, i) => (
                    <div key={i} className={`${item.bg} text-white p-1 rounded-[2rem] shadow-md transition-transform hover:scale-[1.01]`}>
                      <div className="flex flex-col md:flex-row items-center gap-6 px-8 py-4 bg-white/10 rounded-[1.9rem] backdrop-blur-sm">
                        <div className="p-3 bg-white/20 rounded-full border border-white/30 shrink-0">
                          {item.icon}
                        </div>
                        <div className="text-center md:text-left">
                          <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                          <p className="text-sm opacity-90 leading-relaxed font-medium">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 2. Tabela de Esferas */}
                <div className="mt-16 overflow-x-auto pb-4">
                  <h3 className="text-xl font-bold text-slate-700 mb-8 text-center md:text-left flex items-center gap-2">
                    <Search size={20} className="text-blue-500" />
                    Presença dos Poderes por Esfera Administrativa
                  </h3>
                  
                  <div className="min-w-[900px] bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <table className="w-full border-separate border-spacing-2">
                      <thead>
                        <tr className="text-white text-sm font-bold">
                          <th className="p-4 bg-slate-800 rounded-2xl w-[15%] uppercase tracking-widest text-[10px]">Poder</th>
                          <th className="p-4 bg-blue-700 rounded-2xl w-[28%] uppercase tracking-widest text-[10px] shadow-inner">Federal</th>
                          <th className="p-4 bg-green-700 rounded-2xl w-[28%] uppercase tracking-widest text-[10px] shadow-inner">Estadual</th>
                          <th className="p-4 bg-yellow-500 rounded-2xl w-[28%] uppercase tracking-widest text-[10px] shadow-inner">Municipal</th>
                        </tr>
                      </thead>
                      <tbody className="text-white font-bold text-sm">
                        
                        {/* LINHA EXECUTIVO */}
                        <tr>
                          <td className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex flex-col items-center gap-1">
                              <Settings className="text-blue-600" size={24} />
                              <span className="text-blue-900 text-[10px] uppercase font-black">Executivo</span>
                            </div>
                          </td>
                          {/* Federal */}
                          <td className="p-5 bg-blue-600 rounded-2xl shadow-md">
                            <div className="flex items-center gap-4">
                              <Globe size={32} className="opacity-80 shrink-0" />
                              <span className="leading-tight">Presidência</span>
                            </div>
                          </td>
                          {/* Estadual */}
                          <td className="p-5 bg-green-600 rounded-2xl shadow-md">
                            <div className="flex items-center gap-4">
                              <Building2 size={32} className="opacity-80 shrink-0" />
                              <span className="leading-tight">Governador</span>
                            </div>
                          </td>
                          {/* Municipal */}
                          <td className="p-5 bg-yellow-500 rounded-2xl shadow-md">
                            <div className="flex items-center gap-4">
                              <Home size={32} className="opacity-80 shrink-0" />
                              <span className="leading-tight">Prefeito</span>
                            </div>
                          </td>
                        </tr>

                        {/* LINHA LEGISLATIVO */}
                        <tr>
                          <td className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex flex-col items-center gap-1">
                              <FileText className="text-green-600" size={24} />
                              <span className="text-green-900 text-[10px] uppercase font-black">Legislativo</span>
                            </div>
                          </td>
                          {/* Federal */}
                          <td className="p-5 bg-blue-600 rounded-2xl shadow-md">
                            <div className="flex items-center gap-4">
                              <Landmark size={32} className="opacity-80 shrink-0" />
                              <span className="leading-tight text-xs">Congresso <br/> Nacional</span>
                            </div>
                          </td>
                          {/* Estadual */}
                          <td className="p-5 bg-green-600 rounded-2xl shadow-md">
                            <div className="flex items-center gap-4">
                              <Building2 size={32} className="opacity-80 shrink-0" />
                              <span className="leading-tight text-xs">Assembleia <br/> Legislativa</span>
                            </div>
                          </td>
                          {/* Municipal */}
                          <td className="p-5 bg-yellow-500 rounded-2xl shadow-md">
                            <div className="flex items-center gap-4">
                              <Users size={32} className="opacity-80 shrink-0" />
                              <span className="leading-tight text-xs">Câmara <br/> Municipal</span>
                            </div>
                          </td>
                        </tr>

                        {/* LINHA JUDICIÁRIO */}
                        <tr>
                          <td className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex flex-col items-center gap-1">
                              <Scale className="text-yellow-600" size={24} />
                              <span className="text-yellow-900 text-[10px] uppercase font-black">Judiciário</span>
                            </div>
                          </td>
                          {/* Federal */}
                          <td className="p-5 bg-blue-600 rounded-2xl shadow-md">
                            <div className="flex items-center gap-4">
                              <Gavel size={32} className="opacity-80 shrink-0" />
                              <span className="leading-tight">Tribunais <br/> Federais</span>
                            </div>
                          </td>
                          {/* Estadual */}
                          <td className="p-5 bg-green-600 rounded-2xl shadow-md">
                            <div className="flex items-center gap-4">
                              <Scale size={32} className="opacity-80 shrink-0" />
                              <span className="leading-tight">Tribunais <br/> Estaduais</span>
                            </div>
                          </td>
                          {/* Municipal */}
                          <td className="p-5 bg-slate-200 rounded-2xl shadow-inner border-2 border-dashed border-slate-300">
                            <div className="flex flex-col items-center justify-center opacity-40 text-slate-600">
                              <AlertCircle size={24} />
                              <span className="text-[10px] font-black mt-1">NÃO EXISTE</span>
                            </div>
                          </td>
                        </tr>

                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </section>

            {/* SEÇÃO: CONGRESSO NACIONAL */}
            <section id="congresso" className="scroll-mt-24">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">
                  O Congresso Nacional
                </h2>
                <p className="text-slate-500 max-w-2xl mx-auto">
                  O Congresso Nacional exerce o Poder Legislativo da União e funciona no sistema <strong>bicameral</strong>, composto pela Câmara dos Deputados e pelo Senado Federal.
                </p>
              </div>

              <div className="grid lg:grid-cols-12 gap-8 items-center bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                
                {/* COLUNA ESQUERDA: CÂMARA DOS DEPUTADOS */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                      <Users size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 leading-none">Câmara dos Deputados</h3>
                      <span className="text-[12px] text-orange-600 font-bold uppercase tracking-wider">Representação do Povo</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { t: "Composição", d: "513 Deputados Federais eleitos.", icon: <User size={16}/> },
                      { t: "Sistema Eleitoral", d: "Sistema Proporcional (4 anos).", icon: <Layers size={16}/> },
                      { t: "Competência", 
                        d: "• Verificar a aplicação dos recursos públicos\n• Autorizar investigações do Presidente e Ministros", 
                        icon: <Gavel size={16}/>}
                    ].map((item, i) => (
                      <div key={i} className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 group hover:bg-orange-50 transition-colors">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-orange-600">{item.icon}</span>
                          <p className="font-bold text-slate-800 text-sm">{item.t}</p>
                        </div>
                        <p className="text-sm text-slate-500 pl-7 whitespace-pre-line leading-relaxed">
                          {item.d}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-orange-600 text-white p-4 rounded-2xl text-center shadow-lg shadow-orange-200">
                    <p className="text-[15px] uppercase font-bold opacity-80">Mandato</p>
                    <p className="text-2xl font-black italic">4 ANOS</p>
                  </div>
                </div>

                {/* COLUNA CENTRAL: O ÍCONE DO CONGRESSO */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center py-10">
                  <div className="relative w-full aspect-square max-w-[280px] flex items-center justify-center">
                    {/* Background do centro*/}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-blue-500 to-teal-500 rounded-full opacity-10 animate-pulse" />
                    <div className="relative z-10 text-center space-y-4">
                      <div className="bg-slate-900 text-white p-6 rounded-full shadow-2xl border-4 border-white">
                        <Landmark size={60} />
                      </div>
                      <p className="font-black text-slate-900 uppercase tracking-tighter text-xl">Congresso <br/> Nacional</p>
                    </div>
                  </div>
                </div>

                {/* COLUNA DIREITA: SENADO FEDERAL */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-teal-100 text-teal-600 rounded-2xl">
                      <Globe size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 leading-none">Senado Federal</h3>
                      <span className="text-[12px] text-teal-600 font-bold uppercase tracking-wider">Representação dos Estados</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { t: "Composição", d: "81 Senadores (3 por estado/DF).", icon: <Users size={16}/> },
                      { t: "Sistema Eleitoral", d: "Sistema Majoritário (8 anos).", icon: <CheckCircle2 size={16}/> },
                      { 
                        t: "Competência", 
                        d: "• Aprova cargos (STF, PGR)\n• Define limites da dívida\n • Julga o Presidente e autoridades", 
                        icon: <Scale size={16}/> 
                      }
                    ].map((item, i) => (
                      <div key={i} className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100 group hover:bg-teal-50 transition-colors text-left">
                        <div className="flex items-center gap-3 mb-1 justify-start">
                          <span className="text-teal-600">{item.icon}</span>
                          <p className="font-bold text-slate-800 text-sm">{item.t}</p>
                        </div>
                        <p className="text-sm text-slate-500 pl-7 whitespace-pre-line leading-relaxed">
                          {item.d}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-teal-600 text-white p-4 rounded-2xl text-center shadow-lg shadow-teal-200">
                    <p className="text-[15px] uppercase font-bold opacity-80">Mandato</p>
                    <p className="text-2xl font-black italic">8 ANOS</p>
                  </div>
                </div>

                {/* RODAPÉ DO CARD: FUNÇÕES COMPARTILHADAS */}
                <div className="lg:col-span-12 mt-12 pt-8 border-t border-slate-100">
                  <p className="text-center text-[20px] font-black uppercase tracking-[0.2em] text-slate-600 mb-8">Funções Compartilhadas</p>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                      <FileText className="text-blue-500 shrink-0" size={20} />
                      <div>
                        <p className="font-bold text-slate-800 text-sm">Legislação</p>
                        <p className="text-[18px] text-slate-500 leading-tight text-justify">Elaboram leis de competência federal em conjunto.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                      <Search className="text-blue-500 shrink-0" size={20} />
                      <div>
                        <p className="font-bold text-slate-800 text-sm">Fiscalização</p>
                        <p className="text-[18px] text-slate-500 leading-tight">Controlam as contas e atos do Poder Executivo.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                      <Users className="text-blue-500 shrink-0" size={20} />
                      <div>
                        <p className="font-bold text-slate-800 text-sm">Atuação Conjunta</p>
                        <p className="text-[18px] text-slate-500 leading-tight">Votam o orçamento e empossam o Presidente.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* PARLAMENTAR */}
        <section id="parlamentar" className="scroll-mt-24 px-4">
          <div className="max-w-7xl mx-auto">
            
            {/* Cabeçalho da Seção */}
            <div className="mb-12 border-b border-slate-200 pb-12 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">
                O Papel do Parlamentar
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                Os deputados e senadores são os representantes eleitos pelo povo. Sua missão é traduzir as demandas da sociedade em leis, fiscalizar o uso do dinheiro público e participar ativamente das decisões fundamentais do país.
              </p>
            </div>

            {/* Navegação das Abas (Pills Style) */}
            <div className="flex items-center justify-center mb-16">
              <div className="inline-flex gap-2 bg-white p-2 rounded-full border border-slate-200 shadow-sm">
                {[
                  { name: "Poderes & Competências", icon: <Gavel size={18} /> },
                  { name: "Ação e Dia a Dia", icon: <Clock3 size={18} /> }
                ].map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full text-sm font-bold transition-colors whitespace-nowrap ${
                      activeTab === index 
                        ? "bg-blue-600 text-white shadow-lg" 
                        : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    {tab.icon}
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Conteúdo das Abas */}
            <div className="grid grid-cols-1 gap-12">
              
              {/* ABA 0: PODERES & COMPETÊNCIAS - Layout Bento Matrix */}
              {activeTab === 0 && (
                <div className="grid md:grid-cols-2 gap-8 transition-opacity duration-300 opacity-100">
                  
                  {/* Função Legislativa - Destaque Largo */}
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform text-blue-900">
                      <FileText size={120} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-6">
                        <FileText size={28} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Função Legislativa</h3>
                      <p className="text-slate-500 text-sm mb-6 max-w-md">Propõe, debate e vota as leis federais, emendas à Constituição e medidas provisórias.</p>
                      
                      {/* Lista de Ações Específicas */}
                      <ul className="space-y-2.5 border-t border-slate-100 pt-5 mt-auto text-sm text-slate-600">
                        <li className="flex items-start gap-2.5"><CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0"/> Propor novas leis e códigos</li>
                        <li className="flex items-start gap-2.5"><CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0"/> Alterar a Constituição Federal</li>
                        <li className="flex items-start gap-2.5"><CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0"/> Votar tratados internacionais</li>
                      </ul>
                    </div>
                  </div>

                  {/* Outras Funções em Grid Menor */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Função Fiscalizadora */}
                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm group">
                      <Eye className="text-green-600 mb-4" size={24} />
                      <h4 className="font-bold text-slate-900 mb-1">Fiscalizadora</h4>
                      <p className="text-[15px] text-slate-500 leading-tight">Controla os gastos do Governo e convoca ministros para dar explicações.</p>
                    </div>
                    {/* Função Orçamentária */}
                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm group">
                      <Wallet className="text-yellow-600 mb-4" size={24} />
                      <h4 className="font-bold text-slate-900 mb-1">Orçamentária</h4>
                      <p className="text-[15px] text-slate-500 leading-tight">Define onde e quanto o Governo deve investir o dinheiro público.</p>
                    </div>
                    {/* Função Julgadora (Destaque Largo) */}
                    <div className="col-span-2 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
                      <div className="p-3 bg-red-50 text-red-600 rounded-xl shrink-0">
                        <Scale size={32} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Função Julgadora e Autorizadora</h4>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                          Aprova indicações de autoridades (como ministros do STF) e autoriza a abertura de processos contra o Presidente da República.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 1: AÇÃO E DIA A DIA - Layout de Timeline*/}
              {activeTab === 1 && (
                <div className="max-w-4xl mx-auto transition-opacity duration-300 opacity-100">
                  <p className="text-center text-slate-500 mb-12 max-w-lg mx-auto leading-relaxed">
                    A rotina parlamentar deve ir além do plenário. Descubra os diferentes cenários onde eles devem atuam para transformar propostas em realidade.
                  </p>
                  
                  <div className="relative border-l-2 border-dashed border-blue-200 ml-6 space-y-12 pb-10">
                    {[
                      { title: "No Gabinete", desc: "Reuniões com assessoria e recepção de demandas de prefeitos e eleitores.", icon: <User size={18}/> },
                      { title: "Nas Comissões", desc: "Debate técnico e detalhado de projetos de lei e audiências públicas.", icon: <BookOpen size={18}/> },
                      { title: "No Plenário", desc: "Votação formal e decisiva de projetos e grandes temas nacionais.", icon: <Users size={18}/> },
                      { title: "Nas Bases Eleitorais", desc: "Contato direto com a população para ouvir problemas e fiscalizar obras locais.", icon: <Home size={18}/> }
                    ].map((item, i) => (
                      <div key={i} className="relative pl-12 flex items-start gap-5 group">
                        {/* Bullet da Timeline */}
                        <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-sm group-hover:scale-110 transition-transform" />
                        
                        {/* Ícone Contextual */}
                        <div className="flex-shrink-0 p-3 bg-white rounded-xl border border-blue-100 text-blue-600 shadow-sm mt-0.5">
                          {item.icon}
                        </div>
                        
                        {/* Texto */}
                        <div>
                          <h4 className="font-bold text-lg text-slate-950 mb-1 tracking-tight">{item.title}</h4>
                          <p className="text-sm text-slate-600 leading-relaxed max-w-xl">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

          {/* SEÇÃO: CUSTOS */}
          <section id="custos" className="py-16 scroll-mt-24">
            <div className="flex flex-col items-center text-center mb-12">
              <div className="p-3 bg-green-600 rounded-2xl text-white mb-4 shadow-lg shadow-green-200">
                <Wallet size={28} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
                Quanto custa um parlamentar
              </h2>
              <div className="w-12 h-1.5 bg-green-500 rounded-full mt-4" /> {/* Linha decorativa*/}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CARD DESTAQUE: CUSTO TOTAL */}
              <div className="md:col-span-2 bg-gradient-to-br from-slate-800 to-slate-800 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row justify-between items-center border border-slate-700 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                  <Landmark size={120} />
                </div>
                <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
                  <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-500/30">
                    Estimativa Mensal
                  </span>
                  <h3 className="text-2xl font-bold mt-3">Custo Total de Manutenção</h3>
                  <p className="text-slate-400 text-sm max-w-sm mt-1">Valor aproximado para manter toda a estrutura de <strong>um parlamentar</strong> ativa.</p>
                </div>
                <div className="relative z-10 text-center md:text-right">
                  <p className="text-sm text-blue-400 font-bold uppercase mb-1">💸 Investimento Médio</p>
                  <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 leading-none">
                    R$ 200 mil a R$ 500 mil+
                  </h2>
                </div>
              </div>

              {/* SALÁRIO */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-blue-200 transition-all group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <Wallet size={20} />
                  </div>
                  <span className="text-[20px] font-bold text-slate-600 uppercase tracking-widest">Salário</span>
                </div>
                <h4 className="text-3xl font-black text-slate-900 mb-2">R$ 46 mil</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Remuneração base mensal igual para deputados e senadores.
                </p>
              </div>

              {/* EQUIPE GABINETE */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-green-200 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                    <Users size={20} />
                  </div>
                  <span className="text-[20px] font-bold text-slate-600 uppercase tracking-widest">Gabinete</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-8 gap-2">
                  <div>
                    <h4 className="text-2xl font-black text-slate-900 leading-none tracking-tight">Até R$ 118 mil</h4>
                    <span className="text-[15px] font-medium text-slate-400 uppercase">Deputados</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-900 leading-none tracking-tight">~ R$ 497 mil</h4>
                    <span className="text-[15px] font-medium text-slate-400 uppercase">Senadores</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">
                  Pagamento de funcionários e assessores do gabinete.
                </p>
              </div>

              {/* COTA PARLAMENTAR */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-yellow-200 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl">
                    <FileText size={20} />
                  </div>
                  <span className="text-[20px] font-bold text-slate-600 uppercase tracking-widest">Cota (CEAP)</span>
                </div>
                <h4 className="text-3xl font-black text-slate-900 mb-2">R$ 21 mil a R$ 58 mil</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Transporte, escritório, serviços e atividades do mandato.
                </p>
              </div>

              {/* BENEFÍCIOS */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-red-200 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                    <Home size={20} />
                  </div>
                  <span className="text-[20px] font-bold text-slate-600 uppercase tracking-widest">Benefícios</span>
                </div>
                <h4 className="text-3xl font-black text-slate-900 mb-2">Até R$ 5,5 mil</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Inclui auxílio-moradia, saúde e ajuda de custo.
                </p>
              </div>

            </div>
          </section>

          {/* EMENDAS */}
          <section id="emendas" className="py-20 px-4 bg-slate-50/50 rounded-[3rem] scroll-mt-24">
            
            <div className="max-w-6xl mx-auto">
              <div className="mb-12 border-b border-slate-200 pb-12 text-center max-w-3xl mx-auto">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">
                  Emendas Parlamentares
                </h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Recursos do orçamento público que os congressistas devem direcionar para obras e projetos em suas bases eleitorais.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* 1. EMENDAS INDIVIDUAIS - (Largo) */}
                <div className="md:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                    <User size={120} />
                  </div>
                  
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <User size={28} />
                      </div>
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">
                        <CheckCircle2 size={12} /> Obrigatória
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Emendas Individuais</h3>
                    <p className="text-slate-500 text-sm mb-6 max-w-md">
                      Cada parlamentar tem uma cota individual para indicar. Metade desse recurso deve, obrigatoriamente, ir para a <strong>Saúde</strong>.
                    </p>

                    <div className="grid sm:grid-cols-3 gap-4 mt-auto">
                      <div className="sm:col-span-1 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="font-bold text-slate-800 text-sm mb-1">Projeto Específico</p>
                        <p className="text-xs text-slate-500">Exige projeto, aprovação formal e convênio assinado com o estado ou município beneficiado.</p>
                      </div>
                      <div className="sm:col-span-2 p-5 bg-orange-50/50 rounded-2xl border border-orange-200 relative group/pix">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-orange-900 text-sm">Transferência Especial</p>
                          <div className="flex items-center gap-1 text-red-400 bg-red-400/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            <AlertCircle size={12} /> Críticas à Transparência
                          </div>
                        </div>
                        <p className="text-xs text-orange-800"><strong>Emendas Pix:</strong> O dinheiro é enviado diretamente, sem definição detalhada inicial.</p>
                        
                        <div className="flex items-start gap-2 p-3 bg-white/60 rounded-xl border border-orange-100">
                          <AlertCircle size={14} className="text-orange-600 shrink-0 mt-0.5" />
                          <p className="text-[11px] text-orange-900/80 leading-tight font-medium">
                            <strong>Debate Crítico:</strong> Alvo de discussões entre Congresso e STF por baixa transparência e dificuldade de rastreio.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. EMENDAS DE BANCADA - Vertical */}
                <div className="md:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit mb-6">
                    <Users size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Emendas de Bancada</h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                    Decididas em conjunto pelos parlamentares de um mesmo estado para <strong>grandes obras regionais</strong>.
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                    Impacto Regional
                  </div>
                </div>

                {/* 3. EMENDAS DE COMISSÃO - Horizontal Médio */}
                <div className="md:col-span-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shrink-0">
                    <BookOpen size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">Emendas de Comissão</h3>
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-tighter">
                        Não Obrigatória
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm">
                      Criadas por grupos temáticos (Saúde, Educação, etc). O governo tem poder de decisão sobre o pagamento.
                    </p>
                  </div>
                </div>

                {/* 4. EMENDAS DE RELATOR (RP9) - Estilo Claro com Atenção */}
                <div className="md:col-span-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                  
                  {/* Ícone de Fundo Sutil (Opacidade 5%) */}
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                    <PenTool size={120} className="text-amber-900" />
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Cabeçalho do Card (Semelhante à Transferência Especial da imagem) */}
                    <div className="flex justify-between items-start mb-6 gap-3">
                      <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100/50">
                        <PenTool size={28} />
                      </div>
                      
                      {/* Badge de Destaque Crítico (Igual ao 'Críticas à transparência' da imagem) */}
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                        <AlertTriangle size={12} className="text-red-500" />
                        Críticas à Transparência
                      </span>
                    </div>

                    {/* Título e Texto */}
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2 tracking-tight">
                      Emendas de Relator (RP9)
                    </h3>
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                      Originalmente usadas para ajustes orçamentários, tornaram-se controversas e ganharam o apelido de 
                      <strong className="text-amber-800"> "Orçamento Secreto"</strong> pela baixa rastreabilidade e centralização de poder.
                    </p>

                    {/* Box de Nota Crítica (Estilo 'Debate Crítico' da imagem) */}
                    <div className="mt-auto flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <Scale size={18} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-amber-900/80 leading-relaxed">
                          <strong className="text-amber-950 font-bold">Ação do STF:</strong> Parte deste mecanismo foi considerado inconstitucional pelo STF devido à falta de transparência e necessidade de controle republicano sobre as verbas.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* SEÇÃO: A JORNADA DE UMA LEI */}
          <section id="lei" className="py-20 scroll-mt-24 overflow-hidden">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">
                <Scale size={14} /> Processo Legislativo
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">
                Como nasce uma lei?
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto text-sm">
                Uma lei percorre um caminho rigoroso de debates e votações para garantir que atenda aos interesses da sociedade.
              </p>
            </div>

            {/* Container do Fluxo */}
            <div className="relative">
              {/* Linha Conectora (Desktop) */}
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-slate-200 -translate-y-1/2 z-0" />

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
                {[
                  { 
                    step: "1", 
                    title: "Proposta", 
                    desc: "Parlamentares, Governo ou cidadãos sugerem uma ideia.", 
                    icon: <PenTool size={20} />, 
                    color: "bg-blue-600" 
                  },
                  { 
                    step: "2", 
                    title: "Análise", 
                    desc: "Comissões técnicas estudam e dão parecer sobre o projeto.", 
                    icon: <Search size={20} />, 
                    color: "bg-emerald-600" 
                  },
                  { 
                    step: "3", 
                    title: "Votação", 
                    desc: "Os parlamentares votam a favor ou contra no plenário.", 
                    icon: <Users size={20} />, 
                    color: "bg-amber-500" 
                  },
                  { 
                    step: "4", 
                    title: "Revisão", 
                    desc: "A outra casa (Câmara ou Senado) analisa e pode mudar tudo.", 
                    icon: <RotateCcw size={20} />, 
                    color: "bg-indigo-600" 
                  },
                  { 
                    step: "5", 
                    title: "Sanção", 
                    desc: "O Presidente aprova (vira lei) ou veta (volta ao Congresso).", 
                    icon: <CheckCircle2 size={20} />, 
                    color: "bg-rose-600" 
                  }
                ].map((item, i) => (
                  <div key={i} className="group relative">
                    {/* Card */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center h-full group-hover:-translate-y-2">
                      
                      {/* Círculo do Ícone */}
                      <div className={`w-12 h-12 ${item.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-${item.color.split('-')[1]}-200 group-hover:scale-110 transition-transform`}>
                        {item.icon}
                      </div>

                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                        Etapa {item.step}
                      </span>
                      <h4 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {item.desc}
                      </p>

                      {/* Seta indicativa (Mobile/Tablet) */}
                      {i < 4 && (
                        <div className="lg:hidden mt-6 text-slate-300">
                          <ChevronRight size={24} className="rotate-90 md:rotate-0" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info de Rodapé (Sanção vs Veto) */}
            <div className="mt-12 bg-slate-50 border border-slate-200 rounded-[2rem] p-8 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Sancionar</h5>
                    <p className="text-xs text-slate-500">O Presidente aprova o texto e a lei passa a valer oficialmente.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Vetar</h5>
                    <p className="text-xs text-slate-500">O Presidente rejeita partes ou o todo. O Congresso ainda pode derrubar este veto.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

            {/* SEÇÃO: SISTEMA ELEITORAL */}
          <section id="eleitoral" className="mb-24 scroll-mt-24">
            <div className="flex flex-col items-center text-center mb-12">
              <span className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                Entenda as Urnas
              </span>
              
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6">
                Sistema Eleitoral Brasileiro
              </h2>

              <div className="max-w-2xl mx-auto space-y-2">
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                  O sistema eleitoral define como os votos são transformados em representantes eleitos.
                </p>
                <p className="text-base text-slate-500 font-medium italic">
                  No Brasil, existem dois modelos principais: <span className="text-blue-600">majoritário</span> e <span className="text-green-600">proporcional</span>.
                </p>
              </div>
            </div>

            {/* CARDS COMPARATIVOS (Majoritário vs Proporcional) */}
            <div className="grid md:grid-cols-2 gap-8 mb-12 items-stretch">
              
              {/* Majoritário */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-50 text-blue-700 text-sm md:text-base font-bold mb-5 w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  Voto Majoritário
                </div>
                <h3 className="text-2xl font-bold text-slate-950 mb-3">O Mais Votado Vence</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Sistema direto: quem recebe mais votos, ganha.
                  Se ninguém atingir maioria absoluta (mais de 50%), ocorre segundo turno.
                </p>
                
                <div className="space-y-6 mt-auto">
                  <div className="space-y-2.5 border-t border-slate-100 pt-5">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Aplica-se para:</p>
                    <div className="flex flex-wrap gap-2">
                      {['Presidente', 'Governador', 'Prefeito', 'Senador'].map(cargo => (
                        <span key={cargo} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">
                          {cargo}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* IMAGEM MAJORITÁRIO */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                    <Image 
                      src="/imagens/icone-eleitoral-majoritatio.png" 
                      alt="Infográfico Voto Majoritário" 
                      fill 
                      className="object-contain p-4"
                    />
                  </div>
                </div>
              </div>

              {/* Proporcional */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-50 text-green-700 text-sm md:text-base font-bold mb-5 w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Voto Proporcional
                </div>
                <h3 className="text-2xl font-bold text-slate-950 mb-3">Vagas distribuídas por partido</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Não vence só o mais votado. Os votos vão para o partido ou federação. As vagas são distribuídas conforme o total de votos recebidos.
                </p>
                
                <div className="space-y-6 mt-auto">
                  <div className="space-y-2.5 border-t border-slate-100 pt-5">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Aplica-se para:</p>
                    <div className="flex flex-wrap gap-2">
                      {['Deputado Federal', 'Deputado Estadual', 'Vereador'].map(cargo => (
                        <span key={cargo} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">
                          {cargo}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* IMAGEM PROPORCIONAL */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                    <Image 
                      src="/imagens/icone-eleitoral-proporcional.png" 
                      alt="Infográfico Voto Proporcional" 
                      fill 
                      className="object-contain p-4"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* O INFOGRÁFICO PAISAGEM */}
              <div className="bg-slate-50 p-4 sm:p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-inner">
                <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl shadow-slate-200/70 border-4 border-white">
                  <Image
                    src="/imagens/info-sistema-eleitoral.png" 
                    alt="Infográfico detalhado comparando o sistema eleitoral majoritário e proporcional no Brasil"
                    fill 
                    sizes="(max-w-7xl) 100vw, 1200px" 
                    className="object-cover object-center" 
                    priority 
                  />
                </div>
                <p className="text-center text-xs text-slate-400 mt-5 italic">
                  Fonte: .
                </p>
              </div>
          </section>

          {/* SEÇÃO: FAQ */}
          <section id="faq" className="max-w-3xl mx-auto py-20 scroll-mt-24 px-4">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-slate-800">
              <HelpCircle className="text-blue-500" /> Perguntas Comuns
            </h2>
            
            <div className="space-y-4">
              {[
                {
                  q: "Qual a diferença entre voto majoritário e proporcional?",
                  a: "No sistema majoritário, vence quem tem mais votos (como Presidente e Senadores). No proporcional, as vagas são distribuídas entre os partidos conforme o total de votos recebidos pelo grupo político."
                },
                {
                  q: "Por que nem sempre o mais votado é eleito?",
                  a: "Isso ocorre no sistema proporcional (Deputados e Vereadores). Como os votos contam primeiro para o partido, um candidato muito votado pode 'puxar' outros do mesmo partido, enquanto alguém com boa votação individual pode ficar de fora se seu partido não atingir o quociente eleitoral."
                },
                {
                  q: "Quanto custa um parlamentar por mês?",
                  a: "O custo total, incluindo salário (R$ 46 mil), equipe de assessores e cota para despesas, pode ultrapassar R$ 200 mil para deputados e chegar a mais de R$ 500 mil para senadores."
                },
                {
                  q: "O que são emendas parlamentares?",
                  a: "São recursos do orçamento público que os deputados e senadores podem direcionar para obras, hospitais ou projetos específicos em suas regiões ou estados de origem."
                },
                {
                  q: "O que são as “emendas PIX”?",
                  a: "É uma modalidade de transferência especial onde o recurso cai direto na conta da prefeitura ou estado sem um projeto detalhado previamente, o que gera debates sobre a dificuldade de fiscalizar como esse dinheiro é gasto."
                },
                {
                  q: "Quem cria as leis no Brasil?",
                  a: "Principalmente o Poder Legislativo (Congresso Nacional, Assembleias e Câmaras). No entanto, o Presidente e até cidadãos (via projetos de iniciativa popular) também podem propor novas leis."
                },
                {
                  q: "Qual a diferença entre deputado e senador?",
                  a: "O deputado representa o povo e foca em questões sociais e fiscalização. O senador representa o Estado (ou DF) e tem funções como aprovar autoridades e julgar crimes de responsabilidade."
                },
                {
                  q: "O que deve fazer um parlamentar na prática?",
                  a: "Além de votar leis no plenário, eles devem trabalhar em comissões técnicas, fiscalizar como o governo gasta o dinheiro público e atender demandas de suas bases eleitorais para levar investimentos às cidades."
                },
                
              ].map((faq, index) => (
                <details key={index} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-blue-100 transition-colors">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-slate-700 hover:text-blue-600">
                    <span className="pr-4">{faq.q}</span>
                    <ChevronRight size={18} className="group-open:rotate-90 transition-transform shrink-0 text-slate-400" />
                  </summary>
                  <div className="px-6 pb-6 text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          </div>
        </div>
      </main>
    </>
  );
}