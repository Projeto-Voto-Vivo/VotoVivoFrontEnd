import { Header } from "@/components/layout/HeaderLayout";
import { getDeputadoById, getResumoGastos } from "@/services/deputados";
import { Calendar, Mail, MapPin, Phone, FileText, DollarSign, Vote, Briefcase, ExternalLink } from "lucide-react";
import Link from "next/link";

// Utilitário simples para formatação de moeda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

// Componente simples de Gráfico Donut SVG para evitar dependências pesadas agora
function DonutChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  let accumulatedAngle = 0;

  // Se não houver dados, mostrar círculo cinza
  if (total === 0) return <div className="w-48 h-48 rounded-full border-8 border-slate-100 mx-auto"></div>;

  return (
    <div className="relative w-56 h-56 mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        {data.map((slice, i) => {
            if (slice.value === 0) return null;
            const percentage = slice.value / total;
            const angle = percentage * 360;
            
            // Calculo simples para SVG stroke-dasharray (Circunferência = 2 * PI * R)
            // R=40 (cx=50, cy=50, stroke-width=20) -> C ≈ 251.2
            const radius = 40;
            const circumference = 2 * Math.PI * radius;
            const strokeDasharray = `${(percentage * circumference)} ${circumference}`;
            const strokeDashoffset = -((accumulatedAngle / 360) * circumference);
            
            accumulatedAngle += angle;

            return (
            <circle
                key={i}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth="15"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500 hover:opacity-80"
            />
            );
        })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-800">
            <span className="text-xs font-semibold text-slate-500">Total</span>
            <span className="text-sm font-bold">{new Intl.NumberFormat('pt-BR', { notation: "compact" }).format(total)}</span>
        </div>
    </div>
  );
}

