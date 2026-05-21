import { Compass, Fingerprint, Orbit, Radar, Target, UserRound } from 'lucide-react';

const timeline = [
  {
    icon: <Radar className="h-5 w-5" />,
    title: 'O projeto',
    description:
      'O Voto Vivo é um site educativo sobre política pensado para reunir conteúdos de forma simples, visual e acessível, ajudando o público a entender melhor o funcionamento da vida pública.',
  },
  {
    icon: <Compass className="h-5 w-5" />,
    title: 'Por que foi desenvolvido',
    description:
      'A proposta nasceu para aproximar as pessoas da política, reduzir a distância entre o cidadão e a informação institucional e incentivar uma leitura mais consciente sobre temas públicos.',
  },
  {
    icon: <Fingerprint className="h-5 w-5" />,
    title: 'Sua importância',
    description:
      'Em um cenário com excesso de informação, o projeto contribui para a formação cidadã ao organizar conteúdos confiáveis e facilitar a compreensão do papel dos representantes e das decisões políticas.',
  },
  {
    icon: <Orbit className="h-5 w-5" />,
    title: 'Quem desenvolveu',
    description:
      'O projeto foi desenvolvido por graduandos em Sistemas de Informação do IFSP Campus São Paulo, no último ano da faculdade: Débora Sousa, Carlos Silva, Thawany Lima, Leandro Fernandes, Pedro Faustino e Vitoria Novaes.',
  },
];

export function ProjetoSection() {
  return (
    <section className="relative overflow-hidden border-t border-slate-200 bg-white py-20 sm:py-24">
      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-brasil-blue/5 to-transparent" aria-hidden="true" />
      <div className="absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-brasil-green/10 blur-3xl" aria-hidden="true" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-brasil-blue/15 bg-brasil-blue/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brasil-blue">
              Projeto de extensão
            </span>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
              Um projeto para aproximar a política das pessoas.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
              Esta seção fecha a página com uma leitura rápida sobre o propósito do Voto Vivo, sua relevância acadêmica e quem esteve por trás do desenvolvimento.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-4xl border border-slate-200 bg-slate-50 p-5 shadow-sm md:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-2xl bg-brasil-blue p-3 text-white shadow-sm">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Linha do tempo</p>
                  <h3 className="text-xl font-bold text-slate-900">Resumo do projeto</h3>
                </div>
              </div>

              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <article
                    key={item.title}
                    className="group rounded-3xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brasil-blue/25 hover:shadow-lg"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="flex items-center gap-4 sm:shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-brasil-blue to-brasil-green text-white shadow-sm">
                          {item.icon}
                        </div>
                        <div className="flex h-12 flex-col justify-center sm:hidden">
                          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-brasil-green">
                            Etapa {index + 1}
                          </span>
                          <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="hidden text-[10px] font-bold uppercase tracking-[0.22em] text-brasil-green sm:inline-flex">
                          Etapa {index + 1}
                        </span>
                        <h4 className="mt-1 hidden text-lg font-bold text-slate-900 sm:block">{item.title}</h4>
                        <p className="mt-2 text-sm leading-7 text-slate-600 md:text-base">{item.description}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="flex flex-col gap-5 rounded-4xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="rounded-3xl bg-linear-to-br from-brasil-blue to-blue-900 p-6 text-white shadow-lg shadow-blue-950/10">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Voto Vivo</p>
                <h3 className="mt-3 text-2xl font-black leading-tight md:text-3xl">
                  Informação clara para formar cidadãos mais conscientes.
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/85 md:text-base">
                  O projeto foi pensado como uma ponte entre educação, tecnologia e participação política, com linguagem acessível e foco em utilidade pública.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Curso</p>
                  <p className="mt-2 text-base font-semibold text-slate-800">Sistemas de Informação</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Instituição</p>
                  <p className="mt-2 text-base font-semibold text-slate-800">IFSP Campus São Paulo</p>
                </div>
              </div>

              <div className="rounded-2xl border border-brasil-green/15 bg-brasil-green/5 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brasil-green">Equipe</p>
                <div className="mt-3 grid gap-2">
                  {['Carlos Silva', 'Débora Sousa', 'Leandro Fernandes', 'Pedro Faustino', 'Thawany Lima', 'Vitoria Novaes'].map((person) => (
                    <div
                      key={person}
                      className="flex items-center gap-3 rounded-xl border border-white/70 bg-white/70 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brasil-green/10 text-brasil-green">
                        <UserRound className="h-4.5 w-4.5" />
                      </span>
                      <span>{person}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}