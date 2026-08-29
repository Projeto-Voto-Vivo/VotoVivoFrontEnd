import {
  AlertCircle,
  Building2,
  FileText,
  Gavel,
  Globe,
  Home,
  Landmark,
  Scale,
  Search,
  Settings,
  Users,
} from "lucide-react";

import { SectionHeading } from "../shared/SectionHeading";
import { poderes } from "../data/educacaoData";

export function EstadoSection() {
  return (
          <section id="estado" className="scroll-mt-24 rounded-3xl bg-slate-50/50 px-3 py-6 sm:rounded-[3rem] sm:px-4 sm:py-10">
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
        );
}