export default async function DeputadoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const deputadoId = Number(id);
  
  const deputado = await getDeputadoById(deputadoId);
  const resumoGastos = await getResumoGastos(deputadoId);

  if (!deputado) {
    return <div className="p-10 text-center">Deputado não encontrado.</div>;
  }

  // Prepara dados para o gráfico
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#6366f1'];
  const chartData = resumoGastos.slice(0, 5).map((g, i) => ({
    name: g.tipoDespesa,
    value: Number(g.total),
    color: colors[i % colors.length]
  }));

  const totalGasto = resumoGastos.reduce((acc, curr) => acc + Number(curr.total), 0);

  return (
    <main className="min-h-screen bg-neutral-50 pb-20">
      <Header />

      {/* Navegação Voltar */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/deputados" className="text-brasil-blue hover:underline text-sm font-medium flex items-center gap-1">
          &larr; Voltar para lista
        </Link>
      </div>

      {/* Cartão Principal */}
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
            
            {/* Foto */}
            <div className="relative shrink-0">
                <div className="w-48 h-60 rounded-xl overflow-hidden shadow-lg border-4 border-white bg-slate-100">
                    <img src={deputado.urlFoto} alt={deputado.nomeParlamentar} className="w-full h-full object-cover" />
                </div>
            </div>

            {/* Informações */}
            <div className="flex-1 w-full">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{deputado.nomeParlamentar}</h1>
                <div className="flex items-center gap-3 text-slate-600 mb-4">
                    <span className="font-bold bg-slate-100 px-3 py-1 rounded text-sm text-slate-800">{deputado.siglaPartido}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>{deputado.uf}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>Deputado Federal</span>
                </div>

                <div className="inline-block bg-brasil-yellow/20 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-8">
                    {deputado.situacao}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    <div className="flex items-start gap-3">
                        <Calendar className="text-brasil-blue shrink-0 mt-1" size={18} />
                        <div>
                            <p className="text-xs text-slate-400 font-medium uppercase">Data de Nascimento</p>
                            <p className="text-slate-700 font-medium">
                                {new Date(deputado.dataNascimento).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <FileText className="text-brasil-blue shrink-0 mt-1" size={18} />
                        <div>
                            <p className="text-xs text-slate-400 font-medium uppercase">Nome Civil</p>
                            <p className="text-slate-700 font-medium uppercase">{deputado.nomeCivil}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Mail className="text-brasil-blue shrink-0 mt-1" size={18} />
                        <div>
                            <p className="text-xs text-slate-400 font-medium uppercase">E-mail Oficial</p>
                            <a href={`mailto:${deputado.email}`} className="text-slate-700 font-medium hover:text-brasil-blue transition-colors">
                                {deputado.email}
                            </a>
                        </div>
                    </div>

                    {deputado.gabinete && (
                        <div className="flex items-start gap-3">
                            <Phone className="text-brasil-blue shrink-0 mt-1" size={18} />
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase">Telefone Gabinete</p>
                                <p className="text-slate-700 font-medium">{deputado.gabinete.telefone}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Redes Sociais */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                    <p className="text-xs text-slate-900 font-bold mb-3">Redes Sociais</p>
                    <div className="flex gap-2 flex-wrap">
                        {deputado.redesSociais.map((rede, idx) => (
                            <a 
                                key={idx} 
                                href={rede.url} 
                                target="_blank"
                                className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 transition-colors flex items-center gap-2"
                            >
                                <ExternalLink size={14} />
                                Rede Social
                            </a>
                        ))}
                    </div>
                </div>
            </div>
          </div>

          {/* Abas de Navegação (Estático para MVP) */}
          <div className="border-t border-slate-200 bg-white px-8">
            <nav className="flex gap-8 overflow-x-auto">
                <button className="py-4 border-b-2 border-brasil-blue text-brasil-blue font-bold text-sm flex items-center gap-2">
                    <Briefcase size={16} /> Visão Geral
                </button>
                <button className="py-4 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-medium text-sm flex items-center gap-2">
                    <DollarSign size={16} /> Despesas
                </button>
                <button className="py-4 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-medium text-sm flex items-center gap-2">
                    <FileText size={16} /> Proposições
                </button>
                <button className="py-4 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-medium text-sm flex items-center gap-2">
                    <Vote size={16} /> Votações
                </button>
            </nav>
          </div>
        </div>

        {/* Conteúdo da Aba Visão Geral */}
        <div className="mt-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Visão Geral do Mandato</h2>
            
            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                    <div className="flex justify-between items-start mb-2">
                        <DollarSign className="text-brasil-blue" size={20} />
                        <span className="text-xs font-semibold text-blue-600 uppercase">Total CEAP</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalGasto)}</p>
                    <p className="text-xs text-slate-500 mt-1">Total gasto acumulado</p>
                </div>

                <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                    <div className="flex justify-between items-start mb-2">
                        <FileText className="text-brasil-green" size={20} />
                        <span className="text-xs font-semibold text-green-600 uppercase">Proposições</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">-</p>
                    <p className="text-xs text-slate-500 mt-1">Autoria e relatoria</p>
                </div>

                <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                    <div className="flex justify-between items-start mb-2">
                        <Vote className="text-purple-600" size={20} />
                        <span className="text-xs font-semibold text-purple-600 uppercase">Presença</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">-</p>
                    <p className="text-xs text-slate-500 mt-1">Sessões de plenário</p>
                </div>

                <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                    <div className="flex justify-between items-start mb-2">
                        <Briefcase className="text-orange-600" size={20} />
                        <span className="text-xs font-semibold text-orange-600 uppercase">Média</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">-</p>
                    <p className="text-xs text-slate-500 mt-1">vs média da casa</p>
                </div>
            </div>

            {/* Gráfico de Gastos */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-8">Distribuição de Gastos por Tipo</h3>
                
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="shrink-0">
                        <DonutChart data={chartData} />
                    </div>
                    
                    <div className="w-full space-y-4">
                        {chartData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors uppercase text-xs">
                                        {item.name}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-bold text-slate-800 block">{formatCurrency(item.value)}</span>
                                    <span className="text-xs text-slate-400">
                                        {((item.value / totalGasto) * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}
