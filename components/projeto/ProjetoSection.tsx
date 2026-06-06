import {
  Compass,
  Fingerprint,
  Orbit,
  Database,
  FlaskConical,
  Mail,
  UserRound,
  FolderKanban,
} from 'lucide-react';

const teamMembers = [
  'Carlos Silva',
  'Débora Sousa',
  'Leandro Fernandes',
  'Pedro Faustino',
  'Thawany Lima',
  'Vitoria Novaes',
];

export function ProjetoSection() {
  return (
    <section className="relative overflow-hidden border-t border-slate-200 bg-white py-20 sm:py-24">
      <div
        className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-brasil-blue/5 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-brasil-green/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-brasil-blue/15 bg-brasil-blue/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brasil-blue">
              Sobre o projeto
            </span>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
              Um projeto para aproximar a política das pessoas.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
              O Voto Vivo conecta educação, tecnologia e participação cidadã
              para tornar a informação política mais clara, acessível e útil.
            </p>
          </div>

          <div className="grid gap-6">
            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-brasil-blue p-3 text-white shadow-sm">
                  <FolderKanban className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Visão geral
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">
                    O projeto
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-brasil-blue/10 p-2 text-brasil-blue">
                      <Compass className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Por que foi desenvolvido
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
                    A proposta nasceu para aproximar as pessoas da política,
                    reduzir a distância entre o cidadão e a informação
                    institucional e incentivar uma leitura mais consciente sobre
                    temas públicos.
                  </p>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-brasil-green/10 p-2 text-brasil-green">
                      <Fingerprint className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Sua importância
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
                    Em um cenário com excesso de informação, o projeto contribui
                    para a formação cidadã ao organizar conteúdos confiáveis e
                    facilitar a compreensão do papel dos representantes e das
                    decisões políticas.
                  </p>
                </article>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-brasil-green p-3 text-white shadow-sm">
                  <Orbit className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Equipe responsável
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Quem desenvolveu
                  </h2>
                </div>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
                O projeto foi desenvolvido por graduandos em Sistemas de
                Informação do IFSP Campus São Paulo, no último ano da faculdade,
                como uma iniciativa voltada à educação política e à utilidade
                pública.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {teamMembers.map((person) => (
                  <div
                    key={person}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brasil-green/10 text-brasil-green">
                      <UserRound className="h-4.5 w-4.5" />
                    </span>
                    <span className="text-sm font-medium text-slate-700">
                      {person}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Curso
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-800">
                    Sistemas de Informação
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Instituição
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-800">
                    IFSP Campus São Paulo
                  </p>
                </div>
              </div>
            </section>
            

            <section id="fontes" //Fonte dos dados
              className="scroll-mt-32 rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-brasil-blue p-3 text-white">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Transparência
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Fontes dos dados
                  </h2>
                </div>
              </div>

              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
                <p>
                  As informações apresentadas no Voto Vivo são organizadas a partir de bases
                  públicas e dados abertos de órgãos oficiais do Poder Legislativo e da
                  administração pública federal.
                </p>

                <p>
                  Os dados sobre parlamentares, mandatos e atividade legislativa têm como
                  origem os portais de dados abertos da Câmara dos Deputados e do Senado
                  Federal.
                </p>

                <p>
                  As informações relacionadas a emendas e execução financeira utilizam como
                  referência os dados públicos disponibilizados pelo Portal da Transparência
                  do Governo Federal.
                </p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <a
                  href="https://dadosabertos.camara.leg.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-brasil-blue/25 hover:shadow-md"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Câmara dos Deputados
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    Portal de Dados Abertos
                  </p>
                </a>

                <a
                  href="https://www12.senado.leg.br/dados-abertos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-brasil-blue/25 hover:shadow-md"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Senado Federal
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    Dados Abertos do Senado
                  </p>
                </a>

                <a
                  href="https://portaldatransparencia.gov.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-brasil-blue/25 hover:shadow-md"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Governo Federal
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    Portal da Transparência
                  </p>
                </a>
              </div>
            </section>
                
            <section
              id="metodologia"
              className="scroll-mt-32 rounded-3xl border border-slate-200 bg-white p-6 md:p-8"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-brasil-green p-3 text-white">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Organização
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Metodologia
                  </h2>
                </div>
              </div>

              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
                <p>
                  O Voto Vivo utiliza APIs públicas e documentações oficiais para consultar,
                  organizar e apresentar informações legislativas de forma mais clara e
                  acessível ao público.
                </p>

                <p>
                  Os dados parlamentares são obtidos por meio das interfaces de dados
                  abertos da Câmara dos Deputados e do Senado Federal, enquanto parte das
                  informações sobre emendas e execução financeira é consultada em bases
                  públicas do Portal da Transparência.
                </p>

                <p>
                  Após a coleta, os dados são estruturados em uma interface com foco em
                  leitura simplificada, navegação intuitiva e apoio à educação política.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-brasil-green/15 bg-brasil-green/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brasil-green">
                  Documentação técnica utilizada
                </p>

                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  <li>
                    <a
                      href="https://dadosabertos.camara.leg.br/swagger/api.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-brasil-blue hover:underline"
                    >
                      Documentação da API da Câmara dos Deputados
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://legis.senado.leg.br/dadosabertos/api-docs/swagger-ui/index.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-brasil-blue hover:underline"
                    >
                      Documentação da API do Senado Federal
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://portaldatransparencia.gov.br/api-de-dados"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-brasil-blue hover:underline"
                    >
                      API de Dados do Portal da Transparência
                    </a>
                  </li>
                </ul>
              </div>
            </section>

            <section
              id="contato"
              className="scroll-mt-32 rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-brasil-yellow p-3 text-slate-900">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Fale com a equipe
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Contato
                  </h2>
                </div>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
                Para dúvidas, sugestões ou informações sobre o projeto
              </p>

              <div className="mt-6 max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  E-mail
                </p>

                <a
                  href="mailto:contato@votovivo.leg.br"
                  className="mt-2 inline-flex text-sm font-semibold text-brasil-blue hover:underline md:text-base"
                  aria-label="Enviar e-mail para contato arroba votovivo ponto leg ponto br"
                >
                  contatovotovivo@gmail.com
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}