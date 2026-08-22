import Link from "next/link";

const navigationLinks = [
  { href: "/", label: "Início" },
  { href: "/parlamentares", label: "Parlamentares" },
  { href: "/proposicoes", label: "Proposições" },
  { href: "/educacao", label: "Educação" },
];

const infoLinks = [
  { href: "/projeto", label: "Sobre" },
  { href: "/projeto#fontes", label: "Fontes" },
  { href: "/projeto#contato", label: "Contato" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t-4 border-brasil-green bg-white text-gray-700">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 md:py-7">
        <div className="grid gap-6 text-center md:grid-cols-[max-content_max-content_max-content] md:justify-center md:gap-x-16 md:text-left">
          <div>
            <Link
              href="/"
              className="text-xl font-extrabold tracking-tighter text-brasil-blue transition-opacity hover:opacity-90"
              aria-label="Ir para a página inicial do VotoVivo"
            >
              VotoVivo
            </Link>
          </div>

          <nav aria-label="Links principais do rodapé">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-900">
              Navegação
            </h2>

            <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-sm md:justify-start">
              {navigationLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-brasil-blue focus:text-brasil-blue focus:outline-none"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Links institucionais do rodapé">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-900">
              Informações
            </h2>

            <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-sm md:justify-start">
              {infoLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-brasil-blue focus:text-brasil-blue focus:outline-none"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-5 flex justify-center border-t border-gray-200 pt-3 text-center text-[11px] text-gray-500">
          <p>© {currentYear} VotoVivo</p>
        </div>
      </div>
    </footer>
  );
}