import { ChevronDown } from "lucide-react";

export function EducacaoHero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white py-8 sm:py-12">
      <div className="absolute right-0 top-0 h-48 w-48 translate-x-16 -translate-y-16 rounded-full bg-blue-50 opacity-60 blur-3xl sm:h-64 sm:w-64" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
        <span className="mb-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-600 sm:px-4 sm:py-1.5 sm:text-xs">
          Educação Cidadã
        </span>

        <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-tighter text-slate-900 sm:text-5xl md:text-6xl">
          Aprenda como funciona a <br />

          <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
            política no Brasil
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-500 sm:mt-6 sm:text-lg md:text-xl">
          Entenda o papel dos poderes, o que fazem os parlamentares e como o
          dinheiro público é utilizado.
        </p>
      </div>

      <a
        href="#estado"
        aria-label="Rolar para a seção de destaques"
        className="group absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600 focus:outline-none focus-visible:text-blue-600 md:inline-flex"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/90 shadow-sm transition-transform duration-300 group-hover:translate-y-1 motion-safe:animate-bounce">
          <ChevronDown className="h-5 w-5" />
        </span>
      </a>
    </section>
  );
}